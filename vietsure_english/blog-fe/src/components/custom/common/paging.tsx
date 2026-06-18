import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Paging<T>({
  data,
  pageCount,
  page,
  pageSize,
  isShowPaging = true,
  className = "grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  renderItem,
}: {
  data: T[];
  pageCount: number;
  page: number;
  pageSize: number;
  isShowPaging?: boolean;
  className?: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <>
      <div className={className}>
        {data.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {isShowPaging && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page - 1 >= 1 && (
                <PaginationPrevious
                  href={`?page=${page - 2}&&pageSize=${pageSize}`}
                />
              )}
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  href={`?page=${p - 1}&&pageSize=${pageSize}`}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              {page + 1 <= pageCount && (
                <PaginationNext
                  href={`?page=${page}&&pageSize=${pageSize}`}
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}