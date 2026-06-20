export default function DifferencesSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-white to-sky-50/20 overflow-hidden">
      <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
        
        {/* Header */}
        <div className="text-center max-w-none mx-auto mb-16">
          <h2 className="section-title">
            ĐIỂM KHÁC BIỆT CỦA CHƯƠNG TRÌNH <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center w-full">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 h-full justify-center">
            {/* Card 1: CLIL */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center min-h-[190px]">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
                Phương pháp giảng dạy<br />hiện đại CLIL
              </h3>
              <p className="text-[#2E357F] text-xs md:text-sm leading-relaxed">
                Tích hợp STEM (môn Toán & Khoa học) vào chương trình giúp học viên có nền tảng kiến thức phong phú và thực tiễn.
              </p>
            </div>

            {/* Card 2: Cambridge Skills */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center min-h-[190px]">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
                Bộ kỹ năng chuẩn Cambridge
              </h3>
              <p className="text-[#2E357F] text-xs md:text-sm leading-relaxed">
                Đào tạo 6 kỹ năng sống thiết yếu chuẩn Cambridge Life Competencies Framework cho trẻ em quốc tế.
              </p>
            </div>
          </div>

          {/* Center Column: Circle */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-full aspect-square border-2 border-sky-400 shadow-[0_15px_40px_rgba(59,130,246,0.06)] p-8 md:p-10 flex flex-col justify-center items-center text-center max-w-[380px] md:max-w-[400px] lg:max-w-[420px] w-full">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-4">
                Giáo trình độc quyền<br />chuẩn Cambridge
              </h3>
              <p className="text-[#2E357F] text-xs md:text-sm leading-relaxed max-w-[320px]">
                Phát triển toàn diện từ vựng & ngữ pháp từng cấp độ qua bài giảng sinh động để giúp học viên tự tin 4 kỹ năng (Nghe - nói - đọc - viết) chinh phục các kỳ thi Quốc tế.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 h-full justify-center">
            {/* Card 4: Edutainment */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center min-h-[190px]">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
                Học tập theo mô<br />hình "Edutainment"
              </h3>
              <p className="text-[#2E357F] text-xs md:text-sm leading-relaxed">
                Kết hợp giáo dục và giải trí hiện đại, sinh động thông qua game, đọc truyện, ca hát và series phim ngắn về hành trình của Penguin, khơi gợi sáng tạo và niềm yêu thích học tiếng Anh cho trẻ.
              </p>
            </div>

            {/* Card 5: Citizen */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center min-h-[190px]">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
                Rèn luyện tư duy công dân<br />toàn cầu, đậm bản sắc Việt Nam
              </h3>
              <p className="text-[#2E357F] text-xs md:text-sm leading-relaxed">
                Tích hợp thêm các giá trị tốt đẹp của người Việt Nam
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Trial Button */}
        <div className="flex justify-center mt-16">
          <a 
            href="#trial-section" 
            className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-900/25 text-base uppercase tracking-wide"
          >
            Học Thử Miễn Phí
          </a>
        </div>

      </div>
    </section>
  );
}
