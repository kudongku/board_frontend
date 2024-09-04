import { useRouter } from 'next/navigation';

export default function PostThumbnail({ post }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${post.postId}`);
  };

  return (
    <div
      className="p-6 border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-300">
            {post.title}
          </div>
          <div className="text-md text-gray-600">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="text-md text-gray-700 mb-4">{post.username}</div>
        <div className="text-sm text-gray-500">
          {/* Add any additional content or styling here if needed */}
        </div>
      </div>
    </div>
  );
}
