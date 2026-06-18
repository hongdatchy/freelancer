"use client";

const ratingCards = [
    {
        name: 'Trình Ngô',
        role: 'Local Guide • 61 bài đánh giá • 127 ảnh',
        content: 'Con tiến bộ rõ rệt về phát âm và vốn từ vựng chỉ sau 3 tháng học online, vượt mong đợi của gia đình !',
    },
    {
        name: 'SupeAlien',
        role: 'Local Guide • 88 bài đánh giá • 103 ảnh',
        content: 'Tôi đánh giá cao cách trung tâm thường xuyên update tình hình học tập để có thể theo sát quá trình của con.',
    },
    {
        name: 'Andrea Nguyen',
        role: 'Local Guide • 136 bài đánh giá • 280 ảnh',
        content: 'Tôi đánh giá cao cách trung tâm thường xuyên update tình hình học tập để có thể theo sát quá trình của con.',
    },
];

export default function GgMapRatingSection() {
    return (
        <section className="relative py-16 px-4" style={{ background: "#3F489A" }}>
            <div className="mx-auto max-w-6xl">
                {/* Title */}
                <h2 className="text-center text-2xl md:text-[32px] font-black text-white uppercase tracking-wider mb-16">
                    ĐÁNH GIÁ TỐT CỦA PHỤ HUYNH TRÊN GOOGLE MAPS
                </h2>

                <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                    
                    {/* Left Side: Google Maps Badge */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                        <p className="text-white font-extrabold text-2xl md:text-3xl leading-snug mb-6 max-w-[340px]">
                            Đánh giá tốt của Phụ huynh trên
                        </p>
                        
                        {/* Google Maps White Box */}
                        <div className="bg-white rounded-[24px] px-8 py-5 shadow-lg flex items-center justify-center gap-3 w-full max-w-[320px]">
                            {/* Google Maps Icon Pin */}
                            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#EA4335" strokeWidth="1"/>
                            </svg>
                            <span className="text-2xl font-black tracking-tight flex items-center">
                                <span className="text-[#4285F4]">G</span>
                                <span className="text-[#EA4335]">o</span>
                                <span className="text-[#FBBC05]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#34A853]">l</span>
                                <span className="text-[#EA4335]">e</span>
                                <span className="text-[#5f6368] font-semibold ml-2">Maps</span>
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Reviews Vertical Stack */}
                    <div className="flex-1 w-full flex flex-col gap-6 lg:gap-0 z-10 lg:max-w-[520px]">
                        {ratingCards.map((item, index) => {
                            let offsetClass = "";
                            if (index === 0) offsetClass = "lg:translate-x-14 lg:rotate-[3deg] self-end";
                            else if (index === 1) offsetClass = "lg:-translate-x-12 lg:rotate-[-2deg] lg:-mt-8 self-start";
                            else if (index === 2) offsetClass = "lg:translate-x-10 lg:rotate-[1deg] lg:-mt-8 self-end";

                            return (
                                <div 
                                    key={index} 
                                    className={`bg-white rounded-[24px] p-5 shadow-md border border-slate-100 flex gap-4 transition-all duration-300 hover:rotate-0 hover:translate-x-0 hover:translate-y-0 hover:mt-0 ${offsetClass} max-w-[420px] w-full`}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[#3F489A]">
                                        {item.name[0]}
                                    </div>

                                    {/* Review Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                            <div>
                                                <h4 className="font-extrabold text-[#2E357F] text-base leading-tight">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                    {item.role}
                                                </p>
                                            </div>
                                            
                                            {/* Stars */}
                                            <div className="flex gap-0.5 text-[#FFAD00] self-start sm:self-center mt-1 sm:mt-0">
                                                {Array.from({ length: 5 }).map((_, star) => (
                                                    <svg key={star} className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
