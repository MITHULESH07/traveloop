import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hi! I am your Traveloop AI assistant. How can I help you plan your trip today?', 
      isHtml: false,
      destinations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: text, isHtml: false }]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Fetch real-time data from Python backend
      const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: text })
      });

      const rec = await response.json();
      
      // Render final response
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: rec.reply_text, 
        isHtml: true,
        destinations: rec.destinations || []
      }]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'Sorry, I encountered an error connecting to the real-time search engine. Please make sure the Python backend is running on port 5000.', 
        isHtml: false 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col card p-0 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-bg/50">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-500" /> Traveloop AI Guide
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'bot' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
              {msg.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`space-y-3 ${msg.type === 'user' ? 'items-end flex flex-col' : ''}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                {msg.isHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} className="prose dark:prose-invert max-w-none text-sm prose-p:my-1 prose-ul:my-1" />
                ) : (
                  msg.text
                )}
              </div>

              {/* Render Destination Cards if they exist */}
              {msg.destinations && msg.destinations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {msg.destinations.map((dest, idx) => (
                    <div key={idx} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img src={dest.img} alt={dest.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{dest.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{dest.desc}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium line-clamp-1 mb-3"><strong>Related:</strong> {dest.activities}</p>
                        <a href={dest.link || '#'} target="_blank" rel="noopener noreferrer" className="block text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                          Read More
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm flex items-center gap-2">
              <Globe className="w-4 h-4 animate-spin text-primary-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Browsing real-time web data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for recommendations, weather, or tips..."
            className="flex-1 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="p-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
