import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Coffee, Bed, Bus, GripVertical, CheckCircle2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTrip } from '../context/TripContext';

const ItineraryBuilder = () => {
  const { activeTrip, updateItinerary } = useTrip();
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    if (activeTrip?.itinerary) {
      setItinerary(activeTrip.itinerary);
    }
  }, [activeTrip]);

  const getIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('transport') || t.includes('flight')) return <Bus size={18} />;
    if (t.includes('hotel') || t.includes('stay') || t.includes('inn')) return <Bed size={18} />;
    if (t.includes('food') || t.includes('dinner') || t.includes('lunch')) return <Coffee size={18} />;
    return <MapPin size={18} />;
  };

  const getColor = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('transport') || t.includes('flight')) return 'bg-orange-100 text-orange-600 border-orange-200';
    if (t.includes('hotel') || t.includes('stay') || t.includes('inn')) return 'bg-purple-100 text-purple-600 border-purple-200';
    if (t.includes('food') || t.includes('dinner')) return 'bg-green-100 text-green-600 border-green-200';
    return 'bg-blue-100 text-blue-600 border-blue-200';
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceDayIndex = parseInt(result.source.droppableId);
    const destDayIndex = parseInt(result.destination.droppableId);

    const newItinerary = [...itinerary];
    
    // Find the day objects
    const sourceDay = newItinerary.find(d => d.day === sourceDayIndex);
    const destDay = newItinerary.find(d => d.day === destDayIndex);

    if (!sourceDay || !destDay) return;

    // Moving within the same day
    if (sourceDayIndex === destDayIndex) {
      const items = Array.from(sourceDay.activities);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      sourceDay.activities = items;
    } else {
      // Moving between days
      const sourceItems = Array.from(sourceDay.activities);
      const destItems = Array.from(destDay.activities);
      const [movedItem] = sourceItems.splice(result.source.index, 1);
      destItems.splice(result.destination.index, 0, movedItem);
      
      sourceDay.activities = sourceItems;
      destDay.activities = destItems;
    }

    setItinerary(newItinerary);
    updateItinerary(newItinerary);
  };

  if (!itinerary.length) {
    return <div className="text-center py-20 text-slate-500">No itinerary generated yet. Please plan a trip first.</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{activeTrip?.tripName || "Your Trip"}</h1>
          <p className="text-slate-500 mt-2">
             Total Estimated Cost: <span className="font-bold text-slate-700">${activeTrip?.totalEstimatedCost || 0}</span> / ${activeTrip?.budget || 0}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const title = window.prompt("Enter activity name (e.g. Marina Beach):");
              if (!title) return;
              const cost = window.prompt("Enter estimated cost ($):", "0");
              const dayStr = window.prompt("Add to which Day? (Enter day number)", "1");
              const dayNum = parseInt(dayStr) || 1;
              
              const newItinerary = [...itinerary];
              const targetDay = newItinerary.find(d => d.day === dayNum) || newItinerary[0];
              
              targetDay.activities.push({
                id: `manual-${Date.now()}`,
                time: "Flexible",
                title: title,
                cost: parseFloat(cost) || 0,
                type: "Activity"
              });
              
              setItinerary(newItinerary);
              updateItinerary(newItinerary);
            }}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition"
          >
            Add Activity
          </button>
          <button 
            onClick={() => {
              alert("Itinerary saved successfully! All changes have been synchronized with your budget analytics.");
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
          >
            Save Changes
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-8">
          {itinerary.map((day, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={day.day} 
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <div className="border-b border-slate-100 pb-6 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Day {day.day} - {day.city}</h2>
                  <p className="text-slate-500 text-sm mt-1">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100"></div>

                <Droppable droppableId={day.day.toString()}>
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="space-y-6 min-h-[100px]"
                    >
                      {day.activities.map((activity, index) => (
                        <Draggable key={activity.id} draggableId={activity.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative flex items-center gap-6 group ${snapshot.isDragging ? 'z-50' : ''}`}
                            >
                              <div className="w-16 text-right shrink-0">
                                <span className="text-sm font-medium text-slate-500">{activity.time}</span>
                              </div>
                              
                              <div className={`w-4 h-4 rounded-full border-4 border-white shrink-0 z-10 ${getColor(activity.type).split(' ')[0]}`}></div>

                              <div 
                                className={`flex-1 bg-white border rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer ${
                                  snapshot.isDragging ? 'shadow-xl border-primary-500 scale-105' : 'border-slate-100 hover:shadow-md hover:border-primary-200'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl border ${getColor(activity.type)}`}>
                                    {getIcon(activity.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800">{activity.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{activity.type} • ${activity.cost}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                  <CheckCircle2 size={20} className="hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div {...provided.dragHandleProps} className="p-2 cursor-grab active:cursor-grabbing hover:bg-slate-50 rounded-lg">
                                    <GripVertical size={20} className={snapshot.isDragging ? 'text-primary-600' : ''} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </motion.div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ItineraryBuilder;
