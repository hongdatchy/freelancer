"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { postData } from "@/service/api"
import { TeacherDTO } from "@/dto/TeacherDTO"
import Link from "next/link"
import Image from "next/image"

export default function TeacherSection() {
    const [teachers, setTeachers] = useState<TeacherDTO[]>([])
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        postData(`api/users/search?pagination[page]=0&pagination[pageSize]=100`, {})
            .then((res) => {
                setTeachers(res.data || [])
            })
    }, [])

    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    return (
        <section className="px-6 py-20 bg-gradient-to-b from-[#F0F7FF] to-white">
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 relative">
                {/* TITLE */}
                <div className="text-center mb-16">
                    <p className="section-subtitle">
                        Giáo viên
                    </p>
                    <h2 className="section-title">
                        ĐỘI NGŨ GIÁO VIÊN CHẤT LƯỢNG VÀ TÂM HUYẾT
                    </h2>
                </div>

                {/* CAROUSEL */}
                <Carousel 
                    plugins={[plugin.current]}
                    opts={{ loop: true, align: "start" }} 
                    className="w-full px-4 sm:px-12 relative"
                >
                    <CarouselContent className="-ml-4">
                        {teachers.map((t, index) => {
                            const avatarPath = t.avatar?.formats?.medium?.url || t.avatar?.formats?.small?.url || t.avatar?.url;
                            const avatarUrl = avatarPath
                                ? process.env.NEXT_PUBLIC_BE_HOST + avatarPath
                                : '/images/default-avatar.png'

                            // Get IELTS or first score
                            const ieltsScoreObj = t.score?.find(s => s.type.toUpperCase() === 'IELTS');
                            const scoreVal = ieltsScoreObj ? ieltsScoreObj.vaule : (t.score?.[0]?.vaule || '');
                            const scoreType = ieltsScoreObj ? ieltsScoreObj.type : (t.score?.[0]?.type || '');

                            const yearsExp = t.experiences !== undefined && t.experiences !== null ? t.experiences : '';

                            const namePrefix = t.gender?.toLowerCase() === 'female'
                                ? 'Ms. '
                                : t.gender?.toLowerCase() === 'male'
                                    ? 'Mr. '
                                    : '';

                            return (
                                <CarouselItem
                                    key={index}
                                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pt-20"
                                >
                                    <Link href={`/teachers/${t.id}`} className="block p-2 h-full">
                                        <Card className="h-full rounded-[32px] border-2 border-sky-100 shadow-[0_12px_30px_rgba(59,130,246,0.06)] bg-white relative hover:scale-[1.02] transition-transform duration-300">
                                            <CardContent className="px-6 pb-8 pt-0 flex flex-col items-center h-full">

                                                {/* AVATAR + TEXT CONG */}
                                                <div className="relative w-32 h-32 -mt-16 mb-6 flex-shrink-0">
                                                    
                                                    {/* Background light-blue circle shape */}
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100 to-sky-50/50" />

                                                    {/* VIỀN TRẮNG */}
                                                    <div className="absolute inset-[4px] rounded-full border-4 border-white z-10 shadow-sm" />

                                                    {/* AVATAR */}
                                                    <div className="absolute inset-[8px] rounded-full overflow-hidden z-10">
                                                        <Image
                                                            src={avatarUrl}
                                                            alt={t.fullName}
                                                            fill
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* TEXT CONG */}
                                                    <svg
                                                        viewBox="0 0 160 160"
                                                        className="absolute inset-[-16px] pointer-events-none z-20 rotate-[24deg]"
                                                    >
                                                        <defs>
                                                            <path
                                                                id={`topArc-${index}`}
                                                                d="M 10 80 A 70 70 0 0 1 150 80"
                                                            />
                                                        </defs>

                                                        <text
                                                            fill="#2E357F"
                                                            fontSize="11"
                                                            fontWeight="900"
                                                            letterSpacing="3"
                                                        >
                                                            <textPath
                                                                href={`#topArc-${index}`}
                                                                startOffset="50%"
                                                                textAnchor="middle"
                                                            >
                                                                TEACHER
                                                            </textPath>
                                                        </text>
                                                    </svg>

                                                </div>

                                                {/* NAME */}
                                                <h3 className="text-[#2E357F] font-black uppercase text-[15px] text-center leading-tight mb-6 min-h-[44px] flex items-center justify-center">
                                                    {namePrefix}{t.fullName}
                                                </h3>

                                                {/* BULLET POINTS */}
                                                <ul className="w-full space-y-4 text-left pl-3 pr-1 mt-auto">
                                                    {t.educations?.[0]?.title && (
                                                        <li className="flex items-start gap-2.5">
                                                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                                            <span className="text-[#2E357F] font-bold text-xs md:text-sm leading-snug">
                                                                {t.educations[0].title}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {scoreVal && (
                                                        <li className="flex items-start gap-2.5">
                                                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                                            <span className="text-[#2E357F] font-bold text-xs md:text-sm leading-snug">
                                                                Chứng chỉ {scoreType} {scoreVal}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {yearsExp && (
                                                        <li className="flex items-start gap-2.5">
                                                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                                            <span className="text-[#2E357F] font-bold text-xs md:text-sm leading-snug">
                                                                {yearsExp} năm kinh nghiệm giảng dạy tiếng Anh
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>

                                            </CardContent>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>

                    {/* Carousel Nav Arrows aligned matching the style */}
                    <CarouselPrevious className="absolute left-[-15px] sm:left-0 bg-[#3F489A] hover:bg-[#2E357F] text-white border-none w-10 h-10 shadow-lg flex items-center justify-center transition-colors duration-300" />
                    <CarouselNext className="absolute right-[-15px] sm:right-0 bg-[#3F489A] hover:bg-[#2E357F] text-white border-none w-10 h-10 shadow-lg flex items-center justify-center transition-colors duration-300" />
                </Carousel>
            </div>
        </section>
    )
}
