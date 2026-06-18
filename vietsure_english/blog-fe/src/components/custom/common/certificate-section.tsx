import Image from "next/image";

export default function CertificateSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-white to-sky-50/20 overflow-hidden" data-purpose="certificate-section">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-0 relative">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[78%] z-10">
          <h2 className="text-xl md:text-2xl lg:text-[32px] font-black text-[#2E357F] uppercase tracking-wide mb-6 text-left">
            HỆ THỐNG BÀI GIẢNG <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
          <div className="bg-white rounded-[32px] border-[3px] border-[#60A5FA] p-8 md:p-10 pr-8 lg:pr-32 shadow-[0_10px_35px_rgba(96,165,250,0.08)]">
            <p className="text-[#2E357F] font-bold text-base md:text-[17px] leading-relaxed">
              Đội ngũ Vietsure English đã được chứng nhận chuyên môn bởi đơn vị đào tạo thiết kế bài giảng hàng đầu Việt Nam. Vietsure English sẽ mang đến &quot;Hệ thống chương trình bài giảng đạt tiêu chuẩn cao&quot; trực quan, khoa học, sinh động, hoạt hình 3D và nội dung tương tác giúp trẻ hứng thú, ghi nhớ nhanh và chủ động học tập.
            </p>
          </div>
        </div>

        {/* Right Column: Certificate Image */}
        <div className="w-full sm:w-[450px] lg:w-[32%] flex-shrink-0 lg:-ml-24 z-20 flex justify-center">
          <div className="relative rotate-[4deg] hover:rotate-0 transition-transform duration-300 select-none pointer-events-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.18)]">
            <Image
              src="/images/Trang chu_certificate.png"
              alt="Chứng nhận chuyên môn Vietsure English"
              width={500}
              height={380}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
