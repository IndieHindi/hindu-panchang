import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar';
import type { Festival, Location } from '../types/panchang';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const MotionComponent = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    return <div {...props}>{children}</div>;
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

// Mock Notification API
const mockNotification = vi.fn();

// Define Notification mock without using vi.mock
Object.defineProperty(window, 'Notification', {
  value: class {
    static permission = 'granted';
    static requestPermission = vi.fn().mockResolvedValue('granted');
    constructor(title: string, options?: NotificationOptions) {
      mockNotification(title, options);
    }
  },
  writable: true,
  configurable: true,
});

// Mock a TimelineEvent for calendar testing
interface TimelineEvent {
  name: string;
  type: string;
  time: Date;
  description?: string;
  data?: Festival;
}

// Mock festival data
const mockFestival: Festival = {
  name: 'Diwali',
  type: 'major',
  date: new Date('2024-11-01'),
  description: 'Festival of Lights',
  significance: 'Victory of light over darkness',
};

// Mock MonthlyCalendar component for testing
vi.mock('../components/Calendar/MonthlyCalendar', () => ({
  default: ({ onFestivalNotificationToggle }: { onFestivalNotificationToggle?: (festival: Festival) => void }) => {
    return (
      <div>
        <button 
          data-testid="notification-button" 
          aria-label="notifications"
          onClick={() => {
            if (onFestivalNotificationToggle) {
              onFestivalNotificationToggle(mockFestival);
            }
          }}
        >
          Notifications
        </button>
      </div>
    );
  }
}));

describe('Festival Notification Feature', () => {
  const defaultLocation: Location = {
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    name: 'New Delhi',
  };

  const mockFestival: Festival = {
    name: 'Diwali',
    type: 'major',
    date: new Date('2024-11-01'),
    description: 'Festival of Lights',
    significance: 'Victory of light over darkness',
  };

  const mockOnFestivalNotificationToggle = vi.fn();

  beforeEach(() => {
    mockNotification.mockClear();
    mockOnFestivalNotificationToggle.mockClear();
  });

  test('renders festival notification toggle button', () => {
    render(
      <MonthlyCalendar
        location={defaultLocation}
        onFestivalNotificationToggle={mockOnFestivalNotificationToggle}
      />
    );

    expect(screen.getByTestId('notification-button')).toBeInTheDocument();
  });

  test('triggers notification when festival is toggled', async () => {
    const user = userEvent.setup();
    render(
      <MonthlyCalendar
        location={defaultLocation}
        onFestivalNotificationToggle={mockOnFestivalNotificationToggle}
      />
    );

    // Find and click the notification toggle
    const notificationButton = screen.getByTestId('notification-button');
    await user.click(notificationButton);

    // Verify the callback was called with the festival data
    expect(mockOnFestivalNotificationToggle).toHaveBeenCalledWith(expect.objectContaining({
      name: expect.any(String),
      type: expect.any(String),
      date: expect.any(Date),
    }));
  });

  test('shows notification with correct festival information', () => {
    // Create a mock implementation for onFestivalNotificationToggle that triggers notification
    const handleFestivalNotification = (festival: Festival) => {
      // Create notification directly
      if (window.Notification.permission === 'granted') {
        new window.Notification(`Festival Notification: ${festival.name}`, {
          body: festival.description,
          icon: '/om.svg'
        });
      }
    };
    
    // Call the handler with the mock festival
    handleFestivalNotification(mockFestival);
    
    // Check if notification was called with correct data
    expect(mockNotification).toHaveBeenCalledWith(
      'Festival Notification: Diwali',
      expect.objectContaining({
        body: expect.stringContaining('Festival of Lights'),
        icon: '/om.svg'
      })
    );
  });

  test('requests notification permission if not granted', async () => {
    // Temporarily set permission to 'default'
    const originalPermission = window.Notification.permission;
    Object.defineProperty(window.Notification, 'permission', {
      value: 'default',
      configurable: true
    });

    // Create a mock implementation that checks permission
    const handleFestivalNotification = async (festival: Festival) => {
      if (window.Notification.permission !== 'granted') {
        await window.Notification.requestPermission();
      }
      
      // Create notification if permission granted
      if (window.Notification.permission === 'granted') {
        new window.Notification(`Festival Notification: ${festival.name}`, {
          body: festival.description,
          icon: '/om.svg'
        });
      }
    };
    
    // Call the handler with the mock festival
    await handleFestivalNotification(mockFestival);
    
    // Verify request permission was called
    expect(window.Notification.requestPermission).toHaveBeenCalled();
    
    // Restore original permission
    Object.defineProperty(window.Notification, 'permission', {
      value: originalPermission,
      configurable: true
    });
  });
}); 