import React, { useState } from 'react';
import { Search, MapPin, Star, Plus, Filter, Navigation, Loader2, Clock, DollarSign, Cloud, AlertCircle, X, CheckCircle } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

const AI_API = 'http://localhost:5000/api';
const CATEGORIES = ['All', 'Tours', 'Food', 'Culture', 'Nature', 'Nightlife', 'Shopping'];

const FEATURED_CITIES = [
  { name: 'Tokyo', flag: '🇯🇵' }, { name: 'Paris', flag: '🇫🇷' },
  { name: 'Bali', flag: '🇮🇩' }, { name: 'New York', flag: '🇺🇸' },
  { name: 'Dubai', flag: '🇦🇪' }, { name: 'Rome', flag: '🇮🇹' },
  { name: 'Singapore', flag: '🇸🇬' }, { name: 'Istanbul', flag: '🇹🇷' },
];

const CityGuide = () => {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Trip save state
  const [savingActivity, setSavingActivity] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const fetchCity = async (cityName, cat = 'All') => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError('');
    setCityData(null);

    try {
      const res = await fetch(`${AI_API}/city`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName.trim(), category: cat })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCityData(data);
      setActiveCategory('All');
    } catch (err) {
      setError('Failed to load city data. Please check your backend and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCity(searchInput, activeCategory);
  };

  const handleQuickCity = (name) => {
    setSearchInput(name);
    fetchCity(name);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  const filteredActivities = cityData?.activities?.filter(
    a => activeCategory === 'All' || a.category === activeCategory
  ) || [];

  const handleAddToTrip = (activity) => {
    setSavingActivity(activity.title);
    // Simulate quick-add (in a full app you'd pick the trip)
    setTimeout(() => {
      setSavedIds(prev => new Set([...prev, activity.title]));
      setSavingActivity(null);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* Hero Search Header */}
      <div className="bg-gradient-to-r from-primary-600 to-emerald-500 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        <Navigation className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 transform -rotate-45" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Explore Cities</h1>
          <p className="text-primary-100 text-lg mb-6">Real-time activities, food & culture powered by Gemini AI</p>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex items-center shadow-xl gap-2">
            <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search Tokyo, Paris, Bali..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 px-3 outline-none"
            />
            {searchInput && <button type="button" onClick={() => { setSearchInput(''); setCityData(null); setError(''); }}><X className="w-4 h-4 text-gray-400 hover:text-gray-700" /></button>}
            <button type="submit" disabled={loading || !searchInput.trim()} className="bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Quick City Pills */}
      {!cityData && !loading && (
        <div className="flex flex-wrap gap-3">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 self-center">Popular:</span>
          {FEATURED_CITIES.map(c => (
            <button key={c.name} onClick={() => handleQuickCity(c.name)}
              className="px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm">
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-12 flex flex-col items-center gap-4 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white text-lg">Exploring {searchInput}...</p>
            <p className="text-sm text-gray-500 mt-1">Searching the web + generating real-time city guide</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* City Data */}
      {cityData && !loading && (
        <>
          {/* City Hero Card */}
          <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl group">
            <img src={cityData.image} alt={cityData.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-bold text-white">{cityData.city}</h2>
                  <p className="text-white/80 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {cityData.country}</p>
                  <p className="text-white/70 mt-2 max-w-xl text-sm leading-relaxed">{cityData.description}</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm">
                    <p className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Best Time</p>
                    <p className="font-semibold">{cityData.best_time}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm">
                    <p className="text-white/70 text-xs flex items-center gap-1"><DollarSign className="w-3 h-3" /> Daily Budget</p>
                    <p className="font-semibold">{cityData.avg_budget}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm">
                    <p className="text-white/70 text-xs flex items-center gap-1"><Cloud className="w-3 h-3" /> Weather</p>
                    <p className="font-semibold">{cityData.weather}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors text-sm ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-white text-gray-600 dark:bg-dark-card dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                {cat}
                {activeCategory === cat && cat !== 'All' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({cityData.activities?.filter(a => a.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No activities found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredActivities.map((activity, idx) => (
                <div key={idx} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-gray-900">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {Number(activity.rating).toFixed(1)}
                    </div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary-500/90 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                      {activity.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-2">
                      <MapPin className="w-3 h-3" /> {cityData.city}, {cityData.country}
                      <span className="ml-1 text-gray-400">· {activity.reviews?.toLocaleString()} reviews</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2">{activity.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{activity.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-xs text-gray-400">From </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">${activity.price}</span>
                      </div>
                      <button
                        onClick={() => handleAddToTrip(activity)}
                        disabled={savedIds.has(activity.title) || savingActivity === activity.title}
                        className={`p-2.5 rounded-xl transition-all ${
                          savedIds.has(activity.title)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default'
                            : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white'
                        }`}
                      >
                        {savingActivity === activity.title ? <Loader2 className="w-5 h-5 animate-spin" /> :
                          savedIds.has(activity.title) ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Default Empty State */}
      {!cityData && !loading && !error && (
        <div className="text-center py-16 space-y-4">
          <Navigation className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto" />
          <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">Search any city to get started</h3>
          <p className="text-gray-400 dark:text-gray-600 text-sm max-w-md mx-auto">
            Get AI-powered real-time activities, food, culture, and travel tips for any city in the world.
          </p>
        </div>
      )}
    </div>
  );
};

export default CityGuide;
