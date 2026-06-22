import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === 'complete') {
      setProgress(100);
    } else {
      window.addEventListener('load', handleLoad);
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200); // Super fast exit transition
          return 100;
        }
        // Much faster increments for instant feel
        return prev + Math.floor(Math.random() * 15) + 6;
      });
    }, 20); // Faster checks (20ms instead of 40ms)

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-background flex flex-col justify-center items-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -50,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-accentPink filter blur-[120px] animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Brand Logo/Wordmark */}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold font-cinematic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-textPrimary via-primary to-accentCyan mb-6"
          initial={{ letterSpacing: '0.1em', opacity: 0 }}
          animate={{ letterSpacing: '0.25em', opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          2HT ENTERTAINMENT
        </motion.h1>

        {/* Cinematic Subtitle */}
        <motion.p
          className="text-xs tracking-widest text-textSecondary uppercase mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Không Gian Giải Trí Đỉnh Cao
        </motion.p>

        {/* Modern Percentage Indicator */}
        <div className="relative w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accentPink to-accentCyan"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <motion.span
          className="text-sm font-cinematic mt-4 text-accentCyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.min(progress, 100)}%
        </motion.span>
      </div>

      <div className="absolute bottom-8 text-center text-[10px] text-textSecondary/40 uppercase tracking-[0.3em]">
        Giao diện Sáng tạo &bull; Hệ thống Trải nghiệm Cao cấp
      </div>
    </motion.div>
  );
};

export default Preloader;
