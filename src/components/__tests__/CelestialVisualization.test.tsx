import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CelestialVisualization from '../CelestialVisualization';

// Mock Three.js
vi.mock('three', () => {
  const mockPosition = { x: 0, y: 0, z: 0 };
  const mockCamera = {
    position: mockPosition,
    aspect: 1,
    updateProjectionMatrix: vi.fn(),
  };
  
  return {
    Scene: vi.fn(() => ({
      add: vi.fn(),
      children: [],
    })),
    PerspectiveCamera: vi.fn(() => mockCamera),
    WebGLRenderer: vi.fn(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      domElement: document.createElement('canvas'),
    })),
    Color: vi.fn(),
    RingGeometry: vi.fn(),
    MeshBasicMaterial: vi.fn(),
    Mesh: vi.fn(() => ({
      position: { ...mockPosition },
      rotation: { x: 0, y: 0, z: 0 },
    })),
    PlaneGeometry: vi.fn(),
    SphereGeometry: vi.fn(),
    Group: vi.fn(() => ({
      add: vi.fn(),
      children: [],
      position: { ...mockPosition },
      rotation: { x: 0, y: 0, z: 0 },
    })),
    Vector3: vi.fn(() => ({ ...mockPosition })),
  };
});

// Mock OrbitControls
vi.mock('three/addons/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    update: vi.fn(),
    dispose: vi.fn(),
  })),
}));

describe('CelestialVisualization', () => {
  const mockPlanetaryPositions = {
    sun: 1,
    moon: 2,
    mars: 3,
    mercury: 4,
    jupiter: 5,
    venus: 6,
    saturn: 7,
    rahu: 8,
    ketu: 9,
  };

  it('renders without crashing', () => {
    render(<CelestialVisualization />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('renders with selected sign', () => {
    render(<CelestialVisualization selectedSign="Mesh" />);
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('renders with planetary positions', () => {
    render(
      <CelestialVisualization
        selectedSign="Mesh"
        planetaryPositions={mockPlanetaryPositions}
      />
    );
    expect(screen.getByTestId('celestial-visualization')).toBeInTheDocument();
  });

  it('handles window resize', () => {
    render(<CelestialVisualization />);
    const container = screen.getByTestId('celestial-visualization');
    
    // Simulate window resize
    global.dispatchEvent(new Event('resize'));
    
    expect(container).toBeInTheDocument();
  });
}); 