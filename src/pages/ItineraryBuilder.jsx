import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, MapPin, Clock, DollarSign, Calendar, Trash2, Plane, Camera, Hotel, Train, Coffee } from 'lucide-react';

// Dummy JSON Data
const initialData = {
  tripName: 'Japan Explorer 2026',
  totalBudget: 3500,
  cities: [
    { id: 'city-1', name: 'Kyoto, Japan', dates: 'Oct 15 - Oct 18', allocatedBudget: 1500 },
    { id: 'city-2', name: 'Tokyo, Japan', dates: 'Oct 19 - Oct 24', allocatedBudget: 2000 },
  ],
  days: {
    'day-1': { id: 'day-1', title: 'Day 1: Arrival & Rest', cityId: 'city-1', date: 'Oct 15' },
    'day-2': { id: 'day-2', title: 'Day 2: Temples & Shrines', cityId: 'city-1', date: 'Oct 16' },
    'day-3': { id: 'day-3', title: 'Day 3: Journey to Tokyo', cityId: 'city-2', date: 'Oct 19' },
  },
  activities: {
    'act-1': { id: 'act-1', content: 'Flight Landing at KIX', time: '10:00 AM', type: 'flight', cost: 0 },
    'act-2': { id: 'act-2', content: 'Check-in at Ryokan', time: '03:00 PM', type: 'hotel', cost: 250 },
    'act-3': { id: 'act-3', content: 'Dinner at Pontocho', time: '07:00 PM', type: 'food', cost: 60 },
    'act-4': { id: 'act-4', content: 'Fushimi Inari Shrine', time: '08:00 AM', type: 'activity', cost: 0 },
    'act-5': { id: 'act-5', content: 'Kiyomizu-dera', time: '01:00 PM', type: 'activity', cost: 10 },
    'act-6': { id: 'act-6', content: 'Shinkansen to Tokyo', time: '10:00 AM', type: 'transit', cost: 130 },
  },
  columns: {
    'day-1': { id: 'day-1', activityIds: ['act-1', 'act-2', 'act-3'] },
    'day-2': { id: 'day-2', activityIds: ['act-4', 'act-5'] },
    'day-3': { id: 'day-3', activityIds: ['act-6'] },
  },
  columnOrder: ['day-1', 'day-2', 'day-3'],
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

const getTypeColor = (type) => {
  switch (type) {
    case 'flight': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'hotel': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'transit': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'food': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
    default: return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
  }
};

const ItineraryBuilder = () => {
  const [data, setData] = useState(initialData);
  const [activeCity, setActiveCity] = useState(data.cities[0].id);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newActivityIds = Array.from(startColumn.activityIds);
      newActivityIds.splice(source.index, 1);
      newActivityIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, activityIds: newActivityIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving between lists
    const startActivityIds = Array.from(startColumn.activityIds);
    startActivityIds.splice(source.index, 1);
    const newStart = { ...startColumn, activityIds: startActivityIds };

    const finishActivityIds = Array.from(finishColumn.activityIds);
    finishActivityIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, activityIds: finishActivityIds };

    setData({
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });
  };

  const removeActivity = (columnId, activityId) => {
    const column = data.columns[columnId];
    const newActivityIds = column.activityIds.filter(id => id !== activityId);
    setData({
      ...data,
      columns: { ...data.columns, [columnId]: { ...column, activityIds: newActivityIds } }
    });
  };

  const calculateTotalSpent = () => {
    return Object.values(data.activities).reduce((acc, curr) => acc + curr.cost, 0);
  };

  const visibleDays = data.columnOrder.filter(dayId => data.days[dayId].cityId === activeCity);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <MapPin className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-3 flex-1 min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 truncate">
            {data.tripName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-gray-300 font-medium">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm">
              <Calendar className="w-4 h-4" /> 10 Days
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm">
              <MapPin className="w-4 h-4" /> 2 Cities
            </span>
          </div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-end shrink-0 min-w-[220px]">
          <span className="text-sm text-gray-300 font-medium flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4" /> Budget Status
          </span>
          <div className="text-3xl font-bold whitespace-nowrap">
            ${calculateTotalSpent()} <span className="text-lg text-gray-400">/ ${data.totalBudget}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
            <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(calculateTotalSpent() / data.totalBudget) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Cities Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-card rounded-xl shadow-inner overflow-x-auto">
          {data.cities.map(city => (
            <button
              key={city.id}
              onClick={() => setActiveCity(city.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeCity === city.id
                  ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              <MapPin className="w-4 h-4" />
              {city.name}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-primary-500 transition-colors font-medium">
            <Plus className="w-4 h-4" /> Add City
          </button>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> New Activity
        </button>
      </div>

      {/* Timeline Layout */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          <AnimatePresence mode="popLayout">
            {visibleDays.map((dayId) => {
              const column = data.columns[dayId];
              const day = data.days[dayId];
              const activities = column.activityIds.map(activityId => data.activities[activityId]);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={column.id}
                  className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[600px]"
                >
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-t-3xl">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{day.title}</h3>
                    </div>
                    <p className="text-sm text-primary-500 font-semibold">{day.date}</p>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                      >
                        <AnimatePresence>
                          {activities.map((activity, index) => (
                            <Draggable key={activity.id} draggableId={activity.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500 ring-opacity-50 scale-105 z-50' : ''
                                    }`}
                                >
                                  <div className="flex gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                                          {activity.content}
                                        </h4>
                                        <span className={`flex-shrink-0 p-1.5 rounded-lg ${getTypeColor(activity.type)}`}>
                                          {getTypeIcon(activity.type)}
                                        </span>
                                      </div>
                                      <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" /> {activity.time}
                                        </div>
                                        {activity.cost > 0 && (
                                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                            <DollarSign className="w-3.5 h-3.5" /> {activity.cost}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quick Actions (Hover) */}
                                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity flex shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <button
                                      onClick={() => removeActivity(column.id, activity.id)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}

                        {activities.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No activities planned yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Drag and drop or add new.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 rounded-b-3xl">
                    <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                      <Plus className="w-4 h-4" /> Add to {day.date}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Day Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-[600px] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all group"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold">Add New Day</span>
          </motion.button>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ItineraryBuilder;
