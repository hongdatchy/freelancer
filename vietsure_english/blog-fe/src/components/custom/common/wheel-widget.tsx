'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WheelWidgetProps {
  apiRef: React.MutableRefObject<any>;
  isHost: boolean;
  apiReady?: boolean;
}

type WheelAction = 'OPEN' | 'SPIN' | 'UPDATE_ITEMS' | 'CLOSE';

interface WheelPayload {
  type: 'WHEEL_ACTION';
  action: WheelAction;
  items?: string[];
  winningIndex?: number;
  winningItem?: string;
  targetAngle?: number;
  startTimestamp?: number;
  duration?: number;
}

const DEFAULT_ITEMS = [
  'Học viên A',
  'Học viên B',
  'Học viên C',
  'Cộng 10 điểm 🌟',
  'May mắn lần sau 🍀',
  'Hát 1 bài 🎤'
];

const SLICE_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export default function WheelWidget({
  apiRef,
  isHost,
  apiReady = false,
}: WheelWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTextInput, setEditTextInput] = useState('');

  // Dragging support
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const initialLeftRef = useRef(0);
  const initialTopRef = useRef(0);
  const hasMovedRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const participantIds = useRef<Set<string>>(new Set());
  const currentAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, canvas')) return;

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
    dragStartRef.current = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
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

      setDragOffset({
        x: clampedLeft - initialLeftRef.current,
        y: clampedTop - initialTopRef.current,
      });
    };

    const handleDragEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  // Broadcast helper
  const broadcast = (payload: WheelPayload) => {
    const api = apiRef.current;
    if (!api) return;
    try {
      const str = JSON.stringify(payload);
      api.executeCommand('sendChatMessage', `__WHEEL__:${str}`);
      console.log('[Wheel] Broadcasted:', payload.action);
    } catch (e) {
      console.error('[Wheel] Broadcast failed:', e);
    }
  };

  // Listen for open/toggle event from parent window / control bar
  useEffect(() => {
    const handleToggleWheel = () => {
      setIsOpen((prev) => {
        const next = !prev;
        if (isHost && next) {
          broadcast({ type: 'WHEEL_ACTION', action: 'OPEN', items });
        }
        return next;
      });
    };
    window.addEventListener('toggle-wheel-widget', handleToggleWheel);
    return () => window.removeEventListener('toggle-wheel-widget', handleToggleWheel);
  }, [isHost, items]);

  // Draw Canvas Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSlices = items.length || 1;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    for (let i = 0; i < numSlices; i++) {
      const startA = i * sliceAngle;
      const endA = (i + 1) * sliceAngle;
      const color = SLICE_COLORS[i % SLICE_COLORS.length];

      // Slice sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1E1B4B';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.rotate(startA + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      
      let label = items[i] || '';
      if (label.length > 13) label = label.substring(0, 12) + '…';
      ctx.fillText(label, radius - 12, 4);
      ctx.restore();
    }

    // Center peg/cap
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.restore();
  }, [items, rotationAngle, isOpen]);

  // Execute Spin animation smoothly towards target angle
  const animateSpin = (targetDeg: number, duration: number, winningText: string) => {
    setIsSpinning(true);
    setWinner(null);

    const startDeg = currentAngleRef.current;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic easing curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentDeg = startDeg + (targetDeg - startDeg) * easeOut;

      currentAngleRef.current = currentDeg;
      setRotationAngle(currentDeg % 360);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsSpinning(false);
        setWinner(winningText);
        console.log('[Wheel] Spin completed! Winner:', winningText);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Apply incoming Wheel action payload from XMPP chat
  const applyWheelPayload = (payload: WheelPayload) => {
    if (!payload || payload.type !== 'WHEEL_ACTION') return;
    console.log('[Wheel] Received payload:', payload.action);

    if (payload.items && Array.isArray(payload.items)) {
      setItems(payload.items);
    }

    switch (payload.action) {
      case 'OPEN':
        setIsOpen(true);
        break;
      case 'SPIN': {
        setIsOpen(true);
        const targetDeg = payload.targetAngle ?? (360 * 5 + 180);
        const duration = payload.duration ?? 4000;
        const winText = payload.winningItem || 'Người chiến thắng!';
        animateSpin(targetDeg, duration, winText);
        break;
      }
      case 'UPDATE_ITEMS':
        if (payload.items) setItems(payload.items);
        break;
      case 'CLOSE':
        setIsOpen(false);
        setIsSpinning(false);
        setWinner(null);
        break;
    }
  };

  // Set up Jitsi XMPP Chat event listeners for sync
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !apiReady) return;

    const onIncomingChat = (event: any) => {
      const msg = event?.message;
      if (typeof msg === 'string' && msg.startsWith('__WHEEL__:')) {
        const jsonStr = msg.slice('__WHEEL__:'.length);
        try {
          const decoded = JSON.parse(jsonStr);
          applyWheelPayload(decoded);
        } catch (e) {
          console.warn('[Wheel] Failed to parse chat payload:', e);
        }
      }
    };

    api.addEventListener('incomingMessage', onIncomingChat);
    return () => {
      api.removeEventListener('incomingMessage', onIncomingChat);
    };
  }, [apiReady]);

  // Host Teacher: Trigger Spin action
  const handleHostSpin = () => {
    if (isSpinning || items.length === 0) return;
    setWinner(null);

    const winIdx = Math.floor(Math.random() * items.length);
    const winText = items[winIdx];

    const sliceAngle = 360 / items.length;
    // Align pointer (top 270 deg) with winning slice center
    const winSliceCenter = (winIdx + 0.5) * sliceAngle;
    const offsetToTop = 270 - winSliceCenter;
    const fullSpins = 360 * 6; // 6 full rotations for excitement
    const targetDeg = currentAngleRef.current + fullSpins + ((offsetToTop - (currentAngleRef.current % 360) + 360) % 360);

    const duration = 4500;

    // Broadcast deterministic spin payload to all students
    broadcast({
      type: 'WHEEL_ACTION',
      action: 'SPIN',
      winningIndex: winIdx,
      winningItem: winText,
      targetAngle: targetDeg,
      duration,
      items,
    });

    animateSpin(targetDeg, duration, winText);
  };

  // Host Teacher: Save edited item list
  const handleSaveItems = () => {
    const newItems = editTextInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (newItems.length > 0) {
      setItems(newItems);
      setShowEditModal(false);
      broadcast({
        type: 'WHEEL_ACTION',
        action: 'UPDATE_ITEMS',
        items: newItems,
      });
    }
  };

  const handleOpenEdit = () => {
    setEditTextInput(items.join('\n'));
    setShowEditModal(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (isHost) {
      broadcast({ type: 'WHEEL_ACTION', action: 'CLOSE' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isDragging && <div className="fixed inset-0 z-[9998] cursor-move bg-transparent" />}
      
      <div
        ref={widgetRef}
        style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
        className="absolute top-16 left-6 z-[9999] select-none"
        onMouseDown={handleDragStart}
      >
        {/* Main Wheel Card */}
        <div className="flex flex-col items-center bg-slate-900/95 text-white rounded-2xl p-3.5 w-64 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-purple-500/30 backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="flex w-full items-center justify-between pb-2 mb-2 border-b border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🎡</span>
              <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">
                Vòng Quay May Mắn
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isHost && (
                <button
                  onClick={handleOpenEdit}
                  disabled={isSpinning}
                  className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
                  title="Chỉnh sửa danh sách"
                >
                  ✏️
                </button>
              )}
              {isHost && (
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
                  title="Đóng"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Wheel Canvas Container */}
          <div className="relative my-1 flex items-center justify-center">
            {/* Top Indicator Pointer */}
            <div className="absolute -top-2 z-10 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[16px] border-t-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

            <canvas
              ref={canvasRef}
              width={210}
              height={210}
              className="rounded-full shadow-inner border-2 border-purple-400/40"
            />
          </div>

          {/* Winner Announcement Banner */}
          {winner && (
            <div className="w-full mt-2 py-1.5 px-2.5 bg-gradient-to-r from-purple-600/90 to-pink-600/90 rounded-xl text-center shadow-lg border border-pink-400/40 animate-bounce">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">🎉 Chúc mừng 🎉</span>
              <span className="text-xs font-black text-white truncate block">{winner}</span>
            </div>
          )}

          {/* Teacher Action Controls */}
          {isHost && (
            <div className="flex items-center gap-2 w-full mt-3">
              <button
                onClick={handleHostSpin}
                disabled={isSpinning}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all transform active:scale-95 ${
                  isSpinning
                    ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 hover:shadow-purple-500/30'
                }`}
              >
                {isSpinning ? '🌀 Đang quay...' : '🚀 QUAY NGAY'}
              </button>
            </div>
          )}
        </div>

        {/* Teacher Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-purple-500/30 text-white p-4 rounded-2xl w-72 shadow-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-xs font-bold uppercase text-purple-400">✏️ Danh sách ô quay</span>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <p className="text-[10px] text-slate-400">Nhập mỗi mục trên 1 dòng (Tên học viên hoặc quà thưởng):</p>
              <textarea
                value={editTextInput}
                onChange={(e) => setEditTextInput(e.target.value)}
                rows={6}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveItems}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-lg text-white"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
