import React, { useState, useEffect } from 'react';
import { Printer, Share2, Download, MapPin, Calendar, Clock, Loader2, AlertCircle, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NODE_API = 'http://localhost:5001/api';

const ItinerarySummary = () => {
  const { tripId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

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
          if (parsed?.columnOrder?.length > 0) {
            setData(parsed);
          } else {
            setError('No itinerary built yet. Go to the Itinerary tab to plan your days.');
          }
        } catch {
          setError('No itinerary built yet. Go to the Itinerary tab to plan your days.');
        }
      })
      .catch(() => setError('Failed to load trip summary.'))
      .finally(() => setLoading(false));
  }, [tripId, token]);

  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} - ${e}`;
  };

  const getDayFormat = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' })
    };
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${data.tripName} Itinerary`,
          text: `Check out my travel itinerary for ${data.tripName}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('printable-summary');
    
    const generatePDF = () => {
      const opt = {
        margin: [0.5, 0.5],
        filename: `${data.tripName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGeneratingPdf(false);
      });
    };

    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = generatePDF;
      document.body.appendChild(script);
    } else {
      generatePDF();
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      <span>Generating summary...</span>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Summary Not Available</h2>
      <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      <button onClick={() => navigate(`/itinerary/${tripId}`)} className="btn-primary mt-2">Go to Itinerary Builder</button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Summary</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />} 
            {copied ? 'Copied Link!' : 'Share'}
          </button>
          <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="btn-secondary flex items-center gap-2 disabled:opacity-70">
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isGeneratingPdf ? 'Generating...' : 'PDF'}
          </button>
          <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="printable-summary" className="bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
        
        {/* Banner */}
        <div className="relative h-48 bg-gray-900 flex items-center justify-center text-center px-6">
          <img src={data.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'} alt={data.tripName} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">{data.tripName}</h2>
            <div className="flex items-center justify-center gap-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDateRange(trip.start_date, trip.end_date)}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.tripName.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12">
          {data.columnOrder.map((dayId) => {
            const column = data.columns[dayId];
            const day = data.days[dayId];
            const activities = (column.activityIds || []).map(id => data.activities[id]).filter(Boolean);

            if (activities.length === 0) return null; // Skip empty days in summary

            // Sort activities by time simple string comparison (works if time format is standard AM/PM, but just displaying as they are in the column is fine too)
            const dateParts = getDayFormat(trip.start_date); // Mocking day advance based on title "Day 1"
            const dayNumber = parseInt(day.title.replace('Day ', '')) - 1;
            const currentDayDate = new Date(trip.start_date);
            currentDayDate.setDate(currentDayDate.getDate() + dayNumber);
            const formattedCurrentDay = getDayFormat(currentDayDate);

            return (
              <div key={dayId} className="relative">
                <div className="absolute left-8 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm">
                    <span className="text-sm uppercase tracking-wider">{formattedCurrentDay.month}</span>
                    <span className="text-xl leading-none">{formattedCurrentDay.day}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{day.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{formattedCurrentDay.weekday}</p>
                  </div>
                </div>

                <div className="space-y-6 pl-20">
                  {activities.map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-12 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-dark-card border-2 border-primary-500 z-10"></div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{act.content}</h4>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {data.tripName.split(',')[0]}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-primary-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {act.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 text-center text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
          Generated via Traveloop • Your personal AI travel planner
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;
