import "./globals.css";
import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../context/AuthContext";
import { SavedBlogsProvider } from "../../context/SavedBlogsContext"; 

export const metadata: Metadata = {
  title: "Curious Life",
  description: "Blog App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var stored = localStorage.getItem('theme');
                var prefers = window.matchMedia('(prefers-color-scheme:dark)').matches;
                var initial = stored ? stored === 'dark' : prefers;
                if (initial) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="antialiased">
          <AuthProvider>
            <SavedBlogsProvider> 
              <Toaster position="top-center" reverseOrder={false} />
              {children}
            </SavedBlogsProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
