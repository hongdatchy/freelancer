import LearningPathSection from '@/components/custom/common/learning-path-section';
import ValuesSection from '@/components/custom/common/values-section';
import CourseRoadmapSection from '@/components/custom/common/course-roadmap-section';
import DifferencesSection from '@/components/custom/common/differences-section';
import PenguinAdventuresSection from '@/components/custom/common/penguin-adventures-section';
import CertificateSection from '@/components/custom/common/certificate-section';
import CommitmentsSection from '@/components/custom/common/commitments-section';
import JobSuccessSection from '@/components/custom/common/job-success-section';
import TeacherSection from '@/components/custom/common/teacher-section';
import Image from 'next/image';
import BrandStats from '@/components/custom/common/brand-stats';

export default function Course() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      
      {/* BEGIN: CourseHeroSection */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-[#2E357F] text-white relative" data-purpose="course-hero">
        
        {/* Background Image (Seamlessly matches the blue section color) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
          <Image
            src="/images/image-khoa-hoc.png"
            alt="Khóa học tiếng Anh online quốc tế chất lượng cao background"
            fill
            className="object-cover object-left-bottom"
            priority
          />
        </div>

        <div className="w-full flex flex-col gap-12 relative z-10">
          
          {/* Upper Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Side: Title */}
            <div className="w-full lg:w-[48%] flex flex-col justify-between relative select-none">
              <h1 
                className="text-3xl md:text-4xl lg:text-[45px] tracking-wide text-white/95 uppercase mb-8 text-center lg:text-left"
                style={{ lineHeight: '1.6', fontWeight: 200 }}
              >
                KHÓA HỌC TIẾNG ANH ONLINE<br />
                QUỐC TẾ <span className="font-bold text-[#FBBC05]">CHẤT LƯỢNG CAO</span>
              </h1>
              {/* Spacer on desktop to give height so background kids are fully visible */}
              <div className="hidden lg:block h-[280px]" />
            </div>

            {/* Right Side: Description Card and Button */}
            <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-[480px] flex flex-col items-center">
                
                {/* Card */}
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-2xl text-slate-800 mb-8 w-full">
                  <p className="text-sm md:text-base leading-relaxed text-[#2E357F] font-semibold">
                    Dựa trên kinh nghiệm giảng dạy tiếng Việt online cho trẻ em 4 - 18 tuổi sinh sống tại nước ngoài - nơi mà các bé dùng hoàn toàn 100% tiếng Anh, Vietsure English sẽ mang đến chương trình học tiếng Anh trực tuyến dành cho trẻ em từ 4 – 12+ tuổi, được thiết kế độc quyền theo chuẩn quốc tế, giúp học viên phát triển toàn diện 4 kỹ năng nghe – nói – đọc – viết trong môi trường học tập sinh động và tương tác cao.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="w-full flex justify-center">
                  <a
                    href="#trial-section"
                    className="inline-block bg-[#3F489A] hover:bg-[#252a60] text-white font-extrabold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105 text-base tracking-wider text-center"
                  >
                    Học thử miễn phí
                  </a>
                </div>

              </div>
            </div>

          </div>

          {/* Reusable Statistics Bar */}
          <div className="w-full max-w-6xl mx-auto mt-12 translate-y-4 -mb-4 relative z-20">
            <BrandStats />
          </div>

        </div>
      </section>
      {/* END: CourseHeroSection */}

      <LearningPathSection />
      <ValuesSection />
      <CourseRoadmapSection />
      <DifferencesSection />
      <PenguinAdventuresSection />
      <CertificateSection />
      <CommitmentsSection />
      <JobSuccessSection />
      <TeacherSection />
    </div>
  );
}
