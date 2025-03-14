import React from 'react';
import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('Birth Chart Calculator')).toBeInTheDocument();
    
    // Check for birth details form
    expect(screen.getByText('* BIRTH DETAILS *')).toBeInTheDocument();
    expect(screen.getByText('CALCULATE MY RASHI')).toBeInTheDocument();
  });

  it('shows form fields', () => {
    renderWithQueryClient();
    
    // Check for form field labels using text content
    expect(screen.queryByText('Date of Birth')).toBeInTheDocument();
    expect(screen.queryByText('Time of Birth')).toBeInTheDocument();
    expect(screen.queryByText('Location')).toBeInTheDocument();
  });

  it('has a submit button', () => {
    renderWithQueryClient();
    
    // Check for submit button
    const submitButton = screen.getByText('CALCULATE MY RASHI');
    expect(submitButton).toBeInTheDocument();
  });
}); 