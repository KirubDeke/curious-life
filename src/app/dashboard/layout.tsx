// app/dashboard/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiUsers, FiFileText, FiLogOut, FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSidebar, setOpenSidebar] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be signed out from your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign me out',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/curious-life/signout`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("Signed out successfully");
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      } catch (error) {
        toast.error("Sign out failed");
        console.error(error);
      }
    } else {
      toast('Sign out cancelled', { icon: '❌' });
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-xl transition-all duration-300 ease-in-out fixed h-full ${openSidebar ? 'w-64' : 'w-20'
          }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-indigo-600">
          <Link
            href="/dashboard"
            className="flex items-center"
          >
            <span className="text-2xl font-bold whitespace-nowrap overflow-hidden" style={{ fontFamily: 'RockSalt' }}>
              {openSidebar ? (
                <>
                  Curious <span className="text-indigo-200">Life</span>
                </>
              ) : (
                <span className="text-indigo-200">CL</span>
              )}
            </span>
          </Link>
          <button
            className="p-1 rounded-md hover:bg-indigo-600 transition-colors md:hidden"
            onClick={() => setOpenSidebar(!openSidebar)}
            aria-label="Toggle sidebar"
          >
            {openSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Toggle Button */}
        <div className="hidden md:flex justify-end p-2">
          <button
            className="p-1 rounded-md hover:bg-indigo-600 transition-colors"
            onClick={() => setOpenSidebar(!openSidebar)}
            aria-label={openSidebar ? "Collapse sidebar" : "Expand sidebar"}
          >
            {openSidebar ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col h-[calc(100%-120px)] p-2">
          <ul className="space-y-1 flex-1">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-indigo-600 font-medium' : 'hover:bg-indigo-600/50'
                  }`}
              >
                <FiHome size={20} className="flex-shrink-0" />
                <span className={`${openSidebar ? 'block' : 'hidden md:block'}`}>
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname.startsWith('/dashboard/users') ? 'bg-indigo-600 font-medium' : 'hover:bg-indigo-600/50'
                  }`}
              >
                <FiUsers size={20} className="flex-shrink-0" />
                <span className={`${openSidebar ? 'block' : 'hidden md:block'}`}>
                  Users
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/blogs"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname.startsWith('/dashboard/blogs') ? 'bg-indigo-600 font-medium' : 'hover:bg-indigo-600/50'
                  }`}
              >
                <FiFileText size={20} className="flex-shrink-0" />
                <span className={`${openSidebar ? 'block' : 'hidden md:block'}`}>
                  Blogs
                </span>
              </Link>
            </li>
          </ul>

          {/* Sign Out Button */}
          <div className="mt-auto p-2 border-t border-indigo-600">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-indigo-600/50 transition-colors"
            >
              <FiLogOut size={20} className="flex-shrink-0" />
              <span className={`${openSidebar ? 'block' : 'hidden md:block'}`}>
                Sign Out
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content - Adjusted to remove gap */}
      <main
        className={`flex-grow transition-all duration-300 ${openSidebar ? 'ml-64' : 'ml-20'
          }`}
      >
        {children}
      </main>
    </div>
  );
}