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
    expect(screen.getByText('Rashifal')).toBeInTheDocument();
    expect(screen.getByText('Select your zodiac sign to view your daily prediction.')).toBeInTheDocument();
    
    // Check for zodiac signs
    expect(screen.getByText('Mesh')).toBeInTheDocument();
    expect(screen.getByText('Vrishabha')).toBeInTheDocument();
    expect(screen.getByText('Mithuna')).toBeInTheDocument();
    expect(screen.getByText('Karka')).toBeInTheDocument();
    expect(screen.getByText('Simha')).toBeInTheDocument();
    expect(screen.getByText('Kanya')).toBeInTheDocument();
    expect(screen.getByText('Tula')).toBeInTheDocument();
    expect(screen.getByText('Vrishchika')).toBeInTheDocument();
    expect(screen.getByText('Dhanu')).toBeInTheDocument();
    expect(screen.getByText('Makara')).toBeInTheDocument();
    expect(screen.getByText('Kumbha')).toBeInTheDocument();
    expect(screen.getByText('Meena')).toBeInTheDocument();
  });

  it('shows prediction when a zodiac sign is selected', async () => {
    renderWithQueryClient();

    // Click on a zodiac sign
    fireEvent.click(screen.getByText('Mesh'));

    // Wait for prediction to load
    expect(await screen.findByText('Mesh Prediction')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Love')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();

    // Check prediction content
    expect(screen.getByText('A favorable day for new beginnings.')).toBeInTheDocument();
    expect(screen.getByText('Professional growth opportunities await.')).toBeInTheDocument();
    expect(screen.getByText('Harmony in relationships prevails.')).toBeInTheDocument();
    expect(screen.getByText('Focus on mental wellness.')).toBeInTheDocument();
  });
}); 