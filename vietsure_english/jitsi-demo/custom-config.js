// ==========================================
// VIETSURE ENGLISH - JITSI CUSTOM CONFIG
// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// EDIT FILES IN ./custom-modules/ AND RUN node build-custom-config.js
// ==========================================


/* --- MODULE: 01-base-config-and-styles.js --- */
// ==========================================
// 1. BASE CONFIGURATION & CUSTOM STYLES
// ==========================================

// Custom configuration appended to config.js inside the Jitsi container
config.hideLoginButton = true;
config.defaultLanguage = 'vi';
config.settingsSections = ['devices', 'moderator', 'profile', 'calendar', 'sounds'];
config.disableSelfViewSettings = true;

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
if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
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
        
        /* Hide Excalidraw Main Menu Button (Hamburger button) for both Teacher and Student */
        .excalidraw button[data-testid="main-menu-trigger"],
        .excalidraw button[aria-label*="Menu"],
        .excalidraw button[aria-label*="menu"],
        .excalidraw .App-menu__button,
        .excalidraw .main-menu-trigger {
            display: none !important;
        }

        /* Hide whiteboard button in student's toolbar (on documentElement or body) */
        .is-student [data-testid="toolbox-whiteboard"],
        .is-student .toolbox-button[aria-label*="Whiteboard"],
        .is-student .toolbox-button[aria-label*="Bảng trắng"],
        .is-student .toolbox-button[aria-label*="Ẩn bảng"],
        .is-student .toolbox-button[aria-label*="Hiện bảng"],
        .is-student button[title*="Whiteboard"],
        .is-student button[title*="Bảng trắng"],
        .is-student button[title*="Ẩn bảng"],
        .is-student button[title*="Hiện bảng"] {
            display: none !important;
        }
        /* TODO: Hide local and remote screenshare cards ONLY for Student
        .is-student #filmstripLocalScreenShare,
        .is-student #filmstripLocalScreenShareThumbnail,
        .is-student #filmstripRemoteScreenShare,
        .is-student #filmstripRemoteScreenShareThumbnail,
        .is-student span.videocontainer[id*="-v0"],
        span.videocontainer[id*="-v0"] {
            display: none !important;
        }
        */

        /* Hide Jitsi native invite buttons/items */
        .invite-button,
        [class*="invite"],
        [aria-label*="Invite"],
        [aria-label*="Mời"],
        [data-testid="toolbox-invite"],
        .button-invite,
        [class*="-invite"] {
            display: none !important;
        }

        /* Style our custom Jitsi toolbar clock button to match standard Jitsi buttons */
        #custom-jitsi-timer-btn {
            width: 48px !important;
            min-width: 48px !important;
            height: 48px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
        }
        #custom-jitsi-praise-btn {
            width: 48px !important;
            min-width: 48px !important;
            height: 48px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
        }
        #custom-jitsi-timer-btn .toolbox-button,
        #custom-jitsi-praise-btn .toolbox-button {
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 6px !important;
            transition: background-color 0.2s ease !important;
        }
        #custom-jitsi-timer-btn .toolbox-button:hover,
        #custom-jitsi-praise-btn .toolbox-button:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }

        /* Prevent main toolbox items container from wrapping or shrinking custom buttons */
        .toolbox-content-items {
            display: flex !important;
            flex-wrap: nowrap !important;
        }

        /* Reclaim wasted bottom safe area space in mobile landscape */
        @media (max-height: 480px) and (orientation: landscape) {
            .toolbox,
            .new-toolbox,
            .toolbox-content,
            .toolbox-content-wrapper {
                padding-bottom: 2px !important;
                margin-bottom: 0px !important;
                height: 48px !important;
            }
            .toolbox-content-items {
                height: 40px !important;
            }
        }

        /* Force Jitsi filmstrip containers to always be visible */
        .filmstrip,
        .vertical-filmstrip,
        .horizontal-filmstrip,
        .filmstrip__videos,
        [class*="filmstrip"],
        [class*="Filmstrip"] {
            opacity: 1 !important;
            visibility: visible !important;
            overflow: visible !important;
        }

        /* TODO: Filmstrip card alignment - active ONLY when div with class .filmstrip has width <= 309px
        .filmstrip.filmstrip-width-lte-309 #filmstripLocalVideo {
            margin-top: auto !important;
            margin-bottom: 0px !important;
        }

        .filmstrip.filmstrip-width-lte-309 #filmstripLocalScreenShare {
            margin-top: 0px !important;
            margin-bottom: 0px !important;
        }

        .filmstrip.filmstrip-width-lte-309 .remote-videos>div {
            bottom: auto !important;
            top: 0px !important;
        }

        .filmstrip.filmstrip-width-lte-309 .remote-videos {
            height: 70% !important;
            max-height: 70% !important;
        }
        */

        /* Hide Moderator (M / Quản trị viên) icon on video cards */
        svg[aria-label*="Quản trị viên"],
        svg[aria-label*="Moderator"],
        svg[aria-label*="moderator"] {
            display: none !important;
        }

        /* Force ONLY the filmstrip toggle container to be always visible */
        .filmstrip-toggle-container,
        [class*="filmstrip-toggle"],
        [class*="toggle-filmstrip"],
        [class*="FilmstripToggle"] {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 99999 !important;
            transform: none !important;
            transition: none !important;
        }

        /* Force toggle button visible and rotate chevron */
        .toggle-filmstrip-button,
        .filmstrip__toggle,
        [class*="Filmstrip__toggle"],
        button[aria-label*="filmstrip"],
        button[aria-label*="danh sách video"] {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 99999 !important;
            transform: rotate(90deg) !important;
        }

        .vertical-filmstrip .filmstrip-toggle-container,
        .vertical-filmstrip .toggle-filmstrip-button,
        .vertical-filmstrip .filmstrip__toggle,
        .vertical-filmstrip button[aria-label*="filmstrip"],
        .vertical-filmstrip button[aria-label*="danh sách video"] {
            left: -20px !important;
            right: auto !important;
        }
        .horizontal-filmstrip .filmstrip-toggle-container,
        .horizontal-filmstrip .toggle-filmstrip-button,
        .horizontal-filmstrip .filmstrip__toggle,
        .horizontal-filmstrip button[aria-label*="filmstrip"],
        .horizontal-filmstrip button[aria-label*="danh sách video"] {
            bottom: 52px !important;
            top: auto !important;
        }
    `;
    document.head.appendChild(style);
}

// Style overrides to make Jitsi background bright (like homepage banner)
if (typeof window !== 'undefined') {
    const applyBrightTheme = () => {
        try {
            if (!document.getElementById('custom-bright-bg-css')) {
                const style = document.createElement('style');
                style.id = 'custom-bright-bg-css';
                style.textContent = `
                    #videospace,
                    #videoconference_page,
                    .large-video-background,
                    .filmstrip,
                    #largeVideoBackgroundContainer {
                        background: linear-gradient(to bottom, #ffffff 0%, #F0F7FF 100%) !important;
                        background-color: #F0F7FF !important;
                    }
                    /* Disable clicking/pinning ONLY on video thumbnails inside filmstrip for students */
                    body.is-student .filmstrip #filmstripLocalVideo,
                    body.is-student .filmstrip #filmstripLocalScreenShare,
                    body.is-student .filmstrip .remote-videos .videocontainer {
                        pointer-events: none !important;
                    }
                `;
                document.head.appendChild(style);
                console.log("🎨 Applied bright layout background theme.");
            }

            let isStudent = false;
            if (window.location.hash && window.location.hash.includes('config.isStudent=true')) {
                isStudent = true;
            } else if (window.location.hash && window.location.hash.includes('config.isStudent=false')) {
                isStudent = false;
            } else if (typeof config !== 'undefined' && typeof config.isStudent !== 'undefined') {
                isStudent = !!config.isStudent;
            }
            try {
                if (window.APP && window.APP.store) {
                    const state = window.APP.store.getState();
                    const participants = state['features/base/participants'] || [];
                    const localP = Array.isArray(participants) ? participants.find(p => p && p.local) : Object.values(participants).find((p) => p && p.local);
                    if (localP && localP.role === 'moderator') {
                        isStudent = false;
                    }
                }
            } catch (e) {}

            if (document.body) {
                if (isStudent) {
                    document.body.classList.add('is-student');
                } else {
                    document.body.classList.remove('is-student');
                }
            }
        } catch (err) {}
    };
    
    applyBrightTheme();
    setInterval(applyBrightTheme, 2000);
}


/* --- MODULE: 02-whiteboard-and-excalidraw.js --- */
// ==========================================
// 2. WHITEBOARD & EXCALIDRAW INTEGRATION
// ==========================================

// Helper to find the Excalidraw API via React Fiber tree (including inside iframes)
function findExcalidrawAPI() {
    try {
        let el = document.querySelector('.excalidraw') || document.querySelector('.excalidraw-container');
        if (!el) {
            const iframes = document.querySelectorAll('iframe');
            for (let i = 0; i < iframes.length; i++) {
                try {
                    const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
                    if (iframeDoc) {
                        el = iframeDoc.querySelector('.excalidraw') || iframeDoc.querySelector('.excalidraw-container');
                        if (el) break;
                    }
                } catch (e) {}
            }
        }
        
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

// Inject highlighter toggle button directly into Excalidraw toolbar (shapes-section)
const injectToolbarIcon = () => {
    let toolbarStack = null;
    let targetDoc = document;
    
    toolbarStack = document.querySelector('.shapes-section .App-toolbar .Stack_horizontal') || 
                   document.querySelector('.App-toolbar .Stack_horizontal');
                   
    if (!toolbarStack) {
        const iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
                if (iframeDoc) {
                    toolbarStack = iframeDoc.querySelector('.shapes-section .App-toolbar .Stack_horizontal') || 
                                   iframeDoc.querySelector('.App-toolbar .Stack_horizontal');
                    if (toolbarStack) {
                        targetDoc = iframeDoc;
                        break;
                    }
                }
            } catch (e) {}
        }
    }
    
    if (!toolbarStack) return;
    
    if (targetDoc.getElementById('custom-highlighter-tool')) {
        const api = findExcalidrawAPI();
        if (api && typeof api.getAppState === 'function') {
            const currentOpacity = api.getAppState()?.currentItemOpacity ?? 100;
            const label = targetDoc.getElementById('custom-highlighter-tool');
            if (label) {
                if (currentOpacity === 40) {
                    label.classList.add('active');
                } else if (currentOpacity === 100) {
                    label.classList.remove('active');
                }
            }
        }
        return;
    }
    
    const label = targetDoc.createElement('label');
    label.className = 'ToolIcon Shape';
    label.id = 'custom-highlighter-tool';
    label.title = 'Bút dạ quang (Highlighter - 40% độ mờ)';
    label.style.cursor = 'pointer';
    
    label.innerHTML = `
        <input type="checkbox" style="display: none;">
        <div class="ToolIcon__icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 17px; height: 17px;">
                <path d="M9.53 16.122l9.88-9.88a3 3 0 114.243 4.243l-9.88 9.88M9.53 16.122a3 3 0 11-4.243-4.242l9.88-9.88M9.53 16.122L5.29 20.36a1.5 1.5 0 11-2.122-2.121L7.41 14M18 10l-4-4" />
            </svg>
        </div>
    `;
    
    if (!targetDoc.getElementById('custom-highlighter-tool-style')) {
        const style = targetDoc.createElement('style');
        style.id = 'custom-highlighter-tool-style';
        style.textContent = `
            #custom-highlighter-tool.active {
                background-color: var(--color-primary-light, #e3e2fe) !important;
                color: var(--color-primary, #6965db) !important;
            }
        `;
        targetDoc.head.appendChild(style);
    }
    
    let isHighlighterActive = false;
    label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isHighlighterActive = !isHighlighterActive;
        if (isHighlighterActive) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
        
        const activeApi = findExcalidrawAPI();
        if (activeApi) {
            const val = isHighlighterActive ? 40 : 100;
            activeApi.updateScene({
                appState: {
                    currentItemOpacity: val
                }
            });
            
            if (isHighlighterActive) {
                try {
                    if (typeof activeApi.setActiveTool === 'function') {
                        activeApi.setActiveTool({ 
                            type: 'freedraw', 
                            locked: true 
                        });
                    } else {
                        activeApi.updateScene({
                            appState: {
                                activeTool: {
                                    type: 'freedraw'
                                }
                            }
                        });
                    }
                } catch (err) {
                    console.warn('[Jitsi custom-config] Failed to set active tool:', err);
                }
            }
            
            const selectedIds = activeApi.getAppState()?.selectedElementIds || {};
            const hasSelection = Object.keys(selectedIds).length > 0;
            if (hasSelection) {
                activeApi.updateScene({
                    elements: activeApi.getSceneElements().map(el => {
                        if (selectedIds[el.id]) {
                            return { ...el, opacity: val };
                        }
                        return el;
                    })
                });
            }
        }
    });
    
    const dividers = toolbarStack.querySelectorAll('.App-toolbar__divider');
    const divider = dividers[dividers.length - 1] || null;
    if (divider) {
        toolbarStack.insertBefore(label, divider);
    } else {
        toolbarStack.appendChild(label);
    }
    console.log('[Jitsi custom-config] Custom Excalidraw Highlighter tool button injected successfully');
};

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
                    const newStream = new MediaStream([desktopTrack]);
                    window.videoBgElement.srcObject = newStream;
                    window.videoBgElement.play().catch(err => console.error("Error playing video:", err));
                    document.body.classList.add('whiteboard-screenshare-active');
                    
                    window.hasAlignedTopLeft = false;

                    if (window.APP && window.APP.store) {
                        const wbState = window.APP.store.getState()['features/whiteboard'];
                        const isWBOpen = !!(wbState && wbState.isOpen);
                        if (!isWBOpen) {
                            console.log("🖥️ [GIÁO VIÊN] Share màn hình thành công! Tự động bật Bảng trắng.");
                            window.APP.store.dispatch({
                                type: 'SET_WHITEBOARD_OPEN',
                                isOpen: true
                            });
                        }
                    }
                }
            } else {
                if (window.videoBgElement.srcObject) {
                    window.videoBgElement.srcObject = null;
                    document.body.classList.remove('whiteboard-screenshare-active');
                }
            }
        } catch (err) {
            console.error("❌ Error in screenshare monitor loop:", err);
        }
    }, 1000);

    // SAFE CAMERA LOCK: Căn lề góc (0,0) và Zoom tương thích kích thước màn hình
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

    window.addEventListener('mouseup', () => { lastWidth = 0; });
    window.addEventListener('touchend', () => { lastWidth = 0; });

    const isTargetWhiteboard = (target) => {
        if (!target) return false;
        if (typeof target.closest !== 'function') return false;
        return target.closest('.excalidraw-container') || target.closest('.whiteboard-container');
    };

    window.addEventListener('wheel', (e) => {
        if (isTargetWhiteboard(e.target)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    window.addEventListener('pointerdown', (e) => {
        if (isTargetWhiteboard(e.target) && e.button === 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    window.addEventListener('touchmove', (e) => {
        if (isTargetWhiteboard(e.target) && e.touches && e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { capture: true, passive: false });

    window.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.contentEditable === 'true');
        
        if (!isInput) {
            if (e.key.toLowerCase() === 'h' || e.code === 'KeyH') {
                e.stopPropagation();
                e.preventDefault();
            }
            if (e.code === 'Space' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }, true);

    setInterval(() => {
        try {
            const docs = [document];
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentDocument) docs.push(iframe.contentDocument);
                } catch (e) {}
            });

            docs.forEach(doc => {
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

// Override Canvas fillRect to block Excalidraw's solid white background fills ONLY during screenshare
if (typeof CanvasRenderingContext2D !== 'undefined') {
    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        const isScreenshareActive = document.body && document.body.classList.contains('whiteboard-screenshare-active');
        if (isScreenshareActive && this.canvas && this.canvas.className && typeof this.canvas.className === 'string' && this.canvas.className.includes('excalidraw__canvas')) {
            const fillStyleStr = String(this.fillStyle).toLowerCase().trim();
            if (fillStyleStr === '#ffffff' || fillStyleStr === 'rgb(255, 255, 255)' || fillStyleStr === '#fff' || fillStyleStr === 'white' || 
                fillStyleStr === '#f8f9fa' || fillStyleStr === '#f1f3f5' || fillStyleStr === '#e9ecef' || fillStyleStr === '#dee2e6') {
                this.clearRect(x, y, w, h);
                return;
            }
        }
        return originalFillRect.apply(this, arguments);
    };
}

// Student screenshare & whiteboard auto sync
if (typeof window !== 'undefined') {
    let lastWhiteboardOpen = false;
    setInterval(() => {
        try {
            if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const participantsState = state['features/base/participants'] || {};
                let isStudent = false;
                const localP = Object.values(participantsState).find(p => p && p.local);
                if (localP) {
                    isStudent = localP.role !== 'moderator';
                }
                if (!isStudent && typeof config !== 'undefined' && typeof config.isStudent !== 'undefined') {
                    isStudent = !!config.isStudent;
                }
                
                if (isStudent) {
                    if (document.documentElement && !document.documentElement.classList.contains('is-student')) {
                        document.documentElement.classList.add('is-student');
                    }
                    if (document.body && !document.body.classList.contains('is-student')) {
                        document.body.classList.add('is-student');
                    }
                } else {
                    if (document.documentElement && document.documentElement.classList.contains('is-student')) {
                        document.documentElement.classList.remove('is-student');
                    }
                    if (document.body && document.body.classList.contains('is-student')) {
                        document.body.classList.remove('is-student');
                    }
                }
                
                if (isStudent) {
                    const whiteboardState = state['features/whiteboard'];
                    const isWhiteboardOpen = !!(whiteboardState && whiteboardState.isOpen);
                    const isTileView = !!(state['features/video-layout'] && state['features/video-layout'].tileViewEnabled);
                    
                    if (isWhiteboardOpen) {
                        // When Whiteboard is active: Turn OFF Grid View & Pin Whiteboard for Student
                        if (isTileView) {
                            window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled: false });
                        }
                        const currentPinned = state['features/large-video']?.participantId;
                        if (currentPinned !== 'whiteboard') {
                            console.log("📌 [HỌC VIÊN] Tự động ghim Bảng trắng làm màn hình chính 100%");
                            window.APP.store.dispatch({
                                type: 'PIN_PARTICIPANT',
                                participant: { id: 'whiteboard' }
                            });
                        }
                    } else {
                        // When Whiteboard is CLOSED: Enable Grid View for Student
                        if (!isTileView && !window.hasAutoEnabledTileViewOnWbClose) {
                            window.hasAutoEnabledTileViewOnWbClose = true;
                            console.log("🔳 [HỌC VIÊN] Bảng trắng tắt -> Tự động mở chế độ Lưới (Grid View)");
                            window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled: true });
                        }
                    }

                    if (isWhiteboardOpen !== lastWhiteboardOpen) {
                        lastWhiteboardOpen = isWhiteboardOpen;
                        window.hasAutoEnabledTileViewOnWbClose = false;
                        console.log("📢📢📢 [HỌC VIÊN] Trạng thái Bảng trắng thay đổi: isOpen =", isWhiteboardOpen);
                        window.APP.store.dispatch({
                            type: 'SET_WHITEBOARD_OPEN',
                            isOpen: isWhiteboardOpen
                        });
                    }
                }
            }
        } catch (err) {}
    }, 1000);
}

// Dynamic breakout room whiteboard key synchronization and alert suppression
(function() {
    if (typeof window === 'undefined') return;

    let lastRoomJID = null;
    let lastInBreakout = null;
    setInterval(() => {
        try {
            if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const currentRoomJID = String(state['features/base/conference']?.room || '').toLowerCase();
                const breakoutState = state['features/breakout-rooms'];
                const mainRoomJid = String(breakoutState?.mainRoom?.jid || breakoutState?.mainRoom?.id || '').toLowerCase();
                
                let isInBreakout = false;
                if (mainRoomJid && currentRoomJID) {
                    const cleanCurrent = currentRoomJID.split('@')[0];
                    const cleanMain = mainRoomJid.split('@')[0];
                    isInBreakout = (cleanCurrent !== cleanMain);
                } else if (currentRoomJID.includes('breakout')) {
                    isInBreakout = true;
                }
                
                if (lastInBreakout !== isInBreakout) {
                    lastInBreakout = isInBreakout;
                    console.log('[Jitsi custom-config] Posting BREAKOUT_ROOM_STATUS to parent:', isInBreakout, '(current:', currentRoomJID, ', main:', mainRoomJid, ')');
                    window.parent.postMessage({ type: 'BREAKOUT_ROOM_STATUS', inBreakout: isInBreakout }, '*');
                }

                if (currentRoomJID && currentRoomJID !== lastRoomJID) {
                    const prevRoom = lastRoomJID;
                    lastRoomJID = currentRoomJID;
                    
                    if (prevRoom !== null) {
                        console.log(`[Jitsi custom-config] Room changed from ${prevRoom} to ${currentRoomJID}. Resetting whiteboard...`);
                        
                        window.APP.store.dispatch({
                            type: 'RESET_WHITEBOARD'
                        });
                        
                        const isWhiteboardOpen = !!(state['features/whiteboard'] && state['features/whiteboard'].isOpen);
                        if (isWhiteboardOpen) {
                            console.log('[Jitsi custom-config] Whiteboard was open during room change. Force toggling off and on...');
                            window.APP.store.dispatch({
                                type: 'SET_WHITEBOARD_OPEN',
                                isOpen: false
                            });
                            setTimeout(() => {
                                window.APP.store.dispatch({
                                    type: 'SET_WHITEBOARD_OPEN',
                                    isOpen: true
                                });
                            }, 500);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[Jitsi custom-config] Error in room change / whiteboard reset listener:', e);
        }
    }, 1000);

    const isSuppressedErrorMsg = (msg) => {
        if (!msg) return false;
        const s = String(msg).toLowerCase();
        return s.includes('operationerror') ||
               s.includes('decryptpayload') ||
               s.includes('decrypt') ||
               s.includes('giải mã') ||
               s.includes('decryptfailed');
    };

    const overrideWindowErrors = (win) => {
        if (!win || win.hasOverriddenAlertAndError) return;
        win.hasOverriddenAlertAndError = true;

        const originalAlert = win.alert;
        win.alert = function(msg) {
            if (isSuppressedErrorMsg(msg)) {
                console.warn('[Jitsi custom-config] Suppressed alert:', msg);
                return;
            }
            if (typeof originalAlert === 'function') {
                return originalAlert.apply(this, arguments);
            }
        };

        win.addEventListener('unhandledrejection', (event) => {
            const reason = event.reason ? (event.reason.message || String(event.reason)) : '';
            if (isSuppressedErrorMsg(reason)) {
                event.preventDefault();
                event.stopPropagation();
                console.warn('[Jitsi custom-config] Suppressed unhandled rejection:', reason);
            }
        }, true);

        win.addEventListener('error', (event) => {
            const msg = event.message || String(event.error || '');
            if (isSuppressedErrorMsg(msg)) {
                event.preventDefault();
                event.stopPropagation();
                console.warn('[Jitsi custom-config] Suppressed window error:', msg);
            }
        }, true);
    };

    overrideWindowErrors(window);

    setInterval(() => {
        try {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeWindow = iframe.contentWindow;
                    if (iframeWindow) overrideWindowErrors(iframeWindow);
                } catch (e) {}

                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        const errorModals = iframeDoc.querySelectorAll('[class*="ErrorDialog"], [class*="error-dialog"], .excalidraw-modal-container');
                        errorModals.forEach(el => {
                            const text = el.textContent || '';
                            if (isSuppressedErrorMsg(text)) {
                                el.style.setProperty('display', 'none', 'important');
                                console.log('[Jitsi custom-config] Hidden Excalidraw error modal dialog');
                            }
                        });
                    }
                } catch (e) {}
            });
        } catch (e) {}
    }, 500);
})();

// Auto unpin screen share and pin whiteboard on Student screen whenever screen share status changes
(function() {
    if (typeof window === 'undefined') return;

    let lastScreenShareState = false;

    setInterval(() => {
        try {
            if (!window.APP || !window.APP.store) return;
            
            // const isStudent = checkIfStudent();
            // if (!isStudent) return;

            const state = window.APP.store.getState();
            const tracks = state['features/base/tracks'] || [];

            const isScreenSharing = tracks.some(t => t && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted);

            if (isScreenSharing !== lastScreenShareState) {
                lastScreenShareState = isScreenSharing;

                console.log('📢📢📢 [MÀN HỌC VIÊN] Bắt được sự kiện Share màn hình -> Bỏ ghim Share, Ghim Bảng trắng');

                window.APP.store.dispatch({
                    type: 'PIN_PARTICIPANT',
                    participant: { id: null }
                });

                const isWbOpen = !!(state['features/whiteboard'] && state['features/whiteboard'].isOpen);
                if (isWbOpen) {
                    window.APP.store.dispatch({
                        type: 'PIN_PARTICIPANT',
                        participant: { id: 'whiteboard' }
                    });
                }

                // Đảm bảo dải filmstrip của Học viên vẫn giữ 360px khi tắt share màn hình ở màn lớn > 1100px
                if (window.innerWidth > 1100) {
                    setTimeout(() => {
                        try {
                            window.APP.store.dispatch({
                                type: 'SET_FILMSTRIP_WIDTH',
                                width: 360
                            });
                        } catch (e) {}
                    }, 200);
                }
            }
        } catch (e) {}
    }, 500);
})();

// Floating Pen Toggle Button for Excalidraw Toolbar
(function setupExcalidrawToolbarToggle() {
    if (typeof window === 'undefined') return;

    let isToolbarVisible = false; // Default HIDDEN

    setInterval(() => {
        try {
            const docs = [document];
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) docs.push(iframeDoc);
                } catch (e) {}
            });

            docs.forEach(doc => {
                const excalidrawContainer = doc.querySelector('.excalidraw') || doc.querySelector('.excalidraw-container') || doc.querySelector('.whiteboard-container');
                const existingBtn = doc.getElementById('custom-pen-toggle-btn');

                // Check accurately if screenshare is active (via class on body or live desktop video track)
                const isScreenshareActive = !!(
                    (document.body && document.body.classList.contains('whiteboard-screenshare-active')) ||
                    (doc.body && doc.body.classList.contains('whiteboard-screenshare-active')) ||
                    (window.videoBgElement && window.videoBgElement.srcObject && window.videoBgElement.srcObject.getVideoTracks && window.videoBgElement.srcObject.getVideoTracks().some(t => t.readyState === 'live' && t.enabled))
                );

                // IF NOT SCREENSHARING or NO WHITEBOARD: Hide pen button & restore original toolbar
                if (!excalidrawContainer || !isScreenshareActive) {
                    if (existingBtn) existingBtn.style.setProperty('display', 'none', 'important');
                    if (excalidrawContainer) {
                        const toolbars = doc.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
                        toolbars.forEach(tb => {
                            tb.style.removeProperty('display');
                        });
                    }
                    return;
                }

                // Apply toolbar visibility state directly to toolbar elements
                const toolbars = doc.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
                toolbars.forEach(tb => {
                    if (!isToolbarVisible) {
                        tb.style.setProperty('display', 'none', 'important');
                    } else {
                        tb.style.removeProperty('display');
                        tb.style.setProperty('display', 'flex', 'important');
                    }
                });

                // Inject CSS for floating pen button styling (Bottom Left Corner)
                if (!doc.getElementById('custom-excalidraw-toggle-css')) {
                    const style = doc.createElement('style');
                    style.id = 'custom-excalidraw-toggle-css';
                    style.textContent = `
                        /* Floating Pen Toggle Button - Bottom Left Corner */
                        .custom-pen-toggle-btn {
                            position: fixed !important;
                            bottom: 85px !important;
                            left: 24px !important;
                            width: 52px !important;
                            height: 52px !important;
                            border-radius: 50% !important;
                            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
                            color: #ffffff !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5), 0 4px 12px rgba(0,0,0,0.3) !important;
                            cursor: pointer !important;
                            z-index: 9999999 !important;
                            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                            border: 2.5px solid rgba(255, 255, 255, 0.35) !important;
                            user-select: none !important;
                        }
                        .custom-pen-toggle-btn:hover {
                            transform: scale(1.08) !important;
                            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.65) !important;
                        }
                        .custom-pen-toggle-btn:active {
                            transform: scale(0.94) !important;
                        }
                        .custom-pen-toggle-btn.active {
                            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
                            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5) !important;
                        }
                    `;
                    doc.head.appendChild(style);
                }

                // Create or update floating toggle button at bottom left
                let toggleBtn = doc.getElementById('custom-pen-toggle-btn');
                if (!toggleBtn) {
                    toggleBtn = doc.createElement('div');
                    toggleBtn.id = 'custom-pen-toggle-btn';
                    toggleBtn.className = 'custom-pen-toggle-btn';
                    toggleBtn.title = 'Hiện/Ẩn Thanh công cụ vẽ';
                    toggleBtn.innerHTML = `
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    `;

                    toggleBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        isToolbarVisible = !isToolbarVisible;

                        // Instantly toggle all toolbar elements across all documents
                        docs.forEach(d => {
                            const tbs = d.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
                            tbs.forEach(tb => {
                                if (isToolbarVisible) {
                                    tb.style.removeProperty('display');
                                    tb.style.setProperty('display', 'flex', 'important');
                                } else {
                                    tb.style.setProperty('display', 'none', 'important');
                                }
                            });
                            const btn = d.getElementById('custom-pen-toggle-btn');
                            if (btn) {
                                if (isToolbarVisible) {
                                    btn.classList.add('active');
                                } else {
                                    btn.classList.remove('active');
                                }
                            }
                        });
                    });

                    (doc.body || excalidrawContainer).appendChild(toggleBtn);
                    console.log('[Jitsi custom-config] Custom Excalidraw floating Pen button injected at Bottom Left');
                } else {
                    toggleBtn.style.setProperty('display', 'flex', 'important');
                    if (isToolbarVisible) {
                        toggleBtn.classList.add('active');
                    } else {
                        toggleBtn.classList.remove('active');
                    }
                }
            });
        } catch (e) {}
    }, 400);
})();


/* --- MODULE: 03-toolbar-and-games.js --- */
// ==========================================
// 3. TOOLBAR & CLASSROOM GAMES INTEGRATION
// ==========================================

// Create the Clock button for Jitsi's bottom toolbar
const createToolbarClockButton = (doc) => {
    const btnWrapper = doc.createElement('div');
    btnWrapper.className = 'toolbox-button-wrapper';
    btnWrapper.id = 'custom-jitsi-timer-btn';
    
    btnWrapper.innerHTML = `
        <div aria-disabled="false" aria-label="Đồng hồ bấm giờ" class="toolbox-button" role="button" tabindex="0" title="Đồng hồ bấm giờ" style="cursor: pointer;">
            <div class="toolbox-icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>
        </div>
    `;
    
    btnWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Jitsi] Clock button clicked, sending TOGGLE_TIMER_CARD');
        window.parent.postMessage({ type: 'TOGGLE_TIMER_CARD' }, '*');
    });
    
    return btnWrapper;
};

// Helper to robustly check if the current participant is a student
const checkIfStudent = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
        if (window.location.hash.includes('config.isStudent=true')) {
            return true;
        }
        if (window.location.hash.includes('config.isStudent=false')) {
            return false;
        }
    }
    
    try {
        if (typeof window !== 'undefined' && window.APP && window.APP.store) {
            const state = window.APP.store.getState();
            const localParticipant = state['features/base/participants']?.find(p => p.local);
            if (localParticipant) {
                return localParticipant.role !== 'moderator';
            }
        }
    } catch (e) {}
    
    if (typeof config !== 'undefined' && typeof config.isStudent !== 'undefined') {
        return !!config.isStudent;
    }
    
    return true;
};

const findCameraWrapper = (doc) => {
    const toolbarContainer = doc.querySelector('.toolbox-content-items');
    if (!toolbarContainer) return null;
    const wrappers = toolbarContainer.children;
    for (let i = 0; i < wrappers.length; i++) {
        const w = wrappers[i];
        
        if (w.id === 'custom-jitsi-tools-btn' || w.id === 'custom-jitsi-divider') {
            continue;
        }
        
        const testId = String(w.getAttribute('data-testid') || '').toLowerCase();
        if (testId.includes('camera') || testId.includes('video') || testId.includes('cam')) {
            return w;
        }
        
        const innerBtn = w.querySelector('[data-testid*="camera" i], [data-testid*="video" i], [data-testid*="cam" i], [aria-label*="camera" i], [aria-label*="video" i], [aria-label*="cam" i], [aria-label*="ảnh" i]');
        if (innerBtn) {
            return w;
        }
        
        const html = w.innerHTML.toLowerCase();
        if (html.includes('camera') || html.includes('video') || html.includes('tắt camera') || html.includes('bật camera') || html.includes('webcam')) {
            return w;
        }
    }
    return null;
};

const injectToolbarDivider = (doc, camWrapper) => {
    if (!camWrapper) return;
    let divider = doc.getElementById('custom-jitsi-divider');
    if (!divider) {
        divider = doc.createElement('div');
        divider.id = 'custom-jitsi-divider';
        divider.className = 'toolbox-button-wrapper';
        divider.style.cssText = 'width: 16px !important; min-width: 16px !important; height: 48px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; margin: 0 4px !important;';
        divider.innerHTML = `
            <div style="width: 1px; height: 24px; background-color: rgba(255, 255, 255, 0.3); align-self: center;"></div>
        `;
    }
    if (camWrapper.nextSibling !== divider) {
        camWrapper.parentNode.insertBefore(divider, camWrapper.nextSibling);
    }
};

// Create the Classroom Tools & Games dropdown menu button for Jitsi's bottom toolbar
const createToolbarToolsButton = (doc) => {
    const btnWrapper = doc.createElement('div');
    btnWrapper.className = 'toolbox-button-wrapper';
    btnWrapper.id = 'custom-jitsi-tools-btn';
    btnWrapper.style.position = 'relative';
    
    btnWrapper.innerHTML = `
        <div aria-disabled="false" aria-label="Trò chơi & Công cụ" class="toolbox-button" role="button" tabindex="0" title="Trò chơi & Công cụ lớp học" style="cursor: pointer;">
            <div class="toolbox-icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 21px; height: 21px;">
                    <line x1="6" y1="12" x2="10" y2="12"></line>
                    <line x1="8" y1="10" x2="8" y2="14"></line>
                    <circle cx="15" cy="11" r="1" fill="currentColor"></circle>
                    <circle cx="17.5" cy="13.5" r="1" fill="currentColor"></circle>
                    <rect x="2" y="6" width="20" height="12" rx="4"></rect>
                </svg>
            </div>
        </div>
        <div id="custom-jitsi-tools-menu" style="display: none; position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%); background: #141b2d; border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 6px; width: 195px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); z-index: 99999; font-family: system-ui, -apple-system, sans-serif;">
            <button id="tool-item-timer" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">⏱️</span> Đồng hồ đếm ngược
            </button>
            <button id="tool-item-praise" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">⭐</span> Khen thưởng học viên
            </button>
            <button id="tool-item-dice" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">🎲</span> Đổ Xí Ngầu (Dice)
            </button>
            <button id="tool-item-wheel" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">🎡</span> Vòng quay may mắn
            </button>
        </div>
    `;
    
    const iconBtn = btnWrapper.querySelector('.toolbox-button');
    const menu = btnWrapper.querySelector('#custom-jitsi-tools-menu');

    iconBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = menu.style.display === 'none';
        menu.style.display = isHidden ? 'block' : 'none';
    });

    doc.addEventListener('click', (e) => {
        if (!btnWrapper.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    const timerBtn = btnWrapper.querySelector('#tool-item-timer');
    if (timerBtn) {
        timerBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); menu.style.display = 'none';
            window.parent.postMessage({ type: 'TOGGLE_TIMER' }, '*');
        });
    }

    const praiseBtn = btnWrapper.querySelector('#tool-item-praise');
    if (praiseBtn) {
        praiseBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); menu.style.display = 'none';
            window.parent.postMessage({ type: 'TRIGGER_PRAISE' }, '*');
        });
    }

    const diceBtn = btnWrapper.querySelector('#tool-item-dice');
    if (diceBtn) {
        diceBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); menu.style.display = 'none';
            window.parent.postMessage({ type: 'TRIGGER_DICE' }, '*');
        });
    }

    const wheelBtn = btnWrapper.querySelector('#tool-item-wheel');
    if (wheelBtn) {
        wheelBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); menu.style.display = 'none';
            window.parent.postMessage({ type: 'TRIGGER_WHEEL' }, '*');
        });
    }
    
    return btnWrapper;
};

// Inject the custom Jitsi toolbar tools & games dropdown menu button
const injectToolbarToolsButton = () => {
    if (checkIfStudent()) return;

    let toolbarContainer = null;
    let targetDoc = document;
    
    const findToolboxContent = (doc) => {
        return doc.querySelector('.toolbox-content-items');
    };
    
    toolbarContainer = findToolboxContent(document);
    
    if (!toolbarContainer) {
        const iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
                if (iframeDoc) {
                    const container = findToolboxContent(iframeDoc);
                    if (container) {
                        toolbarContainer = container;
                        targetDoc = iframeDoc;
                        break;
                    }
                }
            } catch (e) {}
        }
    }
    
    if (!toolbarContainer) return;
    
    const oldTimerBtn = targetDoc.getElementById('custom-jitsi-timer-btn');
    if (oldTimerBtn) oldTimerBtn.remove();
    const oldPraiseBtn = targetDoc.getElementById('custom-jitsi-praise-btn');
    if (oldPraiseBtn) oldPraiseBtn.remove();

    let btn = targetDoc.getElementById('custom-jitsi-tools-btn');
    if (!btn) {
        btn = createToolbarToolsButton(targetDoc);
    }
    
    const camWrapper = findCameraWrapper(targetDoc);
    if (camWrapper) {
        injectToolbarDivider(targetDoc, camWrapper);
        const divider = targetDoc.getElementById('custom-jitsi-divider');
        if (divider && btn.previousSibling !== divider) {
            divider.parentNode.insertBefore(btn, divider.nextSibling);
        }
    }
};

// Dynamically hide only the "Ẩn bảng" (Hide board) action button
if (typeof window !== 'undefined') {
    setInterval(() => {
        try {
            const docs = [document];
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) docs.push(iframeDoc);
                } catch (e) {}
            });

            docs.forEach(doc => {
                const menuItems = doc.querySelectorAll('[role="button"], [role="menuitem"]');
                menuItems.forEach(item => {
                    const label = item.getAttribute('aria-label') || '';
                    const text = item.textContent || '';
                    
                    const isHideAction = label === 'Ẩn bảng' || label === 'Hide board' || label === 'Hide whiteboard' || 
                                         text.trim() === 'Ẩn bảng' || text.trim() === 'Hide board' || text.trim() === 'Hide whiteboard';
                                         
                    const isShowAction = label === 'Bảng trắng' || label === 'Bật bảng' || label === 'Mở bảng' || label === 'Whiteboard' ||
                                         text.trim() === 'Bảng trắng' || text.trim() === 'Bật bảng' || text.trim() === 'Mở bảng' || text.trim() === 'Whiteboard';

                    if (isHideAction) {
                        item.style.setProperty('display', 'none', 'important');
                    } else if (isShowAction) {
                        item.style.setProperty('display', '', '');
                    }
                });
            });
        } catch (e) {}
    }, 200);
}

// Hide Student Screenshare button by default, unhide only when Teacher grants permission
(function setupStudentScreenshareToggle() {
    if (typeof window === 'undefined') return;

    window.allowStudentScreenshare = false;

    setInterval(() => {
        try {
            const isStudent = checkIfStudent();
            if (!isStudent) return; // Moderator always sees desktop share button

            const docs = [document];
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) docs.push(iframeDoc);
                } catch (e) {}
            });

            docs.forEach(doc => {
                const shareBtns = doc.querySelectorAll(
                    '[data-testid="share-your-screen"], [data-testid="desktop"], ' +
                    'button[aria-label*="share"], button[aria-label*="Desktop"], button[aria-label*="màn hình"], button[aria-label*="chia sẻ màn hình"], ' +
                    '.toolbox-button[aria-label*="desktop"], .toolbox-button[aria-label*="share"], .toolbox-button[aria-label*="màn hình"]'
                );

                shareBtns.forEach(btn => {
                    const container = btn.closest('.toolbox-button-wrapper') || btn.closest('.toolbox-button') || btn;
                    if (!window.allowStudentScreenshare) {
                        container.style.setProperty('display', 'none', 'important');
                    } else {
                        container.style.removeProperty('display');
                        container.style.setProperty('display', 'inline-flex', 'important');
                    }
                });
            });
        } catch (e) {}
    }, 300);
})();


/* --- MODULE: 04-pip-manager.js --- */
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


/* --- MODULE: 05-events-and-messaging.js --- */
// ==========================================
// 5. EVENTS & MESSAGING INTEGRATION
// ==========================================

// Global ticking audio instance tracking to prevent layering
window.currentTickAudio = null;

if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        if (!event.data) return;

        if (event.data.type === 'PLAY_TICK_SOUND') {
            const seconds = typeof event.data.seconds === 'number' ? event.data.seconds : 0;
            const timerMode = typeof event.data.timerMode === 'string' ? event.data.timerMode : 'UP';
            const origin = event.data.origin || '';
            
            try {
                if (timerMode === 'DOWN' && seconds === 0) {
                    if (window.currentTickAudio) {
                        window.currentTickAudio.pause();
                    }
                    const alarmPath = origin ? `${origin}/images/phone-ring-medium.mp3` : '/images/phone-ring-medium.mp3';
                    window.currentTickAudio = new Audio(alarmPath);
                    window.currentTickAudio.play().catch(() => {});
                    return;
                }

                const tickPath = origin ? `${origin}/images/quartz-clock.mp3` : '/images/quartz-clock.mp3';
                
                if (!window.currentTickAudio || window.currentTickAudio.src !== new URL(tickPath, window.location.href).href) {
                    window.currentTickAudio = new Audio(tickPath);
                }
                
                if (timerMode === 'DOWN' && seconds <= 10 && seconds > 0) {
                    window.currentTickAudio.playbackRate = 3.0;
                } else {
                    window.currentTickAudio.playbackRate = 1.0;
                }
                
                window.currentTickAudio.currentTime = 0;
                window.currentTickAudio.play().catch(() => {});
            } catch (e) {
                console.warn('[Timer sound] Failed to play sound:', e);
            }
        }

        if (event.data.type === 'STOP_TICK_SOUND') {
            try {
                if (window.currentTickAudio) {
                    const src = window.currentTickAudio.src || '';
                    if (!src.includes('phone-ring-medium.mp3')) {
                        window.currentTickAudio.pause();
                    }
                }
            } catch (e) {}
        }

        if (event.data.type === 'LEAVE_BREAKOUT_ROOM') {
            console.log('[Jitsi custom-config] LEAVE_BREAKOUT_ROOM message received:', event.data);
            try {
                if (window.APP && window.APP.store) {
                    const state = window.APP.store.getState();
                    const breakoutState = state['features/breakout-rooms'] || {};
                    const rooms = breakoutState.rooms || {};
                    
                    let mainRoom = Object.values(rooms).find(r => r && (r.isMainRoom || r.id === 'main'));
                    if (!mainRoom && breakoutState.mainRoom) {
                        mainRoom = breakoutState.mainRoom;
                    }
                    
                    let targetJid = mainRoom?.jid || mainRoom?.id;
                    if (!targetJid) {
                        const foundMain = Object.values(rooms).find(r => r && !r.isMainRoom === false);
                        targetJid = foundMain?.jid || foundMain?.id;
                    }

                    if (targetJid) {
                        console.log('[Jitsi custom-config] Moving participant to main room JID:', targetJid);
                        window.APP.store.dispatch({
                            type: 'BREAKOUT_ROOMS_MOVE_TO_ROOM',
                            roomJid: targetJid
                        });
                    } else {
                        console.log('[Jitsi custom-config] Fallback: calling APP.conference.leaveBreakoutRoom()');
                        if (window.APP.conference && typeof window.APP.conference.leaveBreakoutRoom === 'function') {
                            window.APP.conference.leaveBreakoutRoom();
                        }
                    }
                }
            } catch (e) {
                console.error('[Jitsi custom-config] Error leaving breakout room:', e);
            }
        }
    });
}

// Highlight speaking participants in real-time based on audio indicator dot opacities
if (typeof window !== 'undefined') {
    setInterval(() => {
        try {
            const cards = document.querySelectorAll('.videocontainer, .video-preview, [id^="participant_"]');
            cards.forEach(card => {
                const indicator = card.querySelector('.audioindicator-container');
                if (indicator) {
                    const dots = indicator.querySelectorAll('.audiodot-bottom, .audiodot-middle, .audiodot-top');
                    let maxOpacity = 0;
                    dots.forEach(dot => {
                        const op = parseFloat(dot.style.opacity || '0');
                        if (op > maxOpacity) {
                            maxOpacity = op;
                        }
                    });

                    if (maxOpacity > 0.5) {
                        card.style.outline = '3px solid #00FF7F';
                        card.style.outlineOffset = '-3px';
                        card.style.boxShadow = '0 0 15px rgba(0, 255, 127, 0.8)';
                    } else {
                        card.style.outline = '';
                        card.style.outlineOffset = '';
                        card.style.boxShadow = '';
                    }
                } else {
                    card.style.outline = '';
                    card.style.outlineOffset = '';
                    card.style.boxShadow = '';
                }
            });
        } catch (e) {}
    }, 200);
}

// Listen to postMessage from parent application for timer notifications & excalidraw opacity
if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        try {
            if (event.data && event.data.type === 'HIDE_TIMER_NOTIF') {
                console.log('[Jitsi custom-config] HIDE_TIMER_NOTIF message received');
                const notifContainer = document.getElementById('notifications-container') ||
                    document.querySelector('[aria-live="polite"]') ||
                    document.querySelector('[aria-live="assertive"]');
                if (notifContainer) {
                    notifContainer.style.display = 'none';
                }
            } else if (event.data && event.data.type === 'SHOW_TIMER_NOTIF') {
                console.log('[Jitsi custom-config] SHOW_TIMER_NOTIF message received');
                const notifContainer = document.getElementById('notifications-container') ||
                    document.querySelector('[aria-live="polite"]') ||
                    document.querySelector('[aria-live="assertive"]');
                if (notifContainer) {
                    notifContainer.style.display = '';
                }
            } else if (event.data && event.data.type === 'SET_EXCALIDRAW_OPACITY') {
                const val = event.data.opacity;
                console.log('[Jitsi custom-config] SET_EXCALIDRAW_OPACITY message received:', val);
                const activeApi = typeof findExcalidrawAPI === 'function' ? findExcalidrawAPI() : null;
                if (activeApi) {
                    activeApi.updateScene({
                        appState: {
                            currentItemOpacity: val
                        }
                    });
                    
                    const selectedIds = activeApi.getAppState()?.selectedElementIds || {};
                    if (Object.keys(selectedIds).length > 0) {
                        activeApi.updateScene({
                            elements: activeApi.getSceneElements().map(el => {
                                if (selectedIds[el.id]) {
                                    return { ...el, opacity: val };
                                }
                                return el;
                            })
                        });
                    }
                }
            }
        } catch (err) {
            console.error('[Jitsi custom-config] Error in message listener:', err);
        }
    });

    const isSystemMessageNode = (node) => {
        if (!node || node.nodeType !== 1) return false;
        const text = node.textContent || '';
        const html = node.innerHTML || '';
        return (
            text.includes('__TIMER__') ||
            text.includes('TIMER_ACTION') ||
            text.includes('__CLK__') ||
            text.includes('__PRAISE__') ||
            text.includes('__WHEEL__') ||
            text.includes('__DICE__') ||
            text.includes('__TOGGLE_STUDENT_SCREENSHARE__') ||
            html.includes('__TIMER__') ||
            html.includes('TIMER_ACTION') ||
            html.includes('__CLK__') ||
            html.includes('__PRAISE__') ||
            html.includes('__WHEEL__') ||
            html.includes('__DICE__') ||
            html.includes('__TOGGLE_STUDENT_SCREENSHARE__')
        );
    };

    const setupNotificationObserver = () => {
        const notifContainer = document.getElementById('notifications-container') || 
            document.querySelector('[aria-live="polite"]') ||
            document.querySelector('[aria-live="assertive"]');
        if (notifContainer) {
            const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__'];
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const text = node.textContent || '';
                            const html = node.innerHTML || '';
                            if (systemKeywords.some(kw => text.includes(kw) || html.includes(kw))) {
                                node.style.setProperty('display', 'none', 'important');
                            }
                        }
                    });
                });
            });
            observer.observe(notifContainer, { childList: true, subtree: true });
            return true;
        }
        return false;
    };

    const getChatBadgeEl = () => {
        return document.querySelector('.badge-round > span') || null;
    };

    const getChatBadgeWrapper = () => {
        return document.querySelector('.badge-round') || null;
    };

    let timerMessagesCount = 0;
    let realMessagesCount = 0;

    const getRoom = () => {
        try {
            if (typeof APP !== 'undefined') {
                return APP.conference?._room || APP.conference?.room || null;
            }
        } catch (e) {}
        return null;
    };

    const isChatOpen = () => {
        try {
            if (typeof APP !== 'undefined' && APP.store) {
                return !!APP.store.getState()?.['features/chat']?.isOpen;
            }
        } catch (e) {}
        return !!(
            document.querySelector('[class*="chat-panel"]') ||
            document.querySelector('[class*="-chatConversation"]') ||
            document.querySelector('.chat-conversation') ||
            document.querySelector('[data-testid="chat-panel"]') ||
            document.querySelector('[class*="chat-container"]')
        );
    };

    const updateBadgeState = () => {
        if (isChatOpen()) {
            realMessagesCount = 0;
            timerMessagesCount = 0;
        }

        const badgeWrapper = getChatBadgeWrapper();
        const badgeEl = getChatBadgeEl();

        if (badgeWrapper) {
            if (realMessagesCount === 0) {
                if (badgeWrapper.style.display !== 'none') {
                    badgeWrapper.style.setProperty('display', 'none', 'important');
                }
            } else {
                if (badgeWrapper.style.display === 'none') {
                    badgeWrapper.style.removeProperty('display');
                }
                if (badgeEl) {
                    const nextVal = String(realMessagesCount);
                    if (badgeEl.textContent !== nextVal) {
                        badgeEl.textContent = nextVal;
                    }
                }
            }
        }
    };

    const setupMessageTracking = () => {
        const room = getRoom();
        if (!room) return false;
        try {
            room.on('conference.messageReceived', (id, text, ts) => {
                const myId = (typeof APP !== 'undefined' && APP.conference) ? APP.conference.getMyUserId() : null;
                const isFromMe = !!(myId && id === myId);

                let msgText = '';
                if (typeof text === 'string') {
                    msgText = text;
                } else if (text && typeof text.message === 'string') {
                    msgText = text.message;
                } else if (text && typeof text.text === 'string') {
                    msgText = text.text;
                }

                const isToggleStudentShare = msgText.startsWith('__TOGGLE_STUDENT_SCREENSHARE__:');
                const isPraise = msgText.includes('__PRAISE__');
                const isWheel = msgText.includes('__WHEEL__');
                const isDice = msgText.includes('__DICE__') || msgText.includes('__DICE_COUNT__');
                const isTimer = msgText.includes('__TIMER__') || 
                                msgText.includes('__CLK__') || 
                                msgText.includes('TIMER_ACTION');

                if (!isFromMe) {
                    if (isToggleStudentShare) {
                        const allowed = msgText.includes(':true');
                        console.log('[Jitsi custom-config] __TOGGLE_STUDENT_SCREENSHARE__ received:', allowed);
                        window.allowStudentScreenshare = allowed;
                        window.parent.postMessage({ type: 'STUDENT_SCREENSHARE_PERMITTED', allowed }, '*');
                    } else if (isPraise) {
                        const parts = msgText.split(':');
                        const index = parts[1] ? parseInt(parts[1], 10) : 0;
                        console.log('[Jitsi custom-config] __PRAISE__ received with index:', index);
                        window.parent.postMessage({ type: 'PLAY_PRAISE', index }, '*');
                    } else if (isDice) {
                        timerMessagesCount++;
                        if (msgText.startsWith('__DICE__:')) {
                            const payloadStr = msgText.slice('__DICE__:'.length);
                            try {
                                const payload = JSON.parse(payloadStr);
                                console.log('[Jitsi custom-config] __DICE__ payload received:', payload);
                                window.parent.postMessage({ type: 'DICE_ACTION', payload }, '*');
                            } catch (e) {
                                if (payloadStr === 'OPEN' || payloadStr === 'CLOSE') {
                                    window.parent.postMessage({ type: 'DICE_ACTION', payload: { action: payloadStr } }, '*');
                                } else {
                                    const results = payloadStr.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
                                    if (results.length > 0) {
                                        window.parent.postMessage({ type: 'DICE_ACTION', payload: { action: 'ROLL', results } }, '*');
                                    }
                                }
                            }
                        }
                    } else if (isWheel) {
                        timerMessagesCount++;
                        if (msgText.startsWith('__WHEEL__:')) {
                            const payloadStr = msgText.slice('__WHEEL__:'.length);
                            try {
                                const payload = JSON.parse(payloadStr);
                                window.parent.postMessage({ type: 'WHEEL_ACTION', payload }, '*');
                            } catch (e) {}
                        }
                    } else if (isTimer) {
                        timerMessagesCount++;
                    }
                } else if (isPraise || isDice || isWheel || isTimer || isToggleStudentShare) {
                    timerMessagesCount++;
                } else {
                    realMessagesCount++;
                }
                updateBadgeState();
            });
            return true;
        } catch (e) {
            return false;
        }
    };

    if (!setupMessageTracking()) {
        const trackingInterval = setInterval(() => {
            if (setupMessageTracking()) {
                clearInterval(trackingInterval);
            }
        }, 1000);
    }

    if (!setupNotificationObserver()) {
        const interval = setInterval(() => {
            if (setupNotificationObserver()) {
                clearInterval(interval);
            }
        }, 1000);
    }

    const hideTimerMessages = () => {
        const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__'];

        const wrappers = document.querySelectorAll('[class*="-chatMessageWrapper"]');
        wrappers.forEach((wrapper) => {
            const text = wrapper.textContent || '';
            if (systemKeywords.some(kw => text.includes(kw))) {
                if (wrapper.style.display !== 'none') {
                    wrapper.style.setProperty('display', 'none', 'important');
                }
            }
        });

        const notifItems = document.querySelectorAll('#notifications-container > *, [aria-live] > *, [class*="notification-item"], [class*="message-notification"]');
        notifItems.forEach((el) => {
            if (isSystemMessageNode(el)) {
                if (el.style.display !== 'none') {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        });
        
        updateBadgeState();

        if (typeof injectToolbarIcon === 'function') injectToolbarIcon();
        if (typeof injectToolbarToolsButton === 'function') injectToolbarToolsButton();
    };

    const setupChatObserver = () => {
        if (!document.body) return;
        const observer = new MutationObserver(() => {
            hideTimerMessages();
        });
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
        hideTimerMessages();
    };

    if (document.body) {
        setupChatObserver();
    } else {
        const bodyInterval = setInterval(() => {
            if (document.body) {
                clearInterval(bodyInterval);
                setupChatObserver();
            }
        }, 100);
    }
}

