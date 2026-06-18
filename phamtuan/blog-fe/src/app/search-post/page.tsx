import PostPaging from '@/components/custom/common/post-paging';
import SearchBtn from '@/components/custom/common/search-btn';
import SearchPageTitle from '@/components/custom/search-page/search-page-title';
import { ResponseCategoryDTO } from '@/dto/CategoryDTO';
import { ResponsePostDTO } from '@/dto/PostDTO';
import { getData, postData } from '@/service/api';

export default async function SearchPost(props: {
  params?: Promise<{ id: string; name: string; slug: string }>; // get dynamic route params ex: category/[id]/[name]/[slug]
  searchParams?: Promise<{
    keyword?: string;

    id?: string;
    name?: string;
    slug?: string;

    userId?: string;

    page?: string;
    pageSize?: string;

  }>;
}) {
  const searchParams = await props.searchParams;

  const pageSize: number = Number(searchParams?.pageSize) || 6;
  const page = Number(searchParams?.page) || 1;

  const responsePost = await postData(
    `api/posts/search?pagination[page]=${page}&&pagination[pageSize]=${pageSize}&&populate=thumbnail&&populate=categories&&populate=posts`,
    {
      title: searchParams?.keyword,
      category: searchParams?.id,
      userId: searchParams?.userId,
    },
  );

  const data: ResponsePostDTO[] = responsePost.data;

  // const responseCategories = await getData(`api/categories/count`);
  // const categories: ResponseCategoryDTO[] = responseCategories;

  return (
    <div className="md:col-span-3 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <SearchBtn />

        {/* <Select
          onValueChange={(value) => {
            if (value) {
              window.location.href = `/search?id=${value}`; // hoặc xử lý router push nếu dùng router
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      <SearchPageTitle
        data={data}
        searchParams={searchParams}
        total={responsePost.meta.pagination.total}
      />

      <div>
        <PostPaging
          data={data}
          pageCount={responsePost.meta.pagination.pageCount}
          page={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
