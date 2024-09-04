'use client';

import React, { useEffect, useState } from 'react';
import instance from '../axios';
import PostThumbnail from './component/postThumbnail';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6 pt-20 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">게시물 목록</h1>
      <div className="w-full max-w-4xl space-y-4">
        {posts.map((post) => (
          <PostThumbnail key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
