"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VideoItem } from "@/components/custom/brand/video-item";

const feedbacks = [
  {
    id: 1,
    title: "Bé Jenna",
    subtitle: "Phụ huynh",
    thumbnail: "/images/feed-back.webp",
    youtube: "Ge0YwiOU6Ko",
  },
  {
    id: 2,
    title: "Bé Phillip",
    subtitle: "Phụ huynh",
    thumbnail: "/images/feed-back.webp",
    youtube: "uin1UJ5xkqU",
  },
  {
    id: 3,
    title: "Bé Sophie Katie",
    subtitle: "Phụ huynh",
    thumbnail: "/images/feed-back.webp",
    youtube: "KfYFVtMZVNo",
  },
];

export default function ParentFeedbackSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-[#EBF5FF] to-white overflow-hidden" data-purpose="parent-feedback-section">
      <div className="w-full max-w-none px-6 md:px-16 lg:px-28 relative">
        
        {/* Header */}
        <div className="text-center mx-auto mb-16 max-w-none">
          <h2 className="section-title">
            PHỤ HUYNH NÓI VỀ VIETSURE ENGLISH
          </h2>
          <p className="text-[#3F489A] font-semibold text-base md:text-lg lg:text-[19px] leading-relaxed mt-4 opacity-75 max-w-6xl mx-auto">
            Được hàng trăm phụ huynh tin tưởng và lựa chọn, Vietsure English mang đến chương trình học tiếng Anh <br className="hidden xl:inline" /> trực tuyến hiệu quả, giúp trẻ tiến bộ mỗi ngày
          </p>
        </div>

        {/* Carousel container */}
        <Carousel className="w-full px-4 sm:px-12 relative">
          <CarouselContent className="-ml-4">
            {feedbacks.map((feedback, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <div className="p-2 h-full">
                  <VideoItem
                    title={feedback.title}
                    subtitle={feedback.subtitle}
                    thumbnail={feedback.thumbnail}
                    youtube={feedback.youtube}
                    variant="feedback"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-[-15px] sm:left-0 bg-[#3F489A] hover:bg-[#2E357F] text-white border-none w-10 h-10 shadow-lg flex items-center justify-center transition-colors duration-300" />
          <CarouselNext className="absolute right-[-15px] sm:right-0 bg-[#3F489A] hover:bg-[#2E357F] text-white border-none w-10 h-10 shadow-lg flex items-center justify-center transition-colors duration-300" />
        </Carousel>

      </div>
    </section>
  );
}
