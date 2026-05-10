import React, { useState } from 'react';
import { Search, MapPin, Star, Plus, Filter, Navigation } from 'lucide-react';

const activities = [
  { id: 1, title: 'Mount Fuji Day Tour', location: 'Tokyo, Japan', price: 120, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80', category: 'Tours' },
  { id: 2, title: 'Sushi Making Masterclass', location: 'Tokyo, Japan', price: 85, rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', category: 'Food' },
  { id: 3, title: 'Shibuya Crossing Photography', location: 'Tokyo, Japan', price: 45, rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80', category: 'Activities' },
  { id: 4, title: 'Traditional Tea Ceremony', location: 'Kyoto, Japan', price: 60, rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1512423851509-f30f57630e6d?w=800&q=80', category: 'Culture' },
];

const categories = ['All', 'Tours', 'Food', 'Activities', 'Culture', 'Nature'];

const CityGuide = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredActivities = activeCategory === 'All' 
    ? activities 
    : activities.filter(a => a.category === activeCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-primary-600 to-emerald-500 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover activities</h1>
          <p className="text-primary-100 text-lg mb-8">Find the best tours, food, and hidden gems.</p>
          
          <div className="bg-white rounded-2xl p-2 flex items-center shadow-xl">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Search for experiences in Tokyo..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 px-3 outline-none"
            />
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
        <Navigation className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 transform -rotate-45" />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button className="p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-white text-gray-600 dark:bg-dark-card dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-gray-900">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {activity.rating}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
                <MapPin className="w-3.5 h-3.5" /> {activity.location}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-4 flex-1">
                {activity.title}
              </h3>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xs text-gray-500">From </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">${activity.price}</span>
                </div>
                <button className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-2.5 rounded-xl hover:bg-primary-500 hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CityGuide;
