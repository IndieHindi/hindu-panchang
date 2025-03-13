import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ZodiacSign from '../components/Rashifal/ZodiacSign';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import ExtendedPrediction from '../components/Rashifal/ExtendedPrediction';
import CelestialVisualization from '../components/CelestialVisualization';
import { BirthDetails, ExtendedRashifalPrediction } from '../types/panchang';
import { getRashifalPrediction } from '../services/rashifal';
import { calculateRashi, calculatePlanetaryPositions } from '../utils/astrology';

const zodiacSigns = [
  { name: 'Mesh', symbol: '♈', element: 'fire' as const },
  { name: 'Vrishabha', symbol: '♉', element: 'earth' as const },
  { name: 'Mithuna', symbol: '♊', element: 'air' as const },
  { name: 'Karka', symbol: '♋', element: 'water' as const },
  { name: 'Simha', symbol: '♌', element: 'fire' as const },
  { name: 'Kanya', symbol: '♍', element: 'earth' as const },
  { name: 'Tula', symbol: '♎', element: 'air' as const },
  { name: 'Vrishchika', symbol: '♏', element: 'water' as const },
  { name: 'Dhanu', symbol: '♐', element: 'fire' as const },
  { name: 'Makara', symbol: '♑', element: 'earth' as const },
  { name: 'Kumbha', symbol: '♒', element: 'air' as const },
  { name: 'Meena', symbol: '♓', element: 'water' as const },
];

export default function Rashifal() {
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // Calculate Rashi based on birth details
  const calculatedRashi = birthDetails ? calculateRashi(birthDetails.dateTime) : null;
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  // Calculate planetary positions
  const planetaryPositions = birthDetails ? calculatePlanetaryPositions(birthDetails.dateTime) : undefined;

  // Get prediction based on birth details and selected timeframe
  const { data: prediction, isLoading } = useQuery<ExtendedRashifalPrediction>({
    queryKey: ['rashifal', selectedSign || calculatedRashi, timeframe, birthDetails],
    queryFn: () => {
      if (!birthDetails) throw new Error('Birth details required');
      return getRashifalPrediction(birthDetails, timeframe);
    },
    enabled: !!birthDetails && !!(selectedSign || calculatedRashi),
  });

  const handleBirthDetails = (details: BirthDetails) => {
    setBirthDetails(details);
    // Automatically set the calculated Rashi
    const rashi = calculateRashi(details.dateTime);
    setSelectedSign(rashi);
  };

  return (
    <div className="space-y-8 animate-float">
      <div>
        <h1 className="text-3xl font-bold mb-4 pixel-text">Rashifal</h1>
        <p className="text-[#e0e0e0]">
          Discover your detailed astrological prediction based on your birth details and zodiac sign.
        </p>
      </div>

      {!birthDetails ? (
        <BirthDetailsForm onSubmit={handleBirthDetails} />
      ) : (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium pixel-text">Your Rashi</h2>
                {calculatedRashi && (
                  <p className="text-[#e0e0e0] mt-2">
                    Based on your birth details, your Rashi is{' '}
                    <span className="text-[#ff6b6b]">{calculatedRashi}</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="timeframe" className="block text-sm font-medium pixel-text">
                  Timeframe
                </label>
                <select
                  id="timeframe"
                  className="w-full pixel-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {zodiacSigns.map((sign) => (
                <ZodiacSign
                  key={sign.name}
                  name={sign.name}
                  symbol={sign.symbol}
                  element={sign.element}
                  selected={selectedSign === sign.name}
                  onClick={() => setSelectedSign(sign.name)}
                />
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-medium pixel-text mb-4">Celestial Movements</h2>
            <CelestialVisualization
              selectedSign={selectedSign || calculatedRashi || undefined}
              planetaryPositions={planetaryPositions}
            />
          </div>

          {prediction && (
            <ExtendedPrediction prediction={prediction} />
          )}
        </>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b6b]"></div>
        </div>
      )}
    </div>
  );
} 