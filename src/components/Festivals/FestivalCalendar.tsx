import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import PanchangService from '../../services/PanchangService';
import { DailyPanchang, Location, Festival } from '../../types/panchang';

interface FestivalCalendarProps {
  onNotificationToggle: (festival: Festival) => void;
}

const defaultLocation: Location = {
  latitude: 28.6139,  // New Delhi
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

export default function FestivalCalendar({ onNotificationToggle }: FestivalCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const startDate = startOfMonth(selectedMonth);
  const endDate = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const { data: monthData, isLoading, error, isError } = useQuery<DailyPanchang[]>({
    queryKey: ['monthlyFestivals', format(selectedMonth, 'yyyy-MM')],
    queryFn: async () => {
      const promises = days.map(day => 
        PanchangService.getInstance().calculateDailyPanchang(day, defaultLocation)
      );
      return Promise.all(promises);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading festival data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="font-medium">Error loading festival data</p>
        <p className="mt-1 text-sm">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
      </div>
    );
  }

  const festivals = monthData?.flatMap(day => day.festivals) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Festivals & Important Dates - {format(selectedMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() - 1))}
            className="btn btn-secondary"
          >
            Previous Month
          </button>
          <button
            onClick={() => setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() + 1))}
            className="btn btn-secondary"
          >
            Next Month
          </button>
        </div>
      </div>

      {festivals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival, index) => (
            <div
              key={`${festival.name}-${index}`}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{festival.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(festival.date, 'MMMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => onNotificationToggle(festival)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  🔔
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {festival.description}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {festival.significance}
              </p>
              <div className="mt-2">
                <span className={`
                  inline-block px-2 py-1 text-xs rounded-full
                  ${festival.type === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    festival.type === 'tithi' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                `}>
                  {festival.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No festivals or important dates this month
        </div>
      )}
    </div>
  );
} 