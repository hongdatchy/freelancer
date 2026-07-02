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

  if (!isOpen || !roomName) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMinimized ? `${position.y}px` : 24,
        right: isMinimized ? `${position.x}px` : 24,
        top: isMinimized ? undefined : 'unset',
        left: isMinimized ? undefined : 'unset',
      }}
      className={`z-[9999] transition-all duration-300 ${
        isMinimized
          ? 'w-16 h-16 rounded-full bg-[#FF6B00] shadow-2xl hover:scale-105 cursor-move flex items-center justify-center border-2 border-white'
          : 'w-[30vw] h-[65vh] bg-[#1d285c] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col'
      }`}
      onMouseDown={isMinimized ? handleMouseDown : undefined}
    >
      {/* Minimized Trigger Circle (shows when minimized) */}
      <button
        onClick={() => setMinimized(false)}
        className={`no-drag w-full h-full flex flex-col items-center justify-center text-white relative ${
          !isMinimized ? 'hidden' : 'flex'
        }`}
        title="Mở rộng lớp học"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
      </button>

      {/* Maximized Meeting Window Structure (always rendered so iframe isn't destroyed, but hidden using class when minimized) */}
      <div 
        className="flex-col bg-[#1d285c]"
        style={{
          display: isMinimized ? 'block' : 'flex',
          position: isMinimized ? 'absolute' : 'relative',
          width: isMinimized ? '1px' : '100%',
          height: isMinimized ? '1px' : '100%',
          opacity: isMinimized ? 0 : 1,
          pointerEvents: isMinimized ? 'none' : 'auto',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 bg-[#1d285c] border-b border-white/10 select-none cursor-default"
        >
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
            {/* Minimize button */}
            <button
              onClick={() => setMinimized(true)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Thu nhỏ cửa sổ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
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
  );
}
