import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import PanchangService from '../services/PanchangService';
import { DailyPanchang as DailyPanchangType, Location } from '../types/panchang';

const locations: Location[] = [
  {
    name: 'New Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Custom Location',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
  },
];

// Helper function to format dates safely
const formatDate = (date: Date | null | undefined, formatStr: string): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      return 'N/A';
    }
    return format(date, formatStr);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'N/A';
  }
};

export default function DailyPanchang() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState(locations[0]);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLatitude, setCustomLatitude] = useState('');
  const [customLongitude, setCustomLongitude] = useState('');
  const [notifications, setNotifications] = useState<Set<string>>(new Set());

  const { data: panchang, isLoading, error, isError } = useQuery<DailyPanchangType>({
    queryKey: ['panchang', selectedDate.toISOString(), location],
    queryFn: async () => {
      try {
        return await PanchangService.getInstance().calculateDailyPanchang(selectedDate, location);
      } catch (error) {
        console.error('Error fetching panchang data:', error);
        throw error;
      }
    },
    enabled: !!selectedDate && !!location,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newDate = e.target.value ? parseISO(e.target.value) : new Date();
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = locations.find(loc => loc.name === e.target.value);
    if (selectedLocation) {
      setLocation(selectedLocation);
      setShowCustomLocation(selectedLocation.name === 'Custom Location');
    }
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLatitude);
    const lng = parseFloat(customLongitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({
        name: 'Custom Location',
        latitude: lat,
        longitude: lng,
        timezone: 'UTC',
      });
    }
  };

  const toggleNotification = (id: string) => {
    const newNotifications = new Set(notifications);
    if (newNotifications.has(id)) {
      newNotifications.delete(id);
    } else {
      newNotifications.add(id);
      // Show notification permission request
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
    setNotifications(newNotifications);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="rounded-full h-12 w-12 border-b-2 border-primary-600" />
        <span className="ml-3 text-gray-600 dark:text-gray-400" role="status">
          Loading Panchang data...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-900/20"
      >
        <p className="font-medium">Error loading Panchang data</p>
        <p className="mt-1 text-sm">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <CalendarIcon className="h-8 w-8 text-primary-600" />
          Daily Panchang
        </motion.h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="relative w-full sm:w-auto">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="date"
                type="date"
                value={formatDate(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="pl-10 w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={location.name}
                onChange={handleLocationChange}
                className="pl-10 w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {locations.map(loc => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {showCustomLocation && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCustomLocationSubmit}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={customLatitude}
                onChange={(e) => setCustomLatitude(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={customLongitude}
                onChange={(e) => setCustomLongitude(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter longitude"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Set Custom Location
          </button>
        </motion.form>
      )}

      {panchang && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Astronomical Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SunIcon className="h-5 w-5 text-primary-600" />
              Astronomical Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <SunIcon className="h-4 w-4" />
                  Sunrise
                </span>
                <span>{formatDate(panchang.astronomicalInfo.sunrise, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <SunIcon className="h-4 w-4" />
                  Sunset
                </span>
                <span>{formatDate(panchang.astronomicalInfo.sunset, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MoonIcon className="h-4 w-4" />
                  Moonrise
                </span>
                <span>{formatDate(panchang.astronomicalInfo.moonrise, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MoonIcon className="h-4 w-4" />
                  Moonset
                </span>
                <span>{formatDate(panchang.astronomicalInfo.moonset, 'hh:mm a')}</span>
              </div>
            </div>
          </motion.div>

          {/* Tithi Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MoonIcon className="h-5 w-5 text-primary-600" />
                Tithi
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleNotification('tithi')}
                className={`p-2 rounded-full ${
                  notifications.has('tithi')
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-primary-600'
                }`}
              >
                <BellIcon className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name</span>
                <span>{panchang.tithi.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Number</span>
                <span>{panchang.tithi.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Starts</span>
                <span>{formatDate(panchang.tithi.startTime, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ends</span>
                <span>{formatDate(panchang.tithi.endTime, 'hh:mm a')}</span>
              </div>
            </div>
          </motion.div>

          {/* Nakshatra Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-primary-600" />
                Nakshatra
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleNotification('nakshatra')}
                className={`p-2 rounded-full ${
                  notifications.has('nakshatra')
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-primary-600'
                }`}
              >
                <BellIcon className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name</span>
                <span>{panchang.nakshatra.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Deity</span>
                <span>{panchang.nakshatra.deity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ruler</span>
                <span>{panchang.nakshatra.ruler}</span>
              </div>
            </div>
          </motion.div>

          {/* Yoga and Karana */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-primary-600" />
              Yoga & Karana
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-600" />
                  Yoga
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span>{panchang.yoga.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-600" />
                  Karana
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span>{panchang.karana.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 