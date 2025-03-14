import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import { BirthDetails } from '../services/RashiCalculationService';

describe('BirthDetailsForm Component', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  test('renders the form with all required fields', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Check if heading is displayed
    expect(screen.getByText('Enter Your Birth Details')).toBeInTheDocument();
    
    // Check if all input fields are displayed
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Place/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitude/i)).toBeInTheDocument();
    
    // Check if submit button is displayed
    expect(screen.getByRole('button', { name: /Generate Birth Chart/i })).toBeInTheDocument();
  });
  
  test('displays loading state when isLoading is true', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });
  
  test('enables form submission when all required fields are filled', async () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Fill in the required fields
    await userEvent.type(screen.getByLabelText(/Birth Date/i), '2023-01-01');
    await userEvent.type(screen.getByLabelText(/Birth Time/i), '12:00');
    await userEvent.type(screen.getByLabelText(/Birth Place/i), 'New Delhi, India');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Generate Birth Chart/i });
    await userEvent.click(submitButton);
    
    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      date: expect.any(Date),
      time: '12:00',
      location: 'New Delhi, India',
      latitude: expect.any(Number),
      longitude: expect.any(Number),
      timezone: expect.any(String)
    }));
  });
  
  test('prevents form submission when required fields are missing', async () => {
    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Generate Birth Chart/i });
    await userEvent.click(submitButton);
    
    // Check that alert was shown and onSubmit was not called
    expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Restore original alert
    mockAlert.mockRestore();
  });
  
  test('updates state variables when inputs change', async () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Date input
    const dateInput = screen.getByLabelText(/Birth Date/i);
    await userEvent.type(dateInput, '2023-05-15');
    expect(dateInput).toHaveValue('2023-05-15');
    
    // Time input
    const timeInput = screen.getByLabelText(/Birth Time/i);
    await userEvent.type(timeInput, '14:30');
    expect(timeInput).toHaveValue('14:30');
    
    // Location input
    const locationInput = screen.getByLabelText(/Birth Place/i);
    await userEvent.type(locationInput, 'Mumbai, India');
    expect(locationInput).toHaveValue('Mumbai, India');
    
    // Latitude input
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    fireEvent.change(latitudeInput, { target: { value: '19.0760' } });
    expect(latitudeInput).toHaveValue(19.076);
    
    // Longitude input
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    fireEvent.change(longitudeInput, { target: { value: '72.8777' } });
    expect(longitudeInput).toHaveValue(72.8777);
  });
}); 