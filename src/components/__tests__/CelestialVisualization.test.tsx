import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import CelestialVisualization from '../Visualization/CelestialVisualization';

// Mock Three.js
vi.mock('three', () => {
  const mockVector3 = vi.fn().mockImplementation(() => ({
    copy: vi.fn(),
    set: vi.fn(),
  }));

  const mockMesh = vi.fn().mockImplementation(() => ({
    position: { copy: vi.fn(), set: vi.fn() },
    rotation: { z: 0 },
  }));

  const mockScene = vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  }));

  const mockCamera = vi.fn().mockImplementation(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
  }));

  const mockRenderer = vi.fn().mockImplementation(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    domElement: document.createElement('canvas'),
  }));

  return {
    Vector3: mockVector3,
    Mesh: mockMesh,
    Scene: mockScene,
    PerspectiveCamera: mockCamera,
    WebGLRenderer: mockRenderer,
    SphereGeometry: vi.fn(),
    MeshBasicMaterial: vi.fn(),
  };
});

describe('CelestialVisualization', () => {
  beforeAll(() => {
    // Mock window.ResizeObserver
    const mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    vi.stubGlobal('ResizeObserver', mockResizeObserver);
  });

  it('renders without crashing', () => {
    render(<CelestialVisualization />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('renders with selected signs', () => {
    const selectedSigns = ['Aries', 'Taurus'];
    render(<CelestialVisualization selectedSigns={selectedSigns} />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('renders with planetary positions', () => {
    const planetaryPositions = [
      { name: 'Sun', longitude: 0, latitude: 0 },
      { name: 'Moon', longitude: 45, latitude: 0 },
    ];
    render(<CelestialVisualization planetaryPositions={planetaryPositions} />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('handles window resize', () => {
    render(<CelestialVisualization />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Verify component doesn't crash on resize
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });
}); 