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
    const file = formData.get('file');

    try {
      let uploadedFildId = null;

      if (file.name !== '') {
        const fileFormData = new FormData();
        fileFormData.append('postFile', file);
        const imageResponse = await instance.post(
          `/posts/files`,
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (imageResponse.status === 200) {
          uploadedFildId = imageResponse.data.fileId;
        }
      }

      const response = await instance.post('/posts', {
        title,
        content,
        fileId: uploadedFildId,
      });

      if (response.status === 200) {
        router.push(`/`);
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
            id="file"
            type="file"
            name="file"
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
