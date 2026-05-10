import React from 'react';
import { dummyTrips } from '../data/dummy';
import { MapPin, Calendar, Search, ArrowRight, Wallet, TrendingUp, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const popularDestinations = [
  { id: 'p1', name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', rating: 4.8, price: '$1,200' },
  { id: 'p2', name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80', rating: 4.9, price: '$2,400' },
  { id: 'p3', name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', rating: 4.9, price: '$3,100' },
  { id: 'p4', name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', rating: 4.7, price: '$1,800' },
];

const timelineEvents = [
  { date: 'Oct 15', title: 'Flight to Kyoto', time: '10:00 AM', type: 'flight' },
  { date: 'Oct 15', title: 'Check-in at Ryokan', time: '03:00 PM', type: 'hotel' },
  { date: 'Oct 16', title: 'Bamboo Forest Tour', time: '09:00 AM', type: 'activity' },
];

const Dashboard = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gray-900 text-white min-h-[400px] flex items-center justify-center p-8 group">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"
            alt="Travel Hero"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Discover your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">
              dream destination.
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Plan, track, and budget your trips all in one beautifully crafted workspace.
          </p>

          {/* Search Bar - Glassmorphism */}
          <div className="mt-8 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex flex-col md:flex-row items-center max-w-2xl gap-2 md:gap-0">
            <div className="w-full md:flex-1 flex items-center px-4 py-2 md:py-0 gap-3 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
              <MapPin className="text-white/70 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                className="w-full bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
              />
            </div>
            <div className="hidden md:block h-8 w-px bg-white/20 mx-2"></div>
            <div className="w-full md:flex-1 flex items-center px-4 py-2 md:py-0 gap-3 bg-white/5 md:bg-transparent rounded-xl md:rounded-none mt-2 md:mt-0">
              <Calendar className="text-white/70 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Dates"
                className="w-full bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none"
              />
            </div>
            <button className="w-full md:w-auto mt-2 md:mt-0 bg-primary-500 hover:bg-primary-400 text-white p-3 md:px-6 md:py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 shadow-lg">
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Stats + Popular) */}
        <div className="lg:col-span-2 space-y-10">

          {/* Budget Summary Cards */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Wallet className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 font-medium mb-1 flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Total Trip Budget
                  </p>
                  <h3 className="text-4xl font-bold mb-4">$8,450</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                    <span className="text-gray-400">vs last year</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">Current Trip</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Spent so far</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$1,200 <span className="text-lg text-gray-400 font-normal">/ $3,500</span></h3>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Destinations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
              <button className="text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1 group">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {popularDestinations.map(dest => (
                <div key={dest.id} className="group relative rounded-3xl overflow-hidden h-64 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>

                  {/* Glassmorphism details */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1">{dest.name}</h3>
                        <p className="text-white/90 text-sm flex items-center gap-1">
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
          </section>

        </div>

        {/* Right Column (Upcoming Itinerary & Recent Trips) */}
        <div className="space-y-10">

          {/* Upcoming Itinerary Timeline */}
          <section className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
              <Clock className="w-5 h-5 text-primary-500" /> Upcoming Itinerary
            </h2>
            <div className="relative border-l-2 border-primary-100 dark:border-gray-800 ml-3 space-y-8 z-10">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-2 border-primary-500 ring-4 ring-white dark:ring-dark-card"></div>
                  <div className="mb-1">
                    <span className="text-xs font-bold text-primary-500 tracking-wider uppercase bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md">{event.date} • {event.time}</span>
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-semibold mt-1.5">{event.title}</h4>
                </div>
              ))}
            </div>
            <Link to="/itinerary/trip-1" className="block w-full text-center mt-8 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-transparent hover:border-primary-100 dark:hover:border-primary-900/50">
              View Full Itinerary
            </Link>
          </section>

          {/* Recent Trips Mini */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Trips</h2>
            </div>
            <div className="space-y-3">
              {dummyTrips.map(trip => (
                <Link to={`/itinerary/${trip.id}`} key={trip.id} className="flex gap-4 p-3 bg-white dark:bg-dark-card rounded-2xl hover:shadow-md border border-gray-50 dark:border-gray-800 transition-all group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-primary-500 transition-colors">{trip.destination}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" /> {trip.startDate}
                    </p>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30">
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
