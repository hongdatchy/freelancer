import Image from "next/image";

export default function MediaSection() {
    return (
        <section className="px-6 py-10 bg-gradient-to-b from-[#EBF5FF] to-white overflow-hidden">
            <div className="w-full max-w-none px-6 md:px-16 lg:px-28">
                
                {/* Logos */}
                <div className="flex flex-wrap items-center justify-around gap-10 md:gap-16">
                    {[
                        { src: "/images/media-3.png", alt: "VnExpress" },
                        { src: "/images/media-2.png", alt: "Tuổi Trẻ" },
                        { src: "/images/media-5.png", alt: "VTV1" },
                        { src: "/images/media-4.png", alt: "Thanh Niên" },
                        { src: "/images/media-1.png", alt: "HTV7" },
                    ].map((logo) => (
                        <div 
                            key={logo.alt} 
                            className="bg-white/40 p-4 rounded-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-[0_8px_25px_rgba(59,130,246,0.04)]"
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
        </section>
    );
}
