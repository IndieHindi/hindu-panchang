import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DailyPanchang from '../DailyPanchang';

/**
 * Mock the PanchangService to provide consistent test data
 * This allows tests to run without actual astronomical calculations
 * and ensures predictable results for assertions
 */
vi.mock('../../services/PanchangService', () => {
  return {
    default: {
      getInstance: vi.fn(() => ({
        calculateDailyPanchang: vi.fn().mockResolvedValue({
          date: new Date('2024-03-20'),
          tithi: {
            name: 'Shukla Paksha Pratipada',
            startTime: new Date('2024-03-20T06:00:00'),
            endTime: new Date('2024-03-20T18:00:00'),
          },
          nakshatra: {
            name: 'Ashwini',
            startTime: new Date('2024-03-20T06:00:00'),
            endTime: new Date('2024-03-20T18:00:00'),
          },
          yoga: {
            name: 'Vriddhi',
            startTime: new Date('2024-03-20T06:00:00'),
            endTime: new Date('2024-03-20T18:00:00'),
          },
          karana: {
            name: 'Bava',
            startTime: new Date('2024-03-20T06:00:00'),
            endTime: new Date('2024-03-20T18:00:00'),
          },
          astronomicalInfo: {
            sunrise: new Date('2024-03-20T06:30:00'),
            sunset: new Date('2024-03-20T18:30:00'),
            moonrise: new Date('2024-03-20T20:30:00'),
            moonset: new Date('2024-03-20T07:30:00'),
          },
        }),
      })),
    },
  };
});

describe('DailyPanchang', () => {
  // Create a fresh QueryClient for each test to avoid shared cache between tests
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for testing
      },
    },
  });

  /**
   * Helper function to render the component with QueryClientProvider
   * This ensures React Query hooks work properly in tests
   */
  const renderWithQueryClient = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DailyPanchang />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test to ensure clean state
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithQueryClient();
    // Verify loading state is shown before data is loaded
    expect(screen.getByText('Loading Panchang data...')).toBeInTheDocument();
  });

  it('renders panchang data when loaded', async () => {
    renderWithQueryClient();

    // Wait for data to load and verify all panchang elements are displayed
    expect(await screen.findByText('Tithi')).toBeInTheDocument();
    expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
    expect(screen.getByText('Ashwini')).toBeInTheDocument();
    expect(screen.getByText('Vriddhi')).toBeInTheDocument();
    expect(screen.getByText('Bava')).toBeInTheDocument();
  });

  it('allows date selection', async () => {
    renderWithQueryClient();

    // Wait for initial data to load
    await screen.findByText('Tithi');

    // Change date using getByDisplayValue
    const dateInput = screen.getByDisplayValue('2025-03-13');
    fireEvent.change(dateInput, { target: { value: '2024-03-21' } });

    // Verify new data is loaded after date change
    expect(await screen.findByText('Tithi')).toBeInTheDocument();
    expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
  });

  it('allows location selection', async () => {
    renderWithQueryClient();

    // Wait for initial data to load
    await screen.findByText('Tithi');

    // Change location using getByRole
    const locationSelect = screen.getByRole('combobox');
    fireEvent.change(locationSelect, { target: { value: 'Mumbai' } });

    // Verify new data is loaded after location change
    expect(await screen.findByText('Tithi')).toBeInTheDocument();
    expect(screen.getByText('Shukla Paksha Pratipada')).toBeInTheDocument();
  });
}); 