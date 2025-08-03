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
      setError('Failed to fetch saved blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
      <div className="flex justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-64 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
      <div className="text-center text-red-500 py-10">{error}</div>
    </div>
  );

  if (savedBlogs.length === 0) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Blogs</h1>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="max-w-md text-center">
          {/* Illustration SVG - you can replace this with your own image */}
          <svg
            className="w-64 h-64 mx-auto mb-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>

          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Your Reading List is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't saved any blogs yet. Start exploring and save interesting articles to read later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Discover Blogs
          </Link>
        </div>
      </div>
    </div>
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