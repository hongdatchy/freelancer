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
        class_code?: string;
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

    const [selectedSlot, setSelectedSlot] = useState<{ day: string, slot: string } | null>(null);
    const [selectedSlotForView, setSelectedSlotForView] = useState<{ day: string, slot: string } | null>(null);
    const [popupClassCode, setPopupClassCode] = useState('');
    const [editClassCode, setEditClassCode] = useState('');

    useEffect(() => {
        fetch('/content-manager/collection-types/plugin::users-permissions.user?page=1&pageSize=100&sort=id:ASC', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const result = data as { results: User[] };
                setUsers(Array.isArray(result.results) ? result.results : []);
            });
    }, []);

    useEffect(() => {
        if (!selectedUser) {
            setSchedule({});
            return;
        }

        setLoading(true);
        fetch(`/content-manager/collection-types/api::teacher-schedule.teacher-schedule?filters[users_permissions_user][id][$eq]=${selectedUser}&pagination[pageSize]=100`, {
            headers: authHeaders(),
        })
            .then(res => res.json())
            .then(data => {
                const result = data as { results: Array<{ id: number; documentId: string; day: string; time_slot: string; class_code: string }> };
                const map: ScheduleMap = {};

                (result.results || []).forEach(item => {
                    const key = `${item.day}_${item.time_slot}`;
                    map[key] = {
                        id: item.documentId,
                        class_code: item.class_code || '',
                    };
                });

                setSchedule(map);
                setLoading(false);
            });
    }, [selectedUser]);

    const handleCellClick = async (day: string, slot: string) => {
        const key = `${day}_${slot}`;

        if (schedule[key]) {
            setSelectedSlotForView({ day, slot });
            setEditClassCode(schedule[key].class_code || '');
        } else {
            setSelectedSlot({ day, slot });
            setPopupClassCode('');
        }
    };

    const deleteSchedule = async () => {
        if (!selectedSlotForView) return;
        const { day, slot } = selectedSlotForView;
        const key = `${day}_${slot}`;

        try {
            await fetch(`/content-manager/collection-types/api::teacher-schedule.teacher-schedule/${schedule[key].id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            setSchedule(prev => {
                const s = { ...prev };
                delete s[key];
                return s;
            });
        } catch (err) {
            console.error(err);
        }
        setSelectedSlotForView(null);
    };

    const updateClassCode = async () => {
        if (!selectedSlotForView) return;
        const { day, slot } = selectedSlotForView;
        const key = `${day}_${slot}`;

        try {
            await fetch(`/content-manager/collection-types/api::teacher-schedule.teacher-schedule/${schedule[key].id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({
                    day,
                    time_slot: slot,
                    class_code: editClassCode,
                    users_permissions_user: {
                        connect: [{ id: Number(selectedUser), isTemporary: true }],
                        disconnect: [],
                    },
                }),
            });

            setSchedule(prev => ({
                ...prev,
                [key]: { ...prev[key], class_code: editClassCode },
            }));
            setSelectedSlotForView(null);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmBooking = async () => {
        if (!selectedSlot) return;
        const { day, slot } = selectedSlot;
        const key = `${day}_${slot}`;

        const studentName = popupClassCode;

        const res = await fetch('/content-manager/collection-types/api::teacher-schedule.teacher-schedule/actions/publish?', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                day,
                time_slot: slot,
                class_code: studentName,
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
            [key]: { id: newItem.data.documentId, class_code: studentName },
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
                                    <th style={{ ...thStyle, background: 'white', border: '1px solid #e0f2fe', color: '#3F489A', textAlign: 'left' }}>
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

                                            return (
                                                <td
                                                    key={day}
                                                    onClick={() => handleCellClick(day, slot)}
                                                    style={{
                                                        ...tdStyle,
                                                        height: 42,
                                                        padding: 4,
                                                        background: active ? '#3F489A' : '#FEE2E2',
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
                                                            {schedule[key].class_code ? (
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
                                                                    {schedule[key].class_code}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#EF4444', fontWeight: 600, fontSize: 14 }}>x</span>
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

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 14, color: '#333' }}>
                                Mã lớp học
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
                                    padding: '8px 16px', borderRadius: 6, border: 'none', background: '#FF6B00',
                                    cursor: 'pointer', fontWeight: 'bold', color: 'white'
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedSlotForView && (
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
                            Lịch đã đặt
                        </div>
                        <div style={{ marginBottom: 24, textAlign: 'center', color: '#666' }}>
                            {(() => {
                                const key = `${selectedSlotForView.day}_${selectedSlotForView.slot}`;
                                const item = schedule[key];
                                return (
                                    <span>
                                        {selectedSlotForView.slot} ({selectedSlotForView.day})
                                        {item?.class_code ? ` — ${item.class_code}` : ''}
                                    </span>
                                );
                            })()}
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 14, color: '#333' }}>
                                Cập nhật mã lớp học
                            </label>
                            <input
                                type="text"
                                value={editClassCode}
                                onChange={(e) => setEditClassCode(e.target.value)}
                                placeholder="Nhập mã lớp..."
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd',
                                    fontSize: 14, boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button
                                onClick={updateClassCode}
                                style={{
                                    padding: '10px', borderRadius: 6, border: 'none', background: '#FF6B00',
                                    cursor: 'pointer', fontWeight: 'bold', color: 'white'
                                }}
                            >
                                Cập nhật mã lớp
                            </button>

                            <button
                                onClick={deleteSchedule}
                                style={{
                                    padding: '12px', borderRadius: 6, border: '2px solid #fecaca', background: '#fef2f2',
                                    cursor: 'pointer', fontWeight: 'bold', color: '#dc2626', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                </svg>
                                Xóa lịch học
                            </button>

                            <button
                                onClick={() => setSelectedSlotForView(null)}
                                style={{
                                    padding: '10px', borderRadius: 6, border: 'none', background: '#f0f0f0',
                                    cursor: 'pointer', fontWeight: 'bold', color: '#666'
                                }}
                            >
                                Đóng
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