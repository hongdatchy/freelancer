"use client";

import { useState } from "react";
import { VideoItem } from "./video-item";

export default function HotProgram() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-16">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-16 xl:px-24">
                {/* Title */}
                <h2 className="mb-12 text-center text-3xl font-extrabold uppercase leading-tight text-[#e9416a] lg:text-5xl">
                    CÁC CHƯƠNG TRÌNH HOT <br className="hidden lg:block" />
                    Vietsure English ĐỂ CTV GIỚI THIỆU
                </h2>

                {/* Tabs */}
                <div className="grid lg:grid-cols-4 border-b-2 border-white">
                    <div
                        onClick={() => setActiveTab(0)}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-[20px_20px_0_0] px-3 py-5 text-center text-[18px] font-bold uppercase transition-all duration-300
        ${activeTab === 0
                                ? "bg-[#e9416a] text-white"
                                : "bg-[#ffe6ef] text-[#e9416a] hover:bg-[#ffd1e0]"
                            }`}
                    >
                        TIẾNG ANH 1 KÈM 1 <br />
                        CHO TRẺ EM
                    </div>

                    <div
                        onClick={() => setActiveTab(1)}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-[20px_20px_0_0] px-3 py-5 text-center text-[18px] font-bold uppercase transition-all duration-300
        ${activeTab === 1
                                ? "bg-[#e9416a] text-white"
                                : "bg-[#ffe6ef] text-[#e9416a] hover:bg-[#ffd1e0]"
                            }`}
                    >
                        TIẾNG ANH 1 KÈM 1 <br />
                        CHO NGƯỜI LỚN
                    </div>

                    <div
                        onClick={() => setActiveTab(2)}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-[20px_20px_0_0] px-3 py-5 text-center text-[18px] font-bold uppercase transition-all duration-300
        ${activeTab === 2
                                ? "bg-[#e9416a] text-white"
                                : "bg-[#ffe6ef] text-[#e9416a] hover:bg-[#ffd1e0]"
                            }`}
                    >
                        TOÁN 1 KÈM 1
                    </div>

                    <div
                        onClick={() => setActiveTab(3)}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-[20px_20px_0_0] px-3 py-5 text-center text-[18px] font-bold uppercase transition-all duration-300
        ${activeTab === 3
                                ? "bg-[#e9416a] text-white"
                                : "bg-[#ffe6ef] text-[#e9416a] hover:bg-[#ffd1e0]"
                            }`}
                    >
                        AI TUTOR <br />
                        TỰ HỌC THÔNG MINH
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-hidden bg-[#f8fffb] shadow-xl">
                    {/* TAB 1 — GIỮ NGUYÊN 100% */}
                    {activeTab === 0 && (
                        <div className="w-full rounded-b-[20px] bg-[#e9416a] px-6 py-10 lg:px-10">
                            {/* videos */}
                            <div className="grid gap-4 lg:grid-cols-3">
                                <VideoItem
                                    title="Giáo viên bản xứ"
                                    thumbnail="/images/thumb-clip-1.png"
                                    youtube="XGkGPhBoMhk"
                                />

                                <VideoItem
                                    title="Giáo viên Philippines"
                                    thumbnail="/images/thumb-clip-2.png"
                                    youtube="-Nvyxko9Ljk"
                                />

                                <VideoItem
                                    title="Giáo viên Việt Nam"
                                    thumbnail="/images/thumb-clip-3.png"
                                    youtube="_1uO-NaX70o"
                                />
                            </div>

                            {/* features */}
                            <div className="mt-6 grid gap-3 lg:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-1.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        1 giáo viên kèm 1 học sinh giúp tăng tương tác tối đa
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-2.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Chỉnh sửa lỗi phát âm và phản xạ ngay trong buổi học
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-3.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Giáo trình chuẩn Cambridge phù hợp trẻ từ 4 - 12 tuổi
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-4.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Miễn phí kiểm tra trình độ và tư vấn lộ trình học
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-5.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Chi phí hợp lý chỉ từ 70.000đ / buổi học
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-6.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Tiến bộ nhanh cả 4 kỹ năng nghe - nói - đọc - viết
                                    </p>
                                </div>
                            </div>

                            {/* bottom image (GIỮ NGUYÊN) */}
                            <div className="mt-6 bg-[#e9fff4] p-6 lg:p-10">
                                <img
                                    src="/images/img-1.png"
                                    alt="teacher"
                                    className="mx-auto w-full max-w-[1000px]"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 2 */}
                    {activeTab === 1 && (
                        <div className="w-full rounded-b-[20px] bg-[#e9416a] px-[65px] py-[40px] text-white max-lg:px-6">
                            {/* title mobile */}
                            <div className="mb-6 text-xl font-bold uppercase xl:hidden">
                                TIẾNG ANH 1 KÈM 1 DÀNH CHO NGƯỜI LỚN
                            </div>

                            {/* video */}
                            <div className="flex justify-center">
                                <div className="w-full max-w-[500px]">
                                    <VideoItem
                                        thumbnail="/images/thumb-clip-4.png"
                                        youtube="uX2zkaEmKj0"
                                        ratio="1/1"
                                    />
                                </div>
                            </div>

                            <div className="mt-[40px] flex flex-wrap justify-between gap-6 rounded-[10px] bg-white p-[30px] text-[#45474d] max-lg:flex-col">
                                {/* item 1 */}
                                <div className="flex w-full gap-4 lg:w-[48%]">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#e9416a] text-white flex items-center justify-center font-bold">
                                        1
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold">
                                            Học 1 kèm 1: 1 giáo viên giỏi chỉ dạy 1 học viên
                                        </h3>
                                        <p className="mt-1 text-[#45474d]/80">
                                            Tận dụng tối đa 45 phút/ buổi học. Yếu chỗ nào tập trung chỗ đó.
                                            Giáo viên theo sát, khích lệ học viên.
                                        </p>
                                    </div>
                                </div>

                                {/* item 2 */}
                                <div className="flex w-full gap-4 lg:w-[48%]">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#e9416a] text-white flex items-center justify-center font-bold">
                                        2
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold">
                                            Học là dùng được: giáo trình và phương pháp tối ưu cho người đi làm
                                        </h3>
                                        <p className="mt-1 text-[#45474d]/80">
                                            Tăng thời gian nghe nói, phản xạ, luyện phát âm x10 lần. Kỹ năng mềm
                                            (giao thiệp, thuyết trình, đàm phán, networking...) tiến bộ vượt bậc.
                                        </p>
                                    </div>
                                </div>

                                {/* item 3 */}
                                <div className="flex w-full gap-4 lg:w-[48%]">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#e9416a] text-white flex items-center justify-center font-bold">
                                        3
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold">
                                            Học Online tiện lợi: Chủ động thời gian, tiết kiệm chi phí
                                        </h3>
                                        <p className="mt-1 text-[#45474d]/80">
                                            Tùy chọn ca học từ 9h sáng - 9h tối, không mất thời gian đi lại.
                                            Có thể học tăng cường. Được hủy ca học, bảo lưu đến 2 năm.
                                        </p>
                                    </div>
                                </div>

                                {/* item 4 */}
                                <div className="flex w-full gap-4 lg:w-[48%]">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#e9416a] text-white flex items-center justify-center font-bold">
                                        4
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold">
                                            Đào tạo 4 kỹ năng bài bản - chuẩn Châu Âu CEFR và TOEIC
                                        </h3>
                                        <p className="mt-1 text-[#45474d]/80">
                                            Đủ khả năng lấy IELTS 7.0+, TOEIC 800+ cho mục tiêu thăng tiến,
                                            nhảy việc, cao học, du học, định cư...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3 */}
                    {activeTab === 2 && (
                        <div className="w-full rounded-b-[20px] bg-[#e9416a] px-6 py-10 text-white lg:px-10">
                            {/* title mobile */}
                            <div className="mb-6 text-center text-xl font-bold uppercase xl:hidden">
                                Toán 1 kèm 1
                            </div>

                            {/* image */}
                            <div className="text-center">
                                <img
                                    src="/images/math-ads.png"
                                    alt="Toán 1 kèm 1"
                                    className="mx-auto w-full"
                                />
                            </div>

                            {/* features */}
                            <div className="mt-6 grid gap-3 lg:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-1.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Phương pháp học cá nhân hóa: Mỗi học viên được học với 1 gia sư giỏi, tập trung vào các lỗ hổng kiến thức, giúp học viên tiến bộ nhanh và tự tin hơn trong môn Toán
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-3.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Giáo trình học chuẩn theo Bộ Giáo Dục: Học viên được học bám sát chương trình SGK, đảm bảo kiến thức nền tảng vững chắc và ôn tập hiệu quả cho các kỳ thi
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-5.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Đội ngũ giáo viên dày dặn kinh nghiệm sư phạm, 100% có bằng cấp, chứng chỉ
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-4.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Lộ trình cá nhân hóa: sửa đổi theo khả năng, tiến bộ nhanh chóng
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-6.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Mô hình đào tạo học online hàng đầu: Kyna tích hợp công nghệ AI và trò chơi tương tác giúp học viên hào hứng, dễ dàng tiếp thu kiến thức
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-2.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Giáo vụ theo sát: đảm bảo quyền lợi, báo cáo tình hình học tập hằng ngày giúp bố mẹ dễ dàng theo dõi
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4 */}
                    {activeTab === 3 && (
                        <div className="w-full rounded-b-[20px] bg-[#e9416a] px-6 py-10 text-white lg:px-10">
                            {/* title mobile */}
                            <div className="mb-6 text-center text-xl font-bold uppercase xl:hidden">
                                Ứng dụng tự học cùng gia sư nhân tạo AI Tutor
                            </div>

                            {/* images layout */}
                            <div className="flex justify-center">
                                <div className="flex max-w-[1000px] gap-6 items-start">

                                    {/* LEFT - BIG IMAGE */}
                                    <div>
                                        <img
                                            src="/images/img-ai-1.png"
                                            alt="img ai"
                                            className="w-full h-auto rounded-xl"
                                        />
                                    </div>

                                    {/* RIGHT - STACK 3 IMAGES */}
                                    <div className="flex flex-col gap-2 lg:gap-4">
                                        <img
                                            src="/images/img-ai-2.png"
                                            alt="img ai"
                                            className="w-full h-auto rounded-xl"
                                        />
                                        <img
                                            src="/images/img-ai-3.png"
                                            alt="img ai"
                                            className="w-full h-auto rounded-xl"
                                        />
                                        <img
                                            src="/images/img-ai-4.png"
                                            alt="img ai"
                                            className="w-full h-auto rounded-xl"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* features */}
                            <div className="mt-6 grid gap-3 lg:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-1.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Học từ vựng, cấu trúc ở hơn 500 chủ đề, từ dễ đến khó
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-3.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Thực hành giao tiếp cùng hội thoại nhập vai theo các chủ đề khác nhau
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-5.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Học qua hình ảnh cùng GIA SƯ AI
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-4.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Luyện phát âm chi tiết với gia sư AI - chấm lỗi từng âm
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-6.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        AI chỉ rõ lỗi sai từ vựng, ngữ pháp và cá nhân hoá theo từng học viên
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                    <img src="/images/icon-2.png" className="h-10 w-10 shrink-0" />
                                    <p className="text-sm leading-relaxed text-[#45474d]">
                                        Gia sư AI tương tác như người thật
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}