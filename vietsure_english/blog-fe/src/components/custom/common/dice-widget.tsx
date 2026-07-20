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
            background: hasPip ? '#1a1a2e' : 'transparent',
            width: '100%',
            height: '100%',
            boxShadow: hasPip ? 'inset 0 2px 4px rgba(0,0,0,0.4)' : 'none',
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
  const dieColor = '#f5f0e8';
  const half = size / 2;

  const faceStyle = (transform: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    border: '2px solid rgba(0,0,0,0.15)',
    borderRadius: '14%',
    overflow: 'hidden',
    transform,
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
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

  // Broadcast roll results to all participants via Jitsi chat
  const broadcastResults = useCallback((rollResults: number[]) => {
    const api = apiRef.current;
    if (!api) return;
    try {
      api.executeCommand('sendChatMessage', `__DICE__:${rollResults.join(',')}`);
      console.log('[Dice] Broadcasted results:', rollResults);
    } catch (e) {
      console.error('[Dice] Broadcast failed:', e);
    }
  }, [apiRef]);

  // Animate dice then show result
  const animateToResult = useCallback((rollResults: number[]) => {
    setIsRolling(true);
    setTimeout(() => {
      setIsRolling(false);
      setResults(rollResults);
    }, 1500);
  }, []);

  // Teacher rolls
  const handleRoll = useCallback(() => {
    if (isRolling) return;
    const rollResults = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    animateToResult(rollResults);
    // Broadcast after short delay so animation starts first
    setTimeout(() => broadcastResults(rollResults), 100);
  }, [isRolling, diceCount, animateToResult, broadcastResults]);

  // Change dice count - update results array length
  const handleCountChange = useCallback((count: number) => {
    setDiceCount(count);
    setResults(prev => {
      if (prev.length === count) return prev;
      if (prev.length < count) return [...prev, ...Array.from({ length: count - prev.length }, () => 1)];
      return prev.slice(0, count);
    });
  }, []);

  // Listen for toggle event from Jitsi toolbar
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-dice-widget', handleToggle);
    return () => window.removeEventListener('toggle-dice-widget', handleToggle);
  }, []);

  // Listen for sync events from other participants (broadcast received)
  useEffect(() => {
    const handleSyncDice = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { results: syncedResults } = customEvent.detail || {};
      if (!Array.isArray(syncedResults) || syncedResults.length === 0) return;
      setDiceCount(syncedResults.length);
      setIsOpen(true);
      animateToResult(syncedResults);
    };
    window.addEventListener('sync-dice-result', handleSyncDice);
    return () => window.removeEventListener('sync-dice-result', handleSyncDice);
  }, [animateToResult]);

  // Die size based on count
  const dieSize = diceCount === 1 ? 100 : diceCount === 2 ? 88 : 76;

  // Sum
  const total = results.slice(0, diceCount).reduce((a, b) => a + b, 0);

  if (!isOpen) return null;

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleDragStart}
      style={{
        position: 'absolute',
        bottom: 90,
        right: 20,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        width: diceCount === 1 ? 240 : diceCount === 2 ? 310 : 380,
      }}
    >
      {/* Widget card */}
      <div style={{
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: 20,
        border: '1.5px solid rgba(139,92,246,0.5)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
        overflow: 'hidden',
        minHeight: 240,
      }}>
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            background: 'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.2) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎲</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>Xí ngầu</span>
          </div>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#94a3b8',
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
            <span style={{ color: '#94a3b8', fontSize: 12, marginRight: 4 }}>Số xúc xắc:</span>
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
                    ? '2px solid #8b5cf6'
                    : '1.5px solid rgba(255,255,255,0.15)',
                  background: diceCount === n
                    ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                    : 'rgba(255,255,255,0.06)',
                  color: diceCount === n ? '#fff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: diceCount === n ? '0 4px 12px rgba(139,92,246,0.4)' : 'none',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Dice area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: diceCount === 3 ? 10 : 14,
          padding: '24px 20px 16px',
          minHeight: 140,
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
            textAlign: 'center',
            paddingBottom: 8,
          }}>
            {diceCount > 1 && (
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>
                {results.slice(0, diceCount).join(' + ')} =
              </div>
            )}
            <div style={{
              fontSize: diceCount > 1 ? 28 : 36,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: -1,
            }}>
              {total}
            </div>
          </div>
        )}

        {/* Rolling indicator */}
        {isRolling && (
          <div style={{
            textAlign: 'center',
            paddingBottom: 12,
            color: '#8b5cf6',
            fontSize: 13,
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
