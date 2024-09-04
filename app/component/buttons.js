'use client';

import { useRouter, usePathname } from 'next/navigation';
import instance from '@/axios';

export default function Buttons() {
  const router = useRouter();
  const currentPath = usePathname();
  const postId = currentPath.split('/')[2];

  const handleDeleteClick = async () => {
    const response = await instance.delete(`/posts/${postId}`);
    console.log(response.data);

    if (response.status === 200) {
      router.push(`/`);
    } else {
      console.log('게시물 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex justify-end mb-5">
      <div className="flex space-x-2">
        <button
          onClick={() => router.push(currentPath + '/edit')}
          className="px-3 py-1.5 bg-blue-300 text-white font-semibold rounded-lg hover:bg-blue-600 hover:scale-110 hover:shadow-lg transition-transform transition-shadow duration-300 ease-in-out text-sm"
        >
          ✍️
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-3 py-1.5 bg-red-300 text-white font-semibold rounded-lg hover:bg-red-600 hover:scale-110 hover:shadow-lg transition-transform transition-shadow duration-300 ease-in-out text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
