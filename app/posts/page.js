'use client';

import { useRouter } from 'next/navigation';
import instance from '../../axios';

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await instance.post('/posts', data);

      if (response.status === 200) {
        router.push(`/`);
      } else {
        console.error('게시물 생성 중 오류가 발생했습니다.');
      }
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
