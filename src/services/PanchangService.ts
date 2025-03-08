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
} from 'astronomy-engine';
import { DailyPanchang, Location, Tithi, Nakshatra, Yoga, Karana, AstronomicalInfo } from '../types/panchang';

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
    const observer = new Observer(location.latitude, location.longitude, 0);

    const astronomicalInfo = await this.calculateAstronomicalInfo(observer, date);
    const tithi = await this.calculateTithi(date);
    const nakshatra = await this.calculateNakshatra(date);
    const yoga = await this.calculateYoga(date);
    const karana = await this.calculateKarana(date);

    return {
      date,
      tithi,
      nakshatra,
      yoga,
      karana,
      astronomicalInfo,
      muhurtas: [], // To be implemented
      festivals: [], // To be implemented
    };
  }

  private async calculateAstronomicalInfo(observer: Observer, date: Date): Promise<AstronomicalInfo> {
    const timestamp = date.getTime() / 1000; // Convert to Unix timestamp in seconds
    const sunriseInfo = SearchRiseSet(Body.Sun, observer, timestamp, 1, -0.8333) as number | null; // -0.8333 degrees for standard sunrise/sunset
    const sunsetInfo = SearchRiseSet(Body.Sun, observer, timestamp, -1, -0.8333) as number | null;
    const moonriseInfo = SearchRiseSet(Body.Moon, observer, timestamp, 1, 0.125) as number | null; // 0.125 degrees for moonrise/moonset
    const moonsetInfo = SearchRiseSet(Body.Moon, observer, timestamp, -1, 0.125) as number | null;
    const moonPhase = MoonPhase(timestamp);

    // Convert timestamps to dates, using fallback values if event is not found
    const sunriseTime = sunriseInfo !== null ? new Date(Math.floor(sunriseInfo * 1000)) : new Date(date.getTime());
    const sunsetTime = sunsetInfo !== null ? new Date(Math.floor(sunsetInfo * 1000)) : new Date(date.getTime() + 12 * 3600 * 1000);
    const moonriseTime = moonriseInfo !== null ? new Date(Math.floor(moonriseInfo * 1000)) : new Date(date.getTime());
    const moonsetTime = moonsetInfo !== null ? new Date(Math.floor(moonsetInfo * 1000)) : new Date(date.getTime() + 12 * 3600 * 1000);

    return {
      sunrise: sunriseTime,
      sunset: sunsetTime,
      moonrise: moonriseTime,
      moonset: moonsetTime,
      lunarPhase: moonPhase / 360, // Convert to 0-1 range
    };
  }

  private async calculateTithi(date: Date): Promise<Tithi> {
    const timestamp = date.getTime() / 1000;
    const moonLon = EclipticLongitude(Body.Moon, timestamp);
    const sunLon = EclipticLongitude(Body.Sun, timestamp);
    
    // Calculate lunar longitude relative to solar longitude
    const elongation = (moonLon - sunLon + 360) % 360;
    const tithiNumber = Math.floor(elongation / 12) + 1;

    // Calculate tithi start and end times
    const prevTimestamp = timestamp - 24 * 3600; // 24 hours before
    const nextTimestamp = timestamp + 24 * 3600; // 24 hours after
    
    const prevElongation = (EclipticLongitude(Body.Moon, prevTimestamp) - EclipticLongitude(Body.Sun, prevTimestamp) + 360) % 360;
    const nextElongation = (EclipticLongitude(Body.Moon, nextTimestamp) - EclipticLongitude(Body.Sun, nextTimestamp) + 360) % 360;
    
    const startTime = new Date(Math.floor(prevTimestamp * 1000));
    const endTime = new Date(Math.ceil(nextTimestamp * 1000));

    return {
      number: tithiNumber,
      name: this.getTithiName(tithiNumber),
      startTime,
      endTime,
    };
  }

  private async calculateNakshatra(date: Date): Promise<Nakshatra> {
    const timestamp = date.getTime() / 1000;
    const moonLon = EclipticLongitude(Body.Moon, timestamp);
    const nakshatraNumber = Math.floor((moonLon * 27) / 360) + 1;
    const nakshatra = this.nakshatraList[nakshatraNumber - 1];

    // Calculate nakshatra start and end times
    const prevTimestamp = timestamp - 24 * 3600; // 24 hours before
    const nextTimestamp = timestamp + 24 * 3600; // 24 hours after
    
    const startTime = new Date(Math.floor(prevTimestamp * 1000));
    const endTime = new Date(Math.ceil(nextTimestamp * 1000));

    return {
      number: nakshatraNumber,
      name: nakshatra.name,
      startTime,
      endTime,
      ruler: nakshatra.ruler,
      deity: nakshatra.deity,
    };
  }

  private async calculateYoga(date: Date): Promise<Yoga> {
    const timestamp = date.getTime() / 1000;
    const moonLon = EclipticLongitude(Body.Moon, timestamp);
    const sunLon = EclipticLongitude(Body.Sun, timestamp);
    
    // Yoga is calculated by adding lunar and solar longitudes
    const totalLon = (moonLon + sunLon) % 360;
    const yogaNumber = Math.floor((totalLon * 27) / 360) + 1;

    return {
      number: yogaNumber,
      name: this.getYogaName(yogaNumber),
      startTime: new Date(date.getTime()),
      endTime: new Date(date.getTime() + 24 * 3600 * 1000),
    };
  }

  private async calculateKarana(date: Date): Promise<Karana> {
    const timestamp = date.getTime() / 1000;
    const moonLon = EclipticLongitude(Body.Moon, timestamp);
    const sunLon = EclipticLongitude(Body.Sun, timestamp);
    
    // Karana is half of a tithi
    const elongation = (moonLon - sunLon + 360) % 360;
    const karanaNumber = Math.floor(elongation / 6) + 1;

    return {
      number: karanaNumber,
      name: this.getKaranaName(karanaNumber),
      startTime: new Date(date.getTime()),
      endTime: new Date(date.getTime() + 12 * 3600 * 1000),
    };
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
}

export default PanchangService; 