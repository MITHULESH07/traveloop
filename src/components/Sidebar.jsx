import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Map, Calendar, DollarSign, MessageSquare, Briefcase, LogOut, Search, FileText, Printer, Globe } from 'lucide-react';
import { useTrips } from '../context/TripContext';

const Sidebar = ({ onLogout }) => {
  const { trips } = useTrips();
  const navigate = useNavigate();

  // Get the most relevant trip ID (first upcoming, or latest)
  const today = new Date().toISOString().split('T')[0];
  const activeTripId = trips.find(t => t.end_date >= today)?.id || trips[0]?.id || null;

  const handleTripNav = (basePath) => {
    if (activeTripId) {
      navigate(`${basePath}/${activeTripId}`);
    } else {
      navigate('/create');
    }
  };

  const staticItems = [
    { name: 'Dashboard', path: '/', icon: Compass },
    { name: '3D Globe', path: '/globe', icon: Globe },
    { name: 'Explore Cities', path: '/explore', icon: Search },
    { name: 'Create Trip', path: '/create', icon: Map },
    { name: 'AI Guide', path: '/chat', icon: MessageSquare },
  ];

  const tripItems = [
    { name: 'Itinerary', base: '/itinerary', icon: Calendar },
    { name: 'Trip Summary', base: '/summary', icon: Printer },
    { name: 'Budget', base: '/budget', icon: DollarSign },
    { name: 'Packing List', base: '/pack', icon: Briefcase },
    { name: 'Documents', base: '/documents', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-gray-800 flex flex-col transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-primary-500">
          <Compass className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Traveloop</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Static nav items */}
        {staticItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.name} to={item.path} end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }>
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}

        {/* Trip-dependent items */}
        {tripItems.length > 0 && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                {activeTripId ? 'Current Trip' : 'Trip Tools'}
              </p>
            </div>
            {tripItems.map((item) => {
              const Icon = item.icon;
              const fullPath = activeTripId ? `${item.base}/${activeTripId}` : item.base;
              return (
                <button key={item.name} onClick={() => handleTripNav(item.base)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left ${
                    !activeTripId
                      ? 'text-gray-400 dark:text-gray-600 cursor-pointer'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  title={!activeTripId ? 'Create a trip first' : item.name}>
                  <Icon className="w-5 h-5" />
                  {item.name}
                  {!activeTripId && <span className="ml-auto text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">No trip</span>}
                </button>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
