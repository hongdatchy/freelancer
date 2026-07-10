'use client';

import { createContext, useContext, useState } from 'react';

export type BreadcrumbItem = {
  title: string;
  href?: string;
};

export type MenuState = {
  itemTitle?: string;
  itemHref?: string;
  subItemTitle?: string;
  subItemHref?: string;
  level?: 'item' | 'subItem';
} | null;

type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  clear: () => void;
  menuState: MenuState;
  setMenuState: (state: MenuState) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [menuState, setMenuState] = useState<MenuState>(null);

  const clear = () => setItems([]);

  return (
    <BreadcrumbContext.Provider value={{ items, setItems, clear, menuState, setMenuState }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export const useBreadcrumb = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumb must be used within BreadcrumbProvider');
  return ctx;
};