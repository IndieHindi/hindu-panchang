import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Rashifal from '../Rashifal';
import { vi } from 'vitest';

// Mock the astrology utility functions
vi.mock('../../utils/astrology', () => ({
  calculateRashi: vi.fn().mockReturnValue('Mesh'),
  calculatePlanetaryPositions: vi.fn().mockReturnValue({
    sun: 1,
    moon: 2,
    mars: 3,
    mercury: 4,
    jupiter: 5,
    venus: 6,
    saturn: 7,
    rahu: 8,
    ketu: 9,
  }),
}));

// Mock the rashifal service
vi.mock('../../services/rashifal', () => ({
  getRashifalPrediction: vi.fn().mockResolvedValue({
    rashi: 'Mesh',
    timeframe: 'daily',
    prediction: {
      general: 'Test general prediction',
      career: 'Test career prediction',
      love: 'Test love prediction',
      health: 'Test health prediction',
      luck: 'Test luck prediction',
      finance: 'Test finance prediction',
      family: 'Test family prediction',
      education: 'Test education prediction',
    },
    compatibility: {
      bestMatches: ['Simha', 'Dhanu'],
      goodMatches: ['Mithuna', 'Kumbha'],
      avoidMatches: ['Karka', 'Tula'],
    },
    luckyElements: {
      colors: ['Red', 'Orange'],
      numbers: [1, 9],
      days: ['Tuesday', 'Sunday'],
      gemstones: ['Red Coral', 'Ruby'],
      direction: 'East',
    },
    planetaryInfluence: {
      ruling: 'Mars',
      favorable: ['Jupiter', 'Sun', 'Moon'],
      unfavorable: ['Saturn', 'Venus'],
    },
    characteristics: {
      personality: ['Natural leader', 'Energetic'],
      strengths: ['Initiative', 'Determination'],
      weaknesses: ['Impatience', 'Short temper'],
    },
  }),
}));

describe('Rashifal', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithQueryClient = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Rashifal />
      </QueryClientProvider>
    );
  };

  it('renders birth details form initially', () => {
    renderWithQueryClient();
    expect(screen.getByText('Rashifal')).toBeInTheDocument();
    expect(screen.getByText(/Discover your detailed astrological prediction/)).toBeInTheDocument();
  });

  it('handles birth details submission', async () => {
    renderWithQueryClient();
    
    // Fill in birth details
    const dateInput = screen.getByLabelText('Birth Date');
    const timeInput = screen.getByLabelText('Birth Time');
    const placeInput = screen.getByLabelText('Birth Place');

    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    fireEvent.change(placeInput, { target: { value: 'New Delhi' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /calculate rashifal/i });
    fireEvent.click(submitButton);

    // Wait for prediction to load
    await waitFor(() => {
      expect(screen.getByText('Celestial Movements')).toBeInTheDocument();
      expect(screen.getByText('Test general prediction')).toBeInTheDocument();
    });
  });

  it('allows timeframe selection', async () => {
    renderWithQueryClient();
    
    // First submit birth details
    const dateInput = screen.getByLabelText('Birth Date');
    const timeInput = screen.getByLabelText('Birth Time');
    const placeInput = screen.getByLabelText('Birth Place');

    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    fireEvent.change(placeInput, { target: { value: 'New Delhi' } });

    const submitButton = screen.getByRole('button', { name: /calculate rashifal/i });
    fireEvent.click(submitButton);

    // Wait for prediction to load
    await waitFor(() => {
      expect(screen.getByText('Celestial Movements')).toBeInTheDocument();
    });

    // Change timeframe
    const timeframeSelect = screen.getByLabelText('Timeframe');
    fireEvent.change(timeframeSelect, { target: { value: 'weekly' } });

    // Verify prediction updates
    await waitFor(() => {
      expect(screen.getByText('Test general prediction')).toBeInTheDocument();
    });
  });

  it('allows zodiac sign selection', async () => {
    renderWithQueryClient();
    
    // First submit birth details
    const dateInput = screen.getByLabelText('Birth Date');
    const timeInput = screen.getByLabelText('Birth Time');
    const placeInput = screen.getByLabelText('Birth Place');

    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    fireEvent.change(placeInput, { target: { value: 'New Delhi' } });

    const submitButton = screen.getByRole('button', { name: /calculate rashifal/i });
    fireEvent.click(submitButton);

    // Wait for prediction to load
    await waitFor(() => {
      expect(screen.getByText('Celestial Movements')).toBeInTheDocument();
    });

    // Click on a zodiac sign
    const simhaSign = screen.getByText('Simha');
    fireEvent.click(simhaSign);

    // Verify prediction updates
    await waitFor(() => {
      expect(screen.getByText('Test general prediction')).toBeInTheDocument();
    });
  });
}); 