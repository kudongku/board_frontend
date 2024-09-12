'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/axios';

export default function Home({ params }) {
  const router = useRouter();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(`/posts/${postId}`);
        setPost(response.data);
        setLoading(false);
        let hasFile = response.data.hasFile;

        if (hasFile) {
          const fileResponse = await instance.get(`/posts/${postId}/files`, {
            responseType: 'blob',
          });

          const disposition = fileResponse.headers['content-disposition'];
          const extractedFileName = disposition
            ? disposition.split('filename=')[1]?.replace(/"/g, '')
            : 'downloaded_file';

          const fileBlob = fileResponse.data;
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileUrl(fileUrl);
          setFileName(extractedFileName);

          return () => {
            URL.revokeObjectURL(fileUrl);
          };
        }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const content = formData.get('content');

    try {
      let uploadedFildId = null;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('postImage', imageFile);

        const imageResponse = await instance.put(
          `/posts/${postId}/files`,
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (imageResponse.status === 200) {
          uploadedFildId = imageResponse.data.fileId;
        }
      }

      await instance.put(`/posts/${postId}`, {
        title,
        content,
        fileId: uploadedFildId,
      });

      router.push(`/posts/${postId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      }
      console.error('Error fetching posts:', error);
      alert(error.response.data);

      router.push(`/posts/${postId}`);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await instance.delete(`/posts/${postId}/files`);

      if (response.status === 200) {
        setFileUrl(null);
        setImageFile(null);
        alert('이미지가 삭제되었습니다.');
      } else {
        alert('이미지 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제 실패');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시글 수정하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={post.content}
            required
            rows={10}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          {fileUrl && (
            <div>
              <a
                href={fileUrl}
                download={fileName}
                className="text-blue-600 underline"
              >
                {fileName || '파일 다운로드'}
              </a>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
        <div>
          <p>수정을 원하시면 다른 파일을 업로드 해주세요</p>
          <input
            id="file"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          제출
        </button>
      </form>
    </div>
  );
}
