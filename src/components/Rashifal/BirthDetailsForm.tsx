import React, { useState } from 'react';
import { BirthDetails, Location } from '../../types/panchang';

interface BirthDetailsFormProps {
  onSubmit: (details: BirthDetails) => void;
}

export default function BirthDetailsForm({ onSubmit }: BirthDetailsFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState<Location>({
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    name: 'New Delhi'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`);
    onSubmit({
      dateTime,
      location,
      name: name || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium pixel-text">Name (Optional)</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pixel-input"
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium pixel-text">Birth Date</label>
        <input
          id="birthDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full pixel-input"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="birthTime" className="block text-sm font-medium pixel-text">Birth Time</label>
        <input
          id="birthTime"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full pixel-input"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="birthPlace" className="block text-sm font-medium pixel-text">Birth Place</label>
        <select
          id="birthPlace"
          value={location.name}
          onChange={(e) => {
            const selectedLocation = {
              'New Delhi': {
                latitude: 28.6139,
                longitude: 77.2090,
                timezone: 'Asia/Kolkata',
                name: 'New Delhi'
              },
              'Mumbai': {
                latitude: 19.0760,
                longitude: 72.8777,
                timezone: 'Asia/Kolkata',
                name: 'Mumbai'
              },
              'Kolkata': {
                latitude: 22.5726,
                longitude: 88.3639,
                timezone: 'Asia/Kolkata',
                name: 'Kolkata'
              },
              'Chennai': {
                latitude: 13.0827,
                longitude: 80.2707,
                timezone: 'Asia/Kolkata',
                name: 'Chennai'
              },
              'Bengaluru': {
                latitude: 12.9716,
                longitude: 77.5946,
                timezone: 'Asia/Kolkata',
                name: 'Bengaluru'
              }
            }[e.target.value] || location;
            
            setLocation(selectedLocation);
          }}
          className="w-full pixel-select"
          required
        >
          <option value="New Delhi">New Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Chennai">Chennai</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </div>

      <button type="submit" className="w-full btn btn-primary">
        Calculate Rashifal
      </button>
    </form>
  );
} 