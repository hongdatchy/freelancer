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
                // Create off-screen canvas (320x180 - Landscape PiP style)
                const canvas = document.createElement('canvas');
                canvas.width = 320;
                canvas.height = 180;
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
                        return true;
                    });

                    if (participantTiles.length === 0) {
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 14px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('Đang chờ dải camera...', canvas.width / 2, canvas.height / 2);
                        return;
                    }

                    const count = participantTiles.length;
                    const cols = count;
                    const rows = 1;

                    const itemWidth = canvas.width / cols;
                    const itemHeight = canvas.height / rows;

                    participantTiles.forEach((tile, index) => {
                        const col = index % cols;
                        const row = Math.floor(index / cols);
                        const x = col * itemWidth;
                        const y = row * itemHeight;

                        ctx.fillStyle = '#1f2937';
                        ctx.fillRect(x + 2, y + 2, itemWidth - 4, itemHeight - 4);

                        const isAvatarOnly = tile.classList.contains('display-avatar-only');
                        const videoElTile = tile.querySelector('video');

                        let isVideoPlaying = false;
                        if (!isAvatarOnly && videoElTile && videoElTile.id !== 'largeVideo' && videoElTile.readyState >= 2 && !videoElTile.paused && !videoElTile.ended) {
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
                                ctx.drawImage(videoElTile, x + 2, y + 2, itemWidth - 4, itemHeight - 4);
                            } catch (e) {}
                        } else {
                            const nameEl = tile.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                            const name = nameEl ? (nameEl.textContent || '').trim() : `Thành viên ${index + 1}`;

                            const radius = Math.min(itemWidth * 0.22, itemHeight * 0.3, 52);
                            const centerX = x + itemWidth / 2;
                            const centerY = y + itemHeight / 2 - 12;

                            // Draw initial letter (origin-clean)
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
                            ctx.font = 'bold 12px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'alphabetic';
                            ctx.fillText(name.length > 18 ? name.substring(0, 17) + '…' : name, x + itemWidth / 2, y + itemHeight - 20);
                        }

                        if (isVideoPlaying) {
                            const nameEl = tile.querySelector('.displayname, #localDisplayName, [id$="DisplayName"]');
                            const name = nameEl ? (nameEl.textContent || '').trim() : '';

                            if (name) {
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                                ctx.fillRect(x + 6, y + itemHeight - 28, Math.min(itemWidth - 12, 140), 22);
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '12px sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'alphabetic';
                                ctx.fillText(name.length > 15 ? name.substring(0, 14) + '…' : name, x + 12, y + itemHeight - 13);
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
}
