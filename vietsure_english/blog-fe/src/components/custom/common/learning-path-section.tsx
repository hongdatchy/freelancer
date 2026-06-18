"use client";

import Image from "next/image";

export default function LearningPathSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-sky-50/50 to-white" data-purpose="learning-path">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#2E357F] uppercase tracking-wide whitespace-normal lg:whitespace-nowrap">
            LỘ TRÌNH HỌC TIẾNG ANH ONLINE QUỐC TẾ - DÙNG CẢ ĐỜI
          </h2>
          <h3 className="text-lg md:text-xl font-bold text-[#2E357F] mt-2">
            (CHUẨN CEFR & CAMBRIDGE)
          </h3>
          <p className="text-[#3F489A] mt-4 text-sm md:text-base leading-relaxed">
            Từ kinh nghiệm dạy online cho trẻ em Việt sinh ra tại nước ngoài chỉ biết tiếng Anh học tiếng mẹ đẻ. Vietsure tiếp tục xây dựng lộ trình học tiếng Anh cho trẻ em Việt Nam từ &quot;Nền tảng - Theo 1 lộ trình học liền mạch, cá nhân hóa - Dùng cả đời&quot; giúp trẻ tiến bộ, tự tin phản xạ tiếng Anh trong cuộc sống như trẻ em nước ngoài và chuẩn chương trình Cambridge.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content: Diagram Image with Overlaid Text */}
          <div className="w-full lg:w-[65%] flex justify-center">
            <div className="relative w-full max-w-[580px] aspect-[580/460]">
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
              <div className="absolute left-[8%] md:left-[10%] top-[63%] -translate-y-1/2 w-[90px] md:w-[110px] text-center pointer-events-none select-none">
                <span className="text-[#2E357F] font-black text-xs md:text-sm lg:text-base leading-tight uppercase block">
                  LỘ TRÌNH
                </span>
                <span className="text-[#2E357F] font-black text-xs md:text-sm lg:text-base leading-tight uppercase block">
                  HỌC
                </span>
              </div>

              {/* Overlaid text: Card 1 */}
              <div className="absolute left-[40%] top-[8%] w-[55%] text-left">
                <h4 className="font-extrabold text-[#2E357F] text-[10px] md:text-xs lg:text-sm uppercase leading-tight">
                  TIẾNG ANH MẪU GIÁO
                </h4>
                <p className="text-[8px] md:text-[10px] font-bold text-[#2E357F]/80">
                  (Từ 4-5 tuổi)
                </p>
              </div>

              {/* Overlaid text: Card 2 */}
              <div className="absolute left-[58%] top-[32%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#3b82f6] text-[10px] md:text-xs lg:text-sm uppercase leading-tight">
                  TIẾNG ANH THIẾU NHI
                </h4>
                <p className="text-[8px] md:text-[10px] font-bold text-[#3b82f6]/80">
                  (Từ 6 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 3 */}
              <div className="absolute left-[58%] top-[61%] w-[38%] text-left">
                <h4 className="font-extrabold text-[#38bdf8] text-[10px] md:text-xs lg:text-sm uppercase leading-tight">
                  TIẾNG ANH THIẾU NIÊN
                </h4>
                <p className="text-[8px] md:text-[10px] font-bold text-[#38bdf8]/80">
                  (Từ 6 tuổi trở lên)
                </p>
              </div>

              {/* Overlaid text: Card 4 */}
              <div className="absolute left-[48%] top-[87%] w-[46%] text-left">
                <h4 className="font-extrabold text-[#78a5db] text-[10px] md:text-xs lg:text-sm uppercase leading-tight">
                  IELTS
                </h4>
                <p className="text-[8px] md:text-[10px] font-bold text-[#78a5db]/80">
                  (Từ 13 tuổi trở lên)
                </p>
              </div>

            </div>
          </div>

          {/* Right Content: Mascot and CTA */}
          <div className="w-full lg:w-[30%] flex flex-col items-center justify-center text-center">
            <div className="relative select-none pointer-events-none mb-6">
              <Image 
                src="/images/character-penguin.png" 
                alt="VietSure Penguin Mascot" 
                width={280} 
                height={280} 
                className="w-64 h-auto object-contain animate-float-up"
              />
            </div>
            
            <a 
              href="#trial-section" 
              className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-3.5 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-sm uppercase tracking-wide"
            >
              Học thử miễn phí
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
