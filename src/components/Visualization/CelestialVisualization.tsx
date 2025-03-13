import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interface representing a celestial body's position
 * @property {string} name - The name of the celestial body
 * @property {number} longitude - The longitude in degrees (0-360)
 * @property {number} latitude - The latitude in degrees (-90 to 90)
 */
interface PlanetaryPosition {
  name: string;
  longitude: number;
  latitude: number;
}

/**
 * Props for the CelestialVisualization component
 * @property {string[]} selectedSigns - Array of selected zodiac signs to display
 * @property {PlanetaryPosition[]} planetaryPositions - Array of planetary positions to display
 */
interface Props {
  selectedSigns?: string[];
  planetaryPositions?: PlanetaryPosition[];
}

/**
 * CelestialVisualization Component
 * 
 * Renders a 3D visualization of celestial bodies and zodiac signs using Three.js.
 * The component handles its own lifecycle, including initialization, rendering,
 * and cleanup of Three.js resources.
 * 
 * @param {Props} props - Component props
 * @returns {JSX.Element} - The rendered component
 */
const CelestialVisualization: React.FC<Props> = ({ selectedSigns = [], planetaryPositions = [] }) => {
  // Refs to store Three.js objects and the container element
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer();

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Add zodiac signs - positioned in a circle
    selectedSigns.forEach((sign, index) => {
      const angle = (index * Math.PI * 2) / 12; // Distribute evenly in a circle
      const radius = 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const signMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff6b6b })
      );
      signMesh.position.copy(new THREE.Vector3(x, y, 0));
      signMesh.rotation.z = angle + Math.PI / 2;
      scene.add(signMesh);
    });

    // Add planetary positions - positioned based on their longitude
    planetaryPositions.forEach(planet => {
      const angle = (planet.longitude * Math.PI) / 180; // Convert degrees to radians
      const radius = 1.5;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.15),
        new THREE.MeshBasicMaterial({ color: 0x4dabf7 })
      );
      planetMesh.position.copy(new THREE.Vector3(x, y, 0));
      scene.add(planetMesh);
    });

    // Animation loop for continuous rendering
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize to maintain aspect ratio
    const handleResize = () => {
      if (!containerRef.current) return;
      if (camera && typeof camera.aspect === 'number') {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        if (typeof camera.updateProjectionMatrix === 'function') {
          camera.updateProjectionMatrix();
        }
      }
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store ref value to avoid stale closure in cleanup
    const currentContainer = containerRef.current;

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentContainer && renderer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      
      // Remove all objects from the scene instead of using scene.clear()
      // This is more compatible with different Three.js versions
      if (scene && scene.children && Array.isArray(scene.children)) {
        // Clear all meshes from the scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
      }
    };
  }, [selectedSigns, planetaryPositions]); // Re-initialize when inputs change

  return <div ref={containerRef} data-testid="celestial-visualization" className="w-full h-[400px] relative" />;
};

export default CelestialVisualization; 