"use client";

import { useState } from "react";

export function VideoItem({
    title,
    thumbnail,
    youtube,
    ratio = "16/9",
    subtitle,
    variant = "default",
}: {
    title?: string;
    thumbnail: string;
    youtube: string;
    ratio?: "16/9" | "1/1";
    subtitle?: string;
    variant?: "default" | "feedback";
}) {
    const [open, setOpen] = useState(false);

    const padding =
        ratio === "1/1" ? "pt-[100%]" : variant === "feedback" ? "pt-[65%]" : "pt-[56.25%]";

    if (variant === "feedback") {
        return (
            <div className="bg-white rounded-[32px] border-2 border-sky-200 p-4 md:p-5 shadow-[0_0_30px_rgba(59,130,246,0.15)] h-full flex flex-col">
                <div className={`relative overflow-hidden rounded-[24px] shadow-sm flex-shrink-0 ${padding}`}>
                    {open ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${youtube}?autoplay=1`}
                            title={title}
                            className="absolute left-0 top-0 h-full w-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <button
                            onClick={() => setOpen(true)}
                            className="absolute inset-0 group"
                        >
                            <img
                                src={thumbnail}
                                alt={title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Play overlay button */}
                            <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors duration-300">
                                <span className="w-14 h-14 rounded-full bg-black/40 group-hover:bg-black/60 flex items-center justify-center text-white transition-all duration-300 shadow-md">
                                    <svg className="w-6 h-6 fill-current translate-x-[2px]" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                    )}
                </div>

                {title && (
                    <div className="mt-5 text-center flex-grow flex flex-col justify-center">
                        <h3 className="text-[#2E357F] font-black text-lg md:text-[21px] leading-tight">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-[#3F489A]/80 font-semibold text-sm mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className={`relative overflow-hidden rounded-2xl shadow-md ${padding}`}>
                {open ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${youtube}?autoplay=1`}
                        title={title}
                        className="absolute left-0 top-0 h-full w-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="absolute inset-0 group"
                    >
                        <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Play overlay button */}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                            <span className="w-12 h-12 rounded-full bg-black/40 group-hover:bg-black/60 flex items-center justify-center text-white transition-all duration-300 shadow-sm">
                                <svg className="w-5 h-5 fill-current translate-x-[2px]" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </span>
                    </button>
                )}
            </div>

            {
                title &&
                <h3 className="mt-4 text-center text-lg font-extrabold text-white">
                    {title}
                </h3>
            }
        </div>
    );
}