'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import usePostStore from '@/state-manager/post-store';
import Post from '../components/custom/common/post';
import { usePathname } from 'next/navigation';

export default function RelatedPost() {
  const { post } = usePostStore();
  const pathname = usePathname();

  const includedPaths = '/detail-post';
  if (!pathname.startsWith(includedPaths)) {
    return <></>;
  }

  if (!post || !post.posts) {
    return <div></div>;
  }

  return (
    <>
      <p className="mt-8 mb-8 font-bold text-[30px] leading-[1.81] text-[#1D1D1F]">Related Post</p>
      <div className="flex justify-center">
        <Carousel
          className="2xl:w-full w-[90%]"
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {post.posts.map((relatedPost, index) => (
              <CarouselItem
                key={index}
                className={
                  post.posts.length >= 3 ? 'xl:basis-1/3  sm:basis-1/2' : post.posts.length >= 2 ? 'sm:basis-1/2' : ''
                }
              >
                <Post responsePostDTO={relatedPost} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
