import Image from 'next/image';

export default function CourseRoadmapSection() {
  return (
    <section className="py-20 bg-white" data-purpose="course-roadmap">
      
      {/* Header */}
      <div className="text-center w-full mb-10 px-6 md:px-16 lg:px-28">
        <h2 className="section-title text-[#2E357F] font-black leading-tight">
          CHƯƠNG TRÌNH HỌC TIẾNG ANH ONLINE CHẤT LƯỢNG CAO DÀNH CHO CÁC BÉ
        </h2>
        <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#3F489A] mt-3">
          (Lớp 1-1 & 1-4)
        </h3>
      </div>

      {/* Roadmap Diagram Image - FULL WIDTH */}
      <div className="w-full my-12 select-none pointer-events-none">
        <Image
          src="/images/ctr-hoc.png"
          alt="Chương trình học tiếng Anh online chất lượng cao dành cho các bé"
          width={1920}
          height={1200}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-10 px-6 md:px-16 lg:px-28">
        <a
          href="#trial-section"
          className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-black py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-base md:text-lg uppercase tracking-wide"
        >
          Học thử miễn phí
        </a>
      </div>

    </section>
  );
}
