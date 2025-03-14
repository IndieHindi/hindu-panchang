import React from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const RashiHelpSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <div className="mt-8 bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700"
      >
        <div className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-yellow-300 mr-2" />
          <span className="text-white font-medium" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
            How to Use This Chart
          </span>
        </div>
        <span className="text-yellow-300">{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 bg-gray-800 text-gray-300"
        >
          <div className="space-y-4">
            <p className="text-sm">
              This Nintendo-style pixel art visualization shows the positions of planets in different rashis.
              Hover over any rashi to see more details!
            </p>
            
            <div className="space-y-2">
              <h4 className="text-yellow-300 text-xs font-semibold">How to interpret your chart:</h4>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Hover over any rashi segment to highlight it</li>
                <li>Click on a rashi to select it and see which planets are positioned there</li>
                <li>Notice the unique pixel art representation for each planet and rashi</li>
                <li>Pay attention to your main rashi, moon rashi, and ascendant for a complete picture</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-yellow-300 text-xs font-semibold">Understanding the planets:</h4>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li><span className="text-yellow-400">Sun</span>: Represents ego, self-expression and leadership</li>
                <li><span className="text-blue-300">Moon</span>: Reflects emotions, intuition and inner self</li>
                <li><span className="text-green-400">Mercury</span>: Rules communication, logic and learning</li>
                <li><span className="text-pink-300">Venus</span>: Governs love, beauty and relationships</li>
                <li><span className="text-red-500">Mars</span>: Influences energy, courage and assertion</li>
                <li><span className="text-purple-400">Jupiter</span>: Expands knowledge, wisdom and prosperity</li>
                <li><span className="text-gray-400">Saturn</span>: Teaches discipline, responsibility and limitations</li>
                <li><span className="text-indigo-400">Rahu</span>: Represents desires and illusions (North Node)</li>
                <li><span className="text-teal-400">Ketu</span>: Signifies spirituality and detachment (South Node)</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg text-xs">
              <p className="text-yellow-300 font-medium mb-2">Tips for best results:</p>
              <p>For a more accurate birth chart, ensure your birth time and location are as precise as possible. Small differences can affect your ascendant and house placements.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RashiHelpSection; 