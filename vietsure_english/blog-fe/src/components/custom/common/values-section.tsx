import Image from "next/image";

export default function ValuesSection() {
  return (
    <section className="px-6 pt-20 pb-[150px] bg-gradient-to-b from-sky-50/20 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#2E357F] text-center uppercase tracking-wide mb-12">
          GIÁ TRỊ PHỤ HUYNH THẬT SỰ NHẬN ĐƯỢC SAU MỖI KHÓA HỌC
        </h2>

        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 min-h-[400px]">
          
          {/* Boy Character (Left) */}
          <div className="w-[155px] md:w-[190px] lg:w-[210px] flex-shrink-0 order-2 lg:order-1 lg:absolute lg:left-0 lg:top-[120px] lg:z-20 animate-float-up">
            <Image 
              src="/images/character-mark.png" 
              alt="VietSure Student Boy" 
              width={250} 
              height={380} 
              className="w-full h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-x-[-1]"
            />
          </div>

          {/* Central Card */}
          <div className="w-full max-w-[620px] bg-[#3F489A] rounded-[32px] border-4 border-white p-8 md:p-10 text-center shadow-[0_15px_40px_rgba(59,130,246,0.25)] text-white order-1 lg:order-2 z-10">
            <div className="space-y-6 md:space-y-8">
              <div>
                <p className="text-sm md:text-base font-semibold opacity-95 leading-relaxed">
                  Con không chỉ giỏi tiếng Anh, mà còn là một em bé:
                </p>
                <p className="text-base md:text-lg font-bold text-yellow-300 mt-2">
                  “Tự tin – Tử tế – Chủ động – Hội nhập”
                </p>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-bold text-yellow-300">
                  Phát triển Tiếng Anh toàn diện
                </h4>
                <p className="text-xs md:text-sm font-medium opacity-90 mt-1 leading-relaxed">
                  Tự tin giao tiếp tiếng Anh và sẵn sàng hội nhập từ sớm
                </p>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-bold text-yellow-300">
                  Trưởng thành tính cách & kỹ năng
                </h4>
                <p className="text-xs md:text-sm font-medium opacity-90 mt-1 leading-relaxed">
                  Sở hữu những phẩm chất tốt để phát triển tương lai
                </p>
              </div>
            </div>
          </div>

          {/* Girl Character (Right) */}
          <div className="w-[180px] md:w-[220px] lg:w-[250px] flex-shrink-0 order-3 lg:absolute lg:right-0 lg:top-[120px] lg:z-20 animate-float-down">
            <Image 
              src="/images/character-sue.png" 
              alt="VietSure Student Girl" 
              width={250} 
              height={380} 
              className="w-full h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
