'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Icons } from '../../components/custom/common/icons';
import { getMenuItemsByTran, MenuItem } from './menu-items';
import { User } from '@/state-manager/user-login-store';
import UserInfo from '@/components/custom/common/user-info';

type Props = {
  onChange?: (data: {
    itemTitle: string;
    itemHref: string;
    subItemTitle?: string;
    subItemHref?: string;
    level: 'item' | 'subItem';
  }) => void;
  user: User | null;
};

export function HeaderMenuMobile({ onChange, user }: Props) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const isActive = (item: MenuItem) => {
    const getBaseUrl = (url: string) => url.split('?')[0];
    const isMatching = (href: string) => pathname === getBaseUrl(href);
    return (
      isMatching(item.href) ||
      item.subItems.some((subItem) => isMatching(subItem.href))
    );
  };

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleItemClick = (item: MenuItem) => {
    onChange?.({ itemTitle: item.title, itemHref: item.href, level: 'item' });
  };

  const handleSubItemClick = (item: MenuItem, subItem: any) => {
    onChange?.({
      itemTitle: item.title,
      itemHref: item.href,
      subItemTitle: subItem.title,
      subItemHref: subItem.href,
      level: 'subItem',
    });
  };

  return (
    <Drawer direction="left" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="block lg:hidden text-[#2E357F] hover:bg-[#3F489A]/5 rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mt-0 rounded-none h-full max-w-[280px] bg-white border-r border-slate-100 flex flex-col justify-between">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Menu điều hướng</DrawerTitle>
          <DrawerDescription>Menu điều hướng trên thiết bị di động</DrawerDescription>
        </DrawerHeader>
        <div>
          {/* Drawer Top Header with Logo and Close Button */}
          <div className="flex justify-between items-center px-5 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center">
              <Image
                src="/images/Vietsure English_Logo-15.png"
                alt="Vietsure English Logo"
                width={120}
                height={33}
                className="h-8 w-auto object-contain"
              />
            </div>
            <DrawerClose asChild>
              <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                {Icons.xClose()}
              </button>
            </DrawerClose>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 flex flex-col gap-1.5">
            {getMenuItemsByTran(user).map((item) => (
              <div key={item.title} className="w-full">
                {item.subItems.length > 0 ? (
                  /* Item có subItems → dùng Accordion styled */
                  <Accordion type="single" collapsible className="w-full border-none">
                    <AccordionItem value={item.title} className="border-none">
                      <div className={cn(
                        "flex items-center justify-between w-full rounded-2xl transition-all duration-200",
                        isActive(item) ? "bg-[#3F489A]/8 text-[#3F489A]" : "text-slate-700 hover:bg-slate-50"
                      )}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            handleItemClick(item);
                            handleCloseDrawer();
                          }}
                          className="flex-1 py-3 px-4 font-extrabold text-[15.5px]"
                        >
                          {item.title}
                        </Link>
                        <AccordionTrigger className="py-3 pr-4 hover:no-underline [&>svg]:shrink-0" />
                      </div>
                      <AccordionContent className="pb-0 pt-1">
                        <ul className="flex flex-col gap-1 pl-4 border-l-2 border-[#3F489A]/10 ml-4 mt-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.href}
                                onClick={() => {
                                  handleSubItemClick(item, subItem);
                                  handleCloseDrawer();
                                }}
                                className="block rounded-xl py-2 px-3 text-[14px] font-bold text-slate-600 hover:text-[#3F489A] hover:bg-slate-50/80 transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  /* Item không có subItems → Link styled */
                  <Link
                    href={item.href}
                    onClick={() => {
                      handleItemClick(item);
                      handleCloseDrawer();
                    }}
                    className={cn(
                      "flex items-center w-full py-3 px-4 rounded-2xl text-[15.5px] font-extrabold transition-all duration-200",
                      isActive(item) ? "bg-[#3F489A]/8 text-[#3F489A]" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Bottom Info */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3F489A]/10 text-[#3F489A]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 9.24v7.68z"/></svg>
              </span>
              <span className="font-bold">Hotline: 0357171381</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/10 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.81-2.4 7.61-6.57 8.01-3.64.35-7.34-1.92-8.2-5.51-.97-4.06 1.34-8.8 5.54-9.52.56-.09 1.13-.12 1.7-.12.11 1.37-.04 2.72-.04 4.09-.4-.02-.8-.01-1.2.07-1.74.36-3.03 2.01-2.73 3.79.35 2.1 2.65 3.32 4.54 2.37 1.25-.63 1.84-2 1.83-3.39V.02z"/></svg>
              </a>
              <a href="https://www.facebook.com/vietsureenglish" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3F489A]/10 text-[#3F489A] hover:bg-[#3F489A] hover:text-white transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/@vietsure" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107C0 8.051 0 12 0 12s0 3.949.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.949 24 12 24 12s0-3.949-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://zalo.me/0357171381" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full transition-colors">
                <img src="/images/icons8-zalo-480.png" alt="Zalo" className="w-5 h-5 object-contain" />
              </a>
            </div>
            
            <div className="mt-1">
              <UserInfo />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">© 2026 Vietsure Education</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}