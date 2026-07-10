import { ResponsePostDTO } from '@/dto/PostDTO';
import Link from 'next/link';

export default function LinkDetail({
  responsePostDTO,
  className,
  children,
}: {
  responsePostDTO: ResponsePostDTO;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/search-post/detail-post/${responsePostDTO.slug}`} className={className}>
      {children}
    </Link>
  );
}
