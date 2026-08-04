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

// Student Mobile Shared Video Autoplay Muted & Tap to Unmute Sync
(function setupMobileAutoplayMuteSync() {
    if (typeof window === 'undefined') return;

    // Detect if mobile (phone or tablet)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    if (!isMobile) return;

    let isAutoplayMutedActive = false;
    let clickListenerAttached = false;

    const removeUnmuteBanner = () => {
        const banner = document.getElementById('custom-mobile-unmute-banner');
        if (banner && banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    };

    const unmuteMedia = (youtubeIframe) => {
        try {
            console.log('📱 [Mobile Autoplay] Unmuting video via postMessage...');
            youtubeIframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'unMute',
                args: ''
            }), '*');
            youtubeIframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'playVideo',
                args: ''
            }), '*');
        } catch (e) {
            console.error('Error sending unmute postMessage:', e);
        }
    };

    setInterval(() => {
        try {
            // Check if user is student
            let isStudent = false;
            if (window.location.hash && window.location.hash.includes('config.isStudent=true')) {
                isStudent = true;
            } else if (typeof config !== 'undefined' && typeof config.isStudent !== 'undefined') {
                isStudent = !!config.isStudent;
            }
            if (!isStudent && document.body && document.body.classList.contains('is-student')) {
                isStudent = true;
            }

            if (!isStudent) return;

            const youtubeIframe = document.getElementById('sharedVideoIFrame') || 
                                  document.querySelector('iframe[src*="youtube.com"]') || 
                                  document.querySelector('iframe[src*="youtu.be"]');
            
            if (youtubeIframe) {
                // If this is a new video session
                if (!isAutoplayMutedActive) {
                    isAutoplayMutedActive = true;
                    console.log('📱 [Mobile Autoplay] New video detected. Forcing muted URL parameter...');
                    
                    try {
                        const url = new URL(youtubeIframe.src);
                        if (url.searchParams.get('mute') !== '1') {
                            url.searchParams.set('mute', '1');
                            url.searchParams.set('autoplay', '1');
                            url.searchParams.set('playsinline', '1');
                            youtubeIframe.src = url.toString();
                            console.log('📱 [Mobile Autoplay] Forced muted autoplay URL:', youtubeIframe.src);
                        }
                    } catch (e) {
                        console.error('Error modifying iframe src:', e);
                    }

                    // Create & Inject Unmute Banner
                    if (!document.getElementById('custom-mobile-unmute-banner')) {
                        const banner = document.createElement('div');
                        banner.id = 'custom-mobile-unmute-banner';
                        banner.style.cssText = 'position: fixed; top: 12px; left: 50%; transform: translateX(-50%); background: rgba(255, 107, 0, 0.9); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #FFFFFF; padding: 8px 16px; border-radius: 30px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; z-index: 999999; box-shadow: 0 4px 16px rgba(255, 107, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); pointer-events: none; animation: slideDownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; font-family: system-ui, -apple-system, sans-serif; white-space: nowrap;';
                        
                        banner.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: pulseIcon 1.5s infinite;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg><span>Chạm vào màn hình để bật tiếng</span><style>@keyframes slideDownIn { 0% { transform: translate(-50%, -20px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } } @keyframes pulseIcon { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }</style>';
                        document.body.appendChild(banner);
                    }

                    // Attach listener to Jitsi document to catch the tap anywhere
                    if (!clickListenerAttached) {
                        clickListenerAttached = true;
                        
                        const handleTapToUnmute = () => {
                            console.log('📱 [Mobile Autoplay] Tap detected. Activating sound...');
                            unmuteMedia(youtubeIframe);
                            removeUnmuteBanner();
                            
                            // Cleanup listeners
                            document.removeEventListener('click', handleTapToUnmute, true);
                            document.removeEventListener('touchstart', handleTapToUnmute, true);
                            clickListenerAttached = false;
                        };

                        document.addEventListener('click', handleTapToUnmute, true);
                        document.addEventListener('touchstart', handleTapToUnmute, true);
                    }
                }
            } else {
                // If iframe is gone, reset states and clean up banner
                if (isAutoplayMutedActive) {
                    isAutoplayMutedActive = false;
                    removeUnmuteBanner();
                }
            }
        } catch (e) {}
    }, 1000);
})();




