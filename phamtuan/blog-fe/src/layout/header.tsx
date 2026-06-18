'use client';

import { useEffect, useState } from 'react';
import { HeaderMenu } from '@/layout/header/header-menu';
import { Instagram, Twitter, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderMenuMobile } from './header/header-menu-mobile';
import UserInfo from '@/components/custom/common/user-info';
import { getData } from '@/service/api';

export default function Header() {
  const pathname = usePathname();

  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await getData(`api/slideshows?sort=order:asc&populate=image`);
        const urls = res.data.map((item: any) => {
          const url = item.image?.url; // <-- vì image không nằm trong attributes
          return process.env.NEXT_PUBLIC_BE_HOST + url;
        });
        setSlides(urls);
      } catch (error) {
        console.error('Lỗi khi load slides:', error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides, currentIndex]);

  if (pathname !== '/') {
    return (
      <div className="w-full h-[100px] bg-white flex justify-center items-center shadow-md">
        <HeaderMenuMobile />
        <HeaderMenu />
        <UserInfo />
      </div>
    );
  }

  return (
    <>
      <div className="md:h-[80vh] w-full flex-col-reverse flex flex-col md:flex-row relative overflow-hidden">
        {/* Left side */}
        <div className="md:w-[20%] w-full flex flex-col justify-between items-center p-4 bg-white z-10">
          <div className="mt-8 text-center md:[writing-mode:vertical-rl] md:rotate-180">
            <h2 className="font-bold text-lg">DỊCH VỤ MẠNG XÃ HỘI PHẠM TUẤN</h2>
            <p className="text-sm mt-2 break-words text-gray-700">
              <b className="text-[rgb(186,39,39)] text-[20px]">HƠN 10 NĂM &nbsp;</b>trong xây dựng kiến thức nền tảng số, để có được những kết quả
              và phát triển như hiện tại, mình đã không ngừng học hỏi và tích luỹ nhiều năm kinh nghiệm
              trong việc kinh doanh và hỗ trợ dịch vụ mạng xã hội như tăng tương tác
              các nền tảng Facebook, TikTok, Instagram...
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <Instagram size={20} />
            <Twitter size={20} />
            <Facebook size={20} />
            <Linkedin size={20} />
          </div>
        </div>

        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Previous (fade out) */}
          {prevIndex !== null && slides[prevIndex] && (
            <div
              key={prevIndex}
              className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-[2000ms] opacity-0 scale-105"
              style={{
                backgroundImage: `url(${slides[prevIndex]})`,
              }}
            />
          )}
          {/* Current (fade in + zoom) */}
          {slides[currentIndex] && (
            <div
              key={currentIndex}
              className="absolute inset-0 bg-cover bg-center z-0 animate-zoom-in"
              style={{
                backgroundImage: `url(${slides[currentIndex]})`,
              }}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-40 z-[1]" />
        </div>

        {/* Right content */}
        <div className="w-full md:w-[80%] h-[80vh] relative z-10 flex flex-col pt-6">
          <div className="flex justify-center">
            <HeaderMenuMobile />
            <HeaderMenu />
            <UserInfo />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div
                className="text-[#FFD700] text-[60px] font-bold drop-shadow-md text-center"
                style={{
                  fontFamily: `'Pacifico', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                }}
              >
                Nâng Tầm Kiến Thức Cùng Chúng Tôi
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Link href="/search-post" className="hero-button">
                Khám Phá Khóa Học Ngay <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        .animate-zoom-in {
          animation: zoomIn 8s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
