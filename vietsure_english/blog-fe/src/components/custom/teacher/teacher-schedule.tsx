'use client';

import { getData, postData, putData } from '@/service/api';
import useUserLoginStore from '@/state-manager/user-login-store';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

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
  { dayKey: 'CN',    labelDay: 'SUN', labelDate: 'CN' },
];

// ---- Types ----
interface ScheduleItem {
  id: string;
  day: string;
  time_slot: string;
  student_name?: string;
  isVietSureEnglish?: boolean;
}

interface ScheduleMap {
  [key: string]: ScheduleItem;
}

interface Props {
  teacherId?: number;
}

// ---- Component ----
export function TeacherScheduleView({ teacherId }: Props) {
  const { user } = useUserLoginStore();
  const [resolvedTeacherId, setResolvedTeacherId] = useState<number | null>(null);
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({});
  const [loading, setLoading] = useState(false);
  
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<{day: string, slot: string} | null>(null);
  const [popupBookingType, setPopupBookingType] = useState<'VSE' | 'OTHER'>('VSE');
  const [popupClassCode, setPopupClassCode] = useState('');

  const canEdit = !teacherId && !!user;

  useEffect(() => {
    if (teacherId) {
      setResolvedTeacherId(teacherId);
    } else if (user?.id) {
      setResolvedTeacherId(user.id);
    }
  }, [teacherId, user]);

  useEffect(() => {
    if (!resolvedTeacherId) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await getData(
          `api/teacher-schedules?filters[users_permissions_user][id][$eq]=${resolvedTeacherId}&pagination[pageSize]=500`
        );

        const map: ScheduleMap = {};
        res.data?.forEach((item: any) => {
          const key = `${item.day}_${item.time_slot}`;
          map[key] = {
            id: item.documentId || String(item.id),
            day: item.day,
            time_slot: item.time_slot,
            student_name: item.student_name || '',
            isVietSureEnglish: item.isVietSureEnglish || false,
          };
        });

        setScheduleMap(map);
      } catch (err) {
        console.error('Fetch schedule error:', err);
      }
      setLoading(false);
    };

    fetchSchedule();
  }, [resolvedTeacherId]);

  const handleCellClick = async (day: string, slot: string) => {
    if (!canEdit) return;

    const key = `${day}_${slot}`;

    if (scheduleMap[key]) {
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
    } else {
      setSelectedSlotForBooking({ day, slot });
      setPopupBookingType('VSE');
      setPopupClassCode('');
    }
  };

  const confirmBooking = async () => {
    if (!selectedSlotForBooking || !canEdit) return;
    
    const { day, slot } = selectedSlotForBooking;
    const key = `${day}_${slot}`;
    const isVSE = popupBookingType === 'VSE';
    const studentName = isVSE ? popupClassCode : '';

    try {
      const res = await postData(`api/teacher-schedules`, {
        data: {
          day,
          time_slot: slot,
          student_name: studentName,
          isVietSureEnglish: isVSE,
          users_permissions_user: resolvedTeacherId,
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
            student_name: studentName,
            isVietSureEnglish: isVSE,
          },
        }));
      }
    } catch (err) {
      console.error('Create error:', err);
    }

    setSelectedSlotForBooking(null);
  };

  const handleStudentNameBlur = async (day: string, slot: string) => {
    if (!canEdit) return;
    const key = `${day}_${slot}`;
    const item = scheduleMap[key];
    if (!item) return;

    await putData(`api/teacher-schedules/${item.id}`, {
      data: {
        day,
        time_slot: slot,
        student_name: item.student_name,
        isVietSureEnglish: item.isVietSureEnglish,
      },
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-[#2E357F] font-bold">Đang tải lịch...</div>;
  }

  return (
    <div className="mt-16 w-full p-6 md:p-8 bg-white rounded-[24px] shadow-[0_15px_40px_rgba(59,130,246,0.05)]">
      
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
                  const teacherHasClass = !!item;
                  const isVSE = item?.isVietSureEnglish;
                  
                  // Invert logic for student (if canEdit is false)
                  const visualActive = canEdit ? teacherHasClass : !teacherHasClass;

                  return (
                    <td
                      key={dayInfo.dayKey}
                      onClick={() => handleCellClick(dayInfo.dayKey, slot)}
                      className={`h-[42px] align-middle text-center rounded transition-all select-none duration-150 p-1 ${
                        canEdit ? 'cursor-pointer hover:ring-2 hover:ring-[#FF6B00]/50 hover:ring-inset' : 'cursor-default'
                      } ${
                        visualActive 
                          ? 'bg-[#3F489A]' 
                          : 'bg-[#F5F7FC]'
                      }`}
                    >
                      {visualActive ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          {/* Inner text/block */}
                          <div className={`w-full h-full rounded-[2px] flex items-center justify-center overflow-hidden`}>
                            {canEdit && (
                              isVSE ? (
                                <input
                                  name={`student_${dayInfo.dayKey}_${slot}`}
                                  value={scheduleMap[key].student_name || ''}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setScheduleMap(prev => ({
                                      ...prev,
                                      [key]: { ...prev[key], student_name: val },
                                    }));
                                  }}
                                  onBlur={() => handleStudentNameBlur(dayInfo.dayKey, slot)}
                                  placeholder="Mã lớp"
                                  className={`w-[80%] h-[75%] text-center text-[10px] bg-white/95 text-[#3F489A] font-bold rounded-[3px] px-1 py-0.5 border-none focus:outline-none focus:ring-1 focus:ring-[#FF6B00] shadow-sm`}
                                />
                              ) : (
                                <div className="w-[80%] h-[75%] flex items-center justify-center text-white text-[10px] font-bold leading-tight">
                                  Trung tâm<br/>khác
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#8E9AD5] font-semibold text-sm">x</span>
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
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => setPopupBookingType('VSE')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${
                  popupBookingType === 'VSE' 
                    ? 'border-[#3F489A] bg-[#3F489A] text-white shadow-md' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-[#3F489A]/50'
                }`}
              >
                VietSure English
              </button>
              <button
                onClick={() => setPopupBookingType('OTHER')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${
                  popupBookingType === 'OTHER' 
                    ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-md' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-[#8B5CF6]/50'
                }`}
              >
                Trung tâm khác
              </button>
            </div>

            {popupBookingType === 'VSE' && (
              <div className="mt-2">
                <label className="text-sm font-bold text-[#2E357F] mb-2 block">
                  Mã lớp học <span className="text-red-500">*</span>
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
            )}
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
    </div>
  );
}