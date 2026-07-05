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
import BtnTrial from '@/components/custom/common/btn-trial';
import TrialSection from '@/components/custom/common/traial-section';

export default function Course() {
  return (
    <div className="bg-white text-gray-800 ">

      {/* BEGIN: CourseHeroSection */}
      <section className="py-12 lg:py-14 xl:py-10 2xl:py-28 px-6 md:px-16 lg:px-24 bg-[#2E357F] text-white relative overflow-hidden" data-purpose="course-hero">

        {/* Background Image (Seamlessly matches the blue section color - hidden on mobile) */}
        <div className="hidden xl:block absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
          <Image
            src="/images/image-khoa-hoc.png"
            alt="Khóa học tiếng Anh online quốc tế chất lượng cao background"
            fill
            className="object-cover object-left-bottom"
            priority
          />
        </div>

        <div className="w-full flex flex-col gap-8 xl:gap-12 relative z-10">

          {/* Upper Content */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

            {/* Left Side: Title */}
            <div className="w-full xl:w-[58%] flex flex-col justify-start relative select-none">
              <h1
                className="text-[26px] sm:text-[32px] lg:text-[36px] tracking-wide text-white uppercase mb-2 xl:mb-4 text-center xl:text-left"
                style={{ lineHeight: '1.4', fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                KHÓA HỌC TIẾNG ANH ONLINE <br className='hidden lg:block'/>
                QUỐC TẾ <span className="text-[#ff791a]" style={{ fontWeight: 800 }}>CHẤT LƯỢNG CAO</span>
              </h1>
              {/* Spacer on desktop to give height so background kids are fully visible */}
              <div className="hidden xl:block h-[240px]" />
            </div>

            {/* Right Side: Description Card and Button */}
            <div className="w-full xl:w-[40%] flex flex-col items-center xl:items-end justify-center">
              <div className="w-full max-w-[560px] flex flex-col items-center">

                {/* Text (No card background on mobile) */}
                <div className="xl:bg-white xl:rounded-[32px] xl:p-5 xl:shadow-2xl text-white/95 xl:text-slate-800 mb-6 xl:mb-5 w-full text-center xl:text-justify xl:[text-align-last:center]">
                  <p className="text-[14.5px] md:text-base font-medium xl:font-bold leading-relaxed">
                    Dựa trên kinh nghiệm giảng dạy tiếng Việt online cho trẻ em 4 - 18 tuổi sinh sống tại nước ngoài - nơi mà các bé dùng hoàn toàn 100% tiếng Anh, Vietsure English sẽ mang đến chương trình học tiếng Anh trực tuyến dành cho trẻ em từ 4 - 12+ tuổi, được thiết kế độc quyền theo chuẩn quốc tế, giúp học viên phát triển toàn diện 4 kỹ năng nghe - nói - đọc - viết trong môi trường học tập sinh động và tương tác cao.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="w-full flex justify-center">
                  <BtnTrial className="inline-block bg-[#FF6B00] hover:bg-[#e66000] text-white font-extrabold py-3 px-8 md:py-4 md:px-12 rounded-full shadow-lg shadow-[#FF6B00]/30 transition-transform hover:scale-105 text-[15px] md:text-base tracking-wider text-center border-none" />
                </div>

                {/* Mobile Image (be_gai.png) */}
                <div className="w-full flex justify-center mt-10 xl:hidden">
                  <Image 
                    src="/images/be_gai.png" 
                    alt="Học sinh Vietsure English" 
                    width={400} 
                    height={400} 
                    className="w-full max-w-[340px] object-contain" 
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Reusable Statistics Bar */}
          <div className="w-full max-w-6xl mx-auto mt-6 xl:translate-y-4 -mb-4 relative z-20">
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
      <section className="bg-white">
        <TrialSection />
      </section>
    </div>
  );
}
