import Image from 'next/image';
import BtnTrial from './btn-trial';

export default function CourseRoadmapSection() {
  return (
    <section className="lg:py-20 py-10 bg-white" data-purpose="course-roadmap">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center w-full mb-10">
          <h2 className="section-title text-[#2E357F] font-black leading-tight">
            CHƯƠNG TRÌNH HỌC TIẾNG ANH ONLINE <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
          <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#3F489A] mt-3">
            (Lớp 1-1 & 1-4)
          </h3>
        </div>

        {/* Roadmap Diagram Image - Desktop View (Hidden on Mobile) */}
        <div className="hidden md:block w-full my-12 select-none pointer-events-none">
          <Image
            src="/images/ctr-hoc.png"
            alt="Chương trình học tiếng Anh online chất lượng cao dành cho các bé"
            width={1920}
            height={1200}
            className="w-full h-auto object-contain rounded-2xl"
            priority
          />
        </div>

        {/* Mobile View: Vertical Zigzag Roadmap for better readability */}
        <div className="md:hidden flex flex-col gap-8 my-10 relative">
          {/* Vertical connecting line in the background */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2E357F] via-[#FF6B00] to-[#2E357F] -translate-x-1/2 rounded-full opacity-30" />

          {/* Step 1: Tiếng Anh Mầm Non (Left) */}
          <div className="flex items-start justify-end w-full pr-[55%] relative">
            <div className="bg-[#3F489A] rounded-[24px] p-4 border-4 border-white shadow-lg text-right">
              <span className="inline-block text-[10px] font-bold text-[#ff791a] mb-1">
                Ages 4 - 6
              </span>
              <h4 className="text-sm font-black text-yellow-300 uppercase leading-tight">
                Tiếng Anh Mầm Non
              </h4>
              <p className="text-[11px] text-white/90 mt-1 font-medium leading-relaxed">
                Làm quen phản xạ tự nhiên thông qua hình ảnh, trò chơi và âm nhạc sinh động.
              </p>
            </div>
            {/* Center Node */}
            <div className="absolute right-1/2 translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 border-white bg-[#2E357F] shadow-sm z-10" />
          </div>

          {/* Step 2: Tiếng Anh Tiểu Học (Right) */}
          <div className="flex items-start justify-start w-full pl-[55%] relative">
            <div className="bg-[#3F489A] rounded-[24px] p-4 border-4 border-white shadow-lg text-left">
              <span className="inline-block text-[10px] font-bold text-[#ff791a] mb-1">
                Ages 6 - 11
              </span>
              <h4 className="text-sm font-black text-yellow-300 uppercase leading-tight">
                Tiếng Anh Tiểu Học
              </h4>
              <p className="text-[11px] text-white/90 mt-1 font-medium leading-relaxed">
                Xây dựng vững chắc nền tảng từ vựng, ngữ pháp và phát triển toàn diện 4 kỹ năng.
              </p>
            </div>
            {/* Center Node */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 border-white bg-[#FF6B00] shadow-sm z-10" />
          </div>

          {/* Step 3: Tiếng Anh THCS & THPT (Left) */}
          <div className="flex items-start justify-end w-full pr-[55%] relative">
            <div className="bg-[#3F489A] rounded-[24px] p-4 border-4 border-white shadow-lg text-right">
              <span className="inline-block text-[10px] font-bold text-[#ff791a] mb-1">
                Ages 11 - 18
              </span>
              <h4 className="text-sm font-black text-yellow-300 uppercase leading-tight">
                Tiếng Anh Phổ Thông
              </h4>
              <p className="text-[11px] text-white/90 mt-1 font-medium leading-relaxed">
                Tập trung luyện đề chuẩn, mở rộng ngữ pháp học thuật phục vụ thi cử & chứng chỉ quốc tế.
              </p>
            </div>
            {/* Center Node */}
            <div className="absolute right-1/2 translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 border-white bg-[#2E357F] shadow-sm z-10" />
          </div>

          {/* Step 4: Luyện Thi Chứng Chỉ (Right) */}
          <div className="flex items-start justify-start w-full pl-[55%] relative">
            <div className="bg-[#3F489A] rounded-[24px] p-4 border-4 border-white shadow-lg text-left">
              <span className="inline-block text-[10px] font-bold text-[#ff791a] mb-1">
                Ages 12+
              </span>
              <h4 className="text-sm font-black text-yellow-300 uppercase leading-tight">
                Luyện Thi IELTS/CEFR
              </h4>
              <p className="text-[11px] text-white/90 mt-1 font-medium leading-relaxed">
                Bứt phá điểm số mục tiêu với phương pháp tư duy logic và kỹ năng làm bài chuyên sâu.
              </p>
            </div>
            {/* Center Node */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 border-white bg-[#FF6B00] shadow-sm z-10" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <BtnTrial className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-black py-3 px-6 md:py-5 md:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-sm md:text-lg tracking-wide" />
        </div>

      </div>
    </section>
  );
}
