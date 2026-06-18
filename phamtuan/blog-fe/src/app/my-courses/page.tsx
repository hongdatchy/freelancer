'use client';

import { useEffect, useState } from 'react';
import PostPaging from '@/components/custom/common/post-paging';
import { ResponsePostDTO } from '@/dto/PostDTO';
import { postData } from '@/service/api';
import { useSearchParams } from 'next/navigation';
import useUserLoginStore from '@/state-manager/user-login-store';

export default function MyCourses() {
  const [data, setData] = useState<ResponsePostDTO[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const { user } = useUserLoginStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const pageParam = Number(searchParams.get('page') || '1');
      const pageSizeParam = Number(searchParams.get('pageSize') || '4');

      setPage(pageParam);
      setPageSize(pageSizeParam);

      try {
        if (user) {
          const responsePost = await postData(
            `api/posts/search?pagination[page]=${pageParam}&pagination[pageSize]=${pageSizeParam}&populate=thumbnail&populate=categories&populate=posts`,
            {
              userId: 1,
            }
          );

          setData(responsePost.data);
          setPageCount(responsePost.meta.pagination.pageCount);
        }
      } catch (err) {
        console.error('Fetch posts failed:', err);
      }
    };

    fetchData();
  }, [searchParams, user]);

  return (
    <div className="md:col-span-3 w-full">
      {!user ? (
        <p className="text-center text-red-500 text-lg font-semibold mt-10 h-[50vh]">
          Vui lòng đăng nhập để xem các khóa học của bạn.
        </p>
        
      ) : (
        <PostPaging data={data} pageCount={pageCount} page={page} pageSize={pageSize} />
      )}
    </div>
  );
}
