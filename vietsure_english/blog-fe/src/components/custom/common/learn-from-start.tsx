export default function LearnFromStart() {
    return (
        <>
            <section
                className="px-6 py-16 bg-gradient-to-b from-[#D4E8FC] to-white"
            >
                <div className="w-full max-w-none px-6 md:px-16 lg:px-28 flex flex-col items-center">
                    <div className="text-center mx-auto mb-10 max-w-6xl">
                        <h2 className="text-2xl md:text-3xl lg:text-[36px] font-black text-[#2E357F] uppercase tracking-wide">
                            Học đúng ngay từ đầu
                        </h2>

                        <p className="text-[#3F489A] font-semibold text-sm md:text-[15px] leading-relaxed mt-4">
                            Chương trình được phát triển từ kinh nghiệm giảng dạy trong môi trường quốc tế, giúp trẻ hiểu – phản xạ – giao tiếp tự nhiên, không học thuộc.
                            <br className="hidden xl:inline" />
                            Phụ huynh lựa chọn Vietsure English không chỉ vì kết quả, mà vì cách học đúng ngay từ đầu và lộ trình phát triển lâu dài cho con.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 w-full mb-10">

                        {/* ảnh lớn bên trái */}
                        <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-sm aspect-square">
                            <img
                                src="/images/learn_from_start1.png"
                                className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                alt="Học viên Vietsure English"
                            />
                        </div>

                        {/* cột phải */}
                        <div className="grid grid-cols-2 gap-4 col-span-2 row-span-2">

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square">
                                <img
                                    src="/images/learn_from_start2.png"
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Học viên học trực tuyến"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square">
                                <img
                                    src="/images/learn_from_start3.png"
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Trẻ học tiếng Anh online"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square">
                                <img
                                    src="/images/learn_from_start4.png"
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Lớp học tương tác"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square">
                                <img
                                    src="/images/learn_from_start5.png"
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Học sinh vui vẻ học tập"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="flex justify-center mt-2">
                        <a 
                            href="#trial-section" 
                            className="inline-block bg-[#3F489A] hover:bg-[#2E357F] text-white font-bold py-4 px-12 rounded-[20px] transition-all duration-300 transform hover:scale-105 shadow-md text-base tracking-wide"
                        >
                            Học Thử Miễn Phí
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}