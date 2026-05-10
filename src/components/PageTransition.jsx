import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass } from 'lucide-react';

const PageTransition = ({ onComplete }) => {
  useEffect(() => {
    // End the animation and unmount after 2.8 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      
      {/* Solid background fading out from 0.7 to 1.0 (matches flight timing) */}
      <motion.div
        className="absolute inset-0 bg-gray-900 dark:bg-dark-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 1, 0] }}
        transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center justify-center w-full h-full">
        
        {/* Plane that flies to top left */}
        <motion.div
          initial={{ x: -150, y: 150, scale: 0, opacity: 0, rotate: 45 }}
          animate={{ 
            x: [ -150, 0, 0, -(window.innerWidth / 2) + 50 ], 
            y: [ 150, 0, 0, -(window.innerHeight / 2) + 35 ],
            scale: [ 0, 1.5, 1.5, 0.5 ],
            opacity: [ 0, 1, 1, 0 ],
            rotate: [ 45, 45, -30, -30 ]
          }}
          transition={{ 
            duration: 2.5, 
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut"
          }}
          className="absolute z-20 text-primary-400"
        >
          <Plane className="w-16 h-16 fill-current" />
        </motion.div>

        {/* Traveloop Name and Compass Logo fading in/out */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.1] }}
          transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
          className="flex flex-col items-center gap-6 z-10"
        >
          <Compass className="w-24 h-24 text-primary-500" />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Traveloop
          </h1>
        </motion.div>
        
      </div>
    </div>
  );
};

export default PageTransition;
