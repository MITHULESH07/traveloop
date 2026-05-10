import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
          <Compass className="w-6 h-6 text-primary-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Traveloop</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to plan your next adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input type="email" required className="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input type="password" required className="input-field" placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
            Remember me
          </label>
          <a href="#" className="text-primary-500 hover:text-primary-600">Forgot password?</a>
        </div>
        <button type="submit" className="w-full btn-primary py-3 mt-4">Sign In</button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account? <Link to="/signup" className="text-primary-500 hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
