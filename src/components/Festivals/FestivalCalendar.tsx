import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isSameMonth, isToday } from 'date-fns';
import { Festival } from '../../types/panchang';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

interface FestivalCalendarProps {
  onNotificationToggle?: (festival: Festival) => void;
}

export default function FestivalCalendar({ onNotificationToggle }: FestivalCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [notificationEnabled, setNotificationEnabled] = useState<Record<string, boolean>>({});

  const { data: festivals, isLoading } = useQuery<Festival[]>({
    queryKey: ['festivals', format(selectedMonth, 'yyyy-MM')],
    queryFn: async () => {
      // TODO: Implement actual API call
      return [
        {
          name: 'Ram Navami',
          date: new Date('2024-04-17'),
          description: 'Birthday of Lord Rama',
          type: 'major',
          significance: 'Celebrates the birth of Lord Rama, the seventh avatar of Vishnu',
        },
        {
          name: 'Hanuman Jayanti',
          date: new Date('2024-04-23'),
          description: 'Birthday of Lord Hanuman',
          type: 'major',
          significance: 'Celebrates the birth of Lord Hanuman',
        },
      ];
    },
  });

  const toggleNotification = (festival: Festival) => {
    setNotificationEnabled(prev => ({
      ...prev,
      [festival.name]: !prev[festival.name],
    }));
    onNotificationToggle?.(festival);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Festivals & Important Dates
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : festivals && festivals.length > 0 ? (
        <div className="space-y-4">
          {festivals
            .filter(festival => isSameMonth(festival.date, selectedMonth))
            .map(festival => (
              <div
                key={festival.name}
                className={`
                  card flex items-start justify-between
                  ${isToday(festival.date) ? 'ring-2 ring-primary-500' : ''}
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{festival.name}</h3>
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full
                      ${festival.type === 'major' 
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }
                    `}>
                      {festival.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(festival.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {festival.description}
                  </p>
                  {festival.significance && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Significance:</span> {festival.significance}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleNotification(festival)}
                  className={`
                    p-2 rounded-full transition-colors
                    ${notificationEnabled[festival.name]
                      ? 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/50'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {notificationEnabled[festival.name] ? (
                    <BellIcon className="h-6 w-6" />
                  ) : (
                    <BellSlashIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No festivals in {format(selectedMonth, 'MMMM yyyy')}
        </div>
      )}
    </div>
  );
} 