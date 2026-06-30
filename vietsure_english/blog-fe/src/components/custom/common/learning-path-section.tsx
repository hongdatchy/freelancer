"use client";

import Image from "next/image";
import BtnTrial from "./btn-trial";

export default function LearningPathSection() {
  return (
    <section className="lg:py-20 py-10 bg-gradient-to-b from-[#F0F7FF] to-white" data-purpose="learning-path">
      <div className="mx-auto w-full max-w-[1440px] px-0 md:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-none mx-auto mb-16 px-6 md:px-0">
          <h2 className="section-title">
            LỘ TRÌNH HỌC TIẾNG ANH ONLINE QUỐC TẾ - DÙNG CẢ ĐỜI
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#2E357F] mt-2">
            (CHUẨN CEFR & CAMBRIDGE)
          </h3>
          <p className="section-desc section-desc-justify mt-4 max-w-7xl mx-auto text-center">
            Từ kinh nghiệm dạy online cho trẻ em Việt sinh ra tại nước ngoài chỉ biết tiếng Anh học tiếng mẹ đẻ. Vietsure tiếp tục xây dựng lộ trình học tiếng Anh cho trẻ em Việt Nam từ &quot;Nền tảng - Theo 1 lộ trình học liền mạch, cá nhân hóa - Dùng cả đời&quot; giúp trẻ tiến bộ, tự tin phản xạ tiếng Anh trong cuộc sống như trẻ em nước ngoài và chuẩn chương trình Cambridge.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Content: Diagram Image with Overlaid Text */}
          <div className="w-full lg:w-[52%] flex justify-center">
            <div className="relative w-full px-[10px] md:px-0 max-w-[850px] aspect-[580/460]">
              {/* Background Diagram Image */}
              <Image
                src="/images/learning-path-diagram.png"
                alt="Learning Path Diagram"
                width={580}
                height={460}
                className="w-full h-full object-contain pointer-events-none select-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                priority
              />

              {/* Overlaid text: LỘ TRÌNH HỌC */}
              <div className="absolute left-[8%] sm:left-[10%] lg:left-[6%] top-[60%] -translate-y-1/2 w-max text-center pointer-events-none select-none flex flex-col items-center justify-center">
                <span className="text-[#2E357F] font-black text-[8px] sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight uppercase whitespace-nowrap">
                  LỘ TRÌNH HỌC
                </span>
              </div>

              {/* Overlaid text: Card 1 */}
              <div className="absolute left-[38%] top-[5%] w-[55%] text-left">
                <h4 className="font-extrabold text-[#2E357F] text-[9px] sm:text-xs md:text-base lg:text-sm xl:text-base uppercase leading-tight">
                  TIẾNG ANH MẪU GIÁO
                </h4>
                <p className="text-[8px] sm:text-[10px] md:text-sm lg:text-[11px] xl:text-xs font-bold text-[#2E357F]/80">
                  (Từ 4-5 tuổi)
                </p>
              </div>

              {/* Overlaid text: Card 2 */}
              <div className="absolute left-[56%] top-[30%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#3b82f6] text-[9px] sm:text-xs md:text-base lg:text-sm xl:text-base uppercase leading-tight">
                  TIẾNG ANH THIẾU NHI
                </h4>
                <p className="text-[8px] sm:text-[10px] md:text-sm lg:text-[11px] xl:text-xs font-bold text-[#3b82f6]/80">
                  (Từ 6 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 3 */}
              <div className="absolute left-[58%] top-[59.5%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#38bdf8] text-[9px] sm:text-xs md:text-base lg:text-sm xl:text-base uppercase leading-tight">
                  TIẾNG ANH THIẾU NIÊN
                </h4>
                <p className="text-[8px] sm:text-[10px] md:text-sm lg:text-[11px] xl:text-xs font-bold text-[#38bdf8]/80">
                  (Từ 11 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 4 */}
              <div className="absolute left-[45%] top-[85%] w-[46%] text-left">
                <h4 className="font-extrabold text-[#78a5db] text-[9px] sm:text-xs md:text-base lg:text-sm xl:text-base uppercase leading-tight">
                  IELTS
                </h4>
                <p className="text-[8px] sm:text-[10px] md:text-sm lg:text-[11px] xl:text-xs font-bold text-[#78a5db]/80">
                  (Từ 13 tuổi trở lên)
                </p>
              </div>

            </div>
          </div>

          {/* Right Content: Mascot and CTA */}
          <div className="w-full lg:w-[43%] flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-[450px] select-none pointer-events-none mb-6">
              <Image
                src="/images/character-penguin.png"
                alt="VietSure Penguin Mascot"
                width={450}
                height={450}
                className="w-full h-auto object-contain animate-float-up"
              />
            </div>

            <BtnTrial className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-2.5 px-6 md:py-4 md:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-900/25 text-sm md:text-base tracking-wide" />
          </div>

        </div>

      </div>
    </section>
  );
}
