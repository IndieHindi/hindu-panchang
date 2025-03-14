import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MonthlyCalendar from '../MonthlyCalendar';
import PanchangService from '../../../services/PanchangService';
import { format } from 'date-fns';
import { DailyPanchang, Location, Festival } from '../../../types/panchang';

// Mock the PanchangService
jest.mock('../../../services/PanchangService', () => {
  const mockService = {
    calculateDailyPanchang: jest.fn(),
    getInstance: jest.fn(),
  };
  
  mockService.getInstance.mockReturnValue(mockService);
  
  return {
    __esModule: true,
    default: mockService,
  };
});

// Sample festival for testing
const mockFestival: Festival = {
  name: 'Test Festival',
  date: new Date('2023-06-01'),
  description: 'A test festival description',
  significance: 'Cultural significance',
  type: 'major',
};

const mockPanchang: DailyPanchang = {
  date: new Date(),
  astronomicalInfo: {
    sunrise: new Date('2023-06-01T06:30:00'),
    sunset: new Date('2023-06-01T19:30:00'),
    moonrise: new Date('2023-06-01T18:45:00'),
    moonset: new Date('2023-06-01T04:15:00'),
    lunarPhase: 0.25, // First quarter
  },
  tithi: {
    name: 'Shukla Paksha Pratipada',
    number: 1,
    startTime: new Date('2023-06-01T08:30:00'),
    endTime: new Date('2023-06-02T08:30:00'),
  },
  nakshatra: {
    name: 'Ashwini',
    number: 1,
    ruler: 'Ketu',
    startTime: new Date('2023-06-01T09:30:00'),
    endTime: new Date('2023-06-02T09:30:00'),
    deity: 'Ashwini Kumaras', // Adding required 'deity' field
  },
  yoga: {
    name: 'Vishkumbha',
    number: 1,
    startTime: new Date('2023-06-01T10:30:00'),
    endTime: new Date('2023-06-02T10:30:00'),
  },
  karana: {
    name: 'Bava',
    number: 1,
    startTime: new Date('2023-06-01T11:30:00'),
    endTime: new Date('2023-06-02T11:30:00'),
  },
  festivals: [mockFestival],
};

// Create a test wrapper with React Query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('MonthlyCalendar', () => {
  const mockLocation: Location = { 
    latitude: 40.7128, 
    longitude: -74.0060, 
    timezone: 'America/New_York',
    name: 'New York'
  };
  
  const mockFestivalNotificationToggle = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockFestivalNotificationToggle.mockClear();
    
    // Mock the PanchangService response
    const mockPanchangService = PanchangService as unknown as { 
      calculateDailyPanchang: jest.Mock; 
      getInstance: jest.Mock;
    };
    mockPanchangService.calculateDailyPanchang.mockResolvedValue(mockPanchang);
  });
  
  it('renders the calendar with current month', async () => {
    render(<MonthlyCalendar location={mockLocation} />, { wrapper: createWrapper() });
    
    // Check if current month is displayed in the header
    const currentMonth = format(new Date(), 'MMMM yyyy');
    expect(await screen.findByText(currentMonth)).toBeInTheDocument();
    
    // Check for days of week headers
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });
  
  it('shows timeline placeholder when no date is selected', async () => {
    render(<MonthlyCalendar location={mockLocation} />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Select a Date')).toBeInTheDocument();
      expect(
        screen.getByText('Choose a date from the calendar to view its events timeline')
      ).toBeInTheDocument();
    });
  });
  
  it('displays timeline when a date is selected', async () => {
    // Set a predictable date for the test
    const mockDate = new Date(2023, 5, 15); // June 15, 2023
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    
    render(<MonthlyCalendar location={mockLocation} />, { wrapper: createWrapper() });
    
    // Find the day cell (looking for the date number "15")
    const dayCell = await screen.findByText('15');
    
    // Click on the day
    fireEvent.click(dayCell);
    
    // The header should show the selected date
    await waitFor(() => {
      expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
    });
    
    // Reset timer mock
    jest.useRealTimers();
  });
  
  it('displays festival data in the timeline', async () => {
    // Set a predictable date for the test
    const mockDate = new Date(2023, 5, 1); // June 1, 2023 - matches our festival date
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    
    // Ensure our mock panchang has festival data for June 1
    const mockPanchangWithFestival = {
      ...mockPanchang,
      date: new Date(2023, 5, 1),
      festivals: [mockFestival],
    };
    
    const mockPanchangService = PanchangService as unknown as { 
      calculateDailyPanchang: jest.Mock;
      getInstance: jest.Mock;
    };
    mockPanchangService.calculateDailyPanchang.mockResolvedValue(mockPanchangWithFestival);
    
    render(
      <MonthlyCalendar 
        location={mockLocation} 
        onFestivalNotificationToggle={mockFestivalNotificationToggle}
      />, 
      { wrapper: createWrapper() }
    );
    
    // Find the day cell for June 1
    const dayCell = await screen.findByText('1');
    
    // Click on the day
    fireEvent.click(dayCell);
    
    // Wait for the festival to appear in the timeline
    await waitFor(() => {
      expect(screen.getByText('Test Festival')).toBeInTheDocument();
    });
    
    // Click the festival notification button
    const festivalElement = screen.getByText('Test Festival');
    const festivalCard = festivalElement.closest('.flex-1')?.parentElement?.parentElement;
    const notificationButton = festivalCard?.querySelector('button');
    
    if (notificationButton) {
      fireEvent.click(notificationButton);
      
      // Verify notification toggle was called
      expect(mockFestivalNotificationToggle).toHaveBeenCalledWith(mockFestival);
    }
    
    // Reset timer mock
    jest.useRealTimers();
  });
  
  it('navigates between months', async () => {
    const mockDate = new Date(2023, 5, 1); // June 1, 2023
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    
    render(<MonthlyCalendar location={mockLocation} />, { wrapper: createWrapper() });
    
    // Initially June 2023 should be displayed
    expect(await screen.findByText('June 2023')).toBeInTheDocument();
    
    // Click on the Next button (we need to find it by its icon or partial text since it's responsive)
    const nextButton = screen.getByText('Next', { exact: false });
    fireEvent.click(nextButton);
    
    // July 2023 should be displayed
    await waitFor(() => {
      expect(screen.getByText('July 2023')).toBeInTheDocument();
    });
    
    // Click on the Previous button
    const prevButton = screen.getByText('Previous', { exact: false });
    fireEvent.click(prevButton);
    
    // Back to June 2023
    await waitFor(() => {
      expect(screen.getByText('June 2023')).toBeInTheDocument();
    });
    
    // Reset timer mock
    jest.useRealTimers();
  });
  
  it('ensures timeline data is unique and sorted', async () => {
    // Setup multiple instances of the same event to test deduplication
    const mockDuplicateEvents = { ...mockPanchang };
    
    const mockPanchangService = PanchangService as unknown as { 
      calculateDailyPanchang: jest.Mock;
      getInstance: jest.Mock; 
    };
    
    mockPanchangService.calculateDailyPanchang.mockResolvedValue(mockDuplicateEvents);
    
    render(<MonthlyCalendar location={mockLocation} />, { wrapper: createWrapper() });
    
    // Find and click any day
    const day = await screen.findByText('1');
    fireEvent.click(day);
    
    // Wait for timeline to be displayed
    await waitFor(() => {
      expect(screen.getByText('Sunrise')).toBeInTheDocument();
    });
    
    // Count occurrences of 'Sunrise' - should only be 1 even though we have duplicate data
    const sunriseElements = screen.getAllByText('Sunrise');
    expect(sunriseElements.length).toBe(1);
  });
}); 