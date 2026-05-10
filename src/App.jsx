import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

// Lazy loading pages could be added here, but static imports for starter code
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import Budget from './pages/Budget';
import Chatbot from './pages/Chatbot';
import PackingList from './pages/PackingList';
import UserProfile from './pages/UserProfile';
import CityGuide from './pages/CityGuide';
import Documents from './pages/Documents';
import ItinerarySummary from './pages/ItinerarySummary';

function App() {
  // Check local storage for theme preference, default to dark mode for a modern look
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Simple auth state for demo - default to false so user sees login animation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAnimation(true);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white dark:bg-dark-card shadow-sm">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <AnimatePresence>
        {showAnimation && <PageTransition onComplete={() => setShowAnimation(false)} />}
      </AnimatePresence>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        <Sidebar onLogout={() => setIsAuthenticated(false)} />
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <Topbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateTrip />} />
                <Route path="/itinerary/:tripId" element={<ItineraryBuilder />} />
                <Route path="/budget/:tripId" element={<Budget />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/pack/:tripId" element={<PackingList />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/explore" element={<CityGuide />} />
                <Route path="/documents/:tripId" element={<Documents />} />
                <Route path="/summary/:tripId" element={<ItinerarySummary />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
