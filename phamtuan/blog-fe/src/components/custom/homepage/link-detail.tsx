'use client';
import { ResponsePostDTO } from '@/dto/PostDTO';
import usePostStore from '@/state-manager/post-store';
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
  const { setPost } = usePostStore();
  return (
    <Link href={`/detail-post/${responsePostDTO.slug}`} className={className} onClick={() => setPost(responsePostDTO)}>
      {children}
    </Link>
  );
}
