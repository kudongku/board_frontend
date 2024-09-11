'use client';

import Buttons from '../../component/buttons';
import React, { useEffect, useState } from 'react';
import instance from '../../../axios';
import { useRouter } from 'next/navigation';
import CommentBar from '@/app/component/commentBar';

export default function Detail({ params }) {
  const router = useRouter();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [postImage, setPostImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${postId}`);
        setPost(response.data);

        const responseTwo = await instance.get(`/posts/${postId}/files`, {
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(responseTwo.data);
        setPostImage(imageUrl);

        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('권한이 없어 로그인창으로 이동합니다.');
          router.push('/login');
        } else if (error.response.status !== 452) {
          console.error('Error fetching posts:', error);
          alert(error.message);
        }
      }
    };

    fetchPosts();
  }, [postId, router]);

  if (!post) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">작성자: {post.username}</p>
      <Buttons postId={postId} />
      <div>
        {postImage && (
          <img src={postImage} alt="Post" className="max-w-full h-auto" />
        )}
      </div>
      <p className="text-gray-800 mt-4">{post.content}</p>
      <hr className="my-6 border-gray-300" />
      <CommentBar postId={postId} />
    </div>
  );
}
