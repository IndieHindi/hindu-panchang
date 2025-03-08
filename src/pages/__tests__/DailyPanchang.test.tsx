import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DailyPanchang from '../DailyPanchang';
import PanchangService from '../../services/PanchangService';

// Mock PanchangService
vi.mock('../../services/PanchangService', () => ({
  default: {
    getInstance: vi.fn(() => ({
      calculateDailyPanchang: vi.fn().mockResolvedValue({
        date: new Date('2024-03-07'),
        tithi: {
          number: 1,
          name: 'Pratipada',
          startTime: new Date('2024-03-07T06:00:00'),
          endTime: new Date('2024-03-07T18:00:00'),
        },
        nakshatra: {
          number: 1,
          name: 'Ashwini',
          startTime: new Date('2024-03-07T06:00:00'),
          endTime: new Date('2024-03-07T18:00:00'),
          ruler: 'Ketu',
          deity: 'Ashwini Kumaras',
        },
        yoga: {
          number: 1,
          name: 'Vishkumbha',
          startTime: new Date('2024-03-07T06:00:00'),
          endTime: new Date('2024-03-07T18:00:00'),
        },
        karana: {
          number: 1,
          name: 'Bava',
          startTime: new Date('2024-03-07T06:00:00'),
          endTime: new Date('2024-03-07T18:00:00'),
        },
        astronomicalInfo: {
          sunrise: new Date('2024-03-07T06:00:00'),
          sunset: new Date('2024-03-07T18:00:00'),
          moonrise: new Date('2024-03-07T08:00:00'),
          moonset: new Date('2024-03-07T20:00:00'),
          lunarPhase: 0.5,
        },
        muhurtas: [],
        festivals: [],
      }),
    })),
  },
}));

describe('DailyPanchang', () => {
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
        <DailyPanchang />
      </QueryClientProvider>
    );
  };

  it('renders loading state initially', () => {
    renderWithQueryClient();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders panchang data after loading', async () => {
    renderWithQueryClient();
    
    await waitFor(() => {
      expect(screen.getByText('Daily Panchang')).toBeInTheDocument();
      expect(screen.getByText('Astronomical Information')).toBeInTheDocument();
      expect(screen.getByText('Tithi')).toBeInTheDocument();
      expect(screen.getByText('Nakshatra')).toBeInTheDocument();
      expect(screen.getByText('Yoga & Karana')).toBeInTheDocument();
    });

    // Verify specific data
    expect(screen.getByText('Pratipada')).toBeInTheDocument();
    expect(screen.getByText('Ashwini')).toBeInTheDocument();
    expect(screen.getByText('Vishkumbha')).toBeInTheDocument();
    expect(screen.getByText('Bava')).toBeInTheDocument();
  });

  it('allows date selection', async () => {
    renderWithQueryClient();
    
    const dateInput = screen.getByRole('date');
    fireEvent.change(dateInput, { target: { value: '2024-03-08' } });
    
    await waitFor(() => {
      expect(PanchangService.getInstance().calculateDailyPanchang).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Object)
      );
    });
  });
}); 