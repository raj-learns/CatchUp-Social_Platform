import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SinglePostPage({ post }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clapCount, setClapCount] = useState(post?._count?.claps ?? 0);

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto mt-10 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </div>
    );
  }
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!commentText.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentText,
          authorId: session.user.id,
        }),
      });

      if (!res.ok) { throw new Error('Failed to submit comment.'); }

      setSuccess('Comment posted!');
      setCommentText('');
      router.replace(router.asPath);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleClap = async () => {
    if (!session) {
      alert('You must be logged in to clap!');
      return;
    }
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

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }
    try {
        const res = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete post.');
        router.push('/');
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    try {
        const res = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete comment.');
        router.replace(router.asPath);
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
  };

  const isPostAuthor = session && session.user.id === post.authorId;

  return (
    <div>
      <Head>
        <title>{post.title} | Social Platform</title>
      </Head>
      <Navbar />

      <main className="container mx-auto max-w-3xl mt-8 p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
          <div>
            <p className="font-bold text-gray-900">{post.author.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          {isPostAuthor && (
            <button
              onClick={handleDeletePost}
              className="ml-auto bg-red-500 text-white text-sm font-bold py-1 px-3 rounded hover:bg-red-700"
            >
              Delete Post
            </button>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-800 text-lg whitespace-pre-wrap">{post.content}</p>
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleClap}
              disabled={!session}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <span className="text-3xl" role="img" aria-label="clap">👏</span>
              <span className="text-lg font-semibold">{clapCount}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>
          
          {/* This is the restored comment form */}
          {session ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              {error && <p className="p-2 mb-2 text-sm text-red-800 bg-red-100 rounded-lg">{error}</p>}
              {success && <p className="p-2 mb-2 text-sm text-green-800 bg-green-100 rounded-lg">{success}</p>}
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Write a comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="text-gray-500 mb-4">You must be logged in to post a comment.</p>
          )}

          <div className="space-y-4">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const isCommentAuthor = session && session.user.id === comment.authorId;
                return (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{comment.author.username}</p>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`http://localhost:3001/api/posts/${id}`);
    if (!res.ok) return { props: { post: null } };
    const post = await res.json();
    return { props: { post } };
  } catch (error) {
    console.error("Error fetching single post:", error);
    return { props: { post: null } };
  }
}
