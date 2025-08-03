'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface SavedBlogsContextType {
  savedBlogIds: number[];
  toggleSaved: (blogId: number) => Promise<void>;
  isSaved: (blogId: number) => boolean;
}

const SavedBlogsContext = createContext<SavedBlogsContextType | undefined>(undefined);

export const SavedBlogsProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedBlogIds, setSavedBlogIds] = useState<number[]>([]);

  const fetchSavedBlogs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/getSavedBlogs`,
        { withCredentials: true }
      );
      console.log("Saved blogs response:", res.data);

      const saved = Array.isArray(res.data.data) ? res.data.data : [];
      const ids = saved.map((b: any) => b.id).filter(Boolean);
      setSavedBlogIds(ids);
    } catch (error) {
      console.error('Failed to fetch saved blogs', error);
    }
  };

  const toggleSaved = async (blogId: number) => {
    try {
      const wasSaved = savedBlogIds.includes(blogId);
      if (wasSaved) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/unsave/${blogId}`,
          { withCredentials: true }
        );
        setSavedBlogIds(prev => prev.filter(id => id !== blogId));
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/save/${blogId}`,
          {},
          { withCredentials: true }
        );
        setSavedBlogIds(prev => [...prev, blogId]);
      }
    } catch (error) {
      console.error('Failed to toggle saved', error);
    }
  };

  const isSaved = (blogId: number) => savedBlogIds.includes(blogId);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  return (
    <SavedBlogsContext.Provider value={{ savedBlogIds, toggleSaved, isSaved }}>
      {children}
    </SavedBlogsContext.Provider>
  );
};

export const useSavedBlogs = () => {
  const context = useContext(SavedBlogsContext);
  if (!context) throw new Error('useSavedBlogs must be inside SavedBlogsProvider');
  return context;
};
