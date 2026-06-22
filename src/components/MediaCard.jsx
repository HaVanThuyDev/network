import React, { useRef, useState } from 'react';
import { Play, Bookmark, Star, Calendar } from 'lucide-react';

const MediaCard = ({ item, isBookmarked, onToggleBookmark, onCardClick, onPlayClick }) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Center positions
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Rotate degrees (tilt sensitivity)
    const rotateX = ((centerY - y) / centerY) * 12; // max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12; // max 12 deg

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'all 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s ease'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onCardClick(item)}
      style={tiltStyle}
      className="interactive-card relative w-full aspect-[2/3] rounded-2xl overflow-hidden glassmorphism border border-white/5 cursor-pointer group"
    >
      {/* Background Poster Image */}
      <img
        src={item.posterUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 transition-opacity duration-300" />

      {/* Top action/tag badge row */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <span className="px-2 py-0.5 bg-black/60 border border-white/5 backdrop-blur-md rounded-md text-[10px] uppercase font-bold tracking-widest text-accentCyan flex items-center gap-1">
          <Star className="w-3 h-3 fill-accentCyan" />
          {item.rating}
        </span>

        {/* Bookmark Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(item);
          }}
          className={`p-2 rounded-full border transition-all duration-300 ${
            isBookmarked 
              ? 'bg-accentPink border-accentPink text-white shadow-glow-pink scale-110' 
              : 'bg-black/40 border-white/10 text-white/80 hover:text-white hover:bg-black/60'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Play CTA trigger hover reveal overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayClick(item);
          }}
          className="pointer-events-auto w-14 h-14 bg-gradient-to-tr from-primary to-accentPink rounded-full flex items-center justify-center text-white shadow-glow-primary scale-90 group-hover:scale-100 transition-transform duration-300"
        >
          <Play className="w-6 h-6 fill-white ml-1" />
        </button>
      </div>

      {/* Bottom info section */}
      <div className="absolute bottom-0 left-0 w-full p-5 z-10 flex flex-col justify-end">
        <div className="flex items-center space-x-2 text-[10px] text-accentCyan font-semibold tracking-wider uppercase mb-1">
          <span>{item.category}</span>
          <span>&bull;</span>
          <span className="text-textSecondary flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.year}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        
        <p className="text-[11px] text-textSecondary line-clamp-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.tagline}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;
// 
