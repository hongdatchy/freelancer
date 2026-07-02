const fs = require('fs');
const path = 'd:\\freelancer\\vietsure_english\\jitsi-demo\\custom-config.js';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const upperHalf = lines.slice(0, 208).join('\n');
const newBottomHalf = `// HACK: Monitor screen sharing and hijack Canvas drawImage to swap the static placeholder with the live screenshare stream
if (typeof window !== 'undefined') {
    let videoBg = null;
    let hasCenteredCamera = 0;
    
    // Reliably detect if a screenshare track is active using Jitsi's Redux state
    window.isScreenSharingActiveFunc = function() {
        if (window.APP && window.APP.store) {
            const tracks = window.APP.store.getState()['features/base/tracks'];
            if (Array.isArray(tracks)) {
                return tracks.some(t => t.videoType === 'desktop');
            }
        }
        return false;
    };

    // Helper to create a rendering video tag inside the whiteboard container to prevent browser suspensions
    function getOrCreateVideoBuffer() {
        const container = document.querySelector('.excalidraw-container');
        if (!container) return null;

        let video = container.querySelector('.whiteboard-custom-video-bg-buffer');
        if (!video) {
            video = document.createElement('video');
            video.className = 'whiteboard-custom-video-bg-buffer';
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true;
            video.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.001; pointer-events: none; z-index: -9999;";
            container.appendChild(video);
        }
        return video;
    }

    // Track active local or remote desktop/screenshare track in Jitsi Redux State (Stashed logic)
    setInterval(() => {
        try {
            videoBg = getOrCreateVideoBuffer();
            if (!videoBg) return;

            let desktopTrack = null;
            if (window.APP && window.APP.store) {
                const tracks = window.APP.store.getState()['features/base/tracks'] || [];
                const trackObj = tracks.find(t => {
                    if (t.videoType === 'desktop') return true;
                    if (t.jitsiTrack && t.jitsiTrack.videoType === 'desktop') return true;
                    return false;
                });
                if (trackObj) {
                    desktopTrack = trackObj.track || (trackObj.jitsiTrack ? trackObj.jitsiTrack.track : null);
                }
            }

            if (desktopTrack) {
                const currentStream = videoBg.srcObject;
                const currentTrack = currentStream ? currentStream.getVideoTracks()[0] : null;

                if (!currentTrack || currentTrack.id !== desktopTrack.id) {
                    console.log("🖥️ Live screen share stream detected! Buffering stream inside whiteboard layout.");
                    const newStream = new MediaStream([desktopTrack]);
                    videoBg.srcObject = newStream;
                    videoBg.play().catch(err => console.error("Error playing video:", err));
                }
            } else {
                const jitsiVideo = document.getElementById('largeVideo');
                const bufferVideo = getOrCreateVideoBuffer();
                
                if (jitsiVideo && jitsiVideo.srcObject && bufferVideo.srcObject !== jitsiVideo.srcObject) {
                    bufferVideo.srcObject = jitsiVideo.srcObject;
                    bufferVideo.play().catch(e => console.error("Buffer play error:", e));
                }
                videoBg = bufferVideo;
            }
        } catch (err) {
            console.error("❌ Error in screenshare monitor loop:", err);
        }
    }, 1000);

    // Hijack drawImage: when Excalidraw is drawing our background image, draw the live screenshare stream instead!
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, x, y, w, h) {
        if (img && img.src && (img.src === window.currentBgImageUrl || img.src.includes('course1') || img.src.includes('banner') || img.src.includes('data:image/'))) {
            const isSharing = typeof window.isScreenSharingActiveFunc === 'function' && window.isScreenSharingActiveFunc();
            if (isSharing && videoBg && videoBg.srcObject) {
                const sw = videoBg.videoWidth || videoBg.width || 1280;
                const sh = videoBg.videoHeight || videoBg.height || 720;
                
                let dx, dy, dw, dh;
                if (arguments.length === 5) {
                    dx = arguments[1];
                    dy = arguments[2];
                    dw = arguments[3];
                    dh = arguments[4];
                } else if (arguments.length === 9) {
                    dx = arguments[5];
                    dy = arguments[6];
                    dw = arguments[7];
                    dh = arguments[8];
                }

                if (dw && dh && sw && sh) {
                    const srcRatio = sw / sh;
                    const destRatio = dw / dh;
                    let newDx = dx, newDy = dy, newDw = dw, newDh = dh;

                    if (srcRatio > destRatio) {
                        newDw = dw;
                        newDh = dw / srcRatio;
                        newDy = dy + (dh - newDh) / 2;
                    } else {
                        newDh = dh;
                        newDw = dh * srcRatio;
                        newDx = dx + (dw - newDw) / 2;
                    }
                    return originalDrawImage.call(this, videoBg, 0, 0, sw, sh, newDx, newDy, newDw, newDh);
                }
            } else {
                if (img.src.includes('data:image/svg+xml')) {
                    return;
                }
            }
        }
        return originalDrawImage.apply(this, arguments);
    };

    // Force Excalidraw canvas refresh at ~24fps ONLY when screensharing is active to play the live video background smoothly
    setInterval(() => {
        const isSharing = typeof window.isScreenSharingActiveFunc === 'function' && window.isScreenSharingActiveFunc();
        
        if (isSharing && videoBg && videoBg.srcObject) {
            const api = findExcalidrawAPI();
            if (api) {
                const getElements = api.getSceneElements || api.getElements;
                const elements = getElements ? (getElements.call(api) || []) : [];
                const bgEl = elements.find(el => el && el.id === 'excalidraw-custom-bg-element');
                if (bgEl) {
                    let changed = false;
                    
                    if (bgEl.width < 10) {
                        bgEl.width = 1280;
                        bgEl.height = 720;
                        bgEl.x = -640;
                        bgEl.y = -360;
                        changed = true;
                    }
                    
                    if (bgEl.opacity !== 100) { bgEl.opacity = 100; changed = true; }

                    bgEl.version = Date.now();
                    bgEl.versionNonce = Math.floor(Math.random() * 100000);
                    
                    let nextAppState;
                    if (hasCenteredCamera === 0 || Date.now() - hasCenteredCamera < 1000) {
                        const container = document.querySelector('.excalidraw-container');
                        const width = (container && container.clientWidth > 0) ? container.clientWidth : window.innerWidth;
                        const height = (container && container.clientHeight > 0) ? container.clientHeight : window.innerHeight;
                        
                        if (width > 0 && height > 0) {
                            if (hasCenteredCamera === 0) {
                                hasCenteredCamera = Date.now();
                                if (!window.hasAddedResizeListener) {
                                    window.hasAddedResizeListener = true;
                                    window.addEventListener('resize', () => {
                                        if (videoBg && videoBg.srcObject) {
                                            hasCenteredCamera = Date.now();
                                        }
                                    });
                                }
                            }
                            
                            nextAppState = {
                                scrollX: width / 2,
                                scrollY: height / 2,
                                zoom: { value: 1 }
                            };
                        }
                    }

                    if (nextAppState) {
                        api.updateScene({ elements: [...elements], appState: nextAppState });
                    } else {
                        api.updateScene({ elements: [...elements] });
                    }
                }
            }
        } else {
            hasCenteredCamera = 0;
            const api = findExcalidrawAPI();
            if (api) {
                const getElements = api.getSceneElements || api.getElements;
                const elements = getElements ? (getElements.call(api) || []) : [];
                const bgEl = elements.find(el => el && el.id === 'excalidraw-custom-bg-element');
                if (bgEl && (bgEl.opacity !== 0 || bgEl.width !== 0.1)) {
                    bgEl.opacity = 0;
                    bgEl.width = 0.1;
                    bgEl.height = 0.1;
                    bgEl.x = 0;
                    bgEl.y = 0;
                    bgEl.version = Date.now();
                    bgEl.versionNonce = Math.floor(Math.random() * 100000);
                    api.updateScene({ elements: [...elements] });
                }
            }
        }
    }, 40);
}
`;
fs.writeFileSync(path, upperHalf + '\n' + newBottomHalf);
console.log("File reverted successfully.");
