'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import useUserLoginStore from '@/state-manager/user-login-store';

type BannerBlog = {
  id: number;

  title: string;
  content: string;

  background?: {
    url: string;
  };
};

type Props = {
  banners: BannerBlog[];
};

export default function BlogSidebar({ banners }: Props) {
  const { user } = useUserLoginStore();

  const handleTrialClick = () => {
    const trialSection = document.getElementById('trial-section');

    if (trialSection) {
      trialSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky top-[200px] hidden flex-col gap-6 lg:flex">
      {banners.map((banner) => (
        <Card
          key={banner.id}
          className="overflow-hidden rounded-[28px] border-none shadow-[0_15px_40px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white"
        >
          <CardContent className="p-3">
            {!!banner.background?.url && (
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src={process.env.NEXT_PUBLIC_BE_HOST + banner.background.url}
                  alt={banner.title}
                  width={500}
                  height={320}
                  className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <div className="pt-5 px-2">
              <h3 className="text-center text-[20px] font-extrabold uppercase leading-[1.3] text-[#2E357F]">
                {banner.title}
              </h3>

              <p className="mt-3 text-center text-[17px] font-black uppercase text-[#FF6B00]">
                {banner.content}
              </p>

              {!user && (
                <button
                  onClick={handleTrialClick}
                  className="group mt-5 flex h-[54px] w-full items-center justify-center rounded-full bg-[#FF6B00] hover:bg-[#FF8533] px-6 text-[15px] font-extrabold uppercase text-white transition-all duration-300 hover:scale-[1.02] shadow-md shadow-orange-500/10"
                >
                  Đăng ký ngay
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {!user && (
        <button
          onClick={handleTrialClick}
          className="group flex h-[60px] items-center justify-center rounded-full bg-[#3F489A] hover:bg-[#2E357F] px-6 text-center text-[16px] font-extrabold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          Học thử miễn phí
          <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      )}
    </aside>
  );
}