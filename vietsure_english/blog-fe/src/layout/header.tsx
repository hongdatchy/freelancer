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
        width={160}
        height={44}
        className="h-10 w-auto object-contain"
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
      <div className="mx-auto flex flex-col w-full max-w-none px-6 md:px-10 lg:px-12 py-4">
        {/* Row 1: Logo & Buttons */}
        <div className="flex w-full items-center justify-between">
          <Logo />

          {/* Buttons & Login (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <UserInfo />
            <BtnTrial />
          </div>

          {/* Menu Mobile (mobile only) */}
          {(!user || pathname !== '/') && (
            <div className="flex md:hidden items-center">
              <HeaderMenuMobile onChange={handleMenuChange} user={user} />
            </div>
          )}
        </div>

        {/* Row 2: Navigation Menu (desktop only) */}
        {(!user || pathname !== '/') && (
          <div className="hidden md:flex items-center justify-center w-full mt-3">
            <HeaderMenu onChange={handleMenuChange} user={user} />
          </div>
        )}
      </div>

      {pathname !== '/' && <BreadcrumbDynamic menuState={menuState} />}
    </header>
  );
}