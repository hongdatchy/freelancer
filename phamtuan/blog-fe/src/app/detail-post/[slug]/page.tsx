'use client';
import DateAndCategories from '@/components/custom/common/date-and-categories';
import { getData, putData } from '@/service/api';
import usePostStore from '@/state-manager/post-store';
import useUserLoginStore from '@/state-manager/user-login-store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Detail() {

  const [userWithPosts, setUserWithPosts] = useState<any>(null);
  const { post } = usePostStore();
  const { jwt, user } = useUserLoginStore();
  const isRegistered = userWithPosts?.posts?.some((p: any) => p.id === post?.id);


  const fetchUserWithPosts = async () => {
      if (!user || !jwt) return;

      try {
        const res = await getData(`api/users/${user.id}?populate=posts`);
        setUserWithPosts(res);
      } catch (err) {
        console.error('Lỗi khi lấy user kèm posts:', err);
      }
    };
  useEffect(() => {
    fetchUserWithPosts();
  }, [user, jwt]);

  const handleAddCourse = async () => {
    if (!user || !post || !jwt) return;

    try {
      await putData(
        `api/users/${user.id}`,
        {
          posts: {
            connect: [post.id],
          },
        }
      );
      await fetchUserWithPosts();
      alert('Đã thêm khóa học');
    } catch (error) {
      console.error('Lỗi khi thêm khóa học:', error);
      alert('Lỗi khi thêm khóa học');
    }
  };

  const handleRemoveCourse = async () => {
    if (!user || !post || !jwt) return;

    try {
      await putData(
        `api/users/${user.id}`,
        {
          posts: {
            disconnect: [post.id],
          },
        }
      );
      await fetchUserWithPosts();
      alert('Đã hủy khóa học');
    } catch (error) {
      console.error('Lỗi khi hủy khóa học:', error);
      alert('Lỗi khi hủy khóa học');
    }
  };



  if (!post) {
    return <div className="md:col-span-3"></div>;
  }

  return (
    <div className="md:col-span-3 mb-10">
      <div className="md:pl-32 md:pr-32 mt-10">
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow">
          <Image
            sizes="100%"
            alt=""
            src={process.env.NEXT_PUBLIC_BE_HOST + post.thumbnail?.url}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div id="content-detail-post" className="md:pl-32 md:pr-32 mt-10">
        <DateAndCategories responsePostDTO={post} />
        <ReactMarkdown>{post.content}</ReactMarkdown>

        {!isRegistered ? (
          <button
            onClick={handleAddCourse}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Thêm khóa học
          </button>
        ) : (
          <button
            onClick={handleRemoveCourse}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Hủy khóa học
          </button>
        )}
      </div>
    </div>
  );
}
