'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { FaUser, FaEnvelope, FaSpinner, FaSave, FaCamera, FaEdit, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UserData {
  fullName: string;
  email: string;
  photo: string | null;
  bio: string | null; 
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingBio, setEditingBio] = useState(false); 
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/profile`, {
          withCredentials: true
        });

        if (response.data.status === 'success') {
          setUser({
            fullName: response.data.user.fullName,
            email: response.data.user.email,
            photo: response.data.user.photo,
            bio: response.data.user.bio || null 
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle profile input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle password input changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('email', user.email);
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('photo', fileInputRef.current.files[0]);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/editProfile`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        setUser(response.data.user);
        toast.success("Profile updated successfully");
        setEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Save bio changes
  const handleBioSave = async () => {
    if (!user || !user.bio) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/updateBio`,
        { bio: user.bio },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        toast.success("Bio updated successfully");
        setEditingBio(false);
      } else {
        throw new Error(response.data.message || 'Failed to update bio');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bio');
      toast.error("Failed to update bio");
    } finally {
      setSubmitting(false);
    }
  };

  // Save password changes
  const handlePasswordSave = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/changePassword`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        toast.success("Password changed successfully");
        setEditingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error && !editing && !editingPassword && !editingBio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 text-green-800 p-4 text-center">
            {success}
          </div>
        )}
        {error && (editing || editingPassword || editingBio) && (
          <div className="bg-red-100 text-red-800 p-4 text-center">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-10 text-center text-white">
          <div className="relative inline-block">
            <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white mx-auto shadow-lg">
              {user.photo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${user.photo}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => setUser({ ...user, photo: null })}
                />
              ) : (
                <div className="h-full w-full bg-blue-400 flex items-center justify-center">
                  <FaUser className="h-20 w-20 text-white" />
                </div>
              )}
            </div>
            {editing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-3 hover:bg-gray-100 transition-colors shadow-md"
                disabled={submitting}
              >
                <FaCamera className="text-lg" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={submitting}
                />
              </button>
            )}
          </div>
          <h1 className="mt-6 text-3xl font-bold">
            {editing ? (
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="bg-transparent border-b border-white focus:outline-none focus:border-white text-center w-full max-w-md placeholder-white/80"
                placeholder="Full Name"
                disabled={submitting}
              />
            ) : (
              user.fullName
            )}
          </h1>
        </div>

        {/* Profile Content */}
        <div className="px-8 py-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Personal Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-blue-600 text-lg" />
                </div>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-gray-700"
                    placeholder="Email Address"
                    disabled={submitting}
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Bio</p>
                    {editingBio ? (
                      <div className="mt-2 w-full">
                        <textarea
                          ref={bioInputRef}
                          name="bio"
                          value={user.bio || ''}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                          rows={4}
                          disabled={submitting}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setEditingBio(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBioSave}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaSave className="mr-2" />
                            )}
                            Save Bio
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700 mt-1">
                          {user.bio || 'No bio provided'}
                        </p>
                        {!editing && (
                          <button
                            onClick={() => setEditingBio(true)}
                            className="text-blue-600 hover:text-blue-800 ml-4 flex items-center text-sm"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              {editingPassword ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaLock className="text-blue-600 text-lg" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-gray-700 pr-8"
                        placeholder="Current Password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center ml-12">
                    <div className="relative flex-1">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-gray-700 pr-8"
                        placeholder="New Password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center ml-12">
                    <div className="relative flex-1">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-gray-700 pr-8"
                        placeholder="Confirm New Password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaLock className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Password</p>
                    <p className="text-gray-700">••••••••</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {editingPassword ? (
              <>
                <button
                  onClick={() => setEditingPassword(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSave}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Save Password
                </button>
              </>
            ) : editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Save Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingPassword(true)}
                  className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FaLock className="mr-2" />
                  Change Password
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}