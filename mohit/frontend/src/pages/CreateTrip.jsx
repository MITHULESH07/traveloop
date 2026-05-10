import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Wand2, MessageSquare, Bed, Map, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { generateTripOptions } from '../services/aiPlanner';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { setActiveTrip } = useTrip();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Form Data
  const [formData, setFormData] = useState({
    destination: 'Chennai, Tiruppur, Coimbatore',
    budget: 2000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferences: 'I want a mix of city exploration and relaxing stays.'
  });

  const daysCount = useMemo(() => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, [formData.startDate, formData.endDate]);

  // Extract cities from input
  const destinationCities = useMemo(() => {
    return formData.destination.split(',').map(c => c.trim()).filter(Boolean);
  }, [formData.destination]);

  // Determine which city belongs to which day
  const getCityForDay = (dayNum) => {
    if (destinationCities.length === 0) return "Destination";
    const daysPerCity = Math.max(1, Math.floor(daysCount / destinationCities.length));
    const cityIndex = Math.min(Math.floor((dayNum - 1) / daysPerCity), destinationCities.length - 1);
    return destinationCities[cityIndex];
  };

  // Daily State
  // { 1: { hotel: null, activities: [] }, 2: { ... } }
  const [dailyPlan, setDailyPlan] = useState({});
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [customInput, setCustomInput] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFetchOptions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const realData = await generateTripOptions(
        formData.destination,
        formData.budget,
        formData.startDate,
        formData.endDate,
        formData.preferences
      );
      setOptions(realData);
      
      // Initialize daily plan
      const initialPlan = {};
      for(let i = 1; i <= daysCount; i++) {
        initialPlan[i] = { hotel: null, activities: [] };
      }
      setDailyPlan(initialPlan);
      setActiveDayTab(1);
      setStep(2); // Go to Daily Builder
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleHotelForDay = (hotel) => {
    setDailyPlan(prev => ({
      ...prev,
      [activeDayTab]: {
        ...prev[activeDayTab],
        hotel: prev[activeDayTab].hotel?.id === hotel.id ? null : hotel
      }
    }));
  };

  const toggleActivityForDay = (activity) => {
    setDailyPlan(prev => {
      const dayData = prev[activeDayTab];
      const isSelected = dayData.activities.find(a => a.id === activity.id);
      
      return {
        ...prev,
        [activeDayTab]: {
          ...dayData,
          activities: isSelected 
            ? dayData.activities.filter(a => a.id !== activity.id)
            : [...dayData.activities, activity]
        }
      };
    });
  };

  const addCustomActivity = () => {
    if (!customInput.trim()) return;
    
    const currentCity = getCityForDay(activeDayTab);
    
    const newAct = {
      id: `custom-${Date.now()}`,
      name: customInput,
      city: currentCity,
      cost: 0,
      duration: "Flexible",
      distanceFromHotel: "Unknown",
      category: "Custom",
      type: "Activity",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=500&q=80"
    };

    setDailyPlan(prev => ({
      ...prev,
      [activeDayTab]: {
        ...prev[activeDayTab],
        activities: [newAct, ...prev[activeDayTab].activities]
      }
    }));
    
    setOptions(prev => ({
      ...prev,
      activities: [newAct, ...prev.activities]
    }));

    setCustomInput("");
  };

  const totalSpent = useMemo(() => {
    let sum = 0;
    // Calculate spent by iterating through daily plan
    Object.values(dailyPlan).forEach(day => {
      if (day.hotel) sum += day.hotel.pricePerNight; // adding 1 night cost per assigned day
      day.activities.forEach(a => sum += a.cost);
    });
    return sum;
  }, [dailyPlan]);

  const categories = ["All", "Food", "Adventure", "Viewpoint", "Culture", "Beach", "Relaxation", "Custom"];
  
  const filteredActivities = useMemo(() => {
    if (!options) return [];
    
    // First filter by Active City for the current day tab!
    const currentCity = getCityForDay(activeDayTab);
    let cityActivities = options.activities.filter(a => {
      // Allow fuzzy matching just in case AI returned slightly different city name
      return a.city?.toLowerCase().includes(currentCity.toLowerCase()) || currentCity.toLowerCase().includes(a.city?.toLowerCase());
    });
    
    // If no activities found for this exact city, fallback to showing all just in case
    if (cityActivities.length === 0) cityActivities = options.activities;

    if (activeCategory === "All") return cityActivities;
    return cityActivities.filter(a => a.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [options, activeCategory, activeDayTab, formData.destination]);

  const filteredHotels = useMemo(() => {
    if (!options) return [];
    const currentCity = getCityForDay(activeDayTab);
    const cityHotels = options.hotels.filter(h => {
      return h.city?.toLowerCase().includes(currentCity.toLowerCase()) || currentCity.toLowerCase().includes(h.city?.toLowerCase());
    });
    return cityHotels.length > 0 ? cityHotels : options.hotels;
  }, [options, activeDayTab, formData.destination]);


  const generateFinalItinerary = () => {
    const start = new Date(formData.startDate);
    let itinerary = [];

    for (let i = 1; i <= daysCount; i++) {
      let dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + i - 1);
      
      const dayData = dailyPlan[i];
      let dayActivities = [];
      const currentCity = getCityForDay(i);
      
      // Figure out active hotel (carry over from previous day if null)
      let activeHotel = dayData.hotel;
      if (!activeHotel) {
        for(let prev = i - 1; prev >= 1; prev--) {
          if (dailyPlan[prev].hotel) {
            activeHotel = dailyPlan[prev].hotel;
            break;
          }
        }
      }

      // Add Hotel Stay Activity
      if (activeHotel) {
        dayActivities.push({
          id: `hotel-${i}`,
          time: "10:00 PM",
          title: dayData.hotel ? `Check-in: ${activeHotel.name}` : `Night Stay: ${activeHotel.name}`,
          cost: dayData.hotel ? activeHotel.pricePerNight : 0, 
          type: "Hotel"
        });
      }

      // Add user selected activities for this day
      dayData.activities.forEach((act, index) => {
        // distribute times roughly
        const times = ["09:00 AM", "12:30 PM", "03:00 PM", "06:00 PM", "08:00 PM"];
        const timeStr = index < times.length ? times[index] : "Flexible";
        
        dayActivities.push({
          id: `act-${i}-${act.id}`,
          time: timeStr,
          title: act.name,
          cost: act.cost,
          type: act.category?.toLowerCase() === 'food' ? 'Food' : 'Activity'
        });
      });

      itinerary.push({
        day: i,
        date: dayDate.toISOString().split('T')[0],
        city: currentCity,
        activities: dayActivities.sort((a, b) => a.time.localeCompare(b.time))
      });
    }

    const newTrip = {
      tripName: `Trip to ${formData.destination}`,
      budget: formData.budget,
      totalEstimatedCost: totalSpent,
      itinerary: itinerary
    };

    setActiveTrip(newTrip);
    navigate('/itinerary/1');
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        {['Preferences', 'Daily Planner', 'Review'].map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-xs ${step === i + 1 ? 'text-primary-600 font-bold' : 'text-slate-500'}`}>{label}</span>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: Input Preferences */}
        {step === 1 && (
          <form onSubmit={handleFetchOptions} className="space-y-6 max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Where to next?</h1>
              <p className="text-slate-500">Provide your constraints and we will fetch real options fitting your budget.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Destination (e.g. Chennai, Tiruppur, Coimbatore)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required type="text" name="destination" value={formData.destination} onChange={handleChange}
                  className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                    className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input required type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                    className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total Budget ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="number" name="budget" value={formData.budget} onChange={handleChange}
                  className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Preferences & Wishes</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-6 text-slate-400" size={20} />
                <textarea required name="preferences" value={formData.preferences} onChange={handleChange}
                  className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all resize-none" rows="3"></textarea>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-8">
              {loading ? <span className="animate-pulse">Loading Map Data...</span> : <><Wand2 size={20} /> Start Daily Planner</>}
            </button>
          </form>
        )}

        {/* STEP 2: Daily Planner */}
        {step === 2 && options && dailyPlan[activeDayTab] && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Design your Days</h2>
                <p className="text-sm text-slate-500">Pick hotels and activities for each specific day.</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Remaining</p>
                <p className={`text-3xl font-black ${formData.budget - totalSpent < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${formData.budget - totalSpent}
                </p>
              </div>
            </div>

            {/* Day Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100 mb-6">
              {Object.keys(dailyPlan).map(day => {
                const actCount = dailyPlan[day].activities.length;
                const hasHotel = dailyPlan[day].hotel;
                const cityForTab = getCityForDay(parseInt(day));
                
                return (
                  <button 
                    key={day}
                    onClick={() => setActiveDayTab(parseInt(day))}
                    className={`px-6 py-3 rounded-t-xl whitespace-nowrap font-bold text-sm transition-all border-b-4 ${activeDayTab === parseInt(day) ? 'bg-primary-50 text-primary-700 border-primary-600' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
                  >
                    Day {day} - {cityForTab}
                    <div className="text-xs font-normal opacity-70 mt-1">
                      {hasHotel ? '🏨 ' : ''}{actCount} places
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Hotels */}
              <div className="lg:col-span-1 space-y-4 border-r border-slate-100 pr-4">
                <h3 className="font-bold text-slate-800 text-lg">Where to stay?</h3>
                <p className="text-xs text-slate-500">If unselected, you will continue staying in your previous day's hotel.</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredHotels.length === 0 && <p className="text-sm text-slate-500">No hotels found in this city.</p>}
                  {filteredHotels.map(hotel => {
                    const isSelected = dailyPlan[activeDayTab].hotel?.id === hotel.id;
                    return (
                      <div 
                        key={hotel.id} 
                        onClick={() => toggleHotelForDay(hotel)}
                        className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-primary-200'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{hotel.name}</h4>
                          <span className="font-bold text-primary-600 text-sm">${hotel.pricePerNight}</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded-full mb-1">{hotel.city}</span>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{hotel.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Activities */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg">What to do in {getCityForDay(activeDayTab)}?</h3>
                </div>

                {/* Swiggy Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-colors ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Got a specific place in mind? Type here..." 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomActivity()}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                  <button onClick={addCustomActivity} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-slate-700">
                    <Plus size={16}/> Add
                  </button>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                  {filteredActivities.length === 0 && activeCategory !== "Custom" && <p className="text-slate-500 text-sm">No activities found in this city for this category.</p>}
                  {filteredActivities.map(act => {
                    const isSelected = dailyPlan[activeDayTab].activities.find(a => a.id === act.id);
                    return (
                      <div 
                        key={act.id} 
                        onClick={() => toggleActivityForDay(act)}
                        className={`border-2 rounded-xl p-3 flex gap-3 cursor-pointer transition-all ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-100 hover:border-primary-200'}`}
                      >
                        <img src={act.image} alt={act.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{act.name}</h4>
                            <span className="font-bold text-primary-600 text-sm shrink-0">${act.cost}</span>
                          </div>
                          <div className="flex gap-1 mb-1">
                            <span className="inline-block px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[9px] rounded-full uppercase">{act.city}</span>
                            <span className="inline-block px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[9px] rounded-full">{act.category}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="px-6 py-2 text-slate-600 font-medium">Back</button>
              <button 
                onClick={() => setStep(3)} 
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold"
              >
                Finalize Timeline
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Your Plan is Ready!</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              You've hand-picked everything day by day. 
              The total cost is <strong>${totalSpent}</strong> out of your ${formData.budget} budget.
            </p>
            
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">Modify Days</button>
              <button onClick={generateFinalItinerary} className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateTrip;
