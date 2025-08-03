'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSavedBlogs } from '../context/SavedBlogsContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface CustomCardProps {
  image: string | null;
  category: string;
  title: string;
  description: string;
  authorImage: string | null;
  authorName: string;
  authorId: number;
  date: string;
  readTime: string;
  blogId: number;
}

export default function CustomCard({
  image, category, title, description, authorImage,
  authorName, authorId, date, readTime, blogId
}: CustomCardProps) {
  const { isSaved, toggleSaved } = useSavedBlogs();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleToggle = async () => {
    if (loading) return;

    if (!isAuthenticated) {
      toast.error('Please log in to save blogs');
      router.push('/signin');
      return;
    }

    try {
      const wasSaved = isSaved(blogId);
      await toggleSaved(blogId);
      toast.success(wasSaved ? 'Blog unsaved' : 'Blog saved');
    } catch {
      toast.error('Failed to toggle saved state');
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-background relative">
      <button
        onClick={handleToggle}
        className="absolute top-3 right-3 text-blue-500 hover:text-blue-600"
        title={isSaved(blogId) ? 'Unsave' : 'Save'}
      >
        {isSaved(blogId) ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
      </button>

      {image && (
        <div className="flex-shrink-0">
          <img className="h-58 w-full object-cover" src={image} alt="Blog Image" />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-500">
            <a href="#" className="hover:underline">{category}</a>
          </p>
          <a href={`/blogs/${blogId}`} className="mt-2 block">
            <p className="text-xl font-semibold text-foreground">{title}</p>
            <p className="mt-3 text-base text-foreground">{description}</p>
          </a>
        </div>

        <div className="mt-6 flex items-center">
          {authorImage && (
            <div className="flex-shrink-0">
              <Link href={`/author/${authorId}`}>
                <img className="h-10 w-10 rounded-full" src={authorImage} alt="Author" />
              </Link>
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              <Link href={`/author/${authorId}`} className="hover:underline">{authorName}</Link>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time>{date}</time>
              <span aria-hidden="true">·</span>
              <span>{readTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link href={`/blogs/${blogId}`} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Read Blog →
          </Link>
        </div>
      </div>
    </div>
  );
}
