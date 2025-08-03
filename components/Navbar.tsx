"use client";

import Link from "next/link";
import CustomButton from "./CustomButton";
import CustomButtonTwo from "./CustomButtonTwo";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-20 ${isScrolled ? 'bg-background shadow-md' : 'bg-background'} text-foreground transition-all duration-300`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link href="/" className="flex items-center">
            <span
              className="self-center text-lg sm:text-xl md:text-2xl font-semibold whitespace-nowrap"
              style={{ fontFamily: "RockSalt" }}
            >
              Curious <span className="text-blue-600">Life.</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="hidden md:flex items-center space-x-4">
            <CustomButton text={"Log In"} onClick={() => window.location.href = "/signin"} />
            <CustomButtonTwo text={"Sign Up"} onClick={() => window.location.href = "/signup"} />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-lg hover:text-blue-500 transition-colors duration-200">Home</Link>
          <Link href="/" className="text-lg hover:text-blue-500 transition-colors duration-200">Blogs</Link>
          <Link href="/contact" className="text-lg hover:text-blue-500 transition-colors duration-200">Contact</Link>
        </div>

        {/* Mobile auth buttons (shown only on mobile) */}
        {isMenuOpen && (
          <div className="w-full md:hidden flex justify-center space-x-4 mt-4 pb-4">
            <CustomButton text={"Log In"} onClick={() => window.location.href = "/signin"} />
            <CustomButtonTwo text={"Sign Up"} onClick={() => window.location.href = "/signup"} />
          </div>
        )}
      </div>
    </nav>
  );
}