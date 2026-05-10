import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, ArrowRight, Wallet, TrendingUp, Clock, Star, Loader2, X, Mountain, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const AI_API = 'http://localhost:5000/api';

const timelineEvents = [
  { date: 'Oct 15', title: 'Flight to Kyoto', time: '10:00 AM', type: 'flight' },
  { date: 'Oct 15', title: 'Check-in at Ryokan', time: '03:00 PM', type: 'hotel' },
  { date: 'Oct 16', title: 'Bamboo Forest Tour', time: '09:00 AM', type: 'activity' },
];

const Dashboard = () => {
  const { trips, upcomingTrips, loading: tripsLoading, createTrip } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);

  const getTripImage = (trip) => {
    try {
      const d = typeof trip.trip_data === 'string' ? JSON.parse(trip.trip_data) : trip.trip_data;
      return d?.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
    } catch { return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'; }
  };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  // ── Trending Destinations (real-time from backend) ────────────────────────
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('traveloop_trending');
    if (cached) { setTrending(JSON.parse(cached)); setTrendingLoading(false); return; }

    fetch(`${AI_API}/trending`)
      .then(r => r.json())
      .then(data => {
        setTrending(data);
        sessionStorage.setItem('traveloop_trending', JSON.stringify(data));
      })
      .catch(() => setTrending([]))
      .finally(() => setTrendingLoading(false));
  }, []);

  // ── Hero Search ───────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveForm, setSaveForm] = useState({ start_date: '', end_date: '', budget: '' });
  const [saving, setSaving] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);
    setSearchError('');
    setShowSaveForm(false);

    try {
      const res = await fetch(`${AI_API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSearchResult(data);
      setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setSearchError('Could not fetch destination info. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveSearchedTrip = async () => {
    if (!saveForm.start_date || !saveForm.end_date) return;
    setSaving(true);
    try {
      await createTrip({
        destination: searchResult.name,
        start_date: saveForm.start_date,
        end_date: saveForm.end_date,
        budget: Number(saveForm.budget) || 0,
        image_url: searchResult.image
      });
      navigate('/profile');
    } catch (err) { alert('Failed to save trip: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gray-900 text-white min-h-[400px] flex items-center justify-center p-8 group">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80" alt="Travel Hero" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}! ✈️<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">
              Where to next?
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">Search any city or country and get real-time travel intel powered by AI.</p>
          <form onSubmit={handleSearch} className="mt-8 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex flex-col md:flex-row items-center max-w-2xl gap-2 md:gap-0">
            <div className="w-full md:flex-1 flex items-center px-4 py-2 gap-3 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
              <MapPin className="text-white/70 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Tokyo, Santorini, Patagonia..."
                className="w-full bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
              />
              {searchQuery && <button type="button" onClick={() => { setSearchQuery(''); setSearchResult(null); setSearchError(''); }} className="text-white/60 hover:text-white"><X className="w-4 h-4" /></button>}
            </div>
            <button type="submit" disabled={searchLoading || !searchQuery.trim()} className="w-full md:w-auto mt-2 md:mt-0 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-white p-3 md:px-6 md:py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 shadow-lg">
              {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> <span>Explore</span></>}
            </button>
          </form>
        </div>
      </section>

      {/* Real-time Search Result Card */}
      {(searchLoading || searchResult || searchError) && (
        <section ref={searchRef} className="animate-in fade-in slide-in-from-top-4 duration-500">
          {searchLoading && (
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-8 flex items-center gap-4 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Searching the web for "{searchQuery}"...</p>
                <p className="text-sm text-gray-500 mt-1">Powered by Gemini AI + live web scraping</p>
              </div>
            </div>
          )}
          {searchError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-6 text-red-600 dark:text-red-400 text-sm">{searchError}</div>
          )}
          {searchResult && !searchLoading && (
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-md">
              <div className="relative h-56">
                <img src={searchResult.image} alt={searchResult.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">{searchResult.name}</h2>
                  <p className="text-white/80 text-sm">{searchResult.country}</p>
                </div>
                <button onClick={() => setSearchResult(null)} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{searchResult.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {searchResult.highlights?.map((h, i) => (
                    <div key={i} className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl p-3 text-xs font-medium text-center">
                      {h}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span><strong>Best Time:</strong> {searchResult.best_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 text-primary-500" />
                    <span><strong>Avg Cost:</strong> {searchResult.avg_cost}</span>
                  </div>
                </div>

                {showSaveForm ? (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Plan your trip to {searchResult.name}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="date" value={saveForm.start_date} onChange={e => setSaveForm(p => ({ ...p, start_date: e.target.value }))} className="input-field pl-9 py-2 text-sm w-full" placeholder="Start date" />
                      </div>
                      <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="date" value={saveForm.end_date} min={saveForm.start_date} onChange={e => setSaveForm(p => ({ ...p, end_date: e.target.value }))} className="input-field pl-9 py-2 text-sm w-full" />
                      </div>
                    </div>
                    <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="number" placeholder="Budget (optional)" value={saveForm.budget} onChange={e => setSaveForm(p => ({ ...p, budget: e.target.value }))} className="input-field pl-9 py-2 text-sm w-full" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowSaveForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                      <button onClick={handleSaveSearchedTrip} disabled={saving || !saveForm.start_date || !saveForm.end_date}
                        className="btn-primary py-2 px-6 text-sm flex items-center gap-2 disabled:opacity-60">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} ✈️ Save Trip
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowSaveForm(true)} className="btn-primary py-3 px-8 flex items-center gap-2">
                    <Mountain className="w-4 h-4" /> Plan a Trip Here
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">

          {/* Budget Summary */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500"><Wallet className="w-32 h-32" /></div>
                <div className="relative z-10">
                  <p className="text-gray-400 font-medium mb-1 flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Trip Budget</p>
                  <h3 className="text-4xl font-bold mb-4">${totalBudget.toLocaleString()}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" /> {trips.length} trip{trips.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-400">planned</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-500"><TrendingUp className="w-6 h-6" /></div>
                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">Upcoming</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Next trip</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{upcomingTrips[0]?.destination || 'No trips yet'}</h3>
                  {upcomingTrips[0] && <p className="text-sm text-gray-400 mt-1">{formatDate(upcomingTrips[0].start_date)}</p>}
                </div>
                <Link to="/create" className="block text-center mt-4 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-xl transition-colors">
                  + Add New Trip
                </Link>
              </div>
            </div>
          </section>

          {/* Trending Now — Real-time from Gemini AI */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
                  Real-time · Updated by Gemini AI
                </p>
              </div>
              <button onClick={() => { sessionStorage.removeItem('traveloop_trending'); setTrendingLoading(true); fetch(`${AI_API}/trending`).then(r => r.json()).then(d => { setTrending(d); sessionStorage.setItem('traveloop_trending', JSON.stringify(d)); }).finally(() => setTrendingLoading(false)); }} className="text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1 group text-sm">
                Refresh <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {trendingLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trending.map((dest, idx) => (
                  <div key={idx} className="group relative rounded-3xl overflow-hidden h-64 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    onClick={() => { setSearchQuery(dest.name); }}>
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-white font-bold text-lg leading-tight mb-1">{dest.name}</h3>
                          <p className="text-white/80 text-xs">{dest.tagline}</p>
                          <p className="text-white/90 text-sm flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> <span className="font-medium">{dest.rating}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-xs mb-0.5">Starting from</p>
                          <p className="text-white font-bold text-lg leading-none">{dest.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          {/* Upcoming Itinerary */}
          <section className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative z-10"><Clock className="w-5 h-5 text-primary-500" /> Upcoming Itinerary</h2>
            <div className="relative border-l-2 border-primary-100 dark:border-gray-800 ml-3 space-y-8 z-10">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-2 border-primary-500 ring-4 ring-white dark:ring-dark-card"></div>
                  <div className="mb-1"><span className="text-xs font-bold text-primary-500 tracking-wider uppercase bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md">{event.date} • {event.time}</span></div>
                  <h4 className="text-gray-900 dark:text-white font-semibold mt-1.5">{event.title}</h4>
                </div>
              ))}
            </div>
            <Link to="/itinerary/trip-1" className="block w-full text-center mt-8 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors border border-transparent hover:border-primary-100 dark:hover:border-primary-900/50">
              View Full Itinerary
            </Link>
          </section>

          {/* Your Trips from DB */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Trips</h2>
              <Link to="/create" className="text-sm text-primary-500 hover:underline font-medium">+ New Trip</Link>
            </div>
            {tripsLoading ? (
              <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>)}</div>
            ) : trips.length === 0 ? (
              <div className="bg-white dark:bg-dark-card border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No trips yet. Start planning!</p>
                <Link to="/create" className="btn-primary text-sm px-5 py-2 inline-block">Plan a Trip</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 4).map(trip => (
                  <Link to={`/itinerary/${trip.id}`} key={trip.id} className="flex gap-4 p-3 bg-white dark:bg-dark-card rounded-2xl hover:shadow-md border border-gray-50 dark:border-gray-800 transition-all group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={getTripImage(trip)} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-center min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-primary-500 transition-colors truncate">{trip.destination}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(trip.start_date)}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                        {new Date(trip.end_date) >= new Date() ? 'upcoming' : 'completed'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
