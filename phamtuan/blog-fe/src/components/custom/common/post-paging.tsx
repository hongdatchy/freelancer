import { ResponsePostDTO } from '@/dto/PostDTO';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Post from '@/components/custom/common/post';

export default function PostPaging({
  data,
  pageCount,
  page,
  pageSize,
  isShowPaging = true,
}: {
  data: ResponsePostDTO[];
  pageCount: number;
  page: number;
  pageSize: number;
  isShowPaging?: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {data.map((post) => (
          <Post responsePostDTO={post} key={post.id} />
        ))}
      </div>
      {isShowPaging && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page - 1 >= 1 && <PaginationPrevious href={`?page=${page - 1}&&pageSize=${pageSize}`} />}
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink isActive={page === Number(page)} href={`?page=${page}&&pageSize=${pageSize}`}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              {page + 1 <= pageCount && <PaginationNext href={`?page=${page + 1}&&pageSize=${pageSize}`} />}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
