'use client';

import { useEffect, useRef, useState } from 'react';
import useJitsiStore from '@/state-manager/jitsi-store';
import useUserLoginStore from '@/state-manager/user-login-store';

const JITSI_SERVER = process.env.NEXT_PUBLIC_JITSI_SERVER;

export default function FloatingJitsiWidget() {
  const { roomName, isOpen, isMinimized, closeMeeting, setMinimized } = useJitsiStore();
  const { user } = useUserLoginStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Custom resizing state (NW-resize dragging from top-left) - Landscape default (width > height)
  const [size, setSize] = useState({ width: 650, height: 450 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialWidth = window.innerWidth < 768 ? Math.floor(window.innerWidth * 0.9) : 650;
      const initialHeight = window.innerHeight < 768 ? Math.floor(window.innerHeight * 0.6) : 450;
      setSize({ width: initialWidth, height: initialHeight });
    }
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  const handleTouchResizeStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const touch = e.touches[0];
    resizeStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      width: size.width,
      height: size.height,
    };
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const deltaX = resizeStartRef.current.mouseX - e.clientX;
    const deltaY = resizeStartRef.current.mouseY - e.clientY;
    
    // Limits: min size 320x400, max size cannot overflow the screen viewport boundaries
    const newWidth = Math.max(320, Math.min(window.innerWidth - 48, resizeStartRef.current.width + deltaX));
    const newHeight = Math.max(400, Math.min(window.innerHeight - 48, resizeStartRef.current.height + deltaY));
    
    setSize({ width: newWidth, height: newHeight });
  };

  const handleTouchResizeMove = (e: TouchEvent) => {
    if (!isResizing) return;
    const touch = e.touches[0];
    const deltaX = resizeStartRef.current.mouseX - touch.clientX;
    const deltaY = resizeStartRef.current.mouseY - touch.clientY;
    
    const newWidth = Math.max(320, Math.min(window.innerWidth - 48, resizeStartRef.current.width + deltaX));
    const newHeight = Math.max(400, Math.min(window.innerHeight - 48, resizeStartRef.current.height + deltaY));
    
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeUp);
      window.addEventListener('touchmove', handleTouchResizeMove, { passive: false });
      window.addEventListener('touchend', handleResizeUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeUp);
      window.removeEventListener('touchmove', handleTouchResizeMove);
      window.removeEventListener('touchend', handleResizeUp);
    };
  }, [isResizing]);

  // Use refs to store callback/user data to prevent changing dependency array size and layout effects
  const userRef = useRef(user);
  const closeMeetingRef = useRef(closeMeeting);

  useEffect(() => {
    userRef.current = user;
    closeMeetingRef.current = closeMeeting;
  }, [user, closeMeeting]);

  const [bgImage, setBgImage] = useState<string | null>(null);
  const participantsRef = useRef<string[]>([]);

  // Jitsi meeting should be initialized exactly ONCE when the meeting starts
  // and disposed exactly ONCE when closed. We do NOT recreate Jitsi when minimized/maximized.
  useEffect(() => {
    if (!isOpen || !roomName) {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      return;
    }

    const initJitsi = async () => {
      // Find the container element. If currently minimized, we might need a tick or Jitsi might mount later,
      // but to prevent losing the session, we keep the container in DOM hidden rather than unmounting it.
      if (!containerRef.current || !roomName) return;

      if (apiRef.current) {
        apiRef.current.dispose();
      }

      const displayName = userRef.current?.fullName || userRef.current?.username || 'Giáo viên';
      const email = userRef.current?.email || '';

      const sanitizedRoom = decodeURIComponent(roomName)
        .replace(/[^a-zA-Z0-9À-ỹ\-_]/g, '-')
        .replace(/-+/g, '-');

      // Generate JWT Token using Web Crypto API
      const generateJitsiJWT = async () => {
        const header = { alg: "HS256", typ: "JWT" };
        const now = Math.floor(Date.now() / 1000);
        const payload = {
          context: {
            user: { name: displayName, email: email },
            features: { recording: true, livestreaming: true }
          },
          aud: "vietsure_app",
          iss: "vietsure_app",
          sub: "meet.jitsi",
          room: sanitizedRoom,
          iat: now,
          nbf: now - 60, // allow 1 min clock skew
          exp: now + 86400 // 24 hours valid
        };
        
        const base64UrlEncode = (obj: any) => {
          const str = JSON.stringify(obj);
          // Encode UTF-8 characters safely for btoa
          const encoded = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
            (match, p1) => String.fromCharCode(parseInt(p1, 16))
          );
          return btoa(encoded).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        };
        const encodedHeader = base64UrlEncode(header);
        const encodedPayload = base64UrlEncode(payload);
        
        const secret = "vietsure_secret_key_2026";
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        
        const signature = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(`${encodedHeader}.${encodedPayload}`)
        );
        
        const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          
        return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
      };

      const token = await generateJitsiJWT();

      apiRef.current = new (window as any).JitsiMeetExternalAPI(JITSI_SERVER, {
        roomName: sanitizedRoom,
        jwt: token,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName,
          email,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          disablePolls: false,
          whiteboard: { enabled: true },
          localRecording: { enabled: true },
          toolbarButtons: [
            'camera', 'chat', 'closedcaptions', 'desktop', 'download',
            'etherpad', 'feedback', 'filmstrip', 'fullscreen', 'hangup',
            'help', 'highlight', 'invite', 'livestreaming', 'microphone',
            'mute-everyone', 'mute-video-everyone', 'participants-pane',
            'profile', 'raisehand', 'recording', 'select-background',
            'settings', 'shareaudio', 'sharedvideo', 'stats', 'tileview',
            'toggle-camera', 'videoquality', 'whiteboard', 'polls'
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#1d285c',
        },
      });

      // Sync background to newly joined participants
      apiRef.current.addEventListener('participantJoined', (event: any) => {
        if (!participantsRef.current.includes(event.id)) {
          participantsRef.current.push(event.id);
        }
        if (!!userRef.current && bgImageRef.current) {
          // Delay sending by 2 seconds to ensure the Jitsi WebRTC Bridge Channel is fully open
          setTimeout(() => {
            if (apiRef.current && bgImageRef.current) {
              console.log("📤 Delay-sending current whiteboard background to participant:", event.id);
              apiRef.current.executeCommand('sendEndpointTextMessage', event.id, JSON.stringify({
                type: 'SET_WHITEBOARD_BACKGROUND',
                imageUrl: bgImageRef.current
              }));
            }
          }, 2000);
        }
      });

      apiRef.current.addEventListener('participantLeft', (event: any) => {
        participantsRef.current = participantsRef.current.filter(id => id !== event.id);
      });

      // Listen for background image sync from teacher
      apiRef.current.addEventListener('endpointTextMessageReceived', (event: any) => {
        try {
          const text = event.eventData?.text || event.text || event.data?.text;
          const payload = JSON.parse(text);
          if (payload.type === 'SET_WHITEBOARD_BACKGROUND') {
            setBgImage(payload.imageUrl);
          }
        } catch (err) {}
      });

      // Push background image state to Jitsi iframe when conference joins
      apiRef.current.addEventListener('videoConferenceJoined', () => {
        if (bgImage && apiRef.current) {
          const iframe = containerRef.current?.querySelector('iframe');
          if (iframe) {
            iframe.contentWindow?.postMessage({
              type: 'SET_WHITEBOARD_BACKGROUND',
              imageUrl: bgImage
            }, '*');
          }
        }
      });

      apiRef.current.addEventListener('readyToClose', () => {
        closeMeetingRef.current();
      });
    };

    // Load Jitsi API script if not loaded
    if (!window.hasOwnProperty('JitsiMeetExternalAPI')) {
      const script = document.createElement('script');
      script.src = `https://${JITSI_SERVER}/external_api.js`;
      script.async = true;
      script.onload = () => { initJitsi(); };
      script.onerror = () => console.error('Failed to load Jitsi API');
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      initJitsi();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [isOpen, roomName]);

  const bgImageRef = useRef<string | null>(null);
  useEffect(() => {
    bgImageRef.current = bgImage;
  }, [bgImage]);

  // Push background image state to Jitsi iframe whenever it changes
  useEffect(() => {
    if (apiRef.current) {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow?.postMessage({
          type: 'SET_WHITEBOARD_BACKGROUND',
          imageUrl: bgImage
        }, '*');
      }
    }
  }, [bgImage]);

  // Set the transparent PNG Base64 placeholder as background to keep it blank by default
  useEffect(() => {
    if (!isOpen) return;
    setBgImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
  }, [isOpen]);

  // Handle Dragging (Restored)
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 100, nextX)),
      y: Math.max(10, Math.min(window.innerHeight - 100, nextY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // ── Document Picture-in-Picture ──────────────────────────────────────────
  const [isPipActive, setIsPipActive] = useState(false);
  const pipWindowRef = useRef<any>(null);
  const widgetInnerRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const handlePiP = async () => {
    if (!(window as any).documentPictureInPicture) {
      alert('Trình duyệt chưa hỗ trợ Document PiP. Vui lòng dùng Chrome 116+.');
      return;
    }
    if (isPipActive) {
      pipWindowRef.current?.close();
      return;
    }

    const inner = widgetInnerRef.current;
    if (!inner) return;

    try {
      const pipWin = await (window as any).documentPictureInPicture.requestWindow({
        width: size.width,
        height: size.height,
      });
      pipWindowRef.current = pipWin;

      // Copy styles so Tailwind works inside PiP window
      [...document.styleSheets].forEach((sheet) => {
        try {
          const css = [...(sheet as CSSStyleSheet).cssRules].map(r => r.cssText).join('');
          const s = pipWin.document.createElement('style');
          s.textContent = css;
          pipWin.document.head.appendChild(s);
        } catch (_) {
          if ((sheet as CSSStyleSheet).href) {
            const l = pipWin.document.createElement('link');
            l.rel = 'stylesheet';
            l.href = (sheet as CSSStyleSheet).href!;
            pipWin.document.head.appendChild(l);
          }
        }
      });

      // Centre content inside PiP window
      pipWin.document.body.style.cssText =
        'margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1d285c;';

      inner.style.width = '100%';
      inner.style.height = '100%';

      setIsPipActive(true);
      setMinimized(true);

      // Move DOM to PiP window. Chrome handles adoptNode implicitly.
      pipWin.document.body.appendChild(inner);

      pipWin.addEventListener('pagehide', () => {
        setIsPipActive(false);
        setMinimized(false);
        // Move back to original slot
        if (slotRef.current) {
          slotRef.current.appendChild(inner);
        }
        pipWindowRef.current = null;
      });
    } catch (err: any) {
      console.error('[DocumentPiP]', err);
      alert('Không thể mở PiP: ' + err.message);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  if (!isOpen || !roomName) return null;

  return (
    <>
      {/* Main page widget */}
      <div
        style={{
          position: 'fixed',
          bottom: isMinimized ? `${position.y}px` : 24,
          right: isMinimized ? `${position.x}px` : 24,
          top: isMinimized ? undefined : 'unset',
          left: isMinimized ? undefined : 'unset',
          width: isMinimized ? undefined : `${size.width}px`,
          height: isMinimized ? undefined : `${size.height}px`,
          zIndex: 9999,
        }}
        className={`${
          isMinimized
            ? 'transition-all duration-300 w-16 h-16 rounded-full bg-[#FF6B00] shadow-2xl hover:scale-105 cursor-move flex items-center justify-center border-2 border-white'
            : 'bg-[#1d285c] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col'
        }`}
        onMouseDown={isMinimized ? handleMouseDown : undefined}
      >
        {/* Top-Left Resize Handle */}
        {!isMinimized && !isPipActive && (
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleTouchResizeStart}
            className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-[10000] flex items-center justify-center text-white/30 hover:text-white transition-colors"
            title="Kéo để thay đổi kích thước"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
              <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="5" y1="1" x2="9" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="1" y1="5" x2="5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Minimized button */}
        <button
          onClick={() => {
            if (isPipActive) {
              pipWindowRef.current?.close();
            } else {
              setMinimized(false);
            }
          }}
          className={`no-drag w-full h-full flex flex-col items-center justify-center text-white relative ${
            !isMinimized ? 'hidden' : 'flex'
          }`}
          title={isPipActive ? 'Đóng PiP và mở rộng' : 'Mở rộng lớp học'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isPipActive ? (
              // PiP return icon
              <>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <rect x="12" y="10" width="9" height="6" rx="1" fill="currentColor" stroke="none" />
              </>
            ) : (
              // Expand icon
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            )}
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
        </button>

        {/* Slot for widgetInnerRef. React will never try to insert siblings next to widgetInnerRef inside this div. */}
        <div ref={slotRef} className="flex-1 w-full flex" style={{ display: isMinimized ? 'none' : 'flex' }}>
          {/* Maximized Meeting Window Structure */}
          <div
            ref={widgetInnerRef}
            className="flex-col bg-[#1d285c] flex-1 w-full flex"
          >
            {/* Header Bar */}
            <div className={`items-center justify-between px-4 py-2.5 bg-[#1d285c] border-b border-white/10 select-none cursor-default ${isPipActive ? 'hidden' : 'flex'}`}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs leading-none">VIETSURE ENGLISH</p>
                  <p className="text-white/60 text-[10px]">Phòng: {roomName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* PiP button */}
                <button
                  onClick={handlePiP}
                  className="p-1.5 rounded-lg text-blue-300 hover:text-blue-100 hover:bg-blue-500/20 transition-colors"
                  title={isPipActive ? 'Đóng PiP' : 'Mở Picture-in-Picture'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <rect x="12" y="10" width="9" height="6" rx="1" fill="currentColor" stroke="none" />
                  </svg>
                </button>
                {/* Minimize button */}
                {!isPipActive && (
                  <button
                    onClick={() => setMinimized(true)}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Thu nhỏ cửa sổ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                )}
                {/* Close meeting */}
                <button
                  onClick={() => {
                    if (apiRef.current) {
                      const participants = apiRef.current.getParticipantsInfo();
                      participants.forEach((p: any) => {
                        apiRef.current.executeCommand('sendEndpointTextMessage', p.participantId, JSON.stringify({ action: 'END_MEETING' }));
                      });
                    }
                    closeMeeting();
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Thoát lớp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Jitsi Call Frame (Always remains mounted to prevent connection teardown) */}
            <div ref={containerRef} className="flex-1 w-full bg-[#151b3d]" />
          </div>
        </div>
      </div>
    </>
  );
}
