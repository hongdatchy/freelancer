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
        /* Make Excalidraw component background transparent ONLY during screenshare */
        .whiteboard-screenshare-active .excalidraw__canvas-wrapper,
        .whiteboard-screenshare-active .excalidraw__canvas,
        .whiteboard-screenshare-active .excalidraw,
        .whiteboard-screenshare-active .excalidraw-container,
        .whiteboard-screenshare-active .excalidraw-app {
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
        
        /* UNCONDITIONAL CSS BLOCKERS FOR ZOOM & SCROLLBARS & HAND TOOL */
        .zoom-actions,
        .zoom-controls,
        .layer-ui__wrapper .zoom-actions,
        .excalidraw-scrollbars,
        .Scrollbar,
        .excalidraw .Scrollbar {
            display: none !important;
        }
        
        /* Hide hand tool button through all possible element patterns */
        [data-testid="toolbar-hand"],
        label:has(input[value="hand"]),
        .excalidraw label:has(input[value="hand"]),
        label:has(input[id*="hand"]),
        .ToolIcon_type_radio:has(input[value="hand"]),
        button[title*="Hand"],
        button[title*="Bàn tay"],
        label[title*="Hand"],
        label[title*="Bàn tay"],
        [aria-label*="Hand"],
        [aria-label*="Bàn tay"] {
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

            // FORCE PREVENT HAND TOOL (Compatibility check for both string and object tool formats)
            const appState = typeof api.getAppState === 'function' ? api.getAppState() : null;
            if (appState && appState.activeTool) {
                const toolType = typeof appState.activeTool === 'string' ? appState.activeTool : appState.activeTool.type;
                if (toolType === 'hand') {
                    api.updateScene({
                        appState: {
                            activeTool: typeof appState.activeTool === 'string' ? 'selection' : { type: 'selection' }
                        }
                    });
                }
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

    // GLOBAL INTERCEPT ON CAPTURE PHASE: Block events before they can reach Excalidraw's local listeners
    // This solves the problem of Excalidraw catching the wheel events locally and stopping propagation.
    const isTargetWhiteboard = (target) => {
        if (!target) return false;
        if (typeof target.closest !== 'function') return false;
        return target.closest('.excalidraw-container') || target.closest('.whiteboard-container');
    };

    // 1. Chặn cuộn lăn chuột (wheel) ở capture phase
    window.addEventListener('wheel', (e) => {
        if (isTargetWhiteboard(e.target)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); // true = Capture phase

    // 2. Chặn nhấn giữ chuột giữa (middle click scroll) ở capture phase
    window.addEventListener('pointerdown', (e) => {
        if (isTargetWhiteboard(e.target) && e.button === 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // 3. Chặn zoom bằng cử chỉ cảm ứng trên thiết bị di động (multi-touch zoom) ở capture phase
    window.addEventListener('touchmove', (e) => {
        if (isTargetWhiteboard(e.target) && e.touches && e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { capture: true, passive: false });

    // 4. Chặn phím tắt Spacebar (pan) và H (hand tool) ở capture phase
    window.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.contentEditable === 'true');
        
        if (!isInput) {
            // Chặn phím H
            if (e.key.toLowerCase() === 'h' || e.code === 'KeyH') {
                e.stopPropagation();
                e.preventDefault();
            }
            // Chặn phím Space
            if (e.code === 'Space' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }, true);

    // 5. Quét ẩn liên tục nút Bàn tay trong DOM (đề phòng Jitsi render trễ)
    setInterval(() => {
        try {
            const docs = [document];
            
            // Tìm cả trong các iframe nếu có
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentDocument) docs.push(iframe.contentDocument);
                } catch (e) {}
            });

            docs.forEach(doc => {
                // Thêm CSS ẩn cứng vào head của tài liệu
                if (!doc.getElementById('custom-hide-hand-tool-css')) {
                    const style = doc.createElement('style');
                    style.id = 'custom-hide-hand-tool-css';
                    style.textContent = `
                        [data-testid="toolbar-hand"],
                        label:has(input[value="hand"]),
                        .excalidraw label:has(input[value="hand"]),
                        .ToolIcon_type_radio:has(input[value="hand"]),
                        button[title*="Hand"], button[title*="Bàn tay"],
                        label[title*="Hand"], label[title*="Bàn tay"],
                        [aria-label*="Hand"], [aria-label*="Bàn tay"] {
                            display: none !important;
                        }
                        .zoom-actions, .zoom-controls, .excalidraw-scrollbars, .Scrollbar {
                            display: none !important;
                        }
                    `;
                    doc.head.appendChild(style);
                }

                // Quét thủ công thuộc tính của các element để ẩn
                const buttons = doc.querySelectorAll('button, label, input, .ToolIcon_type_radio, [data-testid]');
                buttons.forEach(el => {
                    const title = String(el.title || el.getAttribute('aria-label') || '').toLowerCase();
                    const testId = String(el.getAttribute('data-testid') || '').toLowerCase();
                    const value = String(el.value || el.getAttribute('data-tool') || '').toLowerCase();
                    const id = String(el.id || '').toLowerCase();
                    
                    if (title.includes('hand') || title.includes('bàn tay') || 
                        testId.includes('hand') || testId.includes('toolbar-hand') ||
                        value === 'hand' || id === 'hand') {
                        el.style.setProperty('display', 'none', 'important');
                        const parentLabel = el.closest('label') || el.closest('.ToolIcon') || el.closest('.ToolIcon_type_radio');
                        if (parentLabel) parentLabel.style.setProperty('display', 'none', 'important');
                    }
                });
            });
        } catch (err) {}
    }, 500);
}

// HACK: Override Canvas fillRect to block Excalidraw's solid white background fills ONLY during screenshare
if (typeof CanvasRenderingContext2D !== 'undefined') {
    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        // Only intercept when screenshare is active - otherwise let Excalidraw draw its normal white background
        const isScreenshareActive = document.body && document.body.classList.contains('whiteboard-screenshare-active');
        if (isScreenshareActive && this.canvas && this.canvas.className && typeof this.canvas.className === 'string' && this.canvas.className.includes('excalidraw__canvas')) {
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
