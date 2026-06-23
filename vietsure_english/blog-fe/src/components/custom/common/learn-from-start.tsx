import Image from "next/image";

export default function LearnFromStart() {
    return (
        <>
            <section
                className="px-6 py-16 bg-gradient-to-b from-[#D4E8FC] to-white"
            >
                <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 flex flex-col items-center">
                    <div className="text-center mx-auto mb-10 max-w-6xl">
                        <h2 className="section-title">
                            Học đúng ngay từ đầu
                        </h2>

                        <p className="section-desc mt-4">
                            Chương trình được phát triển từ kinh nghiệm giảng dạy trong môi trường quốc tế, giúp trẻ hiểu – phản xạ – giao tiếp tự nhiên, không học thuộc.
                            <br className="hidden xl:inline" />
                            Phụ huynh lựa chọn Vietsure English không chỉ vì kết quả, mà vì cách học đúng ngay từ đầu và lộ trình phát triển lâu dài cho con.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 w-full max-w-[1080px] mx-auto mb-5">

                        {/* ảnh lớn bên trái */}
                        <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-sm aspect-square relative">
                            <Image
                                src="/images/learn_from_start1.png"
                                fill
                                className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                alt="Học viên Vietsure English"
                            />
                        </div>

                        {/* cột phải */}
                        <div className="grid grid-cols-2 gap-4 col-span-2 row-span-2">

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square relative">
                                <Image
                                    src="/images/learn_from_start2.png"
                                    fill
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Học viên học trực tuyến"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square relative">
                                <Image
                                    src="/images/learn_from_start3.png"
                                    fill
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Trẻ học tiếng Anh online"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square relative">
                                <Image
                                    src="/images/learn_from_start4.png"
                                    fill
                                    className="w-full h-full object-cover scale-105 transition-transform duration-500 hover:scale-110"
                                    alt="Lớp học tương tác"
                                />
                            </div>

                            <div className="overflow-hidden rounded-2xl shadow-sm aspect-square relative">
                                <Image
                                    src="/images/learn_from_start5.png"
                                    fill
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