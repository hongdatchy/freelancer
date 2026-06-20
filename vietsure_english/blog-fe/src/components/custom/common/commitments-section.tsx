import Image from "next/image";

export default function CommitmentsSection() {
  return (
    <section className="py-20 bg-sky-50 relative overflow-hidden" data-purpose="commitments">
      <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
        <h2 className="section-title text-[#ff791a] text-center mb-16">
          Cam Kết
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Column 1: Chất lượng & Dịch vụ */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[32px] brand-light-border shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-4">Chất lượng</h4>
              <p className="text-[#1e3a8a] font-semibold text-base md:text-lg">Phát triển nghe - hiểu - phản xạ - giao tiếp một cách liền mạch</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] brand-light-border shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-4">Dịch vụ</h4>
              <p className="text-[#1e3a8a] font-semibold text-base md:text-lg">Lớp học linh hoạt phù hợp với lịch trình của bé</p>
            </div>
          </div>

          {/* Column 2: Giáo viên & Hỗ trợ */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[32px] brand-light-border shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-4">Giáo viên</h4>
              <p className="text-[#1e3a8a] font-semibold text-base md:text-lg">Được đào tạo bài bản, giảng dạy nhất quán và theo sát từng học viên</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] brand-light-border shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-4">Hỗ trợ</h4>
              <p className="text-[#1e3a8a] font-semibold text-base md:text-lg">Đội ngũ hỗ trợ 24/7 đồng hành cùng phụ huynh</p>
            </div>
          </div>

          {/* Column 3: Certified Stamp */}
          <div className="flex items-center justify-center">
            <Image 
              src="/images/cambridge-commitment.png" 
              alt="Certified Badge" 
              width={500} 
              height={500} 
              className="w-full max-w-[400px] h-auto object-contain shadow-sm rounded-full bg-white p-4 border border-sky-100"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
