'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import DateAndCategories from '@/components/custom/common/date-and-categories';
import BlogSidebar from '@/components/custom/search-page/blog-sidebar';
import { getData } from '@/service/api';
import { ResponsePostDTO } from '@/dto/PostDTO';
import { useBreadcrumb } from '@/context/useBreadcrumb';

// ---- extract plain text from ReactMarkdown node ----
function extractText(node: any): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (node?.props?.children) {
    return extractText(node.props.children);
  }

  return '';
}

// ---- clean markdown ----
function cleanText(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/__+/g, '')
    .trim();
}

// ---- normalize id ----
function createId(text: string) {
  return cleanText(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ---- parse headings ----
function parseHeadings(content: string) {
  const lines = content.split('\n');

  return lines
    .filter(line => /^#{1,3} /.test(line))
    .map(line => {
      const level = line.match(/^(#{1,3})/)?.[1].length || 1;

      const rawText = line.replace(/^#{1,3} /, '').trim();
      const text = cleanText(rawText);

      return {
        level,
        text,
        id: createId(text),
      };
    });
}

// ---- heading renderer ----
const headingRenderer = (level: number) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const Heading = ({ children }: any) => {
    const text = cleanText(extractText(children));
    const id = createId(text);

    return <Tag id={id}>{children}</Tag>;
  };
  Heading.displayName = `HeadingRendererH${level}`;
  return Heading;
};

export default function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [post, setPost] = useState<ResponsePostDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { setItems, clear } = useBreadcrumb();

  useEffect(() => {
    setLoading(true);
    getData(`api/posts?filters[slug][$eq]=${slug}&populate[0]=thumbnail&populate[1]=posts.thumbnail`)
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          setPost(res.data[0]);
        } else {
          setPost(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setPost(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (post) {
      setItems([{ title: post.title }]);
    }
    return () => clear();
  }, [post]);

  const headings = post?.content ? parseHeadings(post.content) : [];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 300;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E357F]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-[#2E357F]">
        <h2 className="text-xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <button
          onClick={() => router.push('/search-post')}
          className="px-6 py-2 bg-[#2E357F] text-white rounded-full font-bold uppercase text-sm hover:bg-[#3F489A] transition-colors"
        >
          Quay lại tin tức
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mb-10 px-6 md:px-10 lg:px-12 py-16">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1400px] gap-10">
        
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0">
          {/* POST TITLE */}
          <h1 className="section-title mb-4">
            {post.title}
          </h1>

          {/* METADATA */}
          <div className="flex items-center gap-1.5 mb-6 text-[#888888] text-[13px] font-semibold uppercase">
            <DateAndCategories responsePostDTO={post} />
            <span>| Admin</span>
          </div>

          {/* THUMBNAIL */}
          {post.thumbnail?.url && (
            <div className="flex justify-center mb-8 overflow-hidden rounded-[20px]">
              <Image
                src={process.env.NEXT_PUBLIC_BE_HOST + post.thumbnail.url}
                alt={post.title}
                width={900}
                height={550}
                className="object-cover w-full h-auto max-h-[500px]"
                priority
              />
            </div>
          )}

          {/* ===== TOC ===== */}
          {headings.length > 0 && (
            <div className="toc rounded-2xl bg-[#EAF3FC] my-6 p-6 text-[#2E357F] font-sans shadow-sm border border-[#3F489A]/5">
              {/* TITLE */}
              <p className="title font-bold text-[18px] mb-3 flex items-center justify-start gap-2">
                <span>Mục lục</span>
                <span
                  onClick={() => setCollapsed(!collapsed)}
                  className="cursor-pointer text-xs font-normal text-gray-500 hover:text-[#2E357F] transition-colors"
                >
                  [ {collapsed ? 'hiện' : 'ẩn'} ]
                </span>
              </p>

              {!collapsed && (
                <div className="wrap overflow-hidden transition-all duration-300">
                  <div className="table-of-contents">
                    <ul className="space-y-2">
                      {headings.map((h, i) => (
                        <li key={i} className="flex items-start">
                          <a
                            onClick={() => scrollTo(h.id)}
                            className="cursor-pointer text-[14.5px] font-semibold text-[#3F489A] hover:text-[#2E357F] transition-colors hover:underline leading-relaxed block"
                            style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
                          >
                            {i + 1}. {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTENT */}
          <div className="markdown-content text-[#3F489A] text-[15.5px] md:text-[16.5px] leading-relaxed font-semibold mt-6 space-y-6">
            <ReactMarkdown
              components={{
                h1: headingRenderer(1),
                h2: headingRenderer(2),
                h3: headingRenderer(3),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden lg:block w-[2px] bg-[#2E357F]/60 mt-10 mb-28 self-stretch"></div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[290px] shrink-0">
          <BlogSidebar />
        </div>

      </div>

      {/* RELATED POSTS SECTION (FULL WIDTH) */}
      {post.posts && post.posts.length > 0 && (
        <div className="mx-auto max-w-[1400px] mt-16 pt-12 border-t border-slate-100">
          <h2 className="section-title mb-8">
            Bài viết liên quan
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {post.posts.map((relatedPost) => {
              const relImageUrl = relatedPost.thumbnail?.url
                ? process.env.NEXT_PUBLIC_BE_HOST + relatedPost.thumbnail.url
                : '/images/Rectangle.png';

              return (
                <div
                  key={relatedPost.id}
                  onClick={() => {
                    router.push(`/search-post/detail-post/${relatedPost.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer bg-[#EAF3FC] rounded-3xl p-4 border border-[#3F489A]/10 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="overflow-hidden rounded-2xl aspect-[4/3] relative w-full mb-4">
                    <Image
                      src={relImageUrl}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[#2E357F] font-black text-[14.5px] leading-snug line-clamp-2 uppercase tracking-wide group-hover:text-[#FF6B00] transition-colors mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-[#3F489A]/80 text-[12.5px] leading-relaxed line-clamp-3 font-semibold mt-auto">
                    {relatedPost.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}