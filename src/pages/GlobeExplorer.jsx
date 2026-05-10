import React, { useState, useRef } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Mountain, TreePine, Compass, X, AlertTriangle, Calendar, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const GlobeExplorer = () => {
  const mapRef = useRef(null);
  const { createTrip } = useTrips();
  const navigate = useNavigate();
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tripForm, setTripForm] = useState({ start_date: '', end_date: '', budget: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const onMapClick = async (e) => {
    const { lng, lat } = e.lngLat;
    setClickedLocation({ lng, lat });
    setIsFetching(true);
    setLocationData(null);
    setShowForm(false);
    setSaved(false);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 6, essential: true, duration: 2500 });
    try {
      const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=country,region,place,locality`;
      const geoData = await (await fetch(geoUrl)).json();
      let country = 'Unknown', region = '', place = 'Unknown Area';
      if (geoData.features?.length > 0) {
        geoData.features.forEach(f => {
          if (f.id.includes('country')) country = f.text;
          if (f.id.includes('region')) region = f.text;
          if (f.id.includes('place') || f.id.includes('locality')) place = f.text;
        });
        if (place === 'Unknown Area') place = geoData.features[0].text;
      }
      let terrain = 'Mixed / Built-up';
      try {
        const tileData = await (await fetch(`https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)).json();
        const lc = tileData.features?.find(f => f.properties.tilequery.layer === 'landcover');
        if (lc) terrain = lc.properties.class || 'Mixed';
      } catch (_) { /* ignore */ }
      setLocationData({ country, region, place, terrain, lat: lat.toFixed(4), lng: lng.toFixed(4) });
    } catch (err) {
      setLocationData({ error: 'Failed to load geographic data.' });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!tripForm.start_date || !tripForm.end_date) return;
    setSaving(true);
    try {
      const destination = `${locationData.place}, ${locationData.country}`;
      await createTrip({ destination, start_date: tripForm.start_date, end_date: tripForm.end_date, budget: Number(tripForm.budget) || 0, image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' });
      setSaved(true);
      setTimeout(() => navigate('/profile'), 1800);
    } catch (err) { alert('Failed to save: ' + err.message); }
    finally { setSaving(false); }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
        <AlertTriangle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapbox Token Missing</h2>
        <div className="text-gray-500 dark:text-gray-400 max-w-lg text-left bg-gray-50 dark:bg-dark-bg p-6 rounded-2xl">
          <p className="mb-3">Add to your <code>.env</code> file in the root folder (next to <code>package.json</code>):</p>
          <code className="bg-gray-900 text-green-400 p-3 rounded-lg block font-mono text-sm">VITE_MAPBOX_TOKEN=pk.eyJ1...</code>
          <p className="mt-3 text-sm">Get a free token at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-primary-500 underline">mapbox.com</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[600px] w-full rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl animate-in fade-in duration-700">
      <Map ref={mapRef} mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: 10, latitude: 40, zoom: 1.5 }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        projection="globe"
        fog={{ 'range': [0.5, 10], 'color': 'rgb(186, 210, 235)', 'high-color': 'rgb(36, 92, 223)', 'space-color': 'rgb(11, 11, 25)', 'star-intensity': 0.6 }}
        onClick={onMapClick} interactiveLayerIds={[]} cursor="crosshair">
        <NavigationControl position="bottom-right" />
      </Map>

      {!clickedLocation && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full border border-white/20 pointer-events-none">
          🌍 Click anywhere on the globe to explore
        </div>
      )}

      <AnimatePresence>
        {clickedLocation && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="absolute top-6 left-6 w-80 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 p-6 rounded-3xl shadow-2xl z-10">
            <button onClick={() => { setClickedLocation(null); setLocationData(null); setShowForm(false); setSaved(false); }}
              className="absolute top-4 right-4 p-1.5 bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-primary-500 mb-4">
              <Compass className="w-6 h-6" />
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Location Intel</h3>
            </div>
            {isFetching ? (
              <div className="space-y-3 py-2">
                {[3/4, 1/2, 5/6].map((w, i) => <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse`} style={{ width: `${w * 100}%` }}></div>)}
              </div>
            ) : locationData?.error ? (
              <p className="text-red-500 text-sm">{locationData.error}</p>
            ) : locationData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Place</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{locationData.place}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{locationData.region ? `${locationData.region}, ` : ''}{locationData.country}</p>
                </div>
                <div className="flex items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-800">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Coords</p>
                    <p className="text-xs font-mono text-gray-800 dark:text-gray-200">{locationData.lat}, {locationData.lng}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><TreePine className="w-3 h-3" /> Terrain</p>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 capitalize">{locationData.terrain}</p>
                  </div>
                </div>
                {saved ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5" /> Trip saved! Redirecting...
                  </div>
                ) : showForm ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trip to {locationData.place}</p>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                      <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="date" value={tripForm.start_date} onChange={e => setTripForm(p => ({ ...p, start_date: e.target.value }))} className="w-full input-field pl-9 py-2 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                      <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="date" value={tripForm.end_date} min={tripForm.start_date} onChange={e => setTripForm(p => ({ ...p, end_date: e.target.value }))} className="w-full input-field pl-9 py-2 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Budget (optional)</label>
                      <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="number" placeholder="0.00" value={tripForm.budget} onChange={e => setTripForm(p => ({ ...p, budget: e.target.value }))} className="w-full input-field pl-9 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary py-2 text-sm">Back</button>
                      <button onClick={handleSaveTrip} disabled={saving || !tripForm.start_date || !tripForm.end_date}
                        className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                        {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : '✈️ Save Trip'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowForm(true)} className="w-full btn-primary py-3 rounded-xl shadow-md font-semibold text-sm flex items-center justify-center gap-2">
                    <Mountain className="w-4 h-4" /> Start Planning Trip
                  </button>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobeExplorer;
