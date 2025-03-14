import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import { BirthDetails } from '../services/RashiCalculationService';

describe('BirthDetailsForm Component', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  test('renders the form with all required fields', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Check if heading is displayed
    expect(screen.getByText('* BIRTH DETAILS *')).toBeInTheDocument();
    
    // Check if all input fields are displayed
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitude/i)).toBeInTheDocument();
    
    // Check if submit button is displayed
    expect(screen.getByRole('button', { name: /CALCULATE MY RASHI/i })).toBeInTheDocument();
  });
  
  test('displays loading state when isLoading is true', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByText('CALCULATING')).toBeInTheDocument();
  });
  
  test('enables form submission when all required fields are filled', async () => {
    const user = userEvent.setup();
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Select location from dropdown
    const locationSelect = screen.getByLabelText(/Location/i);
    await user.selectOptions(locationSelect, 'New Delhi, India');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /CALCULATE MY RASHI/i });
    await user.click(submitButton);
    
    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      date: expect.any(Date),
      time: expect.any(String),
      location: 'New Delhi, India',
      latitude: expect.any(Number),
      longitude: expect.any(Number),
      timezone: expect.any(String)
    }));
  });
  
  test('prevents form submission when required fields are missing', async () => {
    // Mock window.alert
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    
    // Create a form with empty location
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Clear the location field
    const locationSelect = screen.getByLabelText(/Location/i);
    await user.selectOptions(locationSelect, '');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /CALCULATE MY RASHI/i });
    await user.click(submitButton);
    
    // Check that alert was shown and onSubmit was not called
    expect(mockAlert).toHaveBeenCalledWith('Please fix the errors above before submitting.');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Restore original alert
    mockAlert.mockRestore();
  });
  
  test('updates state variables when inputs change', async () => {
    const user = userEvent.setup();
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Location selection
    const locationSelect = screen.getByLabelText(/Location/i);
    await user.selectOptions(locationSelect, 'Mumbai, India');
    expect(locationSelect).toHaveValue('Mumbai, India');
    
    // Latitude should update automatically based on location selection
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    expect(latitudeInput).toHaveValue(19.076);
    
    // Longitude should update automatically too
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    expect(longitudeInput).toHaveValue(72.8777);
  });
}); 