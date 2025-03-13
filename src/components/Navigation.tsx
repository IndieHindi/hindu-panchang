import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Navigation items configuration
 * Each item has a name and href (route path)
 */
const navigation = [
  { name: 'Daily Panchang', href: '/daily' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Rashifal', href: '/rashifal' },
  { name: 'Festivals', href: '/festivals' },
  { name: 'Learn', href: '/learn' },
  { name: 'Visualization', href: '/visualization' },
];

/**
 * Navigation Component
 * 
 * Renders a responsive navigation bar with desktop and mobile views.
 * The mobile view includes a toggle menu for smaller screens.
 * 
 * Features:
 * - Responsive design (desktop/mobile)
 * - Active link highlighting
 * - Accessible navigation with proper ARIA labels
 * 
 * @returns {JSX.Element} The navigation component
 */
export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop navigation - only visible on large screens */}
      <nav className="hidden lg:flex items-center justify-between" aria-label="Desktop Navigation">
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

      {/* Mobile navigation - only visible on small/medium screens */}
      <nav className="lg:hidden" aria-label="Mobile Navigation">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#ff6b6b] pixel-text animate-pulse-slow">
            Hindu Panchang
          </Link>
          <button
            type="button"
            className="p-2 pixel-border pixel-border-hover text-[#e0e0e0] hover:bg-[#3a3a3a]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu panel - conditionally rendered based on mobileMenuOpen state */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-1" id="mobile-menu">
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