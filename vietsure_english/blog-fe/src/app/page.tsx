import LearnFromStart from '@/components/custom/common/learn-from-start';
import MediaSection from '@/components/custom/common/media-section';
import TrialSection from '@/components/custom/common/traial-section';
import MarketingPopup from '@/components/custom/homepage/maketing-popup';
import TeacherSection from '@/components/custom/common/teacher-section';
import Image from "next/image"
import BrandStats from '@/components/custom/common/brand-stats';
import ParentFeedbackSection from '@/components/custom/common/parent-feedback-section';
import LearningPathSection from '@/components/custom/common/learning-path-section';
import DifferencesSection from '@/components/custom/common/differences-section';
import ValuesSection from '@/components/custom/common/values-section';
import PenguinAdventuresSection from '@/components/custom/common/penguin-adventures-section';
import CertificateSection from '@/components/custom/common/certificate-section';

export default async function Home() {
  return (
    <div>
      <MarketingPopup />

      {/* BEGIN: HeroSection */}
      <section className="relative min-h-[700px] lg:min-h-[850px] flex flex-col justify-center pt-6 pb-16 overflow-hidden bg-white">
        {/* Custom background shapes to mimic the organic curves in the reference */}
        <div aria-hidden="true" className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_top_right,rgba(254,243,199,0.4)_0%,transparent_70%)] z-0 pointer-events-none"></div>
        <div aria-hidden="true" className="absolute bottom-0 right-0 w-[50%] h-[60%] bg-[radial-gradient(circle_at_bottom_right,rgba(239,246,255,0.6)_0%,transparent_70%)] z-0 pointer-events-none"></div>

        <div className="w-full relative z-10 flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full pr-6 md:pr-12 lg:pr-20">
            
            {/* BEGIN: LeftContent - Visuals */}
            <div className="w-full lg:w-[48%] flex justify-start -ml-3 md:-ml-5 lg:-ml-6" data-purpose="hero-image-container">
              <div className="relative w-full shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-r-[40px] overflow-hidden">
                {/* Main Hero Image */}
                <Image 
                  alt="VietSure English Online Class - Teacher and students with penguin mascot" 
                  className="w-full h-auto object-cover" 
                  data-purpose="primary-hero-image" 
                  src="/images/Rectangle.png"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
            {/* END: LeftContent */}

            {/* BEGIN: RightContent - Typography and CTA */}
            <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-4" data-purpose="heading-group">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3F489A] tracking-wide uppercase">
                  TIẾNG ANH PHẢN XẠ ONLINE QUỐC TẾ
                </h2>
                <h1 className="text-5xl md:text-6xl font-black text-[#FF6B00] leading-tight uppercase lg:text-7xl">
                  CHẤT LƯỢNG CAO
                </h1>
                <p className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3F489A] opacity-90 uppercase">
                  CHO TRẺ 4 - 12+ TẠI VIỆT NAM
                </p>
              </div>
              
              {/* Call to Action Button */}
              <div className="pt-4 lg:pt-8" data-purpose="cta-container">
                <a className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg uppercase" href="#trial-section" role="button">
                  TÌM HIỂU THÊM
                </a>
              </div>
            </div>
            {/* END: RightContent */}

          </div>

          {/* Reusable Statistics Bar */}
          <div className="w-full max-w-[1100px] mx-auto">
            <BrandStats />
          </div>
        </div>

        {/* Decorative Mascot Faded Background (Right side watermark style) */}
        <div aria-hidden="true" className="absolute right-[-5%] bottom-[-5%] w-1/3 opacity-15 pointer-events-none hidden lg:block">
          <Image 
            alt="" 
            className="w-full h-auto" 
            src="/images/Hao hung, san sang.png"
            width={400}
            height={300}
          />
        </div>
      </section>
      {/* END: HeroSection */}

      <LearningPathSection />

      {/* END: LearningPathSection */}



      <section className="px-6 py-20 bg-gradient-to-b from-white to-sky-50/30">
        <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
          <div className="text-center max-w-none mx-auto mb-16">
            <p className="section-subtitle">
              Dùng tiếng Anh như trẻ quốc tế
            </p>
            <h2 className="section-title mt-2">
              LÝ DO PHỤ HUYNH LUÔN TIN CHỌN VIETSURE ENGLISH
            </h2>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-12 items-center">
            {/* Ảnh bên trái */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image 
                src="/images/Tap trung, quyet liet.png" 
                alt="Lý do chọn VietSure" 
                width={700} 
                height={700} 
                className="w-full max-w-[700px] h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]" 
              />
            </div>

            {/* Danh sách bên phải */}
            <ul className="w-full md:w-1/2 space-y-5">
              {[
                "Kinh nghiệm dạy online cho trẻ em Việt Nam sinh ra ở nước ngoài chỉ biết tiếng Anh duy trì tiếng mẹ đẻ",
                "Trẻ không chỉ giỏi Tiếng Anh mà còn trưởng thành, ngoan ngoãn là công dân tốt trong tương lai",
                "Lộ trình học độc quyền liền mạch chất lượng cao thiết kế dành riêng cho trẻ em Việt Nam",
                "Giáo viên đạt chuẩn Quốc tế & đào tạo khắt khe ngay từ đầu",
                "Tiếng Anh phản xạ – Môi trường tương tác cao - Không học vẹt - Dùng cả đời",
                "Kiểm soát chất lượng giảng dạy và tiến độ học tập của học viên xuyên suốt",
                "Đo lường tiến bộ qua nghe – hiểu – phản xạ – giao tiếp thực tế, không cảm tính",
                "Học online linh hoạt tại nhà, tiết kiệm chi phí",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md shadow-orange-500/20">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[#2E357F] font-semibold text-sm md:text-[15px] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ValuesSection />

      <section className="px-6 py-20 bg-gradient-to-b from-sky-50/20 to-white overflow-hidden">
        <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
          
          {/* Header */}
          <div className="text-left mb-16">
            <p className="section-subtitle">
              Phương pháp giảng dạy
            </p>
            <h2 className="section-title mt-2">
              MÔ HÌNH GIẢNG DẠY HIỆN ĐẠI, THỰC TẾ
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Card 1 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_rgba(59,130,246,0.12)] border border-slate-100 flex flex-col justify-between">
              <div>
                <Image 
                  src="/images/icon-apollo-commitment-section_left.png" 
                  alt="Mô hình giảng dạy đồng nhất" 
                  width={64} 
                  height={64} 
                  className="w-16 h-16 mb-6 object-contain select-none pointer-events-none" 
                />
                
                <h3 className="text-xl font-black text-[#2E357F] leading-tight mb-3">
                  MÔ HÌNH GIẢNG DẠY ĐỒNG NHẤT<br />
                  <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
                </h3>
                
                <p className="text-[#3F489A]/80 text-sm leading-relaxed mb-6">
                  Vietsure English xây dựng lộ trình học liền mạch và thống nhất phương pháp giảng dạy theo từng cấp độ của bé, giúp mọi học viên phát triển vững chắc từ nền tảng ngôn ngữ đến phản xạ giao tiếp tự nhiên.
                </p>

                <p className="text-[#2E357F] font-bold text-sm mb-4">
                  Mô hình này giúp trẻ:
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Nền tảng phát âm và sử dụng ngôn ngữ đúng ngay từ đầu",
                  "Hình thành phản xạ nghe – hiểu – nói tự nhiên",
                  "Tránh tình trạng học lâu nhưng không sử dụng được",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[#2E357F]/90 text-sm font-semibold leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_rgba(59,130,246,0.12)] border border-slate-100 flex flex-col justify-between relative">
              {/* Cambridge Stamp (Overlapping top-right corner of card 2) */}
              <div className="absolute top-[-45px] right-[-15px] md:right-[-25px] z-10 w-[110px] md:w-[140px] lg:w-[155px] rotate-[15deg]">
                <img
                  src="/images/cambridge-commitment.png"
                  alt="Cambridge Commitment Stamp"
                  className="w-full h-auto filter contrast-[2.2] brightness-[0.5] saturate-[1.5]"
                />
              </div>

              <div>
                <Image 
                  src="/images/icon-apollo-commitment-section_right.png" 
                  alt="Học như trẻ em quốc tế" 
                  width={64} 
                  height={64} 
                  className="w-16 h-16 mb-6 object-contain select-none pointer-events-none" 
                />
                
                <h3 className="text-xl font-black text-[#2E357F] leading-tight mb-3">
                  HỌC NHƯ TRẺ EM QUỐC TẾ
                </h3>
                
                <p className="text-[#3F489A]/80 text-sm leading-relaxed mb-6">
                  Chương trình của Vietsure English xây dựng từ kinh nghiệm dạy online cho trẻ em Việt Nam sinh ra tại nước ngoài như Mỹ, Úc, Canada... nơi mà các bé chỉ biết sử dụng tiếng Anh trong học tập và đời sống để học tiếng mẹ đẻ.
                </p>

                <p className="text-[#2E357F] font-bold text-sm mb-4">
                  Trẻ được tiếp cận tiếng Anh thông qua:
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Tình huống giao tiếp thực tế",
                  "Hoạt động tương tác, thảo luận, phản biện",
                  "Ngữ cảnh gần gũi với cuộc sống hằng ngày",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[#2E357F]/90 text-sm font-semibold leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <DifferencesSection />

      <CertificateSection />

      <PenguinAdventuresSection />

      <LearnFromStart />

      <TeacherSection />

      <MediaSection />

      <ParentFeedbackSection />
      {/* END: ParentFeedbackSection */}

      <section className="bg-white">
        <TrialSection />
      </section>

    </div>
  );
}