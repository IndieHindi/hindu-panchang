import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import PanchangService from '../../services/PanchangService';
import { DailyPanchang, Location } from '../../types/panchang';
import { MoonIcon } from '@heroicons/react/24/outline';

interface MonthlyCalendarProps {
  location: Location;
}

export default function MonthlyCalendar({ location }: MonthlyCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const startDate = startOfMonth(selectedMonth);
  const endDate = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Fetch Panchang data for the entire month
  const { data: monthData, isLoading, error, isError } = useQuery<DailyPanchang[]>({
    queryKey: ['monthlyPanchang', format(selectedMonth, 'yyyy-MM'), location],
    queryFn: async () => {
      try {
        const promises = days.map(day => 
          PanchangService.getInstance().calculateDailyPanchang(day, location)
        );
        return await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching monthly panchang data:', error);
        throw error;
      }
    },
    enabled: !!location, // Only run query when we have location
  });

  const getLunarPhaseIcon = (phase: number) => {
    if (phase === 0) return '🌑'; // New Moon
    if (phase < 0.25) return '🌒'; // Waxing Crescent
    if (phase === 0.25) return '🌓'; // First Quarter
    if (phase < 0.5) return '🌔'; // Waxing Gibbous
    if (phase === 0.5) return '🌕'; // Full Moon
    if (phase < 0.75) return '🌖'; // Waning Gibbous
    if (phase === 0.75) return '🌗'; // Last Quarter
    return '🌘'; // Waning Crescent
  };

  const getDayInfo = (date: Date) => {
    if (!monthData) return null;
    return monthData.find(data => 
      format(data.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading calendar data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="font-medium">Error loading calendar data</p>
        <p className="mt-1 text-sm">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {format(selectedMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() - 1))}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() + 1))}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Week days header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-gray-100 dark:bg-gray-800 p-2 text-center font-semibold"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const dayInfo = getDayInfo(day);
          const isCurrentMonth = isSameMonth(day, selectedMonth);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[120px] p-2 bg-white dark:bg-gray-800
                ${!isCurrentMonth && 'opacity-50'}
                ${isCurrentDay && 'ring-2 ring-primary-500'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`font-medium ${isCurrentDay && 'text-primary-600'}`}>
                  {format(day, 'd')}
                </span>
                {dayInfo && (
                  <span title={`Lunar Phase: ${Math.round(dayInfo.astronomicalInfo.lunarPhase * 100)}%`}>
                    {getLunarPhaseIcon(dayInfo.astronomicalInfo.lunarPhase)}
                  </span>
                )}
              </div>
              {dayInfo && (
                <div className="mt-1 text-xs space-y-1">
                  <div title="Tithi" className="text-gray-600 dark:text-gray-400">
                    {dayInfo.tithi.name}
                  </div>
                  <div title="Nakshatra" className="text-gray-600 dark:text-gray-400">
                    {dayInfo.nakshatra.name}
                  </div>
                  {dayInfo.festivals.length > 0 && (
                    <div className="text-secondary-600 dark:text-secondary-400 font-medium">
                      {dayInfo.festivals[0].name}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 