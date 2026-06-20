import Paging from '@/components/custom/common/paging';
import CourseCard from '@/components/custom/elearning/course-card';
import HeroSection from '@/components/custom/common/hero-section';
import { CourseDTO } from '@/dto/CourseDTO';
import { postData } from '@/service/api';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function ElearningPage(props: {
  params?: Promise<{ id: string; name: string; slug: string }>;
  searchParams?: Promise<{
    name?: string;
    page?: string;
    pageSize?: string;
    isStudentLecture?: string;
    level?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const pageSize: number = Number(searchParams?.pageSize) || 8;
  const page = Number(searchParams?.page) || 0;

  const isStudentLecture = true;
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
        
        {/* Main Heading & Test Button */}
        <div className="text-center max-w-4xl mx-auto mb-10 px-6">
          <h2 className="text-[26px] md:text-[34px] font-black text-[#2E357F] uppercase tracking-wide leading-tight">
            CÁC KHÓA HỌC TẠI VIETSURE ENGLISH
          </h2>
          <div className="mt-4">
            <Link
              href="/#trial-section"
              className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-extrabold py-3.5 px-9 rounded-full shadow-md text-sm md:text-base transition-all duration-300 hover:scale-105"
            >
              Test đầu vào
            </Link>
          </div>
        </div>

        {/* Level Filters Bar */}
        <div className="max-w-6xl mx-auto px-6 mb-14">
          <div className="flex flex-wrap md:flex-nowrap justify-center border border-[#3F489A]/15 rounded-2xl bg-white overflow-hidden shadow-[0_4px_15px_rgba(46,53,127,0.02)]">
            {[
              'Level 0',
              'Level 1+2',
              'Starters',
              'Level 3+4',
              'Movers',
              'Level 5+6',
              'Flyers',
            ].map((lvl, idx, arr) => {
              const active = level === lvl;
              const query = new URLSearchParams();
              if (searchParams?.name) query.set('name', searchParams.name);
              if (searchParams?.pageSize) query.set('pageSize', searchParams.pageSize);
              if (!active) {
                query.set('level', lvl);
              }
              const url = `?${query.toString()}`;

              return (
                <Link
                  key={lvl}
                  href={url}
                  scroll={false}
                  className={`flex-1 min-w-[100px] text-center py-4 px-3 text-[14px] md:text-[15px] font-black transition-colors duration-200 ${
                    active
                      ? 'bg-[#3F489A] text-white'
                      : 'text-[#2E357F] hover:bg-[#3F489A]/5'
                  } ${
                    idx !== arr.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#3F489A]/15' : ''
                  }`}
                >
                  {lvl}
                </Link>
              );
            })}
          </div>
        </div>

        {/* E-Learning Sub-header */}
        <div className="text-center mb-10">
          <h3 className="text-[28px] md:text-[34px] font-black text-[#2E357F] tracking-[0.12em] uppercase">
            E-LEARNING
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