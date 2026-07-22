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
