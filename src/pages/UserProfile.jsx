import React from 'react';
import { Settings, MapPin, Calendar, Edit3, Heart, Award } from 'lucide-react';
import { dummyTrips } from '../data/dummy';

const UserProfile = () => {
  const upcomingTrips = dummyTrips.filter(t => t.status !== 'completed');
  const pastTrips = [
    { id: 'p1', destination: 'Paris, France', date: 'May 2025', image: 'https://images.unsplash.com/photo-1502602868884-25e173df8374?w=800&q=80' },
    { id: 'p2', destination: 'New York, USA', date: 'Dec 2024', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alex Traveler</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                <MapPin className="w-4 h-4" /> Based in San Francisco, CA
              </p>
            </div>
            <button className="btn-secondary flex items-center gap-2 self-center md:self-start">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
          
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Avid explorer, photography enthusiast, and food lover. Always planning the next adventure and searching for hidden gems around the world.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              <p className="text-sm text-gray-500">Countries</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-500">Trips</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8k</p>
              <p className="text-sm text-gray-500">Photos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Trips */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" /> Upcoming Adventures
          </h2>
          <div className="space-y-4">
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="bg-white dark:bg-dark-card p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer">
                <img src={trip.image} alt={trip.destination} className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-transform" />
                <div className="flex-1 py-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{trip.destination}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trip.startDate} - {trip.endDate}</p>
                  <span className="inline-block px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-semibold rounded-md w-max mt-2 capitalize">{trip.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Trips */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" /> Travel History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pastTrips.map(trip => (
              <div key={trip.id} className="group relative rounded-2xl overflow-hidden h-48 cursor-pointer">
                <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{trip.destination}</h3>
                  <p className="text-white/80 text-sm">{trip.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};

export default UserProfile;
