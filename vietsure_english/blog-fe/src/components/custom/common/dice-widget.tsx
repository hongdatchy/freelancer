'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DiceWidgetProps {
  apiRef: React.MutableRefObject<any>;
  isHost: boolean;
  apiReady?: boolean;
}

// CSS rotation transform to show each face (1-6) facing the viewer
const FACE_TRANSFORMS: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(-90deg) rotateY(0deg)',
  3: 'rotateX(0deg) rotateY(-90deg)',
  4: 'rotateX(0deg) rotateY(90deg)',
  5: 'rotateX(90deg) rotateY(0deg)',
  6: 'rotateX(0deg) rotateY(180deg)',
};

// Pip dot positions for each face (grid 3x3: [row, col])
const PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

// Individual 3D die face
const DieFace = ({ value, color }: { value: number; color: string }) => {
  const pips = PIP_POSITIONS[value] || [];
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      padding: '12%',
      boxSizing: 'border-box',
      gap: '6%',
      background: color,
      borderRadius: '14%',
    }}>
      {Array.from({ length: 9 }).map((_, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const hasPip = pips.some(([r, c]) => r === row && c === col);
        return (
          <div key={idx} style={{
            borderRadius: '50%',
            background: hasPip ? '#ffffff' : 'transparent',
            width: '100%',
            height: '100%',
            boxShadow: hasPip ? '0 1px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9)' : 'none',
          }} />
        );
      })}
    </div>
  );
};

// Single CSS 3D die
const Die3D = ({
  result,
  isRolling,
  size = 90,
}: {
  result: number;
  isRolling: boolean;
  size?: number;
}) => {
  const dieColor = 'linear-gradient(145deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)';
  const half = size / 2;

  const faceStyle = (transform: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    border: '2px solid rgba(255,255,255,0.25)',
    borderRadius: '14%',
    overflow: 'hidden',
    transform,
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)',
  });

  const resultTransform = FACE_TRANSFORMS[result] || FACE_TRANSFORMS[1];

  return (
    <div style={{
      width: size,
      height: size,
      perspective: size * 4,
      flexShrink: 0,
    }}>
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: isRolling
            ? undefined
            : resultTransform,
          animation: isRolling ? 'diceRoll 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
          transition: isRolling ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        {/* Face 1 - front */}
        <div style={faceStyle(`translateZ(${half}px)`)}>
          <DieFace value={1} color={dieColor} />
        </div>
        {/* Face 6 - back */}
        <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`)}>
          <DieFace value={6} color={dieColor} />
        </div>
        {/* Face 3 - right */}
        <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`)}>
          <DieFace value={3} color={dieColor} />
        </div>
        {/* Face 4 - left */}
        <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`)}>
          <DieFace value={4} color={dieColor} />
        </div>
        {/* Face 2 - top */}
        <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`)}>
          <DieFace value={2} color={dieColor} />
        </div>
        {/* Face 5 - bottom */}
        <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`)}>
          <DieFace value={5} color={dieColor} />
        </div>
      </div>
    </div>
  );
};

export default function DiceWidget({ apiRef, isHost, apiReady = false }: DiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [diceCount, setDiceCount] = useState(1);
  const [maxDots, setMaxDots] = useState(6);
  const [results, setResults] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);

  // Dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const initialLeftRef = useRef(0);
  const initialTopRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Inject keyframes once
  useEffect(() => {
    const id = 'dice-widget-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes diceRoll {
        0%   { transform: rotateX(0deg) rotateY(0deg); }
        10%  { transform: rotateX(120deg) rotateY(240deg); }
        20%  { transform: rotateX(300deg) rotateY(60deg); }
        30%  { transform: rotateX(180deg) rotateY(420deg); }
        40%  { transform: rotateX(60deg)  rotateY(180deg); }
        50%  { transform: rotateX(480deg) rotateY(300deg); }
        60%  { transform: rotateX(240deg) rotateY(120deg); }
        70%  { transform: rotateX(360deg) rotateY(480deg); }
        80%  { transform: rotateX(600deg) rotateY(240deg); }
        90%  { transform: rotateX(420deg) rotateY(540deg); }
        100% { transform: rotateX(720deg) rotateY(720deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, select')) return;
    const widgetEl = widgetRef.current;
    if (!widgetEl) return;
    const parentEl = widgetEl.parentElement;
    if (!parentEl) return;
    const parentRect = parentEl.getBoundingClientRect();
    const widgetRect = widgetEl.getBoundingClientRect();
    initialLeftRef.current = widgetRect.left - parentRect.left - dragOffset.x;
    initialTopRef.current = widgetRect.top - parentRect.top - dragOffset.y;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleDragMove = (e: MouseEvent) => {
      const widgetEl = widgetRef.current;
      if (!widgetEl) return;
      const parentEl = widgetEl.parentElement;
      if (!parentEl) return;
      const parentRect = parentEl.getBoundingClientRect();
      const widgetRect = widgetEl.getBoundingClientRect();
      const rawX = e.clientX - dragStartRef.current.x;
      const rawY = e.clientY - dragStartRef.current.y;
      if (Math.abs(rawX - dragOffset.x) > 5 || Math.abs(rawY - dragOffset.y) > 5) {
        hasMovedRef.current = true;
      }
      const proposedLeft = initialLeftRef.current + rawX;
      const proposedTop = initialTopRef.current + rawY;
      const clampedLeft = Math.max(0, Math.min(parentRect.width - widgetRect.width, proposedLeft));
      const clampedTop = Math.max(0, Math.min(parentRect.height - widgetRect.height, proposedTop));
      setDragOffset({ x: clampedLeft - initialLeftRef.current, y: clampedTop - initialTopRef.current });
    };
    const handleDragEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  const [customInputs, setCustomInputs] = useState<string[]>(['', '', '']);

  // Broadcast payload helper
  const broadcast = useCallback((payload: { action: string; results?: number[]; diceCount?: number }) => {
    const api = apiRef.current;
    if (!api) return;
    try {
      const str = JSON.stringify(payload);
      api.executeCommand('sendChatMessage', `__DICE__:${str}`);
      console.log('[Dice] Broadcasted:', payload.action);
    } catch (e) {
      console.error('[Dice] Broadcast failed:', e);
    }
  }, [apiRef]);

  const rollAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSoundViaJitsi = useCallback((soundPath: string, key?: string) => {
    try {
      const api = apiRef.current;
      if (api) {
        const iframe = api.getIFrame();
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'PLAY_CUSTOM_SOUND',
            soundPath,
            key,
            origin: typeof window !== 'undefined' ? window.location.origin : ''
          }, '*');
          return;
        }
      }
    } catch (e) {}

    try {
      if (rollAudioRef.current) {
        rollAudioRef.current.pause();
        rollAudioRef.current.currentTime = 0;
      }
      const audio = new Audio(soundPath);
      rollAudioRef.current = audio;
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn('[Dice Audio Fallback] Play failed:', err));
    } catch (e) {}
  }, [apiRef]);

  const stopSoundViaJitsi = useCallback((key?: string) => {
    try {
      const api = apiRef.current;
      if (api) {
        const iframe = api.getIFrame();
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'STOP_CUSTOM_SOUND',
            key
          }, '*');
        }
      }
    } catch (e) {}

    if (rollAudioRef.current) {
      try {
        rollAudioRef.current.pause();
        rollAudioRef.current.currentTime = 0;
      } catch (e) {}
    }
  }, [apiRef]);

  // Animate dice then show result & play freesound_community-diceshake.mp3 during roll, then dragon-studio-fireworks.mp3 when finished
  const animateToResult = useCallback((rollResults: number[]) => {
    setIsRolling(true);
    stopSoundViaJitsi('diceRoll');
    stopSoundViaJitsi('diceFinish');

    playSoundViaJitsi('/freesound_community-diceshake.mp3', 'diceRoll');

    setTimeout(() => {
      setIsRolling(false);
      setResults(rollResults);
      stopSoundViaJitsi('diceRoll');
      playSoundViaJitsi('/dragon-studio-fireworks.mp3', 'diceFinish');
    }, 1400);
  }, [playSoundViaJitsi, stopSoundViaJitsi]);

  // Teacher rolls (uses custom selected numbers if set, otherwise random between 1 and maxDots)
  const handleRoll = useCallback(() => {
    if (isRolling) return;
    const rollResults = Array.from({ length: diceCount }).map((_, i) => {
      const val = parseInt(customInputs[i], 10);
      if (!isNaN(val) && val >= 1 && val <= 6) {
        return val;
      }
      const upperLimit = Math.min(6, Math.max(1, maxDots));
      return Math.floor(Math.random() * upperLimit) + 1;
    });

    animateToResult(rollResults);
    if (isHost) {
      setTimeout(() => broadcast({ action: 'ROLL', results: rollResults, diceCount }), 100);
    }
  }, [isHost, isRolling, diceCount, maxDots, customInputs, animateToResult, broadcast]);

  // Change dice count - update results array length
  const handleCountChange = useCallback((count: number) => {
    setDiceCount(count);
    setResults(prev => {
      if (prev.length === count) return prev;
      if (prev.length < count) return [...prev, ...Array.from({ length: count - prev.length }, () => 1)];
      return prev.slice(0, count);
    });
  }, []);

  // Listen for toggle event (Host Teacher only from Jitsi toolbar)
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        const next = !prev;
        if (isHost) {
          broadcast({ action: next ? 'OPEN' : 'CLOSE', diceCount });
        }
        return next;
      });
    };
    window.addEventListener('toggle-dice-widget', handleToggle);
    return () => window.removeEventListener('toggle-dice-widget', handleToggle);
  }, [isHost, diceCount, broadcast]);

  const handleClose = () => {
    stopSoundViaJitsi('diceRoll');
    stopSoundViaJitsi('diceFinish');
    setIsOpen(false);
    if (isHost) {
      broadcast({ action: 'CLOSE' });
    }
  };


  // Listen for sync events from host (Student / Remote participants)
  useEffect(() => {
    const handleSyncDice = (e: Event) => {
      const customEvent = e as CustomEvent;
      const payload = customEvent.detail || {};

      if (payload.action === 'OPEN') {
        setIsOpen(true);
        if (payload.diceCount) setDiceCount(payload.diceCount);
      } else if (payload.action === 'CLOSE') {
        setIsOpen(false);
      } else if (payload.action === 'ROLL' || payload.action === 'SPIN') {
        setIsOpen(true);
        if (Array.isArray(payload.results) && payload.results.length > 0) {
          setDiceCount(payload.results.length);
          animateToResult(payload.results);
        }
      } else if (Array.isArray(payload.results) && payload.results.length > 0) {
        setDiceCount(payload.results.length);
      }
    };
    window.addEventListener('sync-dice-action', handleSyncDice);
    return () => window.removeEventListener('sync-dice-action', handleSyncDice);
  }, [animateToResult]);

  const joinTimeRef = useRef<number>(Date.now() - 2000);

  // Set up Jitsi XMPP Chat event listeners for sync with history message filter
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !apiReady) return;

    const onIncomingChat = (event: any) => {
      const msg = event?.message;
      if (typeof msg === 'string' && msg.startsWith('__DICE__:')) {
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
        if (isHistory) return;

        const payloadStr = msg.slice('__DICE__:'.length);
        try {
          const payload = JSON.parse(payloadStr);
          if (payload.action === 'OPEN') {
            setIsOpen(true);
            if (payload.diceCount) setDiceCount(payload.diceCount);
          } else if (payload.action === 'CLOSE') {
            setIsOpen(false);
          } else if (payload.action === 'ROLL' || payload.action === 'SPIN') {
            setIsOpen(true);
            if (Array.isArray(payload.results) && payload.results.length > 0) {
              setDiceCount(payload.results.length);
              animateToResult(payload.results);
            }
          }
        } catch (e) {
          if (payloadStr === 'OPEN' || payloadStr === 'CLOSE') {
            setIsOpen(payloadStr === 'OPEN');
          } else {
            const results = payloadStr.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
            if (results.length > 0) {
              setDiceCount(results.length);
              setIsOpen(true);
              animateToResult(results);
            }
          }
        }
      }
    };

    api.addEventListener('incomingMessage', onIncomingChat);
    return () => {
      api.removeEventListener('incomingMessage', onIncomingChat);
    };
  }, [apiRef, apiReady, animateToResult]);



  // Die size based on count: larger for Student view (!isHost)
  const dieSize = !isHost 
    ? (diceCount === 1 ? 140 : diceCount === 2 ? 120 : 100) 
    : (diceCount === 1 ? 100 : diceCount === 2 ? 88 : 76);

  // Sum
  const total = results.slice(0, diceCount).reduce((a, b) => a + b, 0);

  if (!isOpen) return null;

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleDragStart}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        width: !isHost 
          ? (diceCount === 1 ? 300 : diceCount === 2 ? 380 : 460)
          : (diceCount === 1 ? 240 : diceCount === 2 ? 310 : 380),
      }}
    >
      {/* Widget card */}
      <div style={{
        background: isHost ? 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' : 'transparent',
        borderRadius: 20,
        border: isHost ? '1.5px solid rgba(148, 163, 184, 0.4)' : 'none',
        boxShadow: isHost ? '0 20px 50px rgba(0,0,0,0.2), 0 4px 15px rgba(0,0,0,0.05)' : 'none',
        filter: isHost ? 'none' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        overflow: 'hidden',
        minHeight: 240,
      }}>
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            background: isHost ? 'linear-gradient(90deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 100%)' : 'transparent',
            borderBottom: isHost ? '1px solid rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isHost ? 'space-between' : 'center',
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: !isHost ? 24 : 18, filter: isHost ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>🎲</span>
            <span style={{ 
              color: isHost ? '#1e1b4b' : '#a855f7', 
              fontWeight: 800, 
              fontSize: !isHost ? 18 : 15, 
              letterSpacing: 0.5,
              textShadow: isHost ? 'none' : '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(168,85,247,0.4)',
            }}>
              Xí ngầu
            </span>
          </div>
          {isHost && (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={handleClose}
              style={{
                background: 'rgba(0,0,0,0.06)',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                borderRadius: 6,
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                lineHeight: 1,
                transition: 'background 0.2s',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Dice count selector - host only */}
        {isHost && (
          <div
            onMouseDown={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px 0',
            }}
          >
            <span style={{ color: '#475569', fontSize: 12, fontWeight: 600, marginRight: 4 }}>Số xúc xắc:</span>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onMouseDown={e => e.stopPropagation()}
                onClick={() => handleCountChange(n)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: diceCount === n
                    ? '2px solid #7c3aed'
                    : '1.5px solid #cbd5e1',
                  background: diceCount === n
                    ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                    : '#ffffff',
                  color: diceCount === n ? '#fff' : '#475569',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: diceCount === n ? '0 4px 12px rgba(124,58,237,0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Max dots selector - host only */}
        {isHost && (
          <div
            onMouseDown={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 16px 0',
            }}
          >
            <span style={{ color: '#475569', fontSize: 12, fontWeight: 600, marginRight: 4 }}>Số chấm tối đa:</span>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                onMouseDown={e => e.stopPropagation()}
                onClick={() => setMaxDots(n)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: maxDots === n ? '2px solid #10b981' : '1.5px solid #cbd5e1',
                  background: maxDots === n ? 'linear-gradient(135deg, #10b981, #059669)' : '#ffffff',
                  color: maxDots === n ? '#fff' : '#475569',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: maxDots === n ? '0 3px 8px rgba(16,185,129,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Custom target number selector - host only */}
        {isHost && (
          <div
            onMouseDown={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 16px 0',
            }}
          >
            <span style={{ color: '#475569', fontSize: 11, fontWeight: 600 }}>Cố định điểm:</span>
            {Array.from({ length: diceCount }).map((_, i) => (
              <select
                key={i}
                value={customInputs[i] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomInputs((prev) => {
                    const next = [...prev];
                    next[i] = val;
                    return next;
                  });
                }}
                style={{
                  background: customInputs[i] ? '#f0fdf4' : '#ffffff',
                  color: customInputs[i] ? '#047857' : '#475569',
                  border: customInputs[i] ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '2px 4px',
                  fontSize: 11,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <option value="" style={{ background: '#ffffff', color: '#64748b' }}>🎲 Ngẫu nhiên</option>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} style={{ background: '#ffffff', color: '#0f172a' }}>
                    Điểm: {num}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Dice area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: diceCount === 3 ? 10 : 14,
          padding: !isHost ? '28px 24px 20px' : '24px 20px 16px',
          minHeight: !isHost ? 170 : 140,
        }}>
          {Array.from({ length: diceCount }).map((_, i) => (
            <Die3D
              key={i}
              result={results[i] ?? 1}
              isRolling={isRolling}
              size={dieSize}
            />
          ))}
        </div>

        {/* Result total */}
        {!isRolling && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingBottom: 8,
          }}>
            {diceCount > 1 && (
              <span style={{ 
                color: isHost ? '#475569' : '#1e1b4b', 
                fontSize: !isHost ? 22 : 18, 
                fontWeight: 800,
                textShadow: isHost ? 'none' : '0 1px 3px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.9)',
              }}>
                {results.slice(0, diceCount).join(' + ')} =
              </span>
            )}
            <span style={{
              fontSize: !isHost ? 32 : 26,
              fontWeight: 900,
              color: '#d97706',
              textShadow: isHost ? 'none' : '0 1px 2px rgba(255,255,255,0.8)',
              letterSpacing: -0.5,
            }}>
              {total}
            </span>
          </div>
        )}

        {/* Rolling indicator */}
        {isRolling && (
          <div style={{
            textAlign: 'center',
            paddingBottom: 12,
            color: '#8b5cf6',
            fontSize: !isHost ? 15 : 13,
            fontWeight: 600,
            letterSpacing: 1,
            animation: 'none',
          }}>
            🎲 Đang lắc...
          </div>
        )}

        {/* Roll button - host only */}
        {isHost && (
          <div
            onMouseDown={e => e.stopPropagation()}
            style={{ padding: '4px 16px 16px' }}
          >
            <button
              onClick={handleRoll}
              disabled={isRolling}
              style={{
                width: '100%',
                padding: '11px 0',
                borderRadius: 12,
                border: 'none',
                background: isRolling
                  ? 'rgba(139,92,246,0.3)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                cursor: isRolling ? 'not-allowed' : 'pointer',
                boxShadow: isRolling ? 'none' : '0 6px 20px rgba(139,92,246,0.5)',
                transition: 'all 0.2s',
                letterSpacing: 0.5,
              }}
            >
              {isRolling ? '🎲 Đang lắc...' : '🎲 Lắc!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
