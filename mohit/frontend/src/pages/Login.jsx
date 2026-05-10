import { motion } from 'framer-motion';
import { Plane, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
              <Plane size={32} className="text-white -rotate-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to Traveloop</h1>
            <p className="text-slate-500 mt-2">Plan your perfect trip with AI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                defaultValue="demo@traveloop.com"
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 font-medium hover:text-primary-700">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary-600/20"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Don't have an account? <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">Sign up</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
