import { ResponsePostDTO } from '@/dto/PostDTO';
import Image from 'next/image';
import LinkDetail from '../homepage/link-detail';

export default function HorizontalPost({ post }: { post: ResponsePostDTO }) {
  const imageUrl = post.thumbnail?.url
    ? process.env.NEXT_PUBLIC_BE_HOST + post.thumbnail.url
    : '/images/Rectangle.png';

  return (
    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start py-8 border-b border-slate-100 last:border-b-0 w-full bg-white">
      {/* Thumbnail */}
      <div className="w-full sm:w-[180px] md:w-[220px] lg:w-[240px] aspect-square overflow-hidden rounded-[24px] shadow-sm flex-shrink-0 relative">
        <LinkDetail responsePostDTO={post} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-w-640px) 100vw, 240px"
            className="object-cover transform transition-transform duration-500 hover:scale-105"
          />
        </LinkDetail>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start pt-1">
        <LinkDetail
          responsePostDTO={post}
          className="text-base md:text-lg lg:text-[20px] font-black text-[#2E357F] hover:text-[#FF6B00] transition-colors leading-snug uppercase tracking-wide"
        >
          {post.title}
        </LinkDetail>
        
        <p className="text-[#3F489A]/85 font-semibold text-xs md:text-sm leading-relaxed mt-4 line-clamp-3">
          {post.description}
        </p>
      </div>
    </div>
  );
}
