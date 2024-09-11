'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/axios';

export default function Home({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${params.id}`);
        setPost(response.data);
        setLoading(false);

        const responseTwo = await instance.get(`/posts/${params.id}/files`, {
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(responseTwo.data);
        setPostImage(imageUrl);

        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      } catch (error) {
        console.error('Error fetching posts:', error);

        if (error.response?.status === 403) {
          alert('권한이 없어 로그인창으로 이동합니다.');
          router.push('/login');
        }

        setLoading(false);
      }
    };
    fetchPosts();
  }, [params.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setLoading(true);
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');

    try {
      await instance.put(`/posts/${params.id}`, {
        title,
        content,
      });

      if (image && params.id) {
        console.log('!!!');
        const imageFormData = new FormData();
        imageFormData.append('postImage', image);

        const imageResponse = await instance.put(
          `/posts/${params.id}/files`,
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (imageResponse.status !== 200) {
          console.error('이미지 업로드 중 오류가 발생했습니다.');
        }
      }

      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('게시물 생성 실패:', error);
      if (error.response?.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      }
      router.push(`/posts/${params.id}`);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await instance.delete(`/posts/${params.id}/files`);
      if (response.status === 200) {
        console.log(response);
        setPostImage(null);
        alert('이미지가 삭제되었습니다.');
      } else {
        alert('이미지 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제 실패');
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
        <div>
          {postImage ? (
            <div>
              <img
                src={postImage}
                alt="Post"
                className="max-w-full h-auto mb-4"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                이미지 삭제
              </button>
            </div>
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </div>
        <div>
          <p>수정을 원하시면 다른 사진을 업로드 해주세요</p>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-lg"
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
