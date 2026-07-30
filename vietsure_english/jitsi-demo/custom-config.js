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
config.startTileView = true;
config.settingsSections = ['devices', 'moderator', 'profile', 'calendar', 'sounds'];
config.disableSelfViewSettings = true;
config.disabledSounds = ['INCOMING_MSG_SOUND_ID', 'OUTGOING_MSG_SOUND_ID'];

// Block Jitsi chat incoming/outgoing message sound files
(function blockJitsiChatSounds() {
    if (typeof window === 'undefined') return;

    const origPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        const src = String(this.src || '').toLowerCase();
        if (
            src.includes('incomingmessage') ||
            src.includes('outgoingmessage') ||
            src.includes('incoming_msg') ||
            src.includes('outgoing_msg') ||
            src.includes('message')
        ) {
            this.muted = true;
            this.volume = 0;
            return Promise.resolve();
        }
        return origPlay.apply(this, arguments);
    };

    const OrigAudio = window.Audio;
    window.Audio = function(src) {
        const audio = new OrigAudio(src);
        const s = String(src || '').toLowerCase();
        if (
            s.includes('incomingmessage') ||
            s.includes('outgoingmessage') ||
            s.includes('incoming_msg') ||
            s.includes('outgoing_msg') ||
            s.includes('message')
        ) {
            audio.muted = true;
            audio.volume = 0;
        }
        return audio;
    };
    if (OrigAudio && OrigAudio.prototype) {
        window.Audio.prototype = OrigAudio.prototype;
    }
})();

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

        /* Hide whiteboard and shared video buttons in student's toolbar (on documentElement or body) */
        .is-student [data-testid="toolbox-whiteboard"],
        .is-student [data-testid="toolbox-shared-video"],
        .is-student .toolbox-button[aria-label*="Whiteboard"],
        .is-student .toolbox-button[aria-label*="Bảng trắng"],
        .is-student .toolbox-button[aria-label*="Ẩn bảng"],
        .is-student .toolbox-button[aria-label*="Hiện bảng"],
        .is-student .toolbox-button[aria-label*="Video"],
        .is-student .toolbox-button[aria-label*="video"],
        .is-student button[title*="Whiteboard"],
        .is-student button[title*="Bảng trắng"],
        .is-student button[title*="Ẩn bảng"],
        .is-student button[title*="Hiện bảng"],
        .is-student button[title*="Video"],
        .is-student button[title*="video"],
        .is-student [aria-label="Video"],
        .is-student [aria-label="video"] {
            display: none !important;
        }

        /* Filmstrip Container and Tile Spans Alignment for both Teacher & Student */
        .filmstrip__videos.remote-videos {
            align-items: center !important;
        }
        .filmstrip__videos.remote-videos > div {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            align-content: center !important;
            gap: 4px !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
        }
        .filmstrip__videos.remote-videos span.videocontainer {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            margin: 0 !important;
        }

        /* Hide whiteboard, screenshare, and shared video participant tiles safely on filmstrip for both Teacher and Student via CSS */
        #participant_whiteboard,
        #filmstripLocalScreenShare,
        #filmstripLocalScreenShareThumbnail,
        #sharedVideoContainer,
        span.videocontainer[id*="-v0"] {
            display: none !important;
        }

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

        /* Custom Tooltip Popup on Hover (Matches Jitsi Native Tooltip Style Exactly) */
        .custom-tooltip-popup {
            position: absolute !important;
            bottom: calc(100% + 10px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background-color: #040404 !important;
            color: #ffffff !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            line-height: 1.2 !important;
            font-family: -apple-system, BlinkMacSystemFont, open_sanslight, "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            white-space: nowrap !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
            pointer-events: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.12s ease-in-out, visibility 0.12s ease-in-out !important;
            z-index: 999999 !important;
        }

        .toolbox-button-wrapper:hover .custom-tooltip-popup {
            opacity: 1 !important;
            visibility: visible !important;
        }

        /* Standardize button hover background for custom buttons */
        .toolbox-content-items .toolbox-button {
            transition: background-color 0.16s ease-in-out !important;
            border-radius: 6px !important;
            flex-direction: column !important;
            align-items: center !important;
        }

        .toolbox-content-items .toolbox-button:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }

        /* Persistent text labels strictly ordered below each toolbar button icon */
        .custom-toolbar-label {
            display: block !important;
            order: 999 !important;
            font-size: 10px !important;
            line-height: 11px !important;
            color: rgba(255, 255, 255, 0.85) !important;
            text-align: center !important;
            margin-top: 1px !important;
            white-space: nowrap !important;
            font-family: -apple-system, BlinkMacSystemFont, open_sanslight, "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            font-weight: 500 !important;
            pointer-events: none !important;
            user-select: none !important;
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

        /* Commented out forced visibility for filmstrip toggle container to allow native auto-hide:
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
        */
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
                        background: #F0F6FE !important;
                        background-color: #F0F6FE !important;
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
    // Safety patch for React removeChild to prevent crashes when moving DOM elements between containers
    if (typeof Node !== 'undefined' && Node.prototype && !Node.prototype._safeRemoveChildPatched) {
        Node.prototype._safeRemoveChildPatched = true;
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function(child) {
            if (child && child.parentNode !== this) {
                if (child.parentNode) {
                    return child.parentNode.removeChild(child);
                }
                return child;
            }
            return originalRemoveChild.call(this, child);
        };
    }

    // Ẩn tile bảng trắng & màn share bằng JS ngầm cho cả Giáo viên & Học viên
    const hideFilmstripDistractions = () => {
        try {
            // Ẩn span whiteboard
            const whiteboard = document.getElementById('participant_whiteboard');
            if (whiteboard && whiteboard.style.display !== 'none') {
                whiteboard.style.setProperty('display', 'none', 'important');
            }

            // Ẩn span screenshare (id*="-v0")
            document.querySelectorAll('span.videocontainer[id*="-v0"]').forEach(el => {
                if (el.style.display !== 'none') {
                    el.style.setProperty('display', 'none', 'important');
                }
            });

            // Nếu có #filmstripLocalVideo, di chuyển an toàn vào đầu container remote-videos
            const localVideo = document.getElementById('filmstripLocalVideo');
            const remoteContainer = document.querySelector('.filmstrip__videos.remote-videos > div');
            if (localVideo && remoteContainer && !remoteContainer.contains(localVideo)) {
                remoteContainer.prepend(localVideo);
            }
        } catch (e) {}
    };
    setInterval(hideFilmstripDistractions, 1000);
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
    
    label.innerHTML = `
        <input class="ToolIcon_type_checkbox ToolIcon_size_medium" type="checkbox" style="display: none;">
        <div class="ToolIcon__icon">
            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.53 16.122l9.88-9.88a3 3 0 114.243 4.243l-9.88 9.88M9.53 16.122a3 3 0 11-4.243-4.242l9.88-9.88M9.53 16.122L5.29 20.36a1.5 1.5 0 11-2.122-2.121L7.41 14M18 10l-4-4" />
            </svg>
        </div>
    `;
    
    if (!targetDoc.getElementById('custom-highlighter-tool-style')) {
        const style = targetDoc.createElement('style');
        style.id = 'custom-highlighter-tool-style';
        style.textContent = `
            #custom-highlighter-tool.active .ToolIcon__icon {
                background-color: var(--color-primary-light, #e3e2fe) !important;
                color: var(--color-primary, #6965db) !important;
            }
            #custom-close-drawing-toolbar-btn .ToolIcon__icon {
                background-color: var(--button-destructive-bg-color, #ffe3e3) !important;
                color: var(--button-destructive-color, #c92a2a) !important;
                border-radius: var(--border-radius-lg, 0.5rem) !important;
                transition: background-color 0.15s ease, color 0.15s ease !important;
            }
            #custom-close-drawing-toolbar-btn:hover .ToolIcon__icon {
                background-color: #fca5a5 !important;
                color: #7f1d1d !important;
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

    // Inject Red X Close button right after Highlighter tool
    if (!targetDoc.getElementById('custom-close-drawing-toolbar-btn')) {
        const closeBtn = targetDoc.createElement('label');
        closeBtn.className = 'ToolIcon Shape';
        closeBtn.id = 'custom-close-drawing-toolbar-btn';
        closeBtn.title = 'Đóng thanh công cụ vẽ';

        closeBtn.innerHTML = `
            <input class="ToolIcon_type_button ToolIcon_size_medium" type="button" style="display: none;">
            <div class="ToolIcon__icon">
                <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
        `;

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Excalidraw] Red X button clicked -> Hiding drawing toolbar and showing Pen button');
            window.isExcalidrawToolbarVisible = false;

            const docs = [document];
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) docs.push(iframeDoc);
                } catch (err) {}
            });

            docs.forEach(d => {
                const toolbars = d.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
                toolbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
                const penBtn = d.getElementById('custom-pen-toggle-btn');
                if (penBtn) penBtn.style.setProperty('display', 'flex', 'important');
            });
        });

        if (label && label.nextSibling) {
            label.parentNode.insertBefore(closeBtn, label.nextSibling);
        } else if (label && label.parentNode) {
            label.parentNode.appendChild(closeBtn);
        }
    }
    console.log('[Jitsi custom-config] Custom Excalidraw Highlighter & Close buttons injected successfully');
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
                
                // if (isStudent) {
                //     const whiteboardState = state['features/whiteboard'];
                //     const isWhiteboardOpen = !!(whiteboardState && whiteboardState.isOpen);
                //     const isTileView = !!(state['features/video-layout'] && state['features/video-layout'].tileViewEnabled);
                    
                //     // Check Grid View state from localStorage
                //     let isGridViewEnabled = false;
                //     try {
                //         for (let i = 0; i < localStorage.length; i++) {
                //             const key = localStorage.key(i);
                //             if (key && (key.startsWith('student_tile_view_') || key.startsWith('tileView_'))) {
                //                 if (localStorage.getItem(key) === 'true') {
                //                     isGridViewEnabled = true;
                //                     break;
                //                 }
                //             }
                //         }
                //     } catch (e) {}

                //     if (isWhiteboardOpen) {
                //         // Nếu đang KHÔNG enable grid view (check từ localStorage) thì mới ghim bảng
                //         if (!isGridViewEnabled) {
                //             const currentPinned = state['features/large-video']?.participantId;
                //             if (currentPinned !== 'whiteboard') {
                //                 console.log("📌 [HỌC VIÊN] Tự động ghim Bảng trắng làm màn hình chính (do không bật Grid View)");
                //                 window.APP.store.dispatch({
                //                     type: 'PIN_PARTICIPANT',
                //                     participant: { id: 'whiteboard' }
                //                 });
                //             }
                //         }
                //     } else {
                //         // When Whiteboard is CLOSED: Enable Grid View for Student
                //         if (!isGridViewEnabled && !window.hasAutoEnabledTileViewOnWbClose) {
                //             window.hasAutoEnabledTileViewOnWbClose = true;
                //             console.log("🔳 [HỌC VIÊN] Bảng trắng tắt -> Tự động mở chế độ Lưới (Grid View)");
                //             window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled: true });
                //         }
                //     }

                //     if (isWhiteboardOpen !== lastWhiteboardOpen) {
                //         lastWhiteboardOpen = isWhiteboardOpen;
                //         window.hasAutoEnabledTileViewOnWbClose = false;
                //         console.log("📢📢📢 [HỌC VIÊN] Trạng thái Bảng trắng thay đổi: isOpen =", isWhiteboardOpen);
                //         window.APP.store.dispatch({
                //             type: 'SET_WHITEBOARD_OPEN',
                //             isOpen: isWhiteboardOpen
                //         });
                //     }
                // }
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

// Auto unpin screen share and pin whiteboard screen whenever screen share status changes
(function() {
    if (typeof window === 'undefined') return;

    let lastScreenShareState = false;

    setInterval(() => {
        try {
            if (!window.APP || !window.APP.store) return;

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

    if (typeof window.isExcalidrawToolbarVisible === 'undefined') {
        window.isExcalidrawToolbarVisible = false; // Default HIDDEN
    }

    const isWhiteboardOrScreenshareActive = (doc) => {
        try {
            if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const largeVideoId = state['features/large-video']?.participantId;
                const isWbPinned = largeVideoId === 'whiteboard';
                const isScreenSharing = (state['features/base/tracks'] || []).some(
                    t => t && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted
                ) || !!state['features/base/conference']?.isScreenSharing;

                if (isWbPinned || isScreenSharing) {
                    return true;
                }
            }
        } catch (e) {}

        const isScreenshareActive = !!(
            (document.body && document.body.classList.contains('whiteboard-screenshare-active')) ||
            (doc.body && doc.body.classList.contains('whiteboard-screenshare-active')) ||
            (window.videoBgElement && window.videoBgElement.srcObject && window.videoBgElement.srcObject.getVideoTracks && window.videoBgElement.srcObject.getVideoTracks().some(t => t.readyState === 'live' && t.enabled))
        );

        const isWhiteboardPinnedOnStage = !!(
            doc.querySelector('#largeVideoElementsContainer #whiteboard') ||
            document.querySelector('#largeVideoElementsContainer #whiteboard')
        );

        return isScreenshareActive || isWhiteboardPinnedOnStage;
    };

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
                const isActive = isWhiteboardOrScreenshareActive(doc);
                const existingBtn = doc.getElementById('custom-pen-toggle-btn');
                const toolbars = doc.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');

                // IF NOT PINNED WHITEBOARD & NOT SCREENSHARING: Hide pen button & toolbars
                if (!isActive) {
                    if (existingBtn) existingBtn.style.setProperty('display', 'none', 'important');
                    toolbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
                    return;
                }

                // Apply toolbar visibility state directly to toolbar elements
                toolbars.forEach(tb => {
                    if (!window.isExcalidrawToolbarVisible) {
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

                        /* Vertical Left Drawing Toolbar (Desktop & Mobile Compact Modes) */
                        .shapes-section,
                        .App-toolbar:has(#custom-highlighter-tool),
                        .App-toolbar:has(#custom-close-drawing-toolbar-btn),
                        .island.App-toolbar:has(#custom-highlighter-tool),
                        [data-testid="toolbar-section"]:has(#custom-highlighter-tool) {
                            position: fixed !important;
                            top: 50% !important;
                            left: 16px !important;
                            right: auto !important;
                            bottom: auto !important;
                            transform: translateY(-50%) !important;
                            z-index: 999999 !important;
                            width: auto !important;
                            height: auto !important;
                            max-height: 90vh !important;
                            padding: 6px 4px !important;
                            display: flex !important;
                            flex-direction: column !important;
                            align-items: center !important;
                            justify-content: center !important;
                            border-radius: 12px !important;
                            box-shadow: var(--shadow-island, 0px 7px 14px rgba(0, 0, 0, 0.12)) !important;
                            margin: 0 !important;
                        }

                        .shapes-section .Stack_horizontal,
                        .App-toolbar:has(#custom-highlighter-tool) .Stack_horizontal,
                        .App-toolbar:has(#custom-close-drawing-toolbar-btn) .Stack_horizontal,
                        .island.App-toolbar:has(#custom-highlighter-tool) .Stack_horizontal {
                            display: flex !important;
                            flex-direction: column !important;
                            align-items: center !important;
                            justify-content: center !important;
                            grid-auto-flow: row !important;
                            width: 100% !important;
                            height: auto !important;
                            gap: 4px !important;
                            padding: 0 !important;
                        }

                        .shapes-section .ToolIcon,
                        .App-toolbar:has(#custom-highlighter-tool) .ToolIcon,
                        .App-toolbar:has(#custom-close-drawing-toolbar-btn) .ToolIcon {
                            width: 36px !important;
                            height: 36px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            margin: 0 !important;
                        }

                        .shapes-section .App-toolbar__divider,
                        .App-toolbar:has(#custom-highlighter-tool) .App-toolbar__divider,
                        .App-toolbar:has(#custom-close-drawing-toolbar-btn) .App-toolbar__divider {
                            width: 24px !important;
                            height: 1px !important;
                            margin: 4px 0 !important;
                            background-color: var(--color-gray-20, #ebebeb) !important;
                        }

                        /* Properties Panel (Stroke / Background / Stroke width) positioned at left: 72px */
                        .App-menu__left:not(:has(#custom-highlighter-tool)),
                        .Island.App-menu__left:not(:has(#custom-highlighter-tool)) {
                            position: fixed !important;
                            top: 50% !important;
                            left: 72px !important;
                            right: auto !important;
                            bottom: auto !important;
                            transform: translateY(-50%) !important;
                            z-index: 999998 !important;
                            margin: 0 !important;
                        }

                        .excalidraw .App-toolbar__divider {
                            width: 24px !important;
                            height: 1px !important;
                            margin: 4px 0 !important;
                            background-color: var(--color-gray-20, #ebebeb) !important;
                        }

                        #custom-close-drawing-toolbar-btn {
                            margin: 0 !important;
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
                    toggleBtn.title = 'Mở Thanh công cụ vẽ';
                    toggleBtn.innerHTML = `
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    `;

                    toggleBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Open toolbar and hide floating pen button
                        window.isExcalidrawToolbarVisible = true;

                        docs.forEach(d => {
                            const tbs = d.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
                            tbs.forEach(tb => {
                                tb.style.removeProperty('display');
                                tb.style.setProperty('display', 'flex', 'important');
                            });
                            const btn = d.getElementById('custom-pen-toggle-btn');
                            if (btn) {
                                btn.style.setProperty('display', 'none', 'important');
                            }
                        });
                    });

                    const excalidrawContainer = doc.querySelector('.excalidraw') || doc.querySelector('.excalidraw-container') || doc.querySelector('.whiteboard-container');
                    (doc.body || excalidrawContainer || doc.documentElement).appendChild(toggleBtn);
                    console.log('[Jitsi custom-config] Custom Excalidraw floating Pen button injected at Bottom Left');
                }

                // Toggle visibility: Hide pen button when toolbar is open, show when toolbar is closed
                if (window.isExcalidrawToolbarVisible) {
                    toggleBtn.style.setProperty('display', 'none', 'important');
                } else {
                    toggleBtn.style.removeProperty('display');
                    toggleBtn.style.setProperty('display', 'flex', 'important');
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
        <div aria-disabled="false" aria-label="Trò chơi & Công cụ" class="toolbox-button" tabindex="0" role="button" title="Trò chơi & Công cụ lớp học">
            <div>
                <div class="toolbox-icon">
                    <div class="jitsi-icon jitsi-icon-default">
                        <svg aria-hidden="true" height="24" width="24" viewBox="0 0 24 24" style="fill: none !important; stroke: currentColor !important;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="6" width="20" height="12" rx="4" style="fill: none !important; stroke: currentColor !important;"></rect>
                            <line x1="6" y1="12" x2="10" y2="12" style="stroke: currentColor !important;"></line>
                            <line x1="8" y1="10" x2="8" y2="14" style="stroke: currentColor !important;"></line>
                            <circle cx="15" cy="11" r="1" style="fill: currentColor !important; stroke: none !important;"></circle>
                            <circle cx="17.5" cy="13.5" r="1" style="fill: currentColor !important; stroke: none !important;"></circle>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="custom-tooltip-popup">Trò chơi & Công cụ lớp học</div>
        <div id="custom-jitsi-tools-menu" style="display: none; position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%); background: #141414; border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 6px; width: 195px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); z-index: 99999; font-family: -apple-system,BlinkMacSystemFont,open_sanslight,Helvetica Neue,Helvetica,Arial,sans-serif!important;">
            <button id="tool-item-timer" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#292929'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">⏱️</span> Đồng hồ đếm ngược
            </button>
            <button id="tool-item-praise" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#292929'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">⭐</span> Khen thưởng học viên
            </button>
            <button id="tool-item-dice" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#292929'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 15px;">🎲</span> Đổ Xí Ngầu (Dice)
            </button>
            <button id="tool-item-wheel" style="display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; color: #fff; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#292929'" onmouseout="this.style.background='transparent'">
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

// Document-level delegated click listener for custom Whiteboard Pin/Unpin menu item
if (typeof window !== 'undefined' && !window.hasBoundCustomUnpinMenuItemClickListener) {
    window.hasBoundCustomUnpinMenuItemClickListener = true;
    
    document.addEventListener('click', (e) => {
        const target = e.target;
        const customItem = target && target.closest ? target.closest('#custom-unpin-whiteboard-menu-item') : null;
        
        if (customItem) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Đóng menu popover Jitsi chuẩn React (bằng event click outside để React state đồng bộ isOpen = false)
            setTimeout(() => {
                try {
                    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                } catch (err) {}
            }, 30);

            if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const pinnedId = state['features/large-video']?.participantId;
                const isTileView = !!state['features/video-layout']?.tileViewEnabled;
                const isWbPinned = pinnedId === 'whiteboard' && !isTileView;

                const roomName = (state['features/base/conference']?.room || '').toLowerCase();

                if (isWbPinned) {
                    console.log('📌 [GIÁO VIÊN] Click Ẩn bảng -> BỎ GHIM BẢNG TRẮNG & BẬT GRID VIEW & BROADCAST');
                    window.APP.store.dispatch({
                        type: 'PIN_PARTICIPANT',
                        participant: { id: null }
                    });
                    window.APP.store.dispatch({
                        type: 'SET_TILE_VIEW',
                        enabled: true
                    });
                    try {
                        if (roomName) localStorage.setItem('teacher_tile_view_' + roomName, 'true');
                        if (window.APP?.conference?.sendTextMessage) {
                            window.APP.conference.sendTextMessage('__TILE_VIEW__:true');
                        }
                    } catch (e) {}
                } else {
                    console.log('📌 [GIÁO VIÊN] Click Bảng trắng -> GHIM BẢNG TRẮNG làm màn chính & BROADCAST');
                    window.APP.store.dispatch({
                        type: 'SET_TILE_VIEW',
                        enabled: false
                    });
                    window.APP.store.dispatch({
                        type: 'PIN_PARTICIPANT',
                        participant: { id: 'whiteboard' }
                    });
                    try {
                        if (roomName) localStorage.setItem('teacher_tile_view_' + roomName, 'false');
                        if (window.APP?.conference?.sendTextMessage) {
                            window.APP.conference.sendTextMessage('__TILE_VIEW__:false');
                        }
                    } catch (e) {}
                }
            }
        }
    }, true);
}

// Hide native default "Ẩn bảng" / "Bảng trắng" items & inject custom toggle menu item
if (typeof window !== 'undefined') {
    setInterval(() => {
        try {
            if (typeof checkIfStudent === 'function' && checkIfStudent()) return;

            const docs = [document];
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) docs.push(iframeDoc);
                } catch (e) {}
            });

            docs.forEach(doc => {
                // Only process when popover menu is actually open (prevents interfering with initial click to open popover)
                const isPopoverOpen = !!doc.querySelector('[class*="popover"]') || !!doc.querySelector('[role="menu"]');
                if (!isPopoverOpen) return;

                const menuItems = doc.querySelectorAll('[role="button"], [role="menuitem"]');
                menuItems.forEach(item => {
                    if (item.id === 'custom-unpin-whiteboard-menu-item') return;

                    const label = item.getAttribute('aria-label') || '';
                    const text = item.textContent || '';
                    
                    const isHideAction = label === 'Ẩn bảng' || label === 'Hide board' || label === 'Hide whiteboard' || 
                                         text.trim() === 'Ẩn bảng' || text.trim() === 'Hide board' || text.trim() === 'Hide whiteboard';
                                         
                    const isShowAction = label === 'Bảng trắng' || label === 'Bật bảng' || label === 'Mở bảng' || label === 'Whiteboard' ||
                                         text.trim() === 'Bảng trắng' || text.trim() === 'Bật bảng' || text.trim() === 'Mở bảng' || text.trim() === 'Whiteboard';

                    if (isHideAction || isShowAction) {
                        // 1. Ẩn các nút mặc định của Jitsi
                        item.style.setProperty('display', 'none', 'important');

                        // 2. Chèn nút custom tùy chỉnh vào vị trí đó
                        if (item.parentNode) {
                            let customItem = item.parentNode.querySelector('#custom-unpin-whiteboard-menu-item');
                            if (!customItem) {
                                customItem = item.cloneNode(true);
                                customItem.id = 'custom-unpin-whiteboard-menu-item';
                                item.parentNode.insertBefore(customItem, item.nextSibling);
                            }

                            // Dynamic state calculation
                            let isWbPinned = false;
                            let isScreensharing = false;
                            if (window.APP && window.APP.store) {
                                const state = window.APP.store.getState();
                                const pinnedId = state['features/large-video']?.participantId;
                                const isTileView = !!state['features/video-layout']?.tileViewEnabled;
                                isWbPinned = pinnedId === 'whiteboard' && !isTileView;

                                // Check screenshare status in Redux store
                                const tracks = state['features/base/tracks'] || [];
                                const hasDesktopTrack = Array.isArray(tracks) 
                                    ? tracks.some(t => t && t.mediaType === 'desktop' && !t.muted)
                                    : Object.values(tracks).some(t => t && t.mediaType === 'desktop' && !t.muted);
                                
                                const isLargeDesktop = !!(state['features/large-video']?.isScreenSharing);
                                isScreensharing = hasDesktopTrack || isLargeDesktop;
                            }

                            if (!isScreensharing && document.body && document.body.classList.contains('whiteboard-screenshare-active')) {
                                isScreensharing = true;
                            }

                            if (isScreensharing) {
                                // Ẩn nút custom khi ĐANG CHIA SẺ MÀN HÌNH
                                customItem.style.setProperty('display', 'none', 'important');
                            } else {
                                const dynamicText = isWbPinned ? 'Ẩn bảng' : 'Bảng trắng';

                                customItem.style.removeProperty('display');
                                customItem.style.display = '';
                                customItem.setAttribute('aria-label', dynamicText);
                                customItem.querySelectorAll('span').forEach(s => s.textContent = dynamicText);
                            }
                        }
                    }
                });
            });
        } catch (e) {}
    }, 200);
}

// Control Student Screenshare Toggle for Teacher & Hide by default for Student
(function setupStudentScreenshareToggle() {
    if (typeof window === 'undefined') return;

    window.allowStudentScreenshare = false;
    window.isStudentShareAllowedByTeacher = false;

    const findToolbarBtn = (doc, keywords) => {
        const container = doc.querySelector('.toolbox-content-items');
        if (!container) return null;
        for (let item of container.children) {
            if (item.id === 'custom-teacher-share-control-btn') continue;
            const text = `${item.outerHTML} ${item.getAttribute('aria-label') || ''}`.toLowerCase();
            if (keywords.some(k => text.includes(k))) return item;
        }
        return null;
    };

    const findShareScreenWrapper = (doc) => findToolbarBtn(doc, ['desktop', 'share', 'màn hình']);
    const findSharedVideoWrapper = (doc) => findToolbarBtn(doc, ['sharedvideo', 'shared-video', 'phát video', 'dừng video']);

    const isActionActive = (doc, wrapper, reduxCheck, domCheck) => {
        try {
            if (window.APP?.store && reduxCheck(window.APP.store.getState())) return true;
        } catch (e) {}
        if (domCheck && domCheck()) return true;
        if (wrapper) {
            const btn = wrapper.querySelector('.toolbox-button') || wrapper;
            const text = `${btn.className} ${btn.getAttribute('aria-pressed') || ''} ${btn.getAttribute('aria-label') || ''}`.toLowerCase();
            return text.includes('true') || text.includes('toggled') || text.includes('active') || text.includes('dừng') || text.includes('stop');
        }
        return false;
    };

    const injectTeacherShareControlBtn = (doc) => {
        const shareWrapper = findShareScreenWrapper(doc);
        if (!shareWrapper || !shareWrapper.parentNode) return;

        let btnWrapper = doc.getElementById('custom-teacher-share-control-btn');
        if (!btnWrapper) {
            btnWrapper = doc.createElement('div');
            btnWrapper.className = 'toolbox-button-wrapper';
            btnWrapper.id = 'custom-teacher-share-control-btn';
            btnWrapper.style.cssText = 'position: relative; cursor: pointer !important; z-index: 99999;';

            btnWrapper.innerHTML = `
                <div aria-disabled="false" aria-label="Mở/Khóa quyền Share Học viên" class="toolbox-button" tabindex="0" role="button">
                    <div style="position: relative;">
                        <div class="toolbox-icon">
                            <div class="jitsi-icon jitsi-icon-default">
                                <svg aria-hidden="true" height="24" width="24" viewBox="0 0 24 24" style="fill: none !important; stroke: currentColor !important;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="3" width="20" height="14" rx="2" style="fill: none !important; stroke: currentColor !important;"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21" style="stroke: currentColor !important;"></line>
                                    <line x1="12" y1="17" x2="12" y2="21" style="stroke: currentColor !important;"></line>
                                </svg>
                            </div>
                        </div>
                        <span id="teacher-share-status-dot" style="position: absolute; top: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444; border: 1.5px solid #141414; transition: background-color 0.2s; pointer-events: none;"></span>
                    </div>
                </div>
                <div class="custom-tooltip-popup">Mở quyền Share màn hình cho Học viên</div>
            `;

            const clickCustomWhiteboardBtn = (targetDoc) => {
                try {
                    const docs = targetDoc ? [targetDoc] : [document];
                    const iframes = document.querySelectorAll('iframe');
                    iframes.forEach(iframe => {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (iframeDoc) docs.push(iframeDoc);
                        } catch (e) {}
                    });

                    for (let d of docs) {
                        const customWbItem = d.querySelector('#custom-unpin-whiteboard-menu-item');
                        if (customWbItem) {
                            console.log('🎯 [GIÁO VIÊN] Click thêm nút Bảng trắng custom #custom-unpin-whiteboard-menu-item');
                            customWbItem.click();
                            return true;
                        }
                    }
                } catch (e) {
                    console.error('Error clicking custom whiteboard button:', e);
                }
                return false;
            };

            const handleToggleClick = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                window.isStudentShareAllowedByTeacher = !window.isStudentShareAllowedByTeacher;
                const isAllowed = window.isStudentShareAllowedByTeacher;

                console.log('📢📢📢 [TEACHER TOOLBAR] Bấm nút Bật/Tắt Share Học viên. allowStudentShare =', isAllowed);

                if (!isAllowed) {
                    clickCustomWhiteboardBtn(doc);
                }

                // Send event to parent window to broadcast via apiRef to Student
                try {
                    window.parent.postMessage({ type: 'TEACHER_TOGGLED_STUDENT_SHARE', allowed: isAllowed }, '*');
                } catch (err) {}

                // Update local toolbar UI
                updateTeacherShareBtnUI(doc, isAllowed);
            };

            btnWrapper.addEventListener('click', handleToggleClick, true);
        }

        if (shareWrapper.nextSibling !== btnWrapper) {
            shareWrapper.parentNode.insertBefore(btnWrapper, shareWrapper.nextSibling);
        }

        updateTeacherShareBtnUI(doc, window.isStudentShareAllowedByTeacher);
    };

    const updateTeacherShareBtnUI = (doc, isAllowed) => {
        const btnWrapper = doc.getElementById('custom-teacher-share-control-btn');
        if (!btnWrapper) return;
        const btn = btnWrapper.querySelector('.toolbox-button');
        const dot = btnWrapper.querySelector('#teacher-share-status-dot');
        const tooltip = btnWrapper.querySelector('.custom-tooltip-popup');
        const titleText = isAllowed ? 'Đang BẬT cho phép Học viên Share (Bấm để Khóa)' : 'Mở quyền Share màn hình cho Học viên';
        if (btn) {
            btn.setAttribute('aria-label', titleText);
        }
        if (dot) {
            dot.style.setProperty('background-color', isAllowed ? '#10b981' : '#ef4444', 'important');
        }
        if (tooltip) {
            tooltip.textContent = titleText;
        }
    };

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
                const isStudent = checkIfStudent();
                if (!isStudent) {
                    injectTeacherShareControlBtn(doc);

                    // 4-Slot (5-button) Mutual Exclusion: Screen Sharing, Shared Video, Student Share Control, Whiteboard group
                    const shareBtn = findShareScreenWrapper(doc);
                    const videoBtn = findSharedVideoWrapper(doc);
                    const ctrlBtn = doc.getElementById('custom-teacher-share-control-btn');
                    const customWbBtn = doc.getElementById('custom-unpin-whiteboard-menu-item');
                    const nativeWbBtns = doc.querySelectorAll('[data-testid="toolbox-whiteboard"], .toolbox-button[aria-label*="Whiteboard"], .toolbox-button[aria-label*="Bảng trắng"], .toolbox-button[aria-label*="Ẩn bảng"], .toolbox-button[aria-label*="Hiện bảng"]');

                    // Check if Teacher locally is sharing screen
                    const isTeacherSharingScreen = isActionActive(doc, shareBtn,
                        s => s['features/base/tracks']?.some(t => t && t.local && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted)
                    );

                    // Check if a Remote Student is sharing screen
                    const isStudentSharingScreen = isActionActive(doc, null,
                        s => s['features/base/tracks']?.some(t => t && !t.local && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted)
                    );

                    const isSharingVideo = isActionActive(doc, videoBtn,
                        s => !!(s['features/shared-video']?.status || s['features/shared-video']?.videoUrl),
                        () => !!(doc.querySelector('#sharedVideo') || doc.querySelector('iframe[src*="youtube"]'))
                    );

                    let isWbActive = false;
                    if (window.APP && window.APP.store) {
                        const state = window.APP.store.getState();
                        const pinnedId = state['features/large-video']?.participantId;
                        const isTileView = !!state['features/video-layout']?.tileViewEnabled;
                        const isWbOpen = !!(state['features/whiteboard'] && state['features/whiteboard'].isOpen);
                        isWbActive = (pinnedId === 'whiteboard' || isWbOpen) && !isTileView;
                    }

                    const isCtrlActive = !!(window.allowStudentScreenshare || window.isStudentShareAllowedByTeacher);

                    const setSlotDisplay = (elements, show) => {
                        const list = Array.isArray(elements) ? elements : [elements];
                        list.forEach(el => {
                            if (!el) return;
                            if (show) {
                                el.style.removeProperty('display');
                                el.style.display = '';
                            } else {
                                el.style.setProperty('display', 'none', 'important');
                            }
                        });
                    };

                    const wbGroup = [customWbBtn, ...Array.from(nativeWbBtns)];

                    if (isTeacherSharingScreen) {
                        // 1. Giáo viên tự Share màn hình -> Hiện nút Share của GV (để bấm dừng), Ẩn các nút khác
                        setSlotDisplay(shareBtn, true);
                        setSlotDisplay(videoBtn, false);
                        setSlotDisplay(ctrlBtn, false);
                        setSlotDisplay(wbGroup, false);
                    } else if (isStudentSharingScreen) {
                        // 2. Học viên đang Share màn hình -> Hiện nút Quyền Share của GV (để GV bấm khóa/dừng), Ẩn các nút khác
                        setSlotDisplay(ctrlBtn, true);
                        setSlotDisplay(shareBtn, false);
                        setSlotDisplay(videoBtn, false);
                        setSlotDisplay(wbGroup, false);
                    } else if (isSharingVideo) {
                        // 3. Đang phát Video -> Hiện nút Phát Video, Ẩn các nút khác
                        setSlotDisplay(videoBtn, true);
                        setSlotDisplay(shareBtn, false);
                        setSlotDisplay(ctrlBtn, false);
                        setSlotDisplay(wbGroup, false);
                    } else if (isWbActive) {
                        // 4. Bảng trắng Active -> Hiện cụm Bảng trắng, Ẩn các nút khác
                        setSlotDisplay(wbGroup, true);
                        setSlotDisplay(shareBtn, false);
                        setSlotDisplay(videoBtn, false);
                        setSlotDisplay(ctrlBtn, false);
                    } else if (isCtrlActive) {
                        // 5. Đang mở quyền Share cho HS -> Hiện nút Quyền Share, Ẩn các nút khác
                        setSlotDisplay(ctrlBtn, true);
                        setSlotDisplay(shareBtn, false);
                        setSlotDisplay(videoBtn, false);
                        setSlotDisplay(wbGroup, false);
                    } else {
                        // Mặc định không có tính năng nào active -> Hiển thị tất cả
                        setSlotDisplay(shareBtn, true);
                        setSlotDisplay(videoBtn, true);
                        setSlotDisplay(ctrlBtn, true);
                        setSlotDisplay(wbGroup, true);
                    }
                } else {
                    // Student view: Hide share screen button by default
                    const shareWrapper = findShareScreenWrapper(doc);
                    if (shareWrapper) {
                        if (!window.allowStudentScreenshare) {
                            shareWrapper.style.setProperty('display', 'none', 'important');
                        } else {
                            shareWrapper.style.removeProperty('display');
                            shareWrapper.style.setProperty('display', 'inline-flex', 'important');
                        }
                    }
                }

                // Auto-show text labels under every toolbar button without hover
                setupToolbarButtonLabels(doc);
            });
        } catch (e) {}
    }, 300);
})();

// Automatically show persistent text labels under each Jitsi toolbar button
const setupToolbarButtonLabels = (doc) => {
    const toolbarContainer = doc.querySelector('.toolbox-content-items');
    if (!toolbarContainer) return;

    const items = toolbarContainer.children;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id === 'custom-jitsi-divider') continue;

        let labelText = '';
        if (item.id === 'custom-jitsi-tools-btn') {
            labelText = 'Công cụ';
        } else if (item.id === 'custom-teacher-share-control-btn') {
            labelText = 'Quyền Share';
        } else {
            const testId = String(item.getAttribute('data-testid') || '').toLowerCase();
            const aria = String(item.getAttribute('aria-label') || '').toLowerCase();
            const innerBtn = item.querySelector('[aria-label], [data-testid]');
            const innerTestId = innerBtn ? String(innerBtn.getAttribute('data-testid') || '').toLowerCase() : '';
            const innerAria = innerBtn ? String(innerBtn.getAttribute('aria-label') || '').toLowerCase() : '';
            const fullHtml = String(item.outerHTML || '').toLowerCase();

            const combined = `${testId} ${aria} ${innerTestId} ${innerAria} ${fullHtml}`;

            if (combined.includes('mic')) labelText = 'Mic';
            else if (combined.includes('camera') || combined.includes('cam') || combined.includes('bật/tắt video')) labelText = 'Camera';
            else if (combined.includes('sharedvideo') || combined.includes('chia sẻ video') || combined.includes('phát video')) labelText = 'Phát Video';
            else if (combined.includes('desktop') || combined.includes('share') || combined.includes('màn hình')) labelText = 'Share';
            else if (combined.includes('chat') || combined.includes('trò chuyện') || combined.includes('hội thoại')) labelText = 'Chat';
            else if (combined.includes('raisehand') || combined.includes('hand') || combined.includes('giơ tay') || combined.includes('hạ tay')) labelText = 'Giơ tay';
            else if (combined.includes('participant') || combined.includes('thành viên') || combined.includes('người tham gia')) labelText = 'Thành viên';
            else if (combined.includes('tile') || combined.includes('lưới')) labelText = 'Khung hình';
            else if (combined.includes('cấu hình') || combined.includes('setting') || combined.includes('cài đặt') || combined.includes('device') || combined.includes('thiết bị') || combined.includes('tùy chọn')) labelText = 'Cài đặt';
            else if (combined.includes('overflow') || combined.includes('more') || combined.includes('khác')) labelText = 'Mở rộng';
        }

        if (labelText) {
            let labelEl = item.querySelector('.custom-toolbar-label');
            if (!labelEl) {
                labelEl = doc.createElement('span');
                labelEl.className = 'custom-toolbar-label';
                labelEl.style.cssText = 'display: block !important; order: 999 !important; font-size: 10px; line-height: 11px; color: rgba(255, 255, 255, 0.85); text-align: center; margin-top: 1px; white-space: nowrap; font-family: -apple-system,BlinkMacSystemFont,open_sanslight,Helvetica Neue,Helvetica,Arial,sans-serif !important; font-weight: 500; pointer-events: none; user-select: none;';
                item.appendChild(labelEl);
            }
            if (labelEl.textContent !== labelText) {
                labelEl.textContent = labelText;
            }
        }
    }
};


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
                    const alarmPath = origin ? `${origin}/phone-ring-medium.mp3` : '/phone-ring-medium.mp3';
                    window.currentTickAudio = new Audio(alarmPath);
                    window.currentTickAudio.play().catch(() => {});
                    return;
                }

                const tickPath = origin ? `${origin}/quartz-clock.mp3` : '/quartz-clock.mp3';
                
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

        if (event.data.type === 'PLAY_CUSTOM_SOUND') {
            const soundPath = event.data.soundPath || '';
            const origin = event.data.origin || (typeof window !== 'undefined' ? window.location.origin : '');
            const fullUrl = soundPath.startsWith('http') ? soundPath : `${origin}${soundPath.startsWith('/') ? '' : '/'}${soundPath}`;
            try {
                window.customAudioMap = window.customAudioMap || {};
                if (event.data.key && window.customAudioMap[event.data.key]) {
                    window.customAudioMap[event.data.key].pause();
                    window.customAudioMap[event.data.key].currentTime = 0;
                }
                const audio = new Audio(fullUrl);
                if (typeof event.data.volume === 'number') {
                    audio.volume = event.data.volume;
                }
                audio.play().catch(err => console.warn('[Jitsi Custom Sound] Play failed:', err));
                if (event.data.key) {
                    window.customAudioMap[event.data.key] = audio;
                }
            } catch (e) {
                console.warn('[Jitsi Custom Sound] Audio creation failed:', e);
            }
        }

        if (event.data.type === 'STOP_CUSTOM_SOUND') {
            if (event.data.key && window.customAudioMap && window.customAudioMap[event.data.key]) {
                try {
                    window.customAudioMap[event.data.key].pause();
                    window.customAudioMap[event.data.key].currentTime = 0;
                } catch (e) {}
            }
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
            text.includes('__TILE_VIEW__') ||
            text.includes('__TEACHER_PIN__') ||
            html.includes('__TIMER__') ||
            html.includes('TIMER_ACTION') ||
            html.includes('__CLK__') ||
            html.includes('__PRAISE__') ||
            html.includes('__WHEEL__') ||
            html.includes('__DICE__') ||
            html.includes('__TOGGLE_STUDENT_SCREENSHARE__') ||
            html.includes('__TILE_VIEW__') ||
            html.includes('__TEACHER_PIN__')
        );
    };

    const setupNotificationObserver = () => {
        const notifContainer = document.getElementById('notifications-container') || 
            document.querySelector('[aria-live="polite"]') ||
            document.querySelector('[aria-live="assertive"]');
        if (notifContainer) {
            const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__', '__TILE_VIEW__', '__TEACHER_PIN__'];
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
                const isTileViewMsg = msgText.startsWith('__TILE_VIEW__:');
                const isTeacherPinMsg = msgText.startsWith('__TEACHER_PIN__:');
                const isPraise = msgText.includes('__PRAISE__');
                const isWheel = msgText.includes('__WHEEL__');
                const isDice = msgText.includes('__DICE__') || msgText.includes('__DICE_COUNT__');
                const isTimer = msgText.includes('__TIMER__') || 
                                msgText.includes('__CLK__') || 
                                msgText.includes('TIMER_ACTION');

                if (isPraise) {
                    timerMessagesCount++;
                    let payload = { index: 0 };
                    if (msgText.startsWith('__PRAISE__:')) {
                        const payloadStr = msgText.slice('__PRAISE__:'.length);
                        try {
                            payload = JSON.parse(payloadStr);
                        } catch (e) {
                            const idx = parseInt(payloadStr, 10);
                            payload = { index: isNaN(idx) ? 0 : idx };
                        }
                    }
                    console.log('[Jitsi custom-config] __PRAISE__ payload received:', payload);

                    window.praiseStarMap = window.praiseStarMap || {};
                    // If allScores included, restore full map (handles rejoin case)
                    if (payload.allScores && typeof payload.allScores === 'object') {
                        Object.assign(window.praiseStarMap, payload.allScores);
                    } else if (payload.studentName) {
                        window.praiseStarMap[payload.studentName] = (window.praiseStarMap[payload.studentName] || 0) + 1;
                    }
                    // Save to localStorage so student can restore on rejoin
                    try { localStorage.setItem(_praiseStarKey, JSON.stringify(window.praiseStarMap)); } catch (e) {}

                    if (typeof updateStarBadgesInJitsiUI === 'function') {
                        updateStarBadgesInJitsiUI();
                    }

                    if (!isFromMe) {
                        window.parent.postMessage({ type: 'PLAY_PRAISE', payload }, '*');
                    }
                } else if (!isFromMe) {
                    if (isToggleStudentShare) {
                        const allowed = msgText.includes(':true');
                        console.log('[Jitsi custom-config] __TOGGLE_STUDENT_SCREENSHARE__ received:', allowed);
                        window.allowStudentScreenshare = allowed;
                        window.parent.postMessage({ type: 'STUDENT_SCREENSHARE_PERMITTED', allowed }, '*');

                        // If teacher revokes permission (allowed = false), student self-cancels active screenshare
                        if (!allowed) {
                            console.log('📢📢📢 [HỌC VIÊN] Nhận message hủy quyền từ Giáo viên -> Tự ngắt Share màn hình');
                            try {
                                if (window.APP?.conference && typeof window.APP.conference.toggleScreenSharing === 'function') {
                                    window.APP.conference.toggleScreenSharing(false);
                                }
                            } catch (e) {}
                            try {
                                if (window.APP?.store) {
                                    const state = window.APP.store.getState();
                                    const tracks = state['features/base/tracks'] || [];
                                    const trackList = Array.isArray(tracks) ? tracks : Object.values(tracks);
                                    trackList.forEach(t => {
                                        if (t && (t.local || t.jitsiTrack?.isLocal?.()) && (t.mediaType === 'desktop' || t.videoType === 'desktop')) {
                                            if (t.jitsiTrack && typeof t.jitsiTrack.dispose === 'function') {
                                                t.jitsiTrack.dispose();
                                            } else if (typeof t.dispose === 'function') {
                                                t.dispose();
                                            }
                                        }
                                    });
                                }
                            } catch (e) {}
                        }
                    } else if (isTeacherPinMsg) {
                        timerMessagesCount++;
                        const targetId = msgText.slice('__TEACHER_PIN__:'.length);
                        const pinId = (targetId === 'null' || !targetId) ? null : targetId;
                        console.log('📌 [HỌC VIÊN] ĐỒNG BỘ GHIM TỪ GIÁO VIÊN:', pinId);

                        let isStudent = false;
                        if (window.APP && window.APP.store) {
                            const state = window.APP.store.getState();
                            const participantsState = state['features/base/participants'] || {};
                            const localP = Object.values(participantsState).find(p => p && p.local);
                            if (localP) isStudent = localP.role !== 'moderator';

                            if (isStudent) {
                                window.APP.store.dispatch({
                                    type: 'PIN_PARTICIPANT',
                                    participant: { id: pinId }
                                });
                            }
                        }
                    } else if (isTileViewMsg) {
                        timerMessagesCount++;
                        const enabled = msgText.includes(':true');
                        console.log('[Jitsi custom-config] __TILE_VIEW__ received from Teacher:', enabled);
                        
                        const roomName = (window.APP?.store?.getState()?.['features/base/conference']?.room || '').toLowerCase();
                        try {
                            if (roomName) localStorage.setItem('teacher_tile_view_' + roomName, enabled ? 'true' : 'false');
                        } catch (e) {}

                        let isStudent = false;
                        if (window.APP && window.APP.store) {
                            const state = window.APP.store.getState();
                            const participantsState = state['features/base/participants'] || {};
                            const localP = Object.values(participantsState).find(p => p && p.local);
                            if (localP) isStudent = localP.role !== 'moderator';

                            if (isStudent) {
                                console.log('📌 [HỌC VIÊN] ĐỒNG BỘ GRID VIEW:', enabled);
                                window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled });
                                if (!enabled) {
                                    window.APP.store.dispatch({
                                        type: 'PIN_PARTICIPANT',
                                        participant: { id: null }
                                    });
                                }
                            }
                        }

                        window.parent.postMessage({ type: 'TEACHER_TOGGLED_TILE_VIEW', enabled }, '*');
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
                } else if (isPraise || isDice || isWheel || isTimer || isToggleStudentShare || isTileViewMsg || isTeacherPinMsg) {
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
        const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__', '__TILE_VIEW__', '__TEACHER_PIN__'];

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

// Auto-detect "Cuộc họp đã kết thúc" (Conference Ended) modal, hide it, click "Đồng ý" & notify parent window
(function setupAutoExitOnConferenceEnded() {
    if (typeof window === 'undefined') return;

    const checkAndExit = () => {
        try {
            const dialogs = document.querySelectorAll('[role="dialog"], .modal-dialog-form, .actionable-message, div[class*="modal"]');
            dialogs.forEach(dialog => {
                const text = (dialog.textContent || '').trim();
                if (text.includes('Cuộc họp đã kết thúc') || text.includes('Conference ended') || text.includes('meeting has ended')) {
                    dialog.style.setProperty('display', 'none', 'important');
                    if (dialog.parentElement) {
                        dialog.parentElement.style.setProperty('display', 'none', 'important');
                    }

                    const btn = dialog.querySelector('button, .button, [role="button"]');
                    if (btn) btn.click();

                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'JITSI_CONFERENCE_ENDED' }, '*');
                    }
                }
            });
        } catch (e) {}
    };

    setInterval(checkAndExit, 80);
})();

const _praiseStarKey = 'praiseStarMap_' + (window.location.pathname || 'default');
window.praiseStarMap = window.praiseStarMap || {};
try {
    const _saved = localStorage.getItem(_praiseStarKey);
    if (_saved) Object.assign(window.praiseStarMap, JSON.parse(_saved));
} catch (e) {}

const updateStarBadgesInJitsiUI = () => {
    try {
        const starMap = window.praiseStarMap || {};
        if (Object.keys(starMap).length === 0) return;

        const nameEls = document.querySelectorAll('.displayname, #localDisplayName, [id$="DisplayName"], [class*="participant-name"]');
        nameEls.forEach(el => {
            const rawText = el.getAttribute('data-raw-name') || el.textContent || '';
            const cleanName = rawText.replace(/\s*⭐\s*\d+/g, '').trim();
            if (!cleanName) return;

            if (!el.getAttribute('data-raw-name')) {
                el.setAttribute('data-raw-name', cleanName);
            }

            let starCount = 0;
            for (let key in starMap) {
                if (cleanName.toLowerCase() === key.toLowerCase() || cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
                    starCount += starMap[key];
                }
            }

            if (starCount > 0) {
                const targetText = `${cleanName} ⭐ ${starCount}`;
                if (el.textContent !== targetText) {
                    el.textContent = targetText;
                }
            }
        });
    } catch (e) {}
};

setInterval(updateStarBadgesInJitsiUI, 1000);

// Student Grid View Rejoin Sync (Pure Grid View Sync - No Whiteboard Pinning)
(function setupStudentTileViewRejoinSync() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
        try {
            if (!window.APP || !window.APP.store) return;
            const state = window.APP.store.getState();
            const roomName = (state['features/base/conference']?.room || '').toLowerCase();
            if (!roomName) return;

            const participantsState = state['features/base/participants'] || {};
            const localP = Object.values(participantsState).find(p => p && p.local);
            const isStudent = localP ? localP.role !== 'moderator' : false;

            if (!isStudent) return;

            const savedTileView = localStorage.getItem('teacher_tile_view_' + roomName);
            const syncKey = `${savedTileView}`;

            if (savedTileView !== null && window.hasSyncedTileViewState !== syncKey) {
                window.hasSyncedTileViewState = syncKey;
                const isTile = savedTileView === 'true';
                console.log('📌 [HỌC VIÊN - REJOIN] Khôi phục Grid View:', isTile);
                window.APP.store.dispatch({ type: 'SET_TILE_VIEW', enabled: isTile });
            }
        } catch (e) {}
    }, 1000);
})();

// Log pin events on Teacher screen & broadcast message to Student
(function setupTeacherPinLogger() {
    if (typeof window === 'undefined') return;

    let lastPinnedId = undefined;

    setInterval(() => {
        try {
            if (!window.APP || !window.APP.store) return;
            const state = window.APP.store.getState();

            const participantsState = state['features/base/participants'] || {};
            const localP = Object.values(participantsState).find(p => p && p.local);
            const isTeacher = localP ? localP.role === 'moderator' : true;

            if (!isTeacher) return;

            const pinnedId = state['features/large-video']?.participantId ?? null;

            if (pinnedId !== lastPinnedId) {
                lastPinnedId = pinnedId;
                console.log('📌 [GIÁO VIÊN LOG GHIM]:', pinnedId);

                try {
                    if (window.APP?.conference && typeof window.APP.conference.sendTextMessage === 'function') {
                        window.APP.conference.sendTextMessage('__TEACHER_PIN__:' + (pinnedId ? String(pinnedId) : 'null'));
                        console.log('📡 [GIÁO VIÊN BẮN TÍN HIỆU THÀNH CÔNG]:', '__TEACHER_PIN__:' + (pinnedId ? String(pinnedId) : 'null'));
                    } else if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
                        window.APP.conference._room.sendTextMessage('__TEACHER_PIN__:' + (pinnedId ? String(pinnedId) : 'null'));
                        console.log('📡 [_room BẮN TÍN HIỆU THÀNH CÔNG]:', '__TEACHER_PIN__:' + (pinnedId ? String(pinnedId) : 'null'));
                    } else {
                        console.warn('⚠️ [GIÁO VIÊN] Chưa sẵn sàng sendTextMessage');
                    }
                } catch (err) {
                    console.error('Error sending pin msg:', err);
                }
            }
        } catch (e) {}
    }, 300);
})();




