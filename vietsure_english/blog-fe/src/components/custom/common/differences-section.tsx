export default function DifferencesSection() {
  return (
    <section className="px-6 lg:py-20 py-10 bg-gradient-to-b from-[#F0F7FF] to-white overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-none mx-auto mb-16">
          <h2 className="section-title">
            ĐIỂM KHÁC BIỆT CỦA CHƯƠNG TRÌNH <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8 items-stretch w-full">

          {/* Card 1: CLIL (Top Left) */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center h-full lg:col-start-1 lg:row-start-1">
            <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
              Phương pháp giảng dạy<br />hiện đại CLIL
            </h3>
            <p className="section-desc">
              Tích hợp STEM (môn Toán & Khoa học) vào chương trình giúp học viên có nền tảng kiến thức phong phú và thực tiễn.
            </p>
          </div>

          {/* Card 2: Cambridge Skills (Bottom Left) */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center h-full lg:col-start-1 lg:row-start-2">
            <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
              Bộ kỹ năng chuẩn Cambridge
            </h3>
            <p className="section-desc">
              Đào tạo 6 kỹ năng sống thiết yếu chuẩn Cambridge Life Competencies Framework cho trẻ em quốc tế.
            </p>
          </div>

          {/* Center Column: Circle */}
          <div className="flex items-center justify-center h-full lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="bg-white rounded-full aspect-square border-2 border-sky-400 shadow-[0_15px_40px_rgba(59,130,246,0.06)] p-8 md:p-10 flex flex-col justify-center items-center text-center max-w-[380px] md:max-w-[400px] lg:max-w-[420px] w-full">
              <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-4">
                Giáo trình độc quyền<br />chuẩn Cambridge
              </h3>
              <p className="section-desc max-w-[320px]">
                Phát triển toàn diện từ vựng & ngữ pháp từng cấp độ qua bài giảng sinh động để giúp học viên tự tin 4 kỹ năng (Nghe - nói - đọc - viết) chinh phục các kỳ thi Quốc tế.
              </p>
            </div>
          </div>

          {/* Card 4: Edutainment (Top Right) */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center h-full lg:col-start-3 lg:row-start-1">
            <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
              Học tập theo mô<br />hình "Edutainment"
            </h3>
            <p className="section-desc">
              Kết hợp giáo dục và giải trí hiện đại, sinh động thông qua game, đọc truyện, ca hát và series phim ngắn về hành trình của Penguin, khơi gợi niềm yêu thích học tiếng Anh cho trẻ.
            </p>
          </div>

          {/* Card 5: Citizen (Bottom Right) */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-sky-400 shadow-[0_10px_30px_rgba(59,130,246,0.03)] text-center flex flex-col justify-center h-full lg:col-start-3 lg:row-start-2">
            <h3 className="text-base md:text-lg font-extrabold text-[#2E357F] mb-3">
              Rèn luyện tư duy công dân<br />toàn cầu, đậm bản sắc Việt Nam
            </h3>
            <p className="section-desc">
              Tích hợp thêm các giá trị tốt đẹp của người Việt Nam
            </p>
          </div>

        </div>

        {/* Bottom Trial Button */}
        <div className="flex justify-center mt-16">
          <a
            href="#trial-section"
            className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-900/25 text-base tracking-wide"
          >
            Học thử miễn phí
          </a>
        </div>

      </div>
    </section>
  );
}
