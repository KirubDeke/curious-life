"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BlogDetailLayout from "../../../../components/BlogDetailLayout";
import { useSavedBlogs } from "../../../../context/SavedBlogsContext";

interface Comment {
  id: number;
  content: string;
  userId: number;
  blogId: number;
  createdAt: string;
  user: {
    fullName: string;
    photo: string | null;
    id: number;
  };
  isOwner: boolean;
}

interface Blog {
  id: number;
  title: string;
  body: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const blogId = Number(id);
  const { isSaved, toggleSaved } = useSavedBlogs();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [popularArticles, setPopularArticles] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/me`,
          { withCredentials: true }
        );
        setIsAuthenticated(res.data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!blogId) return;

    const fetchData = async () => {
      try {
        const blogRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/${blogId}`,
          { withCredentials: true }
        );
        setBlog(blogRes.data.data);

        const likeRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/like-status/${blogId}`,
          { withCredentials: true }
        );
        setLikes(likeRes.data.likeCount);
        setHasLiked(likeRes.data.liked);

        const meRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/me`,
          { withCredentials: true }
        );
        const currentUserId = meRes.data.user?.id;

        const commentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/${blogId}/comments`,
          { withCredentials: true }
        );

        const formattedComments = commentsRes.data.comments.map((comment: any) => ({
          ...comment,
          id: comment.id,
          userId: comment.userId,
          blogId: comment.blogId,
          user: {
            fullName: comment.user?.fullName || "User",
            photo: comment.user?.photo || null,
            id: comment.user?.id
          },
          isOwner: comment.userId === currentUserId
        }));

        setComments(formattedComments);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/recent`
        );
        setPopularArticles(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch popular articles", err);
      }
    };

    fetchPopularArticles();
  }, []);

  const handleAuthRequired = (action: string) => {
    toast.error(`Please sign up to ${action}`);
    router.push('/signin');
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      handleAuthRequired("like this blog");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/like/${blogId}`,
        {},
        { withCredentials: true }
      );
      setHasLiked(res.data.liked);
      setLikes(res.data.likeCount);
      toast.success(res.data.liked ? "Successfully Liked" : "Like removed");
    } catch {
      toast.error("Failed to Like");
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      handleAuthRequired("save this blog");
      return;
    }

    try {
      await toggleSaved(blogId);
      toast.success(isSaved(blogId) ? "Removed from saved" : "Blog saved");
    } catch {
      toast.error("Failed to update save status");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isAuthenticated) {
      handleAuthRequired("post a comment");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/comment/${blogId}`,
        { content },
        { withCredentials: true }
      );
      const newComment = {
        ...res.data,
        id: res.data.id,
        userId: res.data.userId,
        user: {
          fullName: "You",
          photo: null,
          id: res.data.userId
        },
        isOwner: true,
        createdAt: new Date().toISOString(),
      };

      setComments(prev => [newComment, ...prev]);
      setContent("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment", error);
      toast.error("Failed to post comment");
    }
  };

  const startEditing = (comment: Comment) => {
    if (!isAuthenticated) {
      handleAuthRequired("edit comments");
      return;
    }
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditSubmit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/editComment/${commentId}`,
        { content: editContent },
        { withCredentials: true }
      );

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editContent }
            : comment
        )
      );
      toast.success("Comment Edited Successfully");
      setEditingCommentId(null);
      setEditContent("");
    } catch {
      toast.error("Failed to Edit");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This comment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/deleteComment/${commentId}`,
        { withCredentials: true }
      );

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success("Comment Deleted Successfully");
    } catch {
      toast.error("Failed to Delete");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500 font-medium">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8 mt-15">
        <div className="lg:w-3/4 relative">
          <BlogDetailLayout
            title={blog.title}
            publishedDate={new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            imageUrl={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
            content={blog.body.split(/\r?\n\r?\n/)}
          />
          <button
            onClick={handleToggleSave}
            title={isSaved(blogId) ? "Remove from saved" : "Save this blog"}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-md text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isSaved(blogId) ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                <path d="M6 4a2 2 0 00-2 2v16l8-5.333L20 22V6a2 2 0 00-2-2H6z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="lg:w-1/4 space-y-8 mt-20">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Popular Articles
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {popularArticles.map((article) => (
                <a key={article.id} href={`/blogs/${article.id}`} className="block p-5 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(article.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Explore Topics
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                <a href={`/categories/${blog.category}`} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                  {blog.category}
                </a>
                <a href="/categories/technology" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                  Technology
                </a>
                <a href="/categories/lifestyle" className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                  Lifestyle
                </a>
                <a href="/categories/productivity" className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors">
                  Productivity
                </a>
                <a href="/categories/health" className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium hover:bg-pink-100 transition-colors">
                  Health
                </a>
                <a href="/categories/business" className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors">
                  Business
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 mt-12">
        <div className="mb-8 flex items-center">
          <button
            onClick={handleLike}
            className={`relative overflow-hidden px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 ${hasLiked ? "bg-blue-100 text-blue-600 shadow-inner" : "bg-blue-50 hover:bg-blue-100 text-blue-500 shadow-sm"
              } group`}
          >
            <span className="relative z-10">
              {hasLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </span>
            <span className="font-medium relative z-10">
              {likes} {likes === 1 ? "Like" : "Likes"}
            </span>
            {!hasLiked && (
              <span className="absolute inset-0 bg-blue-200 opacity-0 group-hover:opacity-30 rounded-full transition-opacity duration-300"></span>
            )}
          </button>
        </div>

        <div className="bg-background text-foreground p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              placeholder="Write your comment..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-6">
            {comments.map(comment => (
              <div
                key={comment.id}
                className="border border-gray-200 p-4 rounded-md hover:shadow-md transition-shadow duration-200 relative group"
              >
                {/* Edit/Delete Icons - Only shown on hover for owner */}
                {comment.isOwner && editingCommentId !== comment.id && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => startEditing(comment)}
                      className="p-1.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit comment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete comment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${comment.user.photo}`}
                    alt={comment.user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{comment.user.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="whitespace-pre-line">{comment.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}