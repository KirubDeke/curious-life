"use client";

import { useAuth } from "../../context/AuthContext";
import Public from "../../components/public";
import Private from "../../components/private";
import ClientLayout from "../../components/ClientLayout";
import AdminLayout from "../../components/AdminLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === 0) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <Public />
      </ClientLayout>
    );
  }

  if (user?.role === 0) {
    return (
      <AdminLayout>
        <Private />
      </AdminLayout>
    );
  }

  return (
    <ClientLayout>
      <Private />
    </ClientLayout>
  );
}