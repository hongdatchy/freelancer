'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useUserLoginStore from '@/state-manager/user-login-store';

const JITSI_SERVER = '27.71.24.102:8443';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserLoginStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const roomName = decodeURIComponent(params.roomName as string)
    // Sanitize: remove special chars to keep Jitsi happy
    .replace(/[^a-zA-Z0-9À-ỹ\-_]/g, '-')
    .replace(/-+/g, '-');

  useEffect(() => {
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
  }, []);

  const initJitsi = () => {
    if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

    const displayName = user?.fullName || user?.username || 'Giáo viên';
    const email = user?.email || '';

    apiRef.current = new window.JitsiMeetExternalAPI(JITSI_SERVER, {
      roomName,
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
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop',
          'fullscreen', 'fodeviceselection', 'hangup', 'chat',
          'settings', 'raisehand', 'videoquality', 'filmstrip',
          'tileview', 'download', 'help',
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1d285c',
      },
    });

    // Listen for hangup
    apiRef.current.addEventListener('readyToClose', () => {
      router.back();
    });
  };

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

      {/* Jitsi container */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
