import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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

// Add type definition for zodiac signs
type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

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

  // Rashifal state variables
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | ''>('');
  const [activePrediction, setActivePrediction] = useState<'general' | 'career' | 'love' | 'health'>('general');

  // List of zodiac signs with their details
  const zodiacSigns = useMemo(() => [
    { name: 'Aries', symbol: '♈', element: 'fire' },
    { name: 'Taurus', symbol: '♉', element: 'earth' },
    { name: 'Gemini', symbol: '♊', element: 'air' },
    { name: 'Cancer', symbol: '♋', element: 'water' },
    { name: 'Leo', symbol: '♌', element: 'fire' },
    { name: 'Virgo', symbol: '♍', element: 'earth' },
    { name: 'Libra', symbol: '♎', element: 'air' },
    { name: 'Scorpio', symbol: '♏', element: 'water' },
    { name: 'Sagittarius', symbol: '♐', element: 'fire' },
    { name: 'Capricorn', symbol: '♑', element: 'earth' },
    { name: 'Aquarius', symbol: '♒', element: 'air' },
    { name: 'Pisces', symbol: '♓', element: 'water' },
  ], []);

  // Generate seeded random numbers for consistent "predictions"
  const seedRandom = useCallback((seed: string) => {
    let hashValue = Array.from(seed).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return () => {
      const x = Math.sin(hashValue++) * 10000;
      return x - Math.floor(x);
    };
  }, []);

  // Generate predictive text based on seed
  const generatePrediction = useCallback((sign: string, type: string): string => {
    const prng = seedRandom(`${sign}-${type}-${selectedDate.toISOString()}`);
    
    const generalPredictions = [
      `On ${format(selectedDate, 'MMMM d')}, opportunities for growth and self-discovery await you. Pay attention to the small details that might otherwise go unnoticed.`,
      `The cosmic energies on ${format(selectedDate, 'MMMM d')} are aligning in your favor. It's a good day to take initiative on projects you've been postponing.`,
      `This ${format(selectedDate, 'EEEE')}, you may feel a strong urge to break from your routine. Allow yourself some freedom to explore new possibilities.`,
      `For ${format(selectedDate, 'MMMM d')}, a balance of patience and determination will serve you well. Focus on your long-term goals.`,
      `${format(selectedDate, 'EEEE')} offers a chance for meaningful connections. Open yourself to interactions that might seem outside your comfort zone.`
    ];
    
    const careerPredictions = [
      `On ${format(selectedDate, 'MMMM d')}, your professional life could benefit from a fresh perspective. Consider approaching a challenge from a different angle.`,
      `${format(selectedDate, 'EEEE')} brings collaborative opportunities. Don't hesitate to share your ideas with colleagues.`,
      `This ${format(selectedDate, 'EEEE')}, a leadership opportunity may present itself. Trust your instincts and step forward with confidence.`,
      `For ${format(selectedDate, 'MMMM d')}, focus on organization and planning. Setting clear boundaries will help you maintain productivity.`,
      `On ${format(selectedDate, 'MMMM d')}, your innovative thinking will be appreciated in the workplace. This is a good time to propose that new idea.`
    ];
    
    const lovePredictions = [
      `${format(selectedDate, 'EEEE')} emphasizes communication in your relationships. Express your feelings honestly but with compassion.`,
      `On ${format(selectedDate, 'MMMM d')}, if single, you might encounter someone intriguing. If partnered, a deeper understanding can develop.`,
      `This ${format(selectedDate, 'EEEE')}, take time to appreciate the important connections in your life. Small gestures can strengthen bonds.`,
      `${format(selectedDate, 'MMMM d')} brings romantic energy. Plan something special for yourself or a loved one.`,
      `For ${format(selectedDate, 'MMMM d')}, patience will be rewarded in matters of the heart. Trust the natural rhythm of your relationships.`
    ];
    
    const healthPredictions = [
      `On ${format(selectedDate, 'MMMM d')}, pay special attention to your physical well-being. A small adjustment to your routine could make a big difference.`,
      `This ${format(selectedDate, 'EEEE')}, mental clarity comes through physical movement. Consider taking a walk or doing gentle exercise.`,
      `${format(selectedDate, 'MMMM d')} calls for balance between activity and rest. Listen to what your body needs.`,
      `For ${format(selectedDate, 'MMMM d')}, focus on nourishing foods. They will be particularly beneficial today.`,
      `On ${format(selectedDate, 'EEEE')}, try to connect with nature. Even a brief time outdoors can refresh your spirit and energy.`
    ];
    
    const predictionSets: Record<string, string[]> = {
      general: generalPredictions,
      career: careerPredictions,
      love: lovePredictions,
      health: healthPredictions
    };
    
    const predictions = predictionSets[type] || generalPredictions;
    const index = Math.floor(prng() * predictions.length);
    
    return predictions[index];
  }, [seedRandom, selectedDate]);

  // Handle sign selection
  const handleSignSelect = useCallback((sign: string) => {
    setSelectedSign(sign as ZodiacSign | '');
  }, []);

  // Handle prediction type change
  const handlePredictionChange = useCallback((type: 'general' | 'career' | 'love' | 'health') => {
    setActivePrediction(type);
  }, []);

  // Prepare lucky colors for display
  const getLuckyColors = useMemo(() => {
    if (!selectedSign) return [];
    
    const prng = seedRandom(`${selectedSign}-colors-${selectedDate.toISOString()}`);
    const allColors: Record<ZodiacSign, string[]> = {
      'Aries': ['Red', 'White', 'Cream'],
      'Taurus': ['Green', 'Pink', 'Blue'],
      'Gemini': ['Yellow', 'Green', 'Light Blue'],
      'Cancer': ['Silver', 'White', 'Cream'],
      'Leo': ['Gold', 'Orange', 'Red'],
      'Virgo': ['Green', 'White', 'Gray'],
      'Libra': ['Pink', 'Blue', 'White'],
      'Scorpio': ['Red', 'Maroon', 'Black'],
      'Sagittarius': ['Purple', 'Blue', 'Plum'],
      'Capricorn': ['Brown', 'Gray', 'Black'],
      'Aquarius': ['Blue', 'Electric Blue', 'Silver'],
      'Pisces': ['Sea Green', 'Lavender', 'Purple']
    };
    
    const baseColors = allColors[selectedSign] || [];
    // Rotate colors based on date
    const rotation = Math.floor(prng() * baseColors.length);
    return [...baseColors.slice(rotation), ...baseColors.slice(0, rotation)];
  }, [selectedSign, selectedDate, seedRandom]);

  // Prepare lucky numbers for display
  const getLuckyNumbers = useMemo(() => {
    if (!selectedSign) return [];
    
    const prng = seedRandom(`${selectedSign}-numbers-${selectedDate.toISOString()}`);
    
    const numbers = new Set<number>();
    while (numbers.size < 3) {
      const num = Math.floor(prng() * 49) + 1;
      numbers.add(num);
    }
    
    return Array.from(numbers).sort((a, b) => a - b);
  }, [selectedSign, selectedDate, seedRandom]);

  // Prepare compatibility data for display
  const getCompatibleSigns = useMemo(() => {
    if (!selectedSign) return [];
    
    const prng = seedRandom(`${selectedSign}-compatibility-${selectedDate.toISOString()}`);
    const compatibilitySets: Record<string, string[]> = {
      'Aries': ['Leo', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'],
      'Taurus': ['Virgo', 'Capricorn', 'Cancer', 'Scorpio', 'Pisces'],
      'Gemini': ['Libra', 'Aquarius', 'Aries', 'Leo', 'Sagittarius'],
      'Cancer': ['Scorpio', 'Pisces', 'Taurus', 'Virgo', 'Capricorn'],
      'Leo': ['Aries', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'],
      'Virgo': ['Taurus', 'Capricorn', 'Cancer', 'Scorpio', 'Pisces'],
      'Libra': ['Gemini', 'Aquarius', 'Leo', 'Aries', 'Sagittarius'],
      'Scorpio': ['Cancer', 'Pisces', 'Virgo', 'Taurus', 'Capricorn'],
      'Sagittarius': ['Aries', 'Leo', 'Aquarius', 'Gemini', 'Libra'],
      'Capricorn': ['Taurus', 'Virgo', 'Pisces', 'Cancer', 'Scorpio'],
      'Aquarius': ['Gemini', 'Libra', 'Sagittarius', 'Aries', 'Leo'],
      'Pisces': ['Cancer', 'Scorpio', 'Capricorn', 'Taurus', 'Virgo']
    };
    
    const baseCompatible = compatibilitySets[selectedSign] || [];
    // Select 3 random compatible signs based on date
    const selectedCompatible = new Set<string>();
    while (selectedCompatible.size < 3) {
      const index = Math.floor(prng() * baseCompatible.length);
      selectedCompatible.add(baseCompatible[index]);
    }
    
    return Array.from(selectedCompatible);
  }, [selectedSign, selectedDate, seedRandom]);

  // Prepare characteristics for display
  const getCharacteristics = useMemo(() => {
    if (!selectedSign) return [];
    
    const prng = seedRandom(`${selectedSign}-characteristics-${selectedDate.toISOString()}`);
    const characteristicSets: Record<string, string[]> = {
      'Aries': ['Energetic', 'Courageous', 'Passionate', 'Determined', 'Confident', 'Optimistic', 'Honest'],
      'Taurus': ['Patient', 'Reliable', 'Practical', 'Devoted', 'Responsible', 'Stable', 'Loving'],
      'Gemini': ['Adaptable', 'Outgoing', 'Curious', 'Quick-witted', 'Versatile', 'Expressive', 'Youthful'],
      'Cancer': ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic', 'Persuasive', 'Nurturing'],
      'Leo': ['Creative', 'Generous', 'Warm-hearted', 'Humorous', 'Passionate', 'Noble', 'Confident'],
      'Virgo': ['Analytical', 'Hardworking', 'Practical', 'Diligent', 'Modest', 'Intelligent', 'Reliable'],
      'Libra': ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative', 'Gracious', 'Peaceful', 'Idealistic'],
      'Scorpio': ['Resourceful', 'Powerful', 'Passionate', 'Determined', 'Exciting', 'Magnetic', 'Dynamic'],
      'Sagittarius': ['Generous', 'Idealistic', 'Optimistic', 'Enthusiastic', 'Philosophical', 'Adventurous', 'Honest'],
      'Capricorn': ['Responsible', 'Disciplined', 'Self-controlled', 'Independent', 'Persistent', 'Practical', 'Ambitious'],
      'Aquarius': ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual', 'Inventive', 'Unique'],
      'Pisces': ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise', 'Musical', 'Mystical']
    };
    
    const baseCharacteristics = characteristicSets[selectedSign] || [];
    // Select 5 random characteristics based on date
    const selectedCharacteristics = new Set<string>();
    while (selectedCharacteristics.size < 5) {
      const index = Math.floor(prng() * baseCharacteristics.length);
      selectedCharacteristics.add(baseCharacteristics[index]);
    }
    
    return Array.from(selectedCharacteristics);
  }, [selectedSign, selectedDate, seedRandom]);

  // Prepare element data for display
  const getElement = useMemo(() => {
    if (!selectedSign) return '';
    
    const sign = zodiacSigns.find(sign => sign.name === selectedSign);
    return sign ? sign.element : '';
  }, [selectedSign, zodiacSigns]);

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-primary-600"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading Panchang data...</span>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
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

          {/* Rashifal Quick Lookup Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            // className="col-span-full bg-gray-900/95 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-lg shadow-purple-500/10 p-6"
            className="col-span-full card hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-500 flex items-center justify-center gap-2">
              <StarIcon className="h-8 w-8" />
              Rashifal for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {zodiacSigns.map((sign) => (
                <motion.button
                  key={sign.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSignSelect(sign.name)}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all duration-300 ${
                    selectedSign === sign.name
                      // ? 'bg-purple-900 border-purple-400 shadow-lg shadow-purple-500/20'
                      // : 'bg-gray-800/80 border-gray-700 hover:border-purple-500'
                      ? 'bg-purple-700 border-yellow-400'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-3xl mb-2" role="img" aria-label={sign.name}>
                    {sign.symbol}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {sign.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 capitalize">
                    {sign.element}
                  </span>
                </motion.button>
              ))}
            </div>

            {selectedSign && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                // className="bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/20"
                className="bg-gray-900 rounded-lg border-4 border-gray-800 overflow-hidden"
              >
                <div 
                // className="bg-purple-900 bg-opacity-90 p-4 flex items-center justify-between"
                className="bg-purple-900 p-4 flex items-center justify-between border-b-4 border-gray-800"
                >
                  <div className="flex items-center">
                    <span 
                      className="text-4xl mr-3" 
                      role="img" 
                      aria-label={selectedSign}
                    >
                      {zodiacSigns.find(sign => sign.name === selectedSign)?.symbol}
                    </span>
                    <h2 className="text-xl font-bold text-yellow-300"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {selectedSign}
                    </h2>
                  </div>
                  <div className="text-white opacity-80 text-sm capitalize">
                    {getElement} element
                  </div>
                </div>

                {/* Prediction Type Navigation */}
                <div className="bg-gray-800 border-b-4 border-gray-700 grid grid-cols-4">
                  {(['general', 'career', 'love', 'health'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePredictionChange(type)}
                      className={`py-2 text-center transition-all duration-300 text-sm ${
                        activePrediction === type 
                            ? 'bg-gray-700 text-yellow-300 font-bold' 
                            : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Prediction Content */}
                <div className="p-6 bg-gradient-to-b from-gray-800/90 to-gray-900/90">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePrediction}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-white leading-relaxed"
                    >
                      <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px', lineHeight: '2' }}>
                        {generatePrediction(selectedSign, activePrediction)}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Lucky Information */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Characteristics */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700"
                    >
                      <h3 className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                        >
                        Characteristics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getCharacteristics.map((trait, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-2 py-1 bg-purple-900 border border-purple-700 rounded text-white text-xs"
                          >
                            {trait}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Lucky Colors */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700"
                    >
                      <h3 className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                      >
                        Lucky Colors
                      </h3>
                      <div className="flex items-center flex-wrap gap-3">
                        {getLuckyColors.map((color, index) => (
                          <motion.div 
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="flex flex-col items-center"
                          >
                            <div 
                              className="w-8 h-8 rounded-md mb-1 border border-gray-600 shadow-lg"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span className="text-white text-xs">{color}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Lucky Numbers & Compatibility */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700"
                    >
                      <h3 className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
                        Lucky Numbers & Compatibility
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {getLuckyNumbers.map((number, index) => (
                              <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                className="w-8 h-8 flex items-center justify-center bg-purple-800 border-2 border-purple-700 rounded-md text-yellow-300 font-bold text-sm"
                              >
                                {number}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {getCompatibleSigns.map((sign, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="px-2 py-1 bg-indigo-900 border border-indigo-700 rounded text-white text-xs"
                              >
                                {sign}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 