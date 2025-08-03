'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomCard from '../../../components/CustomCard';
import Link from 'next/link';
import ClientLayout from '../../../components/ClientLayout';

interface Blog {
  id: number;
  title: string;
  body: string;
  category: string;
  image: string | null;
  createdAt: string;
  author: {
    id: number;
    fullName: string;
    photo: string | null;
  };
}

export default function SavedBlogsPage() {
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSavedBlogs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/getSavedBlogs`,
        { withCredentials: true }
      );

      if (Array.isArray(res.data.data)) {
        setSavedBlogs(res.data.data);
      } else {
        setError('No saved blogs found.');
      }
    } catch (err) {
      setError('Failed to fetch saved blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  if (loading) return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );

  if (error) return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={fetchSavedBlogs}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );

  if (savedBlogs.length === 0) return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your Reading List is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't saved any blogs yet. When you find interesting articles, click the bookmark icon to save them here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Explore Trending
              </Link>
              <Link
                href="/blogs"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedBlogs.map(blog => (
            <CustomCard
              key={blog.id}
              image={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
              category={blog.category}
              title={blog.title}
              description={blog.body.slice(0, 100) + '...'}
              authorImage={`${process.env.NEXT_PUBLIC_API_URL}${blog.author.photo}`}
              authorName={blog.author.fullName}
              authorId={blog.author.id}
              date={new Date(blog.createdAt).toLocaleDateString()}
              readTime="5 min read"
              blogId={blog.id}
            />
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}