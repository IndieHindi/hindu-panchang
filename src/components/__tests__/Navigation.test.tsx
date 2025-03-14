import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  it('renders all navigation links', () => {
    renderWithRouter();
    expect(screen.getAllByText('Hindu Panchang')).toHaveLength(2); // Desktop and mobile
    
    // Desktop links should be visible
    const desktopNav = screen.getByRole('navigation', { hidden: true, name: /desktop/i });
    expect(within(desktopNav).getByText('Daily Panchang')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Calendar')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Rashifal')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Learn')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicking the menu button', () => {
    const { container } = renderWithRouter();
    
    // Initially mobile menu should be hidden
    const mobileLinks = screen.queryByRole('list');
    expect(mobileLinks).not.toBeInTheDocument();
    
    // Click to open menu
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    fireEvent.click(menuButton);
    
    // Find the mobile menu container
    const mobileNav = container.querySelector('nav.lg\\:hidden');
    expect(mobileNav).not.toBeNull();
    
    if (mobileNav) {
      // Menu items should be visible in the mobile nav
      expect(within(mobileNav as HTMLElement).getByText('Daily Panchang')).toBeVisible();
      expect(within(mobileNav as HTMLElement).getByText('Calendar')).toBeVisible();
      expect(within(mobileNav as HTMLElement).getByText('Rashifal')).toBeVisible();
      expect(within(mobileNav as HTMLElement).getByText('Learn')).toBeVisible();
    }
    
    // Click to close menu
    fireEvent.click(menuButton);
    
    // Menu items should be hidden
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
}); 