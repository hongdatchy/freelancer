import Image from 'next/image';

export default function CourseRoadmapSection() {
  return (
    <section className="py-20 bg-white" data-purpose="course-roadmap">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center w-full mb-10">
          <h2 className="section-title text-[#2E357F] font-black leading-tight">
            CHƯƠNG TRÌNH HỌC TIẾNG ANH ONLINE <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
          </h2>
          <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#3F489A] mt-3">
            (Lớp 1-1 & 1-4)
          </h3>
        </div>

        {/* Roadmap Diagram Image - FULL WIDTH WITHIN CONTAINER */}
        <div className="w-full my-12 select-none pointer-events-none">
          <Image
            src="/images/ctr-hoc.png"
            alt="Chương trình học tiếng Anh online chất lượng cao dành cho các bé"
            width={1920}
            height={1200}
            className="w-full h-auto object-contain rounded-2xl"
            priority
          />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <a
            href="#trial-section"
            className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-black py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-base md:text-lg tracking-wide"
          >
            Học thử miễn phí
          </a>
        </div>

      </div>
    </section>
  );
}
