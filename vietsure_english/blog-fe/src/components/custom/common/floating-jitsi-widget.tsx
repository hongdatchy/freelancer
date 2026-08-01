'use client';

import { useEffect, useRef, useState } from 'react';
import useJitsiStore from '@/state-manager/jitsi-store';
import useUserLoginStore from '@/state-manager/user-login-store';
import TimerWidget from '@/components/custom/common/timer-widget';
import WheelWidget from '@/components/custom/common/wheel-widget';
import DiceWidget from '@/components/custom/common/dice-widget';
import PraiseWidget from '@/components/custom/common/praise-widget';
import { getData } from '@/service/api';

const JITSI_SERVER = process.env.NEXT_PUBLIC_JITSI_SERVER;

export default function FloatingJitsiWidget() {
  const { roomName, isOpen, isMinimized, closeMeeting, setMinimized } = useJitsiStore();
  const { user, jwt, setLogin } = useUserLoginStore();

  useEffect(() => {
    if (user && !user.avatar && user.id) {
      getData(`api/users/${user.id}?populate=avatar`)
        .then((fullUser) => {
          if (fullUser && fullUser.avatar && jwt) {
            setLogin(jwt, { ...user, avatar: fullUser.avatar });
          }
        })
        .catch(() => { });
    }
  }, [user, jwt, setLogin]);
  const isHost = true;
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const teacherExitPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showExitConfirm) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (teacherExitPopoverRef.current && !teacherExitPopoverRef.current.contains(e.target as Node)) {
        const btn = (e.target as HTMLElement).closest('button');
        if (!btn || (!btn.getAttribute('title')?.includes('Thoát') && !btn.closest('[title*="Thoát"]'))) {
          setShowExitConfirm(false);
        }
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [showExitConfirm]);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Custom resizing state (NW-resize dragging from top-left) - Landscape default (width > height)
  const [size, setSize] = useState({ width: 650, height: 450 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialWidth = Math.max(320, window.innerWidth - 48);
      const initialHeight = Math.max(400, window.innerHeight - 100);
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
  const lastPraiseTimeRef = useRef<number>(0);
  const isTileViewEnabledRef = useRef<boolean>(false);
  const isScreenSharingRef = useRef<boolean>(false);
  const breakoutRoomsDataRef = useRef<any>(null);
  const currentSubRoomJidRef = useRef<string>('');
  const shouldEndConferenceOnMainJoinRef = useRef<boolean>(false);
  const [isInBreakoutRoom, setIsInBreakoutRoom] = useState(false);
  const [currentSubRoomName, setCurrentSubRoomName] = useState<string | null>(null);
  const [isTileViewActive, setIsTileViewActive] = useState<boolean>(false);

  // Student Screenshare Permission Toggle State (Option 1)
  const [allowStudentShare, setAllowStudentShare] = useState(false);

  const handleToggleStudentShare = () => {
    const next = !allowStudentShare;
    setAllowStudentShare(next);
    if (apiRef.current) {
      apiRef.current.executeCommand('sendChatMessage', `__TOGGLE_STUDENT_SCREENSHARE__:${next}`);
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'TEACHER_TOGGLED_STUDENT_SHARE') {
        const allowed = !!e.data.allowed;
        setAllowStudentShare(allowed);
        if (apiRef.current) {
          console.log('📢 [Widget Parent] Broadcasting __TOGGLE_STUDENT_SCREENSHARE__ via apiRef:', allowed);
          try {
            apiRef.current.executeCommand('sendChatMessage', `__TOGGLE_STUDENT_SCREENSHARE__:${allowed}`);
          } catch (err) {
            console.error('[Widget Parent] Failed to sendChatMessage:', err);
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    userRef.current = user;
    closeMeetingRef.current = closeMeeting;
  }, [user, closeMeeting]);

  const [bgImage, setBgImage] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [isPraiseModalOpen, setIsPraiseModalOpen] = useState(false);
  const starScoresKey = `praiseStars_${roomName || 'default'}`;
  const [starScores, setStarScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`praiseStars_${roomName || 'default'}`);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const participantsRef = useRef<string[]>([]);

  const getStudentList = () => {
    if (!apiRef.current) return [];
    try {
      const participants = apiRef.current.getParticipantsInfo() || [];
      return participants
        .filter((p: any) => {
          const displayName = p.formattedDisplayName || p.displayName || '';
          if (displayName.includes('(me)')) return false;
          return true;
        })
        .map((p: any) => ({
          id: p.participantId || p.id,
          name: (p.formattedDisplayName || p.displayName || 'Học viên').replace(/\s*⭐\s*\d+/g, '').trim(),
        }));
    } catch (e) {
      return [];
    }
  };

  const handleSendPraise = (opts: { studentName?: string; studentId?: string; isAll?: boolean }) => {
    const randIndex = Math.floor(Math.random() * 5);
    const students = getStudentList();

    if (opts.isAll) {
      const newScores = { ...starScores };
      students.forEach((s: any) => { newScores[s.name] = (newScores[s.name] || 0) + 1; });

      // Broadcast 1 message cho cả lớp (không có recipient → messageReceived hoạt động)
      const payload = { isAll: true, mascotIdx: randIndex, allScores: newScores };
      if (apiRef.current) {
        apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${JSON.stringify(payload)}`);
      }

      // Giáo viên tự chơi animation phía parent
      triggerPraiseAnimation({ isAll: true, mascotIdx: randIndex }, apiRef);
      setStarScores(newScores);
      try { localStorage.setItem(starScoresKey, JSON.stringify(newScores)); } catch { }

    } else if (opts.studentName) {
      const newScores = { ...starScores, [opts.studentName]: (starScores[opts.studentName] || 0) + 1 };
      // Broadcast kèm tên học viên được khen, học viên khác tự bỏ qua nếu cần
      const payload = { studentName: opts.studentName, mascotIdx: randIndex, allScores: newScores };
      if (apiRef.current) {
        apiRef.current.executeCommand('sendChatMessage', `__PRAISE__:${JSON.stringify(payload)}`);
      }
      triggerPraiseAnimation(payload, apiRef);
      setStarScores(newScores);
      try { localStorage.setItem(starScoresKey, JSON.stringify(newScores)); } catch { }
    }

    setIsPraiseModalOpen(false);
  };

  // Jitsi meeting should be initialized exactly ONCE when the meeting starts
  // and disposed exactly ONCE when closed. We do NOT recreate Jitsi when minimized/maximized.
  useEffect(() => {
    if (!isOpen || !roomName) {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
        setApiReady(false);
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

      const avatarRawUrl = userRef.current?.avatar?.formats?.small?.url ||
        userRef.current?.avatar?.formats?.thumbnail?.url ||
        userRef.current?.avatar?.url;
      const avatarURL = avatarRawUrl
        ? (avatarRawUrl.startsWith('http') ? avatarRawUrl : (process.env.NEXT_PUBLIC_BE_HOST || '') + avatarRawUrl)
        : '';

      const sanitizedRoom = decodeURIComponent(roomName)
        .replace(/[^a-zA-Z0-9À-ỹ\-_]/g, '-')
        .replace(/-+/g, '-');
      const teacherId = userRef.current?.id || '0';
      const jitsiRoomJID = `${sanitizedRoom}_GV_${teacherId}`;

      // Generate JWT Token using Web Crypto API
      const generateJitsiJWT = async () => {
        const header = { alg: "HS256", typ: "JWT" };
        const now = Math.floor(Date.now() / 1000);
        const payload = {
          context: {
            user: { name: displayName, email: email, avatar: avatarURL },
            features: { recording: true, livestreaming: true }
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

      const token = await generateJitsiJWT();

      apiRef.current = new (window as any).JitsiMeetExternalAPI(JITSI_SERVER, {
        roomName: jitsiRoomJID,
        jwt: token,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName,
          email,
          avatarURL,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          startTileView: true,
          disablePolls: false,
          defaultLanguage: 'vi',
          settingsSections: ['devices', 'moderator', 'profile', 'calendar', 'sounds'],
          disableSelfViewSettings: true,
          disabledSounds: ['INCOMING_MSG_SOUND_ID', 'OUTGOING_MSG_SOUND_ID'],
          isStudent: false,
          subject: sanitizedRoom,
          whiteboard: { enabled: true },
          localRecording: {
            enabled: true,
            disableSelfRecording: false,
          },
          resolution: 720,
          videoQuality: {
            maxReceiverVideoQuality: 3, // 3 = Best/High quality
          },
          toolbarButtons: [
            'camera', 'chat', 'closedcaptions', 'download',
            'etherpad', 'feedback', 'filmstrip',
            'help', 'highlight', 'livestreaming', 'microphone',
            'mute-everyone', 'mute-video-everyone', 'participants-pane',
            'profile', 'raisehand', 'select-background',
            'settings', 'shareaudio', 'sharedvideo', 'stats',
            'toggle-camera', 'polls', 'whiteboard', 'tileview', 'desktop'
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#F0F7FF',
          SETTINGS_SECTIONS: ['devices', 'moderator', 'profile', 'calendar', 'sounds'],
        },
      });

      // Sync background to newly joined participants
      apiRef.current.addEventListener('participantJoined', (event: any) => {
        console.log('[Jitsi] participantJoined event raw data:', event);

        // If the participant is the YouTube shared video virtual participant
        if (event.id === 'shared-video' && apiRef.current) {
          console.log('[Jitsi] YouTube shared video participant joined:', event.id);

          // Check if local screen sharing is active by searching DOM
          const iframe = apiRef.current.getIFrame();
          const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
          const isLocalScreenSharing = !!iframeDoc?.getElementById('filmstripLocalScreenShareThumbnail');

          console.log('[Jitsi] Screen share status when video joined:', isLocalScreenSharing);
          if (isLocalScreenSharing) {
            console.log('[Jitsi] Toggling screen sharing off due to video join');
            apiRef.current.executeCommand('toggleShareScreen');
          }
        }

        if (!participantsRef.current.includes(event.id)) {
          participantsRef.current.push(event.id);
        }
        if (!!userRef.current && bgImageRef.current) {
          // Delay sending by 5 seconds to ensure the Jitsi WebRTC Bridge Channel is fully open
          setTimeout(() => {
            if (apiRef.current && bgImageRef.current) {
              console.log("📤 Delay-sending current whiteboard background to participant:", event.id);
              try {
                apiRef.current.executeCommand('sendEndpointTextMessage', event.id, JSON.stringify({
                  type: 'SET_WHITEBOARD_BACKGROUND',
                  imageUrl: bgImageRef.current
                }));
              } catch (e) {
                console.warn("Could not send whiteboard background (Bridge Channel might not be open yet)", e);
              }
            }
          }, 5000);
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
        } catch (err) { }
      });

      apiRef.current.addEventListener('videoConferenceJoined', () => {
        setApiReady(true);

        if (avatarURL && apiRef.current) {
          try {
            apiRef.current.executeCommand('avatarUrl', avatarURL);
          } catch (e) { }
        }

        // Automatically trigger Fullscreen mode for Teacher floating widget
        if (widgetInnerRef.current && !document.fullscreenElement) {
          widgetInnerRef.current.requestFullscreen()
            .then(() => setIsFullscreen(true))
            .catch(() => { });
        }

        // Set initial filmstrip width to 310px on join if widget width > 1100px
        if (size.width > 1100) {
          if (apiRef.current) {
            apiRef.current.executeCommand('resizeFilmStrip', { width: 260 });
          }
        }

        setTimeout(() => {
          if (apiRef.current) {
            apiRef.current.executeCommand('startRecording', {
              mode: 'file'
            });
          }
        }, 1000);

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

      // Track tile view state for React state
      apiRef.current.addEventListener('tileViewChanged', (event: any) => {
        const enabled = !!event.enabled;
        isTileViewEnabledRef.current = enabled;
        setIsTileViewActive(enabled);
        console.log('📢 [Teacher TileView] Toggled Grid View to:', enabled);
      });

      // Auto-disable tile view when host starts screen sharing
      apiRef.current.addEventListener('screenSharingStatusChanged', (event: any) => {
        if (event.on && apiRef.current && isTileViewEnabledRef.current) {
          apiRef.current.executeCommand('toggleTileView');
        }
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

      // Listen for breakout rooms updates to keep track of room IDs
      apiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
        console.log('[Widget] videoConferenceJoined:', event);
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
            } catch (e) { }
          }
        }
      });

      apiRef.current.addEventListener('breakoutRoomsUpdated', (event: any) => {
        console.log('[Widget] breakoutRoomsUpdated:', event);
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

      apiRef.current.addEventListener('readyToClose', () => {
        closeMeetingRef.current();
      });

      const handleConferenceEndedMessage = (e: MessageEvent) => {
        if (e.data && e.data.type === 'JITSI_CONFERENCE_ENDED') {
          closeMeetingRef.current();
        }
      };
      window.addEventListener('message', handleConferenceEndedMessage);
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
        setApiReady(false);
      }
    };
  }, [isOpen, roomName]);

  // Lock Jitsi filmstrip width to 310px if widget width > 1100px when resizing finishes or restores
  useEffect(() => {
    if (!isResizing && !isMinimized && apiRef.current && apiReady) {
      if (size.width > 1100) {
        if (apiRef.current) {
          apiRef.current.executeCommand('resizeFilmStrip', { width: 260 });
        }
      }
    }
  }, [isResizing, isMinimized, size.width, apiReady]);





  // Listen for custom Jitsi iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === 'TOGGLE_TIMER_CARD' || event.data.type === 'TOGGLE_TIMER') {
          console.log('[Parent] TOGGLE_TIMER message received, dispatching event');
          window.dispatchEvent(new CustomEvent('toggle-timer-card'));
        } else if (event.data.type === 'TRIGGER_PRAISE') {
          console.log('[Parent] TRIGGER_PRAISE message received, dispatching toggle-praise-widget');
          window.dispatchEvent(new CustomEvent('toggle-praise-widget'));
        } else if (event.data.type === 'TRIGGER_DICE') {
          console.log('[Parent] TRIGGER_DICE message received, dispatching toggle-dice-widget');
          window.dispatchEvent(new CustomEvent('toggle-dice-widget'));
        } else if (event.data.type === 'TRIGGER_WHEEL') {
          console.log('[Parent] TRIGGER_WHEEL message received, dispatching toggle-wheel-widget');
          window.dispatchEvent(new CustomEvent('toggle-wheel-widget'));
        } else if (event.data.type === 'PLAY_PRAISE') {
          const payload = event.data.payload || { mascotIdx: 0 };
          console.log('[Parent] PLAY_PRAISE received with payload:', payload);
          triggerPraiseAnimation(payload, apiRef);
          if (payload.studentName) {
            setStarScores(prev => ({
              ...prev,
              [payload.studentName]: (prev[payload.studentName] || 0) + 1
            }));
          } else if (payload.isAll) {
            setStarScores(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(k => { next[k] = (next[k] || 0) + 1; });
              return next;
            });
          }
        } else if (event.data.type === 'BREAKOUT_ROOM_STATUS') {
          console.log('[Widget] BREAKOUT_ROOM_STATUS received:', event.data.inBreakout);
          setIsInBreakoutRoom(!!event.data.inBreakout);
        } else if (event.data.type === 'JITSI_CLICKED') {
          setShowExitConfirm(false);
        } else if (event.data.type === 'FORCE_END_MEETING_ALL') {
          console.log('[Widget] FORCE_END_MEETING_ALL received, closing widget');
          try {
            apiRef.current?.executeCommand('hangup');
          } catch (e) { }
          setTimeout(() => {
            closeMeetingRef.current();
          }, 200);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
  const outerDivRef = useRef<HTMLDivElement | null>(null);
  const widgetInnerRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const widgetSlotRef = useRef<HTMLDivElement | null>(null);

  const handlePiP2 = async () => {
    if (typeof window === 'undefined') return;

    if (!('documentPictureInPicture' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ Document Picture-in-Picture (vui lòng sử dụng Google Chrome hoặc Microsoft Edge 116+)!');
      return;
    }

    if (pipWindowRef.current) {
      try {
        pipWindowRef.current.close();
      } catch (e) {}
      pipWindowRef.current = null;
      return;
    }

    const targetWidget = outerDivRef.current;
    if (!targetWidget) return;

    try {
      const pipWin = await (window as any).documentPictureInPicture.requestWindow({
        width: Math.max(650, size.width),
        height: Math.max(450, size.height),
      });
      pipWindowRef.current = pipWin;

      // Copy all style & stylesheet link tags to PiP window
      const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
      styleElements.forEach((el) => {
        pipWin.document.head.appendChild(el.cloneNode(true));
      });

      pipWin.document.title = `Vietsure English - Lớp: ${roomName}`;
      pipWin.document.body.style.cssText = 'margin: 0; padding: 0; overflow: hidden; background: #1d285c; height: 100vh; width: 100vw; display: flex; flex-direction: column;';

      const originalStyle = targetWidget.getAttribute('style') || '';

      // Move the entire floating widget DOM element directly into the Document PiP window
      pipWin.document.body.appendChild(targetWidget);
      targetWidget.style.cssText = 'width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; margin: 0; border-radius: 0; border: none; flex: 1; display: flex; flex-direction: column; z-index: 999999;';

      setIsPipActive(true);

      pipWin.addEventListener('pagehide', () => {
        if (widgetSlotRef.current && targetWidget) {
          widgetSlotRef.current.appendChild(targetWidget);
          targetWidget.setAttribute('style', originalStyle);
        }
        pipWindowRef.current = null;
        setIsPipActive(false);
      });

    } catch (err) {
      console.error('[Document PiP] Failed to open:', err);
      alert('Không thể mở Document Picture-in-Picture!');
    }
  };

  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PIP_CLOSED') {
        console.log('[PiP] PIP_CLOSED event received from Jitsi iframe');
        setIsPipActive(false);
        setMinimized(false);
        // Bật Grid View lên → nút PiP tự ẩn, user phải tắt Grid View mới dùng PiP lại được
        if (apiRef.current) {
          try { apiRef.current.executeCommand('toggleTileView'); } catch (e) { }
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = widgetInnerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.warn('[Fullscreen] Error entering fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.warn('[Fullscreen] Error exiting fullscreen:', err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === widgetInnerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /*
  // Automatically trigger Fullscreen mode for Teacher floating widget when entering class
  useEffect(() => {
    if (!isOpen) return;

    const autoFullscreenTeacher = () => {
      if (widgetInnerRef.current && !document.fullscreenElement) {
        widgetInnerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => {});
      }
    };

    const timer = setTimeout(autoFullscreenTeacher, 300);
    window.addEventListener('click', autoFullscreenTeacher, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', autoFullscreenTeacher);
    };
  }, [isOpen]);
  */

  if (!isOpen || !roomName) return null;

  return (
    <div ref={widgetSlotRef}>
      {/* Main page widget */}
      <div
        ref={outerDivRef}
        style={{
          position: 'fixed',
          display: isMinimized ? 'none' : undefined,
          bottom: 24,
          right: 24,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: 9999,
        }}
        className="bg-gradient-to-b from-white to-[#F0F7FF] rounded-2xl overflow-hidden shadow-2xl border border-blue-200/50 flex flex-col"
        onMouseDown={undefined}
      >
        {/* Top-Left Resize Handle */}
        {!isMinimized && !isPipActive && (
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleTouchResizeStart}
            className="absolute top-1 left-1 w-6 h-6 cursor-nw-resize z-[10000] flex items-center justify-center text-white/30 hover:text-white transition-colors"
            title="Kéo để thay đổi kích thước"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
              <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="5" y1="1" x2="9" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="1" y1="5" x2="5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Minimized button - ẩn đi */}
        {/* <button
          onClick={() => {
            if (isPipActive) {
              const jitsiEl = containerRef.current;
              const iframe = apiRef.current?.getIFrame() || jitsiEl?.querySelector('iframe');
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                  type: 'TRIGGER_COMPOSITE_VIDEO_PIP'
                }, '*');
              }
              setIsPipActive(false);
              setMinimized(false);
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
              <>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <rect x="12" y="10" width="9" height="6" rx="1" fill="currentColor" stroke="none" />
              </>
            ) : (
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            )}
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
        </button> */}

        {/* Slot for widgetInnerRef. React will never try to insert siblings next to widgetInnerRef inside this div. */}
        <div ref={slotRef} className="flex-1 w-full flex" style={{ display: isMinimized ? 'none' : 'flex' }}>
          {/* Maximized Meeting Window Structure */}
          <div
            ref={widgetInnerRef}
            className="flex-col bg-[#1d285c] flex-1 w-full flex"
          >
            {/* Header Bar */}
            <div className={`items-center justify-between px-4 py-2.5 bg-[#1d285c] border-b border-white/10 select-none cursor-default ${isPipActive ? 'hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 shrink-0">
                <img
                  src="/images/Vietsure English_Logo-15.png"
                  alt="VietSure English"
                  className="h-6 w-auto object-contain"
                />
                <p className="text-white/60 text-[10px]">| Phòng: {roomName}{currentSubRoomName ? ` > ${currentSubRoomName}` : ''}</p>
              </div>
              <p className="hidden sm:block text-white/95 text-[11px] md:text-xs font-black tracking-wider uppercase text-center flex-1 mx-4 truncate">
                HỆ THỐNG GIÁO DỤC ONLINE <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span> CHO TRẺ EM TRONG VÀ NGOÀI NƯỚC
              </p>
              <div className="flex items-center gap-1">
                {/* Fullscreen button */}
                {!isPipActive && (
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                  >
                    {isFullscreen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                      </svg>
                    )}
                  </button>
                )}

                {/* PiP Button (Document Picture-in-Picture) */}
                <button
                  onClick={handlePiP2}
                  className="p-1.5 rounded-lg text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 transition-colors"
                  title="Mở Cửa sổ Nổi Meeting (Document Picture-in-Picture)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M14 10l5 5M19 10v5h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Minimize button */}
                {/* {!isPipActive && (
                  <button
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen().then(() => {
                          setIsFullscreen(false);
                          setMinimized(true);
                        }).catch(() => setMinimized(true));
                      } else {
                        setMinimized(true);
                      }
                    }}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Thu nhỏ cửa sổ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                )} */}
                {/* Custom Exit Button */}
                <button
                  onClick={() => setShowExitConfirm(prev => !prev)}
                  className="p-1.5 bg-[#FF4D4D] hover:bg-[#E60000] text-white rounded-lg transition-colors shadow-sm flex items-center justify-center no-drag"
                  title="Thoát cuộc họp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.5354 14.2137C15.7419 15.0465 15.9228 15.4474 16.4337 15.8121C16.8922 16.1384 19.3358 16.5121 20.3023 16.4997C20.811 16.4933 21.2542 16.3621 21.6056 16.0384L21.6232 16.0217C22.4813 15.1709 22.6574 12.8488 22.3762 11.6107C22.2078 10.4059 21.3703 9.47571 19.9807 8.85603L19.7682 8.76541C16.0438 7.06296 7.96818 7.0911 4.2181 8.77268C2.73412 9.36142 1.82253 10.3345 1.61993 11.6621C1.35005 12.7299 1.50796 15.133 2.37837 16.0151C2.75243 16.3607 3.19644 16.492 3.70455 16.4986C4.66973 16.5111 7.11478 16.1372 7.57192 15.8123C8.04127 15.4779 8.23266 15.113 8.42034 14.413L8.48734 14.1503C8.61337 13.6444 8.68996 13.4979 8.88053 13.4009C10.9611 12.4505 13.0448 12.4503 15.1496 13.4114C15.3001 13.4887 15.3773 13.6153 15.4834 14.0097L15.5354 14.2137ZM7.03286 13.7836C7.09435 13.537 7.18016 13.2139 7.33129 12.9257C7.53766 12.5321 7.83388 12.2506 8.19985 12.0642L8.22827 12.0497L8.25728 12.0365C10.7362 10.9041 13.2746 10.9063 15.7726 12.0469L15.8041 12.0613L15.8348 12.0771C16.172 12.2502 16.4436 12.5087 16.6381 12.8519C16.7893 13.1187 16.8744 13.4061 16.9319 13.6203L16.9344 13.6297L16.9913 13.8528C17.0895 14.2487 17.1504 14.4019 17.1903 14.4759C17.2045 14.5022 17.2134 14.5129 17.22 14.5202" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Jitsi Call Frame (Always remains mounted to prevent connection teardown) */}
            <div className="flex-1 w-full bg-[#F0F7FF] relative">
              <div ref={containerRef} className="w-full h-full" />
              <TimerWidget apiRef={apiRef} isHost={isHost} apiReady={apiReady} />
              <WheelWidget apiRef={apiRef} isHost={isHost} apiReady={apiReady} />
              <DiceWidget apiRef={apiRef} isHost={isHost} apiReady={apiReady} />
              <PraiseWidget apiRef={apiRef} isHost={true} apiReady={apiReady} roomName={roomName || 'default'} />

              {/* Custom Exit Popover for Teacher */}
              {showExitConfirm && (
                <div
                  ref={teacherExitPopoverRef}
                  className="absolute top-[10px] right-[10px] bg-[#141414] p-3 rounded-xl flex flex-col items-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-white/10 w-[260px] z-[99999] no-drag"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <>
                    <button
                      onClick={() => {
                        setShowExitConfirm(false);
                        if (isInBreakoutRoom) {
                          shouldEndConferenceOnMainJoinRef.current = true;
                          try {
                            const iframe = apiRef.current?.getIFrame();
                            if (iframe && iframe.contentWindow) {
                              iframe.contentWindow.postMessage({ type: 'LEAVE_BREAKOUT_ROOM', mainRoomName: roomName }, '*');
                            }
                            apiRef.current?.executeCommand('joinBreakoutRoom', '');
                          } catch (e) { }
                        } else {
                          apiRef.current?.executeCommand('endConference');
                        }
                      }}
                      className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold py-2.5 px-4 rounded-lg text-[13px] text-center transition-colors mb-2"
                    >
                      Kết thúc cuộc gọi theo nhóm
                    </button>
                    <button
                      onClick={() => {
                        setShowExitConfirm(false);
                        apiRef.current?.executeCommand('hangup');
                      }}
                      className="w-full bg-[#E0E0E0] hover:bg-[#c9c9c9] text-[#040404] font-bold py-2.5 px-4 rounded-lg text-[13px] text-center transition-colors"
                    >
                      Rời khỏi cuộc họp
                    </button>
                  </>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Celebration / Praise animations (mascot characters bubbling up from the bottom with hooray sounds & banner)
const triggerPraiseAnimation = (param?: any, apiRef?: any) => {
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

  // 1. Play Hooray celebratory sound via MP3 (route via Jitsi iframe if apiRef provided)
  try {
    const api = apiRef?.current;
    let playedViaIframe = false;
    if (api) {
      const iframe = api.getIFrame();
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'PLAY_CUSTOM_SOUND',
          soundPath: '/Hooray.mp3',
          key: 'praiseSound',
          origin: window.location.origin
        }, '*');
        playedViaIframe = true;
      }
    }
    if (!playedViaIframe) {
      import('@/lib/audio-context').then(({ playSound }) => playSound('/Hooray.mp3'));
    }
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
