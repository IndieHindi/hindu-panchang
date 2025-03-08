import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <nav className="container mx-auto px-4 py-4">
          <Navigation />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Hindu Panchang Calendar
          </p>
        </div>
      </footer>
    </div>
  );
} 