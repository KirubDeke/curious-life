"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiEdit2, FiType, FiAlignLeft } from 'react-icons/fi';

export default function CreateBlogForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    otherCategory: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const categories = [
    'Technology',
    'Travel',
    'Food',
    'Lifestyle',
    'Health',
    'Finance',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setPreviewImage('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      handleImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      handleImageChange(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const removeImage = () => {
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalCategory = formData.category === "Other" ? formData.otherCategory : formData.category;
      const form = new FormData(formRef.current || undefined);

      form.set("title", formData.title);
      form.set("body", formData.body);
      form.set("category", finalCategory);

      if (fileInputRef.current?.files?.[0]) {
        form.set("image", fileInputRef.current.files[0]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/blogs/createBlog`,
        form,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast.success("Blog published successfully!");

        // Reset form fields
        setFormData({
          title: "",
          body: "",
          category: "",
          otherCategory: "",
        });
        setPreviewImage("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (formRef.current) {
          formRef.current.reset();
        }
      }


    } catch (error: unknown) {
      toast.error("Failed to publish blog");

      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[80%] mx-auto p-6">
      <div className="bg-background text-foreground rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-500 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
          <p className="opacity-90">Share your thoughts with the world</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-8" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FiType className="text-blue-500" size={20} />
                <label htmlFor="title" className="block text-sm font-medium">
                  Blog Title
                </label>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your blog title"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FiEdit2 className="text-blue-500" size={18} />
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {formData.category === 'Other' && (
                <div className="mt-2 space-y-2">
                  <label htmlFor="otherCategory" className="text-sm text-gray-700 dark:text-gray-300">
                    Specify Category
                  </label>
                  <input
                    type="text"
                    id="otherCategory"
                    name="otherCategory"
                    value={formData.otherCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Custom category"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-2">
                <FiUpload className="text-blue-500" size={18} />
                <label className="text-sm">Featured Image</label>
              </div>

              {previewImage ? (
                <div className="relative group">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    aria-label="Remove image"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <FiUpload size={28} className="text-blue-500 dark:text-blue-400" />
                    <p className="font-medium">
                      {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-sm">
                      JPG, PNG, JPEG (max 5MB)
                    </p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Select Image
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-2">
                <FiAlignLeft className="text-blue-500" size={20} />
                <label htmlFor="body" className="block text-sm font-medium">
                  Blog Content
                </label>
              </div>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Write your story..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-60"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}