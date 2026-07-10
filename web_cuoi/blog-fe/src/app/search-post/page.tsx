import PostPaging from '@/components/custom/common/paging';
import HorizontalPost from '@/components/custom/common/horizontal-post';

import { ResponsePostDTO } from '@/dto/PostDTO';

import { getData, postData } from '@/service/api';

import BlogSidebar from '@/components/custom/search-page/blog-sidebar';

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
    `api/posts/search?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=thumbnail`,
    {
      title: searchParams?.keyword,
      userId: searchParams?.userId,
    },
  );

  const data: ResponsePostDTO[] = responsePost.data;

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
    <div className="px-6 md:px-10 lg:px-12 py-16">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1400px] gap-10">
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0">
          {/* TITLE */}
          <div className="mb-10 text-left">
            <h1 className="section-title">
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
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden lg:block w-[2px] bg-[#2E357F]/60 mt-10 mb-28 self-stretch"></div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[290px] shrink-0">
          <BlogSidebar banners={banners} />
        </div>
      </div>
    </div>
  );
}