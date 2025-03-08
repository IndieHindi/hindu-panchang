import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Daily Panchang', href: '/daily' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Rashifal', href: '/rashifal' },
  { name: 'Festivals', href: '/festivals' },
  { name: 'Learn', href: '/learn' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Hindu Panchang
          </Link>
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav className="lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Hindu Panchang
          </Link>
          <button
            type="button"
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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