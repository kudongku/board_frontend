'use client';

import Buttons from '../../component/buttons';
import React, { useEffect, useState } from 'react';
import instance from '../../../axios';
// import Comments from './comment';

export default function Detail({ params }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${params.id}`);
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [params.id]);

  if (!post) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">작성자: {post.username}</p>
      <Buttons />
      <p className="text-gray-800 mt-4">{post.content}</p>
      <hr className="my-6 border-gray-300" />
      {/* <Comments /> */}
    </div>
  );
}
