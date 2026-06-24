/// <reference lib="dom" />
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    SingleSelect,
    SingleSelectOption,
    Loader,
    Toggle,
} from '@strapi/design-system';

// ---- Config ----
const START_HOUR = 7;
const END_HOUR = 21;
const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

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

// ---- Types ----
interface User {
    id: number;
    username: string;
    email: string;
}

interface ScheduleMap {
    [key: string]: {
        id: string;
        student_name?: string;
        isVietSureEnglish?: boolean;
    };
}

// ---- Helper ----
const getToken = (): string | null => {
    const match = document.cookie.split('; ').find(row => row.startsWith('jwtToken='));
    return match ? match.split('=')[1] : null;
};

const authHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});

// ---- Component ----
export default function SchedulePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [schedule, setSchedule] = useState<ScheduleMap>({});
    const [loading, setLoading] = useState(false);
    
    const [selectedSlot, setSelectedSlot] = useState<{day: string, slot: string} | null>(null);
    const [popupBookingType, setPopupBookingType] = useState<'VSE' | 'OTHER'>('VSE');
    const [popupClassCode, setPopupClassCode] = useState('');

    useEffect(() => {
        fetch('/content-manager/collection-types/plugin::users-permissions.user?page=1&pageSize=100&sort=id:ASC', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const result = data as { results: User[] };
                setUsers(Array.isArray(result.results) ? result.results : []);
            });
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        setLoading(true);
        fetch(
            `/content-manager/collection-types/api::teacher-schedule.teacher-schedule?pageSize=500&filters[users_permissions_user][id][$eq]=${selectedUser}`,
            { headers: authHeaders() }
        )
            .then(res => res.json())
            .then(data => {
                const result = data as { results: any[] };
                const map: ScheduleMap = {};

                result.results?.forEach((item: any) => {
                    const key = `${item.day}_${item.time_slot}`;
                    map[key] = {
                        id: item.documentId,
                        student_name: item.student_name || '',
                        isVietSureEnglish: item.isVietSureEnglish || false,
                    };
                });

                setSchedule(map);
                setLoading(false);
            });
    }, [selectedUser]);

    const handleCellClick = async (day: string, slot: string) => {
        const key = `${day}_${slot}`;

        if (schedule[key]) {
            await fetch(`/content-manager/collection-types/api::teacher-schedule.teacher-schedule/${schedule[key].id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            setSchedule(prev => {
                const s = { ...prev };
                delete s[key];
                return s;
            });
        } else {
            setSelectedSlot({ day, slot });
            setPopupBookingType('VSE');
            setPopupClassCode('');
        }
    };

    const confirmBooking = async () => {
        if (!selectedSlot) return;
        const { day, slot } = selectedSlot;
        const key = `${day}_${slot}`;
        
        const isVSE = popupBookingType === 'VSE';
        const studentName = isVSE ? popupClassCode : '';

        const res = await fetch('/content-manager/collection-types/api::teacher-schedule.teacher-schedule/actions/publish?', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                day,
                time_slot: slot,
                student_name: studentName,
                isVietSureEnglish: isVSE,
                users_permissions_user: {
                    connect: [{ id: Number(selectedUser), isTemporary: true }],
                    disconnect: [],
                },
                createdAt: null,
                updatedAt: null,
                createdBy: null,
                updatedBy: null,
            }),
        });
        const newItem = await res.json() as { data: { documentId: string } };

        setSchedule(prev => ({
            ...prev,
            [key]: { id: newItem.data.documentId, student_name: studentName, isVietSureEnglish: isVSE },
        }));
        
        setSelectedSlot(null);
    };

    const getUserLabel = (u: User) => u.username || u.email;

    return (
        <>
        <Box padding={8}>
            <Typography variant="alpha" style={{ marginBottom: 24, display: 'block', fontSize: '2rem' }}>
                Thời khoá biểu của giáo viên VietSure English !
            </Typography>

            <Box style={{ marginBottom: 24, maxWidth: 320 }}>
                <SingleSelect
                    placeholder="-- Choose Teacher --"
                    value={selectedUser}
                    onChange={(val: string) => setSelectedUser(val)}
                >
                    {users.map(u => (
                        <SingleSelectOption key={u.id} value={String(u.id)}>
                            {getUserLabel(u)}
                        </SingleSelectOption>
                    ))}
                </SingleSelect>
            </Box>

            {/* Removed Toggle */}

            {loading && <Loader>Đang tải lịch...</Loader>}

            {selectedUser && !loading && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{...thStyle, background: 'white', border: '1px solid #e0f2fe', color: '#3F489A', textAlign: 'left'}}>
                                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>ĐÃ CÓ LỊCH</div>
                                </th>
                                {DAYS.map(d => (
                                    <th key={d} style={thStyle}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_SLOTS.map(slot => (
                                <tr key={slot}>
                                    <td style={{ ...tdStyle, fontWeight: 700, background: 'white', color: '#3F489A', textAlign: 'left', paddingLeft: 12, border: '1px solid #e0f2fe' }}>
                                        {slot}
                                    </td>
                                    {DAYS.map(day => {
                                        const key = `${day}_${slot}`;
                                        const item = schedule[key];
                                        const active = !!item;
                                        const isVSE = item?.isVietSureEnglish;

                                        return (
                                            <td
                                                key={day}
                                                onClick={() => handleCellClick(day, slot)}
                                                style={{
                                                    ...tdStyle,
                                                    height: 42,
                                                    padding: 4,
                                                    background: active ? '#3F489A' : '#F5F7FC',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    userSelect: 'none',
                                                    transition: 'background 0.15s',
                                                    verticalAlign: 'middle',
                                                    border: '2px solid white', // creates spacing effect
                                                }}
                                            >
                                                {active ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                        width: '100%'
                                                    }}>
                                                        {isVSE ? (
                                                            <div style={{
                                                                width: '80%',
                                                                height: '75%',
                                                                boxSizing: 'border-box',
                                                                fontSize: 10,
                                                                padding: '2px 4px',
                                                                borderRadius: 3,
                                                                textAlign: 'center',
                                                                color: '#3F489A',
                                                                fontWeight: 'bold',
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {schedule[key].student_name || 'VSE'}
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                width: '80%',
                                                                height: '75%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: 10,
                                                                fontWeight: 'bold',
                                                                lineHeight: '1.2'
                                                            }}>Trung tâm<br/>khác</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#8E9AD5', fontWeight: 600, fontSize: 14 }}>x</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Box>

        {selectedSlot && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white', padding: 24, borderRadius: 8, width: 400,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#333' }}>
                        Đăng ký lịch trống
                    </div>
                    <div style={{ marginBottom: 24, textAlign: 'center', color: '#666' }}>
                        Lịch: {selectedSlot.slot} ({selectedSlot.day})
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        <button
                            onClick={() => setPopupBookingType('VSE')}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer',
                                border: popupBookingType === 'VSE' ? '2px solid #f50e40' : '2px solid #ddd',
                                background: popupBookingType === 'VSE' ? '#f50e40' : 'white',
                                color: popupBookingType === 'VSE' ? 'white' : '#666'
                            }}
                        >
                            VietSure English
                        </button>
                        <button
                            onClick={() => setPopupBookingType('OTHER')}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer',
                                border: popupBookingType === 'OTHER' ? '2px solid #e8d5f5' : '2px solid #ddd',
                                background: popupBookingType === 'OTHER' ? '#e8d5f5' : 'white',
                                color: popupBookingType === 'OTHER' ? '#666' : '#666'
                            }}
                        >
                            Trung tâm khác
                        </button>
                    </div>

                    {popupBookingType === 'VSE' && (
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 14, color: '#333' }}>
                                Mã lớp học <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={popupClassCode}
                                onChange={(e) => setPopupClassCode(e.target.value)}
                                placeholder="Nhập mã lớp..."
                                autoFocus
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd',
                                    fontSize: 14, boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 30 }}>
                        <button
                            onClick={() => setSelectedSlot(null)}
                            style={{
                                padding: '8px 16px', borderRadius: 6, border: 'none', background: '#f0f0f0',
                                cursor: 'pointer', fontWeight: 'bold', color: '#666'
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={confirmBooking}
                            style={{
                                padding: '8px 16px', borderRadius: 6, border: 'none', background: '#f50e40',
                                cursor: 'pointer', fontWeight: 'bold', color: 'white'
                            }}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

// ---- Styles ----
const thStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '2px solid white',
    background: '#3F489A',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    color: 'white',
    textAlign: 'center',
    borderRadius: 4,
};

const tdStyle: React.CSSProperties = {
    padding: '4px',
    width: 100,
    height: 42,
    color: '#333',
};