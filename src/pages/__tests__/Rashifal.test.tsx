import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Rashifal from '../Rashifal';
import { getRashifal } from '../../services/rashifalService';

// Mock the rashifal service
vi.mock('../../services/rashifalService', () => ({
  getRashifal: vi.fn()
}));

describe('Rashifal', () => {
  it('renders the form initially', () => {
    render(<Rashifal />);
    expect(screen.getByText('Rashifal')).toBeInTheDocument();
    expect(screen.getByText('Discover your detailed astrological prediction')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Place')).toBeInTheDocument();
    expect(screen.getByLabelText('Timeframe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate Rashifal' })).toBeInTheDocument();
  });

  it('handles birth details submission', async () => {
    const mockData = {
      general: 'You will have a good day today.',
      career: 'Career prospects look promising.',
      love: 'Love life will be stable.',
      health: 'Take care of your health.',
      family: 'Family matters will be resolved.',
      travel: 'Avoid long distance travel.',
      education: 'Focus on your studies.',
      money: 'Financial matters will improve.'
    };

    (getRashifal as any).mockResolvedValue(mockData);

    render(<Rashifal />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Birth Date'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Birth Time'), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText('Birth Place'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('Timeframe'), { target: { value: 'daily' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Calculate Rashifal' }));

    // Verify the prediction is displayed
    expect(await screen.findByText('General')).toBeInTheDocument();
    expect(screen.getByText(mockData.general)).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText(mockData.career)).toBeInTheDocument();
  });

  it('allows zodiac sign selection', async () => {
    const mockData = {
      general: 'You will have a good day today.',
      career: 'Career prospects look promising.',
      love: 'Love life will be stable.',
      health: 'Take care of your health.',
      family: 'Family matters will be resolved.',
      travel: 'Avoid long distance travel.',
      education: 'Focus on your studies.',
      money: 'Financial matters will improve.'
    };

    (getRashifal as any).mockResolvedValue(mockData);

    render(<Rashifal />);

    // Select a zodiac sign
    const signSelect = screen.getByLabelText('Zodiac Sign');
    fireEvent.change(signSelect, { target: { value: 'aries' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Calculate Rashifal' }));

    // Verify the prediction is displayed
    expect(await screen.findByText('General')).toBeInTheDocument();
    expect(screen.getByText(mockData.general)).toBeInTheDocument();
  });
}); 