import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  test('renders all navigation links', () => {
    renderWithRouter();
    expect(screen.getAllByText('Hindu Panchang')).toHaveLength(2);
    expect(screen.getByText('Daily Panchang')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Rashifal')).toBeInTheDocument();
    expect(screen.getByText('Festivals')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
  });

  test('toggles mobile menu when clicking the menu button', () => {
    renderWithRouter();
    
    // Initially mobile menu should be hidden
    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
    const mobileLinks = screen.getByRole('list', { hidden: true });
    expect(mobileLinks).not.toBeVisible();
    
    // Click to open menu
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    fireEvent.click(menuButton);
    
    // Menu should be visible
    expect(mobileLinks).toBeVisible();
    
    // Click to close menu
    fireEvent.click(menuButton);
    
    // Menu should be hidden again
    expect(mobileLinks).not.toBeVisible();
  });
}); 