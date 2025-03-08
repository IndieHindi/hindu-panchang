import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import DailyPanchang from './pages/DailyPanchang';
import MonthlyCalendar from './components/Calendar/MonthlyCalendar';
import Rashifal from './pages/Rashifal';
import FestivalCalendar from './components/Festivals/FestivalCalendar';
import InteractiveLearning from './components/Learn/InteractiveLearning';
import Visualization from './pages/Visualization';
import Layout from './components/Layout';
import Learn from './pages/Learn';

// Default location (New Delhi)
const defaultLocation = {
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});

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
              element={<MonthlyCalendar location={defaultLocation} />} 
            />
            <Route path="/rashifal" element={<Rashifal />} />
            <Route 
              path="/festivals" 
              element={<FestivalCalendar onNotificationToggle={festival => {
                if (Notification.permission === 'granted') {
                  new Notification(`Festival Notification: ${festival.name}`, {
                    body: `${festival.description}\nDate: ${festival.date.toLocaleDateString()}`,
                    icon: '/om.svg'
                  });
                } else if (Notification.permission !== 'denied') {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification(`Festival Notification: ${festival.name}`, {
                        body: `${festival.description}\nDate: ${festival.date.toLocaleDateString()}`,
                        icon: '/om.svg'
                      });
                    }
                  });
                }
              }} />} 
            />
            <Route path="/learn" element={<Learn />} />
            <Route path="/visualization" element={<Visualization />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 