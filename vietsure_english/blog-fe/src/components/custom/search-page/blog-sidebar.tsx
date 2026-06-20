'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import useUserLoginStore from '@/state-manager/user-login-store';

import { useEffect, useState } from 'react';
import { getData } from '@/service/api';

type BannerBlog = {
  id: number;

  title: string;
  content: string;

  background?: {
    url: string;
  };
};

type Props = {
  banners?: BannerBlog[];
};

export default function BlogSidebar({ banners: propBanners }: Props) {
  const { user } = useUserLoginStore();
  const [banners, setBanners] = useState<BannerBlog[]>(propBanners || []);

  useEffect(() => {
    if (!propBanners || propBanners.length === 0) {
      getData('api/banner-blogs?populate=background').then((res) => {
        const data = res?.data?.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          background: item.background,
        })) || [];
        setBanners(data);
      });
    } else {
      setBanners(propBanners);
    }
  }, [propBanners]);

  const handleTrialClick = () => {
    const trialSection = document.getElementById('trial-section');

    if (trialSection) {
      trialSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-[200px]">
      {banners.map((banner) => (
        <Card
          key={banner.id}
          className="overflow-hidden rounded-[28px] border-[3px] border-[#2E357F] shadow-[0_15px_40px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-[#2E357F]"
        >
          <CardContent className="p-0 bg-[#2E357F]">
            {!!banner.background?.url && (
              <div className="p-3 pb-3">
                <div className="overflow-hidden rounded-[20px]">
                  <Image
                    src={process.env.NEXT_PUBLIC_BE_HOST + banner.background.url}
                    alt={banner.title}
                    width={500}
                    height={320}
                    className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            )}

            {/* Title section in white band */}
            <div className="bg-white py-5 px-4 text-center relative border-b border-gray-100">
              <h3 className="text-center text-[19px] font-black uppercase leading-[1.25] text-[#2E357F] mt-1">
                {banner.title}
              </h3>
            </div>

            {/* Content & Action section in Navy */}
            <div className="pt-6 pb-7 px-5 bg-[#2E357F]">
              <p className="text-center text-[18px] font-black uppercase text-white leading-[1.35] whitespace-pre-line">
                {banner.content}
              </p>

              {!user && (
                <button
                  onClick={handleTrialClick}
                  className="group mt-5 flex h-[50px] w-full items-center justify-center rounded-full bg-[#FFD100] hover:bg-[#FFE045] px-6 text-[15px] font-black uppercase text-[#2E357F] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-black/20"
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