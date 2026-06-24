'use client';

import Image from 'next/image';
import { Phone } from 'lucide-react';
import { Icons } from '@/components/custom/common/icons';

export default function FloatingContact() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center">
      {/* Mascot Image Peeking Out */}
      <div className="relative w-[72px] h-[72px] -mb-3 z-10 -translate-x-1">
        <Image
          src="/images/kieu-hanh-man-nguyen.png"
          alt="Vietsure Mascot"
          fill
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-5 px-3 flex flex-col items-center gap-6 relative z-0">
        
        {/* Zalo */}
        <a
          href="https://zalo.me/0357171381"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center group transition-transform hover:-translate-y-1"
        >
          <img
            src="/images/icons8-zalo-480.png"
            alt="Zalo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
        </a>

        {/* Hotline */}
        <a
          href="tel:0357171381"
          className="flex flex-col items-center group transition-transform hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center bg-white group-hover:bg-green-50 transition-colors shadow-sm">
            <Phone className="w-5 h-5 text-green-500" />
          </div>
        </a>

      </div>
    </div>
  );
}
