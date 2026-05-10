import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dummyExpenses } from '../data/dummy';
import { Plus } from 'lucide-react';

const COLORS = ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b'];
const data = [
  { name: 'Flights', value: 850 },
  { name: 'Accommodation', value: 350 },
  { name: 'Food', value: 120 },
  { name: 'Activities', value: 80 }
];

const Budget = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-lg mb-1">Budget Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Total Budget: $3,500</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card h-96 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$1,400</span>
              <span className="text-sm text-gray-500">Spent</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h3>
          <div className="space-y-4">
            {dummyExpenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.category}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exp.date}</p>
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ${exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
