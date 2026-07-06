import Image from 'next/image';
import BtnTrial from './btn-trial';

export default function CourseRoadmapSection() {
  return (
    <section className="lg:py-20 py-10 bg-white" data-purpose="course-roadmap">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center w-full mb-10">
          <h2 className="section-title text-[#2E357F] font-black leading-snug">
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

        {/* Mobile View: Top-Badge Card Layout */}
        <div className="md:hidden flex flex-col gap-8 my-10 relative px-2 w-full">

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-3 w-full relative z-0">
            {/* Top Badge */}
            <div className="bg-white rounded-[24px] border-[1.5px] border-[#ff791a]/50 p-2.5 pr-6 flex items-center gap-4 w-[95%] shadow-[0_8px_20px_rgba(255,121,26,0.08)] relative z-10">
              <div className="w-12 h-12 rounded-[16px] bg-[#ff791a]/15 text-[#ff791a] flex items-center justify-center font-black text-[22px] shrink-0">1</div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] text-gray-500 font-semibold leading-normal mb-0.5">4 - 5 tuổi</span>
                <span className="text-[15px] font-black text-[#1b2b85] uppercase leading-snug pt-0.5">Tiếng anh mẫu giáo</span>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-full bg-[#3F489A] rounded-[24px] pt-7 pb-6 px-6 border-[3px] border-[#e2f0ff] shadow-lg text-left relative z-0">
              <h5 className="text-[13px] font-bold text-yellow-300 uppercase mb-2 tracking-widest">Nội dung</h5>
              <p className="text-[14px] md:text-[15px] text-white/95 font-medium leading-relaxed">
                Chương trình giúp trẻ làm quen với tiếng Anh thông qua các hoạt động tương tác, vẽ, bài hát, trò chơi và đọc truyện. Trẻ phát triển khả năng nghe hiểu, phát âm chuẩn và hình thành sự tự tin khi giao tiếp bằng tiếng Anh ngay từ những năm đầu đời.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-3 w-full relative z-0">
            {/* Top Badge */}
            <div className="bg-white rounded-[24px] border-[1.5px] border-[#ff791a]/50 p-2.5 pr-6 flex items-center gap-4 w-[95%] shadow-[0_8px_20px_rgba(255,121,26,0.08)] relative z-10">
              <div className="w-12 h-12 rounded-[16px] bg-[#ff791a]/15 text-[#ff791a] flex items-center justify-center font-black text-[22px] shrink-0">2</div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] text-gray-500 font-semibold leading-normal mb-0.5">Từ 6 - 11 tuổi</span>
                <span className="text-[15px] font-black text-[#1b2b85] uppercase leading-snug pt-0.5">Tiếng Anh thiếu nhi</span>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-full bg-[#3F489A] rounded-[24px] pt-7 pb-6 px-6 border-[3px] border-[#e2f0ff] shadow-lg text-left relative z-0">
              <h5 className="text-[13px] font-bold text-yellow-300 uppercase mb-2 tracking-widest">Nội dung</h5>
              <p className="text-[14px] md:text-[15px] text-white/95 font-medium leading-relaxed">
                Chương trình phát triển toàn diện 4 kỹ năng Nghe – Nói – Đọc – Viết, giúp học sinh sử dụng tiếng Anh tự nhiên trong học tập và giao tiếp hằng ngày. Nội dung được thiết kế phù hợp với độ tuổi và khả năng tiếp thu của trẻ để chuẩn bị cho các chứng chỉ của Cambridge như Starters, Movers, Flyers.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-3 w-full relative z-0">
            {/* Top Badge */}
            <div className="bg-white rounded-[24px] border-[1.5px] border-[#ff791a]/50 p-2.5 pr-6 flex items-center gap-4 w-[95%] shadow-[0_8px_20px_rgba(255,121,26,0.08)] relative z-10">
              <div className="w-12 h-12 rounded-[16px] bg-[#ff791a]/15 text-[#ff791a] flex items-center justify-center font-black text-[22px] shrink-0">3</div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] text-gray-500 font-semibold leading-normal mb-0.5">Từ 11 tuổi</span>
                <span className="text-[15px] font-black text-[#1b2b85] uppercase leading-snug pt-0.5">Tiếng Anh thiếu niên</span>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-full bg-[#3F489A] rounded-[24px] pt-7 pb-6 px-6 border-[3px] border-[#e2f0ff] shadow-lg text-left relative z-0">
              <h5 className="text-[13px] font-bold text-yellow-300 uppercase mb-2 tracking-widest">Nội dung</h5>
              <p className="text-[14px] md:text-[15px] text-white/95 font-medium leading-relaxed">
                Chương trình giúp học viên nâng cao khả năng giao tiếp, tư duy bằng tiếng Anh và kỹ năng học thuật. Học viên được rèn luyện khả năng trình bày ý kiến, thuyết trình và sử dụng tiếng Anh trong môi trường quốc tế để chuẩn bị cho các kỳ thi Cambridge như KET, PET và chương trình tiền IELTS.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-3 w-full relative z-0">
            {/* Top Badge */}
            <div className="bg-white rounded-[24px] border-[1.5px] border-[#ff791a]/50 p-2.5 pr-6 flex items-center gap-4 w-[95%] shadow-[0_8px_20px_rgba(255,121,26,0.08)] relative z-10">
              <div className="w-12 h-12 rounded-[16px] bg-[#ff791a]/15 text-[#ff791a] flex items-center justify-center font-black text-[22px] shrink-0">4</div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] text-gray-500 font-semibold leading-normal mb-0.5">Từ 13 - 18 tuổi</span>
                <span className="text-[15px] font-black text-[#1b2b85] uppercase leading-snug pt-0.5">IELTS</span>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-full bg-[#3F489A] rounded-[24px] pt-7 pb-6 px-6 border-[3px] border-[#e2f0ff] shadow-lg text-left relative z-0">
              <h5 className="text-[13px] font-bold text-yellow-300 uppercase mb-2 tracking-widest">Nội dung</h5>
              <p className="text-[14px] md:text-[15px] text-white/95 font-medium leading-relaxed">
                Khóa học được xây dựng theo chuẩn IELTS quốc tế, giúp học viên phát triển chiến lược làm bài hiệu quả cho 4 kỹ năng (Listening - Reading - Writing - Speaking) và nâng cao năng lực sử dụng tiếng Anh học thuật để chinh phục mục tiêu IELTS từ 5.5 – 7.5+
              </p>
            </div>
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
