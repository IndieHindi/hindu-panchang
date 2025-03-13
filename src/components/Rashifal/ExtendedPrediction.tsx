import React from 'react';
import { ExtendedRashifalPrediction } from '../../types/panchang';

interface ExtendedPredictionProps {
  prediction: ExtendedRashifalPrediction;
}

export default function ExtendedPrediction({ prediction }: ExtendedPredictionProps) {
  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold pixel-text">
            {prediction.rashi} - {prediction.timeframe.charAt(0).toUpperCase() + prediction.timeframe.slice(1)} Prediction
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(prediction.prediction).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-medium text-lg pixel-text capitalize">{key}</h3>
              <p className="text-[#e0e0e0]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium pixel-text mb-4">Compatibility</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-[#4ecdc4]">Best Matches</h4>
              <p className="text-[#e0e0e0]">{prediction.compatibility.bestMatches.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium text-[#45b7ae]">Good Matches</h4>
              <p className="text-[#e0e0e0]">{prediction.compatibility.goodMatches.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium text-[#ff6b6b]">Avoid</h4>
              <p className="text-[#e0e0e0]">{prediction.compatibility.avoidMatches.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium pixel-text mb-4">Lucky Elements</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Colors</h4>
              <p className="text-[#e0e0e0]">{prediction.luckyElements.colors.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Numbers</h4>
              <p className="text-[#e0e0e0]">{prediction.luckyElements.numbers.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Days</h4>
              <p className="text-[#e0e0e0]">{prediction.luckyElements.days.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Gemstones</h4>
              <p className="text-[#e0e0e0]">{prediction.luckyElements.gemstones.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Direction</h4>
              <p className="text-[#e0e0e0]">{prediction.luckyElements.direction}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium pixel-text mb-4">Planetary Influence</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Ruling Planet</h4>
              <p className="text-[#e0e0e0]">{prediction.planetaryInfluence.ruling}</p>
            </div>
            <div>
              <h4 className="font-medium">Favorable Planets</h4>
              <p className="text-[#e0e0e0]">{prediction.planetaryInfluence.favorable.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Unfavorable Planets</h4>
              <p className="text-[#e0e0e0]">{prediction.planetaryInfluence.unfavorable.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium pixel-text mb-4">Characteristics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Personality Traits</h4>
              <ul className="list-disc list-inside text-[#e0e0e0]">
                {prediction.characteristics.personality.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Strengths</h4>
              <ul className="list-disc list-inside text-[#e0e0e0]">
                {prediction.characteristics.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Areas for Growth</h4>
              <ul className="list-disc list-inside text-[#e0e0e0]">
                {prediction.characteristics.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 