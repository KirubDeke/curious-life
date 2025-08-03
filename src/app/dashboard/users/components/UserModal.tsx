import React from 'react';
import { X } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface SavedBlog {
    id: number;
    title: string;
    savedAt: string;
}

interface BasicInfo {
    fullName: string;
    email: string;
    photo: string | null;
    bio: string | null;
    role: number;
    canPostBlog: boolean;
}

interface UserActivityData {
    basicInfo: BasicInfo;
    totalBlogs: number;
    totalLikes: number;
    totalComments: number;
    blogs: Blog[];
    totalSavedBlogs: number;
    savedBlogs: SavedBlog[];
}

interface UserActivityResponse {
    status: string;
    message: string;
    data: UserActivityData;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id: number; fullName: string; email: string; canPostBlog: boolean } | null;
    activity: UserActivityResponse | null;
    loading: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, activity, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user?.fullName}&apos;s Activity
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : activity ? (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{activity.data.basicInfo.fullName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{activity.data.basicInfo.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Blog Posting Status</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.data.basicInfo.canPostBlog ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {activity.data.basicInfo.canPostBlog ? 'Allowed' : 'Denied'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium">
                                            {activity.data.basicInfo.role === 0 ? 'Admin' : 'User'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Statistics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                        <p className="text-sm text-gray-500">Total Blogs</p>
                                        <p className="text-2xl font-bold text-blue-600">{activity.data.totalBlogs}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                        <p className="text-sm text-gray-500">Total Likes</p>
                                        <p className="text-2xl font-bold text-green-600">{activity.data.totalLikes}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                        <p className="text-sm text-gray-500">Total Comments</p>
                                        <p className="text-2xl font-bold text-purple-600">{activity.data.totalComments}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                        <p className="text-sm text-gray-500">Saved Blogs</p>
                                        <p className="text-2xl font-bold text-yellow-600">{activity.data.totalSavedBlogs}</p>
                                    </div>
                                </div>
                            </div>

                            {activity.data.blogs.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Blogs ({activity.data.blogs.length})</h3>
                                    <div className="space-y-3">
                                        {activity.data.blogs.slice(0, 5).map((blog) => (
                                            <div key={blog.id} className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                                <h4 className="font-medium text-gray-800">{blog.title}</h4>
                                                <p className="text-sm text-gray-500 truncate">{blog.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Created: {new Date(blog.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activity.data.savedBlogs.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Saved Blogs ({activity.data.savedBlogs.length})</h3>
                                    <div className="space-y-3">
                                        {activity.data.savedBlogs.slice(0, 5).map((savedBlog) => (
                                            <div key={savedBlog.id} className="bg-white p-3 rounded-lg shadow border border-gray-200">
                                                <h4 className="font-medium text-gray-800">{savedBlog.title}</h4>
                                                <p className="text-xs text-gray-400">
                                                    Saved on: {new Date(savedBlog.savedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No activity data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserModal;