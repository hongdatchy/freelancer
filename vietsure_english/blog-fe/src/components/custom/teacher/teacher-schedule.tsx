'use client';

import { getData, postData, putData } from '@/service/api';
import useJitsiStore from '@/state-manager/jitsi-store';
import useUserLoginStore from '@/state-manager/user-login-store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { unlockAudio } from '@/lib/audio-context';

// ---- Config ----
const START_HOUR = 7;
const END_HOUR = 21;

const generateSlots = () => {
  const slots: string[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    const start1 = `${String(h).padStart(2, '0')}:00`;
    const end1 = `${String(h).padStart(2, '0')}:30`;
    slots.push(`${start1} - ${end1}`);

    const start2 = `${String(h).padStart(2, '0')}:30`;
    const end2 = `${String(h + 1).padStart(2, '0')}:00`;
    slots.push(`${start2} - ${end2}`);
  }
  return slots;
};

const TIME_SLOTS = generateSlots();

const DAYS_CONFIG = [
  { dayKey: 'Thứ 2', labelDay: 'MON', labelDate: '2' },
  { dayKey: 'Thứ 3', labelDay: 'TUE', labelDate: '3' },
  { dayKey: 'Thứ 4', labelDay: 'WED', labelDate: '4' },
  { dayKey: 'Thứ 5', labelDay: 'THU', labelDate: '5' },
  { dayKey: 'Thứ 6', labelDay: 'FRI', labelDate: '6' },
  { dayKey: 'Thứ 7', labelDay: 'SAT', labelDate: '7' },
  { dayKey: 'CN', labelDay: 'SUN', labelDate: 'CN' },
];

// ---- Types ----
interface ScheduleItem {
  id: string;
  day: string;
  time_slot: string;
  class_code?: string;
}

interface ScheduleMap {
  [key: string]: ScheduleItem;
}

// ---- Component ----
export function TeacherScheduleView() {
  const { user } = useUserLoginStore();
  const router = useRouter();
  const startMeeting = useJitsiStore((state) => state.startMeeting);
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({});
  const [loading, setLoading] = useState(false);

  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<{ day: string, slot: string } | null>(null);
  const [popupClassCode, setPopupClassCode] = useState('');

  // Popup for viewing/acting on an existing booked slot
  const [selectedSlotForView, setSelectedSlotForView] = useState<{ day: string, slot: string } | null>(null);
  const [editClassCode, setEditClassCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  const canEdit = !!user;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const classroom = urlParams.get('classroom');
      if (classroom) {
        try {
          unlockAudio();
        } catch (e) {}
        startMeeting(classroom);
        
        // Clean URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [startMeeting]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await getData(
          `api/teacher-schedules?filters[users_permissions_user][id][$eq]=${user.id}&pagination[pageSize]=500`
        );

        const map: ScheduleMap = {};
        res.data?.forEach((item: any) => {
          const key = `${item.day}_${item.time_slot}`;
          map[key] = {
            id: item.documentId || String(item.id),
            day: item.day,
            time_slot: item.time_slot,
            class_code: item.class_code || '',
          };
        });

        setScheduleMap(map);
      } catch (err) {
        console.error('Fetch schedule error:', err);
      }
      setLoading(false);
    };

    fetchSchedule();
  }, [user?.id]);

  const handleCellClick = (day: string, slot: string) => {
    if (!canEdit) return;

    const key = `${day}_${slot}`;
    const item = scheduleMap[key];

    if (item) {
      setSelectedSlotForView({ day, slot });
      setEditClassCode(item.class_code || '');
    } else {
      setSelectedSlotForBooking({ day, slot });
      setPopupClassCode('');
    }
  };

  const deleteSchedule = async () => {
    if (!selectedSlotForView) return;
    const { day, slot } = selectedSlotForView;
    const key = `${day}_${slot}`;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/api/teacher-schedules/${scheduleMap[key].id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BE_TOKEN_ADMIN}`,
        },
      });
      setScheduleMap(prev => {
        const s = { ...prev };
        delete s[key];
        return s;
      });
    } catch (err) {
      console.error('Delete error:', err);
    }
    setSelectedSlotForView(null);
  };

  const confirmBooking = async () => {
    if (!selectedSlotForBooking || !canEdit) return;

    const { day, slot } = selectedSlotForBooking;
    const key = `${day}_${slot}`;
    const studentName = popupClassCode;

    try {
      const res = await postData(`api/teacher-schedules`, {
        data: {
          day,
          time_slot: slot,
          class_code: studentName,
          users_permissions_user: user?.id,
        },
      });

      const newItem = res?.data;
      if (newItem) {
        setScheduleMap(prev => ({
          ...prev,
          [key]: {
            id: newItem.documentId || String(newItem.id),
            day,
            time_slot: slot,
            class_code: studentName,
          },
        }));
      }
    } catch (err) {
      console.error('Create error:', err);
    }

    setSelectedSlotForBooking(null);
  };

  const updateClassCode = async () => {
    if (!selectedSlotForView || !canEdit) return;
    const { day, slot } = selectedSlotForView;
    const key = `${day}_${slot}`;
    const item = scheduleMap[key];
    if (!item) return;

    try {
      await putData(`api/teacher-schedules/${item.id}`, {
        data: {
          day,
          time_slot: slot,
          class_code: editClassCode,
        },
      });

      setScheduleMap(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          class_code: editClassCode,
        },
      }));
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-[#2E357F] font-bold">Đang tải lịch...</div>;
  }

  return (
    <div className="w-full p-6 md:p-8 bg-white rounded-[24px] shadow-[0_15px_40px_rgba(59,130,246,0.05)]">

      <h2 className="section-title text-center mb-10">
        AVAILABILITY TIME
      </h2>

      {/* Removed Toggle Button */}

      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-separate border-spacing-x-[2px] border-spacing-y-[3px] min-w-[800px]">
          <thead>
            <tr>
              {/* Legend Box left top */}
              <th className="bg-white border border-sky-100 rounded-[6px] p-2 text-left align-middle w-[220px]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#3F489A] flex-shrink-0" />
                    <span className="text-[#2E357F] font-black text-xs tracking-wider">AVAILABLE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#3F489A] flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
                      X
                    </span>
                    <span className="text-[#2E357F] font-black text-xs tracking-wider">UNAVAILABLE</span>
                  </div>
                </div>
              </th>

              {/* Day Columns */}
              {DAYS_CONFIG.map(dayInfo => (
                <th
                  key={dayInfo.dayKey}
                  className="bg-[#3F489A] text-white rounded-[4px] p-2 text-center align-middle shadow-[1px_1px_0_0_rgba(63,72,154,0.15)] min-w-[90px]"
                >
                  <p className="text-yellow-300 font-extrabold text-[18px] leading-tight">
                    {dayInfo.labelDate}
                  </p>
                  <p className="text-white text-[11px] font-bold tracking-wider mt-0.5">
                    {dayInfo.labelDay}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot}>
                {/* Time slot label */}
                <td className="bg-white text-[#3F489A] font-bold text-xs rounded px-3 py-2 text-left align-middle border border-slate-200/60 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#3F489A]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{slot}</span>
                  </div>
                </td>

                {/* Day status cells */}
                {DAYS_CONFIG.map(dayInfo => {
                  const key = `${dayInfo.dayKey}_${slot}`;
                  const item = scheduleMap[key];
                  const visualActive = !!item;

                  return (
                    <td
                      key={dayInfo.dayKey}
                      onClick={() => handleCellClick(dayInfo.dayKey, slot)}
                      className={`h-[42px] align-middle text-center rounded transition-all select-none duration-150 p-1 ${canEdit ? 'cursor-pointer hover:ring-2 hover:ring-[#FF6B00]/50 hover:ring-inset' : 'cursor-default'
                        } ${visualActive
                          ? 'bg-[#3F489A]'
                          : 'bg-[#FEE2E2]'
                        }`}
                    >
                      {visualActive ? (
                        item?.class_code ? (
                          <span className="text-white font-extrabold text-[11px] block truncate px-0.5" title={item.class_code}>
                            {item.class_code}
                          </span>
                        ) : (
                          <span className="text-white font-black text-base">V</span>
                        )
                      ) : (
                        <span className="text-red-500 font-semibold text-sm">x</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedSlotForBooking} onOpenChange={(open) => !open && setSelectedSlotForBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-[#2E357F] font-bold text-xl">Đăng ký lịch trống</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Lịch: {selectedSlotForBooking?.slot} ({selectedSlotForBooking?.day})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="mt-2">
              <label className="text-sm font-bold text-[#2E357F] mb-2 block">
                Mã lớp học
              </label>
              <input
                type="text"
                value={popupClassCode}
                onChange={(e) => setPopupClassCode(e.target.value)}
                placeholder="Nhập mã lớp..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between flex-row gap-3">
            <button
              onClick={() => setSelectedSlotForBooking(null)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={confirmBooking}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#e66000] shadow-md hover:shadow-lg rounded-xl transition-all"
            >
              Xác nhận
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup for existing booked slot */}
      <Dialog open={!!selectedSlotForView} onOpenChange={(open) => !open && setSelectedSlotForView(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center text-[#2E357F] font-bold text-xl">Lịch đã đặt</DialogTitle>
            <DialogDescription className="text-center mt-2">
              {selectedSlotForView && (() => {
                const key = `${selectedSlotForView.day}_${selectedSlotForView.slot}`;
                const item = scheduleMap[key];
                return (
                  <span>
                    {selectedSlotForView.slot} ({selectedSlotForView.day})
                    {item?.class_code ? ` — ${item.class_code}` : ''}
                  </span>
                );
              })()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {(() => {
              const key = selectedSlotForView ? `${selectedSlotForView.day}_${selectedSlotForView.slot}` : '';
              const item = scheduleMap[key];
              const hasClassCode = !!(item?.class_code && item.class_code.trim());

              if (hasClassCode) {
                const cleanClass = item!.class_code!.trim().replace(/\s+/g, '_');
                const roomName = cleanClass;
                const link = `${origin}/classroom/${roomName}`;

                return (
                  <>
                    <div className="bg-[#3F489A]/5 border border-dashed border-[#3F489A]/20 rounded-xl p-3 text-center mb-1 flex flex-col gap-1.5 items-center justify-center select-all">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3F489A]">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        Đường dẫn lớp học
                      </span>
                      <span className="text-xs font-bold text-[#3F489A] break-all select-all">
                        {link}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedSlotForView) return;
                        const cleanClass = item!.class_code!.trim().replace(/\s+/g, '_');
                        const roomName = cleanClass;
                        
                        // Check if this window was already launched with the classroom parameter
                        // or is explicitly the classroom child window
                        const isChildWindow = typeof window !== 'undefined' && 
                          (window.location.search.includes('classroom=') || window.name === 'teacher_classroom_window');

                        if (!isChildWindow) {
                          const width = 1200;
                          const height = 800;
                          const left = (window.screen.width - width) / 2;
                          const top = (window.screen.height - height) / 2;
                          
                          window.open(
                            `${window.location.origin}/schedule-management?classroom=${roomName}`,
                            'teacher_classroom_window',
                            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                          );
                          setSelectedSlotForView(null);
                        } else {
                          try {
                            unlockAudio();
                          } catch (e) {
                            console.warn('Failed to unlock AudioContext:', e);
                          }
                          setSelectedSlotForView(null);
                          startMeeting(roomName);
                        }
                      }}
                      className="w-full py-3 rounded-xl text-sm font-bold bg-[#3F489A] text-white hover:bg-[#2E357F] transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 10l5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" />
                      </svg>
                      Vào dạy học
                    </button>
                    <button
                      onClick={() => {
                        if (!selectedSlotForView) return;
                        const cleanClass = item!.class_code!.trim().replace(/\s+/g, '_');
                        const roomName = cleanClass;
                        const link = `${origin}/classroom/${roomName}`;
                        navigator.clipboard.writeText(link);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {copied ? 'Đã copy link học viên!' : 'Copy link gửi học viên'}
                    </button>
                  </>
                );
              }

              return (
                <div className="space-y-3 pb-2">
                  <div>
                    <label className="text-sm font-bold text-[#2E357F] mb-1.5 block">
                      Nhập mã lớp học cho lịch này
                    </label>
                    <input
                      type="text"
                      value={editClassCode}
                      onChange={(e) => setEditClassCode(e.target.value)}
                      placeholder="Nhập mã lớp..."
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors text-sm"
                    />
                  </div>
                  <button
                    onClick={updateClassCode}
                    className="w-full py-3 rounded-xl text-sm font-bold bg-[#FF6B00] text-white hover:bg-[#e66000] shadow-md transition-all"
                  >
                    Lưu mã lớp học
                  </button>
                </div>
              );
            })()}

            {/* Option 2: Delete schedule */}
            <button
              onClick={deleteSchedule}
              className="w-full py-3 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Xóa lịch học
            </button>

            <button
              onClick={() => setSelectedSlotForView(null)}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}