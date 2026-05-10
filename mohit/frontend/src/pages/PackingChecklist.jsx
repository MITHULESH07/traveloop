import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { CheckCircle2, Circle, Plus, Trash2, Package, Smartphone, Shirt, Bath } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'essentials', label: 'Essentials', icon: Package, defaultItems: ['Passport / ID', 'Wallet & Cash', 'Travel Insurance', 'Tickets / Boarding Pass'] },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, defaultItems: ['Phone Charger', 'Power Bank', 'Headphones', 'Universal Adapter'] },
  { id: 'clothing', label: 'Clothing', icon: Shirt, defaultItems: ['Underwear', 'Socks', 'T-Shirts', 'Pants / Shorts', 'Sleepwear', 'Jacket'] },
  { id: 'toiletries', label: 'Toiletries', icon: Bath, defaultItems: ['Toothbrush', 'Toothpaste', 'Deodorant', 'Shampoo', 'Sunscreen'] }
];

const PackingChecklist = () => {
  const { activeTrip, setActiveTrip } = useTrip();
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('essentials');

  // Initialize packing list if it doesn't exist on the active trip
  useEffect(() => {
    if (activeTrip && !activeTrip.packingList) {
      const initialList = [];
      DEFAULT_CATEGORIES.forEach(cat => {
        cat.defaultItems.forEach(item => {
          initialList.push({ id: `${cat.id}-${item}`, text: item, category: cat.id, packed: false });
        });
      });
      setActiveTrip(prev => ({ ...prev, packingList: initialList }));
    }
  }, [activeTrip, setActiveTrip]);

  const packingList = activeTrip?.packingList || [];

  const toggleItem = (id) => {
    const updated = packingList.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setActiveTrip(prev => ({ ...prev, packingList: updated }));
  };

  const deleteItem = (id) => {
    const updated = packingList.filter(item => item.id !== id);
    setActiveTrip(prev => ({ ...prev, packingList: updated }));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: selectedCategory,
      packed: false
    };

    setActiveTrip(prev => ({ ...prev, packingList: [...prev.packingList, newItem] }));
    setNewItemText('');
  };

  const stats = useMemo(() => {
    const total = packingList.length;
    const packed = packingList.filter(i => i.packed).length;
    const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
    return { total, packed, percentage };
  }, [packingList]);

  if (!activeTrip) {
    return <div className="text-center py-20 text-slate-500">No active trip found. Please plan a trip first!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Packing Checklist</h1>
          <p className="text-slate-500 mt-2">Get ready for your trip to {activeTrip.tripName.replace('Trip to ', '')}. Don't forget the essentials!</p>
        </div>
        
        {/* Progress Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[200px]">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-700">Packing Progress</span>
            <span className="text-xl font-black text-primary-600">{stats.percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              className="bg-primary-500 h-full rounded-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">{stats.packed} of {stats.total} packed</p>
        </div>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={addItem} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500 font-medium text-slate-700"
        >
          {DEFAULT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Add a new item to pack..." 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
        />
        <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
          <Plus size={18} /> Add Item
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_CATEGORIES.map((category, idx) => {
          const items = packingList.filter(i => i.category === category.id);
          const Icon = category.icon;
          
          if (items.length === 0) return null;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={category.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{category.label}</h2>
              </div>
              
              <div className="space-y-3">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors group cursor-pointer ${item.packed ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <button className={`${item.packed ? 'text-green-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                        {item.packed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      <span className={`font-medium transition-all ${item.packed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PackingChecklist;
