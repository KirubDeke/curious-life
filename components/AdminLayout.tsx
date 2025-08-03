'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 0) {
        router.push('/');
      } else if (!pathname.startsWith('/dashboard')) {
        router.push('/dashboard');
      }
      setIsCheckingAuth(false);
    }
  }, [user, loading, isAuthenticated, pathname]);

  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
}