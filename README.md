# Hindu Panchang Calendar

A modern web application for calculating and displaying Hindu Panchang (almanac) information. Built with React, TypeScript, and Tailwind CSS.

## Features

- Daily Panchang calculations
  - Tithi (Lunar Day)
  - Nakshatra (Lunar Mansion)
  - Yoga
  - Karana
  - Astronomical information (sunrise, sunset, moonrise, moonset)
- Monthly calendar view
- Rashifal (Zodiac) predictions
  - Quick lookup for daily predictions by zodiac sign
  - Personalized birth chart with Nintendo-style pixel art visualization
  - Birth details input for precise rashi calculations
  - Interactive planetary positions display
- Festival calendar
- Interactive learning section
- Celestial visualization with Three.js
- Mobile-responsive design
- Dark mode support

## Rashifal Pixel Art Visualization

The application features a unique Nintendo-style pixel art visualization for personalized rashi (zodiac) information:

- **Pixel Art Rashi Visualizer**: Interactive canvas-based component showing zodiac signs and planetary positions with retro-style animations
- **Birth Details Form**: Nintendo-styled form for entering birth date, time, and location details 
- **Rashi Detail Card**: Detailed information about your rashi characteristics, compatibility, and lucky attributes
- **Visualization Page Integration**: Dedicated view in the Visualization section showing planetary positions in your birth chart

The feature uses:
- Canvas-based rendering with pixel-perfect animations
- "Press Start 2P" Google Font for authentic pixel art typography
- Seeded random number generation for consistent visuals
- Framer Motion for smooth animations and transitions

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Three.js for visualizations
- Framer Motion for animations
- Canvas API for pixel art rendering
- Astronomy Engine for calculations
- Vitest & React Testing Library
- Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hindu-panchang.git
   cd hindu-panchang
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
npm test
```

To run tests with coverage:
```bash
npm run test:coverage
```

To run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  │   └── Rashifal/   # Rashifal-specific components
  │       ├── BirthDetailsForm.tsx          # Form for birth details input
  │       ├── PixelArtRashiVisualizer.tsx   # Pixel art visualization of zodiac wheel
  │       └── RashiDetailCard.tsx           # Detailed rashi information display
  ├── pages/          # Main application pages
  │   ├── Rashifal.tsx      # Rashifal prediction page
  │   └── Visualization.tsx # Visualization page with rashi display
  ├── services/       # API and data handling
  │   └── RashiCalculationService.ts  # Service for rashi calculations
  ├── utils/          # Helper functions
  ├── hooks/          # Custom React hooks
  ├── assets/         # Images and static files
  │   └── pixel-art/  # Pixel art assets for zodiac signs
  ├── animations/     # SVG and animation files
  ├── contexts/       # React contexts
  └── types/          # TypeScript type definitions
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Continuous Integration**: All pull requests to the `main` branch trigger a workflow that runs linting and tests to ensure code quality.
- **Continuous Deployment**: When changes are merged to the `main` branch, the application is automatically built and deployed to GitHub Pages.

### Branch Protection

The `main` branch is protected with the following rules:

1. Pull requests must pass all CI checks before merging
2. Pull requests require at least one review before merging
3. Direct pushes to `main` are not allowed

## Branch Protection Setup

To protect the `main` branch and ensure code quality, follow these steps to set up branch protection rules:

1. Go to your GitHub repository
2. Click on "Settings" > "Branches"
3. Under "Branch protection rules", click "Add rule"
4. In the "Branch name pattern" field, enter `main`
5. Enable the following settings:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (set to at least 1)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Add status check: "test" (this is the CI job that runs tests)
6. Click "Create" to save the rule

These settings ensure that:
- All changes to `main` must go through a pull request
- Pull requests require at least one review
- Tests must pass before merging
- Branches must be up to date with `main` before merging

## Performance Optimizations

The application has been optimized for performance:

- **Memoization**: Used React.memo and useMemo to prevent unnecessary re-renders
- **Seeded Random Generation**: Ensures consistent visuals without excessive recalculations
- **Canvas Performance**: Optimized drawing operations in the pixel art visualizer
- **Efficient State Management**: Minimal state updates to prevent re-renders
- **Error Handling**: Comprehensive error handling in services and components
- **Lazy Loading**: Components are loaded only when needed

## Future Development

- [ ] Implement actual astronomical calculations for accurate rashi determination
- [ ] Add Nakshatra calculations and visualization
- [ ] Integrate with ephemeris data for precise planetary positions
- [ ] Add support for Dasha (planetary period) calculations
- [ ] Implement birth time rectification
- [ ] Add compatibility charts for relationship analysis
- [ ] Create a mobile app version with React Native

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

The application is automatically deployed to GitHub Pages when changes are merged to the `main` branch. You can also manually deploy by running:

```bash
npm run deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Astronomy Engine](https://github.com/cosinekitty/astronomy) for astronomical calculations
- [Three.js](https://threejs.org/) for 3D visualizations
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Google Fonts](https://fonts.google.com/) for "Press Start 2P" font
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/) 