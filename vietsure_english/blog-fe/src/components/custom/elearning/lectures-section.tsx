'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LecturesSection({ course }: any) {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const router = useRouter();

  if (!course?.lectures?.length) return null;

  const getMediaIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 transition-colors group-hover:bg-sky-500 group-hover:text-white">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'pdf':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'ppt':
      case 'presentation':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'canva':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
            <span className="text-[9px] font-black tracking-tighter">CANVA</span>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-500/10 text-slate-500 transition-colors group-hover:bg-slate-500 group-hover:text-white">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {course.lectures.map((lesson: any) => {
        const isOpen = openLessonId === lesson.documentId;
        return (
          <div key={lesson.documentId} className="border border-slate-100 rounded-2xl overflow-hidden shadow-[0_5px_20px_rgba(46,53,127,0.03)] bg-white transition-all duration-300">
            {/* HEADER */}
            <div
              onClick={() => setOpenLessonId(isOpen ? null : lesson.documentId)}
              className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-slate-50/50 bg-white select-none transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <svg
                  className={`h-4.5 w-4.5 text-[#2E357F] transition-transform duration-300 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>

                <div>
                  <p className="font-extrabold text-[15.5px] text-[#2E357F] leading-tight">{lesson.name}</p>
                  {lesson.description && (
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>

              {lesson.media_lectures?.length > 0 && (
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                  {lesson.media_lectures.length} tài liệu
                </span>
              )}
            </div>

            {/* EXPAND */}
            {isOpen && (
              <div className="px-5 pb-5 pt-3.5 border-t border-slate-100/60 bg-slate-50/30">
                {lesson.content && (
                  <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/50 border-dashed mb-4 leading-relaxed whitespace-pre-wrap">
                    {lesson.content}
                  </div>
                )}

                {lesson.media_lectures?.length > 0 && (
                  <div className="space-y-2">
                    {lesson.media_lectures.map((media: any) => {
                      const hrefPrefix = course.isStudentLecture === false ? '/teacher-training' : '/elearning';
                      return (
                        <div
                          key={media.documentId}
                          onClick={() =>
                            router.push(
                              `${hrefPrefix}/${course.documentId}/media-lectures/${media.documentId}?courseName=${encodeURIComponent(course.name)}&&isStudentLecture=${course.isStudentLecture}`
                            )
                          }
                          className="flex items-center gap-3 p-3 bg-white border border-slate-100/80 rounded-xl cursor-pointer hover:border-[#3F489A]/30 shadow-[0_2px_8px_rgba(46,53,127,0.01)] hover:shadow-[0_4px_12px_rgba(46,53,127,0.04)] transition-all duration-200 group"
                        >
                          {getMediaIcon(media.type)}

                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-700 truncate group-hover:text-[#3F489A] transition-colors">
                              {media.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}