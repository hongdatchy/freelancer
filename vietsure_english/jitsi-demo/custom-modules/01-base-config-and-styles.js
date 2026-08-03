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

// Force selfBrowserSurface to 'include' to allow sharing the current tab + Block unauthorized Student getDisplayMedia
if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
        const isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : false;
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
                    /* Disable clicking/pausing shared video for students so student cannot pause teacher's video */
                    body.is-student #sharedVideo,
                    body.is-student #sharedVideoIFrame,
                    body.is-student #sharedVideoContainer,
                    body.is-student .shared-video-container,
                    body.is-student [id*="sharedVideo"],
                    body.is-student iframe[src*="youtube"],
                    body.is-student iframe[src*="youtu.be"] {
                        pointer-events: none !important;
                    }
                `;
                document.head.appendChild(style);
                console.log("🎨 Applied bright layout background theme.");
            }

            let isStudent = typeof checkIfStudent === 'function' ? checkIfStudent() : false;
            if (!isStudent) {
                if (window.location.hash && window.location.hash.includes('config.isStudent=true')) {
                    isStudent = true;
                } else if (typeof config !== 'undefined' && typeof config.isStudent !== 'undefined') {
                    isStudent = !!config.isStudent;
                }
            }

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
            applyBrightTheme();
        } catch (e) {}
    };
    setInterval(hideFilmstripDistractions, 1000);
}
