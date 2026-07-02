// Custom configuration appended to config.js inside the Jitsi container
config.hideLoginButton = true;

// Force selfBrowserSurface to 'include' to allow sharing the current tab
if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
        if (!constraints) constraints = {};
        if (typeof constraints.video === 'boolean' || !constraints.video) {
            constraints.video = {};
        }
        constraints.selfBrowserSurface = 'include';
        // Some older implementations might look inside video object
        constraints.video.displaySurface = 'browser';
        
        return originalGetDisplayMedia(constraints);
    };
}

// Global state for background images
if (typeof window !== 'undefined') {
    // Valid 1x1 transparent PNG Base64 placeholder to ensure browser loads it successfully and calls drawImage (keeps whiteboard blank when not sharing)
    window.currentBgImageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    window.lastExcalidrawAPI = null;
}

// Function to apply background image as an Excalidraw element
function applyBackgroundToExcalidraw(api, url) {
    try {
        if (!api || !url) return;
        const fileId = "bg-image-file-1";
        
        // Add the file to Excalidraw repository using the dataURL directly
        api.addFiles([{
            id: fileId,
            dataURL: url,
            mimeType: "image/png",
            created: Date.now()
        }]);

        // Retrieve current elements defensively using fallback getters
        const getElements = api.getSceneElements || api.getElements;
        const currentElements = getElements ? (getElements.call(api) || []) : [];
        const cleanElements = currentElements.filter(el => el && el.id !== 'excalidraw-custom-bg-element');

        // Create a locked image element centered at virtual coordinate (0,0)
        const imgElement = {
            type: "image",
            id: "excalidraw-custom-bg-element",
            x: -640,  // Centered for 1280 width
            y: -360,  // Centered for 720 height
            width: 1280,
            height: 720,
            fileId: fileId,
            status: "saved",
            isLocked: true, // Locked so users can't accidentally move or delete it
            backgroundColor: "transparent",
            strokeColor: "transparent",
            fillStyle: "hachure",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            seed: 98765,
            version: Date.now(),
            versionNonce: Math.floor(Math.random() * 100000),
            isDeleted: false
        };

        // Insert the background image element at the very beginning of the elements list (bottom layer)
        const updatedElements = [imgElement, ...cleanElements];
        api.updateScene({ elements: updatedElements });
    } catch (err) {
        console.error("❌ Error applying background to Excalidraw:", err);
    }
}

// Helper to find the Excalidraw API via React Fiber tree
function findExcalidrawAPI() {
    try {
        const el = document.querySelector('.excalidraw') || document.querySelector('.excalidraw-container');
        if (!el) return null;
        
        const fiberKey = Object.keys(el).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));
        if (!fiberKey) return null;
        
        const isAPI = (obj) => {
            return obj && typeof obj.updateScene === 'function' && typeof obj.addFiles === 'function';
        };
        
        let node = el[fiberKey];
        while (node) {
            if (node.memoizedProps) {
                for (let propName in node.memoizedProps) {
                    if (isAPI(node.memoizedProps[propName])) {
                        return node.memoizedProps[propName];
                    }
                }
            }
            if (node.stateNode) {
                if (isAPI(node.stateNode)) {
                    return node.stateNode;
                }
                if (node.stateNode.props) {
                    for (let propName in node.stateNode.props) {
                        if (isAPI(node.stateNode.props[propName])) {
                            return node.stateNode.props[propName];
                        }
                    }
                }
            }
            node = node.return;
        }
    } catch (err) {
        console.error("❌ Error finding Excalidraw API:", err);
    }
    return null;
}

// Background script to check for Excalidraw load and verify background element presence
if (typeof window !== 'undefined') {
    setInterval(() => {
        try {
            const api = findExcalidrawAPI();
            if (api && window.currentBgImageUrl) {
                const getElements = api.getSceneElements || api.getElements;
                const elements = getElements ? (getElements.call(api) || []) : [];
                const hasBg = elements.some(el => el && el.id === 'excalidraw-custom-bg-element');
                
                // 1. ALWAYS ensure the transparent placeholder file is registered in this Excalidraw instance
                const fileId = "bg-image-file-1";
                api.addFiles([{
                    id: fileId,
                    dataURL: window.currentBgImageUrl,
                    mimeType: "image/png",
                    created: Date.now()
                }]);

                // 2. If the background element is missing from elements list, add it
                if (!hasBg) {
                    console.log("🔄 Background element missing from Excalidraw, applying...");
                    applyBackgroundToExcalidraw(api, window.currentBgImageUrl);
                }
            }
        } catch (err) {
            console.error("❌ Error in background verification loop:", err);
        }
    }, 1500); // Verify every 1.5 seconds

    // Listen for parent messages (legacy, kept for structural integrity)
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'SET_WHITEBOARD_BACKGROUND') {
            console.log("🖼️ Jitsi received background command (ignored to keep screenshare focus)");
        }
    });
}

// HACK: Override Canvas fillRect to block Excalidraw's solid white background fills and maintain transparency
if (typeof CanvasRenderingContext2D !== 'undefined') {
    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        if (this.canvas && this.canvas.className && typeof this.canvas.className === 'string' && this.canvas.className.includes('excalidraw__canvas')) {
            const fillStyleStr = String(this.fillStyle).toLowerCase().trim();
            if (fillStyleStr === '#ffffff' || fillStyleStr === 'rgb(255, 255, 255)' || fillStyleStr === '#fff' || fillStyleStr === 'white' || 
                fillStyleStr === '#f8f9fa' || fillStyleStr === '#f1f3f5' || fillStyleStr === '#e9ecef' || fillStyleStr === '#dee2e6') {
                // Clear the canvas to transparent
                this.clearRect(x, y, w, h);
                return;
            }
        }
        return originalFillRect.apply(this, arguments);
    };
}

// Inject transparency styles directly to the main Jitsi document
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
            background-color: transparent !important;
            background: transparent !important;
        }
        /* Hide Jitsi's top subject pill (room name, timer) to prevent overlapping Excalidraw toolbar */
        .subject,
        .subject-info-container,
        .subject-text {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// HACK: Monitor screen sharing and hijack Canvas drawImage to swap the static placeholder with the live screenshare stream
if (typeof window !== 'undefined') {
    let videoBg = null;

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
                    // Preserve native aspect ratio (object-fit: contain logic)
                    const sw = videoBg.videoWidth || videoBg.width || 1280;
                    const sh = videoBg.videoHeight || videoBg.height || 720;
                    const dx = arguments[5];
                    const dy = arguments[6];
                    const dw = arguments[7];
                    const dh = arguments[8];

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
                // Hide the broken image SVG placeholder when not sharing screen
                if (img.src.includes('data:image/svg+xml')) {
                    return;
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
                    const container = document.querySelector('.excalidraw-container');
                    const width = (container && container.clientWidth > 0) ? container.clientWidth : window.innerWidth;
                    const height = (container && container.clientHeight > 0) ? container.clientHeight : window.innerHeight;
                    
                    if (!window.hasAddedResizeListener) {
                        window.hasAddedResizeListener = true;
                        window.lastContainerWidth = width;
                        window.lastContainerHeight = height;
                        
                        const obs = new ResizeObserver(() => {
                            if (videoBg && videoBg.srcObject) {
                                clearTimeout(window.centerCameraTimeout);
                                window.centerCameraTimeout = setTimeout(() => {
                                    window.shouldCenterCamera = true;
                                }, 150);
                            }
                        });
                        if (container) obs.observe(container);
                        else obs.observe(document.body);
                    }

                    if (!window.hasCenteredOnLoad && width > 0 && height > 0) {
                        window.hasCenteredOnLoad = true;
                        window.lastContainerWidth = width;
                        window.lastContainerHeight = height;
                        window.shouldCenterCamera = false;
                        nextAppState = {
                            scrollX: width / 2,
                            scrollY: height / 2,
                            zoom: { value: 1 }
                        };
                    } else if (window.shouldCenterCamera && width > 0 && height > 0) {
                        window.shouldCenterCamera = false;
                        
                        const appState = typeof api.getAppState === 'function' ? api.getAppState() : null;
                        if (appState) {
                            const currentZoom = appState.zoom ? appState.zoom.value : 1;
                            const currentScrollX = appState.scrollX;
                            const currentScrollY = appState.scrollY;
                            
                            // Calculate how much the viewport grew/shrunk
                            const deltaX = width - window.lastContainerWidth;
                            const deltaY = height - window.lastContainerHeight;
                            
                            window.lastContainerWidth = width;
                            window.lastContainerHeight = height;
                            
                            // Shift the camera by half the growth amount to keep the center pinned!
                            nextAppState = {
                                scrollX: currentScrollX + (deltaX / 2) / currentZoom,
                                scrollY: currentScrollY + (deltaY / 2) / currentZoom
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
        }
    }, 40);
}
