import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';

const getYoutubeId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

const Hero = ({ activeMovie, onPlayClick, onDetailsClick, isMuted, setIsMuted }) => {
  if (!activeMovie) return null;

  const ytId = getYoutubeId(activeMovie.videoUrl);

  return (
    <section className="relative w-full h-[90vh] md:h-[95vh] flex items-center overflow-hidden bg-background">
      {/* 1. Video Trailer Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
        {ytId ? (
          <iframe
            key={activeMovie.id}
            className="w-full h-full object-cover scale-[1.3] pointer-events-none aspect-video"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&playlist=${ytId}&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
            title={activeMovie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video
            key={activeMovie.id}
            className="w-full h-full object-cover scale-[1.02]"
            src={activeMovie.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        )}
      </div>

      {/* 2. Floating Parallax/Particle Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-20 left-[15%] w-3 h-3 bg-primary rounded-full filter blur-[1px] animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-40 left-[45%] w-2 h-2 bg-accentCyan rounded-full filter blur-[1px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-60 right-[25%] w-4 h-4 bg-accentPink rounded-full filter blur-[2px] animate-bounce" style={{ animationDuration: '9s' }} />
      </div>

      {/* 3. Cinematic Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full mt-12">
        <div className="max-w-2xl space-y-6">
          {/* Genre Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accentCyan animate-ping" />
            <span className="text-xs font-semibold tracking-wider text-accentCyan uppercase">{activeMovie.genre}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold font-cinematic tracking-tight text-white leading-tight drop-shadow-2xl"
          >
            {activeMovie.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl font-medium text-accentPink text-glow-pink italic"
          >
            &ldquo;{activeMovie.tagline}&rdquo;
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm md:text-base text-textSecondary leading-relaxed drop-shadow-md"
          >
            {activeMovie.description}
          </motion.p>

          {/* CTA Buttons & Volume Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap gap-4 items-center pt-4"
          >
            {/* Play Trigger */}
            <button
              onClick={() => onPlayClick(activeMovie)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accentPink text-white font-semibold rounded-xl hover:shadow-glow-primary transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Xem Ngay</span>
            </button>

            {/* Info Trigger */}
            <button
              onClick={() => onDetailsClick(activeMovie)}
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-md"
            >
              <Info className="w-5 h-5 text-textSecondary" />
              <span>Xem Chi Tiết</span>
            </button>

            {/* Mute Control */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/5 border border-white/10 text-textSecondary hover:text-white rounded-xl transition-all duration-300 backdrop-blur-md"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
