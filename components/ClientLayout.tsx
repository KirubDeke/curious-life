// components/ClientLayout.tsx
'use client';

import NavSwitcher from './NavSwitcher';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavSwitcher />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}