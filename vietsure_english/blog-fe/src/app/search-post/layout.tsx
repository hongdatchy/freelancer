import BlogSidebar from '@/components/custom/search-page/blog-sidebar';
import TrialSection from '@/components/custom/common/traial-section';
import { getData } from '@/service/api';

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
    <section className="bg-white">
      <div className="px-6 md:px-10 lg:px-12 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            {children}
          </div>

          {/* RIGHT SIDEBAR */}
          <BlogSidebar banners={banners} />
        </div>
      </div>

      {/* Full-width Trial Form at the bottom */}
      <div className="w-full bg-white border-t border-slate-100">
        <div className="mx-auto max-w-6xl">
          <TrialSection />
        </div>
      </div>
    </section>
  );
}