import {
  Observer,
  Equator,
  Spherical,
  SearchRiseSet,
  SearchMoonPhase,
  MoonPhase,
  Body,
  Ecliptic,
  GeoVector,
  EclipticLongitude,
  MakeTime,
} from 'astronomy-engine';
import {
  DailyPanchang,
  Location,
  Tithi,
  Nakshatra,
  Yoga,
  Karana,
  AstronomicalInfo,
  Festival,
  Muhurta,
} from '../types/panchang';

class PanchangService {
  private static instance: PanchangService;
  private nakshatraList = [
    { name: 'Ashwini', deity: 'Ashwini Kumaras', ruler: 'Ketu' },
    { name: 'Bharani', deity: 'Yama', ruler: 'Venus' },
    { name: 'Krittika', deity: 'Agni', ruler: 'Sun' },
    { name: 'Rohini', deity: 'Brahma', ruler: 'Moon' },
    { name: 'Mrigashira', deity: 'Soma', ruler: 'Mars' },
    { name: 'Ardra', deity: 'Rudra', ruler: 'Rahu' },
    { name: 'Punarvasu', deity: 'Aditi', ruler: 'Jupiter' },
    { name: 'Pushya', deity: 'Brihaspati', ruler: 'Saturn' },
    { name: 'Ashlesha', deity: 'Sarpa', ruler: 'Mercury' },
    { name: 'Magha', deity: 'Pitru', ruler: 'Ketu' },
    { name: 'Purva Phalguni', deity: 'Bhaga', ruler: 'Venus' },
    { name: 'Uttara Phalguni', deity: 'Aryaman', ruler: 'Sun' },
    { name: 'Hasta', deity: 'Savitri', ruler: 'Moon' },
    { name: 'Chitra', deity: 'Vishwakarma', ruler: 'Mars' },
    { name: 'Swati', deity: 'Vayu', ruler: 'Rahu' },
    { name: 'Vishakha', deity: 'Indra-Agni', ruler: 'Jupiter' },
    { name: 'Anuradha', deity: 'Mitra', ruler: 'Saturn' },
    { name: 'Jyeshtha', deity: 'Indra', ruler: 'Mercury' },
    { name: 'Mula', deity: 'Nirrti', ruler: 'Ketu' },
    { name: 'Purva Ashadha', deity: 'Apas', ruler: 'Venus' },
    { name: 'Uttara Ashadha', deity: 'Vishwadevas', ruler: 'Sun' },
    { name: 'Shravana', deity: 'Vishnu', ruler: 'Moon' },
    { name: 'Dhanishta', deity: 'Vasus', ruler: 'Mars' },
    { name: 'Shatabhisha', deity: 'Varuna', ruler: 'Rahu' },
    { name: 'Purva Bhadrapada', deity: 'Ajaikapada', ruler: 'Jupiter' },
    { name: 'Uttara Bhadrapada', deity: 'Ahirbudhnya', ruler: 'Saturn' },
    { name: 'Revati', deity: 'Pushan', ruler: 'Mercury' }
  ];

  private constructor() {}

  public static getInstance(): PanchangService {
    if (!PanchangService.instance) {
      PanchangService.instance = new PanchangService();
    }
    return PanchangService.instance;
  }

  public async calculateDailyPanchang(date: Date, location: Location): Promise<DailyPanchang> {
    try {
      // Create observer with elevation set to 0 meters above sea level
      const observer = new Observer(
        location.latitude,
        location.longitude,
        0  // elevation in meters
      );

      // Create a new date object to avoid mutations
      const baseDate = new Date(date);
      
      // Convert to UTC date at noon to ensure valid calculation time
      const utcDate = new Date(Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        12, // noon UTC
        0,
        0,
        0
      ));

      // Create default dates for the current day
      const defaultSunrise = new Date(utcDate);
      defaultSunrise.setHours(6, 0, 0, 0);
      const defaultSunset = new Date(utcDate);
      defaultSunset.setHours(18, 0, 0, 0);
      const defaultMoonrise = new Date(utcDate);
      defaultMoonrise.setHours(0, 0, 0, 0);
      const defaultMoonset = new Date(utcDate);
      defaultMoonset.setHours(12, 0, 0, 0);

      // Initialize with default values in case of calculation failures
      let astronomicalInfo: AstronomicalInfo = {
        sunrise: defaultSunrise,
        sunset: defaultSunset,
        moonrise: defaultMoonrise,
        moonset: defaultMoonset,
        lunarPhase: 0
      };

      let tithi: Tithi = {
        number: 1,
        name: this.getTithiName(1),
        startTime: new Date(utcDate),
        endTime: new Date(utcDate.getTime() + 24 * 3600 * 1000)
      };

      let nakshatra: Nakshatra = {
        number: 1,
        name: this.nakshatraList[0].name,
        startTime: new Date(utcDate),
        endTime: new Date(utcDate.getTime() + 24 * 3600 * 1000),
        ruler: this.nakshatraList[0].ruler,
        deity: this.nakshatraList[0].deity
      };

      let yoga: Yoga = {
        number: 1,
        name: this.getYogaName(1),
        startTime: new Date(utcDate),
        endTime: new Date(utcDate.getTime() + 24 * 3600 * 1000)
      };

      let karana: Karana = {
        number: 1,
        name: this.getKaranaName(1),
        startTime: new Date(utcDate),
        endTime: new Date(utcDate.getTime() + 12 * 3600 * 1000)
      };

      try {
        astronomicalInfo = await this.calculateAstronomicalInfo(observer, utcDate);
      } catch (error) {
        console.warn('Error calculating astronomical info:', error);
      }

      try {
        tithi = await this.calculateTithi(utcDate);
      } catch (error) {
        console.warn('Error calculating tithi:', error);
      }

      try {
        nakshatra = await this.calculateNakshatra(utcDate);
      } catch (error) {
        console.warn('Error calculating nakshatra:', error);
      }

      try {
        yoga = await this.calculateYoga(utcDate);
      } catch (error) {
        console.warn('Error calculating yoga:', error);
      }

      try {
        karana = await this.calculateKarana(utcDate);
      } catch (error) {
        console.warn('Error calculating karana:', error);
      }

      // Add festivals for the date
      const festivals = this.getFestivals(utcDate, tithi, nakshatra);

      // Calculate muhurtas using the astronomical info
      const muhurtas = this.calculateMuhurtas(astronomicalInfo.sunrise, astronomicalInfo.sunset);

      // Ensure all dates are valid before returning
      const validateDate = (d: Date): Date => {
        return isNaN(d.getTime()) ? new Date(utcDate) : d;
      };

      return {
        date: utcDate,
        tithi: {
          ...tithi,
          startTime: validateDate(tithi.startTime),
          endTime: validateDate(tithi.endTime)
        },
        nakshatra: {
          ...nakshatra,
          startTime: validateDate(nakshatra.startTime),
          endTime: validateDate(nakshatra.endTime)
        },
        yoga: {
          ...yoga,
          startTime: validateDate(yoga.startTime),
          endTime: validateDate(yoga.endTime)
        },
        karana: {
          ...karana,
          startTime: validateDate(karana.startTime),
          endTime: validateDate(karana.endTime)
        },
        astronomicalInfo: {
          sunrise: validateDate(astronomicalInfo.sunrise),
          sunset: validateDate(astronomicalInfo.sunset),
          moonrise: validateDate(astronomicalInfo.moonrise),
          moonset: validateDate(astronomicalInfo.moonset),
          lunarPhase: astronomicalInfo.lunarPhase
        },
        muhurtas: muhurtas.map(m => ({
          ...m,
          startTime: validateDate(m.startTime),
          endTime: validateDate(m.endTime)
        })),
        festivals: festivals.map(f => ({
          ...f,
          date: validateDate(f.date)
        }))
      };
    } catch (error) {
      console.error('Error calculating panchang:', error);
      throw new Error('Failed to calculate panchang data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  private async calculateAstronomicalInfo(observer: Observer, date: Date): Promise<AstronomicalInfo> {
    try {
      // Convert date to UTC to avoid timezone issues
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const timestamp = utcDate.getTime() / 1000; // Convert to Unix timestamp in seconds

      // Calculate sunrise/sunset with proper error handling
      let sunriseTime: Date;
      let sunsetTime: Date;
      let moonriseTime: Date;
      let moonsetTime: Date;

      try {
        const sunriseInfo = SearchRiseSet(Body.Sun, observer, timestamp, 1, -0.8333);
        sunriseTime = sunriseInfo !== null 
          ? new Date(Number(sunriseInfo) * 1000)
          : (() => {
              const defaultTime = new Date(date);
              defaultTime.setHours(6, 0, 0, 0);
              return defaultTime;
            })();
      } catch (error) {
        console.warn('Error calculating sunrise:', error);
        const defaultTime = new Date(date);
        defaultTime.setHours(6, 0, 0, 0);
        sunriseTime = defaultTime;
      }

      try {
        const sunsetInfo = SearchRiseSet(Body.Sun, observer, timestamp, -1, -0.8333);
        sunsetTime = sunsetInfo !== null
          ? new Date(Number(sunsetInfo) * 1000)
          : (() => {
              const defaultTime = new Date(date);
              defaultTime.setHours(18, 0, 0, 0);
              return defaultTime;
            })();
      } catch (error) {
        console.warn('Error calculating sunset:', error);
        const defaultTime = new Date(date);
        defaultTime.setHours(18, 0, 0, 0);
        sunsetTime = defaultTime;
      }

      try {
        const moonriseInfo = SearchRiseSet(Body.Moon, observer, timestamp, 1, 0.125);
        moonriseTime = moonriseInfo !== null
          ? new Date(Number(moonriseInfo) * 1000)
          : (() => {
              const defaultTime = new Date(date);
              defaultTime.setHours(0, 0, 0, 0);
              return defaultTime;
            })();
      } catch (error) {
        console.warn('Error calculating moonrise:', error);
        const defaultTime = new Date(date);
        defaultTime.setHours(0, 0, 0, 0);
        moonriseTime = defaultTime;
      }

      try {
        const moonsetInfo = SearchRiseSet(Body.Moon, observer, timestamp, -1, 0.125);
        moonsetTime = moonsetInfo !== null
          ? new Date(Number(moonsetInfo) * 1000)
          : (() => {
              const defaultTime = new Date(date);
              defaultTime.setHours(12, 0, 0, 0);
              return defaultTime;
            })();
      } catch (error) {
        console.warn('Error calculating moonset:', error);
        const defaultTime = new Date(date);
        defaultTime.setHours(12, 0, 0, 0);
        moonsetTime = defaultTime;
      }

      // Calculate moon phase with error handling
      let moonPhase = 0;
      try {
        moonPhase = MoonPhase(timestamp);
      } catch (error) {
        console.warn('Error calculating moon phase:', error);
        // Default to new moon (0)
      }

      return {
        sunrise: sunriseTime,
        sunset: sunsetTime,
        moonrise: moonriseTime,
        moonset: moonsetTime,
        lunarPhase: moonPhase / 360, // Convert to 0-1 range
      };
    } catch (error) {
      console.error('Error calculating astronomical info:', error);
      // Return default values if calculation fails
      const defaultDate = new Date(date.getTime());
      const defaultSunrise = new Date(defaultDate);
      defaultSunrise.setHours(6, 0, 0, 0);
      const defaultSunset = new Date(defaultDate);
      defaultSunset.setHours(18, 0, 0, 0);
      const defaultMoonrise = new Date(defaultDate);
      defaultMoonrise.setHours(0, 0, 0, 0);
      const defaultMoonset = new Date(defaultDate);
      defaultMoonset.setHours(12, 0, 0, 0);
      
      return {
        sunrise: defaultSunrise,
        sunset: defaultSunset,
        moonrise: defaultMoonrise,
        moonset: defaultMoonset,
        lunarPhase: 0,
      };
    }
  }

  private async calculateTithi(date: Date): Promise<Tithi> {
    try {
      const timestamp = Math.floor(date.getTime() / 1000);
      const moonLon = EclipticLongitude(Body.Moon, timestamp);
      const sunLon = EclipticLongitude(Body.Sun, timestamp);
      
      // Calculate lunar longitude relative to solar longitude
      const elongation = (moonLon - sunLon + 360) % 360;
      const tithiNumber = Math.floor(elongation / 12) + 1;

      // Calculate tithi start and end times
      const prevTimestamp = timestamp - 24 * 3600; // 24 hours before
      const nextTimestamp = timestamp + 24 * 3600; // 24 hours after
      
      const startTime = new Date(prevTimestamp * 1000);
      const endTime = new Date(nextTimestamp * 1000);

      return {
        number: tithiNumber,
        name: this.getTithiName(tithiNumber),
        startTime,
        endTime,
      };
    } catch (error) {
      console.warn('Error in tithi calculation:', error);
      return {
        number: 1,
        name: this.getTithiName(1),
        startTime: new Date(date),
        endTime: new Date(date.getTime() + 24 * 3600 * 1000)
      };
    }
  }

  private async calculateNakshatra(date: Date): Promise<Nakshatra> {
    try {
      const timestamp = Math.floor(date.getTime() / 1000);
      const moonLon = EclipticLongitude(Body.Moon, timestamp);
      const nakshatraNumber = Math.floor((moonLon * 27) / 360) + 1;
      const nakshatra = this.nakshatraList[nakshatraNumber - 1];

      // Calculate nakshatra start and end times
      const startTime = new Date(date);
      const endTime = new Date(date.getTime() + 24 * 3600 * 1000);

      return {
        number: nakshatraNumber,
        name: nakshatra.name,
        startTime,
        endTime,
        ruler: nakshatra.ruler,
        deity: nakshatra.deity,
      };
    } catch (error) {
      console.warn('Error in nakshatra calculation:', error);
      return {
        number: 1,
        name: this.nakshatraList[0].name,
        startTime: new Date(date),
        endTime: new Date(date.getTime() + 24 * 3600 * 1000),
        ruler: this.nakshatraList[0].ruler,
        deity: this.nakshatraList[0].deity
      };
    }
  }

  private async calculateYoga(date: Date): Promise<Yoga> {
    try {
      const timestamp = Math.floor(date.getTime() / 1000);
      const moonLon = EclipticLongitude(Body.Moon, timestamp);
      const sunLon = EclipticLongitude(Body.Sun, timestamp);
      
      // Yoga is calculated by adding lunar and solar longitudes
      const totalLon = (moonLon + sunLon) % 360;
      const yogaNumber = Math.floor((totalLon * 27) / 360) + 1;

      return {
        number: yogaNumber,
        name: this.getYogaName(yogaNumber),
        startTime: new Date(date),
        endTime: new Date(date.getTime() + 24 * 3600 * 1000),
      };
    } catch (error) {
      console.warn('Error in yoga calculation:', error);
      return {
        number: 1,
        name: this.getYogaName(1),
        startTime: new Date(date),
        endTime: new Date(date.getTime() + 24 * 3600 * 1000)
      };
    }
  }

  private async calculateKarana(date: Date): Promise<Karana> {
    try {
      // Convert to UTC timestamp
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, // noon UTC
        0,
        0,
        0
      ));
      const timestamp = Math.floor(utcDate.getTime() / 1000);

      try {
        const moonLon = EclipticLongitude(Body.Moon, timestamp);
        const sunLon = EclipticLongitude(Body.Sun, timestamp);
        
        // Karana is half of a tithi
        const elongation = (moonLon - sunLon + 360) % 360;
        const karanaNumber = Math.floor(elongation / 6) + 1;

        // Calculate start and end times
        const startTime = new Date(utcDate);
        const endTime = new Date(utcDate);
        endTime.setHours(endTime.getHours() + 12); // Karana lasts approximately 12 hours

        return {
          number: karanaNumber,
          name: this.getKaranaName(karanaNumber),
          startTime,
          endTime,
        };
      } catch (error) {
        console.warn('Error in Karana astronomical calculations:', error);
        // Fallback to default values
        const startTime = new Date(utcDate);
        const endTime = new Date(utcDate);
        endTime.setHours(endTime.getHours() + 12);
        
        return {
          number: 1,
          name: this.getKaranaName(1),
          startTime,
          endTime,
        };
      }
    } catch (error) {
      console.error('Error in Karana calculation:', error);
      return {
        number: 1,
        name: this.getKaranaName(1),
        startTime: new Date(date),
        endTime: new Date(date.getTime() + 12 * 3600 * 1000),
      };
    }
  }

  private getTithiName(tithiNumber: number): string {
    const tithiNames = [
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
    ];
    return tithiNames[(tithiNumber - 1) % 15];
  }

  private getYogaName(yogaNumber: number): string {
    const yogaNames = [
      'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
      'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
      'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
      'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
      'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
      'Indra', 'Vaidhriti'
    ];
    return yogaNames[(yogaNumber - 1) % 27];
  }

  private getKaranaName(karanaNumber: number): string {
    const karanaNames = [
      'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
      'Vanija', 'Vishti', 'Shakuni'
    ];
    return karanaNames[(karanaNumber - 1) % 8];
  }

  private getFestivals(date: Date, tithi: Tithi, nakshatra: Nakshatra): Festival[] {
    const festivals: Festival[] = [];
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    // Add major Hindu festivals
    if (tithi.number === 15) { // Full Moon (Purnima)
      festivals.push({
        name: 'Purnima',
        type: 'tithi',
        date: date,
        description: 'Full Moon Day',
        significance: 'Considered auspicious for spiritual practices and ceremonies',
      });
    }
    if (tithi.number === 30 || tithi.number === 1) { // New Moon (Amavasya)
      festivals.push({
        name: 'Amavasya',
        type: 'tithi',
        date: date,
        description: 'New Moon Day',
        significance: 'Day of new beginnings and ancestral offerings',
      });
    }

    // Add specific festivals based on date
    if (month === 3 && day === 22) {
      festivals.push({
        name: 'Holi',
        type: 'major',
        date: date,
        description: 'Festival of Colors',
        significance: 'Celebrates the victory of good over evil and the arrival of spring',
      });
    }
    if (month === 10 && [19, 20, 21, 22, 23].includes(day)) {
      festivals.push({
        name: 'Diwali',
        type: 'major',
        date: date,
        description: 'Festival of Lights',
        significance: 'Celebrates the victory of light over darkness',
      });
    }
    if (month === 8 && [30, 31].includes(day)) {
      festivals.push({
        name: 'Janmashtami',
        type: 'major',
        date: date,
        description: 'Birth of Lord Krishna',
        significance: 'Celebrates the birth of Lord Krishna',
      });
    }
    if (month === 9 && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(day)) {
      festivals.push({
        name: 'Ganesh Chaturthi',
        type: 'major',
        date: date,
        description: 'Festival dedicated to Lord Ganesha',
        significance: 'Celebrates the birth of Lord Ganesha',
      });
    }

    return festivals;
  }

  private calculateMuhurtas(sunrise: Date, sunset: Date): Muhurta[] {
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const muhurtaDuration = dayDuration / 30; // 30 muhurtas in a day

    const muhurtas: Muhurta[] = [];
    for (let i = 0; i < 30; i++) {
      const startTime = new Date(sunrise.getTime() + (muhurtaDuration * i));
      const endTime = new Date(sunrise.getTime() + (muhurtaDuration * (i + 1)));
      muhurtas.push({
        name: this.getMuhurtaName(i),
        type: this.getMuhurtaType(i),
        description: this.getMuhurtaDescription(i),
        startTime,
        endTime,
      });
    }

    return muhurtas;
  }

  private getMuhurtaName(index: number): string {
    const muhurtaNames = [
      'Rudra', 'Ahi', 'Mitra', 'Pitri', 'Vasu',
      'Vara', 'Vishvadeva', 'Vidhi', 'Satamukhi', 'Puruhuta',
      'Vahini', 'Naktanakara', 'Varuna', 'Aryaman', 'Bhaga',
      'Girisha', 'Ajapada', 'Ahir-Budhnya', 'Pushan', 'Ashvini',
      'Yama', 'Agni', 'Vidhatri', 'Kanda', 'Aditi',
      'Jiva', 'Vishnu', 'Dyumani', 'Brahma', 'Samudra'
    ];
    return muhurtaNames[index % muhurtaNames.length];
  }

  private getMuhurtaType(index: number): 'auspicious' | 'inauspicious' | 'neutral' {
    // Define auspicious muhurtas (example)
    const auspiciousMuhurtas = [0, 1, 4, 6, 8, 10, 13, 15, 20, 22, 25, 27];
    const inauspiciousMuhurtas = [3, 7, 11, 14, 18, 21, 24, 28];
    
    if (auspiciousMuhurtas.includes(index)) return 'auspicious';
    if (inauspiciousMuhurtas.includes(index)) return 'inauspicious';
    return 'neutral';
  }

  private getMuhurtaDescription(index: number): string {
    const descriptions: { [key: string]: string } = {
      'Rudra': 'Sacred time dedicated to Lord Shiva',
      'Ahi': 'Time for healing and rejuvenation',
      'Mitra': 'Auspicious for forming friendships and alliances',
      'Pitri': 'Time for ancestral offerings',
      'Vasu': 'Good for material prosperity',
      // Add more descriptions as needed
    };

    const name = this.getMuhurtaName(index);
    return descriptions[name] || 'Regular muhurta period';
  }
}

export default PanchangService; 