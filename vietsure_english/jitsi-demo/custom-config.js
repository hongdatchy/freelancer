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
        
        /* Hide Excalidraw Main Menu Button (Hamburger button) for both Teacher and Student */
        .excalidraw button[data-testid="main-menu-trigger"],
        .excalidraw button[aria-label*="Menu"],
        .excalidraw button[aria-label*="menu"],
        .excalidraw .App-menu__button,
        .excalidraw .main-menu-trigger {
            display: none !important;
        }

        /* Hide dominant speaker avatar overlay inside largeVideoContainer for both Teacher and Student
        #largeVideoContainer #dominantSpeakerAvatarContainer,
        #largeVideoContainer #dominantSpeakerAvatar,
        #largeVideoContainer .dominant-speaker-avatar,
        #largeVideoContainer .presence-label-container {
            display: none !important;
        }
        */
        
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
        }
        #custom-jitsi-timer-btn .toolbox-button {
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 6px !important;
            transition: background-color 0.2s ease !important;
        }
        #custom-jitsi-timer-btn .toolbox-button:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }
    `;
    document.head.appendChild(style);
}

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
    
    // 1. Try finding in main document
    toolbarStack = document.querySelector('.shapes-section .App-toolbar .Stack_horizontal') || 
                   document.querySelector('.App-toolbar .Stack_horizontal');
                   
    // 2. Try finding inside nested whiteboard iframes
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
    
    // Check if already injected
    if (targetDoc.getElementById('custom-highlighter-tool')) {
        // Sync active state class with current excalidraw opacity
        const api = findExcalidrawAPI();
        if (api) {
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
    
    // Create the custom tool label (matches Excalidraw ToolIcon Shape styling)
    const label = targetDoc.createElement('label');
    label.className = 'ToolIcon Shape';
    label.id = 'custom-highlighter-tool';
    label.title = 'Bút dạ quang (Highlighter - 40% độ mờ)';
    label.style.cursor = 'pointer';
    
    // Highlighter SVG icon (Marker style)
    label.innerHTML = `
        <input type="checkbox" style="display: none;">
        <div class="ToolIcon__icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 17px; height: 17px;">
                <path d="M9.53 16.122l9.88-9.88a3 3 0 114.243 4.243l-9.88 9.88M9.53 16.122a3 3 0 11-4.243-4.242l9.88-9.88M9.53 16.122L5.29 20.36a1.5 1.5 0 11-2.122-2.121L7.41 14M18 10l-4-4" />
            </svg>
        </div>
    `;
    
    // Inject active status stylesheet inside target doc if not present
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
    
    // Add click listener to toggle opacity
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
            // 1. Update current tool opacity
            activeApi.updateScene({
                appState: {
                    currentItemOpacity: val
                }
            });
            
            // 2. Try updating active tool only when turning highlighter ON (both excalidraw API styles)
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
            
            // 3. Update selected elements opacity
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
    
    // Append to the toolbar Stack (places it at the end of drawing tools)
    // We insert it before the divider / extra tools trigger if present, or just append it
    const dividers = toolbarStack.querySelectorAll('.App-toolbar__divider');
    const divider = dividers[dividers.length - 1] || null;
    if (divider) {
        toolbarStack.insertBefore(label, divider);
    } else {
        toolbarStack.appendChild(label);
    }
    console.log('[Jitsi custom-config] Custom Excalidraw Highlighter tool button injected successfully');
};


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
    
    // Add click event listener to postMessage to parent application
    btnWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Jitsi] Clock button clicked, sending TOGGLE_TIMER_CARD');
        window.parent.postMessage({ type: 'TOGGLE_TIMER_CARD' }, '*');
    });
    
    return btnWrapper;
};

// Inject the custom Jitsi toolbar clock button
const injectToolbarClockButton = () => {
    // Check if the user is a student. Emojis and timer trigger buttons are teacher-only features.
    const isStudent = typeof config !== 'undefined' && config.isStudent;
    if (isStudent) return;

    let anchorBtn = null;
    let targetDoc = document;
    
    // Helper to find the first toolbar button wrapper in a document context
    const findFirstBtnWrapper = (doc) => {
        const firstBtn = doc.querySelector('.toolbox-button');
        if (firstBtn) {
            return firstBtn.closest('.toolbox-button-wrapper') || 
                   firstBtn;
        }
        return null;
    };
    
    // 1. Try finding in main Jitsi document context
    anchorBtn = findFirstBtnWrapper(document);
    
    // 2. Try finding inside nested Jitsi iframes (if applicable)
    if (!anchorBtn) {
        const iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
                if (iframeDoc) {
                    const btn = findFirstBtnWrapper(iframeDoc);
                    if (btn) {
                        anchorBtn = btn;
                        targetDoc = iframeDoc;
                        break;
                    }
                }
            } catch (e) {}
        }
    }
    
    if (!anchorBtn) return;
    
    // Get parent toolbar container of the anchor button
    const toolbarContainer = anchorBtn.parentElement;
    if (!toolbarContainer) return;
    
    // Check if already injected
    if (targetDoc.getElementById('custom-jitsi-timer-btn')) {
        return;
    }
    
    const btn = createToolbarClockButton(targetDoc);
    
    // Insert before the first button (microphone/camera button wrapper)
    toolbarContainer.insertBefore(btn, anchorBtn);
    console.log('[Jitsi custom-config] Jitsi toolbar clock button injected successfully as the first button');
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
                    // console.log("🖥️ Live screen share stream detected! Playing video behind canvas.");
                    const newStream = new MediaStream([desktopTrack]);
                    window.videoBgElement.srcObject = newStream;
                    window.videoBgElement.play().catch(err => console.error("Error playing video:", err));
                    document.body.classList.add('whiteboard-screenshare-active');
                    
                    // Reset alignment
                    window.hasAlignedTopLeft = false;
                }
            } else {
                if (window.videoBgElement.srcObject) {
                    // console.log("🖥️ Screen share stopped. Clearing video.");
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
                `;
                document.head.appendChild(style);
                console.log("🎨 Applied bright layout background theme.");
            }
        } catch (err) {}
    };
    
    // Run immediately and periodically
    applyBrightTheme();
    setInterval(applyBrightTheme, 2000);
}

// Screenshare change detection and whiteboard state sync logic for students (runs on student screen)
if (typeof window !== 'undefined') {
    let lastActiveScreenshare = false;
    let lastWhiteboardOpen = false;
    
    setInterval(() => {
        try {
            if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const participantsState = state['features/base/participants'] || {};
                let isStudent = false;
                
                // Find local participant role
                for (const id in participantsState) {
                    const p = participantsState[id];
                    if (p && p.local && p.name === 'Học viên') {
                        isStudent = true;
                        break;
                    }
                }
                
                if (isStudent) {
                    if (document.documentElement && !document.documentElement.classList.contains('is-student')) {
                        document.documentElement.classList.add('is-student');
                    }
                    if (document.body && !document.body.classList.contains('is-student')) {
                        document.body.classList.add('is-student');
                    }
                    
                    const whiteboardState = state['features/whiteboard'];
                    const isWhiteboardOpen = !!(whiteboardState && whiteboardState.isOpen);
                    
                    if (isWhiteboardOpen !== lastWhiteboardOpen) {
                        lastWhiteboardOpen = isWhiteboardOpen;
                        console.log("📢📢📢 [HỌC VIÊN] Trạng thái Bảng trắng thay đổi: isOpen =", isWhiteboardOpen);
                        
                        // Force student whiteboard view to follow the teacher's state
                        window.APP.store.dispatch({
                            type: 'SET_WHITEBOARD_OPEN',
                            isOpen: isWhiteboardOpen
                        });
                    }
                    
                    // Detect screenshare changes
                    const tracks = state['features/base/tracks'] || [];
                    const hasActiveScreenshare = tracks.some(t => {
                        const isDesktop = t.videoType === 'desktop' || (t.jitsiTrack && t.jitsiTrack.videoType === 'desktop');
                        const isMuted = !!t.muted;
                        return isDesktop && !isMuted;
                    });
                    
                    if (hasActiveScreenshare !== lastActiveScreenshare) {
                        lastActiveScreenshare = hasActiveScreenshare;
                        console.log("🖥️🖥️🖥️ [HỌC VIÊN] Giáo viên thay đổi trạng thái chia sẻ màn hình! hasActiveScreenshare =", hasActiveScreenshare);
                        
                        // If screenshare starts/stops and whiteboard is active, force open/show whiteboard
                        if (isWhiteboardOpen) {
                            console.log("✏️ [HỌC VIÊN] Giáo viên thay đổi share. Bắt buộc hiển thị lại Bảng trắng.");
                            window.APP.store.dispatch({
                                type: 'SET_WHITEBOARD_OPEN',
                                isOpen: true
                            });
                        }
                    }
                }
            }
        } catch (err) {}
    }, 1000);
}

// Listen to postMessage from parent application to dynamically hide/show notifications container
if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        try {
            if (event.data && event.data.type === 'HIDE_TIMER_NOTIF') {
                console.log('[Jitsi custom-config] HIDE_TIMER_NOTIF message received');
                const notifContainer = document.getElementById('notifications-container') || document.querySelector('.css-gckfkq-container');
                if (notifContainer) {
                    notifContainer.style.display = 'none';
                    console.log('[Jitsi custom-config] Successfully set notifications container display to none');
                }
            } else if (event.data && event.data.type === 'SHOW_TIMER_NOTIF') {
                console.log('[Jitsi custom-config] SHOW_TIMER_NOTIF message received');
                const notifContainer = document.getElementById('notifications-container') || document.querySelector('.css-gckfkq-container');
                if (notifContainer) {
                    notifContainer.style.display = '';
                    console.log('[Jitsi custom-config] Successfully restored notifications container display');
                }
            } else if (event.data && event.data.type === 'SET_EXCALIDRAW_OPACITY') {
                const val = event.data.opacity;
                console.log('[Jitsi custom-config] SET_EXCALIDRAW_OPACITY message received:', val);
                const activeApi = findExcalidrawAPI();
                if (activeApi) {
                    // Update current tool opacity
                    activeApi.updateScene({
                        appState: {
                            currentItemOpacity: val
                        }
                    });
                    
                    // Update selected elements opacity
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

    // MutationObserver to automatically intercept and remove any notification containing __TIMER__ or TIMER_ACTION
    const setupNotificationObserver = () => {
        const notifContainer = document.getElementById('notifications-container') || document.querySelector('.css-gckfkq-container');
        if (notifContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            const text = node.textContent || '';
                            const html = node.innerHTML || '';
                            if (
                                text.includes('__TIMER__') || 
                                text.includes('TIMER_ACTION') || 
                                text.includes('__CLK__') ||
                                html.includes('__TIMER__') || 
                                html.includes('TIMER_ACTION') ||
                                html.includes('__CLK__')
                            ) {
                                node.style.setProperty('display', 'none', 'important');
                                console.log('[Jitsi custom-config] MutationObserver suppressed timer notification toast via display:none');
                            }
                        }
                    });
                });
            });
            observer.observe(notifContainer, { childList: true, subtree: true });
            console.log('[Jitsi custom-config] MutationObserver successfully attached to notifications-container');
            return true;
        }
        return false;
    };

    // Helper: find the chat badge inner span (actual number) on the toolbar
    // Real DOM: <span class="badge-round"><span>1</span></span>
    const getChatBadgeEl = () => {
        return document.querySelector('.badge-round > span') || null;
    };

    // Helper: find the badge-round wrapper (to hide it entirely when count = 0)
    const getChatBadgeWrapper = () => {
        return document.querySelector('.badge-round') || null;
    };

    // Message counts tracking
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
                // Only modify if not already hidden
                if (badgeWrapper.style.display !== 'none') {
                    badgeWrapper.style.setProperty('display', 'none', 'important');
                }
            } else {
                // Only modify if hidden
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

    // Listen to Jitsi incoming messages to count real vs timer messages
    const setupMessageTracking = () => {
        const room = getRoom();
        if (!room) return false;
        try {
            room.on('conference.messageReceived', (id, text, ts) => {
                const isTimer = text && (
                    text.includes('__TIMER__') || 
                    text.includes('__CLK__') || 
                    text.includes('TIMER_ACTION')
                );
                if (isTimer) {
                    timerMessagesCount++;
                } else {
                    realMessagesCount++;
                }
                updateBadgeState();
            });
            console.log('[Jitsi custom-config] Successfully attached conference.messageReceived listener');
            return true;
        } catch (e) {
            console.warn('[Jitsi custom-config] Failed to attach conference.messageReceived listener:', e);
            return false;
        }
    };

    // Retry until APP.conference._room is available
    if (!setupMessageTracking()) {
        const trackingInterval = setInterval(() => {
            if (setupMessageTracking()) {
                clearInterval(trackingInterval);
            }
        }, 1000);
    }

    // Try to setup immediately, or retry if DOM is not ready
    if (!setupNotificationObserver()) {
        const interval = setInterval(() => {
            if (setupNotificationObserver()) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // Helper function to scan the DOM and hide any timer-related chat messages
    const hideTimerMessages = () => {
        const wrappers = document.querySelectorAll('[class*="-chatMessageWrapper"]');
        wrappers.forEach((wrapper) => {
            const text = wrapper.textContent || '';
            if (text.includes('__TIMER__') || text.includes('__CLK__')) {
                if (wrapper.style.display !== 'none') {
                    wrapper.style.setProperty('display', 'none', 'important');
                    console.log('[Jitsi custom-config] ChatObserver hidden timer chat message wrapper');
                }
            }
        });
        
        // Ensure badge state is updated whenever chat messages are scanned
        updateBadgeState();

        // Ensure Excalidraw highlighter icon is injected in the toolbar
        injectToolbarIcon();

        // Ensure Jitsi toolbar timer button is injected
        injectToolbarClockButton();
    };

    // DOM MutationObserver to detect and hide timer messages in the chat pane UI on any DOM changes
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
        console.log('[Jitsi custom-config] ChatObserver successfully attached to document.body');
        
        // Execute immediately
        hideTimerMessages();
    };

    // Initialize the Chat observer as soon as document.body is available
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

    // Periodically scan and inject custom buttons
    setInterval(() => {
        injectToolbarIcon();
        injectToolbarClockButton();
    }, 500);
}



