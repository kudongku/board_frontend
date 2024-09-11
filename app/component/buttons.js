import { useRouter } from 'next/navigation';
import instance from '@/axios';

export default function Buttons({ postId }) {
  const router = useRouter();

  const handleDeleteClick = async () => {
    try {
      const response = await instance.delete(`/posts/${postId}`);

      if (response.status === 200) {
        router.push(`/`);
      } else {
        console('게시물 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response.data);
      }
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="flex justify-end mb-5">
      <div className="flex space-x-2">
        <button
          onClick={() => router.push(postId + '/edit')}
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
