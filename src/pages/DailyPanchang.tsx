import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PanchangService from '../services/PanchangService';
import { DailyPanchang as DailyPanchangType, Location } from '../types/panchang';

const defaultLocation: Location = {
  latitude: 28.6139,  // New Delhi
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

export default function DailyPanchang() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState(defaultLocation);

  const { data: panchang, isLoading, error } = useQuery<DailyPanchangType>({
    queryKey: ['panchang', selectedDate.toISOString(), location],
    queryFn: () => PanchangService.getInstance().calculateDailyPanchang(selectedDate, location),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        Error loading Panchang data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Panchang
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <select
            value={location.name}
            onChange={(e) => {
              // TODO: Implement location selection
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="New Delhi">New Delhi</option>
            {/* Add more locations */}
          </select>
        </div>
      </div>

      {panchang && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Astronomical Info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Astronomical Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sunrise</span>
                <span>{format(panchang.astronomicalInfo.sunrise, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sunset</span>
                <span>{format(panchang.astronomicalInfo.sunset, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Moonrise</span>
                <span>{format(panchang.astronomicalInfo.moonrise, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Moonset</span>
                <span>{format(panchang.astronomicalInfo.moonset, 'hh:mm a')}</span>
              </div>
            </div>
          </div>

          {/* Tithi Info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Tithi</h2>
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
                <span>{format(panchang.tithi.startTime, 'hh:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ends</span>
                <span>{format(panchang.tithi.endTime, 'hh:mm a')}</span>
              </div>
            </div>
          </div>

          {/* Nakshatra Info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Nakshatra</h2>
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
          </div>

          {/* Yoga and Karana */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Yoga & Karana</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Yoga</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span>{panchang.yoga.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Karana</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span>{panchang.karana.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 