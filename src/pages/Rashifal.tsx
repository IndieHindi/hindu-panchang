import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import PixelArtRashiVisualizer from '../components/Rashifal/PixelArtRashiVisualizer';
import RashiDetailCard from '../components/Rashifal/RashiDetailCard';
import RashiHelpSection from '../components/Rashifal/RashiHelpSection';
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
          <StarIcon className="h-8 w-8 text-primary-600" />
          Birth Chart Calculator
        </motion.h1>
        
        {!showRashiResult && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your birth details to generate your personalized birth chart
            </p>
          </div>
        )}
      </div>

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
            className="space-y-6"
          >
            <div className="flex justify-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRashiResult(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
              >
                <span>« Back to Form</span>
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {rashiResult && (
                <>
                  <div className="card hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-primary-600" />
                      Birth Chart Visualization
                    </h2>
                    <PixelArtRashiVisualizer
                      userRashi={rashiResult.mainRashi}
                      planetPositions={rashiResult.planetPositions}
                    />
                  </div>
                  
                  <div className="card hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-primary-600" />
                      Your Rashi Details
                    </h2>
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
                  </div>
                </>
              )}
            </div>
            
            {/* Add How to Use section */}
            <RashiHelpSection />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Rashifal; 