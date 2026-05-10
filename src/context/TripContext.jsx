import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

const API_URL = 'http://localhost:5001/api';

export const TripProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch trips');
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch trips on mount or when user logs in
  useEffect(() => {
    if (isAuthenticated) fetchTrips();
    else setTrips([]);
  }, [isAuthenticated, fetchTrips]);

  const createTrip = async (tripData) => {
    const res = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(tripData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create trip');
    setTrips(prev => [...prev, data]);
    return data;
  };

  const deleteTrip = async (tripId) => {
    await fetch(`${API_URL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  // Helper: split trips into upcoming vs past based on end_date
  const today = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips.filter(t => t.end_date >= today);
  const pastTrips = trips.filter(t => t.end_date < today);

  return (
    <TripContext.Provider value={{ trips, upcomingTrips, pastTrips, loading, error, fetchTrips, createTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
