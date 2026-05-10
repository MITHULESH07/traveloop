import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';

// Destination image map (fallback for common destinations)
const getDestinationImage = (destination) => {
  const d = destination.toLowerCase();
  if (d.includes('paris')) return 'https://images.unsplash.com/photo-1502602868884-25e173df8374?w=800&q=80';
  if (d.includes('tokyo') || d.includes('japan')) return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80';
  if (d.includes('bali') || d.includes('indonesia')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80';
  if (d.includes('new york') || d.includes('nyc')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80';
  if (d.includes('london')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80';
  if (d.includes('rome') || d.includes('italy')) return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80';
  if (d.includes('dubai')) return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80';
  if (d.includes('singapore')) return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80';
  if (d.includes('india') || d.includes('mumbai') || d.includes('delhi')) return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80';
  // Default travel image
  return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
};

const CreateTrip = () => {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
  });

  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const image_url = getDestinationImage(form.destination);
      await createTrip({ ...form, budget: Number(form.budget) || 0, image_url });
      setStatus('success');
      // Redirect to profile after 1.5s to see the new trip
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-500">
      <h1 className="heading-lg mb-6">Plan a New Trip</h1>

      <div className="card space-y-6">

        {/* Status Messages */}
        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Trip created! Redirecting to your profile...</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Where to?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              className="input-field pl-10 py-3 text-lg"
              placeholder="e.g. Paris, France"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="input-field pl-10"
              />
            </div>
          </div>
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
                min={form.start_date}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Budget (Optional)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || status === 'success'}
            className="btn-primary px-8 flex items-center gap-2 disabled:opacity-70"
          >
            {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Create Trip'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
