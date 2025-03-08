import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import DailyPanchang from './pages/DailyPanchang';
import MonthlyCalendar from './components/Calendar/MonthlyCalendar';
import Rashifal from './pages/Rashifal';
import FestivalCalendar from './components/Festivals/FestivalCalendar';
import InteractiveLearning from './components/Learn/InteractiveLearning';

// Default location (New Delhi)
const defaultLocation = {
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow">
            <nav className="container mx-auto px-4 py-4">
              <Navigation />
            </nav>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<DailyPanchang />} />
              <Route 
                path="/calendar" 
                element={<MonthlyCalendar location={defaultLocation} />} 
              />
              <Route path="/rashifal" element={<Rashifal />} />
              <Route 
                path="/festivals" 
                element={<FestivalCalendar onNotificationToggle={festival => {
                  // TODO: Implement notification handling
                  console.log('Toggle notification for:', festival.name);
                }} />} 
              />
              <Route path="/learn" element={<InteractiveLearning />} />
            </Routes>
          </main>

          <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
            <div className="container mx-auto px-4 py-8">
              <p className="text-center text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Hindu Panchang Calendar
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 