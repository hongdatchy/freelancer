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
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Icons } from '../../components/custom/common/icons';
import { getMenuItemsByTran, MenuItem } from './menu-items';
import { User } from '@/state-manager/user-login-store';

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
        <Button className="block lg:hidden text-black hover:text-black" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        <div className="px-2 py-2">
          <Accordion type="single" collapsible className="w-full">
            {getMenuItemsByTran(user).map((item) => (
              item.subItems.length > 0 ? (

                /* Item có subItems → dùng Accordion */
                <AccordionItem key={item.title} value={item.title} className="border-b-0">
                  <div className="flex items-center rounded-md hover:bg-accent">

                    {/* Phần text — click để navigate */}
                    <Link
                      href={item.href}
                      onClick={() => {
                        handleItemClick(item);
                        handleCloseDrawer();
                      }}
                      className="flex-1 py-2 px-3"
                    >
                      <span
                        className={cn(
                          'font-bold italic text-[16px]',
                          isActive(item) ? 'text-success' : 'text-black'
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>

                    {/* Phần chevron — click để expand accordion */}
                    <AccordionTrigger
                      className="py-2 pr-3 hover:no-underline [&>svg]:shrink-0"
                      onClick={() => handleItemClick(item)}
                    />
                  </div>

                  <AccordionContent className="pb-0">
                    <ul className="flex flex-col gap-1 pl-3">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            onClick={() => {
                              handleSubItemClick(item, subItem);
                              handleCloseDrawer();
                            }}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{subItem.title}</div>
                            {subItem.description && (
                              <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

              ) : (

                /* Item không có subItems → giữ nguyên như desktop */
                <div key={item.title} className="border-b-0">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            onClick={() => {
                              handleItemClick(item);
                              handleCloseDrawer();
                            }}
                            className={cn(navigationMenuTriggerStyle(), '!bg-transparent')}
                          >
                            <span
                              className={cn(
                                'font-bold italic text-[16px]',
                                isActive(item) ? 'text-success' : 'text-black'
                              )}
                            >
                              {item.title}
                            </span>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

              )
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}