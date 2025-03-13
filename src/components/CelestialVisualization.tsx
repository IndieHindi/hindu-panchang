import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface CelestialVisualizationProps {
  selectedSign?: string;
  planetaryPositions?: {
    sun: number;
    moon: number;
    mars: number;
    mercury: number;
    jupiter: number;
    venus: number;
    saturn: number;
    rahu: number;
    ketu: number;
  };
}

const zodiacSigns = [
  { name: 'Mesh', symbol: '♈', color: '#FF6B6B' },
  { name: 'Vrishabha', symbol: '♉', color: '#4ECDC4' },
  { name: 'Mithuna', symbol: '♊', color: '#45B7D1' },
  { name: 'Karka', symbol: '♋', color: '#96CEB4' },
  { name: 'Simha', symbol: '♌', color: '#FFEEAD' },
  { name: 'Kanya', symbol: '♍', color: '#D4A5A5' },
  { name: 'Tula', symbol: '♎', color: '#9B59B6' },
  { name: 'Vrishchika', symbol: '♏', color: '#E74C3C' },
  { name: 'Dhanu', symbol: '♐', color: '#F1C40F' },
  { name: 'Makara', symbol: '♑', color: '#2C3E50' },
  { name: 'Kumbha', symbol: '♒', color: '#3498DB' },
  { name: 'Meena', symbol: '♓', color: '#1ABC9C' },
];

const CelestialVisualization: React.FC<CelestialVisualizationProps> = ({
  selectedSign,
  planetaryPositions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const zodiacObjectsRef = useRef<THREE.Group[]>([]);
  const planetObjectsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 15;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create zodiac circle
    const zodiacGeometry = new THREE.RingGeometry(8, 8.2, 32);
    const zodiacMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const zodiacRing = new THREE.Mesh(zodiacGeometry, zodiacMaterial);
    scene.add(zodiacRing);

    // Create zodiac signs
    zodiacSigns.forEach((sign, index) => {
      const angle = (index / 12) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Create pixel art style sign
      const signGeometry = new THREE.PlaneGeometry(1, 1);
      const signMaterial = new THREE.MeshBasicMaterial({
        color: sign.color,
        transparent: true,
        opacity: 0.8,
      });
      const signMesh = new THREE.Mesh(signGeometry, signMaterial);
      signMesh.position.copy(new THREE.Vector3(x, y, 0));
      signMesh.rotation.z = angle + Math.PI / 2;

      // Add glow effect
      const glowGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: sign.color,
        transparent: true,
        opacity: 0.2,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.set(x, y, -0.1);
      glowMesh.rotation.z = angle + Math.PI / 2;

      const signGroup = new THREE.Group();
      signGroup.add(signMesh);
      signGroup.add(glowMesh);
      scene.add(signGroup);
      zodiacObjectsRef.current.push(signGroup);
    });

    // Create planets
    const planets = [
      { name: 'Sun', color: 0xffd700, size: 0.5 },
      { name: 'Moon', color: 0xffffff, size: 0.4 },
      { name: 'Mars', color: 0xff4d4d, size: 0.3 },
      { name: 'Mercury', color: 0xcccccc, size: 0.3 },
      { name: 'Jupiter', color: 0xffa500, size: 0.6 },
      { name: 'Venus', color: 0xffb6c1, size: 0.4 },
      { name: 'Saturn', color: 0xf4a460, size: 0.5 },
      { name: 'Rahu', color: 0x800080, size: 0.3 },
      { name: 'Ketu', color: 0x4b0082, size: 0.3 },
    ];

    planets.forEach((planet) => {
      const geometry = new THREE.SphereGeometry(planet.size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: planet.color });
      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.position.set(0, 0, 0);
      scene.add(planetMesh);
      planetObjectsRef.current.push(planetMesh);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate zodiac ring
      zodiacRing.rotation.z += 0.001;

      // Update planet positions if provided
      if (planetaryPositions) {
        planetObjectsRef.current.forEach((planet, index) => {
          const angle = (planetaryPositions[Object.keys(planetaryPositions)[index] as keyof typeof planetaryPositions] / 12) * Math.PI * 2;
          const radius = 6;
          planet.position.x = Math.cos(angle) * radius;
          planet.position.y = Math.sin(angle) * radius;
        });
      }

      // Highlight selected sign
      zodiacObjectsRef.current.forEach((sign, index) => {
        const isSelected = zodiacSigns[index].name === selectedSign;
        sign.children.forEach((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = isSelected ? 1 : 0.8;
            if (isSelected) {
              child.material.color.setHex(0xffffff);
            } else {
              child.material.color.setHex(zodiacSigns[index].color);
            }
          }
        });
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] relative"
      data-testid="celestial-visualization"
    />
  );
};

export default CelestialVisualization; 