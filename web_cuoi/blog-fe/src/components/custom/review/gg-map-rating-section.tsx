import Image from "next/image";

const ratingCards = [
    {
        name: '1295 Tran Minh Thy',
        role: '',
        content: 'Đã qua 2 tuần kể từ lúc mình hoàn thành khoá học Tesol 120h. Mình cảm thấy bản thân đã cải thiện rất nhiều về khả năng soạn bài và đứng lớp. Cùng với sự chỉ dạy nhiệt tình của Thầy Minh Sơn mà mình đã có nhiều bài học và câu chuyện sâu sắc về ng...',
        avatar: '/images/people-1.png',
    },
    {
        name: 'Phương Mai Nguyễn',
        role: '',
        content: 'Lựa chọn Simple để học khoá Tesol 120H là một lựa chọn đúng đắn nhất của mình. Tại đây mình đã đc học hỏi cx như trải nghiệm đc rất nhiều điều mới mẻ, đc biết thêm rất nhiều phương pháp dạy hay, bt cách đứng lớp, soạn lesson plan, các...',
        avatar: '/images/people-2.png',
    },
    {
        name: 'Oanh Nguyễn',
        role: '',
        content: 'Một hành trình nhỏ nhưng thật đáng quý 💛 Trước khi đến với TSE, mình là một người trái ngành – không kinh nghiệm, không định hướng rõ ràng, chỉ có một niềm yêu thích với việc giảng dạy tiếng Anh và mong muốn được làm nghề tử tế. Mọi thứ bắt đầ...',
        avatar: '/images/people-3.png',
    },
];

export default function GgMapRatingSection() {
    return (
        <section className="relative py-16 px-4" style={{ background: "#3F489A" }}>
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                    
                    {/* Left Side: Rating Summary */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                        <h2 className="text-white font-extrabold text-3xl md:text-[40px] leading-[1.3] mb-8 lg:mb-10 max-w-[500px]">
                            Đánh giá của học viên trên{' '}
                            <span className="inline-flex bg-white rounded-md px-3 py-1 md:px-4 md:py-1.5 shadow-lg items-center justify-center align-middle ml-1 mb-1 mt-2 md:mt-0">
                                <span className="text-2xl md:text-[28px] font-black tracking-tight flex items-center">
                                    <span className="text-[#4285F4]">G</span>
                                    <span className="text-[#EA4335]">o</span>
                                    <span className="text-[#FBBC05]">o</span>
                                    <span className="text-[#4285F4]">g</span>
                                    <span className="text-[#34A853]">l</span>
                                    <span className="text-[#EA4335]">e</span>
                                    <span className="text-[#5f6368] font-semibold ml-1.5">Maps</span>
                                </span>
                            </span>
                        </h2>

                        {/* Rating 5.0 & Stars */}
                        <div className="flex items-center gap-4 md:gap-6 mt-2 border-l-[4px] border-white bg-gradient-to-r from-white/20 to-transparent py-3 pl-5 md:pl-6 pr-10 md:pr-16">
                            <span className="text-white font-black text-[72px] md:text-[88px] leading-none tracking-tighter" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                5.0
                            </span>
                            
                            <div className="flex flex-col justify-center">
                                <div className="flex gap-1.5 text-[#FFAD00]">
                                    {Array.from({ length: 5 }).map((_, star) => (
                                        <svg key={star} className="h-8 w-8 md:h-10 md:w-10 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Reviews Vertical Stack */}
                    <div className="flex-1 w-full flex flex-col items-center gap-0 z-10 lg:max-w-[650px]">
                        {ratingCards.map((item, index) => {
                            let offsetClass = "";
                            let zIndex = "";
                            if (index === 0) {
                                offsetClass = "rotate-[-2deg] lg:rotate-[-3deg]";
                                zIndex = "z-10";
                            }
                            else if (index === 1) {
                                offsetClass = "rotate-[1deg] lg:rotate-[2deg] -mt-1 lg:-mt-2";
                                zIndex = "z-20";
                            }
                            else if (index === 2) {
                                offsetClass = "rotate-[-1deg] lg:rotate-[-2deg] -mt-1 lg:-mt-2";
                                zIndex = "z-30";
                            }

                            return (
                                <div 
                                    key={index} 
                                    className={`bg-white rounded-[16px] md:rounded-[24px] p-4 md:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-4 md:gap-5 ${offsetClass} ${zIndex} max-w-[600px] w-full relative`}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 relative mt-1">
                                        <Image 
                                            src={item.avatar} 
                                            alt={item.name} 
                                            fill
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#1a73e8] text-[15px] md:text-base mb-1">
                                            @{item.name}
                                        </h4>
                                        <p className="text-[13px] md:text-[14px] text-slate-600 font-medium leading-[1.6] mb-3">
                                            {item.content}
                                        </p>

                                        {/* Actions: Like, Dislike, Reply */}
                                        <div className="flex items-center gap-5 text-slate-500 mt-1">
                                            <button className="hover:text-slate-800 transition-colors" aria-label="Thích">
                                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                            </button>
                                            <button className="hover:text-slate-800 transition-colors" aria-label="Không thích">
                                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                                </svg>
                                            </button>
                                            <button className="text-[13px] hover:text-slate-800 transition-colors font-medium">
                                                Trả Lời
                                            </button>
                                        </div>
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
