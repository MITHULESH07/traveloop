import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Loader2, AlertCircle, Plane, Hotel, Coffee, Train, Camera } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NODE_API = 'http://localhost:5001/api';

const COLORS = {
  flight: '#0ea5e9',   // blue
  hotel: '#8b5cf6',    // purple
  food: '#f43f5e',     // rose
  transit: '#f59e0b',  // amber
  activity: '#10b981', // emerald
  other: '#64748b'     // slate
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'flight': return <Plane className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    case 'transit': return <Train className="w-4 h-4" />;
    case 'food': return <Coffee className="w-4 h-4" />;
    default: return <Camera className="w-4 h-4" />;
  }
};

const Budget = () => {
  const { tripId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setData(typeof t.trip_data === 'string' ? JSON.parse(t.trip_data) : t.trip_data);
        } catch {
          setData({});
        }
      })
      .catch(() => setError('Failed to load budget data.'))
      .finally(() => setLoading(false));
  }, [tripId, token]);

  if (loading) return (
    <div className="h-full flex items-center justify-center gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      <span>Loading budget...</span>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Not Found</h2>
      <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      <button onClick={() => navigate('/profile')} className="btn-primary mt-2">← Back to Profile</button>
    </div>
  );

  // Process data from itinerary activities
  const activities = Object.values(data?.activities || {});
  const expenses = activities.filter(a => a.cost > 0);
  
  const totalBudget = Number(trip?.budget) || 0;
  const totalSpent = expenses.reduce((sum, a) => sum + a.cost, 0);
  
  // Group by category for Pie Chart
  const groupedData = expenses.reduce((acc, curr) => {
    const type = curr.type || 'other';
    acc[type] = (acc[type] || 0) + curr.cost;
    return acc;
  }, {});

  const chartData = Object.keys(groupedData).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: groupedData[key],
    fill: COLORS[key] || COLORS.other,
    type: key
  })).sort((a, b) => b.value - a.value); // Sort largest first

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Budget Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">{trip?.destination}</p>
        </div>
        <button onClick={() => navigate(`/itinerary/${tripId}`)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense via Itinerary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics Card */}
        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-6">Expense Breakdown</h3>
          
          {chartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-gray-800 mb-4"></div>
              <p>No expenses logged yet.</p>
            </div>
          ) : (
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="60%" outerRadius="85%" paddingAngle={4} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col pb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium mt-1">Spent</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Budget Overview Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p className="text-gray-400 font-medium mb-1">Total Trip Budget</p>
                <h3 className="text-4xl font-bold">${totalBudget.toLocaleString()}</h3>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Remaining</p>
                <p className={`text-xl font-bold ${totalBudget - totalSpent < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${(totalBudget - totalSpent).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-6 relative z-10">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${totalSpent > totalBudget ? 'bg-red-400' : 'bg-emerald-400'}`} 
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100) || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Recent Expenses List */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Logged Expenses</h3>
            
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Add costs to your itinerary steps to see them here.</p>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {expenses.sort((a, b) => b.cost - a.cost).map(exp => (
                  <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-dark-card shadow-sm text-gray-500 dark:text-gray-400" style={{ color: COLORS[exp.type] }}>
                        {getTypeIcon(exp.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{exp.content}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{exp.type}</p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      ${exp.cost.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
