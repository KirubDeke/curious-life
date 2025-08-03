'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import ClientLayout from '../../../components/ClientLayout';

type Author = {
  fullName: string;
  photo: string | null;
};

type Blog = {
  id: number;
  title: string;
  body: string;
  category: string;
  image: string;
  postTime: string;
  readingTime: string;
  author: Author;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/me`, {
          withCredentials: true
        });
        setBlogs(response.data?.blogs || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('no-blogs'); // Special case for no blogs
          } else {
            setError(err.response?.data?.message || err.message);
          }
        } else {
          setError('Failed to fetch blogs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col p-6`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this blog? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setDeletingId(id);
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/deleteBlog/${id}`, {
                  withCredentials: true,
                });
                setBlogs((prev) => prev.filter((blog) => blog.id !== id));
                toast.success("Blog deleted successfully");
              } catch (err) {
                console.error('Error deleting blog:', err);
                toast.error("Failed to delete blog. Please try again.");
              } finally {
                setDeletingId(null);
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && error !== 'no-blogs') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Blogs</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none transition duration-150 ease-in-out"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClientLayout>
    <div className="w-full bg-background text-foreground max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <Link
          href="/createblogform"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 || error === 'no-blogs' ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 text-center">
          {/* Illustration */}
          <div className="relative w-64 h-64 mb-8">
            <svg
              className="w-full h-full text-gray-200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 180C145.228 180 182 143.228 182 98C182 52.7715 145.228 16 100 16C54.7715 16 18 52.7715 18 98C18 143.228 54.7715 180 100 180Z"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M100 132V132.1"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M100 60V84"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M60 80L84 80"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M116 80L140 80"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Blogs Found</h2>
          <p className="text-gray-500 max-w-md mb-6">
            It looks like you haven't created any blogs yet. Ready to share your thoughts with the world?
          </p>

          {/* Action Button */}
          <Link
            href="/createblogform"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              {blog.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                    {blog.category}
                  </span>
                  <div className="text-gray-500 text-sm">
                    {blog.postTime} • {blog.readingTime}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.body.replace(/\r\n/g, ' ').substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    {blog.author.photo ? (
                      <div className="relative w-8 h-8 rounded-full mr-2 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${blog.author.photo}`}
                          alt={blog.author.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium mr-2">
                        {blog.author.fullName.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{blog.author.fullName}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/editblogs/${blog.id}`)}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition duration-200"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      disabled={deletingId === blog.id}
                      onClick={() => handleDelete(blog.id)}
                      className={`text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200 ${deletingId === blog.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </ClientLayout>
  );
}