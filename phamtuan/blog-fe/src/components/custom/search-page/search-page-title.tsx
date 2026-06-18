'use client'
import { AdminUserDTO } from "@/dto/AdminUserDTO";
import { ResponsePostDTO } from "@/dto/PostDTO";

export default function SearchPageTitle(
  { searchParams, data, total }: {
    searchParams?: {
      keyword?: string;
      id?: string;
      name?: string;
      slug?: string;
      userId?: string;
      page?: string;
      pageSize?: string;
      locale?: string;
    },
    data: ResponsePostDTO[],
    total: string
  }
) {

  return (
    <>
      {searchParams?.keyword && (
        <>
          {!data || (data.length === 0 && (
            <p className="text-[18px] font-semibold leading-[18px] text-[#252525] text-left mb-8">
              Xin lỗi, nhưng không có kết quả nào khớp với từ khóa tìm kiếm của bạn. Vui lòng thử lại với các từ khóa khác.
            </p>
          ))}
          {data && data.length !== 0 && (
            <p className="text-[30px] font-semibold leading-[30px] text-[#252525] text-left mb-8">
              {`Chúng tôi đã tìm thấy ${total} kết quả cho tìm kiếm của bạn "${searchParams?.keyword}"`}
            </p>
          )}
        </>
      )}

      {searchParams?.id && (
        <>
          <p className="text-[30px] font-semibold leading-[30px] text-[#252525] text-left mb-8">
            {searchParams?.name}
          </p>
          {!data || (data.length === 0 && (
            <p className="text-[18px] font-semibold leading-[18px] text-[#252525] text-left mb-8">
              Không có khóa học nào.
            </p>
          ))}
        </>
      )}
    </>
  );
}
