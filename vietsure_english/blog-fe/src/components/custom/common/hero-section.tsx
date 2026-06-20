'use client';

import Image from 'next/image';
import BrandStats from './brand-stats';

type HeroSectionProps = {
  buttonText?: string;
  buttonHref?: string;
};

export default function HeroSection({
  buttonText = 'TÌM HIỂU THÊM',
  buttonHref = '#trial-section',
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[700px] lg:min-h-[850px] flex flex-col justify-center pt-6 pb-16 overflow-hidden bg-white w-full">
      {/* Custom background shapes to mimic the organic curves in the reference */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_top_right,rgba(254,243,199,0.4)_0%,transparent_70%)] z-0 pointer-events-none"></div>
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[50%] h-[60%] bg-[radial-gradient(circle_at_bottom_right,rgba(239,246,255,0.6)_0%,transparent_70%)] z-0 pointer-events-none"></div>

      <div className="w-full relative z-10 flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full pr-6 md:pr-12 lg:pr-20">
          
          {/* LeftContent - Visuals */}
          <div className="w-full lg:w-[48%] flex justify-start -ml-3 md:-ml-5 lg:-ml-6" data-purpose="hero-image-container">
            <div className="relative w-full shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-r-[40px] overflow-hidden">
              {/* Main Hero Image */}
              <Image 
                alt="VietSure English Online Class - Teacher and students with penguin mascot" 
                className="w-full h-auto object-cover" 
                data-purpose="primary-hero-image" 
                src="/images/Rectangle.png"
                width={800}
                height={600}
                priority
              />
            </div>
          </div>

          {/* RightContent - Typography and CTA */}
          <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6 px-6 lg:px-0">
            <div className="space-y-2 md:space-y-4" data-purpose="heading-group">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3F489A] tracking-wide uppercase">
                TIẾNG ANH PHẢN XẠ ONLINE QUỐC TẾ
              </h2>
              <h1 className="text-5xl md:text-6xl font-black text-[#FF6B00] leading-tight uppercase lg:text-7xl">
                CHẤT LƯỢNG CAO
              </h1>
              <p className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3F489A] opacity-90 uppercase">
                CHO TRẺ 4 - 12+ TẠI VIỆT NAM
              </p>
            </div>
            
            {/* Call to Action Button */}
            <div className="pt-4 lg:pt-8" data-purpose="cta-container">
              <a 
                className="inline-block bg-[#2E357F] hover:bg-[#3F489A] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg uppercase" 
                href={buttonHref} 
                role="button"
              >
                {buttonText}
              </a>
            </div>
          </div>

        </div>

        {/* Reusable Statistics Bar */}
        <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-0">
          <BrandStats />
        </div>
      </div>

      {/* Decorative Mascot Faded Background */}
      <div aria-hidden="true" className="absolute right-[-5%] bottom-[-5%] w-1/3 opacity-15 pointer-events-none hidden lg:block">
        <Image 
          alt="" 
          className="w-full h-auto" 
          src="/images/Hao hung, san sang.png"
          width={400}
          height={300}
        />
      </div>
    </section>
  );
}
