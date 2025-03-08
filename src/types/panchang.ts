export interface Tithi {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
}

export interface Nakshatra {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
  ruler: string;
  deity: string;
}

export interface Yoga {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
}

export interface Karana {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
}

export interface AstronomicalInfo {
  sunrise: Date;
  sunset: Date;
  moonrise: Date;
  moonset: Date;
  lunarPhase: number; // 0-1 representing the illuminated fraction
}

export interface Muhurta {
  name: string;
  type: 'auspicious' | 'inauspicious' | 'neutral';
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface Festival {
  name: string;
  type: 'major' | 'tithi' | 'nakshatra' | 'special';
  date: Date;
  description: string;
  significance: string;
}

export interface DailyPanchang {
  date: Date;
  tithi: Tithi;
  nakshatra: Nakshatra;
  yoga: Yoga;
  karana: Karana;
  astronomicalInfo: AstronomicalInfo;
  muhurtas: Muhurta[];
  festivals: Festival[];
}

export interface Location {
  latitude: number;
  longitude: number;
  timezone: string;
  name: string;
}

export interface RashifalPrediction {
  rashi: string;
  prediction: {
    general: string;
    career: string;
    love: string;
    health: string;
    luck: string;
  };
  compatibility: string[];
  luckyColor: string;
  luckyNumber: number;
} 