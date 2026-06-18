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
import { usePathname, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icons } from '../../components/custom/common/icons';
import { getMenuItemsByTran, MenuItem } from './menu-items';

export function HeaderMenuMobile() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isActive = (item: MenuItem) => {
    const getBaseUrl = (url: string) => url.split('?')[0];
    const isMatching = (href: string) => pathname === getBaseUrl(href);
  
    return isMatching(item.href) || item.subItems.some(subItem => isMatching(subItem.href));
  };
  

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Drawer direction="left" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="block md:hidden" variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-[300px]">
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex justify-between items-center">
              <span>Menu</span>
              <DrawerClose asChild>{Icons.xClose()}</DrawerClose>
            </div>
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <NavigationMenu className="block md:hidden">
          <NavigationMenuList className="flex-col items-start space-x-0">
            {getMenuItemsByTran().map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.subItems.length == 0 && (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={handleCloseDrawer}>
                      <span className={cn('font-bold', isActive(item) ? 'text-[#27ba77]' : '')}>{item.title}</span>
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  );
}
