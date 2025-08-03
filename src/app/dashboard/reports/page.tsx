// pages/dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface StatsData {
  users: number;
  blogs: number;
  likes: number;
  comments: number;
  saved: number;
}

interface ApiResponse {
  data: StatsData;
  message?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
}

const Reports = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/admin/reports`, 
          { withCredentials: true }
        );
        setStats(response.data.data);
      } catch (err) {
        const error = err as AxiosError<ApiResponse>;
        setError(error.response?.data?.message || error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 text-white">
            <StatCard 
              title="Total Users" 
              value={stats.users} 
              gradientFrom="from-purple-500" 
              gradientTo="to-indigo-600" 
              icon={<UserIcon />} 
            />
            <StatCard 
              title="Blog Posts" 
              value={stats.blogs} 
              gradientFrom="from-blue-500" 
              gradientTo="to-cyan-400" 
              icon={<BlogIcon />} 
            />
            <StatCard 
              title="Likes" 
              value={stats.likes} 
              gradientFrom="from-pink-500" 
              gradientTo="to-rose-500" 
              icon={<LikeIcon />} 
            />
            <StatCard 
              title="Comments" 
              value={stats.comments} 
              gradientFrom="from-green-500" 
              gradientTo="to-emerald-400" 
              icon={<CommentIcon />} 
            />
            <StatCard 
              title="Saved Items" 
              value={stats.saved} 
              gradientFrom="from-yellow-500" 
              gradientTo="to-amber-500" 
              icon={<BookmarkIcon />} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, gradientFrom, gradientTo, icon }) => (
  <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-lg overflow-hidden text-white min-h-[160px]`}>
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full">
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error: </strong> {error}
    </div>
  </div>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BlogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const LikeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

export default Reports;