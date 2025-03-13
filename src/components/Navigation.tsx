import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Daily Panchang', href: '/daily' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Rashifal', href: '/rashifal' },
  { name: 'Festivals', href: '/festivals' },
  { name: 'Learn', href: '/learn' },
  { name: 'Visualization', href: '/visualization' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-[#ff6b6b] pixel-text animate-pulse-slow">
            Hindu Panchang
          </Link>
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium pixel-border pixel-border-hover
                  ${
                    location.pathname === item.href
                      ? 'bg-[#ff6b6b] text-white'
                      : 'text-[#e0e0e0] hover:bg-[#3a3a3a]'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav className="lg:hidden" aria-label="mobile navigation">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#ff6b6b] pixel-text animate-pulse-slow">
            Hindu Panchang
          </Link>
          <button
            type="button"
            className="p-2 pixel-border pixel-border-hover text-[#e0e0e0] hover:bg-[#3a3a3a]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium pixel-border pixel-border-hover
                  ${
                    location.pathname === item.href
                      ? 'bg-[#ff6b6b] text-white'
                      : 'text-[#e0e0e0] hover:bg-[#3a3a3a]'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
} 