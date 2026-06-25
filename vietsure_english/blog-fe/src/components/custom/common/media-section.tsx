import Image from "next/image";

export default function MediaSection() {
    const logos = [
        { src: "/images/media-3.png", alt: "VnExpress" },
        { src: "/images/media-2.png", alt: "Tuổi Trẻ" },
        { src: "/images/media-5.png", alt: "VTV1" },
        { src: "/images/media-4.png", alt: "Thanh Niên" },
        { src: "/images/media-1.png", alt: "HTV7" },
        { src: "/images/media-6.png", alt: "cafebiz" },
        { src: "/images/media-7.png", alt: "24h" },
    ];

    // Duplicate the logos to create a seamless infinite scrolling list
    const marqueeLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-10 bg-gradient-to-b from-white to-[#F0F7FF]">
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 relative">
                <div className="w-full relative overflow-hidden rounded-lg">
                    <div className="animate-marquee gap-8 md:gap-16 py-4 flex w-max">
                    {marqueeLogos.map((logo, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white/40 p-4 rounded-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-[0_8px_25px_rgba(59,130,246,0.04)] w-[160px] md:w-[200px] flex-shrink-0"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={140}
                                height={54}
                                className="object-contain max-h-[50px] w-auto filter grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </section>
    );
}
