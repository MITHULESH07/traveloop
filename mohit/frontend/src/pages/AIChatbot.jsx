import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Map } from 'lucide-react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am your Traveloop AI assistant. Where are you planning to go, or what do you need help with?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'That sounds amazing! I can help you build an itinerary for that destination. Would you like a mix of cultural sites and food tours?' 
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-primary-600 p-6 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Bot size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Traveloop AI</h2>
          <p className="text-primary-100 text-sm">Always online • Ready to plan</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-primary-600" />
              </div>
            )}
            <div className={`max-w-[75%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-primary-600 text-white rounded-br-sm' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User size={16} className="text-slate-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about destinations, budgets, or itineraries..." 
            className="flex-1 p-4 rounded-full border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
          <button 
            type="submit"
            className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
