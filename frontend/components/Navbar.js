import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Catch Up!
        </Link>

        <div className="flex items-center space-x-4">
          {loading && <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div>}

          {!loading && !session && (
            <>
              <Link href="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </>
          )}

          {!loading && session && (
            <>
              {/* This is the new link */}
              <Link href="/create" className="text-white hover:text-gray-300">
                Create Post
              </Link>
              <span className="text-white font-bold">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
