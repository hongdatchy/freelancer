import Image from "next/image";

export default function CertificateSection() {
  return (
    <section className="px-6 lg:py-20 py-10 bg-gradient-to-b from-white to-[#F0F7FF] overflow-hidden" data-purpose="certificate-section">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-0 relative">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[78%] z-10">
          <h2 className="section-title mb-6 lg:pr-32 text-center lg:text-left">
            HỆ THỐNG BÀI GIẢNG <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
          <div className="bg-white rounded-[32px] brand-light-border p-4 lg:p-8 md:p-10 lg:pr-32 shadow-[0_10px_35px_rgba(96,165,250,0.08)]">
            <p className="text-[#2E357F] section-desc-justify font-bold text-base md:text-[17px] leading-relaxed text-center lg:text-left">
              Đội ngũ Vietsure English đã được chứng nhận chuyên môn bởi đơn vị đào tạo thiết kế bài giảng hàng đầu Việt Nam. Vietsure English sẽ mang đến &quot;Hệ thống chương trình bài giảng đạt tiêu chuẩn cao&quot; trực quan, khoa học, sinh động, hoạt hình 3D và nội dung tương tác giúp trẻ hứng thú, ghi nhớ nhanh và chủ động học tập.
            </p>
          </div>
        </div>

        {/* Right Column: Certificate Image */}
        <div className="w-full max-w-[480px] lg:max-w-none lg:w-[32%] flex-shrink-0 lg:-ml-24 z-20 flex justify-center mt-8 lg:mt-0 mx-auto lg:mx-0">
          <div className="relative rotate-0 lg:rotate-[4deg] hover:rotate-0 transform-gpu transition-transform duration-300 select-none pointer-events-none shadow-[0_15px_35px_rgba(0,0,0,0.18)]" style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
            <Image
              src="/images/Trang chu_certificate.png"
              alt="Chứng nhận chuyên môn Vietsure English"
              width={500}
              height={380}
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
        </div>

      </div>
    </section>
  );
}
