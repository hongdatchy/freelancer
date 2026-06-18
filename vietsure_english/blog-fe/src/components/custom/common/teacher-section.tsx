"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { postData } from "@/service/api"
import { TeacherDTO } from "@/dto/TeacherDTO"

export default function TeacherSection() {
    const [teachers, setTeachers] = useState<TeacherDTO[]>([])

    useEffect(() => {
        postData(`api/users/search?pagination[page]=0&pagination[pageSize]=100`, {})
            .then((res) => {
                setTeachers(res.data || [])
            })
    }, [])

    return (
        <section
            className="px-6 py-20 bg-gradient-to-b from-[#EBF5FF] to-white"
        >
            <div className="max-w-6xl mx-auto relative">
                {/* TITLE */}
                <div className="text-center mb-16">
                    <p className="text-[#3F489A] text-lg font-bold uppercase tracking-wider">
                        Giáo viên
                    </p>
                    <h2 className="text-2xl md:text-3xl lg:text-[36px] font-black text-[#2E357F] uppercase mt-2 tracking-wide">
                        ĐỘI NGŨ GIÁO VIÊN CHẤT LƯỢNG VÀ TÂM HUYẾT
                    </h2>
                </div>

                {/* CAROUSEL */}
                <Carousel className="w-full px-4 sm:px-12 relative">
                    <CarouselContent className="-ml-4">
                        {teachers.map((t, index) => {
                            const avatarUrl = t.avatarHomePage?.url
                                ? process.env.NEXT_PUBLIC_BE_HOST + t.avatarHomePage.url
                                : '/images/default-avatar.png'

                            return (
                                <CarouselItem
                                    key={index}
                                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pt-20"
                                >
                                    <div className="p-2 h-full">
                                        <Card className="h-full rounded-[32px] border-2 border-sky-100 shadow-[0_12px_30px_rgba(59,130,246,0.06)] bg-white relative">
                                            <CardContent className="px-5 pb-8 pt-0 flex flex-col items-center">

                                                {/* AVATAR + TEXT CONG */}
                                                <div className="relative w-32 h-32 -mt-16 mb-6 flex-shrink-0">
                                                    
                                                    {/* Background light-blue circle shape */}
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100 to-sky-50/50" />

                                                    {/* VIỀN TRẮNG */}
                                                    <div className="absolute inset-[4px] rounded-full border-4 border-white z-10 shadow-sm" />

                                                    {/* AVATAR */}
                                                    <div className="absolute inset-[8px] rounded-full overflow-hidden z-10">
                                                        <img
                                                            src={avatarUrl}
                                                            alt={t.fullName}
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
                                                <h3 className="text-[#2E357F] font-black uppercase text-[15px] text-center leading-tight mb-4 min-h-[40px] flex items-center justify-center">
                                                    {t.fullName}
                                                </h3>

                                                {/* DESC */}
                                                <ul className="text-sm space-y-3 text-left w-full border-t border-slate-100 pt-4">
                                                    {t.educations?.slice(0, 3).map((edu, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                                            <span className="text-[#2E357F] font-semibold text-xs md:text-sm leading-snug">
                                                                {edu.title}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>

                                            </CardContent>
                                        </Card>
                                    </div>
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
