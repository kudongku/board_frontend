'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/axios';

export default function Home({ params }) {
  const router = useRouter();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${params.id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response.status == 403) {
          alert('권한이 없어 로그인창으로 이동합니다.');
          router.push('/login');
        } else {
          alert(error.response.data);
        }
        setLoading(false);
      }
    };
    fetchPosts();
  }, [params.id]);

  const [loading, setLoading] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await instance.put(`/posts/${params.id}`, data);
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시물 생성 실패:', error);
      if (error.response.status == 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response.data);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시글 수정하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={post.content}
            required
            rows={10}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          제출
        </button>
      </form>
    </div>
  );
}
