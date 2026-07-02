// Custom configuration appended to config.js inside the Jitsi container
config.hideLoginButton = true;

// Suppress the "Error uploading files to backend" console.error spam.
(function() {
    const _consoleError = console.error;
    console.error = function() {
        const msg = arguments[0] ? String(arguments[0]) : '';
        if (
            msg.includes('Error uploading files to backend') ||
            msg.includes('Missing required meeting details')
        ) {
            return; // Suppress this known harmless error silently
        }
        return _consoleError.apply(this, arguments);
    };
})();

// Force selfBrowserSurface to 'include' to allow sharing the current tab
if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
        if (!constraints) constraints = {};
        if (typeof constraints.video === 'boolean' || !constraints.video) {
            constraints.video = {};
        }
        constraints.selfBrowserSurface = 'include';
        constraints.video.displaySurface = 'browser';
        
        return originalGetDisplayMedia(constraints);
    };
}

// Inject transparency and layout styles directly to the main Jitsi document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.id = 'jitsi-whiteboard-custom-style';
    style.textContent = `
        /* Make Excalidraw component background transparent */
        .excalidraw__canvas-wrapper,
        .excalidraw__canvas,
        .excalidraw,
        .excalidraw-container,
        .excalidraw-app {
            background-color: transparent !important;
            background: transparent !important;
        }
        /* Override Jitsi inline margin-top and height to expand whiteboard space */
        .whiteboard-container {
            margin-top: 0px !important;
            height: 100% !important;
            position: relative; /* Ensure it can contain the absolute video */
        }
        /* Hide Jitsi's top subject pill (room name, timer) to prevent overlapping Excalidraw toolbar */
        .subject,
        .subject-info-container,
        .subject-text {
            display: none !important;
        }
        /* Hide Excalidraw zoom controls when screensharing is active */
        .whiteboard-screenshare-active .zoom-actions,
        .whiteboard-screenshare-active .layer-ui__wrapper .Scrollbar {
            display: none !important;
        }
        /* HIDE HAND TOOL BUTTON */
        [data-testid="toolbar-hand"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Helper to find the Excalidraw API via React Fiber tree
function findExcalidrawAPI() {
    try {
        const el = document.querySelector('.excalidraw') || document.querySelector('.excalidraw-container');
        if (!el) return null;
        
        const fiberKey = Object.keys(el).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));
        if (!fiberKey) return null;
        
        const isAPI = (obj) => obj && typeof obj.updateScene === 'function';
        
        let node = el[fiberKey];
        while (node) {
            if (node.memoizedProps) {
                for (let propName in node.memoizedProps) {
                    if (isAPI(node.memoizedProps[propName])) return node.memoizedProps[propName];
                }
            }
            if (node.stateNode) {
                if (isAPI(node.stateNode)) return node.stateNode;
                if (node.stateNode.props) {
                    for (let propName in node.stateNode.props) {
                        if (isAPI(node.stateNode.props[propName])) return node.stateNode.props[propName];
                    }
                }
            }
            node = node.return;
        }
    } catch (err) {}
    return null;
}

// Monitor screen sharing and maintain the video background element behind the canvas
if (typeof window !== 'undefined') {
    window.videoBgElement = null;

    function getOrCreateVideoBuffer() {
        const container = document.querySelector('.excalidraw-container') || document.querySelector('.whiteboard-container');
        if (!container) return null;

        let video = container.querySelector('.whiteboard-custom-video-bg-buffer');
        if (!video) {
            video = document.createElement('video');
            video.className = 'whiteboard-custom-video-bg-buffer';
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true;
            
            // Restore to the original 100% full screen object-fit: contain style
            video.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; z-index: 0;";
            
            const canvasWrapper = container.querySelector('.excalidraw__canvas-wrapper');
            if (canvasWrapper) {
                container.insertBefore(video, canvasWrapper);
            } else {
                container.insertBefore(video, container.firstChild);
            }
        }
        return video;
    }

    // Monitor Jitsi screenshare track
    setInterval(() => {
        try {
            window.videoBgElement = getOrCreateVideoBuffer();
            if (!window.videoBgElement) return;

            let desktopTrack = null;
            if (window.APP && window.APP.store) {
                const tracks = window.APP.store.getState()['features/base/tracks'] || [];
                const trackObj = tracks.find(t => {
                    const isDesktop = t.videoType === 'desktop' || (t.jitsiTrack && t.jitsiTrack.videoType === 'desktop');
                    if (!isDesktop) return false;
                    
                    const nativeTrack = t.track || (t.jitsiTrack ? t.jitsiTrack.track : null);
                    if (!nativeTrack) return false;
                    
                    const isLive = nativeTrack.readyState === 'live';
                    const isEnabled = nativeTrack.enabled === true;
                    const isMuted = t.muted === true || (t.jitsiTrack && typeof t.jitsiTrack.isMuted === 'function' && t.jitsiTrack.isMuted());
                    
                    return isLive && isEnabled && !isMuted;
                });
                if (trackObj) {
                    desktopTrack = trackObj.track || (trackObj.jitsiTrack ? trackObj.jitsiTrack.track : null);
                }
            }

            if (desktopTrack) {
                const currentStream = window.videoBgElement.srcObject;
                const currentTrack = currentStream ? currentStream.getVideoTracks()[0] : null;

                if (!currentTrack || currentTrack.id !== desktopTrack.id) {
                    console.log("🖥️ Live screen share stream detected! Playing video behind canvas.");
                    const newStream = new MediaStream([desktopTrack]);
                    window.videoBgElement.srcObject = newStream;
                    window.videoBgElement.play().catch(err => console.error("Error playing video:", err));
                    document.body.classList.add('whiteboard-screenshare-active');
                    
                    // Reset alignment
                    window.hasAlignedTopLeft = false;
                }
            } else {
                if (window.videoBgElement.srcObject) {
                    console.log("🖥️ Screen share stopped. Clearing video.");
                    window.videoBgElement.srcObject = null;
                    document.body.classList.remove('whiteboard-screenshare-active');
                }
            }
        } catch (err) {
            console.error("❌ Error in screenshare monitor loop:", err);
        }
    }, 1000);

    // SAFE CAMERA LOCK: Căn lề góc (0,0) và Zoom tương thích kích thước màn hình mà không làm gián đoạn lúc vẽ
    let lastWidth = 0;
    let lastHeight = 0;
    let lastVideoWidth = 0;
    let lastVideoHeight = 0;

    setInterval(() => {
        try {
            const api = findExcalidrawAPI();
            if (!api) return;

            const container = document.querySelector('.excalidraw-container') || document.querySelector('.whiteboard-container');
            if (!container) return;

            // FORCE PREVENT HAND TOOL (reset to selection if activated)
            const appState = typeof api.getAppState === 'function' ? api.getAppState() : null;
            if (appState && appState.activeTool && appState.activeTool.type === 'hand') {
                api.updateScene({
                    appState: {
                        activeTool: { type: 'selection' }
                    }
                });
            }

            const videoBg = window.videoBgElement;
            const currentVideoWidth = (videoBg && videoBg.srcObject) ? videoBg.videoWidth : 0;
            const currentVideoHeight = (videoBg && videoBg.srcObject) ? videoBg.videoHeight : 0;

            const currentWidth = container.clientWidth;
            const currentHeight = container.clientHeight;

            // Chỉ cập nhật khi có thay đổi kích thước màn hình / video để tránh làm gián đoạn nét vẽ của giáo viên/học viên
            if (currentWidth !== lastWidth || currentHeight !== lastHeight || currentVideoWidth !== lastVideoWidth || currentVideoHeight !== lastVideoHeight || !window.hasAlignedTopLeft) {
                lastWidth = currentWidth;
                lastHeight = currentHeight;
                lastVideoWidth = currentVideoWidth;
                lastVideoHeight = currentVideoHeight;
                window.hasAlignedTopLeft = true;

                let videoAspectRatio = 16 / 9;
                if (currentVideoWidth > 0 && currentVideoHeight > 0) {
                    videoAspectRatio = currentVideoWidth / currentVideoHeight;
                }

                const containerAspectRatio = currentWidth / currentHeight;

                let renderedWidth, renderedHeight;
                if (containerAspectRatio > videoAspectRatio) {
                    renderedHeight = currentHeight;
                    renderedWidth = currentHeight * videoAspectRatio;
                } else {
                    renderedWidth = currentWidth;
                    renderedHeight = currentWidth / videoAspectRatio;
                }

                const offsetLeft = (currentWidth - renderedWidth) / 2;
                const offsetTop = (currentHeight - renderedHeight) / 2;

                const baseSceneWidth = 1280;
                const targetZoom = renderedWidth / baseSceneWidth;
                
                // Căn lề góc (0,0) của video vào sát lề trái-trên của màn hình hiển thị
                const targetScrollX = offsetLeft / targetZoom;
                const targetScrollY = offsetTop / targetZoom;

                console.log(`[CAMERA LOCK] Zoom: ${targetZoom}, Scroll: ${targetScrollX}, ${targetScrollY}`);
                
                api.updateScene({
                    appState: {
                        zoom: { value: targetZoom },
                        scrollX: targetScrollX,
                        scrollY: targetScrollY
                    }
                });
            }
        } catch (err) {
            console.error("❌ Error in safe camera lock:", err);
        }
    }, 500);

    // Khi người dùng nhả chuột (kết thúc kéo thả / vẽ), giật camera về đúng vị trí nếu bị lệch
    window.addEventListener('mouseup', () => {
        lastWidth = 0; // Kích hoạt chạy lại kiểm tra ở khoảng thời gian kế tiếp
    });
    window.addEventListener('touchend', () => {
        lastWidth = 0;
    });

    // INTERCEPT INPUTS & WHEEL TO DISABLE SCROLL AND ZOOM BY MOUSE/TOUCH
    document.addEventListener('DOMContentLoaded', () => {
        const attachBlockers = () => {
            const container = document.querySelector('.excalidraw-container') || document.querySelector('.whiteboard-container');
            if (container) {
                // 1. Chặn cuộn chuột (scroll) và phóng to bằng cuộn (ctrl+wheel)
                container.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, { passive: false });

                // 2. Chặn cuộn bằng nhấn chuột giữa (middle button drag)
                container.addEventListener('pointerdown', (e) => {
                    if (e.button === 1) { // Middle click
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);
            }
        };

        // Chạy ngay và chạy lại sau 1s, 3s để đề phòng Excalidraw render trễ
        attachBlockers();
        setTimeout(attachBlockers, 1000);
        setTimeout(attachBlockers, 3000);
    });

    // 3. Chặn phím tắt Spacebar (dùng để cuộn) và phím H (dùng kích hoạt bàn tay)
    window.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.contentEditable === 'true');
        
        // Chặn phím H
        if ((e.key.toLowerCase() === 'h' || e.code === 'KeyH') && !isInput) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Chặn phím cách (Space)
        if ((e.code === 'Space' || e.key === ' ') && !isInput) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true); // Dùng capture phase để chặn từ gốc
}

// HACK: Override Canvas fillRect to block Excalidraw's solid white background fills and maintain transparency
if (typeof CanvasRenderingContext2D !== 'undefined') {
    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        if (this.canvas && this.canvas.className && typeof this.canvas.className === 'string' && this.canvas.className.includes('excalidraw__canvas')) {
            const fillStyleStr = String(this.fillStyle).toLowerCase().trim();
            if (fillStyleStr === '#ffffff' || fillStyleStr === 'rgb(255, 255, 255)' || fillStyleStr === '#fff' || fillStyleStr === 'white' || 
                fillStyleStr === '#f8f9fa' || fillStyleStr === '#f1f3f5' || fillStyleStr === '#e9ecef' || fillStyleStr === '#dee2e6') {
                // Clear the canvas to transparent so the video underneath shows through
                this.clearRect(x, y, w, h);
                return;
            }
        }
        return originalFillRect.apply(this, arguments);
    };
}
