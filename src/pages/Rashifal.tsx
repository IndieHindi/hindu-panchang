import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ZodiacSign from '../components/Rashifal/ZodiacSign';
import { RashifalPrediction } from '../types/panchang';

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
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const { data: prediction, isLoading } = useQuery<RashifalPrediction>({
    queryKey: ['rashifal', selectedSign],
    queryFn: async () => {
      // TODO: Implement actual API call
      return {
        rashi: selectedSign || '',
        prediction: {
          general: 'A favorable day for new beginnings.',
          career: 'Professional growth opportunities await.',
          love: 'Harmony in relationships prevails.',
          health: 'Focus on mental wellness.',
          luck: 'Lucky numbers align in your favor.',
        },
        compatibility: ['Simha', 'Dhanu'],
        luckyColor: 'Red',
        luckyNumber: 9,
      };
    },
    enabled: !!selectedSign,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Rashifal</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select your zodiac sign to view your daily prediction.
        </p>
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

      {selectedSign && prediction && (
        <div className="card space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">
              {zodiacSigns.find(s => s.name === selectedSign)?.symbol}
            </span>
            <h2 className="text-2xl font-semibold">{selectedSign} Prediction</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">General</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {prediction.prediction.general}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Career</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {prediction.prediction.career}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Love</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {prediction.prediction.love}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Health</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {prediction.prediction.health}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium">Lucky Color</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {prediction.luckyColor}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Lucky Number</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {prediction.luckyNumber}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Compatible With</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {prediction.compatibility.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
} 