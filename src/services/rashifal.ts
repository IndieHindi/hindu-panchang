import { BirthDetails, ExtendedRashifalPrediction } from '../types/panchang';
import {
  calculateRashi,
  calculatePlanetaryPositions,
  generatePersonalityTraits,
  calculateCompatibility,
  getZodiacData,
  generatePredictions,
} from '../utils/astrology';

export async function getRashifalPrediction(
  birthDetails: BirthDetails,
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<ExtendedRashifalPrediction> {
  // Calculate Rashi based on birth date
  const rashi = calculateRashi(birthDetails.dateTime);

  // Get zodiac data
  const zodiacData = getZodiacData(rashi);

  // Calculate planetary positions
  const planetaryPositions = calculatePlanetaryPositions(birthDetails.dateTime);

  // Generate predictions
  const predictions = generatePredictions(rashi, timeframe);

  // Get personality traits
  const traits = generatePersonalityTraits(rashi);

  // Calculate compatibility
  const compatibility = calculateCompatibility(rashi);

  // Combine all data into the final prediction
  return {
    rashi,
    timeframe,
    prediction: predictions,
    compatibility,
    luckyElements: {
      colors: zodiacData.colors,
      numbers: zodiacData.numbers,
      days: zodiacData.days,
      gemstones: zodiacData.gemstones,
      direction: zodiacData.direction,
    },
    planetaryInfluence: {
      ruling: zodiacData.ruling,
      favorable: zodiacData.favorable,
      unfavorable: zodiacData.unfavorable,
    },
    characteristics: traits,
  };
} 