import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RashiResult } from '../../services/RashiCalculationService';

/**
 * Type definitions for zodiac signs with their properties
 */
interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

/**
 * Interface for rashi details to display in the card
 */
export interface RashiDetails {
  mainRashi: string;
  moonRashi?: string;
  ascendant?: string;
  characteristics: string[];
  compatibility?: string[];
  luckyColors?: string[];
  luckyNumbers?: number[];
}

interface RashiDetailCardProps {
  details: RashiDetails;
}

// Constants for zodiac data
const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  'Aries': { name: 'Aries', symbol: '♈', element: 'fire' },
  'Taurus': { name: 'Taurus', symbol: '♉', element: 'earth' },
  'Gemini': { name: 'Gemini', symbol: '♊', element: 'air' },
  'Cancer': { name: 'Cancer', symbol: '♋', element: 'water' },
  'Leo': { name: 'Leo', symbol: '♌', element: 'fire' },
  'Virgo': { name: 'Virgo', symbol: '♍', element: 'earth' },
  'Libra': { name: 'Libra', symbol: '♎', element: 'air' },
  'Scorpio': { name: 'Scorpio', symbol: '♏', element: 'water' },
  'Sagittarius': { name: 'Sagittarius', symbol: '♐', element: 'fire' },
  'Capricorn': { name: 'Capricorn', symbol: '♑', element: 'earth' },
  'Aquarius': { name: 'Aquarius', symbol: '♒', element: 'air' },
  'Pisces': { name: 'Pisces', symbol: '♓', element: 'water' }
};

/**
 * RashiDetailCard Component
 * 
 * A pixel-art styled card that displays detailed information about a user's rashi (zodiac sign)
 * including characteristics, compatibility, and lucky attributes.
 * 
 * @param details - RashiDetails object containing information to display
 * 
 * @TODO: Add horoscope predictions for the day/week/month
 * @TODO: Add planetary positions affecting the rashi
 * @TODO: Implement proper translations for multi-language support
 */
const RashiDetailCard: React.FC<RashiDetailCardProps> = ({ details }) => {
  // Get zodiac symbol for a given sign name
  const getZodiacSymbol = (rashiName: string): string => {
    return ZODIAC_SIGNS[rashiName]?.symbol || '?';
  };
  
  // Get element color based on the zodiac element
  const getElementColor = (rashiName: string): string => {
    const element = ZODIAC_SIGNS[rashiName]?.element;
    
    // Return appropriate color based on element
    switch (element) {
      case 'fire': return '#FF4500';
      case 'earth': return '#8B4513';
      case 'air': return '#87CEEB';
      case 'water': return '#1E90FF';
      default: return '#FFFFFF';
    }
  };
  
  // Get emoji for element
  const getElementEmoji = (rashiName: string): string => {
    const element = ZODIAC_SIGNS[rashiName]?.element;
    
    switch (element) {
      case 'fire': return '🔥';
      case 'earth': return '🌍';
      case 'air': return '💨';
      case 'water': return '💧';
      default: return '✨';
    }
  };

  // Memoize main rashi data to avoid recalculations
  const mainRashiData = useMemo(() => {
    const symbol = getZodiacSymbol(details.mainRashi);
    const color = getElementColor(details.mainRashi);
    const emoji = getElementEmoji(details.mainRashi);
    
    return { symbol, color, emoji };
  }, [details.mainRashi]);
  
  // Memoize moon rashi data
  const moonRashiData = useMemo(() => {
    if (!details.moonRashi) return null;
    
    const symbol = getZodiacSymbol(details.moonRashi);
    const color = getElementColor(details.moonRashi);
    const emoji = getElementEmoji(details.moonRashi);
    
    return { symbol, color, emoji };
  }, [details.moonRashi]);
  
  // Memoize ascendant data
  const ascendantData = useMemo(() => {
    if (!details.ascendant) return null;
    
    const symbol = getZodiacSymbol(details.ascendant);
    const color = getElementColor(details.ascendant);
    const emoji = getElementEmoji(details.ascendant);
    
    return { symbol, color, emoji };
  }, [details.ascendant]);

  // Animation variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div 
        className="rounded-lg overflow-hidden border-4 border-gray-800 bg-gray-900 pixel-card" 
        style={{ 
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        {/* Header section */}
        <div 
          className="p-4 text-center border-b-4 border-gray-800" 
          style={{ 
            backgroundColor: mainRashiData.color,
            color: '#FFFFFF',
            textShadow: '2px 2px 0 #000'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl"
            >
              {mainRashiData.symbol}
            </motion.span>
            <h2 className="text-xl font-bold tracking-wide">
              {details.mainRashi}
            </h2>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 0, 10, 0] }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl"
            >
              {mainRashiData.symbol}
            </motion.span>
          </div>
          <div className="flex justify-center mt-2 opacity-90">
            <span>{mainRashiData.emoji} Element: {ZODIAC_SIGNS[details.mainRashi]?.element.toUpperCase()} {mainRashiData.emoji}</span>
          </div>
        </div>
        
        {/* Details section */}
        <div className="p-5 text-white space-y-5">
          {/* Secondary Rashi Info */}
          {(details.moonRashi || details.ascendant) && (
            <div className="mb-4 px-3 py-2 rounded-md bg-gray-800 border-2 border-gray-700">
              <h3 className="text-sm text-yellow-300 mb-2">CELESTIAL POSITIONS</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                {details.moonRashi && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{moonRashiData?.symbol}</span>
                    <div>
                      <div className="text-blue-300">Moon Sign</div>
                      <div>{details.moonRashi}</div>
                    </div>
                  </div>
                )}
                
                {details.ascendant && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{ascendantData?.symbol}</span>
                    <div>
                      <div className="text-purple-300">Ascendant</div>
                      <div>{details.ascendant}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Characteristics */}
          <div>
            <h3 className="text-sm text-yellow-300 mb-3">CHARACTERISTICS</h3>
            <div className="pl-2 space-y-3">
              {details.characteristics.map((trait, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="text-lime-400">✧</span>
                  <span>{trait}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Compatibility */}
          {details.compatibility && details.compatibility.length > 0 && (
            <div>
              <h3 className="text-sm text-yellow-300 mb-3">COMPATIBILITY</h3>
              <div className="flex flex-wrap gap-2">
                {details.compatibility.map((sign, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                    className="px-3 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{ 
                      backgroundColor: getElementColor(sign),
                      color: '#FFFFFF',
                      textShadow: '1px 1px 0 #000'
                    }}
                  >
                    <span>{getZodiacSymbol(sign)}</span>
                    <span>{sign}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Lucky attributes */}
          <div className="grid grid-cols-2 gap-4">
            {/* Lucky colors */}
            {details.luckyColors && details.luckyColors.length > 0 && (
              <div>
                <h3 className="text-sm text-yellow-300 mb-2">LUCKY COLORS</h3>
                <div className="flex flex-wrap gap-2">
                  {details.luckyColors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="w-6 h-6 rounded-sm border-2 border-gray-700"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Lucky numbers */}
            {details.luckyNumbers && details.luckyNumbers.length > 0 && (
              <div>
                <h3 className="text-sm text-yellow-300 mb-2">LUCKY NUMBERS</h3>
                <div className="flex flex-wrap gap-2">
                  {details.luckyNumbers.map((number, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-sm"
                      style={{ 
                        backgroundColor: '#4B0082',
                        color: '#FFD700',
                        border: '2px solid #6A0DAD',
                        textShadow: '1px 1px 0 #000'
                      }}
                    >
                      {number}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(RashiDetailCard); 