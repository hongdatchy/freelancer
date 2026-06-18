import { LearningBreadcrumb } from '@/components/custom/elearning/learning-breadcrumb';
import LecturesSection from '@/components/custom/elearning/lectures-section';
import { CourseDTO } from '@/dto/CourseDTO';
import { getData } from '@/service/api';

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
    <div className="md:col-span-3 w-full">
      <LearningBreadcrumb items={[{ title: course.name }]} />

      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Thumbnail */}
          <div className="mb-8">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-200">
              {thumbnail && (
                <img
                  src={process.env.NEXT_PUBLIC_BE_HOST + thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Course Info */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#2d3748] mb-4">
              {course.name}
            </h1>

            <p className="text-lg text-gray-700 whitespace-pre-wrap">
              {course.description}
            </p>
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

          {/* Lectures */}
          <LecturesSection course={course} />
        </div>
      </section>
    </div>
  );
}