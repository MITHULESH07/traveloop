import React from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

const CreateTrip = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-500">
      <h1 className="heading-lg">Plan a New Trip</h1>
      
      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Where to?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" className="input-field pl-10 py-3 text-lg" placeholder="e.g. Paris, France" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dates</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" className="input-field pl-10" placeholder="Select date range" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travelers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="number" min="1" defaultValue="2" className="input-field pl-10" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Budget (Optional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input type="number" className="input-field pl-8" placeholder="0.00" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button className="btn-secondary">Cancel</button>
          <button className="btn-primary px-8">Create Trip</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
