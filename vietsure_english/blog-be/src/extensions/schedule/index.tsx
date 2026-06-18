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
    const [isVietSureEnglish, setIsVietSureEnglish] = useState(true);

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

    const toggleSlot = async (day: string, slot: string) => {
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
            const studentName = '';

            const res = await fetch('/content-manager/collection-types/api::teacher-schedule.teacher-schedule/actions/publish?', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    day,
                    time_slot: slot,
                    student_name: studentName,
                    isVietSureEnglish,
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
                [key]: { id: newItem.data.documentId, student_name: studentName, isVietSureEnglish },
            }));
        }
    };

    const getUserLabel = (u: User) => u.username || u.email;

    return (
        <Box padding={8}>
            <Typography variant="alpha" style={{ marginBottom: 24, display: 'block', fontSize: '2rem' }}>
                Thời khoá biểu của giáo viên
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

            {/* Toggle isVietSureEnglish */}
            {/* <Box style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle
                    onLabel="VietSure English"
                    offLabel="Trung tâm khác"
                    checked={isVietSureEnglish}
                    onChange={(e: any) => setIsVietSureEnglish(e.target.checked)}
                />
            </Box> */}

            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div
                        onClick={() => setIsVietSureEnglish(!isVietSureEnglish)}
                        style={{
                            width: 120,
                            padding: '6px 12px',
                            borderRadius: 6,
                            background: isVietSureEnglish ? '#f50e40' : '#e8d5f5',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: 13,
                            textAlign: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'background 0.2s',
                        }}
                    >
                        {isVietSureEnglish ? 'VietSure English' : 'Trung tâm khác'}
                    </div>
                </label>
            </div>

            {loading && <Loader>Đang tải lịch...</Loader>}

            {selectedUser && !loading && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Giờ</th>
                                {DAYS.map(d => (
                                    <th key={d} style={thStyle}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_SLOTS.map(slot => (
                                <tr key={slot}>
                                    <td style={{ ...tdStyle, fontWeight: 600, background: '#ddf5e0' }}>
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
                                                onClick={() => toggleSlot(day, slot)}
                                                style={{
                                                    ...tdStyle,
                                                    background: active ? (isVSE ? '#f50e40' : '#e8d5f5') : '#bcecc3',
                                                    cursor: 'pointer',
                                                    color: active ? 'white' : '#999',
                                                    textAlign: 'center',
                                                    userSelect: 'none',
                                                    transition: 'background 0.15s',
                                                    verticalAlign: 'middle',
                                                }}
                                            >
                                                {active && (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                    }}>
                                                        <div>✓</div>
                                                        <div style={{ width: '100%' }}>
                                                            <input
                                                                name={`student_${day}_${slot}`}
                                                                value={schedule[key].student_name || ''}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => {
                                                                    const val = (e as any).target.value;
                                                                    setSchedule(prev => ({
                                                                        ...prev,
                                                                        [key]: { ...prev[key], student_name: val }
                                                                    }));
                                                                }}
                                                                onBlur={async () => {
                                                                    await fetch(
                                                                        `/content-manager/collection-types/api::teacher-schedule.teacher-schedule/${schedule[key].id}/actions/publish?`,
                                                                        {
                                                                            method: 'POST',
                                                                            headers: authHeaders(),
                                                                            body: JSON.stringify({
                                                                                day,
                                                                                time_slot: slot,
                                                                                student_name: schedule[key].student_name,
                                                                                isVietSureEnglish: schedule[key].isVietSureEnglish,
                                                                                users_permissions_user: {
                                                                                    connect: [],
                                                                                    disconnect: [],
                                                                                },
                                                                                createdAt: null,
                                                                                updatedAt: null,
                                                                                createdBy: null,
                                                                                updatedBy: null,
                                                                                documentId: schedule[key].id,
                                                                            }),
                                                                        }
                                                                    );
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    boxSizing: 'border-box',
                                                                    fontSize: 12,
                                                                    marginTop: 2,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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
    );
}

// ---- Styles ----
const thStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '1px solid #ddd',
    background: '#fcebf2',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    color: '#ee407d',
};

const tdStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid #e0e0e0',
    width: 200,
    height: 36,
    color: '#333',
};