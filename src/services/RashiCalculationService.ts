/**
 * Custom error class for rashi calculation related errors
 */
export class RashiCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RashiCalculationError';
  }
}

/**
 * Interface representing birth details needed for calculations
 */
export interface BirthDetails {
  date: Date;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
}

/**
 * Interface representing a planetary position
 */
export interface PlanetaryPosition {
  planet: string;
  rashi: string;
  degree: number;
  retrograde: boolean;
}

/**
 * Type for zodiac element
 */
export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

/**
 * Interface representing the result of a rashi calculation
 */
export interface RashiResult {
  mainRashi: string;
  moonRashi: string;
  ascendantRashi: string;
  characteristics: string[];
  element: ZodiacElement;
  ruling: {
    planet: string;
    deity: string;
  };
  compatibility: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  planetPositions: PlanetaryPosition[];
}

/**
 * Service for calculating rashi (zodiac sign) and related astrological data
 * based on birth details.
 * 
 * @TODO: Implement actual astronomical calculations using a proper astrological library
 * @TODO: Add support for Dasha calculations
 * @TODO: Implement Nakshatra calculations
 * @TODO: Add support for more detailed predictions
 * @TODO: Integrate with actual ephemeris data for accurate planetary positions
 */
export class RashiCalculationService {
  private static instance: RashiCalculationService;
  
  // Maps of zodiac signs to characteristics
  private readonly rashiCharacteristics: Record<string, string[]> = {
    'Aries': ['Energetic', 'Courageous', 'Passionate', 'Determined', 'Confident'],
    'Taurus': ['Patient', 'Reliable', 'Practical', 'Devoted', 'Responsible'],
    'Gemini': ['Adaptable', 'Outgoing', 'Curious', 'Quick-witted', 'Versatile'],
    'Cancer': ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
    'Leo': ['Creative', 'Generous', 'Warm-hearted', 'Humorous', 'Passionate'],
    'Virgo': ['Analytical', 'Hardworking', 'Practical', 'Diligent', 'Modest'],
    'Libra': ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative', 'Gracious'],
    'Scorpio': ['Resourceful', 'Powerful', 'Passionate', 'Determined', 'Exciting'],
    'Sagittarius': ['Generous', 'Idealistic', 'Optimistic', 'Enthusiastic', 'Philosophical'],
    'Capricorn': ['Responsible', 'Disciplined', 'Self-controlled', 'Independent', 'Persistent'],
    'Aquarius': ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
    'Pisces': ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise']
  };
  
  // Maps of zodiac signs to elements
  private readonly rashiElements: Record<string, ZodiacElement> = {
    'Aries': 'fire',
    'Taurus': 'earth',
    'Gemini': 'air',
    'Cancer': 'water',
    'Leo': 'fire',
    'Virgo': 'earth',
    'Libra': 'air',
    'Scorpio': 'water',
    'Sagittarius': 'fire',
    'Capricorn': 'earth',
    'Aquarius': 'air',
    'Pisces': 'water'
  };
  
  // Maps of zodiac signs to ruling planets and deities
  private readonly rashiRulers: Record<string, { planet: string; deity: string }> = {
    'Aries': { planet: 'Mars', deity: 'Kuja' },
    'Taurus': { planet: 'Venus', deity: 'Shukra' },
    'Gemini': { planet: 'Mercury', deity: 'Budha' },
    'Cancer': { planet: 'Moon', deity: 'Chandra' },
    'Leo': { planet: 'Sun', deity: 'Surya' },
    'Virgo': { planet: 'Mercury', deity: 'Budha' },
    'Libra': { planet: 'Venus', deity: 'Shukra' },
    'Scorpio': { planet: 'Mars/Pluto', deity: 'Kuja' },
    'Sagittarius': { planet: 'Jupiter', deity: 'Guru' },
    'Capricorn': { planet: 'Saturn', deity: 'Shani' },
    'Aquarius': { planet: 'Saturn/Uranus', deity: 'Shani' },
    'Pisces': { planet: 'Jupiter/Neptune', deity: 'Guru' }
  };
  
  // Maps of zodiac signs to compatible signs
  private readonly rashiCompatibility: Record<string, string[]> = {
    'Aries': ['Leo', 'Sagittarius', 'Gemini'],
    'Taurus': ['Virgo', 'Capricorn', 'Cancer'],
    'Gemini': ['Libra', 'Aquarius', 'Aries'],
    'Cancer': ['Scorpio', 'Pisces', 'Taurus'],
    'Leo': ['Aries', 'Sagittarius', 'Gemini'],
    'Virgo': ['Taurus', 'Capricorn', 'Cancer'],
    'Libra': ['Gemini', 'Aquarius', 'Leo'],
    'Scorpio': ['Cancer', 'Pisces', 'Virgo'],
    'Sagittarius': ['Aries', 'Leo', 'Aquarius'],
    'Capricorn': ['Taurus', 'Virgo', 'Pisces'],
    'Aquarius': ['Gemini', 'Libra', 'Sagittarius'],
    'Pisces': ['Cancer', 'Scorpio', 'Capricorn']
  };
  
  // Maps of zodiac signs to lucky colors
  private readonly rashiLuckyColors: Record<string, string[]> = {
    'Aries': ['Red', 'White', 'Cream'],
    'Taurus': ['Green', 'Pink', 'Blue'],
    'Gemini': ['Yellow', 'Green', 'Light Blue'],
    'Cancer': ['Silver', 'White', 'Cream'],
    'Leo': ['Gold', 'Orange', 'Red'],
    'Virgo': ['Green', 'White', 'Gray'],
    'Libra': ['Pink', 'Blue', 'White'],
    'Scorpio': ['Red', 'Maroon', 'Black'],
    'Sagittarius': ['Purple', 'Blue', 'Plum'],
    'Capricorn': ['Brown', 'Gray', 'Black'],
    'Aquarius': ['Blue', 'Electric Blue', 'Silver'],
    'Pisces': ['Sea Green', 'Lavender', 'Purple']
  };
  
  // Private constructor to enforce singleton
  private constructor() {}
  
  /**
   * Gets the singleton instance of RashiCalculationService
   * @returns The singleton instance
   */
  public static getInstance(): RashiCalculationService {
    if (!RashiCalculationService.instance) {
      RashiCalculationService.instance = new RashiCalculationService();
    }
    return RashiCalculationService.instance;
  }
  
  /**
   * Calculates rashi (zodiac sign) and related information based on birth details
   * 
   * @param birthDetails - User's birth details including date, time, and location
   * @returns A promise resolving to RashiResult containing zodiac information
   * @throws RashiCalculationError if input data is invalid or calculation fails
   */
  public async calculateRashi(birthDetails: BirthDetails): Promise<RashiResult> {
    try {
      // Validate input
      this.validateBirthDetails(birthDetails);
      
      // Simulate API/calculation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would use actual astrological calculations
      // Currently using simplified calculation for demo purposes
      
      // Get moon rashi based on birth date
      const moonRashi = this.calculateMoonRashi(birthDetails.date);
      
      // Calculate ascendant based on birth time and location
      const ascendantRashi = this.calculateAscendant(
        birthDetails.date,
        birthDetails.time,
        birthDetails.latitude,
        birthDetails.longitude
      );
      
      // Generate planetary positions
      const planetPositions = this.generatePlanetaryPositions(birthDetails);
      
      // Lucky numbers (seeded random for consistency based on birth details)
      const randomSeed = birthDetails.date.getTime() + birthDetails.latitude + birthDetails.longitude;
      const luckyNumbers = this.generateLuckyNumbers(moonRashi, randomSeed);
      
      return {
        mainRashi: moonRashi,
        moonRashi,
        ascendantRashi,
        characteristics: this.rashiCharacteristics[moonRashi] || [],
        element: this.rashiElements[moonRashi] || 'fire', // Default to fire if not found
        ruling: this.rashiRulers[moonRashi] || { planet: 'Unknown', deity: 'Unknown' },
        compatibility: this.rashiCompatibility[moonRashi] || [],
        luckyColors: this.rashiLuckyColors[moonRashi] || [],
        luckyNumbers,
        planetPositions
      };
    } catch (error) {
      if (error instanceof RashiCalculationError) {
        throw error;
      }
      throw new RashiCalculationError(`Failed to calculate rashi: ${(error as Error).message}`);
    }
  }
  
  /**
   * Validates birth details for required fields and valid values
   * 
   * @param details - Birth details to validate
   * @throws RashiCalculationError if validation fails
   */
  private validateBirthDetails(details: BirthDetails): void {
    if (!details.date) {
      throw new RashiCalculationError('Birth date is required');
    }
    
    if (details.date > new Date()) {
      throw new RashiCalculationError('Birth date cannot be in the future');
    }
    
    if (!details.time) {
      throw new RashiCalculationError('Birth time is required');
    }
    
    if (details.latitude < -90 || details.latitude > 90) {
      throw new RashiCalculationError('Latitude must be between -90 and 90 degrees');
    }
    
    if (details.longitude < -180 || details.longitude > 180) {
      throw new RashiCalculationError('Longitude must be between -180 and 180 degrees');
    }
    
    if (!details.location.trim()) {
      throw new RashiCalculationError('Location name is required');
    }
  }
  
  /**
   * Calculates moon sign based on birth date
   * 
   * @param birthDate - Date of birth
   * @returns The moon sign (rashi)
   * 
   * @TODO: Replace with actual astronomical calculations
   * This is a simplified calculation for demo purposes.
   * Real calculations would use ephemeris data and proper astronomical formulas.
   */
  private calculateMoonRashi(birthDate: Date): string {
    // This is a simplified calculation - in a real app, we would use
    // proper astronomical calculations based on moon's position at birth time
    
    const baseDate = new Date(birthDate.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((birthDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // Map day of year to rashi - this is very simplified and not astrologically accurate
    const rashiIndex = (dayOfYear % 12);
    
    const rashis = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio', 
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    return rashis[rashiIndex];
  }
  
  /**
   * Calculates ascendant sign based on birth date, time, and location
   * 
   * @param date - Date of birth
   * @param time - Time of birth
   * @param latitude - Birth latitude
   * @param longitude - Birth longitude
   * @returns The ascendant sign (rashi)
   * 
   * @TODO: Replace with actual astronomical calculations
   * This is a simplified calculation for demo purposes.
   */
  private calculateAscendant(date: Date, time: string, latitude: number, longitude: number): string {
    // This is a simplified calculation - in a real app, we would use
    // proper astronomical calculations based on the exact time and location
    
    // Extract hour from time string (format: "HH:MM")
    const hour = parseInt(time.split(':')[0], 10);
    
    // Use hour of birth to determine ascendant - very simplified approach
    // Real calculations would consider exact time, date, and location
    const rashis = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio', 
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    // Calculate a consistent but semi-random index based on all parameters
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
    const latFactor = Math.abs(Math.floor(latitude)) % 12;
    const longFactor = Math.abs(Math.floor(longitude)) % 12;
    
    // Combine factors for a consistent but varied result
    const index = (hour + dayOfYear + latFactor + longFactor) % 12;
    
    return rashis[index];
  }
  
  /**
   * Generates a list of planetary positions
   * 
   * @param birthDetails - User's birth details
   * @returns Array of planetary positions
   * 
   * @TODO: Replace with actual astronomical calculations using ephemeris data
   */
  private generatePlanetaryPositions(birthDetails: BirthDetails): PlanetaryPosition[] {
    // This is a simplified generation - in a real app, we would use
    // proper astronomical calculations based on ephemeris data
    
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
    const rashis = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio', 
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    // Generate a seed from birth details for consistent "random" values
    const seed = birthDetails.date.getTime() + birthDetails.latitude + birthDetails.longitude;
    
    // Simple seeded random number generator
    const seededRandom = (max: number, offset = 0) => {
      const x = Math.sin(seed + offset) * 10000;
      return Math.floor((x - Math.floor(x)) * max);
    };
    
    return planets.map((planet, index) => {
      // Assign each planet to a rashi with a position and retrograde status
      const rashiIndex = seededRandom(12, index * 1000);
      
      return {
        planet,
        rashi: rashis[rashiIndex],
        degree: seededRandom(30, index * 2000), // 0-29 degrees within the sign
        retrograde: seededRandom(10, index * 3000) < 2 // 20% chance of retrograde
      };
    });
  }
  
  /**
   * Generates lucky numbers based on moon sign and a random seed
   * 
   * @param moonRashi - The calculated moon sign
   * @param seed - Random seed for consistent generation
   * @returns Array of lucky numbers
   */
  private generateLuckyNumbers(moonRashi: string, seed: number): number[] {
    // Use a simple seeded random generation for lucky numbers
    const seededRandom = (max: number, offset = 0) => {
      const x = Math.sin(seed + offset) * 10000;
      return Math.floor((x - Math.floor(x)) * max) + 1; // 1 to max
    };
    
    // Generate unique lucky numbers
    const numbers = new Set<number>();
    let offset = 0;
    
    while (numbers.size < 3) {
      numbers.add(seededRandom(99, offset));
      offset += 1000;
    }
    
    return Array.from(numbers).sort((a, b) => a - b);
  }
}

// Default export as singleton
const rashiCalculationService = RashiCalculationService.getInstance();
export default rashiCalculationService; 