'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PraiseWidgetProps {
  apiRef: React.MutableRefObject<any>;
  isHost: boolean;
  apiReady?: boolean;
  roomName?: string;
}

// Celebration / Praise animations (mascot characters bubbling up from the bottom with hooray sounds & banner)
export const triggerPraiseAnimation = (param?: any, apiRef?: any) => {
  if (typeof window === 'undefined') return;

  let mascotIdx = 0;
  let studentName = '';
  let isAll = false;

  if (typeof param === 'number') {
    mascotIdx = param;
  } else if (param && typeof param === 'object') {
    mascotIdx = typeof param.mascotIdx === 'number' ? param.mascotIdx : (typeof param.index === 'number' ? param.index : 0);
    studentName = param.studentName || '';
    isAll = !!param.isAll;
  }

  // 1. Play Hooray celebratory sound via MP3 (attempt via Jitsi iframe if apiRef provided)
  try {
    const api = apiRef?.current;
    let playedViaIframe = false;
    if (api) {
      const iframe = api.getIFrame();
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'PLAY_CUSTOM_SOUND',
          soundPath: '/Hooray.mp3',
          key: 'praiseSound',
          origin: window.location.origin
        }, '*');
        playedViaIframe = true;
      }
    }
    if (!playedViaIframe) {
      import('@/lib/audio-context').then(({ playSound }) => playSound('/Hooray.mp3'));
    }
  } catch (e) {
    console.warn('[Praise] Audio player creation failed:', e);
  }


  const targetParent = document.fullscreenElement || document.body;
  const containerId = 'custom-celebration-container';
  let container = document.getElementById(containerId);
  if (!container || !targetParent.contains(container)) {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = document.createElement('div');
    container.id = containerId;
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    `;
    targetParent.appendChild(container);
  }

  // Inject animation keyframes stylesheet if not present
  const styleId = 'custom-celebration-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes floatUpSingle {
        0% {
          transform: translate(-50%, 0) scale(0.6) rotate(0deg);
          opacity: 0;
        }
        20% {
          transform: translate(-50%, -60vh) scale(1) rotate(-3deg);
          opacity: 1;
        }
        80% {
          transform: translate(-50%, -65vh) scale(1) rotate(3deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -135vh) scale(0.8) rotate(10deg);
          opacity: 0;
        }
      }
      .praise-wrapper-single {
        position: absolute;
        left: 50%;
        bottom: -360px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        will-change: transform, opacity;
        animation: floatUpSingle 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      .praise-banner-single {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
        color: #ffffff;
        padding: 8px 20px;
        border-radius: 30px;
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 0.5px;
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6), inset 0 2px 4px rgba(255,255,255,0.4);
        border: 2px solid #fef3c7;
        text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  // Mascot penguin characters to spawn
  const penguinImages = [
    '/images/phan-khich-nang-dong.png',
    '/images/hao-hung-san-sang.png',
    '/images/bo-ngo-to-mo.png',
    '/images/character-penguin.png',
    '/images/tap-trung-quyet-liet.png'
  ];

  const imgPath = penguinImages[mascotIdx % penguinImages.length];

  // Spawn wrapper element with banner + mascot image
  const wrapper = document.createElement('div');
  wrapper.className = 'praise-wrapper-single';

  if (studentName || isAll) {
    const banner = document.createElement('div');
    banner.className = 'praise-banner-single';
    const text = isAll ? '🌟 KHEN THƯỞNG CẢ LỚP (+1 ⭐)' : `⭐ KHEN THƯỞNG ${studentName.toUpperCase()} (+1 ⭐)`;
    banner.innerHTML = text;
    wrapper.appendChild(banner);
  }

  const img = document.createElement('img');
  img.src = imgPath;
  img.style.width = '240px';
  img.style.height = 'auto';
  wrapper.appendChild(img);

  container.appendChild(wrapper);

  setTimeout(() => {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
    const currentContainer = document.getElementById(containerId);
    if (currentContainer && currentContainer.childNodes.length === 0 && currentContainer.parentNode) {
      currentContainer.parentNode.removeChild(currentContainer);
    }
  }, 2800);
};

export default function PraiseWidget({ apiRef, isHost, apiReady, roomName }: PraiseWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const starScoresKey = `praiseStars_${roomName || 'default'}`;
  const [starScores, setStarScores] = useState<Record<string, number>>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(starScoresKey);
        return saved ? JSON.parse(saved) : {};
      }
    } catch {}
    return {};
  });

  // Continuously sync starScores map to Jitsi iframe so avatars always show ⭐
  useEffect(() => {
    try {
      const api = apiRef.current;
      if (api) {
        const iframe = api.getIFrame();
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'SYNC_PRAISE_SCORES',
            starScores
          }, '*');
        }
      }
    } catch (e) {}
  }, [starScores, apiRef, apiReady]);

  // Listen for toggle / trigger praise event from parent or Jitsi toolbar
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('toggle-praise-widget', handleToggle);
    window.addEventListener('trigger-praise-modal', handleToggle);
    return () => {
      window.removeEventListener('toggle-praise-widget', handleToggle);
    };
  }, []);

  const joinTimeRef = useRef<number>(Date.now() - 2000);

  // Listen for incoming Jitsi chat messages for broadcasted praise sync with history filter
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !apiReady) return;

    // Reset join timestamp whenever room switches/joins so past messages are correctly filtered as history
    joinTimeRef.current = Date.now() - 2000;

    const onConferenceJoined = () => {
      joinTimeRef.current = Date.now() - 2000;
    };

    const onIncomingChat = (event: any) => {
      const msg = event?.message;
      if (typeof msg === 'string' && msg.startsWith('__PRAISE__:')) {
        let messageTime: number | null = null;
        if (typeof event?.stamp === 'number') {
          messageTime = event.stamp;
        } else if (event?.stamp && typeof event.stamp.getTime === 'function') {
          messageTime = event.stamp.getTime();
        } else if (typeof event?.stamp === 'string') {
          const parsed = Date.parse(event.stamp);
          if (!isNaN(parsed)) messageTime = parsed;
        } else if (typeof event?.timestamp === 'number') {
          messageTime = event.timestamp;
        }

        const isHistory = !!(messageTime && joinTimeRef.current && messageTime < joinTimeRef.current);
        const jsonStr = msg.slice('__PRAISE__:'.length);
        try {
          if (jsonStr.startsWith('{')) {
            const payload = JSON.parse(jsonStr);
            if (payload.reset) {
              setStarScores({});
              try { localStorage.removeItem(starScoresKey); } catch {}
            } else {
              if (!isHistory) {
                triggerPraiseAnimation(payload, apiRef);
                if (payload.allScores) {
                  setStarScores(payload.allScores);
                  try { localStorage.setItem(starScoresKey, JSON.stringify(payload.allScores)); } catch {}
                } else if (payload.studentName) {
                  setStarScores(prev => {
                    const next = { ...prev, [payload.studentName]: (prev[payload.studentName] || 0) + 1 };
                    try { localStorage.setItem(starScoresKey, JSON.stringify(next)); } catch {}
                    return next;
                  });
                }
              }
            }
          } else {
            if (!isHistory) {
              const idx = parseInt(jsonStr, 10);
              triggerPraiseAnimation({ mascotIdx: isNaN(idx) ? 0 : idx }, apiRef);
            }
          }
        } catch (e) {
          console.warn('[Praise] Failed to parse chat praise payload:', e);
        }
      }
    };

    api.addEventListener('videoConferenceJoined', onConferenceJoined);
    api.addEventListener('incomingMessage', onIncomingChat);
    return () => {
      api.removeEventListener('videoConferenceJoined', onConferenceJoined);
      api.removeEventListener('incomingMessage', onIncomingChat);
    };
  }, [apiReady, roomName, starScoresKey, apiRef]);



  // Helper to extract student list from Jitsi participants info
  const getStudentList = () => {
    if (!apiRef.current) return [];
    try {
      const participants = apiRef.current.getParticipantsInfo() || [];
      return participants
        .filter((p: any) => {
          const displayName = p.formattedDisplayName || p.displayName || '';
          if (displayName.includes('(me)')) return false;
          return true;
        })
        .map((p: any) => ({
          id: p.participantId || p.id,
          name: (p.formattedDisplayName || p.displayName || 'Học viên').replace(/\s*⭐\s*\d+/g, '').trim(),
        }));
    } catch (e) {
      return [];
    }
  };

  const handleSendPraise = (opts: { studentName?: string; studentId?: string; isAll?: boolean }) => {
    const randIndex = Math.floor(Math.random() * 5);
    const students = getStudentList();

    if (opts.isAll) {
      const newScores = { ...starScores };
      students.forEach((s: any) => { newScores[s.name] = (newScores[s.name] || 0) + 1; });

      const payload = { isAll: true, mascotIdx: randIndex, allScores: newScores };
      if (apiRef.current) {
        apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${JSON.stringify(payload)}`);
      }

      triggerPraiseAnimation({ isAll: true, mascotIdx: randIndex }, apiRef);
      setStarScores(newScores);
      try { localStorage.setItem(starScoresKey, JSON.stringify(newScores)); } catch {}

    } else if (opts.studentName) {
      const newScores = { ...starScores, [opts.studentName]: (starScores[opts.studentName] || 0) + 1 };
      const payload = { studentName: opts.studentName, mascotIdx: randIndex, allScores: newScores };
      if (apiRef.current) {
        apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${JSON.stringify(payload)}`);
      }
      triggerPraiseAnimation(payload, apiRef);
      setStarScores(newScores);
      try { localStorage.setItem(starScoresKey, JSON.stringify(newScores)); } catch {}
    }

    setIsOpen(false);
  };

  const handleResetScores = () => {
    setStarScores({});
    try { localStorage.removeItem(starScoresKey); } catch {}
    if (apiRef.current) {
      const payload = { reset: true, allScores: {} };
      apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${JSON.stringify(payload)}`);
    }
  };

  if (!isOpen || !isHost) return null;

  return (
    <div
      className="no-drag"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)',
        color: '#fff',
        borderRadius: 20,
        padding: 24,
        width: 380,
        maxWidth: '90vw',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.4)',
        border: '1.5px solid rgba(167, 139, 250, 0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>⭐</span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fef08a' }}>Khen Thưởng Học Viên</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 20, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      <p style={{ fontSize: 13, color: '#c7d2fe', marginBottom: 16, marginTop: 0 }}>
        Chọn học viên để tặng Ngôi sao khen thưởng ⭐
      </p>

      {/* Praise All button */}
      <button
        onClick={() => handleSendPraise({ isAll: true })}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 12,
          border: 'none',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          marginBottom: 16,
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span>🌟 Khen Thưởng Cả Lớp (+1 ⭐)</span>
      </button>

      {/* Student list */}
      <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {getStudentList().map((student: any, idx: number) => {
          const stars = starScores[student.name] || 0;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🎓</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>{student.name}</span>
                <span style={{ background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                  ⭐ {stars}
                </span>
              </div>
              <button
                onClick={() => handleSendPraise({ studentName: student.name })}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                }}
              >
                +1 ⭐ Khen
              </button>
            </div>
          );
        })}
        {getStudentList().length === 0 && (
          <div style={{ textAlign: 'center', color: '#a78bfa', padding: '16px 0', fontSize: 13 }}>
            Đang chờ học viên tham gia...
          </div>
        )}
      </div>

      {/* Reset Scores Button */}
      <button
        onClick={handleResetScores}
        style={{
          width: '100%',
          marginTop: 16,
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#cbd5e1',
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
          e.currentTarget.style.color = '#fca5a5';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#cbd5e1';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <span>🔄 Reset toàn bộ điểm ⭐ về 0</span>
      </button>
    </div>
  );
}
