'use client';

import React, { useEffect, useState } from 'react';
import instance from '../axios';
import PostThumbnail from './component/postThumbnail';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const pagesPerGroup = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(
          `/posts?page=${currentPage}&size=${postsPerPage}&sort=createdAt,desc`
        );

        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert(error.response.data);
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);

  const getPaginationRange = () => {
    const startPage = currentPageGroup * pagesPerGroup;
    const endPage = Math.min(startPage + pagesPerGroup, totalPages);
    return [...Array(endPage - startPage).keys()].map((i) => startPage + i);
  };

  const handlePageGroupChange = (direction) => {
    const newPageGroup = currentPageGroup + direction;
    if (newPageGroup >= 0 && newPageGroup * pagesPerGroup < totalPages) {
      setCurrentPageGroup(newPageGroup);
      setCurrentPage((prev) => Math.max(prev, newPageGroup * pagesPerGroup));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6 pt-20 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">게시물 목록</h1>

      <div className="mb-4">
        <label htmlFor="페이지당 게시물 수" className="mr-2 text-gray-700">
          페이지당 게시물 수:
        </label>
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(Number(e.target.value))}
          className="px-2 py-1 border rounded"
        >
          {[5, 10, 20, 30].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-4xl space-y-4">
        {posts.map((post) => (
          <PostThumbnail key={post.postId} post={post} />
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mt-6 space-y-2 ">
        <div className="flex justify-center space-x-2">
          {currentPageGroup > 0 && (
            <button
              onClick={() => handlePageGroupChange(-1)}
              className="px-4 py-2 rounded bg-blue-500 text-white"
            >
              이전
            </button>
          )}

          {getPaginationRange().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-200 text-gray-700 hover:bg-blue-400'
              }`}
            >
              {page + 1}
            </button>
          ))}

          {(currentPageGroup + 1) * pagesPerGroup < totalPages && (
            <button
              onClick={() => handlePageGroupChange(1)}
              className="px-4 py-2 rounded bg-blue-500 text-white"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
