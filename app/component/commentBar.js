import React, { useState, useEffect } from 'react';
import instance from '@/axios';
import { useRouter } from 'next/navigation';
import Comment from './Comment';

export default function CommentBar({ postId }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(
          `/posts/${postId}/comments?page=${currentPage}&size=10&sort=createdAt,desc`
        );
        setComments(response.data.content);
        setHasNext(!response.data.last);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response.status == 403) {
          alert('권한이 없어 로그인창으로 이동합니다.');
          router.push('/login');
        } else {
          alert(error.response.data);
        }
      }
    };

    fetchPosts();
  }, [postId, currentPage]);

  const handlePageGroupChange = (direction) => {
    setCurrentPage(currentPage + direction);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await instance.post(`/posts/${postId}/comments`, data);

      if (response.status === 200) {
        window.location.href = `/posts/${postId}`;
      } else {
        console.log('댓글 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('댓글 생성 실패:', error);
      if (error.response.status == 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response.data);
      }
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

      <div className="flex justify-center space-x-2 mt-4">
        {currentPage !== 0 && (
          <button
            onClick={() => handlePageGroupChange(-1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            이전
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => handlePageGroupChange(1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
