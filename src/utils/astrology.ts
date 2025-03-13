import { BirthDetails } from '../types/panchang';

// Zodiac signs with their date ranges and characteristics
const zodiacData = {
  Mesh: {
    startDate: { month: 3, day: 21 },
    endDate: { month: 4, day: 19 },
    ruling: 'Mars',
    element: 'fire',
    quality: 'cardinal',
    favorable: ['Jupiter', 'Sun', 'Moon'],
    unfavorable: ['Saturn', 'Venus'],
    gemstones: ['Red Coral', 'Ruby'],
    colors: ['Red', 'Orange', 'White'],
    numbers: [1, 9],
    days: ['Tuesday', 'Sunday'],
    direction: 'East',
  },
  Vrishabha: {
    startDate: { month: 4, day: 20 },
    endDate: { month: 5, day: 20 },
    ruling: 'Venus',
    element: 'earth',
    quality: 'fixed',
    favorable: ['Mercury', 'Saturn'],
    unfavorable: ['Mars', 'Sun'],
    gemstones: ['Diamond', 'White Sapphire'],
    colors: ['Green', 'White', 'Pink'],
    numbers: [2, 6],
    days: ['Friday', 'Monday'],
    direction: 'South-East',
  },
  Mithuna: {
    startDate: { month: 5, day: 21 },
    endDate: { month: 6, day: 20 },
    ruling: 'Mercury',
    element: 'air',
    quality: 'mutable',
    favorable: ['Venus', 'Saturn'],
    unfavorable: ['Jupiter', 'Mars'],
    gemstones: ['Emerald', 'Peridot'],
    colors: ['Yellow', 'Green', 'Light Blue'],
    numbers: [3, 5],
    days: ['Wednesday', 'Sunday'],
    direction: 'West',
  },
  Karka: {
    startDate: { month: 6, day: 21 },
    endDate: { month: 7, day: 22 },
    ruling: 'Moon',
    element: 'water',
    quality: 'cardinal',
    favorable: ['Venus', 'Mars'],
    unfavorable: ['Saturn', 'Rahu'],
    gemstones: ['Pearl', 'Moonstone'],
    colors: ['White', 'Silver', 'Pale Yellow'],
    numbers: [2, 7],
    days: ['Monday', 'Thursday'],
    direction: 'North',
  },
  Simha: {
    startDate: { month: 7, day: 23 },
    endDate: { month: 8, day: 22 },
    ruling: 'Sun',
    element: 'fire',
    quality: 'fixed',
    favorable: ['Jupiter', 'Mars'],
    unfavorable: ['Saturn', 'Rahu'],
    gemstones: ['Ruby', 'Red Garnet'],
    colors: ['Gold', 'Orange', 'Red'],
    numbers: [1, 4],
    days: ['Sunday', 'Tuesday'],
    direction: 'East',
  },
  Kanya: {
    startDate: { month: 8, day: 23 },
    endDate: { month: 9, day: 22 },
    ruling: 'Mercury',
    element: 'earth',
    quality: 'mutable',
    favorable: ['Venus', 'Saturn'],
    unfavorable: ['Mars', 'Jupiter'],
    gemstones: ['Emerald', 'Green Tourmaline'],
    colors: ['Green', 'Brown', 'Grey'],
    numbers: [5, 3],
    days: ['Wednesday', 'Friday'],
    direction: 'South',
  },
  Tula: {
    startDate: { month: 9, day: 23 },
    endDate: { month: 10, day: 22 },
    ruling: 'Venus',
    element: 'air',
    quality: 'cardinal',
    favorable: ['Saturn', 'Mercury'],
    unfavorable: ['Sun', 'Mars'],
    gemstones: ['Diamond', 'Opal'],
    colors: ['White', 'Pink', 'Light Blue'],
    numbers: [6, 9],
    days: ['Friday', 'Wednesday'],
    direction: 'West',
  },
  Vrishchika: {
    startDate: { month: 10, day: 23 },
    endDate: { month: 11, day: 21 },
    ruling: 'Mars',
    element: 'water',
    quality: 'fixed',
    favorable: ['Jupiter', 'Moon'],
    unfavorable: ['Venus', 'Sun'],
    gemstones: ['Red Coral', 'Garnet'],
    colors: ['Dark Red', 'Maroon', 'Black'],
    numbers: [9, 8],
    days: ['Tuesday', 'Thursday'],
    direction: 'North',
  },
  Dhanu: {
    startDate: { month: 11, day: 22 },
    endDate: { month: 12, day: 21 },
    ruling: 'Jupiter',
    element: 'fire',
    quality: 'mutable',
    favorable: ['Sun', 'Moon'],
    unfavorable: ['Mercury', 'Venus'],
    gemstones: ['Yellow Sapphire', 'Topaz'],
    colors: ['Purple', 'Yellow', 'Red'],
    numbers: [3, 9],
    days: ['Thursday', 'Sunday'],
    direction: 'East',
  },
  Makara: {
    startDate: { month: 12, day: 22 },
    endDate: { month: 1, day: 19 },
    ruling: 'Saturn',
    element: 'earth',
    quality: 'cardinal',
    favorable: ['Venus', 'Mercury'],
    unfavorable: ['Sun', 'Moon'],
    gemstones: ['Blue Sapphire', 'Amethyst'],
    colors: ['Dark Blue', 'Black', 'Grey'],
    numbers: [8, 4],
    days: ['Saturday', 'Friday'],
    direction: 'South',
  },
  Kumbha: {
    startDate: { month: 1, day: 20 },
    endDate: { month: 2, day: 18 },
    ruling: 'Saturn',
    element: 'air',
    quality: 'fixed',
    favorable: ['Mercury', 'Venus'],
    unfavorable: ['Sun', 'Mars'],
    gemstones: ['Blue Sapphire', 'Lapis Lazuli'],
    colors: ['Electric Blue', 'Purple', 'Black'],
    numbers: [8, 5],
    days: ['Saturday', 'Wednesday'],
    direction: 'West',
  },
  Meena: {
    startDate: { month: 2, day: 19 },
    endDate: { month: 3, day: 20 },
    ruling: 'Jupiter',
    element: 'water',
    quality: 'mutable',
    favorable: ['Venus', 'Moon'],
    unfavorable: ['Mercury', 'Mars'],
    gemstones: ['Yellow Sapphire', 'Aquamarine'],
    colors: ['Sea Green', 'Purple', 'Pink'],
    numbers: [3, 7],
    days: ['Thursday', 'Monday'],
    direction: 'North',
  },
};

// Personality traits for each Rashi
const personalityTraits = {
  Mesh: {
    personality: [
      'Natural leader',
      'Energetic',
      'Courageous',
      'Enthusiastic',
      'Dynamic'
    ],
    strengths: [
      'Initiative',
      'Determination',
      'Optimism',
      'Confidence',
      'Leadership'
    ],
    weaknesses: [
      'Impatience',
      'Short temper',
      'Impulsiveness',
      'Aggression',
      'Restlessness'
    ]
  },
  Vrishabha: {
    personality: [
      'Patient',
      'Reliable',
      'Practical',
      'Devoted',
      'Stable'
    ],
    strengths: [
      'Determination',
      'Loyalty',
      'Dependability',
      'Persistence',
      'Artistic ability'
    ],
    weaknesses: [
      'Stubbornness',
      'Possessiveness',
      'Inflexibility',
      'Materialism',
      'Resistance to change'
    ]
  },
  Mithuna: {
    personality: [
      'Versatile',
      'Curious',
      'Adaptable',
      'Communicative',
      'Witty'
    ],
    strengths: [
      'Intelligence',
      'Adaptability',
      'Communication skills',
      'Quick learning',
      'Social skills'
    ],
    weaknesses: [
      'Inconsistency',
      'Nervousness',
      'Indecisiveness',
      'Superficiality',
      'Restlessness'
    ]
  },
  Karka: {
    personality: [
      'Nurturing',
      'Protective',
      'Intuitive',
      'Emotional',
      'Sympathetic'
    ],
    strengths: [
      'Emotional intelligence',
      'Creativity',
      'Loyalty',
      'Tenacity',
      'Care for others'
    ],
    weaknesses: [
      'Moodiness',
      'Oversensitivity',
      'Possessiveness',
      'Self-pity',
      'Dependency'
    ]
  },
  Simha: {
    personality: [
      'Confident',
      'Dramatic',
      'Creative',
      'Generous',
      'Charismatic'
    ],
    strengths: [
      'Leadership',
      'Creativity',
      'Confidence',
      'Loyalty',
      'Warmth'
    ],
    weaknesses: [
      'Arrogance',
      'Stubbornness',
      'Self-centeredness',
      'Dominance',
      'Pride'
    ]
  },
  Kanya: {
    personality: [
      'Analytical',
      'Practical',
      'Diligent',
      'Modest',
      'Helpful'
    ],
    strengths: [
      'Attention to detail',
      'Intelligence',
      'Reliability',
      'Organization',
      'Problem-solving'
    ],
    weaknesses: [
      'Criticism',
      'Perfectionism',
      'Worry',
      'Overthinking',
      'Shyness'
    ]
  },
  Tula: {
    personality: [
      'Diplomatic',
      'Graceful',
      'Fair-minded',
      'Social',
      'Idealistic'
    ],
    strengths: [
      'Diplomacy',
      'Charm',
      'Balance',
      'Cooperation',
      'Fairness'
    ],
    weaknesses: [
      'Indecisiveness',
      'Avoidance',
      'Self-pity',
      'Dependency',
      'Superficiality'
    ]
  },
  Vrishchika: {
    personality: [
      'Intense',
      'Passionate',
      'Resourceful',
      'Magnetic',
      'Power-oriented'
    ],
    strengths: [
      'Determination',
      'Intuition',
      'Passion',
      'Investigation',
      'Magnetism'
    ],
    weaknesses: [
      'Jealousy',
      'Resentment',
      'Manipulation',
      'Vindictiveness',
      'Obsession'
    ]
  },
  Dhanu: {
    personality: [
      'Optimistic',
      'Adventurous',
      'Philosophical',
      'Straightforward',
      'Enthusiastic'
    ],
    strengths: [
      'Optimism',
      'Honesty',
      'Adventure',
      'Vision',
      'Wisdom'
    ],
    weaknesses: [
      'Restlessness',
      'Overconfidence',
      'Carelessness',
      'Tactlessness',
      'Procrastination'
    ]
  },
  Makara: {
    personality: [
      'Responsible',
      'Disciplined',
      'Self-controlled',
      'Traditional',
      'Ambitious'
    ],
    strengths: [
      'Responsibility',
      'Discipline',
      'Ambition',
      'Patience',
      'Organization'
    ],
    weaknesses: [
      'Pessimism',
      'Rigidity',
      'Coldness',
      'Materialism',
      'Fear of failure'
    ]
  },
  Kumbha: {
    personality: [
      'Progressive',
      'Original',
      'Independent',
      'Humanitarian',
      'Intellectual'
    ],
    strengths: [
      'Innovation',
      'Originality',
      'Independence',
      'Vision',
      'Humanitarianism'
    ],
    weaknesses: [
      'Rebellion',
      'Unpredictability',
      'Detachment',
      'Stubbornness',
      'Eccentricity'
    ]
  },
  Meena: {
    personality: [
      'Compassionate',
      'Artistic',
      'Intuitive',
      'Gentle',
      'Musical'
    ],
    strengths: [
      'Compassion',
      'Intuition',
      'Artistic ability',
      'Adaptability',
      'Healing'
    ],
    weaknesses: [
      'Escapism',
      'Idealism',
      'Victimization',
      'Confusion',
      'Oversensitivity'
    ]
  }
};

// Compatibility between Rashis
const compatibilityMap = {
  Mesh: {
    bestMatches: ['Simha', 'Dhanu'],
    goodMatches: ['Mithuna', 'Kumbha'],
    avoidMatches: ['Karka', 'Tula']
  },
  Vrishabha: {
    bestMatches: ['Kanya', 'Makara'],
    goodMatches: ['Karka', 'Meena'],
    avoidMatches: ['Simha', 'Kumbha']
  },
  Mithuna: {
    bestMatches: ['Tula', 'Kumbha'],
    goodMatches: ['Mesh', 'Simha'],
    avoidMatches: ['Dhanu', 'Meena']
  },
  Karka: {
    bestMatches: ['Vrishchika', 'Meena'],
    goodMatches: ['Vrishabha', 'Kanya'],
    avoidMatches: ['Mesh', 'Makara']
  },
  Simha: {
    bestMatches: ['Mesh', 'Dhanu'],
    goodMatches: ['Mithuna', 'Tula'],
    avoidMatches: ['Vrishabha', 'Kumbha']
  },
  Kanya: {
    bestMatches: ['Vrishabha', 'Makara'],
    goodMatches: ['Karka', 'Vrishchika'],
    avoidMatches: ['Mithuna', 'Meena']
  },
  Tula: {
    bestMatches: ['Mithuna', 'Kumbha'],
    goodMatches: ['Simha', 'Dhanu'],
    avoidMatches: ['Mesh', 'Makara']
  },
  Vrishchika: {
    bestMatches: ['Karka', 'Meena'],
    goodMatches: ['Vrishabha', 'Kanya'],
    avoidMatches: ['Mithuna', 'Tula']
  },
  Dhanu: {
    bestMatches: ['Mesh', 'Simha'],
    goodMatches: ['Tula', 'Kumbha'],
    avoidMatches: ['Mithuna', 'Kanya']
  },
  Makara: {
    bestMatches: ['Vrishabha', 'Kanya'],
    goodMatches: ['Vrishchika', 'Meena'],
    avoidMatches: ['Karka', 'Tula']
  },
  Kumbha: {
    bestMatches: ['Mithuna', 'Tula'],
    goodMatches: ['Mesh', 'Dhanu'],
    avoidMatches: ['Vrishabha', 'Simha']
  },
  Meena: {
    bestMatches: ['Karka', 'Vrishchika'],
    goodMatches: ['Vrishabha', 'Makara'],
    avoidMatches: ['Mithuna', 'Dhanu']
  }
};

// Calculate Rashi based on birth date
export function calculateRashi(birthDate: Date): string {
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-based
  const day = birthDate.getDate();

  for (const [rashi, data] of Object.entries(zodiacData)) {
    const start = data.startDate;
    const end = data.endDate;

    if (
      (month === start.month && day >= start.day) ||
      (month === end.month && day <= end.day)
    ) {
      return rashi;
    }
  }

  return 'Mesh'; // Default to Mesh if no match found (should never happen)
}

// Calculate planetary positions (simplified version)
export function calculatePlanetaryPositions(birthDateTime: Date) {
  // In a real implementation, this would use astronomical calculations
  // For now, we'll return mock data
  return {
    sun: Math.floor(Math.random() * 12),
    moon: Math.floor(Math.random() * 12),
    mars: Math.floor(Math.random() * 12),
    mercury: Math.floor(Math.random() * 12),
    jupiter: Math.floor(Math.random() * 12),
    venus: Math.floor(Math.random() * 12),
    saturn: Math.floor(Math.random() * 12),
    rahu: Math.floor(Math.random() * 12),
    ketu: Math.floor(Math.random() * 12),
  };
}

// Generate personality traits based on Rashi
export function generatePersonalityTraits(rashi: string) {
  return personalityTraits[rashi as keyof typeof personalityTraits] || personalityTraits.Mesh;
}

// Calculate compatibility between signs
export function calculateCompatibility(rashi: string) {
  return compatibilityMap[rashi as keyof typeof compatibilityMap] || compatibilityMap.Mesh;
}

// Get zodiac data for a sign
export function getZodiacData(rashi: string) {
  return zodiacData[rashi as keyof typeof zodiacData] || zodiacData.Mesh;
}

// Generate predictions based on planetary positions and timeframe
export function generatePredictions(
  rashi: string,
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'
) {
  type PredictionType = {
    general: string;
    career: string;
    love: string;
    health: string;
    luck: string;
    finance: string;
    family: string;
    education: string;
  };

  const predictions: Record<typeof timeframe, PredictionType> = {
    daily: {
      general: `A ${['promising', 'challenging', 'balanced', 'energetic'][Math.floor(Math.random() * 4)]} day ahead.`,
      career: `Focus on ${['networking', 'planning', 'execution', 'learning'][Math.floor(Math.random() * 4)]} today.`,
      love: `Express your ${['feelings', 'creativity', 'desires', 'appreciation'][Math.floor(Math.random() * 4)]} freely.`,
      health: `Pay attention to your ${['physical', 'mental', 'emotional', 'spiritual'][Math.floor(Math.random() * 4)]} well-being.`,
      luck: `Lucky opportunities in ${['communication', 'travel', 'finances', 'relationships'][Math.floor(Math.random() * 4)]}.`,
      finance: `Good time for ${['saving', 'investing', 'planning', 'reviewing'][Math.floor(Math.random() * 4)]} finances.`,
      family: `Focus on ${['communication', 'harmony', 'understanding', 'activities'][Math.floor(Math.random() * 4)]} with family.`,
      education: `Excellent period for ${['learning', 'research', 'creativity', 'practice'][Math.floor(Math.random() * 4)]}.`,
    },
    weekly: {
      general: `A ${['transformative', 'productive', 'social', 'reflective'][Math.floor(Math.random() * 4)]} week ahead.`,
      career: `Focus on ${['long-term goals', 'team projects', 'skill development', 'networking'][Math.floor(Math.random() * 4)]} this week.`,
      love: `Time for ${['deepening bonds', 'new connections', 'self-discovery', 'healing'][Math.floor(Math.random() * 4)]} in relationships.`,
      health: `Maintain ${['regular exercise', 'balanced diet', 'stress management', 'rest'][Math.floor(Math.random() * 4)]}.`,
      luck: `Favorable opportunities through ${['social circles', 'work', 'travel', 'learning'][Math.floor(Math.random() * 4)]}.`,
      finance: `Week suitable for ${['investments', 'budgeting', 'new ventures', 'savings'][Math.floor(Math.random() * 4)]}.`,
      family: `Week brings ${['celebrations', 'important discussions', 'resolutions', 'harmony'][Math.floor(Math.random() * 4)]}.`,
      education: `Focus on ${['new skills', 'certifications', 'practical applications', 'research'][Math.floor(Math.random() * 4)]}.`,
    },
    monthly: {
      general: `A month of ${['growth', 'transformation', 'opportunities', 'stability'][Math.floor(Math.random() * 4)]}.`,
      career: `Professional ${['advancement', 'recognition', 'changes', 'learning'][Math.floor(Math.random() * 4)]} highlighted.`,
      love: `Relationships enter a phase of ${['deepening', 'clarity', 'healing', 'excitement'][Math.floor(Math.random() * 4)]}.`,
      health: `Focus on ${['lifestyle changes', 'mental health', 'physical fitness', 'holistic wellness'][Math.floor(Math.random() * 4)]}.`,
      luck: `Fortune favors ${['bold moves', 'careful planning', 'social connections', 'creative pursuits'][Math.floor(Math.random() * 4)]}.`,
      finance: `Month suitable for ${['long-term planning', 'investments', 'debt reduction', 'income growth'][Math.floor(Math.random() * 4)]}.`,
      family: `Family life brings ${['important events', 'deeper bonds', 'resolutions', 'positive changes'][Math.floor(Math.random() * 4)]}.`,
      education: `Great time for ${['major studies', 'skill enhancement', 'certifications', 'research'][Math.floor(Math.random() * 4)]}.`,
    },
    yearly: {
      general: `A year of ${['significant changes', 'steady progress', 'new beginnings', 'achievements'][Math.floor(Math.random() * 4)]}.`,
      career: `Career focus on ${['major transitions', 'leadership roles', 'skill mastery', 'entrepreneurship'][Math.floor(Math.random() * 4)]}.`,
      love: `Relationships will ${['deepen significantly', 'bring new joy', 'transform positively', 'reach milestones'][Math.floor(Math.random() * 4)]}.`,
      health: `Health requires attention to ${['lifestyle balance', 'preventive care', 'fitness goals', 'stress management'][Math.floor(Math.random() * 4)]}.`,
      luck: `Lucky opportunities through ${['travel', 'education', 'relationships', 'career moves'][Math.floor(Math.random() * 4)]}.`,
      finance: `Financial focus on ${['wealth building', 'major investments', 'property matters', 'business ventures'][Math.floor(Math.random() * 4)]}.`,
      family: `Family life brings ${['major celebrations', 'positive changes', 'stronger bonds', 'important decisions'][Math.floor(Math.random() * 4)]}.`,
      education: `Educational focus on ${['higher studies', 'specialization', 'skill mastery', 'teaching others'][Math.floor(Math.random() * 4)]}.`,
    },
  };

  return predictions[timeframe];
} 