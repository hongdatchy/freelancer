import Image from "next/image";

export default function CommitmentsSection() {
  return (
    <section className="py-20 bg-sky-50 relative overflow-hidden" data-purpose="commitments">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#ff791a] text-center mb-16 uppercase tracking-wider">
          Cam Kết
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Column 1: Chất lượng & Dịch vụ */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[32px] border-2 border-[#7cbef7] shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-xl font-black text-[#1e3a8a] uppercase mb-2">Chất lượng</h4>
              <p className="text-[#1e3a8a] font-semibold text-sm">Phát triển nghe - hiểu - phản xạ - giao tiếp một cách liền mạch</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] border-2 border-[#7cbef7] shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-xl font-black text-[#1e3a8a] uppercase mb-2">Dịch vụ</h4>
              <p className="text-[#1e3a8a] font-semibold text-sm">Lớp học linh hoạt phù hợp với lịch trình của bé</p>
            </div>
          </div>

          {/* Column 2: Giáo viên & Hỗ trợ */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[32px] border-2 border-[#7cbef7] shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-xl font-black text-[#1e3a8a] uppercase mb-2">Giáo viên</h4>
              <p className="text-[#1e3a8a] font-semibold text-sm">Được đào tạo bài bản, giảng dạy nhất quán và theo sát từng học viên</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] border-2 border-[#7cbef7] shadow-sm flex flex-col items-center justify-center text-center min-h-[190px]">
              <h4 className="text-xl font-black text-[#1e3a8a] uppercase mb-2">Hỗ trợ</h4>
              <p className="text-[#1e3a8a] font-semibold text-sm">Đội ngũ hỗ trợ 24/7 đồng hành cùng phụ huynh</p>
            </div>
          </div>

          {/* Column 3: Certified Stamp */}
          <div className="flex items-center justify-center">
            <Image 
              src="/images/cambridge-commitment.png" 
              alt="Certified Badge" 
              width={300} 
              height={300} 
              className="w-64 h-auto object-contain shadow-sm rounded-full bg-white p-4 border border-sky-100"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
