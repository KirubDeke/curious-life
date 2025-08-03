'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
    id: number
    fullName: string
    email: string
    photo: string
}

interface Like {
    id: number
    userId: number
    user: User
}

interface Comment {
    id: number
    content: string
    createdAt: string
    user: User
}

interface Blog {
    id: number
    title: string
    body: string
    category: string
    image: string
    createdAt: string
    author: User
    likes: Like[]
    comments: Comment[]
}

interface BlogsResponse {
    rows: any
    count: number
    status: string
    message: string
    data: {
        count: number
        rows: Blog[]
    }
}

export default function AdminBlogsPage() {
    const [blogsData, setBlogsData] = useState<BlogsResponse | null>(null)
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [blogToDelete, setBlogToDelete] = useState<number | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/blogs`, {
                    withCredentials: true
                })
                setBlogsData(response.data.data)
            } catch (err) {
                setError('Failed to load blogs')
                console.error('Error fetching blogs:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    const openModal = (blog: Blog) => {
        setSelectedBlog(blog)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedBlog(null)
    }

    const openDeleteConfirmation = (blogId: number) => {
        setBlogToDelete(blogId)
        setShowDeleteConfirm(true)
    }

    const closeDeleteConfirmation = () => {
        setShowDeleteConfirm(false)
        setBlogToDelete(null)
    }

    const handleDeleteBlog = async () => {
        if (!blogToDelete) return
        
        try {
            setIsDeleting(true)
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/removeBlog/blog/${blogToDelete}`, {
                withCredentials: true
            })
            router.refresh()
        } catch (error) {
            console.error('Error deleting blog:', error)
            alert('Failed to delete blog')
        } finally {
            setIsDeleting(false)
            closeDeleteConfirmation()
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Blogs</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!blogsData || blogsData.count === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">No Blogs Found</h1>
                    <p className="text-gray-600 mb-6">
                        It looks like there are no blogs available at the moment. Check back later or create a new blog to get started.
                    </p>
                    <button onClick={() => router.refresh()} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Refresh Page
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Blog Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogsData.rows.map((blog: Blog) => (
                    <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}` || '/placeholder-blog.jpg'}
                            alt={blog.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex items-center mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {blog.category}
                                </span>
                                <span className="text-gray-500 text-sm ml-auto">
                                    {formatDate(blog.createdAt)}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{blog.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">{blog.body}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${blog.author.photo}` || '/placeholder-user.jpg'}
                                        alt={blog.author.fullName}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{blog.author.fullName}</span>
                                </div>

                                <button
                                    onClick={() => openModal(blog)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    See more →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedBlog && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedBlog.title}</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${selectedBlog.image}` || '/placeholder-blog.jpg'}
                                    alt={selectedBlog.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {selectedBlog.category}
                                </span>
                                <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {formatDate(selectedBlog.createdAt)}
                                </span>
                            </div>

                            <div className="prose max-w-none mb-8">
                                <p className="whitespace-pre-line text-gray-700">{selectedBlog.body}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">About the Author</h3>
                                <div className="flex items-center">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${selectedBlog.author.photo}` || '/placeholder-user.jpg'}
                                        alt={selectedBlog.author.fullName}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-800">{selectedBlog.author.fullName}</h4>
                                        <p className="text-gray-600 text-sm">{selectedBlog.author.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Likes ({selectedBlog.likes.length})</h3>
                                    <div className="space-y-2">
                                        {selectedBlog.likes.length > 0 ? (
                                            selectedBlog.likes.map(like => (
                                                <div key={like.id} className="flex items-center">
                                                    <img
                                                        src={like.user.photo || '/placeholder-user.jpg'}
                                                        alt={like.user.fullName}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">{like.user.fullName}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No likes yet</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Comments ({selectedBlog.comments.length})</h3>
                                    <div className="space-y-4">
                                        {selectedBlog.comments.length > 0 ? (
                                            selectedBlog.comments.map(comment => (
                                                <div key={comment.id} className="border-b border-gray-200 pb-3 last:border-0">
                                                    <div className="flex items-center mb-2">
                                                        <img
                                                            src={comment.user.photo || '/placeholder-user.jpg'}
                                                            alt={comment.user.fullName}
                                                            className="w-8 h-8 rounded-full mr-2"
                                                        />
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800">{comment.user.fullName}</h4>
                                                            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No comments yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => openDeleteConfirmation(selectedBlog.id)}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 rounded-md font-medium ${isDeleting
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Blog'}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                            <button
                                onClick={closeDeleteConfirmation}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-700 text-center mb-6">
                                Are you sure you want to delete this blog? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteConfirmation}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBlog}
                                disabled={isDeleting}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    isDeleting
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                } transition-colors`}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}