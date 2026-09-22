import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isBefore, isToday, parseISO, addDays, subDays, getDay } from "date-fns";
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

    if (isToday(target)) {
      return { days: 0, isOverdue: false, isToday: true, label: "Hôm nay là hạn" };
    }

    if (target < today) {
      const diff = differenceInDaysExcludingSunday(today, target);
      return { days: diff, isOverdue: true, isToday: false, label: `Quá hạn ${diff} ngày` };
    }

    const diff = differenceInDaysExcludingSunday(target, today);
    return { days: diff, isOverdue: false, isToday: false, label: `Còn ${diff} ngày` };
  } catch {
    return { days: 0, isOverdue: false, isToday: false, label: "-" };
  }
}

/**
 * Kiểm tra xem ngày có phải là Chủ Nhật hay không
 */
export function isSunday(dateInput: Date | string): boolean {
  try {
    const d = typeof dateInput === "string" ? parseISO(dateInput) : new Date(dateInput);
    return getDay(d) === 0;
  } catch {
    return false;
  }
}

/**
 * Lấy ngày làm việc kế tiếp (nếu rơi vào Chủ Nhật thì tự động chuyển sang Thứ Hai)
 */
export function getNextWorkingDay(dateInput: Date | string): Date {
  let d = typeof dateInput === "string" ? parseISO(dateInput) : new Date(dateInput);
  if (getDay(d) === 0) {
    d = addDays(d, 1);
  }
  return d;
}

/**
 * Cộng thêm N ngày làm việc, tự động bỏ qua ngày Chủ Nhật (chỉ tính Thứ 2 đến Thứ 7)
 */
export function addDaysExcludingSunday(startDateInput: Date | string, days: number): Date {
  let date = getNextWorkingDay(startDateInput);
  if (days <= 0) return date;

  let added = 0;
  while (added < days) {
    date = addDays(date, 1);
    if (getDay(date) !== 0) {
      added++;
    }
  }
  return date;
}

/**
 * Lùi lại N ngày làm việc, tự động bỏ qua ngày Chủ Nhật (nếu rơi vào Chủ Nhật thì lùi tiếp về Thứ 7)
 */
export function subDaysExcludingSunday(startDateInput: Date | string, days: number): Date {
  let date = typeof startDateInput === "string" ? parseISO(startDateInput) : new Date(startDateInput);
  if (getDay(date) === 0) {
    date = subDays(date, 1);
  }
  if (days <= 0) return date;

  let subtracted = 0;
  while (subtracted < days) {
    date = subDays(date, 1);
    if (getDay(date) !== 0) {
      subtracted++;
    }
  }
  return date;
}

/**
 * Tính khoảng cách số ngày làm việc giữa 2 ngày (không tính các ngày Chủ Nhật)
 */
export function differenceInDaysExcludingSunday(
  endDateInput: Date | string,
  startDateInput: Date | string
): number {
  try {
    const start = typeof startDateInput === "string" ? parseISO(startDateInput) : new Date(startDateInput);
    const end = typeof endDateInput === "string" ? parseISO(endDateInput) : new Date(endDateInput);
    if (end <= start) return 0;

    let current = start;
    let count = 0;
    while (current < end) {
      current = addDays(current, 1);
      if (getDay(current) !== 0) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}
