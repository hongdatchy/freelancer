'use client';

import { useBreadcrumb } from '@/context/useBreadcrumb';
import { useEffect } from 'react';

type BreadcrumbItem = { title: string; href?: string };

export function LearningBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { setItems, clear } = useBreadcrumb();

  useEffect(() => {
    setItems(items);
    return () => clear();
  }, [items]);

  return null;
}