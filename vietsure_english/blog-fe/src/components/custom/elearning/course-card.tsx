import { CourseDTO } from '@/dto/CourseDTO';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseCard({ course }: { course: CourseDTO }) {
  const thumbnail =
    course?.thumbnail?.formats?.medium?.url ||
    course?.thumbnail?.url;

  return (
    <Link href={`/elearning/${course.documentId}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:border hover:border-[#27ba77] cursor-pointer">

        {/* Thumbnail */}
        <div className="relative w-full h-[220px] overflow-hidden bg-gray-200">
          {thumbnail && (
            <Image
              src={process.env.NEXT_PUBLIC_BE_HOST + thumbnail}
              alt={course.name}
              fill
              className="object-cover object-center transition-transform duration-300 hover:scale-105"
              sizes="100%"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Course Name */}
          <h3 className="font-semibold text-[16px] text-[#2d3748] mb-2 line-clamp-2">
            {course.name}
          </h3>

          {/* Description */}
          <p className="text-[14px] text-gray-600 line-clamp-3 mb-3">
            {course.description || 'Không có mô tả'}
          </p>

          {/* Lectures Count */}
          {course.lectures && course.lectures.length > 0 && (
            <div className="flex items-center gap-1 text-[13px] text-gray-500">
              <span>📚</span>
              <span>{course.lectures.length} bài học</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}