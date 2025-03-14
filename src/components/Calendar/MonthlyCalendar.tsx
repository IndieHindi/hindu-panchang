import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import PanchangService from '../../services/PanchangService';
import { DailyPanchang, Location, Festival } from '../../types/panchang';
// Import CSS without type checking since it's a valid module
import '../../styles/custom-scrollbar.css';

interface MonthlyCalendarProps {
  location: Location;
  onFestivalNotificationToggle?: (festival: Festival) => void;
}

interface TimelineEvent {
  time: Date;
  type: 'sunrise' | 'sunset' | 'moonrise' | 'moonset' | 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'festival';
  name: string;
  description?: string;
  data?: Festival; // Festival is the only type needed here based on usage
}

export default function MonthlyCalendar({ location, onFestivalNotificationToggle }: MonthlyCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isCompactView, setIsCompactView] = useState(window.innerWidth < 768);

  // Calculate month days once when the month changes
  const { _startDate, _endDate, days } = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return {
      _startDate: start,
      _endDate: end,
      days: eachDayOfInterval({ start, end })
    };
  }, [selectedMonth]);

  // Listen for window resize to toggle compact view
  useEffect(() => {
    const handleResize = () => {
      setIsCompactView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Query for monthly panchang data
  const { data: monthData, isLoading } = useQuery<DailyPanchang[]>({
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
    enabled: !!location,
    staleTime: 24 * 60 * 60 * 1000, // Cache for a day since panchang data doesn't change frequently
  });

  // Use the loading state if needed
  const _isLoadingMonthData = isLoading;

  // Query for timeline data when a date is selected (now only for the exact selected date)
  const { data: timelineData, isLoading: isLoadingTimelineData } = useQuery<DailyPanchang | undefined>({
    queryKey: ['timeline', selectedDate?.toISOString(), location],
    queryFn: async () => {
      if (!selectedDate) return undefined;
      
      // Only get data for the selected date
      return await PanchangService.getInstance().calculateDailyPanchang(selectedDate, location);
    },
    enabled: !!selectedDate && !!location,
  });

  // Update events when timeline data changes - now handling single day data
  useEffect(() => {
    if (timelineData && selectedDate) {
      const newEvents: TimelineEvent[] = [];
      const uniqueEventKeys = new Set<string>(); // Track unique events
      
      // Helper function to add a unique event
      const addUniqueEvent = (event: TimelineEvent) => {
        // Create a unique key for this event type and time
        const eventKey = `${event.type}-${format(event.time, 'yyyy-MM-dd-HH-mm')}-${event.name}`;
        
        // Only add if we haven't seen this exact event before
        if (!uniqueEventKeys.has(eventKey)) {
          uniqueEventKeys.add(eventKey);
          newEvents.push(event);
        }
      };
      
      // Add astronomical events
      if (timelineData.astronomicalInfo?.sunrise) {
        addUniqueEvent({
          time: timelineData.astronomicalInfo.sunrise,
          type: 'sunrise',
          name: 'Sunrise',
        });
      }
      if (timelineData.astronomicalInfo?.sunset) {
        addUniqueEvent({
          time: timelineData.astronomicalInfo.sunset,
          type: 'sunset',
          name: 'Sunset',
        });
      }
      if (timelineData.astronomicalInfo?.moonrise) {
        addUniqueEvent({
          time: timelineData.astronomicalInfo.moonrise,
          type: 'moonrise',
          name: 'Moonrise',
        });
      }
      if (timelineData.astronomicalInfo?.moonset) {
        addUniqueEvent({
          time: timelineData.astronomicalInfo.moonset,
          type: 'moonset',
          name: 'Moonset',
        });
      }

      // Add tithi transitions
      if (timelineData.tithi?.startTime) {
        addUniqueEvent({
          time: timelineData.tithi.startTime,
          type: 'tithi',
          name: timelineData.tithi.name,
          description: `Tithi ${timelineData.tithi.number}`,
        });
      }

      // Add nakshatra transitions
      if (timelineData.nakshatra?.startTime) {
        addUniqueEvent({
          time: timelineData.nakshatra.startTime,
          type: 'nakshatra',
          name: timelineData.nakshatra.name,
          description: `Ruled by ${timelineData.nakshatra.ruler}`,
        });
      }

      // Add yoga transitions
      if (timelineData.yoga?.startTime) {
        addUniqueEvent({
          time: timelineData.yoga.startTime,
          type: 'yoga',
          name: timelineData.yoga.name,
        });
      }

      // Add karana transitions
      if (timelineData.karana?.startTime) {
        addUniqueEvent({
          time: timelineData.karana.startTime,
          type: 'karana',
          name: timelineData.karana.name,
        });
      }

      // Add festivals for the selected date
      timelineData.festivals?.forEach(festival => {
        // Set time to noon if not specified (for better timeline positioning)
        const festivalTime = new Date(festival.date);
        if (festivalTime.getHours() === 0 && festivalTime.getMinutes() === 0) {
          festivalTime.setHours(12, 0, 0);
        }
        
        addUniqueEvent({
          time: festivalTime,
          type: 'festival',
          name: festival.name,
          description: festival.description || festival.significance,
          data: festival,
        });
      });

      // Sort events chronologically
      newEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
      setEvents(newEvents);
    } else {
      setEvents([]);
    }
  }, [timelineData, selectedDate]);

  const getLunarPhaseIcon = useCallback((phase: number) => {
    if (phase === 0) return '🌑'; // New Moon
    if (phase < 0.25) return '🌒'; // Waxing Crescent
    if (phase === 0.25) return '🌓'; // First Quarter
    if (phase < 0.5) return '🌔'; // Waxing Gibbous
    if (phase === 0.5) return '🌕'; // Full Moon
    if (phase < 0.75) return '🌖'; // Waning Gibbous
    if (phase === 0.75) return '🌗'; // Last Quarter
    return '🌘'; // Waning Crescent
  }, []);

  const getDayInfo = useCallback((date: Date) => {
    if (!monthData) return null;
    return monthData.find(data => 
      format(data.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  }, [monthData]);

  const getEventIcon = useCallback((type: string) => {
    switch (type) {
      case 'sunrise':
      case 'sunset':
        return <SunIcon className="h-5 w-5 md:h-6 md:w-6" />;
      case 'moonrise':
      case 'moonset':
        return <MoonIcon className="h-5 w-5 md:h-6 md:w-6" />;
      case 'festival':
        return <BellIcon className="h-5 w-5 md:h-6 md:w-6" />;
      default:
        return <StarIcon className="h-5 w-5 md:h-6 md:w-6" />;
    }
  }, []);

  const getEventColor = useCallback((type: string) => {
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
      case 'festival':
        return 'text-rose-500';
      default:
        return 'text-gray-500';
    }
  }, []);

  const _hasFestival = useCallback((date: Date) => {
    const dayInfo = getDayInfo(date);
    return dayInfo?.festivals && dayInfo.festivals.length > 0;
  }, [getDayInfo]);

  // Get festival count for a specific day
  const getFestivalCount = useCallback((date: Date) => {
    const dayInfo = getDayInfo(date);
    return dayInfo?.festivals?.length || 0;
  }, [getDayInfo]);

  // Group events by date
  const groupEventsByDate = useMemo(() => {
    if (!events.length) return new Map<string, TimelineEvent[]>();
    
    const groupedEvents = new Map<string, TimelineEvent[]>();
    
    events.forEach(event => {
      const dateKey = format(event.time, 'yyyy-MM-dd');
      if (!groupedEvents.has(dateKey)) {
        groupedEvents.set(dateKey, []);
      }
      groupedEvents.get(dateKey)?.push(event);
    });
    
    return groupedEvents;
  }, [events]);

  // Functions for navigation and UI interaction
  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() - 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth(date => new Date(date.getFullYear(), date.getMonth() + 1));
  }, []);

  const toggleCompactView = useCallback(() => {
    setIsCompactView(prev => !prev);
  }, []);

  const handleDateClick = useCallback((day: Date) => {
    setSelectedDate(day);
  }, []);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleEventNotificationClick = (e: React.MouseEvent, data: Festival | undefined) => {
    e.stopPropagation();
    if (data && onFestivalNotificationToggle) {
      onFestivalNotificationToggle(data);
    }
  };

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleCloseTimeline = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // Render helper components
  const renderDayContent = useCallback((day: Date) => {
    const dayInfo = getDayInfo(day);
    const _isCurrentMonth = isSameMonth(day, selectedMonth);
    const isCurrentDay = isToday(day);
    const _isSelected = selectedDate && isSameDay(day, selectedDate);
    const festivalCount = getFestivalCount(day);

    return (
      <motion.div
        key={format(day, 'yyyy-MM-dd')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleDateClick(day)}
        className={`
          relative p-2 text-center cursor-pointer rounded-lg
          ${isSameMonth(day, selectedMonth) ? 'text-gray-100' : 'text-gray-500'}
          ${isToday(day) ? 'bg-purple-900 text-white' : ''}
          ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-yellow-400' : ''}
          hover:bg-gray-800 transition-colors
        `}
        aria-selected={selectedDate ? isSameDay(day, selectedDate) : undefined}
        aria-current={isToday(day) ? 'date' : undefined}
      >
        <div className="flex justify-between items-start">
          <span className={`text-xs sm:text-base font-medium ${isCurrentDay && 'text-primary-600'}`}>
            {format(day, 'd')}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {festivalCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[0.65rem] sm:text-xs bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-100 rounded-full">
                {festivalCount}
              </span>
            )}
            {dayInfo && !isCompactView && (
              <span title={`Lunar Phase: ${Math.round(dayInfo.astronomicalInfo.lunarPhase * 100)}%`}>
                {getLunarPhaseIcon(dayInfo.astronomicalInfo.lunarPhase)}
              </span>
            )}
          </div>
        </div>
        {dayInfo && !isCompactView && (
          <div className="mt-0.5 sm:mt-1 text-[0.6rem] sm:text-xs space-y-0.5 sm:space-y-1 overflow-hidden">
            <div title="Tithi" className="text-gray-600 dark:text-gray-400 truncate">
              {dayInfo.tithi.name}
            </div>
            <div title="Nakshatra" className="text-gray-600 dark:text-gray-400 truncate">
              {dayInfo.nakshatra.name}
            </div>
            {dayInfo.festivals && dayInfo.festivals.length > 0 && (
              <div className="mt-0.5 sm:mt-1 text-rose-600 dark:text-rose-400 font-medium truncate">
                {dayInfo.festivals[0].name}
                {dayInfo.festivals.length > 1 && ` +${dayInfo.festivals.length - 1}`}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }, [
    getDayInfo, 
    selectedMonth, 
    selectedDate, 
    isCompactView, 
    getFestivalCount, 
    getLunarPhaseIcon, 
    handleDateClick
  ]);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">
          {format(selectedMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={toggleCompactView}
            className="btn btn-secondary btn-sm md:hidden flex items-center"
            aria-label={isCompactView ? 'Switch to expanded view' : 'Switch to compact view'}
          >
            {isCompactView ? 'Expand View' : 'Compact View'}
          </button>
          <button
            onClick={goToPreviousMonth}
            className="btn btn-secondary btn-sm sm:btn-md flex items-center"
            aria-label={`Go to previous month: ${format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1), 'MMMM yyyy')}`}
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={goToNextMonth}
            className="btn btn-secondary btn-sm sm:btn-md flex items-center"
            aria-label={`Go to next month: ${format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1), 'MMMM yyyy')}`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Responsive layout with timeline on right on larger screens, below on smaller screens */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Calendar section */}
        <div className="lg:w-3/5">
          <div 
            className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
            role="grid"
            aria-label="Calendar"
          >
            {/* Week days header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="bg-gray-100 dark:bg-gray-800 py-1 px-0.5 sm:p-2 text-center text-xs sm:text-sm font-semibold"
                role="columnheader"
                aria-label={day}
              >
                {isCompactView ? day.charAt(0) : day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map(day => renderDayContent(day))}
          </div>
        </div>

        {/* Interactive Timeline - Now on the right side */}
        <div className="lg:w-2/5">
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 h-full"
                aria-label="Event Timeline"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4 border-b pb-2 sm:pb-3 dark:border-gray-700">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 mr-2" />
                    <h2 className="text-lg sm:text-xl font-bold">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseTimeline}
                    className="btn btn-outline btn-xs sm:btn-sm"
                    aria-label="Close timeline"
                  >
                    Close
                  </button>
                </div>

                {isLoadingTimelineData ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary-600 mb-2"></div>
                    <p>Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
                    <ClockIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                    <p>No events found for this date</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[50vh] sm:max-h-[65vh] pr-2 custom-scrollbar">
                    {/* Group events by date and display date headers */}
                    {Array.from(groupEventsByDate.entries()).map(([dateKey, dateEvents]) => (
                      <div key={dateKey} className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
                          {format(parseISO(dateKey), 'EEEE, MMMM d')}
                        </h3>
                        
                        <div 
                          className="relative ml-4 border-l-2 border-gray-200 dark:border-gray-700"
                          role="list"
                          aria-label={`Events for ${format(parseISO(dateKey), 'MMMM d')}`}
                        >
                          {dateEvents.map((event, index) => (
                            <motion.div
                              key={`${event.type}-${event.time.toISOString()}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="mb-3 sm:mb-4 pl-4 relative"
                              role="listitem"
                            >
                              {/* Event dot */}
                              <div 
                                className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white dark:bg-gray-800 border-3 sm:border-4 ${
                                  getEventColor(event.type).replace('text', 'border')
                                } -left-1.5 sm:-left-2.5 top-0`}
                                aria-hidden="true"
                              />
                              
                              {/* Event card */}
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEventClick(event)}
                                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer"
                                tabIndex={0}
                                role="button"
                                aria-label={`${event.name} at ${format(event.time, 'hh:mm a')}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 sm:p-2 rounded-full bg-opacity-20 ${getEventColor(event.type).replace('text', 'bg')}`}>
                                    <div className={getEventColor(event.type)}>
                                      {getEventIcon(event.type)}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm sm:text-base font-semibold truncate max-w-[120px] sm:max-w-none">
                                        {event.name}
                                      </p>
                                      <div className="flex items-center">
                                        {event.type === 'festival' && onFestivalNotificationToggle && (
                                          <button 
                                            onClick={(e) => handleEventNotificationClick(e, event.data)}
                                            className="text-rose-500 hover:text-rose-600 mr-2 p-1"
                                            aria-label={`Set notification for ${event.name}`}
                                          >
                                            🔔
                                          </button>
                                        )}
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                          {format(event.time, 'hh:mm a')}
                                        </p>
                                      </div>
                                    </div>
                                    {event.description && (
                                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1 line-clamp-2">
                                        {event.description}
                                      </p>
                                    )}
                                    {event.type === 'festival' && event.data?.type && (
                                      <div className="mt-1 sm:mt-2">
                                        <span className={`
                                          inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-[0.65rem] sm:text-xs rounded-full
                                          ${event.data.type === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            event.data.type === 'tithi' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                                        `}>
                                          {event.data.type}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="timeline-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 h-full flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4"
              >
                <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">Select a Date</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Choose a date from the calendar to view its events timeline
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Event details modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-details-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center gap-3 sm:gap-4 ${getEventColor(selectedEvent.type)}`}>
                {getEventIcon(selectedEvent.type)}
                <h3 id="event-details-title" className="text-lg sm:text-xl font-semibold">{selectedEvent.name}</h3>
              </div>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {format(selectedEvent.time, 'MMMM d, yyyy hh:mm a')}
              </p>
              {selectedEvent.description && (
                <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-200">
                  {selectedEvent.description}
                </p>
              )}

              {/* Festival-specific details */}
              {selectedEvent.type === 'festival' && selectedEvent.data && (
                <div className="mt-3 space-y-2">
                  {selectedEvent.data.significance && (
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Significance:</span> {selectedEvent.data.significance}
                    </p>
                  )}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className={`
                      inline-block px-2 py-1 text-xs rounded-full
                      ${selectedEvent.data.type === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        selectedEvent.data.type === 'tithi' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                    `}>
                      {selectedEvent.data.type}
                    </span>
                    
                    {onFestivalNotificationToggle && (
                      <button
                        onClick={() => {
                          if (selectedEvent.data) {
                            onFestivalNotificationToggle(selectedEvent.data as Festival);
                          }
                        }}
                        className="btn btn-secondary btn-xs sm:btn-sm flex items-center gap-1"
                        aria-label={`Set notification for ${selectedEvent.name}`}
                      >
                        <BellIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Notification</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                aria-label="Close details"
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