import React from 'react';
import { Printer, Share2, Download, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

const ItinerarySummary = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Summary</h1>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Printable Area (Simulated) */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
        
        {/* Banner */}
        <div className="relative h-48 bg-gray-900 flex items-center justify-center text-center px-6">
          <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80" alt="Japan" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Japan Explorer 2026</h2>
            <div className="flex items-center justify-center gap-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Oct 15 - Oct 24</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Kyoto & Tokyo</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12">
          
          {/* Day Block */}
          <div className="relative">
            <div className="absolute left-8 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm">
                <span className="text-sm uppercase tracking-wider">Oct</span>
                <span className="text-xl leading-none">15</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Arrival & Kyoto</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Day 1 • Thursday</p>
              </div>
            </div>

            <div className="space-y-6 pl-20">
              <div className="relative">
                <div className="absolute -left-12 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary-500 z-10"></div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Flight NH112 Landing</h4>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Kansai International Airport (KIX)
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 10:00 AM
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-12 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary-500 z-10"></div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Check-in at Kyoto Ryokan</h4>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Gion District, Kyoto
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 03:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day Block */}
          <div className="relative">
            <div className="absolute left-8 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm">
                <span className="text-sm uppercase tracking-wider">Oct</span>
                <span className="text-xl leading-none">16</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Temples & Shrines</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Day 2 • Friday</p>
              </div>
            </div>

            <div className="space-y-6 pl-20">
              <div className="relative">
                <div className="absolute -left-12 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary-500 z-10"></div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Fushimi Inari Shrine</h4>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Fushimi Ward, Kyoto
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 08:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 text-center text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
          Generated via Traveloop • Your personal travel planner
        </div>
      </div>

    </div>
  );
};

export default ItinerarySummary;
