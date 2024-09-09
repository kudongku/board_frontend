'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bearerToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    setIsLoggedIn(false);
    // 로그아웃 후 홈으로 리디렉션
    window.location.href = '/';
  };

  return (
    <div className="container mx-auto px-4 py-2 flex justify-start items-center">
      <Link href="/" className="text-xl font-bold hover:text-gray-200 mr-4">
        게시판
      </Link>
      <Link
        href="/posts"
        className="text-xl font-bold hover:text-gray-200 mr-4"
      >
        Posting
      </Link>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="text-xl font-bold hover:text-gray-200"
        >
          로그아웃
        </button>
      ) : (
        <Link href="/login" className="text-xl font-bold hover:text-gray-200">
          로그인
        </Link>
      )}
    </div>
  );
}
