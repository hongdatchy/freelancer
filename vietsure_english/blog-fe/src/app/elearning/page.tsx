import Paging from '@/components/custom/common/paging';
import CourseCard from '@/components/custom/elearning/course-card';
import { CourseDTO } from '@/dto/CourseDTO';
import { postData } from '@/service/api';
import { cookies } from 'next/headers';

export default async function ElearningPage(props: {
  params?: Promise<{ id: string; name: string; slug: string }>;
  searchParams?: Promise<{
    name?: string;
    page?: string;
    pageSize?: string;
    isStudentLecture?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const pageSize: number = Number(searchParams?.pageSize) || 6;
  const page = Number(searchParams?.page) || 0;

  const isStudentLecture =
    searchParams?.isStudentLecture === 'true';

  const cookieStore = cookies();
  const token = (await cookieStore).get('jwt')?.value;

  const responseCourses = await postData(
    `api/courses/search?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      name: searchParams?.name,
      token: token,
      isStudentLecture,
    },
  );

  const courses: CourseDTO[] = responseCourses.data;

  return (
    <div className="md:col-span-3 w-full bg-[rgba(208,251,215,0.4)]">
      <div className="w-full max-w-[1200px] mx-auto px-6 py-6">
        <Paging
          data={courses}
          pageCount={responseCourses.meta.pagination.pageCount}
          page={page + 1}
          pageSize={pageSize}
          renderItem={(course) => <CourseCard course={course} />}
        />
      </div>
    </div>
  );
}