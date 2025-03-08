import PanchangService from '../PanchangService';
import { Location } from '../../types/panchang';

describe('PanchangService', () => {
  const testLocation: Location = {
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    name: 'New Delhi',
  };

  const testDate = new Date('2024-03-07T00:00:00Z');

  it('should be a singleton', () => {
    const instance1 = PanchangService.getInstance();
    const instance2 = PanchangService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should calculate daily panchang', async () => {
    const service = PanchangService.getInstance();
    const panchang = await service.calculateDailyPanchang(testDate, testLocation);

    expect(panchang).toHaveProperty('tithi');
    expect(panchang).toHaveProperty('nakshatra');
    expect(panchang).toHaveProperty('yoga');
    expect(panchang).toHaveProperty('karana');
    expect(panchang).toHaveProperty('astronomicalInfo');
  });

  it('should calculate astronomical info', async () => {
    const service = PanchangService.getInstance();
    const panchang = await service.calculateDailyPanchang(testDate, testLocation);

    expect(panchang.astronomicalInfo).toHaveProperty('sunrise');
    expect(panchang.astronomicalInfo).toHaveProperty('sunset');
    expect(panchang.astronomicalInfo).toHaveProperty('moonrise');
    expect(panchang.astronomicalInfo).toHaveProperty('moonset');
    expect(panchang.astronomicalInfo).toHaveProperty('lunarPhase');
    expect(panchang.astronomicalInfo.lunarPhase).toBeGreaterThanOrEqual(0);
    expect(panchang.astronomicalInfo.lunarPhase).toBeLessThanOrEqual(1);
  });

  it('should calculate tithi', async () => {
    const service = PanchangService.getInstance();
    const panchang = await service.calculateDailyPanchang(testDate, testLocation);

    expect(panchang.tithi).toHaveProperty('number');
    expect(panchang.tithi).toHaveProperty('name');
    expect(panchang.tithi).toHaveProperty('startTime');
    expect(panchang.tithi).toHaveProperty('endTime');
    expect(panchang.tithi.number).toBeGreaterThanOrEqual(1);
    expect(panchang.tithi.number).toBeLessThanOrEqual(30);
  });

  it('should calculate nakshatra', async () => {
    const service = PanchangService.getInstance();
    const panchang = await service.calculateDailyPanchang(testDate, testLocation);

    expect(panchang.nakshatra).toHaveProperty('number');
    expect(panchang.nakshatra).toHaveProperty('name');
    expect(panchang.nakshatra).toHaveProperty('startTime');
    expect(panchang.nakshatra).toHaveProperty('endTime');
    expect(panchang.nakshatra).toHaveProperty('ruler');
    expect(panchang.nakshatra).toHaveProperty('deity');
    expect(panchang.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(panchang.nakshatra.number).toBeLessThanOrEqual(27);
  });
}); 