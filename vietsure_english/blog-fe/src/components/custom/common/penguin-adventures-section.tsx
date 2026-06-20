import Image from "next/image";

export default function PenguinAdventuresSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-sky-50/20 to-white overflow-hidden" data-purpose="penguin-adventures-section">
      <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
        
        {/* Header */}
        <div className="text-center max-w-none mx-auto mb-12">
          <h2 className="section-title text-center !font-extrabold !text-lg md:!text-xl lg:!text-2xl opacity-90">
            KHÁC BIỆT TỪ SERIES PHIM NGẮN TIẾNG ANH
          </h2>
          <h3 className="section-subtitle text-center text-[#FF6B00] !font-black !text-2xl md:!text-3xl lg:!text-4xl tracking-wider mt-2">
            &quot;PENGUIN ADVENTURES&quot;
          </h3>
          <p className="text-[#2E357F] font-semibold text-sm md:text-base leading-relaxed mt-4 opacity-90 max-w-3xl mx-auto">
            Penguin Adventures được thiết kế theo từng giai đoạn học gắn liền with những giá trị văn hóa người Việt Nam, giúp trẻ hứng thú học tập và chuyển từ &quot;học tiếng Anh&quot; sang &quot;sử dụng tiếng Anh&quot; một cách tự nhiên, chủ động.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Values Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Học viên */}
            <div className="bg-white rounded-[32px] brand-light-border p-6 md:p-8 shadow-[0_10px_35px_rgba(96,165,250,0.06)]">
              <h3 className="text-[#2E357F] font-black text-lg md:text-xl mb-4">
                Giá trị với học viên:
              </h3>
              <ul className="space-y-3">
                {[
                  "Khơi gợi sự hứng thú và cố gắng học tập của trẻ để mong chờ các tập tiếp theo",
                  "Tạo môi trường suy luận, phản biện và trao đổi bằng tiếng Anh về các tình huống trong phim",
                  "Tiếp thu tiếng Anh hiệu quả qua hành trình học tập gắn liền với những giá trị văn hóa Việt Nam",
                  "Tạo môi trường học tập chuẩn quốc tế, giúp trẻ học tiếng Anh như ngôn ngữ thứ hai"
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                    <span className="text-[#2E357F] font-semibold text-sm md:text-[15px] leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Phụ huynh */}
            <div className="bg-white rounded-[32px] brand-light-border p-6 md:p-8 shadow-[0_10px_35px_rgba(96,165,250,0.06)]">
              <h3 className="text-[#2E357F] font-black text-lg md:text-xl mb-4">
                Giá trị đối với phụ huynh:
              </h3>
              <ul className="space-y-3">
                {[
                  "Nhận thấy sự tiến bộ rõ rệt của con qua các thói quen học tập tích cực",
                  "Con học trong trạng thái hứng thú và chủ động, giảm áp lực ép học tại nhà",
                  "Tiết kiệm thời gian đồng hành tại nhà nhưng vẫn đảm bảo hiệu quả học tập",
                  "Yên tâm đồng hành cùng con trên lộ trình tiếng Anh chuẩn quốc tế, vẫn gìn giữ bản sắc Việt"
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                    <span className="text-[#2E357F] font-semibold text-sm md:text-[15px] leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Poster Image */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-[370px] lg:max-w-[420px] select-none pointer-events-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 border-4 border-[#2E357F]">
              <Image
                src="/images/penguin.png"
                alt="Poster Penguin Adventures Series Phim Ngắn Tiếng Anh"
                width={420}
                height={580}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
