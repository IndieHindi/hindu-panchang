import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
  };

  it('renders the logo', () => {
    renderWithRouter();
    expect(screen.getAllByText('Hindu Panchang')).toHaveLength(2); // Desktop and mobile
  });

  it('renders all navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Daily Panchang')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Rashifal')).toBeInTheDocument();
    expect(screen.getByText('Festivals')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicking the menu button', () => {
    renderWithRouter();
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    
    // Initially mobile menu should be hidden
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeVisible();
    
    // Click to open menu
    fireEvent.click(menuButton);
    expect(screen.queryByRole('link', { name: 'Home' })).toBeVisible();
    
    // Click to close menu
    fireEvent.click(menuButton);
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeVisible();
  });
}); 