"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

type Program = "STARTERS" | "MOVERS" | "FLYERS";

interface Student {
    id: number;
    name: string;
    school: string;
    score: string;
    unit: string;
    image: string;
    certificate: string;
    program: Program;
}

const tabs: Program[] = ["STARTERS", "MOVERS", "FLYERS"];

const students: Student[] = [
    {
        id: 1,
        name: "Nguyễn Bảo Vy",
        school: "THPT Chuyên Trần Đại Nghĩa",
        score: "8.5",
        unit: "IELTS",
        image: "/images/2IAB795QyiEKSKzj40ZP.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 2,
        name: "Hồ Huy Đức",
        school: "RMIT University",
        score: "8.5",
        unit: "IELTS",
        image: "/images/zPLgsTTnTkiI2iTbrSn8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 3,
        name: "Lâm Tử Quỳnh",
        school: "THPT chuyên Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmowev2z51w8q0814anbatee8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 4,
        name: "Trần Bình An",
        school: "Trường Phổ Thông Năng Khiếu, ĐHQG-HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmobbpdhrty0w061as86y9g2r.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 5,
        name: "Hoa Điền",
        school: "TH, THCS & THPT Quốc tế Á Châu - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmmybkfsf5swc0718b5acfq1y.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 6,
        name: "Linh Đan",
        school: "THCS & THPT Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmma46ac4ck2107185iim7ai8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 7,
        name: "Ngọc Anh",
        school: "THPT Nguyễn Du - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7szmlyqfr307y9up5vb205.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 8,
        name: "Bùi Lê Minh",
        school: "THPT chuyên Lê Hồng Phong - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7p2exuoru107y991x7nq3q.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },

    {
        id: 9,
        name: "Nguyễn Bảo Vy",
        school: "THPT Chuyên Trần Đại Nghĩa",
        score: "8.5",
        unit: "IELTS",
        image: "/images/2IAB795QyiEKSKzj40ZP.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 10,
        name: "Hồ Huy Đức",
        school: "RMIT University",
        score: "8.5",
        unit: "IELTS",
        image: "/images/zPLgsTTnTkiI2iTbrSn8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 11,
        name: "Lâm Tử Quỳnh",
        school: "THPT chuyên Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmowev2z51w8q0814anbatee8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 12,
        name: "Trần Bình An",
        school: "Trường Phổ Thông Năng Khiếu, ĐHQG-HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmobbpdhrty0w061as86y9g2r.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 13,
        name: "Hoa Điền",
        school: "TH, THCS & THPT Quốc tế Á Châu - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmmybkfsf5swc0718b5acfq1y.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 14,
        name: "Linh Đan",
        school: "THCS & THPT Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmma46ac4ck2107185iim7ai8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 15,
        name: "Ngọc Anh",
        school: "THPT Nguyễn Du - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7szmlyqfr307y9up5vb205.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 16,
        name: "Bùi Lê Minh",
        school: "THPT chuyên Lê Hồng Phong - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7p2exuoru107y991x7nq3q.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },

    {
        id: 17,
        name: "Nguyễn Bảo Vy",
        school: "THPT Chuyên Trần Đại Nghĩa",
        score: "8.5",
        unit: "IELTS",
        image: "/images/2IAB795QyiEKSKzj40ZP.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 18,
        name: "Hồ Huy Đức",
        school: "RMIT University",
        score: "8.5",
        unit: "IELTS",
        image: "/images/zPLgsTTnTkiI2iTbrSn8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 19,
        name: "Lâm Tử Quỳnh",
        school: "THPT chuyên Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmowev2z51w8q0814anbatee8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 20,
        name: "Trần Bình An",
        school: "Trường Phổ Thông Năng Khiếu, ĐHQG-HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmobbpdhrty0w061as86y9g2r.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 21,
        name: "Hoa Điền",
        school: "TH, THCS & THPT Quốc tế Á Châu - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmmybkfsf5swc0718b5acfq1y.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 22,
        name: "Linh Đan",
        school: "THCS & THPT Trần Đại Nghĩa - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cmma46ac4ck2107185iim7ai8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 23,
        name: "Ngọc Anh",
        school: "THPT Nguyễn Du - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7szmlyqfr307y9up5vb205.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 24,
        name: "Bùi Lê Minh",
        school: "THPT chuyên Lê Hồng Phong - HCM",
        score: "8.5",
        unit: "IELTS",
        image: "/images/cml7p2exuoru107y991x7nq3q.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 25,
        name: "Lê Thái Bảo Huy",
        school: "Trường Tiểu học An Bình",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cmma46ac4ck2107185iim7ai8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 26,
        name: "Phạm Duy Thuận",
        school: "Trường Tiểu học Nguyễn Huệ",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cml7szmlyqfr307y9up5vb205.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 27,
        name: "Nguyễn Minh Thư",
        school: "Trường Tiểu học Kỳ Đồng",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cml7p2exuoru107y991x7nq3q.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 28,
        name: "Nguyễn Bảo Trân",
        school: "Trường Tiểu học Võ Thị Sáu",
        score: "5",
        unit: "SHIELDS",
        image: "/images/2IAB795QyiEKSKzj40ZP.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "STARTERS",
    },
    {
        id: 29,
        name: "Trần Thế Vinh",
        school: "Trường Tiểu học Lê Văn Tám",
        score: "5",
        unit: "SHIELDS",
        image: "/images/zPLgsTTnTkiI2iTbrSn8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 30,
        name: "Đặng Minh Quân",
        school: "Trường Tiểu học Đinh Tiên Hoàng",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cmowev2z51w8q0814anbatee8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 31,
        name: "Phan Khánh Vy",
        school: "Trường Tiểu học Nguyễn Bỉnh Khiêm",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cmobbpdhrty0w061as86y9g2r.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 32,
        name: "Lê Hải Đăng",
        school: "Trường Tiểu học Thực Nghiệm",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cmmybkfsf5swc0718b5acfq1y.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "MOVERS",
    },
    {
        id: 33,
        name: "Nguyễn Nhật Minh",
        school: "Trường Tiểu học Lương Thế Vinh",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cmma46ac4ck2107185iim7ai8.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 34,
        name: "Vũ Phương Linh",
        school: "Trường Tiểu học Kim Đồng",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cml7szmlyqfr307y9up5vb205.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 35,
        name: "Hoàng Gia Bảo",
        school: "Trường Tiểu học Nguyễn Trãi",
        score: "5",
        unit: "SHIELDS",
        image: "/images/cml7p2exuoru107y991x7nq3q.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
    {
        id: 36,
        name: "Đỗ Gia Hưng",
        school: "Trường Tiểu học Phan Đình Phùng",
        score: "5",
        unit: "SHIELDS",
        image: "/images/2IAB795QyiEKSKzj40ZP.webp",
        certificate: "/images/dFyQkiixTKKsVous1BzJ.webp",
        program: "FLYERS",
    },
];

export default function HallOfFameSection() {
    const [activeTab, setActiveTab] = useState<Program>("STARTERS");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        setVisibleCount(8);
    }, [activeTab]);

    const filteredStudents = useMemo(() => {
        return students.filter((item) => item.program === activeTab);
    }, [activeTab]);

    return (
        <>
            <section className="relative overflow-hidden bg-gradient-to-b from-[#5C6BC0] via-[#A5B4FC] to-[#F0F9FF] py-16">
                <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 relative z-10">
                    {/* Header */}
                    <div className="mx-auto mb-10 max-w-4xl text-center">
                        <h2 className="text-2xl md:text-[32px] font-extrabold text-white uppercase tracking-wider leading-tight">
                            HỌC VIÊN NỔI BẬT TẠI
                        </h2>
                        <div className="text-3xl md:text-[44px] font-black tracking-tight flex items-center justify-center gap-2 mt-2">
                            <span className="text-[#2E357F]">vietsure</span>
                            <span className="text-[#3BAEFF]">english</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-10 flex justify-center">
                        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                            {tabs.map((tab) => {
                                const active = activeTab === tab;

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all duration-300 ${active
                                                ? "bg-[#3F489A] text-white shadow-md"
                                                : "text-slate-500 hover:text-[#3F489A]"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredStudents.slice(0, visibleCount).map((student, index) => (
                            <div
                                key={student.id}
                                className="animate-[hallReveal_.36s_cubic-bezier(.33,1,.68,1)_forwards] opacity-0"
                                style={{
                                    animationDelay: `${index * 70}ms`,
                                }}
                            >
                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="group relative w-full max-w-none sm:max-w-[210px] mx-auto text-left block"
                                  >
                                    {/* CARD */}
                                    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)] aspect-square sm:aspect-auto flex flex-col">
                                        {/* IMAGE */}
                                        <div className="relative overflow-hidden bg-[#f5f5f5] flex-1">
                                            <Image
                                                src={student.image}
                                                alt={student.name}
                                                width={700}
                                                height={520}
                                                quality={100}
                                                priority={index < 4}
                                                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                                            />

                                            {/* hover */}
                                            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                                                <div className="flex h-full items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                    <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#3F489A] shadow-lg">
                                                        Xem bảng điểm
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CONTENT */}
                                        <div className="px-4 pb-4 pt-3 text-center">
                                            <h3 className="line-clamp-1 text-[18px] font-extrabold leading-tight text-[#2E357F]">
                                                {student.name}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-xs leading-tight text-[#6b7280]">
                                                {student.school}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SCORE BADGE */}
                                    <div className="absolute -right-2.5 -top-3 z-20">
                                        <div className="relative w-12 h-14 select-none flex items-center justify-center">
                                            <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-md">
                                                {/* Crown ribbon on top */}
                                                <path d="M30 22 L50 6 L70 22" stroke="#3BAEFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                <circle cx="50" cy="6" r="5" fill="#3BAEFF" />
                                                <circle cx="29" cy="21" r="4" fill="#3BAEFF" />
                                                <circle cx="71" cy="21" r="4" fill="#3BAEFF" />

                                                {/* Shield body */}
                                                <path d="M15 28 C 15 28, 15 75, 50 110 C 85 75, 85 28, 85 28 L 50 20 Z" fill="#1A1F36" stroke="#3BAEFF" strokeWidth="8" strokeLinejoin="round" />
                                            </svg>
                                            <span className="relative z-10 text-white font-black text-lg leading-none mt-2.5">
                                                {student.score}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredStudents.length && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + 4)}
                                className="rounded-full border-2 border-white/60 bg-white/20 backdrop-blur-sm px-10 py-3 text-sm font-extrabold text-[#2E357F] transition-all duration-300 hover:bg-white hover:border-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            >
                                Hiện thêm
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* DIALOG */}
            <Dialog
                open={!!selectedStudent}
                onOpenChange={() => setSelectedStudent(null)}
            >
                <DialogContent
                    aria-describedby={undefined}
                    className="w-[92vw] max-w-[820px] overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl"
                >
                    {selectedStudent && (
                        <>
                            <DialogTitle className="sr-only">
                                {selectedStudent.name}
                            </DialogTitle>

                            <DialogDescription className="sr-only">
                                Certificate của {selectedStudent.name}
                            </DialogDescription>

                            {/* IMAGE */}
                            <div className="relative flex max-h-[78vh] items-center justify-center bg-[#f8f8f8] p-4">
                                <Image
                                    src={selectedStudent.certificate}
                                    alt={selectedStudent.name}
                                    width={1200}
                                    height={900}
                                    className="h-auto max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
                                    priority
                                />
                            </div>

                            {/* INFO */}
                            <div className="border-t px-6 py-5">
                                <h3 className="text-2xl font-black text-slate-900">
                                    {selectedStudent.name}
                                </h3>

                                <p className="mt-1 text-slate-500">{selectedStudent.school}</p>

                                <div className="mt-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500">
                                    {selectedStudent.program} • {selectedStudent.score}{" "}
                                    {selectedStudent.unit}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
