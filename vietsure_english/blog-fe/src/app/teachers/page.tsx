import Paging from '@/components/custom/common/paging';
import TrialSection from '@/components/custom/common/traial-section';
import TeacherCard from '@/components/custom/teacher/teacher-card';
import TeacherFilter from '@/components/custom/teacher/teacher-filter';
import { TeacherDTO } from '@/dto/TeacherDTO';
import { postData, getData } from '@/service/api';
import Image from 'next/image';

export default async function Teachers(props: {
  params?: Promise<{ id: string; name: string; slug: string }>;
  searchParams?: Promise<{
    gender?: string;
    region?: string;
    time_slot?: string;
    id?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const pageSize: number = Number(searchParams?.pageSize) || 8;
  const page = Number(searchParams?.page) || 0;

  const responseUser = await postData(
    `api/users/search?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      gender: searchParams?.gender,
      region: searchParams?.region,
      schedule: searchParams?.time_slot ? { time_slot: searchParams.time_slot } : undefined,
    },
  );

  const teachers: TeacherDTO[] = responseUser.data;

  // Get regions list
  const regionsResponse = await getData(`api/regions?pagination[pageSize]=1000`);
  const regions = regionsResponse.data?.map((c: any) => c.name) || [];

  return (
    <div className="md:col-span-3 w-full bg-white">
      <section className="px-6 py-5 bg-gradient-to-b from-[#EBF5FF] to-white overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

          {/* Header */}
          <div className="text-center mx-auto mb-4 max-w-4xl">
            <h1 className="section-title">
              GIÁO VIÊN VIETSURE ENGLISH
            </h1>
            <p className="section-subtitle mt-2">
              CHUẨN QUỐC TẾ, TÀI NĂNG & NHIỆT HUYẾT
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

            {/* Bên trái: ảnh */}
            <div className="flex-1 w-full flex justify-center">
              <Image
                src="/images/giao-vien.webp"
                alt="Giáo viên Vietsure English"
                width={600}
                height={500}
                className="object-contain w-full max-w-[500px]"
                priority
              />
            </div>

            {/* Bên phải: nội dung */}
            <div className="flex-1 flex flex-col justify-center">
              {[
                {
                  title: "Chuyên môn vững vàng, chuẩn Quốc tế",
                  desc: "Đội ngũ giáo viên sở hữu chứng chỉ quốc tế như IELTS, TOEIC, TESOL,... đảm bảo chất lượng giảng dạy đồng đều.",
                },
                {
                  title: "Kinh nghiệm thực tế từ môi trường quốc tế",
                  desc: "Đội ngũ giáo viên được đào tạo từ kinh nghiệm giảng dạy trẻ em Việt Nam tại nước ngoài - nơi tiếng Anh được sử dụng tự nhiên trong học tập và đời sống",
                },
                {
                  title: "Theo sát từng học viên",
                  desc: "Mỗi học viên được theo dõi tiến độ học tập rõ ràng để đảm bảo trẻ hiểu - phản xạ - sử dụng được, không học thụ động.",
                },
                {
                  title: "Dày dặn kinh nghiệm",
                  desc: "Giáo viên được tuyển chọn kỹ lưỡng, đào tạo chuyên sâu và liên tục cập nhật phương pháp giảng dạy hiện đại theo tiêu chuẩn chất lượng cao.",
                },
              ].map((item, i, arr) => (
                <div key={i} className="flex gap-4">
                  {/* Icon + đường chấm */}
                  <div className="flex flex-col items-center">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 my-2 border-l-[4px] border-dotted border-[#2E357F]/30" />
                    )}
                  </div>

                  {/* Nội dung */}
                  <div className="pb-6 flex-1">
                    <h3 className="font-black text-[#2E357F] text-base md:text-[17px] mb-1">{item.title}</h3>
                    <p className="section-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="px-6 py-14 bg-[#EBF5FF]">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <div className="text-center mx-auto mb-12">
            <h2 className="section-title">
              +300 GIÁO VIÊN CHẤT LƯỢNG ĐỒNG HÀNH
            </h2>
          </div>

          <TeacherFilter regions={regions} />
          <Paging
            data={teachers}
            pageCount={responseUser.meta.pagination.pageCount}
            page={page + 1}
            pageSize={pageSize}
            renderItem={(user) => (
              <TeacherCard teacher={user} />
            )}
          />
        </div>
      </section>
      <section className="bg-white">
        <TrialSection />
      </section>
    </div>
  );
}