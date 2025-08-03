import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // This effect handles protecting the route
  useEffect(() => {
    // If the session is loading, do nothing yet
    if (status === 'loading') return;
    // If there is no session, redirect to the login page
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorId: session.user.id, // Get the author's ID from the session
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      setSuccess('Post created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/'); // Redirect to homepage to see the new post
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  // While loading or if not authenticated, show a loading message
  if (status === 'loading' || !session) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  // If authenticated, show the form
  return (
    <div>
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-10 p-4">
        <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          {error && <p className="p-3 text-sm text-red-800 bg-red-100 rounded-lg">{error}</p>}
          {success && <p className="p-3 text-sm text-green-800 bg-green-100 rounded-lg">{success}</p>}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
