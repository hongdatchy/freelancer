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
            <div className="relative w-full px-[10px] md:px-0 max-w-[850px] aspect-[580/460]" style={{ containerType: 'inline-size' }}>
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
              <div className="absolute left-[7%] top-[60%] -translate-y-1/2 w-max text-center pointer-events-none select-none flex flex-col items-center justify-center">
                <span className="text-[#2E357F] font-black leading-tight uppercase whitespace-nowrap" style={{ fontSize: '3.3cqi' }}>
                  LỘ TRÌNH HỌC
                </span>
              </div>

              {/* Overlaid text: Card 1 */}
              <div className="absolute left-[42%] top-[6%] w-[55%] text-left">
                <h4 className="font-extrabold text-[#2E357F] uppercase leading-tight" style={{ fontSize: '2.5cqi' }}>
                  TIẾNG ANH MẪU GIÁO
                </h4>
                <p className="font-bold text-[#2E357F]/80" style={{ fontSize: '2.4cqi' }}>
                  (Từ 4-5 tuổi)
                </p>
              </div>

              {/* Overlaid text: Card 2 */}
              <div className="absolute left-[58%] top-[31%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#3b82f6] uppercase leading-tight" style={{ fontSize: '2.5cqi' }}>
                  TIẾNG ANH THIẾU NHI
                </h4>
                <p className="font-bold text-[#3b82f6]/80" style={{ fontSize: '2.4cqi' }}>
                  (Từ 6 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 3 */}
              <div className="absolute left-[60%] top-[60%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#38bdf8] uppercase leading-tight" style={{ fontSize: '2.5cqi' }}>
                  TIẾNG ANH THIẾU NIÊN
                </h4>
                <p className="font-bold text-[#38bdf8]/80" style={{ fontSize: '2.4cqi' }}>
                  (Từ 11 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 4 */}
              <div className="absolute left-[45%] top-[86%] w-[46%] text-left">
                <h4 className="font-extrabold text-[#78a5db] uppercase leading-tight" style={{ fontSize: '2.5cqi' }}>
                  IELTS
                </h4>
                <p className="font-bold text-[#78a5db]/80" style={{ fontSize: '2.4cqi' }}>
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
