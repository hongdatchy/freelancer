import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isBefore, isToday, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateVN(dateStr: string | Date | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    return format(d, "dd/MM/yyyy", { locale: vi });
  } catch {
    return String(dateStr);
  }
}

export function formatDateTimeVN(dateStr: string | Date | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    return format(d, "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return String(dateStr);
  }
}

export function getDaysRemaining(targetDateStr: string): {
  days: number;
  isOverdue: boolean;
  isToday: boolean;
  label: string;
} {
  try {
    const target = parseISO(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = differenceInDays(target, today);

    if (isToday(target)) {
      return { days: 0, isOverdue: false, isToday: true, label: "Hôm nay là hạn" };
    }
    if (diff < 0) {
      return { days: Math.abs(diff), isOverdue: true, isToday: false, label: `Quá hạn ${Math.abs(diff)} ngày` };
    }
    return { days: diff, isOverdue: false, isToday: false, label: `Còn ${diff} ngày` };
  } catch {
    return { days: 0, isOverdue: false, isToday: false, label: "-" };
  }
}
