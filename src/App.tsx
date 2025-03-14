import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DailyPanchang from './pages/DailyPanchang';
import MonthlyCalendar from './components/Calendar/MonthlyCalendar';
import Rashifal from './pages/Rashifal';
import Layout from './components/Layout';
import Learn from './pages/Learn';
import type { Location, Festival } from './types/panchang';

/**
 * Interface for location configuration
 */
interface Location {
  latitude: number;
  longitude: number;
  timezone: string;
  name: string;
}

/**
 * Interface for festival data
 */
interface Festival {
  name: string;
  date: string;
  description?: string;
  significance?: string;
}

// Default location (New Delhi)
const defaultLocation: Location = {
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

/**
 * QueryClient configuration with optimized caching and retry settings
 * - Stale time: 5 minutes
 * - Cache time: 30 minutes
 * - Retry attempts: 2
 * - Window focus refetch: disabled
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Handles festival notifications using the Web Notifications API
 * Requests permission if not already granted
 * @param festival - Festival information to display in the notification
 */
const handleFestivalNotification = (festival: Festival): void => {
  const notificationBody = `${festival.description || festival.significance}\nDate: ${festival.date.toLocaleDateString()}`;
  
  if (Notification.permission === 'granted') {
    new Notification(`Festival Notification: ${festival.name}`, {
      body: notificationBody,
      icon: '/om.svg'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(`Festival Notification: ${festival.name}`, {
          body: notificationBody,
          icon: '/om.svg'
        });
      }
    });
  }
};

/**
 * Main application component that sets up routing and global providers
 * Uses React Router for navigation and React Query for data fetching
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/hindu-panchang">
        <Layout>
          <Routes>
            <Route path="/" element={<DailyPanchang />} />
            <Route path="/daily" element={<DailyPanchang />} />
            <Route 
              path="/calendar" 
              element={
                <MonthlyCalendar 
                  location={defaultLocation} 
                  onFestivalNotificationToggle={handleFestivalNotification}
                />
              } 
            />
            <Route path="/rashifal" element={<Rashifal />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 