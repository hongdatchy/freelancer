import { LearningBreadcrumb } from '@/components/custom/elearning/learning-breadcrumb';
import CourseDetailTabs from '@/components/custom/elearning/course-detail-tabs';
import { CourseDTO } from '@/dto/CourseDTO';
import { getData } from '@/service/api';
import Image from 'next/image';

export default async function CourseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const responseCourse = await getData(
    `api/courses/${params.id}?populate[0]=thumbnail&populate[1]=lectures.media_lectures.content`
  );

  const course: CourseDTO = responseCourse.data;

  const thumbnail =
    course?.thumbnail?.formats?.medium?.url ||
    course?.thumbnail?.url;

  const isTeacherCourse = course?.isStudentLecture === false;

  return (
    <div className="w-full bg-white py-8 md:py-12">
      <LearningBreadcrumb items={[{ title: course.name }]} />

      <section className="px-6 md:px-10 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Thumbnail Container */}
          <div className="mb-10 relative">
            {/* Top-Centered Logo Badge overlapping top border */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-2.5 rounded-2xl border-2 border-[#3F489A] shadow-md z-10 flex items-center justify-center">
              <Image
                src="/images/Vietsure English_Logo-15.png"
                alt="Vietsure English Logo"
                width={120}
                height={24}
                className="h-5 md:h-6 w-auto object-contain"
              />
            </div>

            <div className="relative w-full h-[240px] sm:h-[350px] md:h-[450px] rounded-[32px] overflow-hidden bg-slate-50 border-[5px] border-[#3F489A] shadow-md z-0">
              {thumbnail && (
                <Image
                  src={process.env.NEXT_PUBLIC_BE_HOST + thumbnail}
                  alt={course.name}
                  fill
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Course Info */}
          <div className="mb-6">
            <h1 className="text-[28px] sm:text-[34px] md:text-[38px] font-black text-[#2E357F] mb-4 uppercase tracking-wide leading-tight">
              {course.name}
            </h1>
          </div>

          {/* ===== PROGRESS OVERVIEW (CHỈ TEACHER COURSE) ===== */}
          {isTeacherCourse && (
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <p className="font-bold mb-2">Tiến độ học tập</p>

              <div className="space-y-2 text-sm">
                {course.lectures?.map((lecture: any) =>
                  lecture.media_lectures?.map((media: any) => {
                    const required = media.requiredMinutes || 0;
                    const current = media.currentMinutes || 0;
                    const done = current >= required;

                    return (
                      <div
                        key={media.documentId}
                        className="flex items-center justify-between"
                      >
                        <span>{media.name}</span>

                        <span className="flex items-center gap-2">
                          {current}/{required} phút
                          {done && (
                            <span className="text-green-600 font-bold">
                              ✔
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tabbed Interactive Contents (Giới thiệu / Nội dung) */}
          <CourseDetailTabs course={course} />
        </div>
      </section>
    </div>
  );
}