const fs = require('fs');
const path = 'd:\\freelancer\\vietsure_english\\jitsi-demo\\custom-config.js';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const upperHalf = lines.slice(0, 208).join('\n');
const newBottomHalf = `// HACK: Monitor screen sharing and hijack Canvas drawImage to swap the static placeholder with the live screenshare stream
if (typeof window !== 'undefined') {
    let videoBg = null;
    let hasCenteredOnLoad = false;
    
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
            // Keeps it layout-active but effectively invisible to the user
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

                // Assign stream to video tag if not already active or if track changed
                if (!currentTrack || currentTrack.id !== desktopTrack.id) {
                    console.log("🖥️ Live screen share stream detected! Buffering stream inside whiteboard layout.");
                    const newStream = new MediaStream([desktopTrack]);
                    videoBg.srcObject = newStream;
                    videoBg.play().catch(err => console.error("Error playing video:", err));
                }
            } else {
                if (videoBg.srcObject) {
                    console.log("🖥️ Screen share stopped. Clearing buffer.");
                    videoBg.srcObject = null;
                }
            }
        } catch (err) {
            console.error("❌ Error in screenshare monitor loop:", err);
        }
    }, 1000);

    // Hijack drawImage: when Excalidraw is drawing our background image, draw the live screenshare stream instead!
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, x, y, w, h) {
        // Match the background image element (matches SVG placeholder, PNG placeholder, or course1/banner)
        if (img && img.src && (img.src === window.currentBgImageUrl || img.src.includes('course1') || img.src.includes('banner') || img.src.includes('data:image/'))) {
            if (videoBg && videoBg.srcObject) {
                // Handle both 5-argument and 9-argument drawImage calls natively to prevent cropping issues
                if (arguments.length === 5) {
                    return originalDrawImage.call(this, videoBg, x, y, w, h);
                } else if (arguments.length === 9) {
                    // Hijack the source coordinates to take the FULL video frame (0, 0, videoWidth, videoHeight)
                    // and map it fully into the destination bounds calculated by Excalidraw, preventing cropping.
                    const sx = 0;
                    const sy = 0;
                    const sw = videoBg.videoWidth || videoBg.width || 1280;
                    const sh = videoBg.videoHeight || videoBg.height || 720;
                    const dx = arguments[5];
                    const dy = arguments[6];
                    const dw = arguments[7];
                    const dh = arguments[8];
                    return originalDrawImage.call(this, videoBg, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }
        }
        return originalDrawImage.apply(this, arguments);
    };

    // Force Excalidraw canvas refresh at ~24fps ONLY when screensharing is active to play the live video background smoothly
    // Update the background element's version to mark it dirty so Excalidraw triggers a redraw on every frame
    setInterval(() => {
        if (videoBg && videoBg.srcObject) {
            const api = findExcalidrawAPI();
            if (api) {
                const getElements = api.getSceneElements || api.getElements;
                const elements = getElements ? (getElements.call(api) || []) : [];
                const bgEl = elements.find(el => el && el.id === 'excalidraw-custom-bg-element');
                if (bgEl) {
                    // Update element version and nonce to force Excalidraw to redraw this element
                    bgEl.version = Date.now();
                    bgEl.versionNonce = Math.floor(Math.random() * 100000);
                    
                    let nextAppState;
                    // Yêu cầu: lúc vào lớp thì cái khung share màn hình ở giữa thôi
                    if (!hasCenteredOnLoad) {
                        const container = document.querySelector('.excalidraw-container');
                        const width = (container && container.clientWidth > 0) ? container.clientWidth : window.innerWidth;
                        const height = (container && container.clientHeight > 0) ? container.clientHeight : window.innerHeight;
                        
                        if (width > 0 && height > 0) {
                            hasCenteredOnLoad = true;
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
            // Reset to allow centering again if they stop and start sharing
            hasCenteredOnLoad = false;
        }
    }, 40);
}
`;
fs.writeFileSync(path, upperHalf + '\n' + newBottomHalf);
console.log("Reverted to purest version with only load centering.");
