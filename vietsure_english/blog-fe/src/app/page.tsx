import LearnFromStart from '@/components/custom/common/learn-from-start';
import MediaSection from '@/components/custom/common/media-section';
import TrialSection from '@/components/custom/common/traial-section';
import MarketingPopup from '@/components/custom/homepage/maketing-popup';
import TeacherSection from '@/components/custom/common/teacher-section';
import Image from "next/image"
import HeroSection from '@/components/custom/common/hero-section';
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

      <HeroSection />

      <LearningPathSection />

      <section className="px-6 py-20 bg-gradient-to-b from-white to-[#F0F7FF]">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <div className="text-center max-w-none mx-auto mb-16">
            <p className="section-subtitle">
              Dùng tiếng Anh như trẻ quốc tế
            </p>
            <h2 className="section-title mt-2">
              LÝ DO PHỤ HUYNH LUÔN TIN CHỌN VIETSURE ENGLISH
            </h2>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-12 md:gap-0 items-center">
            {/* Ảnh bên trái */}
            <div className="w-full md:w-[520px] md:flex-shrink-0 flex justify-center">
              <Image
                src="/images/tap-trung-quyet-liet.png"
                alt="Lý do chọn VietSure"
                width={520}
                height={520}
                className="w-full max-w-[520px] h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]"
              />
            </div>

            {/* Danh sách bên phải */}
            <ul className="w-full md:flex-1 space-y-5">
              {[
                "Kinh nghiệm dạy online cho trẻ Việt Nam sinh ra ở nước ngoài chỉ biết tiếng Anh duy trì tiếng mẹ đẻ",
                "Trẻ không chỉ giỏi Tiếng Anh mà còn trưởng thành, ngoan ngoãn là công dân tốt trong tương lai",
                "Lộ trình học độc quyền liền mạch chất lượng cao thiết kế dành riêng cho trẻ em Việt Nam",
                "Giáo viên đạt chuẩn Quốc tế & đào tạo khắt khe ngay từ đầu",
                "Tiếng Anh phản xạ - Môi trường tương tác cao - Không học vẹt - Dùng cả đời",
                "Kiểm soát chất lượng giảng dạy và tiến độ học tập của học viên xuyên suốt",
                "Đo lường tiến bộ qua nghe - hiểu - phản xạ - giao tiếp thực tế, không cảm tính",
                "Học online linh hoạt tại nhà, tiết kiệm chi phí",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md shadow-orange-500/20">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="section-desc block">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ValuesSection />

      <section className="px-6 lg:py-20 py-10 bg-gradient-to-b from-white to-[#F0F7FF] overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

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
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_rgba(59,130,246,0.12)] border border-slate-100 flex flex-col justify-start">
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

                <p className="section-desc mb-6">
                  Vietsure English xây dựng lộ trình học liền mạch và thống nhất phương pháp giảng dạy theo từng cấp độ của bé, giúp mọi học viên phát triển vững chắc từ nền tảng ngôn ngữ đến phản xạ giao tiếp tự nhiên.
                </p>

                <p className="text-[#2E357F] font-bold text-base md:text-lg mb-4">
                  Mô hình này giúp trẻ:
                </p>

                <ul className="space-y-3">
                  {[
                    "Nền tảng phát âm và sử dụng ngôn ngữ đúng ngay từ đầu",
                    "Hình thành phản xạ nghe - hiểu - nói tự nhiên",
                    "Tránh tình trạng học lâu nhưng không sử dụng được",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="section-desc">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_rgba(59,130,246,0.12)] border border-slate-100 flex flex-col justify-start relative">
              {/* Cambridge Stamp (Overlapping top-right corner of card 2) */}
              <div className="absolute top-[-45px] right-[-15px] md:right-[-25px] z-10 w-[110px] md:w-[140px] lg:w-[155px] rotate-[15deg]">
                <Image
                  src="/images/cambridge-commitment.png"
                  alt="Cambridge Commitment Stamp"
                  width={155}
                  height={155}
                  className="w-full h-auto filter saturate-[8.0] contrast-[1.8] brightness-[0.9]"
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

                <p className="section-desc mb-6">
                  Chương trình của Vietsure English xây dựng từ kinh nghiệm dạy online cho trẻ em Việt Nam sinh ra tại nước ngoài như Mỹ, Úc, Canada... nơi mà các bé chỉ biết sử dụng tiếng Anh trong học tập và đời sống để học tiếng mẹ đẻ.
                </p>

                <p className="text-[#2E357F] font-bold text-base md:text-lg mb-4">
                  Trẻ được tiếp cận tiếng Anh thông qua:
                </p>

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
                      <span className="section-desc">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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