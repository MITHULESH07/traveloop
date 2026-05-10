import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin, Wallet } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/dummyData';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

const Dashboard = () => {
  const { activeTrip } = useTrip();

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Ready for your next adventure?</h1>
          <p className="text-primary-100 text-lg max-w-xl mb-8">
            Plan, organize, and track your trips with ease. Use our AI to build real itineraries within your exact budget constraints.
          </p>
          <Link to="/create-trip" className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors shadow-lg shadow-black/10">
            <Plane size={20} />
            Plan New Trip with AI
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Trips", value: "1", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Countries Planned", value: "1", icon: MapPin, color: "text-green-500", bg: "bg-green-50" },
          { title: "Total Budget", value: `$${activeTrip?.budget || 0}`, icon: Wallet, color: "text-purple-500", bg: "bg-purple-50" },
          { title: "Activities", value: activeTrip?.itinerary?.reduce((acc, day) => acc + day.activities.length, 0) || 0, icon: Plane, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Your Current Trip</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Link to="/itinerary/1">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group"
              >
                <div className="h-48 overflow-hidden relative bg-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <h3 className="absolute bottom-6 left-6 text-white font-bold text-3xl z-20">{activeTrip?.tripName || 'No Trip Yet'}</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center text-slate-600 text-sm gap-4">
                    <span className="flex items-center gap-1"><Wallet size={16} /> Budget: ${activeTrip?.budget || 0}</span>
                    <span className="flex items-center gap-1"><MapPin size={16} /> Days: {activeTrip?.itinerary?.length || 0}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Popular Destinations</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                <img src={dest.image} alt={dest.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{dest.name}</h4>
                  <p className="text-sm text-slate-500">Explore itineraries</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
