'use client';

import { useEffect } from 'react';
import { TeacherDTO } from '@/dto/TeacherDTO';
import { useBreadcrumb } from '@/context/useBreadcrumb';
import Image from 'next/image';

export function TeacherDetailClient({
  teacher,
  avatar,
}: {
  teacher: TeacherDTO;
  avatar: string;
}) {
  const { setItems, clear } = useBreadcrumb();

  useEffect(() => {
    setItems([{ title: teacher.fullName }]);
    return () => clear();
  }, [teacher]);

  const avatarUrl = teacher.avatar?.url
    ? process.env.NEXT_PUBLIC_BE_HOST + teacher.avatar.url
    : (avatar ? process.env.NEXT_PUBLIC_BE_HOST + avatar : '/images/default-avatar.png');

  // Get IELTS or first score
  const ieltsScoreObj = teacher.score?.find(s => s.type.toUpperCase() === 'IELTS');
  const scoreVal = ieltsScoreObj ? ieltsScoreObj.vaule : (teacher.score?.[0]?.vaule || '');
  const scoreType = ieltsScoreObj ? ieltsScoreObj.type : (teacher.score?.[0]?.type || '');

  const yearsExp = teacher.experiences !== undefined && teacher.experiences !== null ? teacher.experiences : '';

  return (
    <div className="md:col-span-3 w-full">
      <section className="px-6 py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative">
          
          {/* Blue Container (Left + Card) */}
          <div className="flex-1 bg-[#3F489A] rounded-[36px] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-stretch relative shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
            
            {/* Left Part: Text Info */}
            <div className="flex-[1.2] flex flex-col justify-center text-white space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-[32px] font-black leading-tight text-white">
                  Chuyên môn và Kinh nghiệm
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-black text-yellow-300 mt-1">
                  Giảng dạy Tiếng Anh
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-100">
                    Họ và Tên: <span className="text-white font-black">{teacher.fullName}</span>
                  </p>
                </div>

                {/* Trình độ học vấn */}
                <div className="space-y-1">
                  <h4 className="text-sm md:text-base font-black text-yellow-300">
                    Trình độ học vấn
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {teacher.educations?.map((edu, idx) => (
                      <li key={idx} className="text-xs md:text-sm text-white/95 font-medium leading-relaxed">
                        - {edu.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kinh nghiệm giảng dạy */}
                <div className="space-y-1">
                  <h4 className="text-sm md:text-base font-black text-yellow-300">
                    Kinh nghiệm giảng dạy
                  </h4>
                  <ul className="space-y-1 pl-1">
                    <li className="text-xs md:text-sm text-white/95 font-medium leading-relaxed">
                      - {yearsExp} năm kinh nghiệm giảng dạy tiếng Anh
                    </li>
                  </ul>
                </div>

                {/* Thành tích nổi bật */}
                {teacher.achievements && teacher.achievements.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm md:text-base font-black text-yellow-300">
                      Thành tích nổi bật
                    </h4>
                    <ul className="space-y-1 pl-1">
                      {teacher.achievements.map((ach, idx) => (
                        <li key={idx} className="text-xs md:text-sm text-white/95 font-medium leading-relaxed">
                          - {ach.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Part: Card (White box with rounded corners and overlapping avatar) */}
            <div className="flex-1 flex flex-col justify-center pt-12 md:pt-6">
              <div className="bg-white rounded-[32px] border-2 border-sky-100 p-5 pb-8 flex flex-col items-center relative shadow-lg w-full max-w-[340px] mx-auto">
                
                {/* AVATAR + TEXT CONG */}
                <div className="relative w-36 h-36 -mt-24 mb-6 flex-shrink-0">
                    
                    {/* Background light-blue circle shape */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100 to-sky-50/50" />

                    {/* VIỀN TRẮNG */}
                    <div className="absolute inset-[4px] rounded-full border-4 border-white z-10 shadow-sm" />

                    {/* AVATAR */}
                    <div className="absolute inset-[8px] rounded-full overflow-hidden z-10">
                        <Image
                            src={avatarUrl}
                            alt={teacher.fullName}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* TEXT CONG */}
                    <svg
                        viewBox="0 0 172 172"
                        className="absolute inset-[-14px] pointer-events-none z-20 rotate-[24deg]"
                    >
                        <defs>
                            <path
                                id={`topArc-detail-${teacher.id}`}
                                d="M 10 86 A 76 76 0 0 1 162 86"
                            />
                        </defs>

                        <text
                            fill="white"
                            fontSize="13.5"
                            fontWeight="900"
                            letterSpacing="4"
                        >
                            <textPath
                                href={`#topArc-detail-${teacher.id}`}
                                startOffset="50%"
                                textAnchor="middle"
                              >
                                  TEACHER
                              </textPath>
                          </text>
                    </svg>

                </div>

                {/* NAME */}
                <h3 className="text-[#2E357F] font-black uppercase text-[15px] text-center leading-tight mb-6 min-h-[44px] flex items-center justify-center">
                    {teacher.fullName}
                </h3>

                {/* 2 BADGE BLOCKS SIDE BY SIDE */}
                <div className="flex gap-2.5 w-full mt-auto">
                    {/* Score Box */}
                    <div className="flex-1 bg-[#3F489A] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(56,189,248,0.6)] h-[78px]">
                        <p className="text-yellow-300 font-extrabold text-[15px] md:text-base leading-none">
                            {scoreVal} {scoreType}
                        </p>
                        <p className="text-white text-[10px] md:text-xs font-semibold mt-1 opacity-95">
                            Overall
                        </p>
                    </div>

                    {/* Experience Box */}
                    <div className="flex-1 bg-[#3F489A] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(56,189,248,0.6)] h-[78px]">
                        <p className="text-yellow-300 font-extrabold text-[15px] md:text-base leading-none">
                            {yearsExp}
                        </p>
                        <p className="text-white text-[10px] md:text-xs font-semibold mt-1 opacity-95 leading-tight">
                            Năm k.nghiệm giảng dạy
                        </p>
                    </div>
                </div>

              </div>
            </div>

          </div>

          {/* Mascot Column (Right) */}
          <div className="hidden lg:block w-[240px] flex-shrink-0 relative select-none pointer-events-none self-end mb-[-20px] -mt-12 translate-y-[-24px]">
            <Image
              src="/images/hao-hung-san-sang.png"
              alt="Mascot Penguin Vietsure English"
              width={240}
              height={300}
              className="w-full h-auto object-contain animate-float-up"
            />
          </div>

        </div>
      </section>
    </div>
  );
}