import Image from "next/image";

export default function CertificateSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-white to-sky-50/20 overflow-hidden" data-purpose="certificate-section">
      <div className="w-full max-w-none px-6 md:px-16 lg:px-28 flex flex-col sm:flex-row items-center gap-10 sm:gap-0 relative">
        
        {/* Left Column: Text Content */}
        <div className="w-full sm:w-[70%] lg:w-[78%] z-10">
          <h2 className="section-title mb-6">
            HỆ THỐNG BÀI GIẢNG <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
          <div className="bg-white rounded-[32px] brand-light-border p-8 md:p-10 pr-8 sm:pr-20 md:pr-24 lg:pr-32 shadow-[0_10px_35px_rgba(96,165,250,0.08)]">
            <p className="text-[#2E357F] font-bold text-base md:text-[17px] leading-relaxed">
              Đội ngũ Vietsure English đã được chứng nhận chuyên môn bởi đơn vị đào tạo thiết kế bài giảng hàng đầu Việt Nam. Vietsure English sẽ mang đến &quot;Hệ thống chương trình bài giảng đạt tiêu chuẩn cao&quot; trực quan, khoa học, sinh động, hoạt hình 3D và nội dung tương tác giúp trẻ hứng thú, ghi nhớ nhanh và chủ động học tập.
            </p>
          </div>
        </div>

        {/* Right Column: Certificate Image */}
        <div className="w-full max-w-[320px] sm:max-w-none sm:w-[30%] lg:w-[32%] flex-shrink-0 sm:-ml-16 lg:-ml-24 z-20 flex justify-center mt-8 sm:mt-0">
          <div className="relative rotate-0 sm:rotate-[4deg] hover:rotate-0 transition-transform duration-300 select-none pointer-events-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.18)]">
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
