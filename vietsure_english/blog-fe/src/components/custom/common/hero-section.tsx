'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import BrandStats from './brand-stats';

type HeroSectionProps = {
  buttonText?: string;
  buttonHref?: string;
  showButton?: boolean;
};

// Các cụm chữ luân phiên hiển thị thay cho "CHẤT LƯỢNG CAO"
const ROTATING_TITLES = ['CHẤT LƯỢNG CAO', 'TỰ TIN GIAO TIẾP', 'HIỆU QUẢ VƯỢT TRỘI', 'HỌC 1-1 VÀ 1-4'];

export default function HeroSection({
  buttonText = 'TÌM HIỂU THÊM',
  buttonHref = '#trial-section',
  showButton = true,
}: HeroSectionProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // State để luân phiên chữ "CHẤT LƯỢNG CAO" / "TỰ TIN GIAO TIẾP" / "HIỆU QUẢ VƯỢT TRỘI"
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col pt-4 md:pt-8 pb-16 overflow-hidden bg-gradient-to-b from-white to-[#F0F7FF] w-full">
      {/* Custom background shapes to mimic the organic curves in the reference */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_top_right,rgba(254,243,199,0.4)_0%,transparent_70%)] z-0 pointer-events-none"></div>
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[50%] h-[60%] bg-[radial-gradient(circle_at_bottom_right,rgba(239,246,255,0.6)_0%,transparent_70%)] z-0 pointer-events-none"></div>

      <div className="w-full relative z-10 flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 w-full">
          
          {/* LeftContent - Visuals */}
          <div className="w-full lg:w-[45%] flex justify-start -ml-3 md:-ml-5 lg:-ml-6" data-purpose="hero-image-container">
            <div 
              className="relative w-full shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-r-[40px] overflow-hidden"
              style={{ aspectRatio: "800/540" }}
            >
              {/* Main Hero Image */}
              <Image 
                alt="VietSure English Online Class - Teacher and students with penguin mascot" 
                className="w-full h-full object-cover" 
                data-purpose="primary-hero-image" 
                src="/images/Rectangle.png"
                width={800}
                height={600}
                priority
              />
            </div>
          </div>

          {/* RightContent - Typography and CTA */}
          <div className="w-full lg:w-[51%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6 px-6 lg:px-0">
            <div className="space-y-2 md:space-y-4" data-purpose="heading-group">
              <h2 className="text-xs sm:text-xs md:text-lg lg:text-2xl xl:text-4xl font-black text-[#3F489A] tracking-wide uppercase">
                TIẾNG ANH PHẢN XẠ ONLINE QUỐC TẾ
              </h2>
              <h1
                key={titleIndex}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase fade-in-text"
                style={{
                  lineHeight: 1.25,
                  paddingBottom: '0.15em',
                  paddingTop: '0.05em',
                  display: 'inline-block',
                  backgroundImage:
                    'linear-gradient(90deg, #ff6b00 0%, #ff6b00 35%, #ffd9b3 50%, #ff6b00 65%, #ff6b00 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {ROTATING_TITLES[titleIndex]}
              </h1>
              <p className="text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-4xl font-black text-[#3F489A] opacity-90 uppercase">
                CHO TRẺ 4 - 12+ TẠI VIỆT NAM
              </p>
            </div>
            
            {/* Call to Action Button */}
            <div className="pt-4 lg:pt-8" data-purpose="cta-container">
              {showButton && (
                <a 
                  className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg uppercase" 
                  href={buttonHref} 
                  role="button"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Reusable Statistics Bar */}
        <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-0">
          <BrandStats />
        </div>
      </div>

      {/* Decorative Mascot Faded Background */}
      <div aria-hidden="true" className="absolute right-[-5%] bottom-[-5%] w-1/3 opacity-15 pointer-events-none hidden lg:block">
        <Image 
          alt="" 
          className="w-full h-auto" 
          src="/images/hao-hung-san-sang.png"
          width={400}
          height={300}
        />
      </div>

      {/* Keyframes cho hiệu ứng shimmer + fade-in. Dùng <style> thường (không phải style jsx)
          để không phụ thuộc vào styled-jsx compiler — chắc chắn hoạt động ở mọi setup Next.js */}
      <style>{`
        @keyframes shimmer-sweep {
          0% {
            background-position: -150% 50%;
          }
          100% {
            background-position: 150% 50%;
          }
        }

        .fade-in-text {
          animation-name: fade-in, shimmer-sweep;
          animation-duration: 0.6s, 4.5s;
          animation-timing-function: ease-out, linear;
          animation-iteration-count: 1, infinite;
          animation-fill-mode: forwards, none;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}