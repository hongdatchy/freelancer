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
                    if (payload.reset) {
                        window.praiseStarMap = {};
                        try { localStorage.removeItem(_praiseStarKey); } catch (e) {}
                    } else if (payload.allScores && typeof payload.allScores === 'object') {
                        window.praiseStarMap = { ...payload.allScores };
                        try { localStorage.setItem(_praiseStarKey, JSON.stringify(window.praiseStarMap)); } catch (e) {}
                    } else if (payload.studentName) {
                        window.praiseStarMap[payload.studentName] = (window.praiseStarMap[payload.studentName] || 0) + 1;
                        try { localStorage.setItem(_praiseStarKey, JSON.stringify(window.praiseStarMap)); } catch (e) {}
                    }

                    if (typeof updateStarBadgesInJitsiUI === 'function') {
                        updateStarBadgesInJitsiUI();
                    }

                    if (!isFromMe && !payload.reset) {
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
            } else {
                if (el.textContent !== cleanName) {
                    el.textContent = cleanName;
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



