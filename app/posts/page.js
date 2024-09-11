'use client';

import { useRouter } from 'next/navigation';
import instance from '../../axios';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');

    try {
      const response = await instance.post('/posts', {
        title,
        content,
      });

      if (response.status === 200) {
        const postId = response.data;

        if (image && postId) {
          const imageFormData = new FormData();
          imageFormData.append('postImage', image);
          // 파일업로드 먼저
          const imageResponse = await instance.post(
            `/posts/${postId}/files`,
            imageFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (imageResponse.status === 200) {
            router.push(`/`);
          } else {
            console.error('이미지 업로드 중 오류가 발생했습니다.');
          }
        }
      } else {
        console.error('게시물 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('요청 실패:', error);
      if (error.response.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      }
      router.push(`/`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">게시글 작성하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="제목"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            id="content"
            name="content"
            placeholder="글 내용"
            required
            rows={10}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
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
          disabled={loading}
        >
          {loading ? 'Submitting...' : '제출'}
        </button>
      </form>
    </div>
  );
}
