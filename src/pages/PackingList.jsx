import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Loader2, AlertCircle, Trash2, Backpack } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NODE_API = 'http://localhost:5001/api';

const DEFAULT_PACKING_LIST = [
  {
    id: 'cat-1',
    category: 'Essentials',
    items: [
      { id: 'item-1', name: 'Passport & ID', checked: false },
      { id: 'item-2', name: 'Travel Insurance', checked: false },
      { id: 'item-3', name: 'Phone Charger', checked: false }
    ]
  },
  {
    id: 'cat-2',
    category: 'Clothing',
    items: [
      { id: 'item-4', name: 'Comfortable Shoes', checked: false },
      { id: 'item-5', name: 'Jacket', checked: false }
    ]
  }
];

const PackingList = () => {
  const { tripId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [data, setData] = useState(null);
  const [packingList, setPackingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Essentials');

  useEffect(() => {
    if (!tripId || !token) return;
    setLoading(true);
    fetch(`${NODE_API}/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(t => {
        if (t.error) { setError(t.error); return; }
        setTrip(t);
        try {
          const parsed = typeof t.trip_data === 'string' ? JSON.parse(t.trip_data) : t.trip_data;
          setData(parsed);
          setPackingList(parsed?.packingList || DEFAULT_PACKING_LIST);
        } catch {
          setData({});
          setPackingList(DEFAULT_PACKING_LIST);
        }
      })
      .catch(() => setError('Failed to load packing list.'))
      .finally(() => setLoading(false));
  }, [tripId, token]);

  const saveListToDB = async (newList) => {
    setPackingList(newList);
    setSaving(true);
    try {
      const updatedData = { ...data, packingList: newList };
      await fetch(`${NODE_API}/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ trip_data: updatedData })
      });
      setData(updatedData);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = (categoryId, itemId) => {
    const newList = packingList.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
        };
      }
      return cat;
    });
    saveListToDB(newList);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    let newList = [...packingList];
    const catIndex = newList.findIndex(c => c.category === selectedCategory);
    
    const newItem = { id: `item-${Date.now()}`, name: newItemName.trim(), checked: false };

    if (catIndex >= 0) {
      newList[catIndex].items.push(newItem);
    } else {
      newList.push({ id: `cat-${Date.now()}`, category: selectedCategory, items: [newItem] });
    }

    saveListToDB(newList);
    setNewItemName('');
  };

  const removeItem = (categoryId, itemId) => {
    const newList = packingList.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
      }
      return cat;
    }).filter(cat => cat.items.length > 0); // Remove empty categories automatically
    saveListToDB(newList);
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      <span>Loading checklist...</span>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Checklist Not Found</h2>
      <button onClick={() => navigate('/profile')} className="btn-primary mt-2">← Back to Profile</button>
    </div>
  );

  const totalItems = packingList.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItems = packingList.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0);
  const progress = totalItems === 0 ? 0 : (packedItems / totalItems) * 100;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <Backpack className="w-8 h-8 text-primary-500" /> Packing Checklist
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{trip?.destination}</p>
        </div>
        
        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm md:min-w-[200px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-bold text-primary-500">{packedItems} / {totalItems}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          {saving && <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving sync...</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: The List */}
        <div className="md:col-span-2 space-y-6">
          {packingList.map(category => (
            <div key={category.id} className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 font-bold text-gray-900 dark:text-white flex justify-between items-center">
                {category.category}
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                  {category.items.filter(i => i.checked).length}/{category.items.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {category.items.map(item => (
                  <div key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                    <div onClick={() => toggleItem(category.id, item.id)} className="flex items-center gap-4 cursor-pointer flex-1">
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium transition-colors ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                        {item.name}
                      </span>
                    </div>
                    <button onClick={() => removeItem(category.id, item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {packingList.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-dark-card border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
              <p className="text-gray-500">Your packing list is empty.</p>
            </div>
          )}
        </div>

        {/* Right Col: Add Form */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add Item</h3>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sunglasses" 
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="input-field py-2.5 text-sm w-full"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Category</label>
                <input 
                  type="text" 
                  list="categories"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="input-field py-2.5 text-sm w-full"
                  required
                />
                <datalist id="categories">
                  <option value="Essentials" />
                  <option value="Clothing" />
                  <option value="Toiletries" />
                  <option value="Electronics" />
                  <option value="Miscellaneous" />
                </datalist>
              </div>
              <button type="submit" disabled={!newItemName.trim() || saving} className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add to List
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingList;
