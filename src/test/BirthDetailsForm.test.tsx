import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';
import { BirthDetails } from '../services/RashiCalculationService';

// Mock framer-motion to avoid test issues
vi.mock('framer-motion', () => {
  const MotionComponent = ({ children, ...props }: any) => {
    const { 
      initial, animate, exit, transition, whileHover, whileTap,
      ...restProps
    } = props;
    return <div {...restProps}>{children}</div>;
  };
  
  return {
    motion: {
      div: MotionComponent,
      button: (props: any) => {
        const { children, ...rest } = props;
        return <button {...rest}>{children}</button>;
      }
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

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
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Time of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Latitude')).toBeInTheDocument();
    expect(screen.getByLabelText('Longitude')).toBeInTheDocument();
    
    // Check if submit button is displayed
    expect(screen.getByText('CALCULATE MY RASHI')).toBeInTheDocument();
  });
  
  test('displays loading state when isLoading is true', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByText('CALCULATING')).toBeInTheDocument();
  });
  
  test('enables form submission when all required fields are filled', async () => {
    const user = userEvent.setup();
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Form should already have default values set
    // New Delhi, India is the default location
    
    // Submit the form
    const submitButton = screen.getByText('CALCULATE MY RASHI');
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
  
  test('prevents form submission when validation errors exist', async () => {
    // Create a spy on window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    const user = userEvent.setup();
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Set an invalid date (future date)
    const dateInput = screen.getByLabelText('Date of Birth');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
    
    // Submit the form
    const submitButton = screen.getByText('CALCULATE MY RASHI');
    await user.click(submitButton);
    
    // Form shouldn't be submitted due to validation errors
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Cleanup
    alertSpy.mockRestore();
  });
  
  test('updates values when location is selected', async () => {
    const user = userEvent.setup();
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Select Mumbai from dropdown
    const locationSelect = screen.getByLabelText('Location');
    await user.selectOptions(locationSelect, 'Mumbai, India');
    
    // Verify coordinates updated
    const latitudeInput = screen.getByLabelText('Latitude');
    const longitudeInput = screen.getByLabelText('Longitude');
    
    expect(latitudeInput).toHaveValue(19.076);
    expect(longitudeInput).toHaveValue(72.8777);
  });
}); 