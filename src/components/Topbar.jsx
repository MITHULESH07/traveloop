import React from 'react';
import { Moon, Sun, Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="h-16 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 z-10 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips, destinations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <Link to="/profile" className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-primary-300 overflow-hidden cursor-pointer border-2 border-white dark:border-gray-800 shadow-sm block">
          <img src="https://i.pravatar.cc/150?img=32" alt="User Avatar" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
