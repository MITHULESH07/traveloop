import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useMemo } from 'react';

const BudgetAnalytics = () => {
  const { activeTrip } = useTrip();

  const data = useMemo(() => {
    if (!activeTrip?.itinerary) return [];
    
    let transport = 0, hotel = 0, food = 0, activities = 0;
    
    activeTrip.itinerary.forEach(day => {
      day.activities.forEach(act => {
        const type = act.type.toLowerCase();
        if (type.includes('transport') || type.includes('flight')) transport += act.cost;
        else if (type.includes('hotel') || type.includes('stay') || type.includes('inn')) hotel += act.cost;
        else if (type.includes('food') || type.includes('dinner') || type.includes('lunch')) food += act.cost;
        else activities += act.cost;
      });
    });

    return [
      { name: 'Transport', value: transport, color: '#f97316' },
      { name: 'Hotel', value: hotel, color: '#a855f7' },
      { name: 'Food', value: food, color: '#22c55e' },
      { name: 'Activities', value: activities, color: '#3b82f6' },
    ].filter(item => item.value > 0);
  }, [activeTrip]);

  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);
  const budget = activeTrip?.budget || 0;
  const remaining = budget - totalSpent;
  const days = activeTrip?.itinerary?.length || 1;

  if (!activeTrip) {
    return <div className="text-center py-20 text-slate-500">No active trip found. Please plan a trip first.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Budget Breakdown</h1>
        <p className="text-slate-500 mt-2">Track your expenses for {activeTrip.tripName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-3xl text-white shadow-lg">
          <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-primary-100 font-medium">Total Budget Target</p>
          <h2 className="text-4xl font-bold mt-1">${budget.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${remaining >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Remaining (Estimate)</p>
              <h3 className={`text-2xl font-bold ${remaining >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                ${remaining.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Daily Avg Spent</p>
              <h3 className="text-2xl font-bold text-slate-800">${(totalSpent / days).toFixed(0)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6">Expense Distribution</h3>
          {data.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `$${value}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No cost data available</div>
          )}
        </motion.div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Details</h3>
          <div className="space-y-4">
            {data.length === 0 && <p className="text-slate-500">No expenses logged yet.</p>}
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
            {data.length > 0 && (
              <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center px-4">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-slate-900">${totalSpent.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
