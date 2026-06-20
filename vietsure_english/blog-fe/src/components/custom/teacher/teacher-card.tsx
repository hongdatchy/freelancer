import { TeacherDTO } from '@/dto/TeacherDTO';
import Link from 'next/link';

export default function TeacherCard({ teacher }: { teacher: TeacherDTO }) {
    const avatarUrl = teacher.avatarHomePage?.url
        ? process.env.NEXT_PUBLIC_BE_HOST + teacher.avatarHomePage.url
        : (teacher.avatar?.url
            ? process.env.NEXT_PUBLIC_BE_HOST + teacher.avatar.url
            : '/images/default-avatar.png');

    // Get IELTS or first score
    const ieltsScoreObj = teacher.score?.find(s => s.type.toUpperCase() === 'IELTS');
    const scoreVal = ieltsScoreObj ? ieltsScoreObj.vaule : (teacher.score?.[0]?.vaule || '');
    const scoreType = ieltsScoreObj ? ieltsScoreObj.type : (teacher.score?.[0]?.type || '');

    const yearsExp = teacher.experiences !== undefined && teacher.experiences !== null ? teacher.experiences : '';

    return (
        <Link href={`/teachers/${teacher.id}`} className="block pt-20 h-full">
            <div className="bg-white rounded-[32px] border-2 border-sky-100 shadow-[0_12px_30px_rgba(59,130,246,0.06)] p-5 pb-8 flex flex-col items-center relative hover:scale-[1.02] transition-transform duration-300 h-full">
                
                {/* AVATAR + TEXT CONG */}
                <div className="relative w-36 h-36 -mt-24 mb-6 flex-shrink-0">
                    
                    {/* Background light-blue circle shape */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100 to-sky-50/50" />

                    {/* VIỀN TRẮNG */}
                    <div className="absolute inset-[4px] rounded-full border-4 border-white z-10 shadow-sm" />

                    {/* AVATAR */}
                    <div className="absolute inset-[8px] rounded-full overflow-hidden z-10">
                        <img
                            src={avatarUrl}
                            alt={teacher.fullName}
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
                                id={`topArc-${teacher.id}`}
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
                                href={`#topArc-${teacher.id}`}
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
                    {teacher.gender?.toLowerCase() === 'female' ? 'Ms. ' : teacher.gender?.toLowerCase() === 'male' ? 'Mr. ' : ''}{teacher.fullName}
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
        </Link>
    );
}