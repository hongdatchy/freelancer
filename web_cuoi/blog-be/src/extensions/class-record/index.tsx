/// <reference lib="dom" />
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    SingleSelect,
    SingleSelectOption,
    Loader,
} from '@strapi/design-system';

// ---- Types ----
interface User {
    id: number;
    username: string;
    email: string;
}

interface RecordItem {
    filename: string;
    timestamp: string;
    date: string;
    time: string;
    size: number;
    url: string;
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

// ---- Table Styles ----
const thStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: '#3F489A',
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    border: '1px solid #e2e8f0',
    textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '13px',
    border: '1px solid #e2e8f0',
    color: '#334155',
};

export default function ClassRecordPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [classes, setClasses] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingRecords, setLoadingRecords] = useState(false);

    // Fetch teachers on load
    useEffect(() => {
        setLoadingUsers(true);
        fetch('/content-manager/collection-types/plugin::users-permissions.user?page=1&pageSize=100&sort=id:ASC', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const result = data as { results: User[] };
                setUsers(Array.isArray(result.results) ? result.results : []);
                setLoadingUsers(false);
            })
            .catch(() => setLoadingUsers(false));
    }, []);

    // Fetch class codes when teacher is selected
    useEffect(() => {
        if (!selectedUser) {
            setClasses([]);
            setSelectedClass('');
            setRecords([]);
            setPlayingVideo(null);
            return;
        }
        setLoadingClasses(true);
        setSelectedClass('');
        setSelectedDate('');
        setRecords([]);
        setPlayingVideo(null);
        
        fetch(`/api/class-records?teacherId=${selectedUser}`, { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                setClasses(data.classes || []);
                setLoadingClasses(false);
            })
            .catch(() => setLoadingClasses(false));
    }, [selectedUser]);

    // Fetch records when class code is selected (or date filter changes)
    useEffect(() => {
        if (!selectedUser || !selectedClass) {
            setRecords([]);
            setPlayingVideo(null);
            return;
        }
        setLoadingRecords(true);
        setPlayingVideo(null);
        
        let url = `/api/class-records?teacherId=${selectedUser}&classCode=${selectedClass}`;
        if (selectedDate) {
            url += `&date=${selectedDate}`;
        }

        fetch(url, { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                setRecords(data.records || []);
                setLoadingRecords(false);
            })
            .catch(() => setLoadingRecords(false));
    }, [selectedUser, selectedClass, selectedDate]);

    const getUserLabel = (u: User) => u.username || u.email;

    return (
        <Box padding={8}>
            <Typography variant="alpha" style={{ marginBottom: 24, display: 'block', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                Quản lý Record Lớp Học
            </Typography>

            {loadingUsers && <Loader>Đang tải danh sách giáo viên...</Loader>}

            {!loadingUsers && (
                <Box style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {/* Filter 1: Teacher */}
                    <Box style={{ minWidth: 240 }}>
                        <SingleSelect
                            placeholder="-- Chọn Giáo Viên --"
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

                    {/* Filter 2: Class Code (Visible only when teacher is selected) */}
                    {selectedUser && (
                        <Box style={{ minWidth: 240 }}>
                            {loadingClasses ? (
                                <Loader small>Đang tải mã lớp...</Loader>
                            ) : (
                                <SingleSelect
                                    placeholder="-- Chọn Mã Lớp --"
                                    value={selectedClass}
                                    onChange={(val: string) => setSelectedClass(val)}
                                >
                                    {classes.map(c => (
                                        <SingleSelectOption key={c} value={c}>
                                            {c}
                                        </SingleSelectOption>
                                    ))}
                                </SingleSelect>
                            )}
                        </Box>
                    )}

                    {/* Filter 3: Date Filter (Visible only when teacher & class are selected) */}
                    {selectedUser && selectedClass && (
                        <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Typography variant="delta" style={{ fontSize: 13, color: '#64748b' }}>Ngày học:</Typography>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #d1d5db',
                                    outline: 'none',
                                    fontSize: '13px',
                                    color: '#334155'
                                }}
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate('')}
                                    style={{
                                        border: 'none',
                                        background: '#ef4444',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Xoá lọc
                                </button>
                            )}
                        </Box>
                    )}
                </Box>
            )}

            {/* Video Player Section */}
            {playingVideo && (
                <Box style={{ marginBottom: 24, padding: 16, background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Typography variant="delta" style={{ fontWeight: 'bold', color: 'white' }}>Đang phát: {selectedClass}</Typography>
                        <button
                            onClick={() => setPlayingVideo(null)}
                            style={{
                                border: 'none',
                                background: '#ef4444',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        >
                            Đóng trình phát
                        </button>
                    </Box>
                    <video src={playingVideo} controls autoPlay style={{ width: '100%', maxHeight: '500px', borderRadius: 6, background: 'black' }} />
                </Box>
            )}

            {/* Records List Table */}
            {selectedUser && selectedClass && (
                <Box style={{ marginTop: 24 }}>
                    {loadingRecords ? (
                        <Loader>Đang tải danh sách bản ghi...</Loader>
                    ) : records.length === 0 ? (
                        <Typography style={{ color: '#64748b', fontSize: 14 }}>
                            Không tìm thấy bản ghi nào cho lớp học này.
                        </Typography>
                    ) : (
                        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <table style={{ borderCollapse: 'collapse', width: '100%', background: 'white' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>STT</th>
                                        <th style={thStyle}>Mã lớp</th>
                                        <th style={thStyle}>Ngày học</th>
                                        <th style={thStyle}>Giờ học</th>
                                        <th style={thStyle}>Dung lượng</th>
                                        <th style={thStyle}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((rec, index) => {
                                        const fileSizeMB = (rec.size / (1024 * 1024)).toFixed(2);
                                        return (
                                            <tr key={rec.filename} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={tdStyle}>{index + 1}</td>
                                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{selectedClass}</td>
                                                <td style={tdStyle}>{rec.date}</td>
                                                <td style={tdStyle}>{rec.time}</td>
                                                <td style={tdStyle}>{fileSizeMB} MB</td>
                                                <td style={tdStyle}>
                                                    <button
                                                        onClick={() => setPlayingVideo(rec.url)}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 6,
                                                            padding: '6px 12px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            background: '#FF6B00',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            fontSize: '12px',
                                                            boxShadow: '0 2px 4px rgba(255,107,0,0.2)'
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polygon points="5 3 19 12 5 21 5 3" />
                                                        </svg>
                                                        Xem Video
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Box>
            )}
        </Box>
    );
}
