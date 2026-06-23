'use client';

import Image from 'next/image';

const jobCards = [
    {
        id: 1,
        image: '/images/CRD.webp',
    },
    {
        id: 2,
        image: '/images/CRD1.webp',
    },
    {
        id: 3,
        image: '/images/CRD2.webp',
    },
    {
        id: 4,
        image: '/images/CRD3.webp',
    },
];

export default function JobSuccessSection() {
    return (
        <section className="py-[120px]">
            <div className="mx-auto max-w-6xl px-6">
                {/* HEADER */}
                <div className="text-center mb-10">
                    <h2 className="section-title">
                        Cảm nhận tốt từ phụ huynh về<br />
                        chương trình học tại Vietsure English
                    </h2>
                </div>

                {/* GRID */}
                <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {jobCards.map((card) => (
                        <div
                            key={card.id}
                            className="
                                overflow-hidden
                                rounded-[28px]
                                transition-transform
                                duration-300
                                hover:-translate-y-2
                            "
                        >
                            <Image
                                src={card.image}
                                alt={`Job success ${card.id}`}
                                width={572}
                                height={996}
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}