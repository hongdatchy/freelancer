import { ResponsePostDTO } from '@/dto/PostDTO';
import Image from 'next/image';
import LinkDetail from '../homepage/link-detail';
import DateAndCategories from './date-and-categories';
import LinkDetailContent from '../homepage/link-detail-content';

export default function Post({ responsePostDTO }: { responsePostDTO: ResponsePostDTO }) {
  const firstCategory = responsePostDTO.categories?.[0]?.name;

  return (
    <div className="rounded-xl border p-3 shadow-sm">
      <div className="thumbnail w-full relative aspect-[4/5] overflow-hidden rounded-md">
        {firstCategory && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-md z-10">
            {firstCategory}
          </span>
        )}
        <LinkDetail responsePostDTO={responsePostDTO}>
          {responsePostDTO.thumbnail?.url && (
            <Image
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
              sizes="100%"
              alt=""
              src={process.env.NEXT_PUBLIC_BE_HOST + responsePostDTO.thumbnail.url}
              fill
            />
          )}
        </LinkDetail>
      </div>

      {/* Giữ ngày tháng */}
      <div className="date mt-4">
        <DateAndCategories responsePostDTO={responsePostDTO} />
      </div>

      {/* Title */}
      <div className="title mt-4">
        <LinkDetail
          responsePostDTO={responsePostDTO}
          className="font-bold text-base leading-6 text-[#252525] break-words overflow-hidden overflow-ellipsis line-clamp-2"
        >
          {responsePostDTO.title}
        </LinkDetail>
      </div>

      {/* Detail link */}
      <div className="mt-3">
        <LinkDetail responsePostDTO={responsePostDTO} className="text-[#27BA77]">
          <LinkDetailContent />
        </LinkDetail>
      </div>
    </div>
  );
}
