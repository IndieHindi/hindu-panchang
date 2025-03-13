import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import PixelArtRashiVisualizer from '../components/Rashifal/PixelArtRashiVisualizer';
import RashiDetailCard from '../components/Rashifal/RashiDetailCard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ZodiacSign from '../components/Rashifal/ZodiacSign';
import rashiCalculationService, { RashiResult, BirthDetails } from '../services/RashiCalculationService';

/**
 * Rashifal Page
 * 
 * This page provides users with zodiac sign-based predictions and a personalized
 * rashi (zodiac) visualization based on birth details.
 * 
 * It offers:
 * 1. Quick lookup - Select a sign to see general predictions
 * 2. Detailed birth chart - Enter birth details for personalized rashi info
 * 
 * @TODO: Implement actual astrological calculations with a proper API
 * @TODO: Add daily/weekly/monthly predictions from backend
 * @TODO: Add social sharing functionality
 * @TODO: Add personalized recommendations based on rashi
 */
const Rashifal: React.FC = () => {
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

  // State variables
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>('quick');
  const [activePrediction, setActivePrediction] = useState<'general' | 'career' | 'love' | 'health'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showRashiResult, setShowRashiResult] = useState(false);
  const [rashiResult, setRashiResult] = useState<RashiResult | null>(null);

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
    const prng = seedRandom(`${sign}-${type}-${new Date().toDateString()}`);
    
    const generalPredictions = [
      `Today brings opportunities for growth and self-discovery. Pay attention to the small details that might otherwise go unnoticed.`,
      `The cosmic energies are aligning in your favor. It's a good day to take initiative on projects you've been postponing.`,
      `You may feel a strong urge to break from your routine. Allow yourself some freedom to explore new possibilities.`,
      `A balance of patience and determination will serve you well today. Focus on your long-term goals.`,
      `Today offers a chance for meaningful connections. Open yourself to interactions that might seem outside your comfort zone.`
    ];
    
    const careerPredictions = [
      `Your professional life could benefit from a fresh perspective. Consider approaching a challenge from a different angle.`,
      `Collaborative efforts will yield positive results. Don't hesitate to share your ideas with colleagues.`,
      `A leadership opportunity may present itself. Trust your instincts and step forward with confidence.`,
      `Focus on organization and planning today. Setting clear boundaries will help you maintain productivity.`,
      `Your innovative thinking will be appreciated in the workplace. This is a good time to propose that new idea.`
    ];
    
    const lovePredictions = [
      `Communication is key in your relationships today. Express your feelings honestly but with compassion.`,
      `If single, you might encounter someone intriguing. If partnered, a deeper understanding can develop.`,
      `Take time to appreciate the important connections in your life. Small gestures can strengthen bonds.`,
      `Romantic energy surrounds you today. Plan something special for yourself or a loved one.`,
      `Patience will be rewarded in matters of the heart. Trust the natural rhythm of your relationships.`
    ];
    
    const healthPredictions = [
      `Pay attention to your physical well-being today. A small adjustment to your routine could make a big difference.`,
      `Mental clarity comes through physical movement. Consider taking a walk or doing gentle exercise.`,
      `Balance your energy by alternating between activity and rest. Listen to what your body needs.`,
      `Nourishing foods will be particularly beneficial today. Focus on what makes you feel energized.`,
      `Connect with nature if possible. Even a brief time outdoors can refresh your spirit and energy.`
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
  }, [seedRandom]);
  
  // Handle sign selection
  const handleSignSelect = useCallback((sign: string) => {
    setSelectedSign(sign);
  }, []);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: 'quick' | 'detailed') => {
    setActiveTab(tab);
    // Reset result display when switching tabs
    if (tab === 'quick') {
      setShowRashiResult(false);
      setRashiResult(null);
    }
  }, []);
  
  // Handle prediction type change
  const handlePredictionChange = useCallback((type: 'general' | 'career' | 'love' | 'health') => {
    setActivePrediction(type);
  }, []);

  // Handle birth details submission
  const handleBirthDetailsSubmit = useCallback(async (details: BirthDetails) => {
    try {
      setIsLoading(true);
      
      // Calculate rashi using the service
      const result = await rashiCalculationService.calculateRashi(details);
      
      setRashiResult(result);
      setShowRashiResult(true);
    } catch (error) {
      console.error('Error calculating rashi:', error);
      // Show error notification to user
      alert('An error occurred while calculating your rashi. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Prepare lucky colors for display - use memoization for better performance
  const getLuckyColors = useMemo(() => {
    if (!selectedSign) return [];
    
    const colorSets: Record<string, string[]> = {
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
    
    return colorSets[selectedSign] || [];
  }, [selectedSign]);
  
  // Prepare lucky numbers for display - use memoization for better performance
  const getLuckyNumbers = useMemo(() => {
    if (!selectedSign) return [];
    
    // Use a seeded random number generator for consistency
    const prng = seedRandom(selectedSign);
    
    // Generate 3 unique "lucky" numbers between 1 and 49
    const numbers = new Set<number>();
    while (numbers.size < 3) {
      const num = Math.floor(prng() * 49) + 1;
      numbers.add(num);
    }
    
    return Array.from(numbers).sort((a, b) => a - b);
  }, [selectedSign, seedRandom]);
  
  // Prepare compatibility data for display - use memoization for better performance
  const getCompatibleSigns = useMemo(() => {
    if (!selectedSign) return [];
    
    const compatibilitySets: Record<string, string[]> = {
      'Aries': ['Leo', 'Sagittarius', 'Gemini'],
      'Taurus': ['Virgo', 'Capricorn', 'Cancer'],
      'Gemini': ['Libra', 'Aquarius', 'Aries'],
      'Cancer': ['Scorpio', 'Pisces', 'Taurus'],
      'Leo': ['Aries', 'Sagittarius', 'Gemini'],
      'Virgo': ['Taurus', 'Capricorn', 'Cancer'],
      'Libra': ['Gemini', 'Aquarius', 'Leo'],
      'Scorpio': ['Cancer', 'Pisces', 'Virgo'],
      'Sagittarius': ['Aries', 'Leo', 'Aquarius'],
      'Capricorn': ['Taurus', 'Virgo', 'Pisces'],
      'Aquarius': ['Gemini', 'Libra', 'Sagittarius'],
      'Pisces': ['Cancer', 'Scorpio', 'Capricorn']
    };
    
    return compatibilitySets[selectedSign] || [];
  }, [selectedSign]);

  // Prepare characteristics for display - use memoization for better performance
  const getCharacteristics = useMemo(() => {
    if (!selectedSign) return [];
    
    const characteristicSets: Record<string, string[]> = {
      'Aries': ['Energetic', 'Courageous', 'Passionate', 'Determined', 'Confident'],
      'Taurus': ['Patient', 'Reliable', 'Practical', 'Devoted', 'Responsible'],
      'Gemini': ['Adaptable', 'Outgoing', 'Curious', 'Quick-witted', 'Versatile'],
      'Cancer': ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
      'Leo': ['Creative', 'Generous', 'Warm-hearted', 'Humorous', 'Passionate'],
      'Virgo': ['Analytical', 'Hardworking', 'Practical', 'Diligent', 'Modest'],
      'Libra': ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative', 'Gracious'],
      'Scorpio': ['Resourceful', 'Powerful', 'Passionate', 'Determined', 'Exciting'],
      'Sagittarius': ['Generous', 'Idealistic', 'Optimistic', 'Enthusiastic', 'Philosophical'],
      'Capricorn': ['Responsible', 'Disciplined', 'Self-controlled', 'Independent', 'Persistent'],
      'Aquarius': ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
      'Pisces': ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise']
    };
    
    return characteristicSets[selectedSign] || [];
  }, [selectedSign]);

  // Prepare element data for display - use memoization for better performance
  const getElement = useMemo(() => {
    if (!selectedSign) return '';
    
    const sign = zodiacSigns.find(sign => sign.name === selectedSign);
    return sign ? sign.element : '';
  }, [selectedSign, zodiacSigns]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-8"
          style={{ 
            fontFamily: "'Press Start 2P', monospace",
            textShadow: '3px 3px 0 #4B0082, 6px 6px 0 rgba(0,0,0,0.2)'
          }}
        >
          Daily Rashifal
        </motion.h1>

        {/* Tab Navigation */}
        <div className="bg-gray-900 rounded-lg border-4 border-gray-800 overflow-hidden mb-8">
          <div className="grid grid-cols-2 divide-x-4 divide-gray-800">
            <button
              onClick={() => handleTabChange('quick')}
              className={`py-4 text-center transition-colors font-bold ${
                activeTab === 'quick' 
                  ? 'bg-purple-800 text-yellow-300' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Quick Lookup
            </button>
            <button
              onClick={() => handleTabChange('detailed')}
              className={`py-4 text-center transition-colors font-bold ${
                activeTab === 'detailed' 
                  ? 'bg-purple-800 text-yellow-300' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Birth Chart
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'quick' ? (
            <motion.div
              key="quick-lookup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {zodiacSigns.map((sign) => (
                  <motion.button
                    key={sign.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSignSelect(sign.name)}
                    className={`p-4 rounded-lg border-4 flex flex-col items-center transition-colors ${
                      selectedSign === sign.name
                        ? 'bg-purple-700 border-yellow-400'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-3xl mb-2" role="img" aria-label={sign.name}>
                      {sign.symbol}
                    </span>
                    <span 
                      className="font-bold text-white"
                      style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                    >
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
                  className="bg-gray-900 rounded-lg border-4 border-gray-800 overflow-hidden"
                >
                  <div className="bg-purple-900 p-4 flex items-center justify-between border-b-4 border-gray-800">
                    <div className="flex items-center">
                      <span 
                        className="text-4xl mr-3" 
                        role="img" 
                        aria-label={selectedSign}
                      >
                        {zodiacSigns.find(sign => sign.name === selectedSign)?.symbol}
                      </span>
                      <h2 
                        className="text-xl font-bold text-yellow-300"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
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
                        className={`py-2 text-center transition-colors text-xs ${
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
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePrediction}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
                        <h3 
                          className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
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
                      </div>
                      
                      {/* Lucky Colors */}
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
                        <h3 
                          className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
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
                                className="w-8 h-8 rounded-md mb-1 border-2 border-gray-700 pixelated"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="text-white text-xs">{color}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Lucky Numbers */}
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
                        <h3 
                          className="text-yellow-300 mb-3 pb-2 border-b-2 border-gray-700"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                        >
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
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detailed-chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {!showRashiResult ? (
                <BirthDetailsForm 
                  onSubmit={handleBirthDetailsSubmit}
                  isLoading={isLoading}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex justify-center mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowRashiResult(false)}
                      className="px-4 py-2 bg-gray-800 text-yellow-300 rounded-md border-2 border-gray-700"
                      style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                    >
                      « Back to Form
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {rashiResult && (
                      <>
                        <PixelArtRashiVisualizer
                          userRashi={rashiResult.mainRashi}
                          planetPositions={rashiResult.planetPositions}
                        />
                        
                        <RashiDetailCard 
                          details={{
                            mainRashi: rashiResult.mainRashi,
                            moonRashi: rashiResult.moonRashi,
                            ascendant: rashiResult.ascendantRashi,
                            characteristics: rashiResult.characteristics,
                            compatibility: rashiResult.compatibility,
                            luckyColors: rashiResult.luckyColors,
                            luckyNumbers: rashiResult.luckyNumbers
                          }}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Rashifal; 