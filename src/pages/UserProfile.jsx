import React from 'react';
import { Settings, MapPin, Calendar, Edit3, Award, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const { upcomingTrips, pastTrips, loading, deleteTrip } = useTrips();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Parse the image URL stored in trip_data JSON
  const getTripImage = (trip) => {
    try {
      const data = typeof trip.trip_data === 'string' ? JSON.parse(trip.trip_data) : trip.trip_data;
      return data?.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
    } catch {
      return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gradient-to-tr from-primary-500 to-primary-300 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{initials}</span>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name || 'Traveler'}</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {user?.email || ''}
              </p>
            </div>
            <button className="btn-secondary flex items-center gap-2 self-center md:self-start">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}! 🌍 Your next adventure awaits.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingTrips.length}</p>
              <p className="text-sm text-gray-500">Upcoming</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pastTrips.length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">#{user?.id || '—'}</p>
              <p className="text-sm text-gray-500">Member ID</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your trips...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Trips from DB */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" /> Upcoming Adventures
            </h2>
            <button onClick={() => navigate('/create')} className="text-sm text-primary-500 hover:underline font-medium">
              + New Trip
            </button>
          </div>

          {!loading && upcomingTrips.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming trips yet.</p>
              <button onClick={() => navigate('/create')} className="btn-primary mt-4 text-sm px-6 py-2">Plan a Trip</button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTrips.map(trip => (
                <div key={trip.id} onClick={() => navigate(`/itinerary/${trip.id}`)} className="bg-white dark:bg-dark-card p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer">
                  <img
                    src={getTripImage(trip)}
                    alt={trip.destination}
                    className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-transform flex-shrink-0"
                  />
                  <div className="flex-1 py-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">{trip.destination}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(trip.start_date)} → {formatDate(trip.end_date)}</p>
                    {trip.budget > 0 && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">Budget: ${Number(trip.budget).toLocaleString()}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                    className="self-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Trips from DB */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" /> Travel History
          </h2>

          {!loading && pastTrips.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No completed trips yet. Go travel! ✈️</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pastTrips.map(trip => (
                <div key={trip.id} onClick={() => navigate(`/itinerary/${trip.id}`)} className="group relative rounded-2xl overflow-hidden h-48 cursor-pointer">
                  <img
                    src={getTripImage(trip)}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-300 transition-colors">{trip.destination}</h3>
                    <p className="text-white/80 text-sm">{formatDate(trip.start_date)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                    className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
