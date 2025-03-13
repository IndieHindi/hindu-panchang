import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Rashi (Zodiac Sign) information
const RASHIS = [
  { name: 'Mesh', symbol: '♈', englishName: 'Aries', element: 'fire', color: '#FF5757', pixelOffset: { x: 0, y: 0 } },
  { name: 'Vrishabha', symbol: '♉', englishName: 'Taurus', element: 'earth', color: '#4CAF50', pixelOffset: { x: 1, y: 0 } },
  { name: 'Mithuna', symbol: '♊', englishName: 'Gemini', element: 'air', color: '#FFEB3B', pixelOffset: { x: 2, y: 0 } },
  { name: 'Karka', symbol: '♋', englishName: 'Cancer', element: 'water', color: '#2196F3', pixelOffset: { x: 3, y: 0 } },
  { name: 'Simha', symbol: '♌', englishName: 'Leo', element: 'fire', color: '#FF9800', pixelOffset: { x: 0, y: 1 } },
  { name: 'Kanya', symbol: '♍', englishName: 'Virgo', element: 'earth', color: '#8BC34A', pixelOffset: { x: 1, y: 1 } },
  { name: 'Tula', symbol: '♎', englishName: 'Libra', element: 'air', color: '#9C27B0', pixelOffset: { x: 2, y: 1 } },
  { name: 'Vrishchika', symbol: '♏', englishName: 'Scorpio', element: 'water', color: '#673AB7', pixelOffset: { x: 3, y: 1 } },
  { name: 'Dhanu', symbol: '♐', englishName: 'Sagittarius', element: 'fire', color: '#F44336', pixelOffset: { x: 0, y: 2 } },
  { name: 'Makara', symbol: '♑', englishName: 'Capricorn', element: 'earth', color: '#795548', pixelOffset: { x: 1, y: 2 } },
  { name: 'Kumbha', symbol: '♒', englishName: 'Aquarius', element: 'air', color: '#03A9F4', pixelOffset: { x: 2, y: 2 } },
  { name: 'Meena', symbol: '♓', englishName: 'Pisces', element: 'water', color: '#00BCD4', pixelOffset: { x: 3, y: 2 } },
];

// Planets for rashi chart
const PLANETS = [
  { name: 'Sun', symbol: '☉', color: '#FFA500', size: 24 },
  { name: 'Moon', symbol: '☽', color: '#FFFFFF', size: 20 },
  { name: 'Mercury', symbol: '☿', color: '#ADD8E6', size: 16 },
  { name: 'Venus', symbol: '♀', color: '#FF69B4', size: 18 },
  { name: 'Mars', symbol: '♂', color: '#FF0000', size: 18 },
  { name: 'Jupiter', symbol: '♃', color: '#FFD700', size: 22 },
  { name: 'Saturn', symbol: '♄', color: '#808080', size: 20 },
  { name: 'Rahu', symbol: '☊', color: '#000000', size: 18 },
  { name: 'Ketu', symbol: '☋', color: '#A52A2A', size: 18 },
];

// Pseudo-random number generator with seed for consistent star patterns
const seededRandom = (seed: number, x: number): number => {
  return Math.sin(seed * x) * 10000 % 1;
};

export interface PlanetPosition {
  planet: string;
  rashi: string;
  degree: number;
}

interface PixelArtRashiVisualizerProps {
  birthDetails?: {
    date: Date;
    time: string;
    latitude: number;
    longitude: number;
  };
  planetPositions?: PlanetPosition[];
  userRashi?: string;
}

/**
 * PixelArtRashiVisualizer - A Nintendo-style pixel art visualization of rashi and planetary positions
 * 
 * This component creates an interactive, animated zodiac wheel visualization with pixel art aesthetics,
 * showing planetary positions within different rashis in a visually engaging format.
 * 
 * @param birthDetails - Optional birth details for personalized calculations
 * @param planetPositions - Array of planetary positions to display
 * @param userRashi - User's main rashi to highlight in the visualization
 * 
 * @TODO: Add support for zooming and panning the visualization
 * @TODO: Implement more planet-specific pixel art animations
 * @TODO: Add option to export the visualization as an image
 */
const PixelArtRashiVisualizer: React.FC<PixelArtRashiVisualizerProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  birthDetails,
  planetPositions = [],
  userRashi
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredRashi, setHoveredRashi] = useState<string | null>(null);
  const [selectedRashi, setSelectedRashi] = useState<string | null>(userRashi || null);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Pixel art settings - defined as constants to avoid recreating on each render
  const PIXEL_SIZE = 8;
  const GRID_SIZE = 32;
  const CANVAS_SIZE = GRID_SIZE * PIXEL_SIZE;
  
  // Animation timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 8); // 8 frames of animation
    }, 200); // Change frame every 200ms for that authentic pixel art animation feel
    
    return () => clearInterval(intervalId);
  }, []);

  // Memoize the selected rashi info to avoid recalculations
  const selectedRashiInfo = useMemo(() => {
    if (!selectedRashi) return null;
    return RASHIS.find(r => r.name === selectedRashi);
  }, [selectedRashi]);

  // Memoize planets in the selected rashi
  const planetsInSelectedRashi = useMemo(() => {
    if (!selectedRashi) return [];
    return planetPositions.filter(p => p.rashi === selectedRashi)
      .map(p => p.planet);
  }, [selectedRashi, planetPositions]);

  // Draw a pixel art symbol for a rashi
  const drawPixelSymbol = useCallback((
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    rashi: typeof RASHIS[0], 
    index: number, 
    brightness: number
  ) => {
    const size = PIXEL_SIZE * 2;
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    
    // Determine color based on element
    let color;
    switch (rashi.element) {
      case 'fire':
        color = `rgba(255, ${100 + animationFrame * 20}, 0, ${brightness})`;
        break;
      case 'earth':
        color = `rgba(0, ${150 + animationFrame * 10}, 0, ${brightness})`;
        break;
      case 'air':
        color = `rgba(${100 + animationFrame * 10}, ${150 + animationFrame * 10}, 255, ${brightness})`;
        break;
      case 'water':
        color = `rgba(0, ${100 + animationFrame * 10}, ${200 + animationFrame * 5}, ${brightness})`;
        break;
      default:
        color = `rgba(255, 255, 255, ${brightness})`;
    }
    
    ctx.fillStyle = color;
    
    // Each zodiac sign gets a unique pixel art representation
    const angleRad = index * (Math.PI / 6);
    
    // Draw the symbol (simple pixel art for each sign)
    switch (rashi.name) {
      case 'Mesh': // Aries - Ram horns
        ctx.fillRect(x - size, y - size/2, size*2, size/2);
        ctx.fillRect(x - size, y - size, size/2, size/2);
        ctx.fillRect(x + size/2, y - size, size/2, size/2);
        break;
      case 'Vrishabha': // Taurus - Bull
        ctx.fillRect(x - size, y - size, size*2, size/2);
        ctx.fillRect(x - size/2, y - size/2, size, size);
        break;
      case 'Mithuna': // Gemini - Twins
        ctx.fillRect(x - size, y - size, size/2, size*2);
        ctx.fillRect(x + size/2, y - size, size/2, size*2);
        ctx.fillRect(x - size/2, y - size/2, size, size/2);
        break;
      case 'Karka': // Cancer - Crab
        ctx.fillRect(x - size/2, y - size/2, size, size);
        ctx.fillRect(x - size, y, size/2, size/2);
        ctx.fillRect(x + size/2, y, size/2, size/2);
        break;
      case 'Simha': // Leo - Lion
        ctx.fillRect(x - size/2, y - size, size, size*2);
        ctx.fillRect(x - size, y, size/2, size/2);
        break;
      case 'Kanya': // Virgo - Virgin
        ctx.fillRect(x - size/2, y - size, size, size);
        ctx.fillRect(x - size/2, y, size/2, size);
        break;
      case 'Tula': // Libra - Scales
        ctx.fillRect(x - size, y, size*2, size/2);
        ctx.fillRect(x - size/2, y - size, size/2, size);
        break;
      case 'Vrishchika': // Scorpio - Scorpion
        ctx.fillRect(x - size, y - size/2, size*2, size/2);
        ctx.fillRect(x + size/2, y, size/2, size);
        break;
      case 'Dhanu': // Sagittarius - Archer
        ctx.fillRect(x - size, y - size/2, size*2, size/2);
        ctx.fillRect(x, y - size, size/2, size/2);
        ctx.fillRect(x, y, size/2, size/2);
        break;
      case 'Makara': // Capricorn - Mountain goat
        ctx.fillRect(x - size, y - size, size, size);
        ctx.fillRect(x, y - size/2, size, size/2);
        break;
      case 'Kumbha': // Aquarius - Water bearer
        ctx.fillRect(x - size, y - size/2, size*2, size/2);
        ctx.fillRect(x - size/2, y, size, size/2);
        break;
      case 'Meena': // Pisces - Fish
        ctx.fillRect(x - size, y - size/2, size/2, size);
        ctx.fillRect(x + size/2, y - size/2, size/2, size);
        ctx.fillRect(x - size/2, y - size/2, size, size/2);
        break;
    }
    
    // Add rashi label for highlighted rashis only
    if (rashi.name === hoveredRashi || rashi.name === selectedRashi) {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${PIXEL_SIZE * 1.5}px "Press Start 2P", monospace`;
      
      // Position text outside the wheel
      const textRadius = (CANVAS_SIZE / 2) - PIXEL_SIZE * 2;
      const textX = centerX + textRadius * Math.cos(angleRad);
      const textY = centerY + textRadius * Math.sin(angleRad);
      ctx.fillText(rashi.symbol, textX, textY);
    }
  }, [animationFrame, hoveredRashi, selectedRashi, CANVAS_SIZE, PIXEL_SIZE]);

  // Draw a planet in pixel art style
  const drawPixelPlanet = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, planet: typeof PLANETS[0], frame: number) => {
    const baseSize = planet.size / 12 * PIXEL_SIZE;
    
    // Add pulsing animation based on frame
    const pulseSize = baseSize + (frame % 2) * (PIXEL_SIZE / 4);
    
    // Use the planet's color
    ctx.fillStyle = planet.color;
    
    // Draw pixel art planet (simple shapes with different patterns per planet)
    switch (planet.name) {
      case 'Sun':
        // Sun with rays
        ctx.fillRect(x - pulseSize/2, y - pulseSize/2, pulseSize, pulseSize);
        if (frame % 2 === 0) {
          // Rays animation
          ctx.fillRect(x - pulseSize, y, pulseSize/2, PIXEL_SIZE/2);
          ctx.fillRect(x + pulseSize/2, y, pulseSize/2, PIXEL_SIZE/2);
          ctx.fillRect(x, y - pulseSize, PIXEL_SIZE/2, pulseSize/2);
          ctx.fillRect(x, y + pulseSize/2, PIXEL_SIZE/2, pulseSize/2);
        } else {
          // Alternate rays
          ctx.fillRect(x - pulseSize, y - pulseSize, PIXEL_SIZE/2, PIXEL_SIZE/2);
          ctx.fillRect(x + pulseSize/2, y - pulseSize, PIXEL_SIZE/2, PIXEL_SIZE/2);
          ctx.fillRect(x - pulseSize, y + pulseSize/2, PIXEL_SIZE/2, PIXEL_SIZE/2);
          ctx.fillRect(x + pulseSize/2, y + pulseSize/2, PIXEL_SIZE/2, PIXEL_SIZE/2);
        }
        break;
      case 'Moon': {
        // Crescent moon
        ctx.fillRect(x - pulseSize/2, y - pulseSize/2, pulseSize, pulseSize);
        ctx.fillStyle = '#000033'; // Background color
        const offsetX = (frame % 2) * (PIXEL_SIZE/4);
        ctx.fillRect(x - pulseSize/2 + offsetX, y - pulseSize/2, pulseSize/2, pulseSize);
        break;
      }
      default:
        // Default circular planet
        ctx.fillRect(x - pulseSize/2, y - pulseSize/2, pulseSize, pulseSize);
    }
    
    // Add planet symbol
    ctx.fillStyle = 'white';
    ctx.font = `${PIXEL_SIZE}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(planet.symbol, x, y);
  }, [PIXEL_SIZE]);

  // Draw pixelated starry background
  const drawPixelatedBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Dark blue background
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw stars with consistent pattern but twinkling based on animation frame
    ctx.fillStyle = '#FFFFFF';
    const starSeed = 12345;
    
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(seededRandom(starSeed, i) * CANVAS_SIZE / PIXEL_SIZE) * PIXEL_SIZE;
      const y = Math.floor(seededRandom(starSeed, i+100) * CANVAS_SIZE / PIXEL_SIZE) * PIXEL_SIZE;
      
      // Make some stars twinkle based on animation frame
      if (i % 8 === animationFrame % 8) {
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
      } else if (seededRandom(starSeed, i) > 0.7) {
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }, [animationFrame, CANVAS_SIZE, PIXEL_SIZE]);

  // Draw the zodiac wheel in pixel art style
  const drawZodiacWheel = useCallback((ctx: CanvasRenderingContext2D) => {
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = (CANVAS_SIZE / 2) - PIXEL_SIZE * 4;
    
    // Draw wheel outline
    ctx.strokeStyle = '#FFD700';  // Golden outline
    ctx.lineWidth = PIXEL_SIZE;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw zodiac houses (rashis) in pixel art style
    RASHIS.forEach((rashi, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = centerX + radius * 0.75 * Math.cos(angle);
      const y = centerY + radius * 0.75 * Math.sin(angle);
      
      // Determine if this rashi should be highlighted
      const isHighlighted = rashi.name === hoveredRashi || rashi.name === selectedRashi;
      const cellSize = PIXEL_SIZE * 3;
      const colorBrightness = isHighlighted ? 1 : 0.7;
      
      // Draw pixel art symbol
      drawPixelSymbol(ctx, x, y, rashi, index, colorBrightness);
      
      // Add animation effect for highlighted rashi
      if (isHighlighted && animationFrame % 2 === 0) {
        ctx.strokeStyle = rashi.color;
        ctx.lineWidth = PIXEL_SIZE / 2;
        ctx.strokeRect(
          x - cellSize, 
          y - cellSize, 
          cellSize * 2, 
          cellSize * 2
        );
      }
    });
  }, [animationFrame, hoveredRashi, selectedRashi, CANVAS_SIZE, PIXEL_SIZE, drawPixelSymbol]);

  // Draw planet positions
  const drawPlanets = useCallback((ctx: CanvasRenderingContext2D) => {
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = (CANVAS_SIZE / 2) - PIXEL_SIZE * 8;
    
    planetPositions.forEach((position) => {
      // Find the planet and rashi
      const planet = PLANETS.find(p => p.name === position.planet);
      const rashiIndex = RASHIS.findIndex(r => r.name === position.rashi);
      
      if (planet && rashiIndex >= 0) {
        // Calculate position in the wheel
        const baseAngle = rashiIndex * 30;
        const degreeAngle = position.degree;
        const totalAngle = (baseAngle + degreeAngle - 90) * (Math.PI / 180);
        
        const x = centerX + radius * Math.cos(totalAngle);
        const y = centerY + radius * Math.sin(totalAngle);
        
        // Draw pixel art planet
        drawPixelPlanet(ctx, x, y, planet, animationFrame);
      }
    });
  }, [planetPositions, animationFrame, CANVAS_SIZE, PIXEL_SIZE, drawPixelPlanet]);

  // Highlight a specific rashi sector
  const highlightRashi = useCallback((ctx: CanvasRenderingContext2D, rashiName: string) => {
    const rashiIndex = RASHIS.findIndex(r => r.name === rashiName);
    if (rashiIndex < 0) return;
    
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = (CANVAS_SIZE / 2) - PIXEL_SIZE * 4;
    
    // Highlight the sector of the wheel with pulsing effect
    const startAngle = (rashiIndex * 30 - 15) * (Math.PI / 180);
    const endAngle = (rashiIndex * 30 + 15) * (Math.PI / 180);
    
    ctx.fillStyle = `rgba(255, 255, 200, ${0.1 + (animationFrame % 4) * 0.05})`;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }, [animationFrame, CANVAS_SIZE, PIXEL_SIZE]);

  // Canvas drawing main effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and prepare canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.imageSmoothingEnabled = false;
    
    // Draw each layer
    drawPixelatedBackground(ctx);
    drawZodiacWheel(ctx);
    drawPlanets(ctx);
    
    // Draw highlighted rashi if any
    if (selectedRashi) {
      highlightRashi(ctx, selectedRashi);
    }
    
    // TODO: Add more visual effects for special planetary configurations
    // TODO: Implement zoom and pan functionality
    
  }, [
    animationFrame, 
    hoveredRashi, 
    selectedRashi, 
    planetPositions, 
    userRashi, 
    drawPixelatedBackground,
    drawZodiacWheel, 
    drawPlanets, 
    highlightRashi,
    CANVAS_SIZE
  ]);

  // Handle mouse movement over the canvas
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate center and radius
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = (CANVAS_SIZE / 2) - PIXEL_SIZE * 4;
    
    // Calculate angle from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Check if within wheel bounds
    if (distance < radius && distance > radius * 0.5) {
      // Calculate angle in degrees
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      
      // Convert to rashi index (0-11) - add 90 to adjust for our coordinate system
      const rashiIndex = Math.floor(((angle + 90) % 360) / 30);
      setHoveredRashi(RASHIS[rashiIndex]?.name || null);
    } else {
      setHoveredRashi(null);
    }
  }, [CANVAS_SIZE, PIXEL_SIZE]);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredRashi(null);
  }, []);
  
  const handleClick = useCallback(() => {
    if (hoveredRashi) {
      setSelectedRashi(hoveredRashi);
    }
  }, [hoveredRashi]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative border-4 border-gray-800 rounded-lg p-2 bg-gray-900 shadow-lg pixelated"
        style={{ 
          imageRendering: 'pixelated',
          width: CANVAS_SIZE + 16, 
          height: CANVAS_SIZE + 16,
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)' 
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
          aria-label="Interactive Rashi Wheel Visualization"
        />
      </motion.div>
      
      {/* Rashi Info Card */}
      {selectedRashi && selectedRashiInfo && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-white max-w-sm"
          style={{ 
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '12px',
            lineHeight: '1.5',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">
              {selectedRashiInfo.symbol}
            </span>
            <div>
              <h3 className="text-yellow-300">{selectedRashiInfo.name}</h3>
              <p className="text-xs text-gray-400">
                {selectedRashiInfo.englishName}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            <div>
              <span className="text-gray-400">Element:</span>
              <p className="text-white">
                {selectedRashiInfo.element}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Planets:</span>
              <p className="text-white">
                {planetsInSelectedRashi.length > 0 
                  ? planetsInSelectedRashi.join(', ') 
                  : 'None'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PixelArtRashiVisualizer; 