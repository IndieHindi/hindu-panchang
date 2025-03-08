import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import {
  BookOpenIcon,
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
  const [activeContentIndex, setActiveContentIndex] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Learn Panchang</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the fundamental concepts of Hindu Panchang and their significance.
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 overflow-x-auto pb-4">
          {topics.map((topic) => (
            <Tab
              key={topic.id}
              className={({ selected }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg
                ${selected
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }
              `}
              onClick={() => {
                setSelectedTopic(topic);
                setActiveContentIndex(0);
              }}
            >
              <topic.icon className="h-5 w-5" />
              <span>{topic.name}</span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {topics.map((topic) => (
            <Tab.Panel
              key={topic.id}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${topic.id}-${activeContentIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="card"
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        {topic.content[activeContentIndex].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {topic.content[activeContentIndex].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between">
                    <button
                      className="btn btn-secondary"
                      disabled={activeContentIndex === 0}
                      onClick={() => setActiveContentIndex(i => i - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={activeContentIndex === topic.content.length - 1}
                      onClick={() => setActiveContentIndex(i => i + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="card bg-gray-50 dark:bg-gray-800/50">
                  {/* TODO: Add interactive visualizations */}
                  <div className="text-center py-12 text-gray-500">
                    Interactive visualization coming soon...
                  </div>
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 