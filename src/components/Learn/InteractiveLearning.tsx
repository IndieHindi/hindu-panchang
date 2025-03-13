import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoonIcon,
  SunIcon,
  StarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const topics = [
  {
    id: 'tithi',
    name: 'Tithi',
    icon: MoonIcon,
    description: 'Learn about lunar days and their significance',
    content: [
      {
        title: 'What is Tithi?',
        text: 'A Tithi is a lunar day, calculated based on the angular distance between the Sun and Moon. There are 30 Tithis in a lunar month.',
      },
      {
        title: 'Calculation',
        text: 'Each Tithi represents 12° of angular distance between the Sun and Moon. A complete lunar month consists of 360° of separation.',
      },
      {
        title: 'Significance',
        text: 'Tithis are important for determining auspicious times for various activities, festivals, and religious observances.',
      },
    ],
  },
  {
    id: 'nakshatra',
    name: 'Nakshatra',
    icon: StarIcon,
    description: 'Explore the 27 lunar mansions',
    content: [
      {
        title: 'What is Nakshatra?',
        text: 'Nakshatras are the 27 divisions of the ecliptic, each corresponding to the region of the sky that the Moon passes through during its monthly cycle.',
      },
      {
        title: 'Calculation',
        text: 'Each Nakshatra spans 13°20\' of the ecliptic. The Moon takes approximately one day to traverse each Nakshatra.',
      },
      {
        title: 'Significance',
        text: 'Nakshatras influence various aspects of life and are used to determine auspicious times for different activities.',
      },
    ],
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: SunIcon,
    description: 'Understand the yoga calculations',
    content: [
      {
        title: 'What is Yoga?',
        text: 'Yoga in Panchang refers to one of 27 divisions of the day, calculated based on the combined longitudinal angle between the Sun and Moon.',
      },
      {
        title: 'Calculation',
        text: 'Each Yoga is calculated by adding the longitude of the Sun and Moon and dividing by 13°20\'.',
      },
      {
        title: 'Significance',
        text: 'Different Yogas are considered auspicious or inauspicious for various activities.',
      },
    ],
  },
  {
    id: 'karana',
    name: 'Karana',
    icon: CalendarIcon,
    description: 'Learn about half-lunar days',
    content: [
      {
        title: 'What is Karana?',
        text: 'Karana is half of a Tithi. There are 11 Karanas that occur eight times in a lunar month, making a total of 60 Karanas.',
      },
      {
        title: 'Calculation',
        text: 'Each Karana represents 6° of angular distance between the Sun and Moon.',
      },
      {
        title: 'Significance',
        text: 'Karanas are used to determine the nature of activities that should be undertaken during different parts of the day.',
      },
    ],
  },
];

export default function InteractiveLearning() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Learn About Hindu Panchang
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Explore the fundamental concepts and calculations behind the Hindu almanac
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedTopic(topic)}
            className={`p-6 rounded-lg cursor-pointer transition-colors ${
              selectedTopic.id === topic.id
                ? 'bg-primary-50 dark:bg-primary-900 border-2 border-primary-500'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <topic.icon className="h-8 w-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{topic.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {topic.description}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTopic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            {selectedTopic.content.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 