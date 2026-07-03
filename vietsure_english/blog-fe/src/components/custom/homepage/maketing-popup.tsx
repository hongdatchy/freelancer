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
            <DialogContent className="max-w-4xl w-[calc(100%-40px)] md:w-[calc(100%-64px)] p-0 overflow-y-auto max-h-[95vh] rounded-[32px] bg-[#badeff] brand-light-border shadow-2xl">
                <DialogTitle className="sr-only">Đăng ký học thử</DialogTitle>
                
                {/* 
                  Sử dụng CSS overrides để thu gọn chiều cao form bên trong Popup
                  giúp toàn bộ hiển thị vừa vặn trong 1 màn hình mà KHÔNG TÁC ĐỘNG đến code của TrialSection
                */}
                <div className="
                    [&_input]:!h-[40px] [&_input]:md:!h-[46px] 
                    [&_form]:!gap-2 [&_form]:md:!gap-3 
                    [&_form]:!p-4 [&_form]:md:!p-5 
                    [&_button[type=submit]]:!h-[42px] [&_button[type=submit]]:md:!h-[48px]
                    [&_img.select-none]:!w-[140px] [&_img.select-none]:!h-[140px] 
                    [&_img.select-none]:md:!w-[200px] [&_img.select-none]:md:!h-[200px]
                    [&_.min-h-\[380px\]]:!min-h-[140px] [&_.min-h-\[380px\]]:md:!min-h-[200px]
                    [&_.md\:pt-10]:md:!pt-6 [&_.md\:px-8]:md:!px-4
                    [&_h3]:!text-[15px] [&_h3]:md:!text-[18px] [&_h3]:lg:!text-[20px]
                ">
                    <TrialSection isPopup={true} onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}