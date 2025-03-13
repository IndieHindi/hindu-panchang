import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Rashifal from '../Rashifal';

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

  it('renders the initial view', () => {
    renderWithQueryClient();
    expect(screen.getByText('Daily Rashifal')).toBeInTheDocument();
    
    // Check for zodiac signs
    expect(screen.getByText('Aries')).toBeInTheDocument();
    expect(screen.getByText('Taurus')).toBeInTheDocument();
    expect(screen.getByText('Gemini')).toBeInTheDocument();
    expect(screen.getByText('Cancer')).toBeInTheDocument();
    expect(screen.getByText('Leo')).toBeInTheDocument();
    expect(screen.getByText('Virgo')).toBeInTheDocument();
    expect(screen.getByText('Libra')).toBeInTheDocument();
    expect(screen.getByText('Scorpio')).toBeInTheDocument();
    expect(screen.getByText('Sagittarius')).toBeInTheDocument();
    expect(screen.getByText('Capricorn')).toBeInTheDocument();
    expect(screen.getByText('Aquarius')).toBeInTheDocument();
    expect(screen.getByText('Pisces')).toBeInTheDocument();
  });

  it('shows tab options', () => {
    renderWithQueryClient();
    expect(screen.getByText('Quick Lookup')).toBeInTheDocument();
    expect(screen.getByText('Birth Chart')).toBeInTheDocument();
  });

  it('shows prediction when a zodiac sign is selected', () => {
    renderWithQueryClient();

    // Click on a zodiac sign
    const ariesSign = screen.getByText('Aries');
    fireEvent.click(ariesSign);

    // Verify prediction navigation options are displayed
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Love')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();

    // Verify element information is displayed
    expect(screen.getByText('fire element')).toBeInTheDocument();

    // We can't test for exact prediction text since it uses a seeded random function
    // Instead, we can test for the prediction container being present
    expect(screen.getByText('Characteristics')).toBeInTheDocument();
  });
}); 