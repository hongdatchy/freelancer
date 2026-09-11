"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn, formatDateVN } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateInputVNProps {
  value: string; // Định dạng lưu trữ: YYYY-MM-DD
  onChange: (value: string) => void; // Trả về: YYYY-MM-DD
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Chuyển YYYY-MM-DD sang dd/mm/yyyy
 */
function toDisplayVN(isoDate: string): string {
  if (!isoDate) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  }
  return formatDateVN(isoDate);
}

/**
 * Chuyển dd/mm/yyyy sang YYYY-MM-DD
 */
function toISODate(displayVN: string): string | null {
  if (!displayVN) return "";
  const match = displayVN.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const year = match[3];

  const dNum = parseInt(day, 10);
  const mNum = parseInt(month, 10);
  const yNum = parseInt(year, 10);

  if (mNum < 1 || mNum > 12) return null;
  if (dNum < 1 || dNum > 31) return null;

  return `${year}-${month}-${day}`;
}

export function DateInputVN({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  className,
  required = false,
  disabled = false,
}: DateInputVNProps) {
  const [displayText, setDisplayText] = useState(() => toDisplayVN(value));
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayText(toDisplayVN(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Chỉ cho phép nhập số và ký tự '/'
    input = input.replace(/[^\d/]/g, "");

    // Tự động thêm dấu '/' khi gõ đủ 2 hoặc 5 số nếu người dùng không tự gõ
    if (input.length === 2 && !input.includes("/") && displayText.length < 2) {
      input = `${input}/`;
    } else if (input.length === 5 && input.split("/").length === 2 && displayText.length < 5) {
      input = `${input}/`;
    }

    // Giới hạn tối đa 10 ký tự: dd/mm/yyyy
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    setDisplayText(input);

    const iso = toISODate(input);
    if (iso !== null) {
      onChange(iso);
    } else if (input === "") {
      onChange("");
    }
  };

  const handleBlur = () => {
    // Khi rời khỏi input, nếu không đúng định dạng thì khôi phục lại giá trị hợp lệ trước đó
    const iso = toISODate(displayText);
    if (iso === null && displayText !== "") {
      setDisplayText(toDisplayVN(value));
    }
  };

  const handleCalendarIconClick = () => {
    if (disabled) return;
    if (hiddenDateInputRef.current) {
      try {
        if ("showPicker" in HTMLInputElement.prototype) {
          hiddenDateInputRef.current.showPicker();
        } else {
          hiddenDateInputRef.current.focus();
        }
      } catch {
        hiddenDateInputRef.current.focus();
      }
    }
  };

  const handleHiddenDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value;
    onChange(isoVal);
    setDisplayText(toDisplayVN(isoVal));
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={displayText}
        onChange={handleTextChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-9 font-medium",
          className
        )}
      />

      {/* Nút biểu tượng Lịch mở popup */}
      <button
        type="button"
        tabIndex={-1}
        onClick={handleCalendarIconClick}
        disabled={disabled}
        className="absolute right-2.5 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
        title="Chọn ngày từ lịch"
      >
        <CalendarIcon className="w-4 h-4" />
      </button>

      {/* Hidden native input date để tận dụng bộ chọn lịch của trình duyệt */}
      <input
        ref={hiddenDateInputRef}
        type="date"
        value={value || ""}
        onChange={handleHiddenDateChange}
        tabIndex={-1}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
