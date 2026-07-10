'use client';

import { useSearchParams } from 'next/navigation';
import en from './en.json';
import vi from './vi.json';

// Khai báo kiểu cho JSON
export type TranslationData = typeof en; // Giả sử en.json có cấu trúc giống vi.json

// Tạo đối tượng từ điển với các file JSON
const dictionaries: Record<string, TranslationData> = {
  en,
  vi,
};

export const useTransClientSide = () => {
  const pathname = useSearchParams();
  const locale = pathname?.get('locale') || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;

  if (!locale ||!dictionaries[locale]) {
    throw new Error(`Locale '${locale}' is not supported.`);
  }

  // Trả về từ điển phù hợp với locale
  return dictionaries[locale];
};

export default useTransClientSide;
