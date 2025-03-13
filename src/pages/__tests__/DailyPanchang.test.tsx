import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyPanchang from '../DailyPanchang';
import PanchangService from '../../services/PanchangService';

// Mock the panchang service
vi.mock('../../services/PanchangService', () => ({
  default: {
    getInstance: vi.fn(() => ({
      calculateDailyPanchang: vi.fn().mockResolvedValue({
        date: '2024-03-20',
        tithi: 'Shukla Paksha Pratipada',
        nakshatra: 'Ashwini',
        yoga: 'Vriddhi',
        karana: 'Bava',
        sunrise: '06:30',
        sunset: '18:30',
        moonrise: '20:30',
        moonset: '07:30'
      })
    }))
  }
}));

describe('DailyPanchang', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<DailyPanchang />);
    expect(screen.getByText('Loading Panchang data...')).toBeInTheDocument();
  });

  it('renders panchang data when loaded', async () => {
    render(<DailyPanchang />);

    // Wait for data to load
    expect(await screen.findByText('Tithi')).toBeInTheDocument();
    expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
    expect(screen.getByText('Ashwini')).toBeInTheDocument();
    expect(screen.getByText('Vriddhi')).toBeInTheDocument();
    expect(screen.getByText('Bava')).toBeInTheDocument();
  });

  it('allows date selection', async () => {
    render(<DailyPanchang />);

    // Wait for initial data to load
    await screen.findByText('Tithi');

    // Change date
    const dateInput = screen.getByLabelText('Select Date');
    fireEvent.change(dateInput, { target: { value: '2024-03-21' } });

    // Verify new data is loaded
    expect(await screen.findByText('Tithi')).toBeInTheDocument();
    expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
  });
}); 