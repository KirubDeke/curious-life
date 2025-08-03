'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Reports from './reports/page';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, []);

  return <Reports />;
}