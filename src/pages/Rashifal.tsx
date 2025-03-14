import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import PixelArtRashiVisualizer from '../components/Rashifal/PixelArtRashiVisualizer';
import RashiDetailCard from '../components/Rashifal/RashiDetailCard';
import rashiCalculationService, { RashiResult, BirthDetails } from '../services/RashiCalculationService';

/**
 * Rashifal Page
 * 
 * This page provides users with a personalized rashi (zodiac) visualization 
 * based on birth details.
 * 
 * @TODO: Implement actual astrological calculations with a proper API
 * @TODO: Add daily/weekly/monthly predictions from backend
 * @TODO: Add social sharing functionality
 * @TODO: Add personalized recommendations based on rashi
 */
const Rashifal: React.FC = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [showRashiResult, setShowRashiResult] = useState(false);
  const [rashiResult, setRashiResult] = useState<RashiResult | null>(null);

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
          Birth Chart Calculator
        </motion.h1>

        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Rashifal; 