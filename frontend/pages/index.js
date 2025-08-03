import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard"; // Import the new component
import Head from "next/head";

// The Home component now receives 'posts' as a prop
export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Catch Up!</title>
        <meta name="description" content="A social media platform built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto mt-8 p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
        
        {/* Check if there are posts to display */}
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-600">No posts yet. Be the first to create one!</p>
        )}
      </main>
    </div>
  );
}

// This function runs on the server before the page is rendered
export async function getServerSideProps(context) {
  try {
    // Fetch all posts from our backend API
    const res = await fetch('http://localhost:3001/api/posts');
    
    if (!res.ok) {
      // If the response is not ok, return an empty array for posts
      console.error("Failed to fetch posts:", res.status);
      return { props: { posts: [] } };
    }

    const posts = await res.json();

    // Pass the fetched posts to the page component as props
    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      props: {
        posts: [], // Return empty array on error
      },
    };
  }
}
