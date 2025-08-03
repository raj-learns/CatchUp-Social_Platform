import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PostCard({ post }) {
  const { data: session } = useSession();
  const [clapCount, setClapCount] = useState(post._count.claps);
  
  const handleClap = async (e) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (!session) return;

    setClapCount(clapCount + 1);

    try {
      await fetch(`http://localhost:3001/api/posts/${post.id}/clap`, {
        method: 'POST',
      });
    } catch (error) {
      console.error("Failed to clap:", error);
      setClapCount(clapCount);
    }
  };

  return (
    <Link href={`/posts/${post.id}`} className="block hover:bg-gray-50 transition-colors rounded-lg">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
          <div>
            <p className="font-bold text-gray-800">{post.author.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            <span className="text-gray-500">{post._count.comments} comments</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleClap}
              disabled={!session}
              className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 disabled:hover:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {/* Using the emoji instead of an SVG */}
              <span className="text-2xl" role="img" aria-label="clap">👏</span>
              <span className="font-semibold">{clapCount}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
