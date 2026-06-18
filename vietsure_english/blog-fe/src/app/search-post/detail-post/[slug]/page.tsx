'use client';

import DateAndCategories from '@/components/custom/common/date-and-categories';
import TrialSection from '@/components/custom/common/traial-section';
import usePostStore from '@/state-manager/post-store';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

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

export default function Detail() {
  const { post } = usePostStore();
  const [collapsed, setCollapsed] = useState(false);

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

  if (!post) return <div className="md:col-span-3"></div>;

  return (
    <div className="md:col-span-3 mb-10">
      <div className="max-w-3xl mx-auto px-6 mt-10">

        {/* ===== TOC ===== */}
        {headings.length > 0 && (
          <div className="toc border border-[#cccccc] bg-white my-5 p-5 italic text-[#0a2240] font-[SVN-Gilroy]">

            {/* TITLE */}
            <p className="title font-bold mb-3 flex items-center justify-between">
              <span>Mục lục</span>

              <span
                onClick={() => setCollapsed(!collapsed)}
                className="cursor-pointer text-sm text-gray-600"
              >
                [{collapsed ? 'Hiện' : 'Ẩn'}]
              </span>
            </p>

            {!collapsed && (
              <div className="wrap overflow-hidden transition-all duration-300" style={{ maxHeight: '182px' }}>
                <div className="table-of-contents">
                  <ul className="space-y-1">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a
                          onClick={() => scrollTo(h.id)}
                          className="cursor-pointer hover:underline block"
                          style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
                        >
                          {h.text}
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
        <DateAndCategories responsePostDTO={post} />

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

      {/* CTA */}
      <section
        style={{
          background:
            "linear-gradient(270deg, rgba(249, 245, 247, 0.47), rgba(244, 236, 236, 0.1))",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>
    </div>
  );
}