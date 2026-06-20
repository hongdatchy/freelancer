import { CourseDTO } from '@/dto/CourseDTO';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseCard({ course }: { course: CourseDTO }) {
  const thumbnail =
    course?.thumbnail?.formats?.medium?.url ||
    course?.thumbnail?.url;

  const formatAge = (ages?: string) => {
    if (!ages) return '';
    if (ages.toLowerCase().includes('độ tuổi') || ages.toLowerCase().includes('age')) {
      return ages;
    }
    return `Độ tuổi: ${ages}`;
  };

  const getCleanName = (name: string) => {
    if (name.toLowerCase().includes('family')) {
      return 'FAMILY & FRIENDS';
    }
    if (name.toLowerCase().includes('academy')) {
      return 'ACADEMY STARS';
    }
    return name;
  };

  const hrefPrefix = course.isStudentLecture === false ? '/teacher-training' : '/elearning';

  const isCourseCompleted = (course: CourseDTO) => {
    if (!course.lectures || course.lectures.length === 0) return false;
    
    let hasMedia = false;
    for (const lecture of course.lectures) {
      if (lecture.media_lectures && lecture.media_lectures.length > 0) {
        hasMedia = true;
        for (const media of lecture.media_lectures) {
          const required = (media as any).requiredMinutes || 0;
          const current = (media as any).currentMinutes || 0;
          if (current < required) {
            return false;
          }
        }
      }
    }
    return hasMedia;
  };

  const isCompleted = course.isStudentLecture === false && isCourseCompleted(course);

  return (
    <Link href={`${hrefPrefix}/${course.documentId}`} className="block group">
      <div className="bg-white rounded-[24px] overflow-hidden border border-[#3F489A]/20 shadow-[0_0_22px_rgba(46,53,127,0.06)] hover:shadow-[0_0_30px_rgba(46,53,127,0.12)] hover:border-[#3F489A]/45 transition-all duration-300 cursor-pointer p-3.5 pb-5">
        {/* Thumbnail */}
        <div className="relative w-full h-[160px] sm:h-[180px] overflow-hidden rounded-[16px] bg-slate-50 border-2 border-[#3F489A]">
          {thumbnail && (
            <Image
              src={process.env.NEXT_PUBLIC_BE_HOST + thumbnail}
              alt={course.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute top-2.5 right-2.5 bg-green-500 text-white text-[11px] font-black px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md select-none z-10 animate-fade-in">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Đã hoàn thành</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-4 px-1">
          {/* Course Name */}
          <h3 className="font-extrabold text-[16.5px] text-[#2E357F] mb-1 uppercase tracking-wide transition-colors group-hover:text-[#3F489A]">
            {getCleanName(course.name)}
          </h3>

          {/* Age Info */}
          {course.ages && (
            <p className="text-[13.5px] font-bold text-[#FF6B00]">
              {formatAge(course.ages)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}