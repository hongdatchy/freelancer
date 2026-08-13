'use client';

import React, { useState, useEffect, useRef } from 'react';
import { playSound, playTickSound, stopTickSound } from '@/lib/audio-context';

interface TimerWidgetProps {
  apiRef: React.MutableRefObject<any>;
  isHost: boolean;
  apiReady?: boolean;
  inTopBar?: boolean;
}

type TimerAction = 'OPEN' | 'START' | 'PAUSE' | 'RESET' | 'CLOSE';
type TimerMode = 'UP' | 'DOWN';

interface TimerPayload {
  type: 'TIMER_ACTION';
  action: TimerAction;
  timerMode: TimerMode;
  startTimestamp?: number;
  elapsed?: number;
  initialLimit?: number;
}

export default function TimerWidget({
  apiRef,
  isHost,
  apiReady = false,
  inTopBar = false,
}: TimerWidgetProps) {
  const [time, setTime]         = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen]     = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('UP');
  const [initialLimit, setInitialLimit] = useState(300); // 5 mins in seconds
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const [flashToggle, setFlashToggle]   = useState(true);

  // Dragging support
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const initialLeftRef = useRef(0);
  const initialTopRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    
    const target = e.target as HTMLElement;
    // Allow dragging circular open button even though it's technically a button tag
    const isCircularBtn = target.closest('.timer-open-btn');
    if (!isCircularBtn && target.closest('button, input, select')) return;

    const widgetEl = widgetRef.current;
    if (!widgetEl) return;
    const parentEl = widgetEl.parentElement;
    if (!parentEl) return;

    const parentRect = parentEl.getBoundingClientRect();
    const widgetRect = widgetEl.getBoundingClientRect();

    initialLeftRef.current = widgetRect.left - parentRect.left - dragOffset.x;
    initialTopRef.current = widgetRect.top - parentRect.top - dragOffset.y;

    setIsDragging(true);
    hasMovedRef.current = false; // Reset movement flag on start
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

      // Mark as moved if displacement exceeds 5px threshold to prevent click triggering
      if (Math.abs(rawX - dragOffset.x) > 5 || Math.abs(rawY - dragOffset.y) > 5) {
        hasMovedRef.current = true;
      }

      const proposedLeft = initialLeftRef.current + rawX;
      const proposedTop = initialTopRef.current + rawY;

      // Clamp coordinates to remain within parent boundaries
      const clampedLeft = Math.max(0, Math.min(parentRect.width - widgetRect.width, proposedLeft));
      const clampedTop = Math.max(0, Math.min(parentRect.height - widgetRect.height, proposedTop));

      setDragOffset({
        x: clampedLeft - initialLeftRef.current,
        y: clampedTop - initialTopRef.current,
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);
  // Listen to the custom window event to toggle the timer card
  useEffect(() => {
    const handleToggle = () => {
      if (isOpen) {
        setIsOpen(false);
        broadcast(buildPayload('CLOSE'));
      } else {
        setIsOpen(true);
        broadcast(buildPayload('OPEN'));
      }
    };
    window.addEventListener('toggle-timer-card', handleToggle);
    return () => {
      window.removeEventListener('toggle-timer-card', handleToggle);
    };
  }, [isOpen, timerMode, initialLimit, time]);

  const startTsRef      = useRef<number | null>(null);
  const participantIds  = useRef<Set<string>>(new Set());

  // ── Send to every participant by their specific ID ─────────────────────────
  const broadcast = (payload: TimerPayload) => {
    const api = apiRef.current;
    if (!api) return;
    const strPayload = JSON.stringify(payload);
    const ids = [...participantIds.current].filter(Boolean);
    console.log('[Timer] Broadcasting via ChatMessage to', ids.length, 'participants:', ids, '| payload:', strPayload);

    ids.forEach((id) => {
      try {
        api.executeCommand('sendChatMessage', `__TIMER__:${strPayload}`, id);
        console.log('[Timer] Sent ChatMessage command to:', id);
      } catch (e) {
        console.warn('[Timer] sendChatMessage failed for', id, e);
      }
    });
  };

  const buildPayload = (action: TimerAction): TimerPayload => {
    const payload: TimerPayload = {
      type: 'TIMER_ACTION',
      action,
      timerMode,
      initialLimit
    };
    if (action === 'START') {
      const elapsedOrRemaining = time;
      let ts: number;
      if (timerMode === 'DOWN') {
        ts = Date.now() - (initialLimit - elapsedOrRemaining) * 1000;
      } else {
        ts = Date.now() - elapsedOrRemaining * 1000;
      }
      startTsRef.current = ts;
      payload.startTimestamp = ts;
      payload.elapsed = elapsedOrRemaining;
    } else if (action === 'PAUSE') {
      payload.elapsed = time;
    }
    return payload;
  };

  // ── Local tick interval ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      stopTickSound();
      return;
    }

    const id = setInterval(() => {
      let nextTime = 0;
      if (startTsRef.current !== null) {
        if (timerMode === 'DOWN') {
          const remaining = Math.max(0, initialLimit - Math.floor((Date.now() - startTsRef.current) / 1000));
          setTime(remaining);
          nextTime = remaining;
          if (remaining <= 0) {
            setIsActive(false);
            startTsRef.current = null;
          }
        } else {
          const elapsed = Math.max(0, Math.floor((Date.now() - startTsRef.current) / 1000));
          setTime(elapsed);
          nextTime = elapsed;
        }
      } else {
        if (timerMode === 'DOWN') {
          setTime((t) => {
            const next = Math.max(0, t - 1);
            nextTime = next;
            if (next <= 0) {
              setIsActive(false);
            }
            return next;
          });
        } else {
          setTime((t) => {
            const next = t + 1;
            nextTime = next;
            return next;
          });
        }
      }

      // Ticking sound player: silent when countdown > 10s; warning/alarm sound when countdown <= 10s; keep count up sound
      if (timerMode === 'DOWN') {
        if (nextTime <= 10 && nextTime > 0) {
          playTickSound(false, true);
        } else if (nextTime === 0) {
          playTickSound(true, false);
        } else {
          stopTickSound();
        }
      } else {
        playTickSound(false, false);
      }
    }, 1000);
    return () => {
      clearInterval(id);
      stopTickSound();
    };
  }, [isActive, timerMode, initialLimit]);

  // ── Final 10 seconds fast flashing toggler (JS-based to bypass CSS styling conflicts) ──
  useEffect(() => {
    const isFinalCountdown = isActive && timerMode === 'DOWN' && time <= 10 && time > 0;
    if (!isFinalCountdown) {
      setFlashToggle(true);
      return;
    }
    const flashId = setInterval(() => {
      setFlashToggle((prev) => !prev);
    }, 300);
    return () => clearInterval(flashId);
  }, [isActive, timerMode, time]);

  // ── Apply incoming timer action payload ────────────────────────────────────
  const applyTimerPayload = (payload: TimerPayload) => {
    if (!payload || payload.type !== 'TIMER_ACTION') return;
    console.log('[Timer] ✅ Received action:', payload.action, '| mode:', payload.timerMode);

    if (payload.timerMode) {
      setTimerMode(payload.timerMode);
    }
    if (payload.initialLimit !== undefined) {
      setInitialLimit(payload.initialLimit);
    }

    switch (payload.action) {
      case 'OPEN':
        setIsOpen(true);
        break;
      case 'START': {
        /*
        // Timestamp-based sync calculation (Commented out per user request):
        const ts = payload.startTimestamp!;
        const mode = payload.timerMode || 'UP';
        const limit = payload.initialLimit ?? 300;
        startTsRef.current = ts;
        if (mode === 'DOWN') {
          setTime(Math.max(0, limit - Math.floor((Date.now() - ts) / 1000)));
        } else {
          setTime(Math.max(0, Math.floor((Date.now() - ts) / 1000)));
        }
        */

        // Simple logic: Start local ticking directly upon receiving START message
        startTsRef.current = null;
        if (payload.elapsed !== undefined) {
          setTime(payload.elapsed);
        } else if (payload.timerMode === 'DOWN') {
          setTime(payload.initialLimit ?? 300);
        }
        setIsActive(true);
        setIsOpen(true);
        break;
      }
      case 'PAUSE':
        startTsRef.current = null;
        setIsActive(false);
        stopTickSound(true);
        setTime(payload.elapsed ?? 0);
        break;
      case 'RESET':
        startTsRef.current = null;
        setIsActive(false);
        stopTickSound(true);
        setTime(payload.timerMode === 'DOWN' ? (payload.initialLimit ?? 300) : 0);
        break;
      case 'CLOSE':
        startTsRef.current = null;
        setIsActive(false);
        stopTickSound(true);
        setIsOpen(false);
        setTime(payload.timerMode === 'DOWN' ? (payload.initialLimit ?? 300) : 0);
        break;
    }
  };

  // ── Set up Jitsi External API event listeners (teacher + student) ──────────
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !apiReady) return;

    // ── Seed participantIds with ALREADY-JOINED participants ───────────────
    try {
      const existing = api.getParticipantsInfo() as Array<{ participantId: string }>;
      existing.forEach((p) => {
        participantIds.current.add(p.participantId);
      });
      console.log('[Timer] Seeded participants:', [...participantIds.current]);
    } catch (e) {
      console.warn('[Timer] getParticipantsInfo failed:', e);
    }

    // ── Track participants joining / leaving ──────────────────────────────
    const onJoined = (event: any) => {
      participantIds.current.add(event.id);
      console.log('[Timer] participantJoined:', event.id, 'total:', participantIds.current.size);

      // Sync state to the new participant if timer is already running
      if (isHost && isOpen) {
        let ts: number;
        if (timerMode === 'DOWN') {
          ts = startTsRef.current ?? (Date.now() - (initialLimit - time) * 1000);
        } else {
          ts = startTsRef.current ?? (Date.now() - time * 1000);
        }
        const syncPayload: TimerPayload = {
          type: 'TIMER_ACTION',
          action: isActive ? 'START' : 'PAUSE',
          timerMode,
          initialLimit,
          startTimestamp: ts,
          elapsed: time,
        };
        try {
          const str = JSON.stringify(syncPayload);
          api.executeCommand('sendChatMessage', `__TIMER__:${str}`, event.id);
          console.log('[Timer] Synced state to late-joiner:', event.id);
        } catch (e) {}
      }
    };
    const onLeft = (event: any) => {
      participantIds.current.delete(event.id);
      console.log('[Timer] participantLeft:', event.id);
    };

    // ── Receive timer commands via XMPP ChatMessage (__TIMER__:) ────────
    const onIncomingChat = (event: any) => {
      console.log('📬 [Student Timer] Received incomingMessage event:', event);
      const msg = event?.message;
      if (typeof msg === 'string' && msg.startsWith('__TIMER__:')) {
        const jsonStr = msg.slice('__TIMER__:'.length);
        try {
          const decodedPayload = JSON.parse(jsonStr);
          applyTimerPayload(decodedPayload);
        } catch (e) {
          console.warn('[Timer] Failed to parse chat timer payload:', e);
        }

        // Tạm thời ẩn container thông báo pop-up khi nhận lệnh đồng hồ
        try {
          const iframe = api.getIFrame();
          if (iframe && iframe.contentWindow) {
            console.log('[Timer] Sending HIDE_TIMER_NOTIF postMessage to Jitsi iframe');
            iframe.contentWindow.postMessage({ type: 'HIDE_TIMER_NOTIF' }, '*');
            setTimeout(() => {
              console.log('[Timer] Sending SHOW_TIMER_NOTIF postMessage to Jitsi iframe');
              iframe.contentWindow.postMessage({ type: 'SHOW_TIMER_NOTIF' }, '*');
            }, 3500);
          }
        } catch (e) {
          console.warn('[Timer] postMessage failed:', e);
        }
      }
    };

    api.addEventListener('participantJoined', onJoined);
    api.addEventListener('participantLeft', onLeft);
    api.addEventListener('incomingMessage', onIncomingChat);

    return () => {
      api.removeEventListener('participantJoined', onJoined);
      api.removeEventListener('participantLeft', onLeft);
      api.removeEventListener('incomingMessage', onIncomingChat);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady]);

  // ── Teacher controls ───────────────────────────────────────────────────────
  const getCalculatedCountdownSeconds = (mStr: string, sStr: string) => {
    const m = parseInt(mStr, 10) || 0;
    const s = parseInt(sStr, 10) || 0;
    return m * 60 + s;
  };

  const onStartPause = () => {
    if (isActive) {
      setIsActive(false);
      broadcast(buildPayload('PAUSE'));
    } else {
      const totalSec = getCalculatedCountdownSeconds(inputMinutes, inputSeconds);
      const isStartDisabled = timerMode === 'DOWN' && totalSec <= 0;
      if (isStartDisabled) return;
      
      setIsActive(true);
      broadcast(buildPayload('START'));
    }
  };
  const onReset = () => {
    startTsRef.current = null;
    setIsActive(false);
    const resetTime = timerMode === 'DOWN' ? initialLimit : 0;
    setTime(resetTime);
    broadcast(buildPayload('RESET'));
  };
  const onOpen = () => {
    setIsOpen(true);
    if (isHost) broadcast(buildPayload('OPEN'));
  };
  const handleOpenClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onOpen();
  };
  const onClose = () => {
    startTsRef.current = null;
    setIsActive(false);
    setIsOpen(false);
    const resetTime = timerMode === 'DOWN' ? initialLimit : 0;
    setTime(resetTime);
    if (isHost) broadcast(buildPayload('CLOSE'));
  };

  const handleModeChange = (mode: TimerMode) => {
    if (isActive) return;
    setTimerMode(mode);
    if (mode === 'DOWN') {
      const seconds = getCalculatedCountdownSeconds(inputMinutes, inputSeconds) || 300;
      setInitialLimit(seconds);
      setTime(seconds);
    } else {
      setTime(0);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.startsWith('0') && val.length > 1) {
      val = val.replace(/^0+/, '0');
    }
    setInputMinutes(val);
    const seconds = getCalculatedCountdownSeconds(val, inputSeconds);
    if (seconds > 0) {
      setInitialLimit(seconds);
      if (!isActive) setTime(seconds);
    } else {
      if (!isActive) setTime(0);
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 60) {
      val = '59';
    } else if (val.startsWith('0') && val.length > 1) {
      val = val.replace(/^0+/, '0');
    }
    setInputSeconds(val);
    const seconds = getCalculatedCountdownSeconds(inputMinutes, val);
    if (seconds > 0) {
      setInitialLimit(seconds);
      if (!isActive) setTime(seconds);
    } else {
      if (!isActive) setTime(0);
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Shared timer card UI helper function ─────────────────────────────────────
  const renderTimerCard = (dropDown = false) => (
    <div className={`flex flex-col items-center bg-slate-900/95 text-white rounded-xl p-2.5 w-44 shadow-2xl border border-slate-700 backdrop-blur-md ${dropDown ? 'absolute right-0 top-full mt-2 z-[9999]' : ''}`}>
      <div className="flex w-full items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">⏱️ Đồng hồ</span>
        {isHost && (
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors" title="Đóng">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {isHost && !isActive && (
        <div className="flex gap-1.5 mb-1.5 w-full justify-center text-xs">
          <button 
            onClick={() => handleModeChange('UP')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${timerMode === 'UP' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Tăng dần
          </button>
          <button 
            onClick={() => handleModeChange('DOWN')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${timerMode === 'DOWN' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Đếm ngược
          </button>
        </div>
      )}

      {isHost && !isActive && timerMode === 'DOWN' && (
        <div className="flex items-center gap-1 mb-1.5 w-full justify-center text-[9px] text-slate-400">
          <input 
            type="text" 
            value={inputMinutes} 
            onChange={handleMinutesChange}
            placeholder="Phút"
            title="Số phút"
            className="w-7 bg-slate-800 border border-slate-700 text-center text-[10px] font-mono rounded py-0.5 text-white focus:outline-none focus:border-blue-500"
          />
          <span>p</span>
          <input 
            type="text" 
            value={inputSeconds} 
            onChange={handleSecondsChange}
            placeholder="Giây"
            title="Số giây"
            className="w-7 bg-slate-800 border border-slate-700 text-center text-[10px] font-mono rounded py-0.5 text-white focus:outline-none focus:border-blue-500"
          />
          <span>s</span>
        </div>
      )}

      <div 
        className={`text-2xl font-mono font-bold tracking-widest py-1.5 tabular-nums ${
          timerMode === 'DOWN' && isActive && time <= 10 && time > 0
            ? ''
            : timerMode === 'DOWN' && time === 0 
              ? 'text-red-500' 
              : isActive 
                ? 'text-green-400' 
                : 'text-amber-400'
        }`}
        style={
          timerMode === 'DOWN' && isActive && time <= 10 && time > 0
            ? { color: flashToggle ? '#ef4444' : '#22c55e' }
            : undefined
        }
      >
        {fmt(time)}
      </div>

      <div className="flex items-center gap-1 mb-2">
        <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}/>
        <span className="text-[9px] text-slate-400">{isActive ? 'Đang chạy' : 'Tạm dừng'}</span>
      </div>

      {isHost && (() => {
        const totalSec = getCalculatedCountdownSeconds(inputMinutes, inputSeconds);
        const isStartDisabled = timerMode === 'DOWN' && totalSec <= 0;
        return (
          <div className="flex items-center gap-2.5 w-full justify-center">
            <button 
              onClick={onStartPause}
              disabled={!isActive && isStartDisabled}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-md ${
                isActive 
                  ? 'bg-amber-500 hover:bg-amber-400' 
                  : isStartDisabled 
                    ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                    : 'bg-green-600 hover:bg-green-500'
              }`}
              title={isActive ? 'Tạm dừng' : isStartDisabled ? 'Vui lòng nhập thời gian hợp lệ' : 'Bắt đầu'}
            >
              {isActive
                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
              }
            </button>
            <button onClick={onReset}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Đặt lại">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18"/>
              </svg>
            </button>
          </div>
        );
      })()}
    </div>
  );

  // ════════ RENDER MODE A: Teacher — inline in top bar ════════════════════════
  if (inTopBar && isHost) {
    return (
      <div className="relative">
        <button onClick={() => isOpen ? onClose() : onOpen()} title="Đồng hồ bấm giờ"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${isOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span className={`font-mono text-xs tabular-nums ${timerMode === 'DOWN' && time === 0 ? 'text-red-500 animate-pulse' : isActive ? 'text-green-400' : ''}`}>
            {isActive ? fmt(time) : 'Timer'}
          </span>
        </button>
        {isOpen && renderTimerCard(true)}
      </div>
    );
  }

  // ════════ RENDER MODE B: Teacher — floating button over Jitsi ═══════════════
  if (!inTopBar && isHost) {
    return (
      <>
        {isDragging && <div className="fixed inset-0 z-[9998] cursor-move bg-transparent" />}
        <div 
          ref={widgetRef}
          style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
          className="absolute top-4 left-4 z-[9999] select-none cursor-move"
          onMouseDown={handleDragStart}
        >
          {!isOpen
            ? null
            : renderTimerCard()
          }
        </div>
      </>
    );
  }

  // ════════ RENDER MODE C: Student — overlay, shows only when teacher opens ══
  if (!isOpen) return null;
  return (
    <>
      {isDragging && <div className="fixed inset-0 z-[9998] cursor-move bg-transparent" />}
      <div 
        ref={widgetRef}
        style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
        className="absolute top-4 left-4 z-[9999] cursor-move select-none"
        onMouseDown={handleDragStart}
      >
        {renderTimerCard()}
      </div>
    </>
  );
}
