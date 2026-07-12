'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useUserLoginStore from '@/state-manager/user-login-store';
import TimerWidget from '@/components/custom/common/timer-widget';
import { getData } from '@/service/api';

const JITSI_SERVER = process.env.NEXT_PUBLIC_JITSI_SERVER;

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const participantsRef = useRef<string[]>([]);
  
  const [isMounted, setIsMounted] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const bgImageRef = useRef<string | null>(null);
  const isHost = !!clientUser;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement as any;
    const doc = document as any;

    const isFull = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      isFullscreen
    );

    if (!isFull) {
      setIsFullscreen(true);
      const req =
        element.requestFullscreen ||
        element.webkitRequestFullscreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullscreen;
      if (req) {
        try {
          req.call(element).catch(() => {});
        } catch {}
      }
    } else {
      setIsFullscreen(false);
      const exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;
      if (exit) {
        try {
          exit.call(doc).catch(() => {});
        } catch {}
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const nativeFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      if (nativeFull) {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Client-side mount check to prevent hydration mismatch and race conditions
  useEffect(() => {
    setIsMounted(true);
    const storeState = useUserLoginStore.getState();
    setClientUser(storeState.user);
  }, []);

  const roomName = decodeURIComponent(params.roomName as string)
    // Sanitize: remove special chars to keep Jitsi happy
    .replace(/[^a-zA-Z0-9À-ỹ\-_]/g, '-')
    .replace(/-+/g, '-');

  useEffect(() => {
    if (!isMounted) return;

    // Load Jitsi External API script dynamically
    const script = document.createElement('script');
    script.src = `https://${JITSI_SERVER}/external_api.js`;
    script.async = true;
    script.onload = () => initJitsi();
    script.onerror = () => console.error('Failed to load Jitsi External API');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [isMounted]);

  // Push background image state to Jitsi iframe whenever it changes
  useEffect(() => {
    if (apiRef.current && apiRef.current.getIFrame()) {
      apiRef.current.getIFrame().contentWindow.postMessage({
        type: 'SET_WHITEBOARD_BACKGROUND',
        imageUrl: bgImage
      }, '*');
    }
  }, [bgImage]);

  const initJitsi = async () => {
    if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

    // Get fresh user state directly from store to avoid React stale closures/race conditions
    const storeState = useUserLoginStore.getState();
    const currentUser = storeState.user;
    const isHostUser = !!currentUser;

    let teacherId = '0';
    try {
      const res = await getData(`api/teacher-schedules?filters[class_code][$eq]=${roomName}&populate=*`);
      if (res.data?.[0]) {
        teacherId = String(res.data[0].users_permissions_user?.id || '0');
      }
    } catch (err) {
      console.error("Fetch teacher id error:", err);
    }

    if (teacherId === '0' && isHostUser) {
      teacherId = String(currentUser?.id || '0');
    }

    const jitsiRoomJID = `${roomName}_GV_${teacherId}`;
    const displayName = isHostUser ? (currentUser?.fullName || currentUser?.username || 'Giáo viên') : 'Học viên';
    const email = isHostUser ? (currentUser?.email || '') : '';

    // Generate JWT Token using Web Crypto API (Only for Hosts/Teachers)
    const generateJitsiJWT = async () => {
      const header = { alg: "HS256", typ: "JWT" };
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        context: {
          user: { name: displayName, email: email },
          features: { 
            recording: isHostUser, 
            livestreaming: isHostUser 
          }
        },
        aud: "vietsure_app",
        iss: "vietsure_app",
        sub: "meet.jitsi",
        room: jitsiRoomJID,
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

    // Only generate Jitsi JWT for host (teacher). Students join as standard guest without JWT.
    const token = isHostUser ? await generateJitsiJWT() : undefined;

    apiRef.current = new window.JitsiMeetExternalAPI(JITSI_SERVER, {
      roomName: jitsiRoomJID,
      ...(token ? { jwt: token } : {}),
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
        defaultLanguage: 'vi',
        settingsSections: ['devices', 'moderator', 'profile', 'calendar', 'sounds'],
        disableSelfViewSettings: true,
        isStudent: !isHostUser,
        subject: roomName, // Hide technical room name inside Jitsi
        whiteboard: {
          enabled: true,
        },
        localRecording: {
          enabled: true,
          disableSelfRecording: false,
        },
        recordingService: {
          enabled: false,
        },
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions',
          'fodeviceselection', 'chat',
          'settings', 'raisehand', 'videoquality', 'filmstrip',
          'download', 'help', 'whiteboard', 'hangup',
          ...(isHostUser ? ['tileview', 'desktop'] : [])
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#F0F7FF',
        SETTINGS_SECTIONS: ['devices', 'moderator', 'profile', 'calendar', 'sounds'],
      },
    });

    apiRef.current.addEventListener('videoConferenceJoined', () => {
      setApiReady(true);

      if (isHostUser) {
        setTimeout(() => {
          if (apiRef.current) {
            apiRef.current.executeCommand('startRecording', {
              mode: 'file'
            });
          }
        }, 1000);
      }

      if (bgImageRef.current && apiRef.current && apiRef.current.getIFrame()) {
        apiRef.current.getIFrame().contentWindow.postMessage({
          type: 'SET_WHITEBOARD_BACKGROUND',
          imageUrl: bgImageRef.current
        }, '*');
      }
    });

    // Listen for hangup
    apiRef.current.addEventListener('readyToClose', () => {
      router.back();
    });

  };

  // Set the transparent PNG Base64 placeholder as background to keep it blank by default
  useEffect(() => {
    if (!isMounted) return;
    setBgImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
  }, [isMounted]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Top bar (Hidden when in Fullscreen Mode so video fills 100% mobile screen) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d285c] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            {isHost && (
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 10l5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-2">
              <img
                src="/images/Vietsure English_Logo-15.png"
                alt="VietSure English"
                className="h-7 w-auto object-contain"
              />
              <p className="text-white/60 text-xs">| Phòng: {roomName}</p>
            </div>
          </div>

          {/* Central banner text */}
          <p className="hidden md:block text-white/95 text-xs font-black tracking-wider uppercase text-center flex-1 mx-6 truncate">
            HỆ THỐNG GIÁO DỤC ONLINE CHẤT LƯỢNG CAO CHO TRẺ EM TRONG VÀ NGOÀI NƯỚC
          </p>

          <div className="flex items-center gap-3 shrink-0">
            {isHost && (
              <TimerWidget apiRef={apiRef} isHost={isHost} apiReady={apiReady} inTopBar />
            )}

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Toàn màn hình"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>

            {isHost && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                Thoát lớp
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Exit Fullscreen button when in Fullscreen Mode */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-3 right-3 z-[100] bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all"
          title="Thoát toàn màn hình"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
          </svg>
        </button>
      )}

      {/* Jitsi container + student timer overlay */}
      <div className="flex-1 w-full relative">
        <div ref={containerRef} className="w-full h-full" />
        {!isHost && <TimerWidget apiRef={apiRef} isHost={false} apiReady={apiReady} />}
      </div>
    </div>
  );
}
