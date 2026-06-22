import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Bookmark, Star, Clock, Calendar, Sparkles, Film } from 'lucide-react';

const getYoutubeId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

const DetailsModal = ({ 
  item, 
  onClose, 
  isBookmarked, 
  onToggleBookmark, 
  recommendations, 
  onRecommendationClick,
  onPlayClick 
}) => {
  if (!item) return null;

  const ytId = getYoutubeId(item.videoUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal viewport card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-5xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 glassmorphism-premium max-h-[90vh] flex flex-col"
        >
          {/* Header Video/Image Banner */}
          <div className="relative w-full aspect-[21/9] md:aspect-[2.4/1] bg-black overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
            {ytId ? (
              <iframe
                key={item.id}
                className="w-full h-full object-cover scale-[1.3] pointer-events-none"
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&playlist=${ytId}&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&playsinline=1`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                key={item.id}
                className="w-full h-full object-cover scale-[1.01]"
                src={item.videoUrl}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
            
            {/* Action buttons on banner */}
            <div className="absolute bottom-6 left-6 md:left-10 right-6 z-20 flex items-end justify-between">
              <div className="space-y-1 pr-4">
                <span className="text-[10px] text-accentCyan font-bold tracking-widest uppercase">{item.genre}</span>
                <h2 className="text-2xl md:text-4xl font-bold font-cinematic text-white drop-shadow-lg">
                  {item.title}
                </h2>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => onPlayClick(item)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accentPink text-white font-semibold text-xs md:text-sm rounded-xl hover:shadow-glow-primary transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Xem Ngay</span>
                </button>
                <button
                  onClick={() => onToggleBookmark(item)}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    isBookmarked
                      ? 'bg-accentPink border-accentPink text-white shadow-glow-pink'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/60 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 md:p-10 overflow-y-auto flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Specs & Metadata columns */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-textSecondary">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-md border border-white/5 text-accentCyan font-bold">
                    <Star className="w-3.5 h-3.5 fill-accentCyan" />
                    {item.rating} Điểm
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-md border border-white/5">
                    <Clock className="w-3.5 h-3.5" />
                    {item.duration}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-md border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.year}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm uppercase font-bold tracking-widest text-white/50">Giới Thiệu</h3>
                  <p className="text-sm md:text-base text-textSecondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Creators & Details */}
              <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">Nghệ Sĩ / Đạo Diễn</span>
                  <span className="text-sm font-semibold text-white">{item.author}</span>
                </div>
                <div>
                  <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">Danh Mục</span>
                  <span className="text-sm font-semibold text-white">{item.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">Phát Hành</span>
                  <span className="text-sm font-semibold text-white">Năm {item.year}</span>
                </div>
              </div>
            </div>

            {/* Recommendations Row */}
            {recommendations && recommendations.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2 text-white">
                  <Sparkles className="w-4 h-4 text-accentCyan" />
                  <h4 className="text-sm uppercase font-bold tracking-wider">Nội Dung Đề Xuất</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendations.slice(0, 4).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onRecommendationClick(rec)}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-accentCyan/30 transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={rec.backdropUrl}
                          alt={rec.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h5 className="text-xs font-bold text-white group-hover:text-accentCyan transition-colors line-clamp-1">
                          {rec.title}
                        </h5>
                        <span className="text-[9px] text-textSecondary">{rec.genre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DetailsModal;
