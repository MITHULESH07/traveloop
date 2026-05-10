import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import BudgetAnalytics from './pages/BudgetAnalytics';
import AIChatbot from './pages/AIChatbot';
import PackingChecklist from './pages/PackingChecklist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped in MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="itinerary/:tripId" element={<ItineraryBuilder />} />
          <Route path="budget/:tripId" element={<BudgetAnalytics />} />
          <Route path="ai-assistant" element={<AIChatbot />} />
          <Route path="packing" element={<PackingChecklist />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
