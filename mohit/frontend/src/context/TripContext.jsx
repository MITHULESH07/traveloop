import { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_ITINERARY } from '../data/dummyData';

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(() => {
    const saved = localStorage.getItem('traveloop_active_trip');
    if (saved) return JSON.parse(saved);
    return {
      tripName: "Demo Trip",
      budget: 5000,
      totalEstimatedCost: 0,
      itinerary: DUMMY_ITINERARY
    };
  });

  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  useEffect(() => {
    localStorage.setItem('traveloop_active_trip', JSON.stringify(activeTrip));
  }, [activeTrip]);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiKey);
  }, [geminiKey]);

  const updateItinerary = (newItinerary) => {
    setActiveTrip(prev => ({ ...prev, itinerary: newItinerary }));
  };

  return (
    <TripContext.Provider value={{ activeTrip, setActiveTrip, updateItinerary, geminiKey, setGeminiKey }}>
      {children}
    </TripContext.Provider>
  );
};
