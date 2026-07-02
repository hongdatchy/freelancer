'use client';

import Image from 'next/image';
import { Phone } from 'lucide-react';
import BtnTrial from '@/components/custom/common/btn-trial';
import { usePathname } from 'next/navigation';

export default function FloatingContact() {
  const pathname = usePathname();

  // Hide on classroom pages to prevent blocking the whiteboard and UI
  if (pathname?.includes('/classroom')) {
    return null;
  }

  return (
    <>
      {/* Mobile View: Sticky Bottom Bar (Only shows on Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] md:hidden bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-3 px-4 flex items-center justify-between gap-3">
        {/* Left: Wide Trial CTA button */}
        <div className="flex-1">
          <BtnTrial
            triggerPopup={true}
            className="w-full h-12 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-full font-bold text-sm tracking-wide shadow-sm flex items-center justify-center border-none"
          >
            Học thử miễn phí
          </BtnTrial>
        </div>

        {/* Right: Hotline circular button */}
        <a
          href="tel:0357171381"
          className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center bg-white shadow-sm shrink-0"
        >
          <Phone className="w-5 h-5 text-green-500" />
        </a>

        {/* Right: Zalo circular button */}
        <a
          href="https://zalo.me/0357171381"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center shrink-0 transition-transform hover:-translate-y-1"
        >
          <img
            src="/images/icons8-zalo-480.png"
            alt="Zalo"
            className="w-11 h-11 object-contain drop-shadow-sm"
          />
        </a>
      </div>

      {/* Desktop View: Side floating contact widget (Hidden on Mobile) */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex-col items-center">
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
    </>
  );
}
