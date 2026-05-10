import React from 'react';
import { dummyPackingList } from '../data/dummy';
import { Plus, CheckCircle2, Circle } from 'lucide-react';

const PackingList = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg mb-1">Packing Checklist</h1>
          <p className="text-gray-500 dark:text-gray-400">2 of 4 items packed</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-6">
        {dummyPackingList.map(category => (
          <div key={category.id} className="card p-0 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-900 dark:text-white">
              {category.category}
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {category.items.map(item => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer group">
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
                  )}
                  <span className={`text-gray-700 dark:text-gray-300 ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingList;
