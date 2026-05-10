import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Map, Calendar, DollarSign, MessageSquare, Briefcase, LogOut, User, Search, FileText, Printer } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Compass },
    { name: 'Explore Cities', path: '/explore', icon: Search },
    { name: 'Create Trip', path: '/create', icon: Map },
    { name: 'Itinerary', path: '/itinerary/trip-1', icon: Calendar },
    { name: 'Trip Summary', path: '/summary/trip-1', icon: Printer },
    { name: 'Budget', path: '/budget/trip-1', icon: DollarSign },
    { name: 'Packing List', path: '/pack/trip-1', icon: Briefcase },
    { name: 'Documents', path: '/documents/trip-1', icon: FileText },
    { name: 'AI Guide', path: '/chat', icon: MessageSquare },
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
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
