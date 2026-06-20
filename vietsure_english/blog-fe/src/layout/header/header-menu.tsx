'use client';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import * as React from 'react';
import { usePathname } from 'next/navigation';
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

export function HeaderMenu({ onChange, user }: Props) {
  const pathname = usePathname();

  const isActive = (item: MenuItem) => {
    const getBaseUrl = (url: string) => url.split('?')[0];
    const isMatching = (href: string) => pathname === getBaseUrl(href);
    return (
      isMatching(item.href) ||
      item.subItems.some((subItem) => isMatching(subItem.href))
    );
  };

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
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="flex space-x-2 md:space-x-3.5 lg:space-x-4.5 items-center">
        {getMenuItemsByTran(user).map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.subItems.length > 0 && (
              <>
                <NavigationMenuTrigger
                  onMouseEnter={(e) => e.currentTarget.click()}
                  onClick={() => handleItemClick(item)}
                  className="!bg-transparent hover:!bg-transparent !p-0 !h-auto"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      'text-[18px] font-extrabold transition-all duration-200 px-6 py-2 rounded-full inline-block',
                      isActive(item)
                        ? 'bg-[#3F489A] text-white shadow-sm'
                        : 'text-[#3F489A] hover:text-[#3F489A] hover:bg-slate-100/50'
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-1 lg:w-[600px]">
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                        onSelect={() => handleSubItemClick(item, subItem)}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}

            {item.subItems.length === 0 && (
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'text-[18px] font-extrabold transition-all duration-200 px-6 py-2 rounded-full inline-block select-none cursor-pointer',
                    isActive(item)
                      ? 'bg-[#3F489A] text-white shadow-sm'
                      : 'text-[#3F489A] hover:text-[#3F489A] hover:bg-slate-100/50'
                  )}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = ({
  href,
  title,
  children,
  onSelect,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  onSelect?: () => void;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          onClick={onSelect}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};