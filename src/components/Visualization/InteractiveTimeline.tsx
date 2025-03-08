import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import PanchangService from '../../services/PanchangService';
import { DailyPanchang, Location } from '../../types/panchang';

const defaultLocation: Location = {
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

interface TimelineEvent {
  time: Date;
  type: 'sunrise' | 'sunset' | 'moonrise' | 'moonset' | 'tithi' | 'nakshatra' | 'yoga' | 'karana';
  name: string;
  description?: string;
}

export default function InteractiveTimeline() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const { data: panchangData, isLoading } = useQuery<DailyPanchang[]>({
    queryKey: ['timeline', selectedDate.toISOString()],
    queryFn: async () => {
      const dates = [-1, 0, 1].map(offset => addDays(selectedDate, offset));
      const promises = dates.map(date => 
        PanchangService.getInstance().calculateDailyPanchang(date, defaultLocation)
      );
      return Promise.all(promises);
    },
  });

  useEffect(() => {
    if (panchangData) {
      const newEvents: TimelineEvent[] = [];
      panchangData.forEach(panchang => {
        // Add astronomical events
        if (panchang.astronomicalInfo.sunrise) {
          newEvents.push({
            time: panchang.astronomicalInfo.sunrise,
            type: 'sunrise',
            name: 'Sunrise',
          });
        }
        if (panchang.astronomicalInfo.sunset) {
          newEvents.push({
            time: panchang.astronomicalInfo.sunset,
            type: 'sunset',
            name: 'Sunset',
          });
        }
        if (panchang.astronomicalInfo.moonrise) {
          newEvents.push({
            time: panchang.astronomicalInfo.moonrise,
            type: 'moonrise',
            name: 'Moonrise',
          });
        }
        if (panchang.astronomicalInfo.moonset) {
          newEvents.push({
            time: panchang.astronomicalInfo.moonset,
            type: 'moonset',
            name: 'Moonset',
          });
        }

        // Add tithi transitions
        newEvents.push({
          time: panchang.tithi.startTime,
          type: 'tithi',
          name: panchang.tithi.name,
          description: `Tithi ${panchang.tithi.number}`,
        });

        // Add nakshatra transitions
        newEvents.push({
          time: panchang.nakshatra.startTime,
          type: 'nakshatra',
          name: panchang.nakshatra.name,
          description: `Ruled by ${panchang.nakshatra.ruler}`,
        });

        // Add yoga transitions
        newEvents.push({
          time: panchang.yoga.startTime,
          type: 'yoga',
          name: panchang.yoga.name,
        });

        // Add karana transitions
        newEvents.push({
          time: panchang.karana.startTime,
          type: 'karana',
          name: panchang.karana.name,
        });
      });

      // Sort events by time
      newEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
      setEvents(newEvents);
    }
  }, [panchangData]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sunrise':
      case 'sunset':
        return <SunIcon className="h-6 w-6" />;
      case 'moonrise':
      case 'moonset':
        return <MoonIcon className="h-6 w-6" />;
      default:
        return <StarIcon className="h-6 w-6" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'sunrise':
      case 'sunset':
        return 'text-yellow-500';
      case 'moonrise':
      case 'moonset':
        return 'text-blue-500';
      case 'tithi':
        return 'text-purple-500';
      case 'nakshatra':
        return 'text-green-500';
      case 'yoga':
        return 'text-red-500';
      case 'karana':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSelectedDate(date => subDays(date, 1))}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </motion.button>
        <h2 className="text-2xl font-bold">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSelectedDate(date => addDays(date, 1))}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent"
          />
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2" />

          {/* Timeline events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={`${event.type}-${event.time.toISOString()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}
              >
                <div
                  className={`absolute ${index % 2 === 0 ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2 ${
                    index % 2 === 0 ? '-translate-x-1/2' : 'translate-x-1/2'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 ${
                      getEventColor(event.type).replace('text', 'border')
                    } cursor-pointer`}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                >
                  <div className={`flex items-center gap-2 ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={getEventColor(event.type)}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(event.time, 'hh:mm a')}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Event details modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center gap-4 ${getEventColor(selectedEvent.type)}`}>
                {getEventIcon(selectedEvent.type)}
                <h3 className="text-xl font-semibold">{selectedEvent.name}</h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {format(selectedEvent.time, 'MMMM d, yyyy hh:mm a')}
              </p>
              {selectedEvent.description && (
                <p className="mt-2 text-gray-700 dark:text-gray-200">
                  {selectedEvent.description}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEvent(null)}
                className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 