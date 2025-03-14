import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BirthDetails } from '../../services/RashiCalculationService';

/**
 * Interface representing form validation errors
 */
interface FormErrors {
  date?: string;
  time?: string;
  latitude?: string;
  longitude?: string;
  location?: string;
}

interface BirthDetailsFormProps {
  onSubmit: (details: BirthDetails) => void;
  isLoading: boolean;
}

/**
 * BirthDetailsForm Component
 * 
 * A Nintendo-style pixel art form for collecting birth details needed for
 * astrological calculations.
 * 
 * @param onSubmit - Callback function when form is submitted
 * @param isLoading - Boolean indicating if form submission is in progress
 * 
 * @TODO: Add geocoding API integration to auto-populate coordinates based on location name
 * @TODO: Add timezone detection based on coordinates
 */
const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({ onSubmit, isLoading }) => {
  // Predefined locations for easy selection
  const predefinedLocations = [
    { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  ];

  // Form state
  const [details, setDetails] = useState<BirthDetails>({
    date: new Date(),
    time: '12:00',
    latitude: 28.6139, // New Delhi
    longitude: 77.2090, // New Delhi
    timezone: 'Asia/Kolkata',
    location: 'New Delhi, India'
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Touched fields for validation display
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let updatedValue: string | number | Date = value;
    
    // Handle date conversion
    if (name === 'date') {
      updatedValue = new Date(value);
    }
    
    // Handle numeric values
    if (name === 'latitude' || name === 'longitude') {
      updatedValue = parseFloat(value);
    }
    
    setDetails(prev => ({
      ...prev,
      [name]: updatedValue
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Location selection handler
  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = predefinedLocations.find(loc => loc.name === e.target.value);
    
    if (selectedLocation) {
      setDetails(prev => ({
        ...prev,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        timezone: selectedLocation.tz,
        location: selectedLocation.name
      }));
      
      // Mark these fields as touched
      setTouched(prev => ({
        ...prev,
        latitude: true,
        longitude: true,
        timezone: true,
        location: true
      }));
    }
  };

  // Validate form fields whenever they change
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    // Date validation
    if (!details.date) {
      newErrors.date = 'Birth date is required';
    } else {
      const today = new Date();
      if (details.date > today) {
        newErrors.date = 'Birth date cannot be in the future';
      }
    }
    
    // Time validation
    if (!details.time) {
      newErrors.time = 'Birth time is required';
    }
    
    // Latitude validation
    if (isNaN(details.latitude)) {
      newErrors.latitude = 'Latitude must be a number';
    } else if (details.latitude < -90 || details.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    // Longitude validation
    if (isNaN(details.longitude)) {
      newErrors.longitude = 'Longitude must be a number';
    } else if (details.longitude < -180 || details.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    // Location validation
    if (!details.location.trim()) {
      newErrors.location = 'Location name is required';
    }
    
    setErrors(newErrors);
  }, [details]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(details).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Check if form is valid
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return; // Don't submit if there are errors
    }
    
    onSubmit(details);
  };

  // Helper to determine if a field has an error and should show it
  const shouldShowError = (field: string): boolean => {
    return Boolean(touched[field] && errors[field as keyof FormErrors]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <div 
        className="rounded-lg overflow-hidden border-4 border-gray-800 bg-gray-900 text-white shadow-lg" 
        style={{ 
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        <div className="bg-purple-900 p-4 border-b-4 border-gray-800">
          <h3 className="text-lg font-bold text-center" style={{ color: '#FFD700' }}>* BIRTH DETAILS *</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs text-yellow-300">Date of Birth</label>
            <input
              type="date"
              name="date"
              value={details.date.toISOString().split('T')[0]}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border-2 ${
                shouldShowError('date') ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:border-purple-500 focus:outline-none text-white text-sm`}
              style={{ fontFamily: 'inherit' }}
              required
              aria-invalid={shouldShowError('date')}
              aria-describedby={shouldShowError('date') ? 'date-error' : undefined}
            />
            {shouldShowError('date') && (
              <p id="date-error" className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs text-yellow-300">Time of Birth</label>
            <input
              type="time"
              name="time"
              value={details.time}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border-2 ${
                shouldShowError('time') ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:border-purple-500 focus:outline-none text-white text-sm`}
              style={{ fontFamily: 'inherit' }}
              required
              aria-invalid={shouldShowError('time')}
              aria-describedby={shouldShowError('time') ? 'time-error' : undefined}
            />
            {shouldShowError('time') && (
              <p id="time-error" className="text-xs text-red-500 mt-1">{errors.time}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs text-yellow-300">Location</label>
            <select
              onChange={handleLocationSelect}
              value={details.location}
              className={`w-full px-3 py-2 bg-gray-800 border-2 ${
                shouldShowError('location') ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:border-purple-500 focus:outline-none text-white text-sm`}
              style={{ fontFamily: 'inherit' }}
              aria-invalid={shouldShowError('location')}
              aria-describedby={shouldShowError('location') ? 'location-error' : undefined}
            >
              <option value="">-- Select Location --</option>
              {predefinedLocations.map(loc => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
            {shouldShowError('location') && (
              <p id="location-error" className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-xs text-yellow-300">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={details.latitude}
                  onChange={handleChange}
                  step="0.0001"
                  className={`w-full px-3 py-2 bg-gray-800 border-2 ${
                    shouldShowError('latitude') ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:border-purple-500 focus:outline-none text-white text-sm`}
                  style={{ fontFamily: 'inherit' }}
                  required
                  aria-invalid={shouldShowError('latitude')}
                  aria-describedby={shouldShowError('latitude') ? 'latitude-error' : undefined}
                />
                {shouldShowError('latitude') && (
                  <p id="latitude-error" className="text-xs text-red-500 mt-1">{errors.latitude}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-yellow-300">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={details.longitude}
                  onChange={handleChange}
                  step="0.0001"
                  className={`w-full px-3 py-2 bg-gray-800 border-2 ${
                    shouldShowError('longitude') ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:border-purple-500 focus:outline-none text-white text-sm`}
                  style={{ fontFamily: 'inherit' }}
                  required
                  aria-invalid={shouldShowError('longitude')}
                  aria-describedby={shouldShowError('longitude') ? 'longitude-error' : undefined}
                />
                {shouldShowError('longitude') && (
                  <p id="longitude-error" className="text-xs text-red-500 mt-1">{errors.longitude}</p>
                )}
              </div>
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            whileHover={!isLoading && Object.keys(errors).length === 0 ? { scale: 1.05 } : {}}
            whileTap={!isLoading && Object.keys(errors).length === 0 ? { scale: 0.95 } : {}}
            className={`w-full py-3 px-4 rounded-md font-bold text-center ${
              isLoading || Object.keys(errors).length > 0
                ? 'bg-gray-600 cursor-not-allowed opacity-70'
                : 'bg-purple-700 hover:bg-purple-600'
            } transition-colors focus:outline-none`}
            style={{ 
              border: '4px solid #2D3748',
              boxShadow: '0 4px 0 #1A202C',
              color: '#FFD700',
              textShadow: '2px 2px 0 #000'
            }}
            aria-live="polite"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-pulse">*</span>
                <span>CALCULATING</span>
                <span className="animate-pulse">*</span>
              </div>
            ) : (
              'CALCULATE MY RASHI'
            )}
          </motion.button>
          
          {Object.keys(errors).length > 0 && touched.date && (
            <p className="text-xs text-red-400 text-center mt-2">
              Please fix the errors above before submitting.
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default BirthDetailsForm; 