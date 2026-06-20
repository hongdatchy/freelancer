'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useBreadcrumb } from '@/context/useBreadcrumb';
import Script from 'next/script';

export default function Footer() {
  const { setMenuState } = useBreadcrumb();

  const handleFooterLinkClick = (label: string, href: string) => {
    if (href === '/') {
      setMenuState(null);
    } else {
      setMenuState({
        itemTitle: label,
        itemHref: href,
        level: 'item'
      });
    }
  };

  const aboutLinks = [
    { href: '/about', label: 'Giới thiệu' },
    { href: '/course', label: 'Khóa học' },
    { href: '/search-post', label: 'Tin tức' },
    { href: '/contact', label: 'Liên hệ' },
    { href: '/brand-ambassador', label: 'Chương trình CTV thương hiệu' },
  ];

  const supportLinks = [
    { href: '/faq', label: 'Câu hỏi thường gặp' },
    { href: '/privacy-policy', label: 'Chính sách bảo mật' },
    { href: '/terms-of-service', label: 'Điều khoản sử dụng' },
  ];

  return (
    <footer className="bg-[#1d285c] text-white pt-12 pb-6">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Header Text */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-wider text-white">
            HỆ THỐNG GIÁO DỤC ONLINE <span className="text-[#ff791a]">CHẤT LƯỢNG CAO</span> CHO TRẺ EM TRONG VÀ NGOÀI NƯỚC
          </h2>
          <div className="w-[70%] mx-auto h-[2px] bg-white/50 mt-6"></div>
        </div>

        {/* Logo row below horizontal line, left-aligned */}
        <div className="flex justify-start mb-4 mt-8">
          <Link href="/" onClick={() => handleFooterLinkClick('Home', '/')}>
            <Image
              src="/images/Vietsure English_Logo-15.png"
              alt="Vietsure English"
              width={180}
              height={56}
              className="h-auto w-[170px]"
            />
          </Link>
        </div>

        {/* Grid content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.1fr_0.8fr] lg:gap-12 mt-10">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              THÔNG TIN LIÊN HỆ
            </h3>

            <div className="space-y-4 text-xs text-white/80 leading-relaxed">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-white/90">Hotline: 0357171381</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-white/90">Email: vietsureenglish@gmail.com</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-extrabold text-white uppercase text-[11px] mb-1">
                    CÔNG TY TNHH VIETSURE EDUCATION
                  </p>
                  <p className="leading-relaxed">
                    Trụ sở: A12, Khu nhà ở Hoàng Hùng 5, đường Nguyễn Thị Khắp, khu phố Chiêu Liêu, Phường Tân Đông Hiệp, TP. HCM
                  </p>
                  <p className="mt-2 text-white/60 text-[10px]">
                    Giấy phép ĐKKD số 0319055324 do Sở Tài Chính TP.HCM cấp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-white">
              VỀ CHÚNG TÔI
            </h3>
            <div className="flex flex-col gap-3.5 text-xs text-white/80">
              {aboutLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleFooterLinkClick(item.label, item.href)}
                  className="transition-colors hover:text-sky-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-white">
                HỖ TRỢ KHÁCH HÀNG
              </h3>
              <div className="flex flex-col gap-3.5 text-xs text-white/80 mb-6">
                {supportLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleFooterLinkClick(item.label, item.href)}
                    className="transition-colors hover:text-sky-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Channels & Badges */}
            <div className="space-y-5">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* Tiktok */}
                <Link
                  target="_blank"
                  href="https://www.tiktok.com"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-sky-500 transition-all text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.81-2.4 7.61-6.57 8.01-3.64.35-7.34-1.92-8.2-5.51-.97-4.06 1.34-8.8 5.54-9.52.56-.09 1.13-.12 1.7-.12.11 1.37-.04 2.72-.04 4.09-.4-.02-.8-.01-1.2.07-1.74.36-3.03 2.01-2.73 3.79.35 2.1 2.65 3.32 4.54 2.37 1.25-.63 1.84-2 1.83-3.39V.02z" />
                  </svg>
                </Link>
                
                {/* Youtube */}
                <Link
                  target="_blank"
                  href="https://www.youtube.com/@vietsure"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition-all text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107C0 8.051 0 12 0 12s0 3.949.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.949 24 12 24 12s0-3.949-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>

                {/* Facebook */}
                <Link
                  target="_blank"
                  href="https://www.facebook.com/vietsureenglish"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-blue-600 transition-all text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              </div>

              {/* DMCA / Ministry of Industry */}
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo-da-dang-ky-bo-cong-thuong-mau-do.jpg"
                  alt="Đã đăng ký Bộ Công Thương"
                  width={90}
                  height={34}
                  className="h-[34px] w-auto rounded"
                />

                <a
                  href="//www.dmca.com/Protection/Status.aspx?ID=e685908c-9b2d-4137-a267-1c1636e19ab9"
                  title="DMCA.com Protection Status"
                  className="dmca-badge inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.dmca.com/Badges/dmca_protected_sml_120j.png?ID=e685908c-9b2d-4137-a267-1c1636e19ab9"
                    alt="DMCA.com Protection Status"
                    className="h-[34px] w-auto rounded"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Cột 4: Hệ sinh thái */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              HỆ SINH THÁI
            </h3>
            
            <div className="flex items-center justify-start max-w-[150px]">
              <Image
                src="/images/Viet Sure.png"
                alt="Viet Sure"
                width={140}
                height={36}
                className="h-auto w-[100px] object-contain"
              />
            </div>
            
            <p className="text-xs text-white/70 leading-relaxed max-w-[200px]">
              Tiếng Việt online cho trẻ nước ngoài
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4 mt-12">
          <p>Copyright © 2026 Vietsure Education | All Rights Reserved</p>
        </div>

      </div>
      <Script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js" strategy="lazyOnload" />
    </footer>
  );
}