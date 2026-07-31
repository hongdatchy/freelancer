'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useUserLoginStore from '@/state-manager/user-login-store';
import TimerWidget from '@/components/custom/common/timer-widget';
import WheelWidget from '@/components/custom/common/wheel-widget';
import DiceWidget from '@/components/custom/common/dice-widget';
import PraiseWidget from '@/components/custom/common/praise-widget';
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
  
  const [isCheckingHost, setIsCheckingHost] = useState(true);
  const [teacherId, setTeacherId] = useState('0');
  const [studentInputName, setStudentInputName] = useState('');
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const isHost = false;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isInBreakoutRoom, setIsInBreakoutRoom] = useState(false);
  const [currentSubRoomName, setCurrentSubRoomName] = useState<string | null>(null);
  const lastPraiseTimeRef = useRef<number>(0);
  const breakoutRoomsDataRef = useRef<any>(null);
  const currentSubRoomJidRef = useRef<string>('');
  const shouldEndConferenceOnMainJoinRef = useRef<boolean>(false);
  const isTileViewEnabledRef = useRef<boolean>(false);
  const exitPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showExitConfirm) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (exitPopoverRef.current && !exitPopoverRef.current.contains(e.target as Node)) {
        const btn = (e.target as HTMLElement).closest('button');
        if (!btn || (!btn.getAttribute('title')?.includes('Thoát') && !btn.closest('[title*="Thoát"]'))) {
          setShowExitConfirm(false);
        }
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [showExitConfirm]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

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

  const roomName = decodeURIComponent((params?.roomName as string) || '')
    // Sanitize: remove special chars to keep Jitsi happy
    .replace(/[^a-zA-Z0-9À-ỹ\-_]/g, '-')
    .replace(/-+/g, '-');

  // Client-side mount check to prevent hydration mismatch and race conditions
  useEffect(() => {
    setIsMounted(true);
    const storeState = useUserLoginStore.getState();
    setClientUser(storeState.user);
  }, []);

  // Listen for TileView sync message from Teacher & toggle Grid View
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'TEACHER_TOGGLED_TILE_VIEW') {
        const enabled = !!e.data.enabled;
        if (apiRef.current) {
          try {
            apiRef.current.executeCommand('setTileView', enabled);
          } catch (err) {}
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [roomName]);

  useEffect(() => {
    if (!isMounted) return;

    const checkHost = async () => {
      const storeState = useUserLoginStore.getState();
      const currentUser = storeState.user;
      let tId = '0';
      try {
        const res = await getData(`api/teacher-schedules?filters[class_code][$eq]=${roomName}&populate=*`);
        if (res.data?.[0]) {
          tId = String(res.data[0].users_permissions_user?.id || '0');
        }
      } catch (err) {
        console.error("Fetch teacher id error:", err);
      }

      let finalTeacherId = tId;
      if (tId === '0' && currentUser) {
        finalTeacherId = String(currentUser?.id || '0');
      }

      setTeacherId(finalTeacherId);
      setIsCheckingHost(false);
    };

    checkHost();
  }, [isMounted, roomName]);

  const shouldLoadJitsi = !isCheckingHost && hasEnteredName;

  useEffect(() => {
    if (!isMounted || !shouldLoadJitsi) return;

    // Load Jitsi External API script dynamically
    const script = document.createElement('script');
    script.src = `https://${JITSI_SERVER}/external_api.js`;
    script.async = true;
    script.onload = () => initJitsi();
    script.onerror = () => console.error('Failed to load Jitsi External API');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [isMounted, shouldLoadJitsi]);

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

    const jitsiRoomJID = `${roomName}_GV_${teacherId}`;
    const displayName = studentInputName.trim() || 'Học viên';

    // Students join as standard guest without JWT token
    apiRef.current = new window.JitsiMeetExternalAPI(JITSI_SERVER, {
      roomName: jitsiRoomJID,
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      userInfo: {
        displayName,
        email: '',
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        startTileView: true,
        defaultLanguage: 'vi',
        settingsSections: ['devices', 'moderator', 'profile', 'calendar', 'sounds'],
        disableSelfViewSettings: true,
        disabledSounds: ['INCOMING_MSG_SOUND_ID', 'OUTGOING_MSG_SOUND_ID'],
        isStudent: true,
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions',
          'fodeviceselection', 'chat',
          'settings', 'raisehand', 'filmstrip',
          'download', 'help', 'desktop'
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

      // Set the default filmstrip width to 360px on join if screen width > 1100px
      if (window.innerWidth > 1100) {
        setTimeout(() => {
          if (apiRef.current) {
            apiRef.current.executeCommand('resizeFilmStrip', { width: 260 });
          }
        }, 1000);
      }



      // Ensure Grid View is enabled on join / rejoin
      setTimeout(() => {
        if (apiRef.current && !isTileViewEnabledRef.current) {
          apiRef.current.executeCommand('setTileView', true);
        }
      }, 1000);

      if (bgImageRef.current && apiRef.current && apiRef.current.getIFrame()) {
        apiRef.current.getIFrame().contentWindow.postMessage({
          type: 'SET_WHITEBOARD_BACKGROUND',
          imageUrl: bgImageRef.current
        }, '*');
      }
    });

    // Track tile view state for student
    apiRef.current.addEventListener('tileViewChanged', (event: any) => {
      isTileViewEnabledRef.current = !!event.enabled;
    });



    // Helper to resolve human-readable sub-room name from rooms data
    const resolveSubRoomName = (cleanCurrent: string, rawCurrentName: string, roomsData: any) => {
      const roomList = Array.isArray(roomsData) ? roomsData : (roomsData ? Object.values(roomsData) : []);
      const matched = roomList.find((r: any) => {
        if (!r || r.isMainRoom) return false;
        const rId = String(r.id || '').toLowerCase().trim();
        const rJid = String(r.jid || '').toLowerCase().trim();
        return (rId && cleanCurrent.includes(rId)) || (rJid && cleanCurrent.includes(rJid));
      });

      if (matched && matched.name) {
        return matched.name;
      }
      
      let subName = rawCurrentName;
      const cleanMain = decodeURIComponent(String(roomName || '')).toLowerCase().trim();
      if (subName.toLowerCase().startsWith(cleanMain)) {
        subName = subName.substring(cleanMain.length).replace(/^[-_]+/, '').trim();
      }
      const isUuid = /^[0-9a-fA-F-]{20,}$/.test(subName) || subName.length > 20;
      return !isUuid && subName ? subName : 'Phòng nhỏ';
    };

    // Track breakout room status for participant
    apiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
      console.log('[Room] videoConferenceJoined:', event);
      const rawCurrentName = decodeURIComponent(String(event.roomName || event.id || '')).trim();
      const cleanCurrent = rawCurrentName.toLowerCase().replace(/_[gG][vV]_\d+$/i, '');
      const cleanMain = decodeURIComponent(String(roomName || '')).toLowerCase().trim();
      
      if (cleanCurrent && cleanMain && cleanCurrent !== cleanMain) {
        setIsInBreakoutRoom(true);
        currentSubRoomJidRef.current = cleanCurrent;
        const resolvedName = resolveSubRoomName(cleanCurrent, rawCurrentName, breakoutRoomsDataRef.current);
        setCurrentSubRoomName(resolvedName);
      } else {
        setIsInBreakoutRoom(false);
        currentSubRoomJidRef.current = '';
        setCurrentSubRoomName(null);

        if (shouldEndConferenceOnMainJoinRef.current) {
          shouldEndConferenceOnMainJoinRef.current = false;
          try {
            apiRef.current?.executeCommand('endConference');
          } catch (e) {}
        }
      }
    });

    apiRef.current.addEventListener('breakoutRoomsUpdated', (event: any) => {
      console.log('[Room] breakoutRoomsUpdated:', event);
      if (event && event.rooms) {
        breakoutRoomsDataRef.current = event.rooms;
        const currentJid = currentSubRoomJidRef.current;
        if (currentJid) {
          const resolvedName = resolveSubRoomName(currentJid, currentJid, event.rooms);
          if (resolvedName) {
            setCurrentSubRoomName(resolvedName);
          }
        }
      }
    });

    // Intercept student hangup clicks and show the custom React popover menu
    apiRef.current.addEventListener('toolbarButtonClicked', (event: any) => {
      if (event.key === 'hangup') {
        setShowExitConfirm(prev => !prev);
      }
    });

    // Listen directly for Teacher control messages (__TILE_VIEW__, __TEACHER_PIN__, __TOGGLE_STUDENT_SCREENSHARE__)
    apiRef.current.addEventListener('incomingMessage', (event: any) => {
      const msg = event?.message;
      if (typeof msg !== 'string') return;

      if (msg.startsWith('__TILE_VIEW__:')) {
        const enabled = msg.includes(':true');
        console.log('📌 [HỌC VIÊN] ĐỒNG BỘ GRID VIEW:', enabled);
        try {
          apiRef.current?.executeCommand('setTileView', enabled);
        } catch (err) {}
      } else if (msg.startsWith('__TEACHER_PIN__:')) {
        const targetId = msg.slice('__TEACHER_PIN__:'.length);
        const pinId = (targetId === 'null' || !targetId) ? null : targetId;
        console.log('📌 [HỌC VIÊN] ĐỒNG BỘ GHIM TỪ GIÁO VIÊN:', pinId);
        try {
          apiRef.current?.executeCommand('pinParticipant', pinId);
        } catch (err) {}
      } else if (msg.startsWith('__TOGGLE_STUDENT_SCREENSHARE__:')) {
        const allowed = msg.includes(':true');
        console.log('📢 [HỌC VIÊN] NHẬN QUYỀN SHARE MÀN HÌNH TỪ GIÁO VIÊN:', allowed);
        if (!allowed) {
          try {
            apiRef.current?.executeCommand('toggleShareScreen', false);
          } catch (err) {}
        }
      }
    });

    // Listen for hangup
    apiRef.current.addEventListener('readyToClose', () => {
      router.back();
    });

    const handleConferenceEndedMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'JITSI_CONFERENCE_ENDED') {
        router.back();
      }
    };
    window.addEventListener('message', handleConferenceEndedMessage);

  };

  // Set the transparent PNG Base64 placeholder as background to keep it blank by default
  useEffect(() => {
    if (!isMounted) return;
    setBgImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
  }, [isMounted]);

  // Listen for custom Jitsi iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'TOGGLE_TIMER' || event.data.type === 'TOGGLE_TIMER_CARD') {
        console.log('[Page] TOGGLE_TIMER received, dispatching toggle-timer-card');
        window.dispatchEvent(new CustomEvent('toggle-timer-card'));
      } else if (event.data.type === 'WHEEL_ACTION') {
        console.log('[Student] WHEEL_ACTION received:', event.data.payload);
        window.dispatchEvent(new CustomEvent('sync-wheel-action', { detail: event.data.payload }));
      } else if (event.data.type === 'DICE_ACTION') {
        console.log('[Student] DICE_ACTION received:', event.data.payload);
        window.dispatchEvent(new CustomEvent('sync-dice-action', { detail: event.data.payload }));
      } else if (event.data.type === 'TRIGGER_PRAISE') {
        if (apiRef.current) {
          const randIndex = Math.floor(Math.random() * 5);
          apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${randIndex}`);
        }
      } else if (event.data.type === 'PLAY_PRAISE') {
        const payload = event.data.payload || { mascotIdx: 0 };
        console.log('[Student] PLAY_PRAISE message received with payload:', payload);
        triggerPraiseAnimation(payload);
      } else if (event.data.type === 'BREAKOUT_ROOM_STATUS') {
        console.log('[Room] BREAKOUT_ROOM_STATUS received:', event.data.inBreakout);
        setIsInBreakoutRoom(!!event.data.inBreakout);
      } else if (event.data.type === 'STUDENT_SCREENSHARE_PERMITTED') {
        const allowed = event.data.allowed;
        showToast(allowed ? '🎉 Giáo viên đã cho phép bạn chia sẻ màn hình!' : '🔒 Giáo viên đã khóa quyền chia sẻ màn hình.');
      } else if (event.data.type === 'JITSI_CLICKED') {
        setShowExitConfirm(false);
      } else if (event.data.type === 'FORCE_END_MEETING_ALL') {
        console.log('[Room] FORCE_END_MEETING_ALL received, exiting classroom');
        try {
          apiRef.current?.executeCommand('hangup');
        } catch (e) {}
        setTimeout(() => {
          router.back();
        }, 200);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (isCheckingHost) {
    return (
      <div className="fixed inset-0 bg-[#1d285c] flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-sm font-semibold">Đang chuẩn bị phòng học...</p>
        </div>
      </div>
    );
  }

  if (!shouldLoadJitsi) {
    return (
      <div className="fixed inset-0 bg-[#1d285c] flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 max-w-md w-full flex flex-col items-center gap-6 border border-slate-100">
          <div className="relative w-36 h-36 -mt-24 flex items-center justify-center">
            <img
              src="/images/hao-hung-san-sang.png"
              alt="Vietsure Mascot"
              className="w-32 h-32 object-contain drop-shadow-md"
            />
          </div>
          
          <div className="text-center space-y-1.5 mt-2">
            <p className="text-[#FF6B00] text-2xl font-bold tracking-wide">Vietsure English</p>
            <h2 className="text-[#2E357F] text-xl font-extrabold">Chào mừng bạn đến với lớp học!</h2>
            <p className="text-slate-500 text-sm">Vui lòng nhập tên của bạn để bắt đầu buổi học cùng giáo viên nhé.</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (studentInputName.trim()) {
                // 🔓 Unlock audio autoplay on mobile (iOS/Android require user gesture)
                try {
                  const silence = new Audio('/Hooray.mp3');
                  silence.volume = 0.001;
                  silence.play().catch(() => {});
                } catch (_) {}
                setHasEnteredName(true);
              }
            }}
            className="w-full flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-bold text-[#2E357F] mb-1.5 block uppercase tracking-wider">Tên của học viên</label>
              <input
                type="text"
                value={studentInputName}
                onChange={(e) => setStudentInputName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] text-slate-800 font-medium text-sm transition-colors"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-[#FF6B00] hover:bg-[#e66000] text-white transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
            >
              Vào lớp học
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Top bar (Hidden when in Fullscreen Mode so video fills 100% mobile screen) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-5 py-3 bg-[#1d285c] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="/images/Vietsure English_Logo-15.png"
                alt="VietSure English"
                className="h-7 w-auto object-contain"
              />
              <p className="text-white/60 text-xs">| Phòng: {roomName}{currentSubRoomName ? ` > ${currentSubRoomName}` : ''}</p>
            </div>
          </div>

          {/* Central banner text */}
          <p className="hidden md:block text-white/95 text-sm md:text-base font-black tracking-wider uppercase text-center flex-1 mx-6 truncate">
            HỆ THỐNG GIÁO DỤC ONLINE <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span> CHO TRẺ EM TRONG VÀ NGOÀI NƯỚC
          </p>

          <div className="flex items-center gap-3 shrink-0">

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



            <button
              onClick={() => setShowExitConfirm(prev => !prev)}
              className="p-2 bg-[#FF4D4D] hover:bg-[#E60000] text-white rounded-lg transition-colors shadow-sm flex items-center justify-center"
              title="Thoát cuộc họp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.5354 14.2137C15.7419 15.0465 15.9228 15.4474 16.4337 15.8121C16.8922 16.1384 19.3358 16.5121 20.3023 16.4997C20.811 16.4933 21.2542 16.3621 21.6056 16.0384L21.6232 16.0217C22.4813 15.1709 22.6574 12.8488 22.3762 11.6107C22.2078 10.4059 21.3703 9.47571 19.9807 8.85603L19.7682 8.76541C16.0438 7.06296 7.96818 7.0911 4.2181 8.77268C2.73412 9.36142 1.82253 10.3345 1.61993 11.6621C1.35005 12.7299 1.50796 15.133 2.37837 16.0151C2.75243 16.3607 3.19644 16.492 3.70455 16.4986C4.66973 16.5111 7.11478 16.1372 7.57192 15.8123C8.04127 15.4779 8.23266 15.113 8.42034 14.413L8.48734 14.1503C8.61337 13.6444 8.68996 13.4979 8.88053 13.4009C10.9611 12.4505 13.0448 12.4503 15.1496 13.4114C15.3001 13.4887 15.3773 13.6153 15.4834 14.0097L15.5354 14.2137ZM7.03286 13.7836C7.09435 13.537 7.18016 13.2139 7.33129 12.9257C7.53766 12.5321 7.83388 12.2506 8.19985 12.0642L8.22827 12.0497L8.25728 12.0365C10.7362 10.9041 13.2746 10.9063 15.7726 12.0469L15.8041 12.0613L15.8348 12.0771C16.172 12.2502 16.4436 12.5087 16.6381 12.8519C16.7893 13.1187 16.8744 13.4061 16.9319 13.6203L16.9344 13.6297L16.9913 13.8528C17.0895 14.2487 17.1504 14.4019 17.1903 14.4759C17.2045 14.5022 17.2134 14.5129 17.22 14.5202"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Exit Fullscreen button when in Fullscreen Mode */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-3 left-3 z-[100] bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all"
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
        <WheelWidget apiRef={apiRef} isHost={false} apiReady={apiReady} />
        <DiceWidget apiRef={apiRef} isHost={false} apiReady={apiReady} />
        <PraiseWidget apiRef={apiRef} isHost={false} apiReady={apiReady} roomName={roomName || 'default'} />

        {/* Custom Exit Popover (Matches Jitsi's native look) */}
        {showExitConfirm && (
          <div 
            ref={exitPopoverRef}
            className="absolute top-[10px] right-[10px] bg-[#141414] p-3 rounded-xl flex flex-col items-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-white/10 w-[260px] z-[99999]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {isInBreakoutRoom && (
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  try {
                    const iframe = apiRef.current?.getIFrame();
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({ type: 'LEAVE_BREAKOUT_ROOM', mainRoomName: roomName }, '*');
                    }
                    try {
                      apiRef.current?.executeCommand('joinBreakoutRoom', '');
                    } catch (e) {}
                  } catch (e) {
                    console.error('Failed to leave breakout room:', e);
                  }
                }}
                className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold py-2.5 px-4 rounded-lg text-[13px] text-center transition-colors mb-2"
              >
                Rời phòng nhỏ về phòng chính
              </button>
            )}
            <button
              onClick={() => {
                setShowExitConfirm(false);
                apiRef.current?.executeCommand('hangup');
              }}
              className="w-full bg-[#E0E0E0] hover:bg-[#c9c9c9] text-[#040404] font-bold py-2.5 px-4 rounded-lg text-[13px] text-center transition-colors"
            >
              Rời khỏi cuộc họp
            </button>
            
            <button
              onClick={() => setShowExitConfirm(false)}
              className="w-full bg-transparent hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-lg text-[13px] text-center mt-1 transition-colors"
            >
              Hủy
            </button>
            
            {/* Arrow pointing up */}
            <div className="absolute bottom-full right-[20px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#141414]"></div>
          </div>
        )}
      </div>

      {/* Toast Notification Banner for Student */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999999] bg-slate-900/90 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-xl">📢</span>
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Celebration / Praise animations (mascot characters bubbling up from the bottom with hooray sounds & banner)
const triggerPraiseAnimation = (param?: any) => {
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

  // 1. Play Hooray celebratory sound via MP3
  try {
    const audio = new Audio('/Hooray.mp3');
    audio.play().catch(e => console.warn('[Praise] MP3 play failed:', e));
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
