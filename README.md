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
- Festival calendar
- Interactive learning section
- Mobile-responsive design
- Dark mode support

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Astronomy Engine
- Jest & React Testing Library
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
npm test -- --coverage
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Main application pages
  ├── services/      # API and data handling
  ├── utils/         # Helper functions
  ├── hooks/         # Custom React hooks
  ├── assets/        # Images and static files
  ├── animations/    # SVG and animation files
  ├── contexts/      # React contexts
  └── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Astronomy Engine](https://github.com/cosinekitty/astronomy) for astronomical calculations
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/) 