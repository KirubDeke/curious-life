'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { FaComment, FaHeart } from 'react-icons/fa';

type Blog = {
    id: number;
    title: string;
    body: string;
    category: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    authorId: number;
    likeCount: number;
    commentCount: number;
    author: {
        fullName: string;
        photo: string;
    };
};

export default function CategoryBlogsPage() {
    const { category } = useParams();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/category`,
                    { category },
                    { withCredentials: true }
                );
                setBlogs(res.data.blogs || []);
            } catch (error) {
                console.error('Failed to fetch blogs by category:', error);
            } finally {
                setLoading(false);
            }
        };

        if (category) fetchBlogs();
    }, [category]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="relative">
                    {/* Animated spinner */}
                    <div className="w-24 h-24 border-8 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <div className="mt-8 text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800 animate-pulse">Loading Blogs</h2>
                        <p className="text-gray-500 text-lg">Curating the best content for you</p>
                    </div>

                    <div className="w-64 h-2 bg-gray-200 rounded-full mt-8 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blogs.length) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-8 text-center z-40">
                <div className="max-w-2xl">
                    {/* Illustration */}
                    <div className="relative w-64 h-64 mx-auto mb-8">
                        <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                        <svg
                            className="w-full h-full text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    </div>

                    {/* Message */}
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">No Blogs Found</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We couldn&apos;t find any blogs in this category. Maybe try another category or check back later.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Refresh Page
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
                        >
                            Browse All Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Blogs in &quot;{category}&quot;
            </h1>
            <div className="grid md:grid-cols-1">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
                            alt={blog.title}
                            width={800}
                            height={450}
                            className="w-full h-52 object-cover rounded-md"
                        />
                        <h2 className="mt-4 text-xl font-bold text-gray-800">{blog.title}</h2>

                        <div className="flex items-center gap-2 mt-3">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${blog.author.photo}`}
                                alt={blog.author.fullName}
                                width={32}
                                height={32}
                                className="rounded-full w-8 h-8 object-cover"
                            />
                            <span className="text-sm text-gray-700">{blog.author.fullName}</span>
                        </div>

                        <p className="mt-4 text-gray-600 text-sm line-clamp-4">
                            {blog.body}
                        </p>

                        <div className="flex justify-between items-center mt-4 text-gray-600">
                            <p className="text-sm">
                                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                            </p>
                            <div className="flex items-center gap-x-4 text-xl">
                                <span className="flex items-center gap-1">
                                    <FaHeart />
                                    {blog.likeCount}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaComment />
                                    {blog.commentCount}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/blogs/${blog.id}`}
                            className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium"
                        >
                            Read more →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}