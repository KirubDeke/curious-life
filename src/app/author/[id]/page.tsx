"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // For handling params Promise

interface Author {
  authorId: number;
  fullName: string;
  photo: string | null;
  bio: string;
  stats: {
    blogCount: number;
    totalLikes: number;
  };
}

export default function AuthorProfile({ params }: { params: Promise<{ id: string }> }) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap the params Promise
  const { id } = use(params);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        setError(null);

        // More flexible ID validation
        if (!id || typeof id !== 'string') {
          throw new Error('Author ID is required');
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/author/${id}`,
          {
            withCredentials: true,
            validateStatus: (status) => status < 500
          }
        );

        if (res.data.status === "fail") {
          throw new Error(res.data.message || 'Author not found');
        }

        if (!res.data?.data) {
          throw new Error('Invalid author data format');
        }

        setAuthor(res.data.data);
      } catch (err: any) {
        console.error("Error fetching author:", err);
        setError(err.message || 'Failed to load author profile');
        
        // Redirect to 404 if author not found
        if (err.message.includes('not found')) {
          router.push('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded-full w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Gradient Header with Name - Fixed positioning */}
          <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-noise opacity-20"></div>
            <h1 className="text-white text-3xl font-bold relative z-10 text-center">
              {author.fullName}
            </h1>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6 relative">
            <div className="flex flex-col items-center -mt-20">
              <div className="relative">
                {author.photo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${author.photo}`}
                    alt={author.fullName}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg flex items-center justify-center text-gray-500">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </h2>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {author.bio || 'This author prefers to let their work speak for itself.'}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blog Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {author.stats.blogCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Likes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {author.stats.totalLikes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}