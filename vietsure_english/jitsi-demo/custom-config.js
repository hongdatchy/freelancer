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
config.dynamicBrandingUrl = '/images/branding.json';

// Helper to robustly check if the current participant is a student (non-moderator)
window.checkIfStudent = () => {
    try {
        if (typeof window !== 'undefined' && window.APP && window.APP.store) {
            const state = window.APP.store.getState();
            const participants = state['features/base/participants'];
            let localParticipant = null;
            if (Array.isArray(participants)) {
                localParticipant = participants.find(p => p && p.local);
            } else if (participants && typeof participants === 'object') {
                localParticipant = Object.values(participants).find(p => p && p.local);
            }
            if (localParticipant && localParticipant.role) {
                return localParticipant.role !== 'moderator';
            }
        }
    } catch (e) {}

    // Default to true (student) if Jitsi store is not ready yet
    return true;
};

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

// Force selfBrowserSurface to 'include' to allow sharing the current tab + Block unauthorized Student getDisplayMedia
if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
        const isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : true;
        if (isStudent && !window.allowStudentScreenshare) {
            console.warn('⛔ [Jitsi Security] Blocked getDisplayMedia call on Student screen because allowStudentScreenshare is false.');
            return Promise.reject(new DOMException('Permission denied', 'NotAllowedError'));
        }

        if (!constraints) constraints = {};
        if (typeof constraints.video === 'boolean' || !constraints.video) {
            constraints.video = {};
        }
        constraints.selfBrowserSurface = 'include';
        constraints.video.displaySurface = 'browser';
        
        return originalGetDisplayMedia(constraints);
    };
}

// Catch and handle getUserMedia permission errors safely to prevent Chromium PiP renderer crashes when camera is denied
if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(constraints) {
        return originalGetUserMedia(constraints).catch(err => {
            console.warn('🎥 [Jitsi Media] getUserMedia permission error handled safely:', err ? (err.name || err.message || err) : 'Error');
            return Promise.reject(err || new DOMException('Permission denied', 'NotAllowedError'));
        });
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
        .is-student [data-testid*="whiteboard" i],
        .is-student [data-testid*="shared-video" i],
        .is-student [aria-label*="whiteboard" i],
        .is-student [aria-label*="bảng" i],
        .is-student [aria-label*="bang" i],
        .is-student [data-label*="whiteboard" i],
        .is-student [data-label*="bảng" i],
        .is-student [data-label*="bang" i],
        .is-student [title*="whiteboard" i],
        .is-student [title*="bảng" i],
        .is-student [title*="bang" i],
        .is-student .toolbox-button[aria-label*="whiteboard" i],
        .is-student .toolbox-button[aria-label*="bảng" i],
        .is-student .toolbox-button[data-label*="bảng" i],
        .is-student .toolbox-button[aria-label*="video" i],
        .is-student [aria-label*="video" i] {
            display: none !important;
        }

        /* Hide native whiteboard button for teacher (custom button used instead, native stays in DOM for programmatic click) */
        body:not(.is-student) [aria-label="Hiển thị bảng trắng"],
        body:not(.is-student) [aria-label="Ẩn bảng trắng"] {
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

        /* Hide whiteboard, screenshare, and shared video participant tiles safely on filmstrip via CSS wildcard selector */
        #participant_whiteboard,
        #filmstripLocalScreenShare,
        #filmstripLocalScreenShareThumbnail,
        #sharedVideoContainer,
        span.videocontainer[id*="-v"] {
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

        /* Hide participants search input field & container safely */
        #participants-search-input,
        #participants-search-input-hidden-description,
        [class*="inputContainer-search"] {
            display: none !important;
        }

        /* Hide entire breakout room '123' row */
        .breakout-room-container[data-testid*="123"],
        .breakout-room-container[aria-label*="123"] {
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

        /* Persistent text labels strictly ordered below each toolbar button icon
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
        */

        /* Safe persistent text labels under Jitsi toolbar buttons using CSS pseudo-elements */
        .toolbox-content-items > div[data-label]::after {
            content: attr(data-label) !important;
            display: block !important;
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
            order: 999 !important;
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
                    /* Disable clicking/pausing shared video for students so student cannot pause teacher's video (Old method commented out)
                    body.is-student #sharedVideo,
                    body.is-student #sharedVideoIFrame,
                    body.is-student #sharedVideoContainer,
                    body.is-student .shared-video-container,
                    body.is-student [id*="sharedVideo"],
                    body.is-student iframe[src*="youtube"],
                    body.is-student iframe[src*="youtu.be"] {
                        pointer-events: none !important;
                    }
                    */

                    /* On Mouse/Non-Touch Desktop (pointer: fine): always disable clicking/pausing shared video for students */
                    @media (pointer: fine) {
                        body.is-student #sharedVideo,
                        body.is-student #sharedVideoIFrame,
                        body.is-student #sharedVideoContainer,
                        body.is-student .shared-video-container,
                        body.is-student [id*="sharedVideo"],
                        body.is-student iframe[src*="youtube"],
                        body.is-student iframe[src*="youtu.be"] {
                            pointer-events: none !important;
                        }
                    }

                    /* On Touch Devices (iPad / Phone / Tablet - pointer: coarse): disable clicking/pausing ONLY after the student clicks/focuses the video once (has unlocked-clicked class) */
                    @media (pointer: coarse) {
                        body.is-student #sharedVideo.unlocked-clicked,
                        body.is-student #sharedVideoIFrame.unlocked-clicked,
                        body.is-student #sharedVideoContainer.unlocked-clicked,
                        body.is-student .shared-video-container.unlocked-clicked,
                        body.is-student [id*="sharedVideo"].unlocked-clicked,
                        body.is-student iframe[src*="youtube"].unlocked-clicked,
                        body.is-student iframe[src*="youtu.be"].unlocked-clicked {
                            pointer-events: none !important;
                        }
                    }
                `;
                document.head.appendChild(style);
                console.log("🎨 Applied bright layout background theme.");
            }

            const isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : true;

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

    // Ensure local video placement and bright theme in filmstrip
    const hideFilmstripDistractions = () => {
        try {
            // Nếu có #filmstripLocalVideo, di chuyển an toàn vào đầu container remote-videos
            const localVideo = document.getElementById('filmstripLocalVideo');
            const remoteContainer = document.querySelector('.filmstrip__videos.remote-videos > div');
            if (localVideo && remoteContainer && !remoteContainer.contains(localVideo)) {
                remoteContainer.prepend(localVideo);
            }
            applyBrightTheme();
        } catch (e) {}
    };
    setInterval(hideFilmstripDistractions, 1000);
}


// Block student double-tap (mobile) and double-click (desktop) on large video to prevent unpin
(function blockStudentLargeVideoUnpin() {
    if (typeof window === 'undefined') return;

    const isStudentNow = () => document.body && document.body.classList.contains('is-student');

    const isLargeVideoArea = (target) => {
        if (!target || typeof target.closest !== 'function') return false;
        return !!(
            target.closest('#largeVideoContainer') ||
            target.closest('.large-video-wrapper') ||
            target.closest('#largeVideo') ||
            target.closest('#largeVideoBackgroundContainer')
        );
    };

    // Block double-click (desktop)
    document.addEventListener('dblclick', (e) => {
        if (!isStudentNow()) return;
        if (!isLargeVideoArea(e.target)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[Student Lock] Blocked double-click unpin on large video');
    }, true);

    // Block double-tap (mobile) — detect 2 taps < 400ms
    let lastTapTime = 0;
    document.addEventListener('touchend', (e) => {
        if (!isStudentNow()) return;
        if (!isLargeVideoArea(e.target)) return;
        const now = Date.now();
        if (now - lastTapTime < 400) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('[Student Lock] Blocked double-tap unpin on large video');
        }
        lastTapTime = now;
    }, true);
})();


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

        window.hideExcalidrawToolbar = function() {
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
                
                const propsPanels = d.querySelectorAll('.App-menu__left, .Island.App-menu__left, [class*="App-menu__left"], .color-picker-container');
                propsPanels.forEach(panel => panel.style.setProperty('display', 'none', 'important'));

                const penBtn = d.getElementById('custom-pen-toggle-btn');
                if (penBtn) penBtn.style.setProperty('display', 'flex', 'important');
            });
        };

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Excalidraw] Red X button clicked -> Hiding drawing toolbar and showing Pen button');
            if (typeof window.hideExcalidrawToolbar === 'function') {
                window.hideExcalidrawToolbar();
            }
        });

        if (label && label.nextSibling) {
            label.parentNode.insertBefore(closeBtn, label.nextSibling);
        } else if (label && label.parentNode) {
            label.parentNode.appendChild(closeBtn);
        }
    }
    console.log('[Jitsi custom-config] Custom Excalidraw Highlighter & Close buttons injected successfully');
};

// Helper functions to show/hide ONLY the properties panel (Stroke, Background, Fill, Stroke width)
if (typeof window !== 'undefined') {
    window.hideExcalidrawPropertiesPanel = function() {
        const docs = [document];
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) docs.push(iframeDoc);
            } catch (err) {}
        });

        docs.forEach(d => {
            const propsPanels = d.querySelectorAll('.App-menu__left, .Island.App-menu__left, [class*="App-menu__left"], .color-picker-container');
            propsPanels.forEach(panel => panel.style.setProperty('display', 'none', 'important'));
        });
    };

    window.showExcalidrawPropertiesPanel = function() {
        const docs = [document];
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) docs.push(iframeDoc);
            } catch (err) {}
        });

        docs.forEach(d => {
            const propsPanels = d.querySelectorAll('.App-menu__left, .Island.App-menu__left, [class*="App-menu__left"], .color-picker-container');
            propsPanels.forEach(panel => panel.style.removeProperty('display'));
        });
    };

    const attachCanvasPointerListener = (doc) => {
        if (!doc || doc.hasAttachedCanvasPointerListener) return;
        doc.hasAttachedCanvasPointerListener = true;

        const handleCanvasPointer = (e) => {
            const target = e.target;
            if (!target) return;

            if (typeof target.closest === 'function') {
                // When clicking ANY tool button on the toolbar, re-show the properties panel!
                const isToolbar = target.closest('.App-toolbar, .shapes-section, [data-testid="toolbar-section"]');
                if (isToolbar) {
                    if (typeof window.showExcalidrawPropertiesPanel === 'function') {
                        window.showExcalidrawPropertiesPanel();
                    }
                    return;
                }

                // If clicking inside the properties panel itself, keep it visible
                const isPropertiesPanel = target.closest('.App-menu__left, .Island, .color-picker-container, #custom-pen-toggle-btn');
                if (isPropertiesPanel) return;
            }

            // Only hide properties panel when pointerdown happens on actual drawing canvas
            const isCanvas = target.tagName === 'CANVAS' || (target.className && typeof target.className === 'string' && target.className.includes('excalidraw__canvas'));
            if (isCanvas) {
                if (typeof window.hideExcalidrawPropertiesPanel === 'function') {
                    window.hideExcalidrawPropertiesPanel();
                }
            }
        };

        doc.addEventListener('pointerdown', handleCanvasPointer, true);
        doc.addEventListener('mousedown', handleCanvasPointer, true);
        doc.addEventListener('touchstart', handleCanvasPointer, true);
    };

    setInterval(() => {
        try {
            attachCanvasPointerListener(document);
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) attachCanvasPointerListener(iframeDoc);
                } catch (e) {}
            });
        } catch (e) {}
    }, 500);
}

// Auto hide toolbar & properties panel when user starts drawing on canvas
if (typeof window !== 'undefined') {
    const attachCanvasPointerListener = (doc) => {
        if (!doc || doc.hasAttachedCanvasPointerListener) return;
        doc.hasAttachedCanvasPointerListener = true;

        const handleCanvasPointer = (e) => {
            if (!window.isExcalidrawToolbarVisible) return;
            const target = e.target;
            if (target && (target.tagName === 'CANVAS' || (typeof target.closest === 'function' && target.closest('.excalidraw-container')))) {
                console.log('[Excalidraw] Canvas pointer event detected -> Auto hiding drawing toolbar and options panel');
                if (typeof window.hideExcalidrawToolbar === 'function') {
                    window.hideExcalidrawToolbar();
                }
            }
        };

        doc.addEventListener('pointerdown', handleCanvasPointer, true);
        doc.addEventListener('mousedown', handleCanvasPointer, true);
        doc.addEventListener('touchstart', handleCanvasPointer, true);
    };

    setInterval(() => {
        try {
            attachCanvasPointerListener(document);
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) attachCanvasPointerListener(iframeDoc);
                } catch (e) {}
            });
        } catch (e) {}
    }, 500);
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

    const sanitizeFreedraw = () => {
        try {
            const api = findExcalidrawAPI();
            if (!api || typeof api.getSceneElements !== 'function') return;

            const appState = typeof api.getAppState === 'function' ? api.getAppState() : null;
            if (appState && appState.editingElement && appState.editingElement.type === 'freedraw') {
                appState.editingElement.simulatePressure = false;
                appState.editingElement.pressures = [];
            }

            const elements = api.getSceneElements();
            if (!Array.isArray(elements) || elements.length === 0) return;

            let changed = false;
            elements.forEach(el => {
                if (el && el.type === 'freedraw') {
                    if (el.simulatePressure !== false || (el.pressures && el.pressures.length > 0)) {
                        el.simulatePressure = false;
                        el.pressures = [];
                        changed = true;
                    }
                }
            });

            if (changed && typeof api.updateScene === 'function') {
                api.updateScene({ elements: [...elements] });
            }
        } catch (e) {}
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('pointermove', sanitizeFreedraw, true);
        window.addEventListener('pointerup', sanitizeFreedraw, true);
        window.addEventListener('mousemove', sanitizeFreedraw, true);
        window.addEventListener('mouseup', sanitizeFreedraw, true);
    }

    setInterval(() => {
        try {
            sanitizeFreedraw();
            const api = findExcalidrawAPI();
            if (!api) return;

            const container = document.querySelector('.excalidraw-container') || document.querySelector('.whiteboard-container');
            if (!container) return;

            const appState = typeof api.getAppState === 'function' ? api.getAppState() : null;
            if (appState) {
                const updates = {};
                if (appState.simulatePressure !== false) {
                    updates.simulatePressure = false;
                }
                if (appState.activeTool) {
                    const toolType = typeof appState.activeTool === 'string' ? appState.activeTool : appState.activeTool.type;
                    if (toolType === 'hand') {
                        updates.activeTool = typeof appState.activeTool === 'string' ? 'selection' : { type: 'selection' };
                    }
                }
                if (Object.keys(updates).length > 0) {
                    api.updateScene({ appState: updates });
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
                if (!doc.hasAttachedFreedrawSanitizer) {
                    doc.hasAttachedFreedrawSanitizer = true;
                    try {
                        doc.addEventListener('pointermove', sanitizeFreedraw, true);
                        doc.addEventListener('pointerup', sanitizeFreedraw, true);
                        doc.addEventListener('mousemove', sanitizeFreedraw, true);
                        doc.addEventListener('mouseup', sanitizeFreedraw, true);
                    } catch (e) {}
                }
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

                if (!doc.getElementById('custom-excalidraw-cursor-css')) {
                    const cursorStyle = doc.createElement('style');
                    cursorStyle.id = 'custom-excalidraw-cursor-css';
                    cursorStyle.textContent = `
                        .excalidraw canvas {
                            cursor: default !important;
                        }
                    `;
                    doc.head.appendChild(cursorStyle);
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
                } else {
                    isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : true;
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
                const isTileView = !!state['features/video-layout']?.tileViewEnabled;
                
                // Whiteboard is only active when pinned AND tile view is NOT enabled
                const isWbPinned = largeVideoId === 'whiteboard' && !isTileView;
                
                const isScreenSharing = (state['features/base/tracks'] || []).some(
                    t => t && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted
                ) || !!state['features/base/conference']?.isScreenSharing;

                if (isWbPinned || isScreenSharing) {
                    return true;
                }

                if (isTileView || (!isWbPinned && !isScreenSharing)) {
                    return false;
                }
            }
        } catch (e) {}

        const isScreenshareActive = !!(
            (document.body && document.body.classList.contains('whiteboard-screenshare-active')) ||
            (doc.body && doc.body.classList.contains('whiteboard-screenshare-active')) ||
            (window.videoBgElement && window.videoBgElement.srcObject && window.videoBgElement.srcObject.getVideoTracks && window.videoBgElement.srcObject.getVideoTracks().some(t => t.readyState === 'live' && t.enabled))
        );

        return isScreenshareActive;
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

                        /* Vertical Left Drawing Toolbar (Desktop & Mobile Compact Modes) - Commented out to revert to top-center horizontal layout
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
                        */
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
                            const propsPanels = d.querySelectorAll('.App-menu__left, .Island.App-menu__left, [class*="App-menu__left"], .color-picker-container');
                            propsPanels.forEach(panel => {
                                panel.style.removeProperty('display');
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

                    // Ensure properties panel / color picker is kept hidden when toolbar is closed
                    const propsPanels = doc.querySelectorAll('.App-menu__left, .Island.App-menu__left, [class*="App-menu__left"], .color-picker-container');
                    propsPanels.forEach(panel => panel.style.setProperty('display', 'none', 'important'));
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
  const btnWrapper = doc.createElement("div");
  btnWrapper.className = "toolbox-button-wrapper";
  btnWrapper.id = "custom-jitsi-timer-btn";

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

  btnWrapper.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[Jitsi] Clock button clicked, sending TOGGLE_TIMER_CARD");
    window.parent.postMessage({ type: "TOGGLE_TIMER_CARD" }, "*");
  });

  return btnWrapper;
};



const findCameraWrapper = (doc) => {
  const toolbarContainer = doc.querySelector(".toolbox-content-items");
  if (!toolbarContainer) return null;
  const wrappers = toolbarContainer.children;
  for (let i = 0; i < wrappers.length; i++) {
    const w = wrappers[i];

    if (w.id === "custom-jitsi-tools-btn" || w.id === "custom-jitsi-divider") {
      continue;
    }

    const testId = String(w.getAttribute("data-testid") || "").toLowerCase();
    if (
      testId.includes("camera") ||
      testId.includes("video") ||
      testId.includes("cam")
    ) {
      return w;
    }

    const innerBtn = w.querySelector(
      '[data-testid*="camera" i], [data-testid*="video" i], [data-testid*="cam" i], [aria-label*="camera" i], [aria-label*="video" i], [aria-label*="cam" i], [aria-label*="ảnh" i]',
    );
    if (innerBtn) {
      return w;
    }

    const html = w.innerHTML.toLowerCase();
    if (
      html.includes("camera") ||
      html.includes("video") ||
      html.includes("tắt camera") ||
      html.includes("bật camera") ||
      html.includes("webcam")
    ) {
      return w;
    }
  }
  return null;
};

const injectToolbarDivider = (doc, camWrapper) => {
  if (!camWrapper) return;
  let divider = doc.getElementById("custom-jitsi-divider");
  if (!divider) {
    divider = doc.createElement("div");
    divider.id = "custom-jitsi-divider";
    divider.className = "toolbox-button-wrapper";
    divider.style.cssText =
      "width: 16px !important; min-width: 16px !important; height: 48px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; margin: 0 4px !important;";
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
  const btnWrapper = doc.createElement("div");
  btnWrapper.className = "toolbox-button-wrapper";
  btnWrapper.id = "custom-jitsi-tools-btn";
  btnWrapper.style.position = "relative";

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

  const iconBtn = btnWrapper.querySelector(".toolbox-button");
  const menu = btnWrapper.querySelector("#custom-jitsi-tools-menu");

  iconBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isHidden = menu.style.display === "none";
    menu.style.display = isHidden ? "block" : "none";
  });

  doc.addEventListener("click", (e) => {
    if (!btnWrapper.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  const timerBtn = btnWrapper.querySelector("#tool-item-timer");
  if (timerBtn) {
    timerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.style.display = "none";
      window.parent.postMessage({ type: "TOGGLE_TIMER" }, "*");
    });
  }

  const praiseBtn = btnWrapper.querySelector("#tool-item-praise");
  if (praiseBtn) {
    praiseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.style.display = "none";
      window.parent.postMessage({ type: "TRIGGER_PRAISE" }, "*");
    });
  }

  const diceBtn = btnWrapper.querySelector("#tool-item-dice");
  if (diceBtn) {
    diceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.style.display = "none";
      window.parent.postMessage({ type: "TRIGGER_DICE" }, "*");
    });
  }

  const wheelBtn = btnWrapper.querySelector("#tool-item-wheel");
  if (wheelBtn) {
    wheelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.style.display = "none";
      window.parent.postMessage({ type: "TRIGGER_WHEEL" }, "*");
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
    return doc.querySelector(".toolbox-content-items");
  };

  toolbarContainer = findToolboxContent(document);

  if (!toolbarContainer) {
    const iframes = document.querySelectorAll("iframe");
    for (let i = 0; i < iframes.length; i++) {
      try {
        const iframeDoc =
          iframes[i].contentDocument || iframes[i].contentWindow?.document;
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

  const oldTimerBtn = targetDoc.getElementById("custom-jitsi-timer-btn");
  if (oldTimerBtn) oldTimerBtn.remove();
  const oldPraiseBtn = targetDoc.getElementById("custom-jitsi-praise-btn");
  if (oldPraiseBtn) oldPraiseBtn.remove();

  const camWrapper = findCameraWrapper(targetDoc);
  if (camWrapper) {
    injectToolbarDivider(targetDoc, camWrapper);
    const divider = targetDoc.getElementById("custom-jitsi-divider");

    let btn = targetDoc.getElementById("custom-jitsi-tools-btn");

    // ✅ Already in correct position, skip re-injection to avoid DOM flash
    if (btn && divider && btn.previousSibling === divider) return;

    if (!btn) {
      btn = createToolbarToolsButton(targetDoc);
    }

    if (divider && btn.previousSibling !== divider) {
      divider.parentNode.insertBefore(btn, divider.nextSibling);
    }
  }
};



// Control Student Screenshare Toggle for Teacher & Hide by default for Student
(function setupStudentScreenshareToggle() {
  if (typeof window === "undefined") return;

  window.allowStudentScreenshare = false;
  window.isStudentShareAllowedByTeacher = false;

  const findToolbarBtn = (doc, keywords) => {
    const container = doc.querySelector(".toolbox-content-items");
    if (!container) return null;
    for (let item of container.children) {
      if (item.id === "custom-teacher-share-control-btn") continue;
      const text =
        `${item.outerHTML} ${item.getAttribute("aria-label") || ""}`.toLowerCase();
      if (keywords.some((k) => text.includes(k))) return item;
    }
    return null;
  };

  const findShareScreenWrapper = (doc) =>
    findToolbarBtn(doc, ["desktop", "share", "màn hình"]);
  const findSharedVideoWrapper = (doc) =>
    findToolbarBtn(doc, [
      "sharedvideo",
      "shared-video",
      "phát video",
      "dừng video",
    ]);

  const isActionActive = (doc, wrapper, reduxCheck, domCheck) => {
    try {
      if (window.APP?.store && reduxCheck(window.APP.store.getState()))
        return true;
    } catch (e) {}
    if (domCheck && domCheck()) return true;
    if (wrapper) {
      const btn = wrapper.querySelector(".toolbox-button") || wrapper;
      const text =
        `${btn.className} ${btn.getAttribute("aria-pressed") || ""} ${btn.getAttribute("aria-label") || ""}`.toLowerCase();
      return (
        text.includes("true") ||
        text.includes("toggled") ||
        text.includes("active") ||
        text.includes("dừng") ||
        text.includes("stop")
      );
    }
    return false;
  };

  const injectTeacherShareControlBtn = (doc) => {
    const shareWrapper = findShareScreenWrapper(doc);
    if (!shareWrapper || !shareWrapper.parentNode) return;

    let btnWrapper = doc.getElementById("custom-teacher-share-control-btn");
    if (!btnWrapper) {
      btnWrapper = doc.createElement("div");
      btnWrapper.className = "toolbox-button-wrapper";
      btnWrapper.id = "custom-teacher-share-control-btn";
      btnWrapper.style.cssText =
        "position: relative; cursor: pointer !important; z-index: 99999;";

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
          const iframes = document.querySelectorAll("iframe");
          iframes.forEach((iframe) => {
            try {
              const iframeDoc =
                iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc) docs.push(iframeDoc);
            } catch (e) {}
          });

          for (let d of docs) {
            const customWbItem = d.querySelector(
              "#custom-unpin-whiteboard-menu-item",
            );
            if (customWbItem) {
              console.log(
                "🎯 [GIÁO VIÊN] Click thêm nút Bảng trắng custom #custom-unpin-whiteboard-menu-item",
              );
              customWbItem.click();
              return true;
            }
          }
        } catch (e) {
          console.error("Error clicking custom whiteboard button:", e);
        }
        return false;
      };

      const handleToggleClick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        window.isStudentShareAllowedByTeacher =
          !window.isStudentShareAllowedByTeacher;
        const isAllowed = window.isStudentShareAllowedByTeacher;

        console.log(
          "📢📢📢 [TEACHER TOOLBAR] Bấm nút Bật/Tắt Share Học viên. allowStudentShare =",
          isAllowed,
        );

        // Send event to parent window to broadcast via apiRef to Student
        try {
          window.parent.postMessage(
            { type: "TEACHER_TOGGLED_STUDENT_SHARE", allowed: isAllowed },
            "*",
          );
        } catch (err) {}

        // Update local toolbar UI
        updateTeacherShareBtnUI(doc, isAllowed);

        if (!isAllowed) {
          setTimeout(() => {
            if (window.APP && window.APP.store) {
              console.log(
                "📌 [GIÁO VIÊN] (Sau 3s) Hủy cấp quyền Share -> Bỏ ghim, Bật Grid View & Đồng bộ sang Học viên",
              );
              window.APP.store.dispatch({
                type: "PIN_PARTICIPANT",
                participant: { id: null },
              });
              window.APP.store.dispatch({
                type: "SET_TILE_VIEW",
                enabled: true,
              });
              try {
                if (window.APP?.conference?.sendTextMessage) {
                  window.APP.conference.sendTextMessage("__TILE_VIEW__:true");
                }
              } catch (err) {}
            }
          }, 3000);
        }
      };

      btnWrapper.addEventListener("click", handleToggleClick, true);
    }

    if (shareWrapper.nextSibling !== btnWrapper) {
      shareWrapper.parentNode.insertBefore(
        btnWrapper,
        shareWrapper.nextSibling,
      );
    }

    updateTeacherShareBtnUI(doc, window.isStudentShareAllowedByTeacher);
  };

  const updateTeacherShareBtnUI = (doc, isAllowed) => { 
    const btnWrapper = doc.getElementById("custom-teacher-share-control-btn");
    if (!btnWrapper) return;
    const btn = btnWrapper.querySelector(".toolbox-button");
    const dot = btnWrapper.querySelector("#teacher-share-status-dot");
    const tooltip = btnWrapper.querySelector(".custom-tooltip-popup");
    const titleText = isAllowed
      ? "Đang BẬT cho phép Học viên Share (Bấm để Khóa)"
      : "Mở quyền Share màn hình cho Học viên";
    if (btn) {
      btn.setAttribute("aria-label", titleText);
    }
    if (dot) {
      dot.style.setProperty(
        "background-color",
        isAllowed ? "#10b981" : "#ef4444",
        "important",
      );
    }
    if (tooltip) {
      tooltip.textContent = titleText;
    }
  };

const createTestWhiteboardButton = (doc) => {
  const btnWrapper = doc.createElement("div");
  btnWrapper.className = "toolbox-button-wrapper";
  btnWrapper.id = "custom-test-whiteboard-btn";
  btnWrapper.style.position = "relative";

  btnWrapper.innerHTML = `
    <div aria-disabled="false" aria-label="Bảng trắng" class="toolbox-button" tabindex="0" role="button" title="Bảng trắng">
      <div>
        <div class="toolbox-icon">
          <div class="jitsi-icon jitsi-icon-default">
            <svg aria-hidden="true" height="24" width="24" viewBox="0 0 24 24" style="fill: none !important; stroke: currentColor !important;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-tooltip-popup">Bảng trắng</div>
  `;

  const iconBtn = btnWrapper.querySelector(".toolbox-button");
  iconBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.APP && window.APP.store) {
      const state = window.APP.store.getState();
      const isWbOpen = !!state["features/whiteboard"]?.isOpen;
      const pinnedId = state["features/large-video"]?.participantId;
      const isTileView = !!state["features/video-layout"]?.tileViewEnabled;
      const isWbPinned = pinnedId === "whiteboard" && !isTileView;

      if (!isWbOpen) {
        // Lần đầu: Click nút gốc để Jitsi tự khởi tạo phòng vẽ & phát sóng XMPP cho học sinh
        console.log("🎨 [NÚT CUSTOM BẢNG TRẮNG] Lần đầu -> Click nút gốc để Jitsi khởi tạo phòng vẽ");
        // Tìm nút gốc - có thể đang ẩn trong overflow menu
        let nativeWbBtn = document.querySelector('[aria-label="Hiển thị bảng trắng"]') ||
                          document.querySelector('[aria-label="Ẩn bảng trắng"]');

        const doClickNative = () => {
          nativeWbBtn = document.querySelector('[aria-label="Hiển thị bảng trắng"]') ||
                        document.querySelector('[aria-label="Ẩn bảng trắng"]');
          if (nativeWbBtn) {
            nativeWbBtn.click();
            // Đóng overflow menu nếu đang mở
            setTimeout(() => {
              const overflowMenu = document.getElementById('overflow-context-menu');
              if (overflowMenu) {
                document.body.click();
              }
            }, 100);
          }
        };

        if (nativeWbBtn) {
          doClickNative();
        } else {
          // Overflow menu chưa mở -> mở menu trước rồi click
          const overflowBtn = document.querySelector('[aria-label="Menu thêm"]') ||
                              document.querySelector('[aria-haspopup="true"][aria-label*="thêm" i]') ||
                              document.querySelector('.toolbox-button[aria-label*="thêm" i]');
          if (overflowBtn) {
            overflowBtn.click();
            setTimeout(() => doClickNative(), 300);
          }
        }
        // Sau khi Jitsi khởi tạo xong, ghim bảng trắng & tắt tile view
        setTimeout(() => {
          console.log("🎨 [NÚT CUSTOM BẢNG TRẮNG] Sau click gốc -> GHIM BẢNG & BẮN BROADCAST");
          window.APP.store.dispatch({ type: "SET_TILE_VIEW", enabled: false });
          window.APP.store.dispatch({ type: "PIN_PARTICIPANT", participant: { id: "whiteboard" } });
          try {
            if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
              window.APP.conference._room.sendTextMessage("__TEACHER_PIN__:whiteboard");
              console.log("📡 Bắn __TEACHER_PIN__:whiteboard thành công!");
            }
          } catch (err) {}
        }, 800);

      } else if (isWbPinned) {
        // Bảng đang ghim -> Ẩn bảng
        console.log("🎨 [NÚT CUSTOM BẢNG TRẮNG] Click Ẩn bảng -> BỎ GHIM & BẬT GRID VIEW & BROADCAST");
        window.APP.store.dispatch({ type: "PIN_PARTICIPANT", participant: { id: null } });
        window.APP.store.dispatch({ type: "SET_TILE_VIEW", enabled: true });
        try {
          if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
            window.APP.conference._room.sendTextMessage("__TEACHER_PIN__:null");
            console.log("📡 Bắn __TEACHER_PIN__:null thành công!");
          }
        } catch (err) {}

      } else {
        // Bảng đã mở nhưng chưa ghim -> Ghim lại
        console.log("🎨 [NÚT CUSTOM BẢNG TRẮNG] Click Ghim lại Bảng -> GHIM & TẮT GRID VIEW & BROADCAST");
        window.APP.store.dispatch({ type: "SET_TILE_VIEW", enabled: false });
        window.APP.store.dispatch({ type: "PIN_PARTICIPANT", participant: { id: "whiteboard" } });
        try {
          if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
            window.APP.conference._room.sendTextMessage("__TEACHER_PIN__:whiteboard");
            console.log("📡 Bắn __TEACHER_PIN__:whiteboard thành công!");
          }
        } catch (err) {}
      }
    }
  });


  return btnWrapper;
};

const injectTestWhiteboardButton = (doc) => {
  const isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : false;
  let btn = doc.getElementById("custom-test-whiteboard-btn");

  if (isStudent) {
    if (btn) btn.remove();
    return;
  }

  const toolsBtn = doc.getElementById("custom-jitsi-tools-btn");
  if (toolsBtn && toolsBtn.parentNode) {
    if (!btn) {
      btn = createTestWhiteboardButton(doc);
      toolsBtn.parentNode.insertBefore(btn, toolsBtn.nextSibling);
    } else if (btn.previousSibling !== toolsBtn) {
      toolsBtn.parentNode.insertBefore(btn, toolsBtn.nextSibling);
    }
  }

  // Dynamic tooltip and toggle style update
  if (btn && window.APP && window.APP.store) {
    const state = window.APP.store.getState();
    const pinnedId = state["features/large-video"]?.participantId;
    const isTileView = !!state["features/video-layout"]?.tileViewEnabled;
    const isWbPinned = pinnedId === "whiteboard" && !isTileView;

    const titleText = isWbPinned ? "Ẩn bảng" : "Bảng trắng";
    const innerBtn = btn.querySelector(".toolbox-button");
    const tooltip = btn.querySelector(".custom-tooltip-popup");

    if (innerBtn) {
      innerBtn.setAttribute("aria-label", titleText);
      innerBtn.setAttribute("title", titleText);
      if (isWbPinned) {
        innerBtn.classList.add("toggled");
      } else {
        innerBtn.classList.remove("toggled");
      }
    }
    if (tooltip) {
      tooltip.textContent = titleText;
    }
  }
};

  setInterval(() => {
    try {
      const docs = [document];
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        try {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) docs.push(iframeDoc);
        } catch (e) {}
      });

      docs.forEach((doc) => {
        const isStudent = checkIfStudent();
        const _tbContainer = doc.querySelector('.toolbox-content-items');
        if (!isStudent) {
          injectTeacherShareControlBtn(doc);
          injectTestWhiteboardButton(doc);

          // 4-Slot (5-button) Mutual Exclusion: Screen Sharing, Shared Video, Student Share Control, Whiteboard group
          const shareBtn = findShareScreenWrapper(doc);
          const videoBtn = findSharedVideoWrapper(doc);
          const ctrlBtn = doc.getElementById(
            "custom-teacher-share-control-btn",
          );
          const customWbBtn = doc.getElementById(
            "custom-unpin-whiteboard-menu-item",
          );
          const nativeWbBtns = _tbContainer
            ? Array.from(_tbContainer.children).filter(el => {
                const text = (
                  (el.getAttribute('data-testid') || '') + ' ' +
                  (el.getAttribute('aria-label') || '') + ' ' +
                  (el.getAttribute('data-label') || '') + ' ' +
                  (el.getAttribute('title') || '') + ' ' +
                  (el.innerHTML || '')
                ).toLowerCase();
                return text.includes('whiteboard') || text.includes('bảng') || text.includes('bang');
              })
            : [];

          // Check if Teacher locally is sharing screen
          const isTeacherSharingScreen = isActionActive(doc, shareBtn, (s) =>
            s["features/base/tracks"]?.some(
              (t) =>
                t &&
                t.local &&
                (t.mediaType === "desktop" || t.videoType === "desktop") &&
                !t.muted,
            ),
          );

          // Check if Teacher or Remote Student is sharing screen
          const isStudentSharingScreen = isActionActive(doc, null, (s) =>
            s["features/base/tracks"]?.some(
              (t) =>
                t &&
                !t.local &&
                (t.mediaType === "desktop" || t.videoType === "desktop") &&
                !t.muted,
            ),
          );
          const anyScreenSharing =
            isTeacherSharingScreen || isStudentSharingScreen;

          // Khi Giáo viên hoặc Học viên dừng Share màn hình -> Sau 3s Bỏ ghim, Bật Grid View & Đồng bộ sang cả lớp
          if (window.lastAnyScreenSharingState && !anyScreenSharing) {
            console.log(
              "📌 [SHARE MÀN HÌNH] Dừng Share màn hình (Giáo viên/Học viên) -> Sau 3s Bỏ ghim, Bật Grid View & Đồng bộ",
            );
            setTimeout(() => {
              if (window.APP && window.APP.store) {
                window.APP.store.dispatch({
                  type: "PIN_PARTICIPANT",
                  participant: { id: null },
                });
                window.APP.store.dispatch({
                  type: "SET_TILE_VIEW",
                  enabled: true,
                });
                try {
                  if (window.APP?.conference?.sendTextMessage) {
                    window.APP.conference.sendTextMessage("__TILE_VIEW__:true");
                  }
                } catch (err) {}
              }
            }, 3000);
          }
          window.lastAnyScreenSharingState = anyScreenSharing;
          window.lastTeacherSharingScreenState = isTeacherSharingScreen;

          const isSharingVideo = isActionActive(
            doc,
            videoBtn,
            (s) =>
              !!(
                s["features/shared-video"]?.status ||
                s["features/shared-video"]?.videoUrl
              ),
            () =>
              !!(
                doc.querySelector("#sharedVideo") ||
                doc.querySelector('iframe[src*="youtube"]')
              ),
          );

          let isWbActive = false;
          if (window.APP && window.APP.store) {
            const state = window.APP.store.getState();
            const pinnedId = state["features/large-video"]?.participantId;
            const isTileView =
              !!state["features/video-layout"]?.tileViewEnabled;
            const isWbOpen = !!(
              state["features/whiteboard"] &&
              state["features/whiteboard"].isOpen
            );
            isWbActive = (pinnedId === "whiteboard" || isWbOpen) && !isTileView;
          }

          const isCtrlActive = !!(
            window.allowStudentScreenshare ||
            window.isStudentShareAllowedByTeacher
          );

          const setSlotDisplay = (elements, show) => {
            const list = Array.isArray(elements) ? elements : [elements];
            list.forEach((el) => {
              if (!el) return;
              if (show) {
                el.style.removeProperty("display");
                el.style.display = "";
              } else {
                el.style.setProperty("display", "none", "important");
              }
            });
          };

          if (nativeWbBtns.length > 1) {
            nativeWbBtns.slice(1).forEach(btn => {
              if (btn) btn.style.setProperty("display", "none", "important");
            });
          }
          const primaryWbBtn = nativeWbBtns[0];
          const wbGroup = primaryWbBtn ? [primaryWbBtn] : [];

          if (isTeacherSharingScreen) {
            // 1. Giáo viên tự Share màn hình -> Hiện nút Share của GV và cả nút Quyền Share
            setSlotDisplay(shareBtn, true);
            setSlotDisplay(ctrlBtn, true);
            setSlotDisplay(videoBtn, false);
            setSlotDisplay(wbGroup, false);
          } else if (isStudentSharingScreen) {
            // 2. Học viên đang Share màn hình -> Hiện nút Quyền Share của GV và cả nút Share của GV
            setSlotDisplay(ctrlBtn, true);
            setSlotDisplay(shareBtn, true);
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
            // 5. Đang mở quyền Share cho HS -> Hiện nút Quyền Share và cả nút Share GV
            setSlotDisplay(ctrlBtn, true);
            setSlotDisplay(shareBtn, true);
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
          // Student view: Hide share screen, whiteboard & shared video buttons by default
          const nativeWbBtns = _tbContainer
            ? Array.from(_tbContainer.children).filter(el => {
                const text = (
                  (el.getAttribute('data-testid') || '') + ' ' +
                  (el.getAttribute('aria-label') || '') + ' ' +
                  (el.getAttribute('data-label') || '') + ' ' +
                  (el.getAttribute('title') || '') + ' ' +
                  (el.innerHTML || '')
                ).toLowerCase();
                return text.includes('whiteboard') || text.includes('bảng') || text.includes('bang');
              })
            : [];
          nativeWbBtns.forEach(btn => btn.style.setProperty("display", "none", "important"));
          
          const customWbBtn = doc.getElementById("custom-unpin-whiteboard-menu-item");
          if (customWbBtn) customWbBtn.style.setProperty("display", "none", "important");

          const shareWrapper = findShareScreenWrapper(doc);
          if (shareWrapper) {
            if (!window.allowStudentScreenshare) {
              try {
                const activeEl = doc.activeElement;
                if (
                  activeEl &&
                  (shareWrapper.contains(activeEl) || activeEl === shareWrapper)
                ) {
                  activeEl.blur();
                }
              } catch (e) {}
              shareWrapper.style.setProperty("display", "none", "important");
            } else {
              shareWrapper.style.removeProperty("display");
              shareWrapper.style.setProperty(
                "display",
                "inline-flex",
                "important",
              );
            }
          }
        }

        // Auto-show text labels under every toolbar button without hover
        setupToolbarButtonLabels(doc);
        
        // Inject custom "Yêu cầu bật camera" button under native "Yêu cầu bật tiếng" in context menu
        injectAskToStartVideoBtn(doc);
      });
    } catch (e) {}
  }, 300);
})();

// Automatically show persistent text labels under each Jitsi toolbar button
// Inject custom "Yêu cầu bật camera" button right under native "Yêu cầu bật tiếng" / "Ask to unmute"
const injectAskToStartVideoBtn = (doc = document) => {
  try {
    const isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : false;
    if (isStudent) return;

    // Find native "Tắt tiếng mọi người khác" / "Tắt tiếng những người khác" item
    const unmuteItems = Array.from(doc.querySelectorAll('[role="button"], [role="menuitem"], div[class*="contextMenuItem"]'))
      .filter(el => {
        if (!el || el.querySelector('[role="button"], [role="menuitem"]') || el.children.length > 2) return false;
        const text = (el.textContent || el.getAttribute('aria-label') || '').toLowerCase();
        return text.includes('tắt tiếng mọi người') || text.includes('tắt tiếng cho mọi người') || text.includes('tắt tiếng những người') || text.includes('mute everyone');
      });

    unmuteItems.forEach(unmuteItem => {
      const popover = unmuteItem.closest('[role="menu"], [class*="contextMenu"], [class*="popover"]');
      if (popover && popover.querySelector('.custom-ask-enable-camera-item')) {
        const existingItem = popover.querySelector('.custom-ask-enable-camera-item');
        if (existingItem && existingItem.style.display === 'none') {
          existingItem.style.display = '';
        }
        return;
      }

      const parent = unmuteItem.parentNode;
      if (!parent || parent.querySelector('.custom-ask-enable-camera-item')) return;

      // Extract exact classes dynamically from native unmute item without hardcoded fallback strings
      const iconContainer = unmuteItem.querySelector('.jitsi-icon') || unmuteItem.querySelector('[class*="contextMenuItemIcon"]') || unmuteItem.querySelector('[class*="Icon"]') || unmuteItem.firstElementChild;
      const iconClass = iconContainer ? iconContainer.className : '';

      const textContainer = unmuteItem.querySelector('[class*="textContainer"]') || unmuteItem.querySelector('[class*="text"]') || unmuteItem.lastElementChild;
      const textClass = textContainer ? textContainer.className : '';
      const spanClass = (textContainer && textContainer.firstElementChild) ? textContainer.firstElementChild.className : '';

      const item = doc.createElement('div');
      item.className = unmuteItem.className + ' custom-ask-enable-camera-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Yêu cầu bật camera');
      item.style.cursor = 'pointer';

      item.innerHTML = `
        <div class="${iconClass}">
          <svg aria-hidden="true" height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.78 3.22a.75.75 0 0 1 0 1.06l-3.37 3.371.005-.004-1.665 1.665V9.31L7.06 18h.002l-1.5 1.5H5.56l-1.28 1.28a.75.75 0 0 1-1.061-1.06l.362-.363A3.001 3.001 0 0 1 1.5 16.5v-9a3 3 0 0 1 3-3h9.75a3 3 0 0 1 2.631 1.558L19.72 3.22a.75.75 0 0 1 1.06 0Zm-5.057 3.996A1.5 1.5 0 0 0 14.25 6H4.5A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h.44L15.722 7.216Z"></path>
            <path d="M21 6.75a.75.75 0 0 1 1.5 0v10.474c0 1.246-1.43 1.949-2.416 1.188l-2.834-2.186v.274a3 3 0 0 1-3 3H9A.75.75 0 0 1 9 18h5.25a1.5 1.5 0 0 0 1.5-1.5V12a.75.75 0 0 1 1.5 0v2.331L21 17.224V6.75Z"></path>
          </svg>
        </div>
        <div class="${textClass}">
          <span class="${spanClass}">Yêu cầu bật camera</span>
        </div>
      `;

      item.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📌 [TEACHER] Clicked Yêu cầu bật camera!');

        let targetId = null;

        // Extract targetId directly from the "Đẩy ra" button ID (ejectlink_7c8f6758)
        try {
          const ejectEl = doc.querySelector('[id*="ejectlink_"]') || doc.querySelector('.kicklink');
          if (ejectEl && ejectEl.id) {
            const match = ejectEl.id.match(/ejectlink_([a-zA-Z0-9]+)/);
            if (match && match[1]) targetId = match[1];
          }
        } catch (err) {}

        if (!targetId) {
          try {
            if (window.APP && window.APP.store) {
              const state = window.APP.store.getState();
              const menuState = state['features/remote-video-menu'] || {};
              targetId = menuState.participantId || (menuState.participant && menuState.participant.id);
            }
          } catch (err) {}
        }

        const msg = targetId ? `__REQUEST_ENABLE_CAMERA__:${targetId}` : '__REQUEST_ENABLE_CAMERA__';
        console.log('📌 [TEACHER] Sending targeted camera request:', msg, '(targetId =', targetId, ')');

        try {
          if (window.APP?.conference && typeof window.APP.conference.sendTextMessage === 'function') {
            window.APP.conference.sendTextMessage(msg);
          } else if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
            window.APP.conference._room.sendTextMessage(msg);
          }
        } catch (err) {
          console.error('Error sending camera request:', err);
        }
      };

      parent.insertBefore(item, unmuteItem);
    });
  } catch (e) {}
};
const setupToolbarButtonLabels = (doc) => {
  const toolbarContainer = doc.querySelector(".toolbox-content-items");
  if (!toolbarContainer) return;

  const items = toolbarContainer.children;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === "custom-jitsi-divider") continue;

    let labelText = "";
    if (item.id === "custom-jitsi-tools-btn") {
      labelText = "Công cụ";
    } else if (item.id === "custom-teacher-share-control-btn") {
      labelText = "Quyền Share";
    } else {
      const testId = String(
        item.getAttribute("data-testid") || "",
      ).toLowerCase();
      const aria = String(item.getAttribute("aria-label") || "").toLowerCase();
      const innerBtn = item.querySelector("[aria-label], [data-testid]");
      const innerTestId = innerBtn
        ? String(innerBtn.getAttribute("data-testid") || "").toLowerCase()
        : "";
      const innerAria = innerBtn
        ? String(innerBtn.getAttribute("aria-label") || "").toLowerCase()
        : "";
      const fullHtml = String(item.outerHTML || "").toLowerCase();

      const combined = `${testId} ${aria} ${innerTestId} ${innerAria} ${fullHtml}`;

      if (combined.includes("mic")) labelText = "Mic";
      else if (
        combined.includes("camera") ||
        combined.includes("cam") ||
        combined.includes("bật/tắt video")
      )
        labelText = "Camera";
      else if (
        combined.includes("sharedvideo") ||
        combined.includes("chia sẻ video") ||
        combined.includes("phát video")
      )
        labelText = "Phát Video";
      else if (
        combined.includes("desktop") ||
        combined.includes("share") ||
        combined.includes("màn hình")
      )
        labelText = "Share";
      else if (
        combined.includes("chat") ||
        combined.includes("trò chuyện") ||
        combined.includes("hội thoại")
      )
        labelText = "Chat";
      else if (
        combined.includes("raisehand") ||
        combined.includes("hand") ||
        combined.includes("giơ tay") ||
        combined.includes("hạ tay")
      )
        labelText = "Giơ tay";
      else if (
        combined.includes("participant") ||
        combined.includes("thành viên") ||
        combined.includes("người tham gia")
      )
        labelText = "Thành viên";
      else if (combined.includes("tile") || combined.includes("lưới"))
        labelText = "Khung hình";
      else if (
        combined.includes("cấu hình") ||
        combined.includes("setting") ||
        combined.includes("cài đặt") ||
        combined.includes("device") ||
        combined.includes("thiết bị") ||
        combined.includes("tùy chọn")
      )
        labelText = "Cài đặt";
      else if (
        combined.includes("whiteboard") ||
        combined.includes("bảng trắng") ||
        combined.includes("ẩn bảng")
      )
        labelText = "Bảng trắng";
      else if (
        combined.includes("overflow") ||
        combined.includes("more") ||
        combined.includes("khác")
      )
        labelText = "Mở rộng";
    }

    if (labelText) {
      // Safe new method using CSS attr(data-label):
      if (item.getAttribute("data-label") !== labelText) {
        item.setAttribute("data-label", labelText);
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


/* --- MODULE: 05-events-and-messaging.js --- */
// ==========================================
// 5. EVENTS & MESSAGING INTEGRATION
// ==========================================

// Global ticking audio instance tracking to prevent layering
window.currentTickAudio = null;

// Toast notification helper when Teacher grants or revokes Student screen share permission
const showSharePermissionToast = (isAllowed) => {
    try {
        const toastId = 'custom-share-permission-toast';
        let toast = document.getElementById(toastId);
        if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }

        toast = document.createElement('div');
        toast.id = toastId;
        const bgColor = isAllowed ? '#10B981' : '#EF4444';
        const icon = isAllowed ? '🎉' : '🔒';
        const text = isAllowed 
            ? 'Giáo viên đã mở quyền chia sẻ màn hình cho bạn!' 
            : 'Giáo viên đã khóa quyền chia sẻ màn hình.';

        toast.style.cssText = `
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${bgColor};
            color: #ffffff;
            padding: 10px 22px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        toast.innerHTML = `<span style="font-size: 16px;">${icon}</span> <span>${text}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast && toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 3500);
    } catch (e) {}
};

// Trigger Jitsi native notification system via Redux store SHOW_NOTIFICATION
const showStudentCameraRequestModal = () => {
    if (typeof window === 'undefined') return;

    const unmuteCamera = () => {
        try {
            if (window.APP?.conference && typeof window.APP.conference.muteVideo === 'function') {
                window.APP.conference.muteVideo(false);
            }
        } catch (e) {}

        try {
            if (window.APP?.conference && typeof window.APP.conference.toggleVideo === 'function') {
                window.APP.conference.toggleVideo(true);
            }
        } catch (e) {}

        try {
            if (window.APP?.store) {
                window.APP.store.dispatch({ type: 'SET_VIDEO_MUTED', muted: false, ensureTrack: true });
            }
        } catch (e) {}

        try {
            const camBtn = document.querySelector('[data-testid="toolbox-camera"], .toolbox-button[aria-label*="camera" i], .toolbox-button[aria-label*="video" i], .toolbox-button[aria-label*="bật camera" i]');
            if (camBtn) camBtn.click();
        } catch (e) {}
    };

    const dismissModal = () => {
        try {
            if (window.APP?.store) {
                window.APP.store.dispatch({ type: 'HIDE_NOTIFICATION', uid: 'camera-request-notification' });
            }
        } catch (e) {}
        try {
            const notifContainer = document.getElementById('notifications-container') || document.body;
            const notifs = notifContainer.querySelectorAll('div, [role="alert"], [class*="notification"]');
            notifs.forEach(n => {
                if (n.textContent && n.textContent.includes('Người điều hành muốn bạn mở camera')) {
                    const closeBtn = n.querySelector('button, [aria-label*="Close" i], [aria-label*="Đóng" i]');
                    if (closeBtn) closeBtn.click();
                    n.style.setProperty('display', 'none', 'important');
                }
            });
        } catch (e) {}
    };

    try {
        if (window.APP && window.APP.store) {
            window.APP.store.dispatch({
                type: 'SHOW_NOTIFICATION',
                props: {
                    titleKey: 'Người điều hành muốn bạn mở camera',
                    customActionNameKey: ['Bật camera'],
                    customActionHandler: [() => {
                        unmuteCamera();
                        dismissModal();
                    }],
                    appearance: 'info',
                    uid: 'camera-request-notification'
                },
                timeout: 3000
            });

            // Auto-dismiss after 3 seconds
            setTimeout(() => {
                dismissModal();
            }, 3000);
            return;
        }
    } catch (e) {
        console.error('Error dispatching native notification:', e);
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        if (!event.data) return;



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
            text.includes('__REQUEST_ENABLE_CAMERA__') ||
            text.includes('Đang ghi âm') ||
            text.includes('Đang ghi hình') ||
            text.includes('phát trực tiếp') ||
            text.includes('Quyền quản trị viên') ||
            text.includes('Lỗi cấp quyền micro') ||
            text.includes('Fellow Jitster') ||
            html.includes('__TIMER__') ||
            html.includes('TIMER_ACTION') ||
            html.includes('__CLK__') ||
            html.includes('__PRAISE__') ||
            html.includes('__WHEEL__') ||
            html.includes('__DICE__') ||
            html.includes('__TOGGLE_STUDENT_SCREENSHARE__') ||
            html.includes('__TILE_VIEW__') ||
            html.includes('__TEACHER_PIN__') ||
            html.includes('__REQUEST_ENABLE_CAMERA__') ||
            html.includes('Đang ghi âm') ||
            html.includes('Đang ghi hình') ||
            html.includes('phát trực tiếp') ||
            html.includes('Quyền quản trị viên') ||
            html.includes('Lỗi cấp quyền micro') ||
            html.includes('Fellow Jitster')
        );
    };

    const setupNotificationObserver = () => {
        const notifContainer = document.getElementById('notifications-container') || 
            document.querySelector('[aria-live="polite"]') ||
            document.querySelector('[aria-live="assertive"]');
        if (notifContainer) {
            const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__', '__TILE_VIEW__', '__TEACHER_PIN__', '__REQUEST_ENABLE_CAMERA__', '__GRANT_MODERATOR_TOKEN__', 'Đang ghi âm', 'Đang ghi hình', 'phát trực tiếp', 'Quyền quản trị viên', 'Lỗi cấp quyền micro', 'Fellow Jitster'];
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

    let lastTrackedRoom = null;
    const setupMessageTracking = () => {
        const room = getRoom();
        if (!room || room === lastTrackedRoom) return !!lastTrackedRoom;
        try {
            lastTrackedRoom = room;
            window.joinTimestamp = Date.now();

            room.on('conference.messageReceived', (id, text, ts) => {
                const myId = (typeof APP !== 'undefined' && APP.conference) ? APP.conference.getMyUserId() : null;
                const isFromMe = !!(myId && id === myId);

                let messageTime = null;
                if (typeof ts === 'number') {
                    messageTime = ts;
                } else if (ts && typeof ts.getTime === 'function') {
                    messageTime = ts.getTime();
                } else if (typeof ts === 'string') {
                    const parsed = Date.parse(ts);
                    if (!isNaN(parsed)) messageTime = parsed;
                }

                // If message timestamp is older than student's room join timestamp, mark as history playback
                const isHistoryMessage = !!(messageTime && window.joinTimestamp && messageTime < (window.joinTimestamp - 2000));

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
                const isRequestEnableCamera = msgText.includes('__REQUEST_ENABLE_CAMERA__');
                const isPraise = msgText.includes('__PRAISE__');
                const isWheel = msgText.includes('__WHEEL__');
                const isDice = msgText.includes('__DICE__') || msgText.includes('__DICE_COUNT__');
                const isTimer = msgText.includes('__TIMER__') || 
                                msgText.includes('__CLK__') || 
                                msgText.includes('TIMER_ACTION');

                if (isToggleStudentShare) {
                    timerMessagesCount++;
                    const val = msgText.slice('__TOGGLE_STUDENT_SCREENSHARE__:'.length).trim();
                    const isAllowed = (val === 'true');
                    window.allowStudentScreenshare = isAllowed;
                    console.log('📌 [Jitsi] Received __TOGGLE_STUDENT_SCREENSHARE__:', val, 'window.allowStudentScreenshare =', window.allowStudentScreenshare);

                    if (!isAllowed) {
                        try {
                            if (window.APP && window.APP.store) {
                                const state = window.APP.store.getState();
                                const tracks = state['features/base/tracks'] || [];
                                const localDesktop = Array.isArray(tracks) 
                                    ? tracks.find(t => t && t.local && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted)
                                    : Object.values(tracks).find((t) => t && t.local && (t.mediaType === 'desktop' || t.videoType === 'desktop') && !t.muted);
                                if (localDesktop) {
                                    console.log('📌 [STUDENT] Teacher revoked share permission -> Stopping local desktop share stream!');
                                    if (window.APP.conference && typeof window.APP.conference.toggleScreenSharing === 'function') {
                                        window.APP.conference.toggleScreenSharing(false);
                                    }
                                }
                            }
                        } catch (err) {}
                    }

                    if (!isFromMe && !isHistoryMessage) {
                        showSharePermissionToast(isAllowed);
                    }
                } else if (isPraise) {
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
                    if (payload.reset) {
                        window.praiseStarMap = {};
                    } else if (payload.allScores && typeof payload.allScores === 'object') {
                        window.praiseStarMap = { ...payload.allScores };
                    } else if (payload.studentName) {
                        window.praiseStarMap[payload.studentName] = (window.praiseStarMap[payload.studentName] || 0) + 1;
                    }

                    if (typeof updateStarBadgesInJitsiUI === 'function') {
                        updateStarBadgesInJitsiUI();
                    }

                    if (!isFromMe && !payload.reset && !isHistoryMessage) {
                        window.parent.postMessage({ type: 'PLAY_PRAISE', payload }, '*');
                    }
                } else if (isDice) {
                    timerMessagesCount++;
                    if (!isHistoryMessage && msgText.startsWith('__DICE__:')) {
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
                    if (!isHistoryMessage && msgText.startsWith('__WHEEL__:')) {
                        const payloadStr = msgText.slice('__WHEEL__:'.length);
                        try {
                            const payload = JSON.parse(payloadStr);
                            window.parent.postMessage({ type: 'WHEEL_ACTION', payload }, '*');
                        } catch (e) {}
                    }
                } else if (isRequestEnableCamera) {
                    timerMessagesCount++;
                    const isStudent = (typeof checkIfStudent === 'function' && checkIfStudent()) || !!window.config?.isStudent;
                    if (isStudent && !isHistoryMessage) {
                        let targetId = null;
                        if (msgText.includes(':')) {
                            targetId = msgText.split(':')[1]?.trim();
                        }
                        const myId = (typeof APP !== 'undefined' && APP.conference && typeof APP.conference.getMyUserId === 'function') ? APP.conference.getMyUserId() : null;
                        
                        if (targetId) {
                            if (myId && targetId === myId) {
                                console.log('📌 [STUDENT] Received targeted camera request for me! (targetId:', targetId, ', myId:', myId, ')');
                                showStudentCameraRequestModal();
                            } else {
                                console.log('📌 [STUDENT] Camera request was for targetId:', targetId, '(myId:', myId, ') -> Skipping notification');
                            }
                        } else {
                            console.log('📌 [STUDENT] Broadcast camera request (no targetId) -> Skipping to prevent all students receiving it');
                        }
                    }
                } else if (isTeacherPinMsg) {
                    timerMessagesCount++;
                    const rawTargetId = msgText.slice('__TEACHER_PIN__:'.length).trim();
                    const isStudent = (typeof checkIfStudent === 'function' && checkIfStudent()) || !!window.config?.isStudent;

                    if (isStudent && !isHistoryMessage && window.APP && window.APP.store) {
                        const isUnpin = (!rawTargetId || rawTargetId === 'null' || rawTargetId === 'undefined');
                        const targetId = isUnpin ? null : rawTargetId;

                        console.log('📌 [HỌC VIÊN] Nhận tín hiệu __TEACHER_PIN__ từ GV -> targetId:', targetId);

                        if (isUnpin) {
                            window.APP.store.dispatch({
                                type: 'PIN_PARTICIPANT',
                                participant: { id: null }
                            });
                            window.APP.store.dispatch({
                                type: 'SET_TILE_VIEW',
                                enabled: true
                            });
                        } else if (targetId === 'whiteboard') {
                            console.log('🎨 [HỌC VIÊN] Bật & Ghim Bảng trắng theo Giáo viên!');
                            window.APP.store.dispatch({
                                type: 'SET_WHITEBOARD_OPEN',
                                isOpen: true
                            });
                            window.APP.store.dispatch({
                                type: 'SET_TILE_VIEW',
                                enabled: false
                            });
                            window.APP.store.dispatch({
                                type: 'PIN_PARTICIPANT',
                                participant: { id: 'whiteboard' }
                            });
                        } else {
                            window.APP.store.dispatch({
                                type: 'SET_TILE_VIEW',
                                enabled: false
                            });
                            window.APP.store.dispatch({
                                type: 'PIN_PARTICIPANT',
                                participant: { id: targetId }
                            });
                        }
                    }
                } else if (isPraise || isDice || isWheel || isTimer || isToggleStudentShare || isTileViewMsg) {
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

    setInterval(() => {
        setupMessageTracking();
    }, 1000);

    if (!setupNotificationObserver()) {
        const interval = setInterval(() => {
            if (setupNotificationObserver()) {
                clearInterval(interval);
            }
        }, 1000);
    }

    const hideTimerMessages = () => {
        const systemKeywords = ['__TIMER__', 'TIMER_ACTION', '__CLK__', '__PRAISE__', '__WHEEL__', '__DICE__', '__WB__', '__TOGGLE_STUDENT_SCREENSHARE__', '__TILE_VIEW__', '__TEACHER_PIN__', '__REQUEST_ENABLE_CAMERA__', '__GRANT_MODERATOR_TOKEN__', 'Đang ghi âm', 'Đang ghi hình', 'phát trực tiếp', 'Quyền quản trị viên', 'Lỗi cấp quyền micro', 'Fellow Jitster'];

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

window.praiseStarMap = window.praiseStarMap || {};

// Sync Praise Stars from Parent Window
window.addEventListener('message', (event) => {
    if (event && event.data && event.data.type === 'SYNC_PRAISE_SCORES') {
        if (event.data.starScores && typeof event.data.starScores === 'object') {
            window.praiseStarMap = { ...event.data.starScores };
            if (typeof updateStarBadgesInJitsiUI === 'function') {
                updateStarBadgesInJitsiUI();
            }
        }
    }
});

const updateStarBadgesInJitsiUI = () => {
    try {
        const starMap = window.praiseStarMap || {};

        const nameEls = document.querySelectorAll('.displayname, #localDisplayName, [id$="DisplayName"], [class*="participant-name"], [class*="display-name"], [data-testid*="display-name"], .videocontainer .displayname-container');
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
            } else {
                if (el.textContent !== cleanName) {
                    el.textContent = cleanName;
                }
            }
        });
    } catch (e) {}
};

setInterval(updateStarBadgesInJitsiUI, 1000);

// Notify parent window whenever user clicks inside Jitsi iframe (to close external popups/menus)
(function setupJitsiClickBroadcaster() {
    if (typeof window === 'undefined') return;
    const handleMouseDown = () => {
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'JITSI_CLICKED' }, '*');
            }
        } catch (e) {}
    };
    document.addEventListener('mousedown', handleMouseDown, true);
})();

// Student Mobile Shared Video Autoplay: allow first click, then disable pointer events to prevent pause
(function setupMobileSharedVideoClickLock() {
    if (typeof window === 'undefined') return;

    // Detect if mobile (phone or tablet)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    if (!isMobile) return;

    window.addEventListener('blur', () => {
        try {
            // Find Jitsi's active focused element
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.id === 'sharedVideoIFrame' || activeEl.tagName === 'IFRAME' || activeEl.src.includes('youtube'))) {
                // Find all containers representing the shared video area
                const container = document.getElementById('sharedVideo') || 
                                  document.getElementById('sharedVideoContainer') ||
                                  activeEl.closest('.shared-video-container');
                
                if (container && !container.classList.contains('unlocked-clicked')) {
                    console.log('📱 [Mobile Click Lock] Iframe focused (first click). Locking pointer-events on mobile student screen.');
                    container.classList.add('unlocked-clicked');
                    activeEl.classList.add('unlocked-clicked');
                    
                    // Also lock any other sibling containers just to be secure
                    const siblingContainer = document.getElementById('sharedVideoContainer') || document.getElementById('sharedVideo');
                    if (siblingContainer) {
                        siblingContainer.classList.add('unlocked-clicked');
                    }
                }
            }
        } catch (e) {}
    });
})();

// Intercept explicit PIN_PARTICIPANT / SELECT_PARTICIPANT Redux action on Teacher screen & broadcast message to Student
(function setupTeacherPinInterceptor() {
    if (typeof window === 'undefined') return;

    const initInterceptor = () => {
        if (!window.APP || !window.APP.store || window.APP.store.hasInterceptedPinAction) return false;

        const originalDispatch = window.APP.store.dispatch;
        window.APP.store.hasInterceptedPinAction = true;

        window.APP.store.dispatch = function(action) {
            const result = originalDispatch.apply(this, arguments);

            try {
                if (action && action.type) {
                    const actionType = String(action.type).toUpperCase();
                    if (actionType.includes('PIN') || actionType.includes('SELECT_PARTICIPANT') || actionType.includes('LARGE_VIDEO')) {
                        console.log('📌 [JITSI REDUX ACTION INTERCEPTED]:', action.type, action);

                        const state = window.APP.store.getState();
                        const participantsState = state['features/base/participants'] || {};
                        const participantsArr = Array.isArray(participantsState) ? participantsState : Object.values(participantsState);
                        const localP = participantsArr.find(p => p && p.local);
                        const isTeacher = localP ? localP.role === 'moderator' : true;

                        if (isTeacher && (actionType.includes('PIN') || actionType.includes('SELECT_PARTICIPANT'))) {
                            let targetId = 'null';
                            if (typeof action.participant === 'string') targetId = action.participant;
                            else if (action.participant && action.participant.id) targetId = String(action.participant.id);
                            else if (action.id) targetId = String(action.id);
                            else if (action.participantId) targetId = String(action.participantId);

                            console.log('📌 [GIÁO VIÊN BẤM GHIM THỦ CÔNG]:', targetId);

                            try {
                                if (window.APP?.conference && typeof window.APP.conference.sendTextMessage === 'function') {
                                    window.APP.conference.sendTextMessage('__TEACHER_PIN__:' + targetId);
                                    console.log('📡 [GIÁO VIÊN BẮN TÍN HIỆU THÀNH CÔNG]:', '__TEACHER_PIN__:' + targetId);
                                } else if (window.APP?.conference?._room && typeof window.APP.conference._room.sendTextMessage === 'function') {
                                    window.APP.conference._room.sendTextMessage('__TEACHER_PIN__:' + targetId);
                                    console.log('📡 [_room BẮN TÍN HIỆU THÀNH CÔNG]:', '__TEACHER_PIN__:' + targetId);
                                }
                            } catch (err) {
                                console.error('Error sending pin msg:', err);
                            }
                        }
                    }
                }
            } catch (e) {}

            return result;
        };
        return true;
    };

    setInterval(initInterceptor, 1000);
})();




