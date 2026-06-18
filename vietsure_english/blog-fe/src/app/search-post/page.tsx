import PostPaging from '@/components/custom/common/paging';
import HorizontalPost from '@/components/custom/common/horizontal-post';

import { ResponseCategoryDTO } from '@/dto/CategoryDTO';
import { ResponsePostDTO } from '@/dto/PostDTO';

import { getData, postData } from '@/service/api';

export default async function SearchPost(props: {
  params?: Promise<{ id: string; name: string; slug: string }>;

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
  const page = Number(searchParams?.page) || 0;

  const responsePost = await postData(
    `api/posts/search?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=thumbnail&populate=categories&populate=posts`,
    {
      title: searchParams?.keyword,
      category: searchParams?.id,
      userId: searchParams?.userId,
    },
  );

  const data: ResponsePostDTO[] = responsePost.data;

  const responseCategories = await getData('api/categories/count');
  const categories: ResponseCategoryDTO[] = responseCategories;

  // BLOG SIDEBAR BANNERS
  const responseBannerBlogs = await getData(
    'api/banner-blogs?populate=background',
  );

  const banners =
    responseBannerBlogs?.data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      background: item.background,
    })) || [];

  return (
  <>
    {/* TITLE */}
    <div className="mb-10 text-left">
      <h1 className="text-3xl md:text-[38px] font-black text-[#2E357F] uppercase tracking-wide">
        TIN TỨC
      </h1>
    </div>

    {/* POSTS */}
    <PostPaging
      renderItem={(post) => (
        <HorizontalPost post={post} />
      )}
      data={data}
      pageCount={responsePost.meta.pagination.pageCount}
      page={page}
      pageSize={pageSize}
      className="flex flex-col w-full"
    />
  </>
);
}