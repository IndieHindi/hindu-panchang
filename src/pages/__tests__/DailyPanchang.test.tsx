import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import DailyPanchang from '../DailyPanchang';
import PanchangService from '../../services/PanchangService';

// Mock the PanchangService
vi.mock('../../services/PanchangService', () => ({
  default: {
    getInstance: vi.fn(() => ({
      getDailyPanchang: vi.fn().mockResolvedValue({
        date: '2024-03-13',
        tithi: 'Shukla Paksha Pratipada',
        nakshatra: 'Ashwini',
        yoga: 'Vishkumbha',
        karana: 'Bava',
        sunrise: '06:30',
        sunset: '18:30',
        moonrise: '07:00',
        moonset: '19:00'
      })
    }))
  }
}));

describe('DailyPanchang', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  const renderWithQueryClient = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DailyPanchang />
      </QueryClientProvider>
    );
  };

  test('renders loading state initially', () => {
    renderWithQueryClient();
    expect(screen.getByRole('status')).toHaveTextContent('Loading Panchang data...');
  });

  test('renders panchang data after loading', async () => {
    renderWithQueryClient();
    
    await waitFor(() => {
      expect(screen.getByText('Tithi')).toBeInTheDocument();
      expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
    });
  });

  test('allows date selection', async () => {
    renderWithQueryClient();
    
    const dateInput = screen.getByLabelText('Date');
    fireEvent.change(dateInput, { target: { value: '2024-03-08' } });
    
    await waitFor(() => {
      expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
    });
  });
}); 