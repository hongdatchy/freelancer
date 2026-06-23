import Image from "next/image";

export default function ValuesSection() {
  return (
    <section className="px-6 pt-20 pb-20 2xl:pb-[240px] bg-gradient-to-b from-sky-50/20 to-white overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
        <h2 className="section-title text-center mb-12">
          GIÁ TRỊ PHỤ HUYNH THẬT SỰ NHẬN ĐƯỢC SAU MỖI KHÓA HỌC
        </h2>

        <div className="relative flex flex-col items-center justify-center min-h-[400px]">
          
          {/* Central Card */}
          <div className="w-full max-w-[950px] bg-[#3F489A] rounded-[32px] border-8 border-white p-8 md:p-14 text-center shadow-[0_0_45px_rgba(30,58,138,0.65)] text-white z-10">
            <div className="space-y-8 md:space-y-10">
              <div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[26px] font-semibold opacity-95 leading-relaxed tracking-widest">
                  Con không chỉ giỏi tiếng Anh, mà còn là một em bé:
                </p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-[34px] font-extrabold text-yellow-300 mt-2.5">
                  “Tự tin – Tử tế – Chủ động – Hội nhập”
                </p>
              </div>

              <div>
                <h4 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[28px] font-bold text-yellow-300">
                  Phát triển Tiếng Anh toàn diện
                </h4>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-[22px] font-medium opacity-90 mt-2 leading-relaxed tracking-widest">
                  Tự tin giao tiếp tiếng Anh và sẵn sàng hội nhập từ sớm
                </p>
              </div>

              <div>
                <h4 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[28px] font-bold text-yellow-300">
                  Trưởng thành tính cách & kỹ năng
                </h4>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-[22px] font-medium opacity-90 mt-2 leading-relaxed tracking-widest">
                  Sở hữu những phẩm chất tốt để phát triển tương lai
                </p>
              </div>
            </div>
          </div>

          {/* Characters Wrapper */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 mt-12 2xl:mt-0 2xl:absolute 2xl:inset-0 2xl:pointer-events-none">
            
            {/* Boy Character (Left) */}
            <div className="w-[200px] md:w-[250px] 2xl:w-[300px] flex-shrink-0 2xl:absolute 2xl:left-0 2xl:top-[80px] 2xl:z-30 2xl:pointer-events-auto animate-float-up">
              <Image 
                src="/images/character-mark.png" 
                alt="VietSure Student Boy" 
                width={350} 
                height={530} 
                className="w-full h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-x-[-1]"
              />
            </div>

            {/* Girl Character (Right) */}
            <div className="w-[220px] md:w-[280px] 2xl:w-[350px] flex-shrink-0 2xl:absolute 2xl:right-0 2xl:top-[80px] 2xl:z-30 2xl:pointer-events-auto animate-float-down">
              <Image 
                src="/images/character-sue.png" 
                alt="VietSure Student Girl" 
                width={350} 
                height={530} 
                className="w-full h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
