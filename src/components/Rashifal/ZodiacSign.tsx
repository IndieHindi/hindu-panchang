import React from 'react';
import { motion } from 'framer-motion';

interface ZodiacSignProps {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  selected?: boolean;
  onClick?: () => void;
}

const elementColors = {
  fire: 'from-red-500 to-orange-500',
  earth: 'from-green-500 to-emerald-500',
  water: 'from-blue-500 to-cyan-500',
  air: 'from-purple-500 to-indigo-500',
};

const elementAnimations = {
  fire: {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  earth: {
    animate: {
      y: [0, -5, 0],
      rotate: [0, 3, -3, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  water: {
    animate: {
      scale: [1, 1.05, 1],
      y: [0, -3, 0],
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  air: {
    animate: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function ZodiacSign({ name, symbol, element, selected, onClick }: ZodiacSignProps) {
  return (
    <motion.div
      className={`
        relative cursor-pointer rounded-xl p-6
        bg-gradient-to-br ${elementColors[element]}
        ${selected ? 'ring-4 ring-white ring-opacity-60' : ''}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...elementAnimations[element]}
    >
      <motion.div
        className="text-6xl mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {symbol}
      </motion.div>
      <motion.h3
        className="text-xl font-semibold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {name}
      </motion.h3>
    </motion.div>
  );
} 