import Paging from '@/components/custom/common/paging';
import CourseCard from '@/components/custom/elearning/course-card';
import HeroSection from '@/components/custom/common/hero-section';
import { CourseDTO } from '@/dto/CourseDTO';
import { postData } from '@/service/api';
import { cookies } from 'next/headers';

export default async function TeacherTrainingPage(props: {
  params?: Promise<{ id: string; name: string; slug: string }>;
  searchParams?: Promise<{
    name?: string;
    page?: string;
    pageSize?: string;
    level?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const pageSize: number = Number(searchParams?.pageSize) || 8;
  const page = Number(searchParams?.page) || 0;

  const isStudentLecture = false;
  const level = searchParams?.level;

  const cookieStore = cookies();
  const token = (await cookieStore).get('jwt')?.value;

  const responseCourses = await postData(
    `api/courses/search?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      name: searchParams?.name,
      token: token,
      isStudentLecture,
      level,
    },
  );

  const courses: CourseDTO[] = responseCourses.data;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Hero Section shared with Homepage */}
      <HeroSection buttonText="Học thử miễn phí" buttonHref="/#trial-section" />

      {/* Main Courses Area */}
      <div className="w-full bg-[#F0FAF4] pb-20 pt-12 md:pt-16">
        
        {/* E-Learning Sub-header */}
        <div className="text-center mb-10">
          <h3 className="section-title">
            TRAINING GIÁO VIÊN
          </h3>
        </div>

        {/* Courses Cards Grid */}
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <Paging
            data={courses}
            pageCount={responseCourses.meta.pagination.pageCount}
            page={page + 1}
            pageSize={pageSize}
            renderItem={(course) => <CourseCard course={course} />}
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          />
        </div>

      </div>
    </div>
  );
}
