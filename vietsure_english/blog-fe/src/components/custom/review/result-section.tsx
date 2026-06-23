'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp, ArrowRight } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Hương Nguyễn',
        avatar: '/images/unnamed-10.webp',
        content: 'Dù học trực tuyến nhưng giáo viên tương tác tốt, bé tập trung tiếp thu bài hiệu quả lắm ạ !',
        rotate: 'rotate-[5deg]',
        className: 'top-6 left-12 animate-float-up',
    },
    {
        id: 2,
        name: 'Thanh Hữu Lê',
        avatar: '/images/unnamed-11.webp',
        content: 'Mình thấy nội dung bài học sinh động, nhiều hoạt động tương tác giúp bé không bị nhàm chán.',
        rotate: '-rotate-[3deg]',
        className: 'bottom-6 left-0 animate-float-down',
    },
];

function ReviewCard({
    name,
    avatar,
    content,
    rotate,
    className,
}: {
    name: string;
    avatar: string;
    content: string;
    rotate: string;
    className: string;
}) {
    return (
        <div className={`absolute hidden lg:block ${className}`}>
            <div
                className={`w-[340px] rounded-[24px] bg-white p-5 shadow-2xl ${rotate}`}
            >
                <div className="flex gap-4">
                    <Image
                        src={avatar}
                        alt={name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                        <p className="text-[20px] font-bold leading-none text-[#2351D8]">
                            {name}
                        </p>

                        <p className="mt-2 line-clamp-3 text-[18px] leading-[1.5] text-[#4B4B4B]">
                            {content}
                        </p>

                        <div className="mt-5 flex items-center gap-4 text-[#5E5E5E]">
                            <ThumbsUp className="h-5 w-5" />
                            <ThumbsDown className="h-5 w-5" />

                            <button className="text-sm font-medium">
                                Trả lời
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResultSection() {
    const handleTrialClick = () => {
        const trialSection = document.getElementById('trial-section');

        if (trialSection) {
            trialSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative overflow-hidden py-16"
            style={{
                background: "#3F489A",
            }}
        >
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-3">
                    {/* LEFT: Reviews */}
                    <div className="relative hidden min-h-[420px] lg:block lg:col-span-1">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                name={review.name}
                                avatar={review.avatar}
                                content={review.content}
                                rotate={review.rotate}
                                className={review.className}
                            />
                        ))}
                    </div>

                    {/* RIGHT: Titles */}
                    <div className="lg:col-span-2 lg:pl-10">
                        <h2 className="text-[38px] lg:text-[50px] font-black leading-[1.3] text-white">
                            Nơi lưu trữ những kết quả<br />
                            <span className="inline-block bg-[#FF6B00] px-3.5 py-1 uppercase rounded-2xl text-[30px] lg:text-[40px] my-1 shadow-md font-black">
                                ĐÁNG TỰ HÀO
                            </span>
                            <br />
                            của <span className="inline-block bg-[#3BAEFF] px-3.5 py-1 uppercase rounded-2xl text-[30px] lg:text-[40px] my-1 shadow-md font-black">HỌC VIÊN</span> và cảm
                            <br />
                            nhận của <span className="inline-block bg-[#4D9DF2] px-3.5 py-1 uppercase rounded-2xl text-[30px] lg:text-[40px] my-1 shadow-md font-black">PHỤ HUYNH</span>
                        </h2>
                    </div>
                </div>
            </div>
            
            {/* Centered Button at the bottom of the section */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={handleTrialClick}
                    className="px-8 py-3.5 bg-[#2E357F] hover:bg-[#20255a] text-white font-extrabold text-[15px] rounded-full shadow-lg transition-all tracking-wider uppercase"
                >
                    Đăng ký tư vấn
                </button>
            </div>
        </section>
    );
}