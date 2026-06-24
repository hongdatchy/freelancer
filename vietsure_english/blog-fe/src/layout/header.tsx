'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HeaderMenu } from '@/layout/header/header-menu';
import { HeaderMenuMobile } from './header/header-menu-mobile';
import UserInfo from '@/components/custom/common/user-info';
import { BreadcrumbDynamic } from '@/components/custom/common/breadcrumb-dynamic';
import useUserLoginStore from '@/state-manager/user-login-store';
import BtnTrial from '@/components/custom/common/btn-trial';
import { useBreadcrumb, MenuState } from '@/context/useBreadcrumb';

import { Icons } from '@/components/custom/common/icons';

export default function Header() {
  const pathname = usePathname();
  const { user } = useUserLoginStore();

  const { menuState, setMenuState } = useBreadcrumb();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleMenuChange = (data: MenuState) => {
    setMenuState(data);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const Logo = () => (
    <Link href="/" className="shrink-0 flex items-center">
      <Image
        src="/images/Vietsure English_Logo-15.png"
        alt="VietSure English Logo"
        width={200}
        height={60}
        className="h-14 md:h-16 w-auto object-contain"
        priority
      />
    </Link>
  );

  return (
    <header
      className={`w-full bg-white border-b border-gray-100 transition-all duration-300 z-50 sticky top-0 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] px-6 md:px-10 lg:px-12 py-3 items-center justify-between">
        
        {/* Left: Logo */}
        <Logo />

        {/* Right: Actions & Menu */}
        <div className="flex flex-col items-end gap-3">
          
          {/* Top Row: Social + Login + CTA */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/vietsureenglish" target="_blank" rel="noreferrer" className="text-blue-600 hover:opacity-80 transition-opacity">
                <Icons.facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@vietsure" target="_blank" rel="noreferrer" className="text-red-600 hover:opacity-80 transition-opacity">
                <Icons.youtube className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="text-black hover:opacity-80 transition-opacity">
                <Icons.tiktok className="w-5 h-5" />
              </a>
              <a href="https://zalo.me/0357171381" target="_blank" rel="noreferrer" className="text-[#0068FF] hover:opacity-80 transition-opacity flex items-center">
                <img src="/images/icons8-zalo-480.png" alt="Zalo" className="w-5 h-5 object-contain" />
              </a>
            </div>

            {/* Login & CTA */}
            <div className="flex items-center space-x-4">
              <UserInfo />
              <BtnTrial />
            </div>
          </div>

          {/* Menu Mobile (mobile only) */}
          {(!user || pathname !== '/') && (
            <div className="flex md:hidden items-center">
              <HeaderMenuMobile onChange={handleMenuChange} user={user} />
            </div>
          )}

          {/* Bottom Row: Navigation Menu (desktop only) */}
          {(!user || pathname !== '/') && (
            <div className="hidden md:flex items-center justify-end w-full">
              <HeaderMenu onChange={handleMenuChange} user={user} />
            </div>
          )}

        </div>
      </div>

      {pathname !== '/' && <BreadcrumbDynamic menuState={menuState} />}
    </header>
  );
}