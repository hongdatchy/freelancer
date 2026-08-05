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

// Document-level delegated click listener for custom Whiteboard Pin/Unpin menu item
if (
  typeof window !== "undefined" &&
  !window.hasBoundCustomUnpinMenuItemClickListener
) {
  window.hasBoundCustomUnpinMenuItemClickListener = true;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      const customItem =
        target && target.closest
          ? target.closest("#custom-unpin-whiteboard-menu-item")
          : null;

      if (customItem) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Đóng menu popover Jitsi chuẩn React (bằng event click outside để React state đồng bộ isOpen = false)
        setTimeout(() => {
          try {
            document.body.dispatchEvent(
              new MouseEvent("click", { bubbles: true, cancelable: true }),
            );
          } catch (err) {}
        }, 30);

        if (window.APP && window.APP.store) {
          const state = window.APP.store.getState();
          const pinnedId = state["features/large-video"]?.participantId;
          const isTileView = !!state["features/video-layout"]?.tileViewEnabled;
          const isWbPinned = pinnedId === "whiteboard" && !isTileView;

          const roomName = (
            state["features/base/conference"]?.room || ""
          ).toLowerCase();

          if (isWbPinned) {
            console.log(
              "📌 [GIÁO VIÊN] Click Ẩn bảng -> BỎ GHIM BẢNG TRẮNG & BẬT GRID VIEW & BROADCAST",
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
              if (roomName)
                localStorage.setItem("teacher_tile_view_" + roomName, "true");
              if (window.APP?.conference?.sendTextMessage) {
                window.APP.conference.sendTextMessage("__TILE_VIEW__:true");
              }
            } catch (e) {}
          } else {
            console.log(
              "📌 [GIÁO VIÊN] Click Bảng trắng -> GHIM BẢNG TRẮNG làm màn chính & BROADCAST",
            );
            window.APP.store.dispatch({
              type: "SET_TILE_VIEW",
              enabled: false,
            });
            window.APP.store.dispatch({
              type: "PIN_PARTICIPANT",
              participant: { id: "whiteboard" },
            });
            try {
              if (roomName)
                localStorage.setItem("teacher_tile_view_" + roomName, "false");
              if (window.APP?.conference?.sendTextMessage) {
                window.APP.conference.sendTextMessage("__TILE_VIEW__:false");
              }
            } catch (e) {}
          }
        }
      }
    },
    true,
  );
}

// Hide native default "Ẩn bảng" / "Bảng trắng" items & inject custom toggle menu item
if (typeof window !== "undefined") {
  setInterval(() => {
    try {
      if (typeof checkIfStudent === "function" && checkIfStudent()) return;

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
        // Only process when popover menu is actually open (prevents interfering with initial click to open popover)
        const isPopoverOpen =
          !!doc.querySelector('[class*="popover"]') ||
          !!doc.querySelector('[role="menu"]');
        if (!isPopoverOpen) return;

        const menuItems = doc.querySelectorAll(
          '[role="button"], [role="menuitem"]',
        );
        menuItems.forEach((item) => {
          if (item.id === "custom-unpin-whiteboard-menu-item") return;

          const label = item.getAttribute("aria-label") || "";
          const text = item.textContent || "";

          const isHideAction =
            label === "Ẩn bảng" ||
            label === "Hide board" ||
            label === "Hide whiteboard" ||
            text.trim() === "Ẩn bảng" ||
            text.trim() === "Hide board" ||
            text.trim() === "Hide whiteboard";

          const isShowAction =
            label === "Bảng trắng" ||
            label === "Bật bảng" ||
            label === "Mở bảng" ||
            label === "Whiteboard" ||
            text.trim() === "Bảng trắng" ||
            text.trim() === "Bật bảng" ||
            text.trim() === "Mở bảng" ||
            text.trim() === "Whiteboard";

          if (isHideAction || isShowAction) {
            // 1. Ẩn các nút mặc định của Jitsi
            item.style.setProperty("display", "none", "important");

            // 2. Chèn nút custom tùy chỉnh vào vị trí đó
            if (item.parentNode) {
              let customItem = item.parentNode.querySelector(
                "#custom-unpin-whiteboard-menu-item",
              );
              if (!customItem) {
                customItem = item.cloneNode(true);
                customItem.id = "custom-unpin-whiteboard-menu-item";
                item.parentNode.insertBefore(customItem, item.nextSibling);
              }

              // Dynamic state calculation
              let isWbPinned = false;
              let isScreensharing = false;
              if (window.APP && window.APP.store) {
                const state = window.APP.store.getState();
                const pinnedId = state["features/large-video"]?.participantId;
                const isTileView =
                  !!state["features/video-layout"]?.tileViewEnabled;
                isWbPinned = pinnedId === "whiteboard" && !isTileView;

                // Check screenshare status in Redux store
                const tracks = state["features/base/tracks"] || [];
                const hasDesktopTrack = Array.isArray(tracks)
                  ? tracks.some(
                      (t) => t && t.mediaType === "desktop" && !t.muted,
                    )
                  : Object.values(tracks).some(
                      (t) => t && t.mediaType === "desktop" && !t.muted,
                    );

                const isLargeDesktop =
                  !!state["features/large-video"]?.isScreenSharing;
                isScreensharing = hasDesktopTrack || isLargeDesktop;
              }

              const isStudentShareAllowed = !!(
                window.allowStudentScreenshare ||
                window.isStudentShareAllowedByTeacher
              );

              if (isScreensharing || isStudentShareAllowed || checkIfStudent()) {
                // Ẩn nút custom khi ĐANG CHIA SẺ MÀN HÌNH, KHI GIÁO VIÊN CẤP QUYỀN SHARE, hoặc khi là HỌC VIÊN
                customItem.style.setProperty("display", "none", "important");
              } else {
                const dynamicText = isWbPinned ? "Ẩn bảng" : "Bảng trắng";

                customItem.style.removeProperty("display");
                customItem.style.display = "";
                customItem.setAttribute("aria-label", dynamicText);
                customItem
                  .querySelectorAll("span")
                  .forEach((s) => (s.textContent = dynamicText));
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
        if (!isStudent) {
          injectTeacherShareControlBtn(doc);

          // 4-Slot (5-button) Mutual Exclusion: Screen Sharing, Shared Video, Student Share Control, Whiteboard group
          const shareBtn = findShareScreenWrapper(doc);
          const videoBtn = findSharedVideoWrapper(doc);
          const ctrlBtn = doc.getElementById(
            "custom-teacher-share-control-btn",
          );
          const customWbBtn = doc.getElementById(
            "custom-unpin-whiteboard-menu-item",
          );
          const _tbContainer = doc.querySelector('.toolbox-content-items');
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

          const wbGroup = [...Array.from(nativeWbBtns)];

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
      });
    } catch (e) {}
  }, 300);
})();

// Automatically show persistent text labels under each Jitsi toolbar button
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
