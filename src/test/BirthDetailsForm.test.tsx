import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import BirthDetailsForm from '../components/Rashifal/BirthDetailsForm';

// Mock framer-motion to avoid test issues
vi.mock('framer-motion', () => {
  const MotionComponent = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    const { 
      _initial, _animate, _exit, _transition, _whileHover, _whileTap,
      ...restProps
    } = props;
    return <div {...restProps}>{children}</div>;
  };
  
  return {
    motion: {
      div: MotionComponent,
      button: (props: React.PropsWithChildren<Record<string, unknown>>) => {
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
    expect(screen.queryByText('Date of Birth')).toBeInTheDocument();
    expect(screen.queryByText('Time of Birth')).toBeInTheDocument();
    expect(screen.queryByText('Location')).toBeInTheDocument();
    expect(screen.queryByText('Latitude')).toBeInTheDocument();
    expect(screen.queryByText('Longitude')).toBeInTheDocument();
    
    // Check if submit button is displayed
    expect(screen.getByText('CALCULATE MY RASHI')).toBeInTheDocument();
  });
  
  test('displays loading state when isLoading is true', () => {
    render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByText('CALCULATING')).toBeInTheDocument();
  });
  
  test('enables form submission when all required fields are filled', async () => {
    const user = userEvent.setup();
    const { container } = render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Form should already have default values set
    // New Delhi, India is the default location
    
    // Set a valid date - using a direct selector
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).not.toBeNull();
    
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 1); // Use a date in the past
    fireEvent.change(dateInput!, { target: { value: validDate.toISOString().split('T')[0] } });
    
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
    const { container } = render(<BirthDetailsForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Set an invalid date (future date) - using a direct selector
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).not.toBeNull();
    
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(dateInput!, { target: { value: futureDate.toISOString().split('T')[0] } });
    
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
    
    // Select Mumbai from dropdown using role instead of label
    const locationSelect = screen.getByRole('combobox');
    await user.selectOptions(locationSelect, 'Mumbai, India');
    
    // Verify coordinates updated - using display value
    const latitudeInput = screen.getByDisplayValue(19.076);
    const longitudeInput = screen.getByDisplayValue(72.8777);
    
    expect(latitudeInput).toHaveValue(19.076);
    expect(longitudeInput).toHaveValue(72.8777);
  });
}); 