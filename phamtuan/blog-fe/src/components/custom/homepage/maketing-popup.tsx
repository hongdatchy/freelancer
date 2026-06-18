'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getData } from '@/service/api';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';


export default function MarketingPopup() {
    const [open, setOpen] = useState(false);
    const [popup, setPopup] = useState<{
        title: string;
        description: string;
        buttonLabel: string;
    } | null>(null);

    useEffect(() => {
        const fetchPopup = async () => {
            try {
                const res = await getData(`api/popup`);
                const data = res.data;

                if (data?.isActive) {
                    setPopup({
                        title: data.title,
                        description: data.description,
                        buttonLabel: data.buttonLabel,
                    });
                    setOpen(true);
                }
            } catch (error) {
                console.error('Lỗi khi lấy popup:', error);
            }
        };

        fetchPopup();
    }, []);

    if (!popup) return null;

return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-center p-6">
      <DialogTitle asChild>
        <h2 className="text-2xl font-bold mb-4">{popup.title}</h2>
      </DialogTitle>
      <p className="mb-6">{popup.description}</p>
      <Link href="/service">
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base px-6 py-2 rounded-full">
          {popup.buttonLabel}
        </Button>
      </Link>
    </DialogContent>
  </Dialog>
);

}
