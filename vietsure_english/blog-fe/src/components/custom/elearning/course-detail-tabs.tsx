'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseDTO } from '@/dto/CourseDTO';

type Props = {
  course: CourseDTO;
};

export default function CourseDetailTabs({ course }: Props) {
  const [activeTab, setActiveTab] = useState<'intro' | 'content'>('intro');
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const router = useRouter();

  const getMediaIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 transition-colors group-hover:bg-sky-500 group-hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'pdf':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'ppt':
      case 'presentation':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex items-center gap-8 border-b border-slate-100 pb-3 mb-8">
        <button
          onClick={() => setActiveTab('intro')}
          className={`flex items-center gap-2 cursor-pointer py-1.5 text-[16.5px] font-black transition-colors relative focus:outline-none ${
            activeTab === 'intro' ? 'text-[#2E357F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Giới thiệu
          {activeTab === 'intro' && (
            <div className="absolute bottom-[-15px] left-0 right-0 h-[3px] bg-[#2E357F] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 cursor-pointer py-1.5 text-[16.5px] font-black transition-colors relative focus:outline-none ${
            activeTab === 'content' ? 'text-[#2E357F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Nội dung
          {activeTab === 'content' && (
            <div className="absolute bottom-[-15px] left-0 right-0 h-[3px] bg-[#2E357F] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'intro' ? (
        <div className="text-[15px] md:text-[16px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap animate-fade-in">
          {course.description || 'Chưa có thông tin giới thiệu cho khóa học này.'}
        </div>
      ) : (
        <div className="space-y-1 animate-fade-in">
          {course.lectures && course.lectures.length > 0 ? (
            course.lectures.map((lesson: any) => {
              const isOpen = openLessonId === lesson.documentId;
              return (
                <div key={lesson.documentId} className="border-b border-slate-100/80 py-4 transition-all duration-300">
                  {/* Lesson Heading Line */}
                  <div
                    onClick={() => setOpenLessonId(isOpen ? null : lesson.documentId)}
                    className="flex items-center gap-3.5 cursor-pointer select-none group"
                  >
                    <svg
                      className={`h-4 w-4 shrink-0 text-[#2E357F] transition-transform duration-300 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>

                    <div className="flex-1 flex flex-wrap items-baseline gap-2">
                      <p className="font-extrabold text-[15.5px] text-[#2E357F] leading-tight uppercase group-hover:text-[#3F489A] transition-colors">
                        {lesson.name}
                      </p>
                      {lesson.media_lectures?.length > 0 && (
                        <span className="text-xs font-semibold text-slate-400">
                          {lesson.media_lectures.length} bài học
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable media lectures list */}
                  {isOpen && (
                    <div className="pl-8 pr-2 pt-4 pb-1 space-y-2">
                      {lesson.content && (
                        <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/50 border-dashed mb-3.5 leading-relaxed whitespace-pre-wrap">
                          {lesson.content}
                        </div>
                      )}

                      {lesson.media_lectures?.length > 0 ? (
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
                                className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-[#3F489A]/30 shadow-[0_2px_8px_rgba(46,53,127,0.01)] hover:shadow-[0_4px_12px_rgba(46,53,127,0.04)] transition-all duration-200 group"
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
                      ) : (
                        <p className="text-xs font-bold text-slate-400">Không có bài học</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm font-bold text-slate-400 py-4">Khóa học chưa được cập nhật nội dung giảng dạy.</p>
          )}
        </div>
      )}
    </div>
  );
}
