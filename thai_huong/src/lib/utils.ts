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
    if (typeof dateStr === "string") {
      // Đã ở định dạng dd/MM/yyyy
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      // Dạng YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split("-");
        return `${d}/${m}/${y}`;
      }
      // Dạng ISO có giờ phút giây (vd: 2026-09-11T09:00:00.000Z)
      if (dateStr.includes("T")) {
        const datePart = dateStr.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          const [y, m, d] = datePart.split("-");
          return `${d}/${m}/${y}`;
        }
      }
    }
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateStr);
  }
}

export function formatDateTimeVN(dateStr: string | Date | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
