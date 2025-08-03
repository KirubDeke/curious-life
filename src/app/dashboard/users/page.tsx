"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserModal from '../users/components/UserModal';
import Pagination from '../users/components/Pagination';
import { toast } from 'react-hot-toast';

interface User {
    id: number;
    fullName: string;
    email: string;
    canPostBlog: boolean;
}

interface UserActivityData {
    basicInfo: {
        fullName: string;
        email: string;
        photo: string | null;
        bio: string | null;
        role: number;
        canPostBlog: boolean;
    };
    totalBlogs: number;
    totalLikes: number;
    totalComments: number;
    blogs: Array<{
        id: number;
        title: string;
        content: string;
        createdAt: string;
    }>;
    totalSavedBlogs: number;
    savedBlogs: Array<{
        id: number;
        title: string;
        savedAt: string;
    }>;
}

interface UserActivityResponse {
    status: string;
    message: string;
    data: UserActivityData;
}

interface UsersApiResponse {
    status: string;
    message: string;
    data: User[];
    totalCount: number;
}

const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm,
    userName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fade-in">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
                    <p className="text-gray-600 text-center mb-6">
                        Are you sure you want to delete user <span className="font-semibold">{userName}</span>? 
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-4 w-full">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-1/2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-1/2"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsersDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [userActivity, setUserActivity] = useState<UserActivityResponse | null>(null);
    const [activityLoading, setActivityLoading] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<{id: number, name: string} | null>(null);

    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get<UsersApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/users`, {
                    withCredentials: true
                });
                setUsers(response.data.data);
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewActivity = async (userId: number) => {
        try {
            setActivityLoading(true);
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/authorActivity/user/${userId}`;
            
            const response = await axios.get<UserActivityResponse>(apiUrl, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setUserActivity(response.data);
            setSelectedUser(users.find(user => user.id === userId) || null);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user activity:', error);
            let errorMessage = 'Failed to fetch user activity';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setActivityLoading(false);
        }
    };

    const handleToggleBlogPermission = async (userId: number, currentStatus: boolean) => {
        try {
            const endpoint = currentStatus
                ? `${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/denyBlog/user/${userId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/allowBlog/user/${userId}`;

            await axios.put(endpoint, {}, {
                withCredentials: true
            });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, canPostBlog: !currentStatus } : user
            ));

            toast.success(`User ${currentStatus ? 'denied' : 'allowed'} blog posting successfully`);
        } catch (error) {
            console.error('Error toggling blog permission:', error);
            toast.error('Failed to update blog permission');
        }
    };

    const handleRemoveClick = (userId: number, userName: string) => {
        setUserToDelete({ id: userId, name: userName });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/removeUser/user/${userToDelete.id}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user.id !== userToDelete.id));
            toast.success('User removed successfully');
        } catch (error) {
            console.error('Error removing user:', error);
            toast.error('Failed to remove user');
        } finally {
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management Dashboard</h1>
                <div className="rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
                            <span className="font-semibold">Total Users:</span> {users.length}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Full Name</th>
                                        <th className="py-3 px-4 text-left">Email</th>
                                        <th className="py-3 px-4 text-left">Blog Posting</th>
                                        <th className="py-3 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4">{user.id}</td>
                                                <td className="py-4 px-4 font-medium">{user.fullName}</td>
                                                <td className="py-4 px-4">{user.email}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.canPostBlog ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.canPostBlog ? 'Allowed' : 'Denied'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 space-x-2">
                                                    <button
                                                        onClick={() => handleViewActivity(user.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        View Activity
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlogPermission(user.id, user.canPostBlog)}
                                                        className={`${user.canPostBlog ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded text-sm`}
                                                    >
                                                        {user.canPostBlog ? 'Deny Posting' : 'Allow Posting'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveClick(user.id, user.fullName)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {filteredUsers.length > itemsPerPage && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                activity={userActivity}
                loading={activityLoading}
            />
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                userName={userToDelete?.name || ''}
            />
        </div>
    );
};

export default UsersDashboard;