import React from 'react';

export default function BrandStats() {
  const stats = [
    { value: "1", label: "Mô hình quốc tế" },
    { value: "5+", label: "Quốc gia hoạt động" },
    { value: "300+", label: "Giáo viên tài năng" },
    { value: "95%", label: "Học viên tiến bộ" },
  ];

  return (
    <div className="w-full bg-white border-2 border-blue-200 rounded-[24px] py-6 px-4 md:px-6 grid grid-cols-2 md:flex items-center justify-between gap-y-6 gap-x-2 md:gap-0">
      {stats.map((stat, idx) => (
        <React.Fragment key={idx}>
          <div className="text-center w-full">
            <div className="text-3xl md:text-5xl font-black text-[#3f489a] tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm lg:text-base font-bold text-[#7aa2db] mt-2 whitespace-nowrap">
              {stat.label}
            </div>
          </div>
          {idx < stats.length - 1 && (
            <div className="hidden md:block w-[2px] h-12 bg-blue-100" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
