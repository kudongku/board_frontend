import React, { useState } from 'react';
import instance from '@/axios';
import { useRouter } from 'next/navigation';

export default function Comment({ comment, postId, onUpdate }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleEditSubmit = async () => {
    try {
      const response = await instance.put(
        `/posts/${postId}/comments/${comment.commentId}`,
        { content: editText }
      );

      if (response.status === 200) {
        onUpdate();
        setIsEditing(false);
      } else {
        alert('댓글 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      if (error.response.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response.data);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await instance.delete(
        `/posts/${postId}/comments/${comment.commentId}`
      );

      if (response.status === 200) {
        onUpdate();
      } else {
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      if (error.response.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response.data);
      }
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-lg">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleEditSubmit}
            className="px-3 py-1.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            수정 완료
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-black-700">
              {comment.content}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-blue-300 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                ✍️
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-2 py-1 bg-red-300 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
              >
                🗑️
              </button>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {comment.writerUsername}
          </div>
        </>
      )}
    </div>
  );
}
