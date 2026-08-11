// ==========================================
// 4. COMPOSITE VIDEO PICTURE-IN-PICTURE (PiP)
// ==========================================

if (typeof window !== 'undefined') {
    let canvasPipInterval = null;
    let canvasPipVideo = null;

    const stopCanvasPip = () => {
        if (canvasPipInterval) {
            clearInterval(canvasPipInterval);
            canvasPipInterval = null;
        }
        if (document.pictureInPictureElement || document.webkitPictureInPictureElement) {
            try {
                const exitFn = document.exitPictureInPicture || document.webkitExitPictureInPicture;
                if (exitFn) exitFn.call(document);
            } catch (e) {}
        }
        if (canvasPipVideo) {
            try {
                canvasPipVideo.pause();
                canvasPipVideo.srcObject = null;
                if (canvasPipVideo.parentNode) {
                    canvasPipVideo.parentNode.removeChild(canvasPipVideo);
                }
            } catch (e) {}
            canvasPipVideo = null;
        }
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'PIP_CLOSED' }, '*');
            }
        } catch (e) {}
    };

    window.addEventListener('message', async (event) => {
        if (!event.data) return;

        // Tắt Grid View / Tile View khi nhận lệnh từ parent
        if (event.data.type === 'TURN_OFF_TILE_VIEW') {
            try {
                const isTileViewOn = document.body.classList.contains('tile-view')
                    || !!document.querySelector('.tile-view')
                    || !!document.querySelector('#videoconference_page.tile-view');
                if (isTileViewOn) {
                    console.log('🎥 [Jitsi] TURN_OFF_TILE_VIEW received -> clicking tileview button...');
                    const tileBtn = document.querySelector('[aria-label="Toggle tile view"], [data-testid="toolbar_button_tileview"], #tileviewbutton');
                    if (tileBtn) {
                        tileBtn.click();
                    } else if (window.APP && window.APP.store) {
                        window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled: false });
                    }
                }
            } catch (e) {}
            return;
        }

        if (event.data.type === 'TRIGGER_COMPOSITE_VIDEO_PIP') {
            console.log('🎥 [Jitsi] Received TRIGGER_COMPOSITE_VIDEO_PIP message');

            if (document.pictureInPictureElement || canvasPipInterval) {
                console.log('🎥 [Jitsi] PiP active, toggling off...');
                stopCanvasPip();
                return;
            }

            try {
                // Create off-screen canvas (180x320 - Vertical Portrait PiP style)
                const canvas = document.createElement('canvas');
                canvas.width = 180;
                canvas.height = 320;
                const ctx = canvas.getContext('2d');

                // Create hidden video element to feed canvas stream
                const videoEl = document.createElement('video');
                videoEl.autoplay = true;
                videoEl.muted = true;
                videoEl.playsInline = true;
                videoEl.style.position = 'fixed';
                videoEl.style.top = '0px';
                videoEl.style.left = '0px';
                videoEl.style.width = '1px';
                videoEl.style.height = '1px';
                videoEl.style.opacity = '0.01';
                videoEl.style.pointerEvents = 'none';
                videoEl.style.zIndex = '-9999';
                document.body.appendChild(videoEl);
                canvasPipVideo = videoEl;

                // Function to draw filmstrip participant tiles onto canvas
                const renderFrame = () => {
                    if (!ctx) return;
                    ctx.fillStyle = '#111827';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    const participantTiles = Array.from(
                        document.querySelectorAll('#localVideoContainer, #remoteVideos .videocontainer, .filmstrip .videocontainer')
                    ).filter(el => {
                        if (!el) return false;
                        if (el.id === 'largeVideoContainer' || el.closest('#largeVideoContainer') || el.closest('#largeVideoWrapper')) return false;

                        const elId = String(el.id || '').toLowerCase();
                        const participantId = String(el.getAttribute('data-participant-id') || '').toLowerCase();
                        const displayNameEl = el.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                        const displayName = String(displayNameEl ? displayNameEl.textContent : '').toLowerCase();

                        // Exclude Whiteboard
                        if (
                            elId.includes('whiteboard') ||
                            participantId.includes('whiteboard') ||
                            displayName.includes('whiteboard') ||
                            displayName.includes('bảng trắng') ||
                            !!el.querySelector('.excalidraw') ||
                            !!el.querySelector('#whiteboard-wrapper') ||
                            !!el.querySelector('.whiteboard-container')
                        ) {
                            return false;
                        }

                        return true;
                    });

                    const isScreenShareTile = (el) => {
                        const elId = String(el.id || '').toLowerCase();
                        const participantId = String(el.getAttribute('data-participant-id') || '').toLowerCase();
                        const displayNameEl = el.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                        const displayName = String(displayNameEl ? displayNameEl.textContent : '').toLowerCase();
                        const dataVideoType = String(el.getAttribute('data-video-type') || el.getAttribute('data-track-type') || '').toLowerCase();

                        if (
                            elId.includes('desktop') || elId.includes('screenshare') ||
                            participantId.includes('desktop') || participantId.includes('screenshare') ||
                            displayName.includes('desktop') || displayName.includes('screen') || displayName.includes('màn hình') ||
                            dataVideoType === 'desktop' || dataVideoType === 'screenshare'
                        ) {
                            return true;
                        }

                        const video = el.querySelector('video');
                        if (video) {
                            const videoId = String(video.id || '').toLowerCase();
                            if (videoId.includes('desktop') || videoId.includes('screenshare')) return true;
                            try {
                                const stream = video.srcObject;
                                if (stream && stream.getVideoTracks) {
                                    const tracks = stream.getVideoTracks();
                                    for (let t of tracks) {
                                        const label = String(t.label || '').toLowerCase();
                                        if (label.includes('screen') || label.includes('window') || label.includes('display') || label.includes('desktop') || label.includes('contents') || label.includes('capture')) {
                                            return true;
                                        }
                                    }
                                }
                            } catch (e) {}
                        }

                        return false;
                    };

                    if (participantTiles.length === 0) {
                        canvas.width = 480;
                        canvas.height = 270;
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 36px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('Đang chờ camera...', canvas.width / 2, canvas.height / 2);
                        return;
                    }

                    // 3x Supersampling for crystal-clear HD text and sharp screen share details
                    const scale = 3;
                    const displayWidth = 160;
                    const itemWidth = displayWidth * scale;

                    let totalHeight = 0;
                    const tileHeights = participantTiles.map(tile => {
                        const isShare = isScreenShareTile(tile);
                        if (isShare) {
                            let videoElTile = tile.querySelector('video');
                            const largeVideo = document.querySelector('#largeVideo, #largeVideoElementsContainer video');
                            if (largeVideo && largeVideo.readyState >= 2 && largeVideo.videoWidth > 400) {
                                videoElTile = largeVideo;
                            }
                            let ratio = 16 / 9;
                            if (videoElTile && videoElTile.videoWidth && videoElTile.videoHeight) {
                                ratio = videoElTile.videoWidth / videoElTile.videoHeight;
                            }
                            const h = Math.round(itemWidth / ratio);
                            totalHeight += h;
                            return { isShare, height: h };
                        } else {
                            // Camera / Avatar tile: SQUARE 1:1 aspect ratio
                            const h = itemWidth;
                            totalHeight += h;
                            return { isShare, height: h };
                        }
                    });

                    canvas.width = itemWidth;
                    canvas.height = totalHeight > 0 ? totalHeight : 960;

                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    ctx.fillStyle = '#111827';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    let currentY = 0;
                    participantTiles.forEach((tile, index) => {
                        const tileInfo = tileHeights[index];
                        const itemHeight = tileInfo.height;
                        const x = 0;
                        const y = currentY;
                        currentY += itemHeight;

                        ctx.fillStyle = '#1f2937';
                        ctx.fillRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);

                        const isAvatarOnly = tile.classList.contains('display-avatar-only');
                        let videoElTile = tile.querySelector('video');

                        if (tileInfo.isShare) {
                            const largeVideo = document.querySelector('#largeVideo, #largeVideoElementsContainer video');
                            if (largeVideo && largeVideo.readyState >= 2 && largeVideo.videoWidth > 400) {
                                videoElTile = largeVideo;
                            }
                        }

                        let isVideoPlaying = false;
                        if (!isAvatarOnly && videoElTile && videoElTile.readyState >= 2 && !videoElTile.paused && !videoElTile.ended) {
                            try {
                                const streamTile = videoElTile.srcObject;
                                if (streamTile && streamTile.getVideoTracks) {
                                    const videoTracks = streamTile.getVideoTracks();
                                    if (videoTracks.length > 0 && videoTracks.some(t => t.enabled && t.readyState === 'live' && !t.muted)) {
                                        isVideoPlaying = true;
                                    }
                                } else {
                                    isVideoPlaying = true;
                                }
                            } catch (e) {
                                isVideoPlaying = false;
                            }
                        }

                        if (isVideoPlaying && videoElTile) {
                            try {
                                if (tileInfo.isShare) {
                                    // Screen share: draw from HD source video without distortion
                                    ctx.drawImage(videoElTile, x + 4, y + 4, itemWidth - 8, itemHeight - 8);
                                } else {
                                    // Camera video: center crop to fit square 1:1 box without distortion
                                    const vw = videoElTile.videoWidth || 1;
                                    const vh = videoElTile.videoHeight || 1;
                                    let sx = 0, sy = 0, sw = vw, sh = vh;
                                    if (vw > vh) {
                                        sw = vh;
                                        sx = (vw - vh) / 2;
                                    } else if (vh > vw) {
                                        sh = vw;
                                        sy = (vh - vw) / 2;
                                    }
                                    ctx.drawImage(videoElTile, sx, sy, sw, sh, x + 4, y + 4, itemWidth - 8, itemHeight - 8);
                                }
                            } catch (e) {}
                        } else {
                            const nameEl = tile.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                            const name = nameEl ? (nameEl.textContent || '').trim() : `Thành viên ${index + 1}`;

                            const radius = Math.min(itemWidth * 0.22, itemHeight * 0.3, 144);
                            const centerX = x + itemWidth / 2;
                            const centerY = y + itemHeight / 2 - 30;

                            let hash = 0;
                            for (let i = 0; i < name.length; i++) {
                                hash = name.charCodeAt(i) + ((hash << 5) - hash);
                            }
                            const color = `hsl(${Math.abs(hash) % 360}, 65%, 45%)`;
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                            ctx.fill();

                            const initial = name ? name.charAt(0).toUpperCase() : '?';
                            ctx.fillStyle = '#ffffff';
                            ctx.font = `bold ${Math.round(radius * 0.9)}px sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(initial, centerX, centerY);

                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 36px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'alphabetic';
                            ctx.fillText(name.length > 18 ? name.substring(0, 17) + '…' : name, x + itemWidth / 2, y + itemHeight - 48);
                        }

                        if (isVideoPlaying) {
                            const nameEl = tile.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                            const name = nameEl ? (nameEl.textContent || '').trim() : '';

                            if (name) {
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                                ctx.fillRect(x + 16, y + itemHeight - 72, Math.min(itemWidth - 32, 380), 54);
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '32px sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'alphabetic';
                                ctx.fillText(name.length > 15 ? name.substring(0, 14) + '…' : name, x + 32, y + itemHeight - 34);
                            }
                        }
                    });
                };

                renderFrame();
                canvasPipInterval = setInterval(renderFrame, 40);

                const stream = canvas.captureStream(25);
                videoEl.srcObject = stream;

                const triggerPip = () => {
                    videoEl.play().catch(() => {});
                    console.log('🎥 [Jitsi] Requesting PictureInPicture...');
                    videoEl.requestPictureInPicture()
                        .then(() => {
                            console.log('🎥 [Jitsi] PictureInPicture active!');
                            try {
                                if (window.parent && window.parent !== window) {
                                    window.parent.postMessage({ type: 'PIP_OPENED' }, '*');
                                }
                            } catch (e) {}
                        })
                        .catch((err) => {
                            console.error('[Jitsi] Composite Video PiP Error:', err);
                            stopCanvasPip();
                        });
                };

                if (videoEl.readyState >= 1) {
                    triggerPip();
                } else {
                    videoEl.onloadedmetadata = () => {
                        triggerPip();
                    };
                }

                videoEl.addEventListener('leavepictureinpicture', () => {
                    console.log('🎥 [Jitsi] Left PictureInPicture');
                    stopCanvasPip();
                });
            } catch (err) {
                console.error('[Jitsi] Composite Video PiP Error:', err);
                stopCanvasPip();
            }
        }
    });

    // Inject Picture-in-Picture (PiP1) button at Top-Right of Filmstrip (Moderator only - not student)
    setInterval(() => {
        try {
            const isStudent = typeof window.checkIfStudent === 'function' ? window.checkIfStudent() : false;
            const existingBtn = document.getElementById('custom-filmstrip-pip-btn');

            if (isStudent) {
                if (existingBtn && existingBtn.parentNode) {
                    existingBtn.parentNode.removeChild(existingBtn);
                }
                return;
            }

            if (existingBtn) return;

            const filmstripContainer = document.querySelector('#filmstripLocalVideo, .filmstrip, #remoteVideos, .filmstrip__videos, #videoconference_page');
            if (!filmstripContainer) return;

            const btn = document.createElement('div');
            btn.id = 'custom-filmstrip-pip-btn';
            btn.title = 'Mở Cửa sổ Nổi Meeting (Picture-in-Picture)';
            btn.style.cssText = `
                position: absolute !important;
                top: 14px !important;
                left: 18px !important;
                right: auto !important;
                width: 34px !important;
                height: 34px !important;
                border-radius: 8px !important;
                background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
                color: #ffffff !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
                cursor: pointer !important;
                z-index: 999999 !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                transition: transform 0.15s ease, box-shadow 0.15s ease !important;
            `;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M14 10l5 5M19 10v5h-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.08)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎥 [Jitsi Filmstrip] PiP button clicked');
                window.postMessage({ type: 'TRIGGER_COMPOSITE_VIDEO_PIP' }, '*');
            });

            const targetParent = document.querySelector('.filmstrip') || document.querySelector('#filmstripLocalVideo') || filmstripContainer;
            const computedPos = window.getComputedStyle(targetParent).position;
            if (computedPos === 'static') {
                targetParent.style.position = 'relative';
            }

            targetParent.appendChild(btn);
        } catch (e) {
            console.error('Error injecting filmstrip PiP button:', e);
        }
    }, 1000);
}
