'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useUserLoginStore from '@/state-manager/user-login-store';

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
  const bgImageRef = useRef<string | null>(null);

  // Keep bgImageRef synced with bgImage state to prevent stale closures in Jitsi events
  useEffect(() => {
    bgImageRef.current = bgImage;
  }, [bgImage]);

  // Client-side mount check to prevent hydration mismatch and race conditions
  useEffect(() => {
    setIsMounted(true);
    const storeState = useUserLoginStore.getState();
    setClientUser(storeState.user);
  }, []);

  const isHost = !!clientUser;

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

    const displayName = isHost ? (clientUser?.fullName || clientUser?.username || 'Giáo viên') : 'Học viên';
    const email = isHost ? (clientUser?.email || '') : '';

    // Generate JWT Token using Web Crypto API (Only for Hosts/Teachers)
    const generateJitsiJWT = async () => {
      const header = { alg: "HS256", typ: "JWT" };
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        context: {
          user: { name: displayName, email: email },
          features: { 
            recording: isHost, 
            livestreaming: isHost 
          }
        },
        aud: "vietsure_app",
        iss: "vietsure_app",
        sub: "meet.jitsi",
        room: roomName,
        iat: now,
        nbf: now - 60, // allow 1 min clock skew
        exp: now + 86400 // 24 hours valid
      };
      
      const base64UrlEncode = (obj: any) => {
        const str = JSON.stringify(obj);
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
    const token = isHost ? await generateJitsiJWT() : undefined;

    apiRef.current = new window.JitsiMeetExternalAPI(JITSI_SERVER, {
      roomName,
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
        whiteboard: {
          enabled: true,
        },
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop',
          'fullscreen', 'fodeviceselection', 'hangup', 'chat',
          'settings', 'raisehand', 'videoquality', 'filmstrip',
          'tileview', 'download', 'help', 'whiteboard',
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1d285c',
      },
    });

    apiRef.current.addEventListener('videoConferenceJoined', () => {
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

  // Set the single static course image URL as background
  useEffect(() => {
    if (!isMounted) return;
    setBgImage("http://127.0.0.1:1337/uploads/course1_cecede884c.webp");
  }, [isMounted]);

  return (
    <div className="fixed inset-0 bg-[#1d285c] flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1d285c] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10l5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" />
            </svg>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wide">VIETSURE ENGLISH</p>
            <p className="text-white/60 text-xs">Phòng: {roomName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Thoát lớp
          </button>
        </div>
      </div>

      {/* Jitsi container */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
