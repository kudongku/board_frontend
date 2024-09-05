import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import instance from '@/axios';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const currentPath = usePathname();
  const postId = currentPath.split('/')[2];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert(error.response.data);
      }
    };

    fetchPosts();
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await instance.post(`/posts/${postId}/comments`, data);

      if (response.status === 200) {
        instance
          .get(`/posts/${postId}/comments`)
          .then((response) => setComments(response.data));
      } else {
        console.log('댓글 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 생성 실패:', error);
      alert(error.response.data);
    }

    event.target.reset();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6 pt-20 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div className="flex items-center space-x-4">
          <input
            id="content"
            type="text"
            name="content"
            placeholder="댓글 입력"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            확인
          </button>
        </div>
      </form>

      <div className="w-full max-w-4xl space-y-4 mt-6">
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            comment={comment}
            postId={postId}
            onUpdate={() =>
              instance
                .get(`/posts/${postId}/comments`)
                .then((response) => setComments(response.data))
            }
          />
        ))}
      </div>
    </div>
  );
}

const Comment = ({ comment, postId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleEditSubmit = async () => {
    try {
      const response = await instance.put(
        `/posts/${postId}/comments/${comment.commentId}`,
        { content: editText }
      );

      if (response.status === 200) {
        setIsEditing(false);
        onUpdate();
      } else {
        alert('댓글 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert(error.response.data);
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
        setError('댓글 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert(error.response.data);
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
};
