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

    if (typeof window.isExcalidrawToolbarVisible === 'undefined') {
        window.isExcalidrawToolbarVisible = false; // Default HIDDEN
    }

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

                // IF NO WHITEBOARD: Hide pen button & restore original toolbar
                if (!excalidrawContainer) {
                    if (existingBtn) existingBtn.style.setProperty('display', 'none', 'important');
                    return;
                }

                // Apply toolbar visibility state directly to toolbar elements
                const toolbars = doc.querySelectorAll('.shapes-section, .App-toolbar, .App-toolbar-content, [data-testid="toolbar-section"]');
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

                    (doc.body || excalidrawContainer).appendChild(toggleBtn);
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
