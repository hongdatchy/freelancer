'use client';

import { useEffect, useState } from 'react';
import { getData } from '@/service/api';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TrialSection from '../common/traial-section';


export default function MarketingPopup() {
    const [open, setOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fetchPopup = async () => {
            try {
                const res = await getData(`api/popup`);
                console.log("res", res);
                
                const data = res.data;

                if (data?.isActive) {
                    setIsActive(true);
                    setTimeout(() => setOpen(true), data?.timeout * 1000 || 10000); // Mặc định 3 giây nếu không có timeout
                }
            } catch (error) {
                console.error('Lỗi khi lấy popup:', error);
            }
        };

        fetchPopup();
    }, []);

    if (!isActive) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 overflow-y-auto max-h-[90vh] rounded-[32px] bg-[#badeff] brand-light-border shadow-2xl">
                <DialogTitle className="sr-only">Đăng ký học thử</DialogTitle>
                <TrialSection isPopup={true} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}