'use client';

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/context/useBreadcrumb";
import { usePathname } from "next/navigation";

type Props = {
  menuState: {
    itemTitle?: string;
    itemHref?: string;
    subItemTitle?: string;
    subItemHref?: string;
    level?: 'item' | 'subItem';
  } | null;
};

export function BreadcrumbDynamic({ menuState }: Props) {
  const { items } = useBreadcrumb();
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    const result: { title: string; href?: string }[] = [];

    if (menuState?.itemTitle) {
      result.push({ title: menuState.itemTitle, href: menuState.itemHref || '/' });
    }

    if (menuState?.subItemTitle) {
      result.push({ title: menuState.subItemTitle, href: menuState.subItemHref || '/' });
    }

    if (!menuState?.itemTitle) {
      if (pathname.startsWith('/teachers')) {
        result.push({ title: 'Giáo viên', href: '/teachers' });
      }
    }

    if (items && items.length) {
      result.push(...items);
    }

    return result;
  }, [menuState, items, pathname]);

  // if (pathname === '/' || pathname === '/elearning') return null;

  return (
    <div className="w-full max-w-none flex justify-start px-6 md:px-10 lg:px-12 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* {pathname.startsWith('/elearning') ? (
              <BreadcrumbLink href="/elearning" className="font-medium">
                Elearning
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink href="/" className="font-medium">
                Home
              </BreadcrumbLink>
            )} */}
            <BreadcrumbLink href="/" className="font-medium">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((seg, index) => {
            const isLast = index === segments.length - 1;

            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-bold text-custom-blue">
                      {seg.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={seg.href || '#'} className="font-medium">
                      {seg.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}