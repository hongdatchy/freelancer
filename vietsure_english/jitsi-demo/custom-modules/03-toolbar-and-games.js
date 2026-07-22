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

// Control Student Screenshare Toggle for Teacher & Hide by default for Student
(function setupStudentScreenshareToggle() {
    if (typeof window === 'undefined') return;

    window.allowStudentScreenshare = false;
    window.isStudentShareAllowedByTeacher = false;

    const findShareScreenWrapper = (doc) => {
        const toolbarContainer = doc.querySelector('.toolbox-content-items');
        if (toolbarContainer) {
            const items = toolbarContainer.children;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const testId = String(item.getAttribute('data-testid') || '').toLowerCase();
                const label = String(item.getAttribute('aria-label') || '').toLowerCase();
                const innerBtn = item.querySelector('[aria-label], [data-testid]');
                const innerLabel = innerBtn ? String(innerBtn.getAttribute('aria-label') || '').toLowerCase() : '';
                const innerTestId = innerBtn ? String(innerBtn.getAttribute('data-testid') || '').toLowerCase() : '';

                if (
                    testId.includes('desktop') || testId.includes('share') ||
                    label.includes('desktop') || label.includes('share') || label.includes('màn hình') ||
                    innerTestId.includes('desktop') || innerTestId.includes('share') || innerLabel.includes('màn hình') || innerLabel.includes('share')
                ) {
                    return item;
                }
            }
        }

        // Fallback: check querySelectorAll
        const shareBtn = doc.querySelector(
            '[data-testid="share-your-screen"], [data-testid="desktop"], [data-testid*="share" i], ' +
            '[aria-label*="share" i], [aria-label*="Desktop" i], [aria-label*="màn hình" i], [aria-label*="chia sẻ" i]'
        );
        if (shareBtn) {
            return shareBtn.closest('.toolbox-button-wrapper') || shareBtn.closest('.toolbox-button') || shareBtn;
        }
        return null;
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

            const handleToggleClick = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                window.isStudentShareAllowedByTeacher = !window.isStudentShareAllowedByTeacher;
                const isAllowed = window.isStudentShareAllowedByTeacher;

                console.log('📢📢📢 [TEACHER TOOLBAR] Bấm nút Bật/Tắt Share Học viên. allowStudentShare =', isAllowed);

                // Send event to parent window to broadcast via apiRef
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
                    // Teacher view: Inject control button next to Share Screen button
                    injectTeacherShareControlBtn(doc);
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
