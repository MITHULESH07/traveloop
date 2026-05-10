import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, MapPin, Clock, DollarSign, Calendar, Trash2, Plane, Camera, Hotel, Train, Coffee, Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NODE_API = 'http://localhost:5001/api';

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

// Build a blank itinerary structure from a DB trip row
const buildBlankItinerary = (trip) => {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = {};
  const columns = {};
  const columnOrder = [];

  let current = new Date(start);
  let dayNum = 1;
  while (current <= end) {
    const dateStr = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayId = `day-${dayNum}`;
    days[dayId] = { id: dayId, title: `Day ${dayNum}`, date: dateStr };
    columns[dayId] = { id: dayId, activityIds: [] };
    columnOrder.push(dayId);
    current.setDate(current.getDate() + 1);
    dayNum++;
  }

  return {
    tripName: trip.destination,
    totalBudget: Number(trip.budget) || 0,
    days,
    activities: {},
    columns,
    columnOrder,
    image_url: null
  };
};

const ACTIVITY_TYPES = ['activity', 'flight', 'hotel', 'transit', 'food'];

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saved' | 'error'

  // New activity form state
  const [showAddForm, setShowAddForm] = useState(null); // dayId or null
  const [newAct, setNewAct] = useState({ content: '', time: '09:00 AM', type: 'activity', cost: 0 });

  // Load trip from Node DB
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
        // Parse existing itinerary from trip_data, or generate fresh structure
        try {
          const parsed = typeof t.trip_data === 'string' ? JSON.parse(t.trip_data) : t.trip_data;
          if (parsed?.columnOrder?.length > 0) {
            setData(parsed);
          } else {
            setData(buildBlankItinerary(t));
          }
        } catch {
          setData(buildBlankItinerary(t));
        }
      })
      .catch(() => setError('Failed to load trip. Make sure the Node backend is running.'))
      .finally(() => setLoading(false));
  }, [tripId, token]);

  const saveItinerary = useCallback(async (updatedData) => {
    if (!tripId || !token) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`${NODE_API}/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ trip_data: updatedData })
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }, [tripId, token]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startCol = data.columns[source.droppableId];
    const endCol = data.columns[destination.droppableId];

    let newColumns;
    if (startCol === endCol) {
      const ids = Array.from(startCol.activityIds);
      ids.splice(source.index, 1);
      ids.splice(destination.index, 0, draggableId);
      newColumns = { ...data.columns, [startCol.id]: { ...startCol, activityIds: ids } };
    } else {
      const startIds = Array.from(startCol.activityIds);
      startIds.splice(source.index, 1);
      const endIds = Array.from(endCol.activityIds);
      endIds.splice(destination.index, 0, draggableId);
      newColumns = { ...data.columns, [startCol.id]: { ...startCol, activityIds: startIds }, [endCol.id]: { ...endCol, activityIds: endIds } };
    }

    const updated = { ...data, columns: newColumns };
    setData(updated);
    saveItinerary(updated);
  };

  const removeActivity = (columnId, activityId) => {
    const col = data.columns[columnId];
    const newIds = col.activityIds.filter(id => id !== activityId);
    const newActivities = { ...data.activities };
    delete newActivities[activityId];
    const updated = { ...data, columns: { ...data.columns, [columnId]: { ...col, activityIds: newIds } }, activities: newActivities };
    setData(updated);
    saveItinerary(updated);
  };

  const addActivity = (dayId) => {
    if (!newAct.content.trim()) return;
    const id = `act-${Date.now()}`;
    const activity = { id, ...newAct, cost: Number(newAct.cost) || 0 };
    const col = data.columns[dayId];
    const updated = {
      ...data,
      activities: { ...data.activities, [id]: activity },
      columns: { ...data.columns, [dayId]: { ...col, activityIds: [...col.activityIds, id] } }
    };
    setData(updated);
    saveItinerary(updated);
    setShowAddForm(null);
    setNewAct({ content: '', time: '09:00 AM', type: 'activity', cost: 0 });
  };

  const totalSpent = data ? Object.values(data.activities).reduce((sum, a) => sum + Number(a.cost || 0), 0) : 0;
  const budgetPct = data?.totalBudget > 0 ? Math.min((totalSpent / data.totalBudget) * 100, 100) : 0;
  const totalDays = data?.columnOrder?.length || 0;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  if (loading) return (
    <div className="h-full flex items-center justify-center gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      <span>Loading itinerary...</span>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trip Not Found</h2>
      <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      <button onClick={() => navigate('/profile')} className="btn-primary mt-2">← Back to Profile</button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">

      {/* Header */}
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
              <Calendar className="w-4 h-4" /> {formatDate(trip?.start_date)} → {formatDate(trip?.end_date)}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm">
              <MapPin className="w-4 h-4" /> {totalDays} Day{totalDays !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Budget Bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-end shrink-0 min-w-[220px]">
          <span className="text-sm text-gray-300 font-medium flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4" /> Budget Status
          </span>
          <div className="text-3xl font-bold whitespace-nowrap">
            ${totalSpent.toLocaleString()} <span className="text-lg text-gray-400">/ ${data.totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
            <div className={`h-1.5 rounded-full transition-all duration-1000 ${budgetPct > 90 ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${budgetPct}%` }}></div>
          </div>
          {/* Save status indicator */}
          <div className="mt-2 text-xs flex items-center gap-1.5">
            {saving && <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>}
            {saveStatus === 'saved' && <><CheckCircle className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400">Saved</span></>}
            {saveStatus === 'error' && <><AlertCircle className="w-3 h-3 text-red-400" /> <span className="text-red-400">Save failed</span></>}
          </div>
        </div>
      </div>

      {/* Manual Save + info row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drag activities between days. Changes are auto-saved.
        </p>
        <button onClick={() => saveItinerary(data)} disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-70">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Itinerary
        </button>
      </div>

      {/* Day Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          <AnimatePresence mode="popLayout">
            {data.columnOrder.map((dayId) => {
              const column = data.columns[dayId];
              const day = data.days[dayId];
              const activities = (column.activityIds || []).map(id => data.activities[id]).filter(Boolean);

              return (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                  key={dayId} className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">

                  {/* Day Header */}
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-t-3xl">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{day.title}</h3>
                    <p className="text-sm text-primary-500 font-semibold mt-0.5">{day.date}</p>
                  </div>

                  {/* Droppable Activity List */}
                  <Droppable droppableId={dayId}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 200 }}
                        className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors rounded-b-none ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                        <AnimatePresence>
                          {activities.map((activity, index) => (
                            <Draggable key={activity.id} draggableId={activity.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                  ref={provided.innerRef} {...provided.draggableProps}
                                  className={`group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500/50 scale-105 z-50' : ''}`}>
                                  <div className="flex gap-3">
                                    <div {...provided.dragHandleProps} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                      <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{activity.content}</h4>
                                        <span className={`flex-shrink-0 p-1.5 rounded-lg ${getTypeColor(activity.type)}`}>{getTypeIcon(activity.type)}</span>
                                      </div>
                                      <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activity.time}</div>
                                        {activity.cost > 0 && <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> {activity.cost}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity flex shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <button onClick={() => removeActivity(dayId, activity.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                        {activities.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                            <MapPin className="w-6 h-6 text-gray-300 dark:text-gray-600 mb-2" />
                            <p className="text-xs text-gray-400">Drop activities here or add below</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>

                  {/* Add Activity Form / Button */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 rounded-b-3xl">
                    {showAddForm === dayId ? (
                      <div className="space-y-2 p-2">
                        <input value={newAct.content} onChange={e => setNewAct(p => ({ ...p, content: e.target.value }))}
                          placeholder="Activity name..." className="input-field py-2 text-sm w-full" autoFocus />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="time" value={newAct.time} onChange={e => setNewAct(p => ({ ...p, time: e.target.value }))} className="input-field py-2 text-sm" />
                          <input type="number" value={newAct.cost} onChange={e => setNewAct(p => ({ ...p, cost: e.target.value }))} placeholder="Cost $" className="input-field py-2 text-sm" min="0" />
                        </div>
                        <select value={newAct.type} onChange={e => setNewAct(p => ({ ...p, type: e.target.value }))} className="input-field py-2 text-sm w-full">
                          {ACTIVITY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => setShowAddForm(null)} className="flex-1 btn-secondary py-2 text-xs">Cancel</button>
                          <button onClick={() => addActivity(dayId)} className="flex-1 btn-primary py-2 text-xs">Add</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setShowAddForm(dayId); setNewAct({ content: '', time: '09:00 AM', type: 'activity', cost: 0 }); }}
                        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                        <Plus className="w-4 h-4" /> Add to {day.date}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ItineraryBuilder;
