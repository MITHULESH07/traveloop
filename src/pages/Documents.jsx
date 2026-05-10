import React, { useState } from 'react';
import { FileText, Upload, MoreVertical, Download, Plane, Hotel, CheckCircle2, Circle } from 'lucide-react';

const Documents = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Book flights to Tokyo', completed: true },
    { id: 2, title: 'Reserve Ryokan in Kyoto', completed: true },
    { id: 3, title: 'Purchase JR Pass', completed: false },
    { id: 4, title: 'Buy travel insurance', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const docs = [
    { id: 1, name: 'E-Tickets_Flight_NH112.pdf', type: 'flight', size: '2.4 MB', date: 'Oct 10, 2026' },
    { id: 2, Kyoto_Ryokan_Confirmation: 'Kyoto_Ryokan_Confirmation.pdf', type: 'hotel', size: '1.1 MB', date: 'Oct 12, 2026' },
    { id: 3, name: 'Travel_Insurance_Policy.pdf', type: 'doc', size: '3.5 MB', date: 'Oct 14, 2026' },
  ];

  const getIcon = (type) => {
    if (type === 'flight') return <Plane className="w-5 h-5 text-blue-500" />;
    if (type === 'hotel') return <Hotel className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Documents List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Documents</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Keep all your bookings and tickets in one place.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload File
          </button>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {docs.map(doc => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {doc.name || doc.Kyoto_Ryokan_Confirmation}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.size} • Added {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {docs.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p>No documents uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pre-trip Checklist</h2>
        
        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-500">
            <span>Progress</span>
            <span className="text-primary-500">50%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-6">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>

          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <input 
              type="text" 
              placeholder="+ Add a new task" 
              className="w-full bg-transparent border-none text-sm focus:ring-0 outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Documents;
