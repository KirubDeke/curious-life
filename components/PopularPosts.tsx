'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomCard from './CustomCard';

interface Author {
  id: number;
  fullName: string;
  photo: string | null;
}

interface BlogFromApi {
  id: number;
  title: string;
  body: string;
  category: string;
  image: string | null;
  author: Author;
  createdAt: string;
}

export default function PopularPosts() {
  const [blogs, setBlogs] = useState<BlogFromApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const { data } = await axios.get<{
          status: string;
          message: string;
          blogs: BlogFromApi[];
        }>(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/popular`);
        setBlogs(data.blogs);
      } catch (err: unknown) {
        console.error(err);

        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load popular posts');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load popular posts');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-12">
        <h2 className="text-4xl font-bold mb-8">Popular Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-12">
        <h2 className="text-4xl font-bold mb-4">Popular Posts</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
          <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-red-800">Error loading posts</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-12">
        <h2 className="text-4xl font-bold mb-8 text-center">Popular Posts</h2>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-indigo-100 p-6 rounded-full">
              <svg className="h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>
          <h3 className="mt-6 text-2xl font-medium text-gray-900">No Popular Posts Yet</h3>
          <p className="mt-3 text-gray-600">
            It seems no posts have gained enough traction to be popular yet. 
            Be the first to create amazing content!
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className='w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-12'>
      <h2 className="text-4xl font-bold mb-8">Popular Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => {
          const wordCount = b.body.trim().split(/\s+/).length;
          const readTime = Math.ceil(wordCount / 200) + ' min read';

          const description =
            b.body.length > 150
              ? b.body.slice(0, 147).trim() + '…'
              : b.body;

          const date = new Date(b.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <CustomCard
              key={b.id}
              blogId={b.id}
              image={`${process.env.NEXT_PUBLIC_API_URL}${b.image}`}
              category={b.category}
              title={b.title}
              description={description}
              authorImage={
                b.author.photo
                  ? `${process.env.NEXT_PUBLIC_API_URL}${b.author.photo}`
                  : null
              }
              authorName={b.author.fullName}
              authorId={b.author.id}
              date={date}
              readTime={readTime}
            />
          );
        })}
      </div>
    </section>
  );
}
