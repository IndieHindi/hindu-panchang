import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#2a2a2a] pixel-border">
        <nav className="container mx-auto px-4 py-4">
          <Navigation />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="animate-float">
          {children}
        </div>
      </main>

      <footer className="bg-[#2a2a2a] pixel-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-[#e0e0e0] pixel-text">
            © {new Date().getFullYear()} Hindu Panchang Calendar
          </p>
        </div>
      </footer>
    </div>
  );
} 