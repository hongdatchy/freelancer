'use client';

import { getData, postData, putData } from '@/service/api';
import useUserLoginStore from '@/state-manager/user-login-store';
import { useEffect, useState } from 'react';

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
  { dayKey: 'Thứ 3', labelDay: 'TUE', labelDate: '2' },
  { dayKey: 'Thứ 4', labelDay: 'WED', labelDate: '3' },
  { dayKey: 'Thứ 5', labelDay: 'THU', labelDate: '4' },
  { dayKey: 'Thứ 6', labelDay: 'FRI', labelDate: '5' },
  { dayKey: 'Thứ 7', labelDay: 'SAT', labelDate: '6' },
  { dayKey: 'CN',    labelDay: 'SUN', labelDate: '7' },
  { dayKey: 'Thứ 2', labelDay: 'MON', labelDate: '8' },
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
  const [isVietSureEnglish, setIsVietSureEnglish] = useState(true);

  const canEdit = !!user;

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

  const toggleSlot = async (day: string, slot: string) => {
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
      const res = await postData(`api/teacher-schedules`, {
        data: {
          day,
          time_slot: slot,
          student_name: '',
          isVietSureEnglish,
          users_permissions_user: resolvedTeacherId,
        },
      });

      const newItem = res?.data;
      setScheduleMap(prev => ({
        ...prev,
        [key]: {
          id: newItem.documentId || String(newItem.id),
          day,
          time_slot: slot,
          student_name: '',
          isVietSureEnglish,
        },
      }));
    }
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
      
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-black text-[#2E357F] uppercase tracking-wider text-center mb-10">
        AVAILABILITY TIME
      </h2>

      {/* Toggle - chỉ hiện khi có thể edit */}
      {canEdit && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setIsVietSureEnglish(!isVietSureEnglish)}
            className={`px-4 py-2 rounded-lg text-white font-bold text-sm tracking-wide shadow-md transition-all ${
              isVietSureEnglish ? 'bg-[#FF6B00] hover:bg-orange-600' : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {isVietSureEnglish ? 'VietSure English' : 'Trung tâm khác'}
          </button>
        </div>
      )}

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
                  const active = !!item;
                  const isVSE = item?.isVietSureEnglish;

                  return (
                    <td
                      key={dayInfo.dayKey}
                      onClick={() => toggleSlot(dayInfo.dayKey, slot)}
                      className={`h-[38px] align-middle text-center rounded transition-all select-none duration-150 p-0.5 ${
                        canEdit ? 'cursor-pointer' : 'cursor-default'
                      } ${
                        active 
                          ? 'bg-[#3F489A]' 
                          : 'bg-[#F5F7FC]'
                      }`}
                    >
                      {active ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          {/* Inner white text/block */}
                          <div className="w-full h-full bg-[#3F489A] rounded-[2px] flex items-center justify-center">
                            {canEdit && (
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
                                placeholder="Tên học viên"
                                className="w-full text-center text-[9px] bg-white/95 text-slate-800 rounded px-1 py-0.5 border-none focus:ring-1 focus:ring-[#FF6B00]"
                              />
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
    </div>
  );
}