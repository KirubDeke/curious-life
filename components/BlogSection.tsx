"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CustomCard from "./CustomCard";

interface Blog {
    id: number;
    title: string;
    body: string;
    category: string;
    image: string | null;
    postTime: string;
    readingTime: string;
    author: {
        id: number,
        fullName: string;
        photo: string | null;
    };
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs`,
                    { withCredentials: true }
                );
                setBlogs(response.data?.data || []);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setError('no-blogs');
                } else {
                    console.error("Failed to fetch blogs:", err);
                    setError("Failed to load blogs. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

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
            </div>
        );
    }

    if (blogs.length === 0 || error === 'no-blogs') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 text-center">
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
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Blogs Found</h2>
                <p className="text-gray-500 max-w-md">
                    There are currently no blogs available. Check back later for updates.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => {
                    const imageUrl = blog.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}${blog.image}`
                        : null;

                    const authorImageUrl = blog.author?.photo
                        ? `${process.env.NEXT_PUBLIC_API_URL}${blog.author.photo}`
                        : null;

                    const shortName =
                        !blog.author?.photo && blog.author?.fullName
                            ? blog.author.fullName
                                .split(" ")
                                .map((part, idx) => (idx === 0 ? part[0] + "." : part))
                                .join(" ")
                            : blog.author?.fullName || "";

                    return (
                        <CustomCard
                            key={blog.id}
                            image={imageUrl}
                            category={blog.category}
                            title={blog.title}
                            description={`${blog.body.split(" ").slice(0, 20).join(" ")}...`}
                            authorImage={authorImageUrl}
                            authorName={shortName}
                            authorId={blog.author?.id ?? 0}
                            date={blog.postTime}
                            readTime={blog.readingTime}
                            blogId={blog.id}                        />
                    );
                })}
            </div>
        </div>
    );
}