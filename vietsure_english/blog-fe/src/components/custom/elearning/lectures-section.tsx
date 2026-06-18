'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LecturesSection({ course }: any) {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const router = useRouter();

  if (!course?.lectures?.length) return null;

  return (
    <div className="space-y-4">

      {course.lectures.map((lesson: any) => (
        <div key={lesson.documentId} className="border rounded-lg">

          {/* HEADER (giữ nguyên từng lesson, không group) */}
          <div
            onClick={() =>
              setOpenLessonId(
                openLessonId === lesson.documentId
                  ? null
                  : lesson.documentId
              )
            }
            className="flex justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 bg-white border-b"
          >
            <div className="flex items-center gap-2">
              <span>▶</span>

              <div>
                <p className="font-medium">{lesson.name}</p>
                <p className="text-xs text-gray-500">
                  {lesson.description}
                </p>
              </div>
            </div>

            {lesson.media_lectures?.length > 0 && (
              <span className="text-sm text-gray-500">
                {lesson.media_lectures.length} tài liệu
              </span>
            )}
          </div>

          {/* EXPAND */}
          {openLessonId === lesson.documentId && (
            <div className="px-5 pb-4 bg-gray-50">

              {lesson.content && (
                <p className="text-sm mb-3 text-gray-700">
                  {lesson.content}
                </p>
              )}

              {lesson.media_lectures?.length > 0 && (
                <div className="space-y-2">
                  {lesson.media_lectures.map((media: any) => (
                    <div
                      key={media.documentId}
                      onClick={() =>
                        router.push(
                          `/elearning/${course.documentId}/media-lectures/${media.documentId}?courseName=${encodeURIComponent(course.name)}&&isStudentLecture=${course.isStudentLecture}`
                        )
                      }
                      className="flex items-center gap-3 p-2 bg-white rounded border cursor-pointer hover:bg-gray-100"
                    >
                      <span>
                        {media.type === 'video' && '🎬'}
                        {media.type === 'pdf' && '📄'}
                        {media.type === 'ppt' && '📊'}
                        {media.type === 'canva' && '🎨'}
                        {!['video', 'pdf', 'ppt', 'canva'].includes(media.type) && '📎'}
                      </span>

                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {media.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}