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
    window.currentBgImageUrl = "http://127.0.0.1:1337/uploads/course1_cecede884c.webp";
    window.lastExcalidrawAPI = null;
}

// Function to apply background image as an Excalidraw element
function applyBackgroundToExcalidraw(api, url) {
    try {
        if (!api || !url) return;
        const fileId = "bg-image-file-" + (url.includes('course1') ? '1' : '2');
        
        // Add the file to Excalidraw repository using the HTTP URL as dataURL directly
        api.addFiles([{
            id: fileId,
            dataURL: url,
            mimeType: "image/webp",
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
                
                // 1. ALWAYS ensure the file is registered in this Excalidraw instance (handles re-join / visibility state)
                const fileId = "bg-image-file-" + (window.currentBgImageUrl.includes('course1') ? '1' : '2');
                api.addFiles([{
                    id: fileId,
                    dataURL: window.currentBgImageUrl,
                    mimeType: "image/webp",
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

    // Listen for parent messages to dynamically update background image
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'SET_WHITEBOARD_BACKGROUND') {
            const imageUrl = event.data.imageUrl;
            console.log("🖼️ Jitsi received background image URL:", imageUrl ? imageUrl.substring(0, 50) + "..." : "null");
            
            window.currentBgImageUrl = imageUrl;
            const api = findExcalidrawAPI();
            if (api) {
                applyBackgroundToExcalidraw(api, imageUrl);
            }
        }
    });
}

// HACK: Override Canvas fillRect to block Excalidraw's solid white background fills
if (typeof CanvasRenderingContext2D !== 'undefined') {
    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        if (this.canvas && this.canvas.className && typeof this.canvas.className === 'string' && this.canvas.className.includes('excalidraw__canvas')) {
            const fillStyleStr = String(this.fillStyle).toLowerCase().trim();
            if (fillStyleStr === '#ffffff' || fillStyleStr === 'rgb(255, 255, 255)' || fillStyleStr === '#fff' || fillStyleStr === 'white') {
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
    `;
    document.head.appendChild(style);
}
