'use client';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { getMenuItemsByTran, MenuItem } from './menu-items';


export function HeaderMenu() {
  const pathname = usePathname();

  const isActive = (item: MenuItem) => {
    const getBaseUrl = (url: string) => url.split('?')[0];
    const isMatching = (href: string) => pathname === getBaseUrl(href);
  
    return isMatching(item.href) || item.subItems.some(subItem => isMatching(subItem.href));
  };
  
  
  return (
    <>
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {getMenuItemsByTran().map((item) => (
            <NavigationMenuItem key={item.title}>
              {item.subItems.length == 0 && (
                <>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '!bg-transparent')}>
                      <span className="font-bold">
                        <span className={cn('font-bold italic lg:text-[21px] text-[16px]', isActive(item) ? 'text-[rgb(221,198,14)]' : 'text-[rgb(108,200,229)]')}>{item.title}</span>
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
