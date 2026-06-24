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
            <div className="flex items-center space-x-4 text-gray-500">
              <a href="#" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                <Icons.facebook className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors">
                <Icons.youtube className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                <Icons.zalo className="w-5 h-5" />
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