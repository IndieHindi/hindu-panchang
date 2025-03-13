import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketLaunchIcon, SparklesIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import InteractiveTimeline from '../components/Visualization/InteractiveTimeline';
import PixelArtRashiVisualizer from '../components/Rashifal/PixelArtRashiVisualizer';

const tabs = [
  {
    id: 'timeline',
    name: 'Interactive Timeline',
    icon: ClockIcon,
    description: 'Navigate through time to see how Tithis, Nakshatras, and other elements align',
  },
  {
    id: 'rashi',
    name: 'Rashi Visualization',
    icon: StarIcon,
    description: 'Explore the positions of planets in rashi chart with pixel art style',
  },
  {
    id: 'celestial',
    name: '3D Celestial Movements',
    icon: SparklesIcon,
    description: 'Watch the dance of celestial bodies and understand their influence on the Panchang',
    comingSoon: true,
  },
];

// Sample planetary positions for demonstration
const samplePlanetPositions = [
  { planet: 'Sun', rashi: 'Mesh', degree: 15 },
  { planet: 'Moon', rashi: 'Vrishabha', degree: 10 },
  { planet: 'Mercury', rashi: 'Mithuna', degree: 5 },
  { planet: 'Venus', rashi: 'Karka', degree: 20 },
  { planet: 'Mars', rashi: 'Simha', degree: 25 },
  { planet: 'Jupiter', rashi: 'Dhanu', degree: 12 },
  { planet: 'Saturn', rashi: 'Makara', degree: 8 },
  { planet: 'Rahu', rashi: 'Kumbha', degree: 3 },
  { planet: 'Ketu', rashi: 'Meena', degree: 3 },
];

export default function Visualization() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white"
        >
          Interactive Visualization
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-400"
        >
          Explore the Hindu Panchang through interactive visualizations
        </motion.p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${tab.comingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <tab.icon
                className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${
                    activeTab === tab.id
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }
                `}
                aria-hidden="true"
              />
              <span>{tab.name}</span>
              {tab.comingSoon && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Coming Soon
                </span>
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <InteractiveTimeline />
          </motion.div>
        ) : activeTab === 'rashi' ? (
          <motion.div
            key="rashi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <div className="max-w-lg mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Rashi Positions Visualizer
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This Nintendo-style pixel art visualization shows the positions of planets in different rashis.
                Hover over any rashi to see more details!
              </p>
            </div>
            
            <div className="card p-8 max-w-3xl">
              <PixelArtRashiVisualizer planetPositions={samplePlanetPositions} />
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">How to use this visualization:</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Hover over any rashi segment to highlight it</li>
                  <li>Click on a rashi to select it and see which planets are positioned there</li>
                  <li>Notice the unique pixel art representation for each planet and rashi</li>
                  <li>For a personalized rashi chart, visit the Rashifal section and enter your birth details</li>
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celestial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <RocketLaunchIcon className="h-24 w-24 text-primary-600 mx-auto" />
            </motion.div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              3D Celestial Movements Coming Soon
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We're working on an immersive 3D visualization of celestial movements.
              Stay tuned for updates!
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-md">
                <span className="mr-2">🎨</span>
                Coming in Summer 2024
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 