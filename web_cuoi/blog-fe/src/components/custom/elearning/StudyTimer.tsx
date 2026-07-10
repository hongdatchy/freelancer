'use client';

import { useEffect, useRef, useState } from 'react';
import { putData } from '@/service/api';

export default function StudyTimer({
  mediaId,
  requiredMinutes,
  initialMinutes,
}: {
  mediaId: string;
  requiredMinutes: number;
  initialMinutes: number;
}) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  const isCompleted = seconds >= requiredMinutes * 60;
  const syncRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(seconds);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  // ⏱ tăng mỗi giây
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        return next >= requiredMinutes * 60 ? requiredMinutes * 60 : next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [requiredMinutes, isCompleted]);

  // 💾 sync API mỗi 10s
  useEffect(() => {
    if (isCompleted) return;

    syncRef.current = setInterval(async () => {
      const currentMinutes = Math.floor(secondsRef.current / 60) + 1;

      try {
        const res = await putData(
          `api/media-lectures/${mediaId}`,
          { data: { currentMinutes } }
        );
        console.log('📥 RESPONSE UPDATE PROGRESS:', res);
      } catch (err) {
        console.error('❌ UPDATE PROGRESS ERROR:', err);
      }
    }, 60000);

    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [mediaId, isCompleted]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const requiredSeconds = requiredMinutes * 60;

  return (
    <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-50 flex gap-2 items-center">
      <span>⏱ {format(seconds)}</span>
      <span>/</span>
      <span>🎯 {format(requiredSeconds)}</span>
      {isCompleted && <span className="text-green-400 ml-2">✔ Done</span>}
    </div>
  );
}