'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSignOutAlt, FaBars, FaTimes, FaSun, FaMoon, FaUserShield } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

interface User {
  photo: string | null;
  fullName: string;
  role: number;
}

export default function NavbarPrivate() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curious-life/profile`, { 
          withCredentials: true 
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to load user info", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignout = async () => {
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
          router.push("/");
        }
        window.location.reload();
      } catch (error) {
        toast.error("Sign out failed");
        console.error(error);
      }
    } else {
      toast('Sign out cancelled', { icon: '❌' });
    }
  };

  const renderUserAvatar = () => {
    if (user?.photo) {
      return (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${user.photo}`}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
      );
    } else if (user?.fullName) {
      const firstName = user.fullName.split(' ')[0];
      return (
        <span className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-full">
          {firstName}
        </span>
      );
    } else {
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold text-lg">
          ?
        </div>
      );
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-lg bg-opacity-80 backdrop-blur-md" : ""} bg-background text-foreground rounded-b-lg`}>
        <nav className="py-4 px-6 md:px-12 max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "RockSalt" }}>
              Curious <span className="text-blue-500">Life.</span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
              <Link href="/" className="hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition duration-150">Home</Link>
              <Link href="/bloglist" className="hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition duration-150">Blogs</Link>
              <Link href="/saved" className="hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition duration-150">Saved</Link>
              <Link href="/contact" className="hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition duration-150">Contact</Link>
              
              {/* Admin Dashboard Link - Only shown for admins (role === 0) */}
              {user?.role === 0 && (
                <Link 
                  href="/dashboard" 
                  className="hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition duration-150 flex items-center"
                >
                  <FaUserShield className="mr-1" /> Admin
                </Link>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transform transition"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.3 }}>
                    <FaMoon className="text-indigo-300 w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }}>
                    <FaSun className="text-yellow-500 w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {renderUserAvatar()}
                <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50"
                >
                  <div className="py-2">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>

                    {/* Admin Dashboard Link in Dropdown */}
                    {user?.role === 0 && (
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FaUserShield className="mr-2" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleSignout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'} px-6 pb-4`}>
          <ul className="flex flex-col space-y-3 text-lg font-medium">
            <li><Link href="/" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link></li>
            <li><Link href="/bloglist" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Blogs</Link></li>
            <li><Link href="/saved" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Saved</Link></li>
            <li><Link href="/contact" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Contact</Link></li>
            
            {/* Admin Dashboard Link in Mobile Menu */}
            {user?.role === 0 && (
              <li>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FaUserShield className="mr-2" /> Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="pt-24 md:pt-28"></div>
    </>
  );
}