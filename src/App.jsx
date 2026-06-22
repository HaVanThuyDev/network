import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Film, Play, Bookmark, Sparkles, Volume2, VolumeX, Maximize, RotateCcw, X } from 'lucide-react';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCarousel from './components/FeaturedCarousel';
import MediaCard from './components/MediaCard';
import DetailsModal from './components/DetailsModal';
import Footer from './components/Footer';

import { categories, mediaData } from './services/mockData';

const getYoutubeId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('network_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeHeroItem, setActiveHeroItem] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Theater mode state
  const [playingItem, setPlayingItem] = useState(null);
  const [isCinemaMuted, setIsCinemaMuted] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  // Load random featured item for Hero on startup
  useEffect(() => {
    const featured = mediaData.filter(m => m.featured);
    if (featured.length > 0) {
      const random = featured[Math.floor(Math.random() * featured.length)];
      setActiveHeroItem(random);
    } else {
      setActiveHeroItem(mediaData[0]);
    }
  }, []);

  // Persist Bookmarks
  useEffect(() => {
    localStorage.setItem('network_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Toggle Bookmark logic
  const handleToggleBookmark = (item) => {
    setBookmarks((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  // Filter content reactively
  const filteredItems = mediaData.filter((item) => {
    // Bookmarks filter
    if (showBookmarksOnly && !bookmarks.includes(item.id)) {
      return false;
    }
    // Category filter
    if (activeCategory !== "Tất Cả" && item.category !== activeCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchGenre = item.genre.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      return matchTitle || matchGenre || matchDesc;
    }
    return true;
  });

  const featuredItems = mediaData.filter(item => item.featured);

  // Recommendations logic for details modal
  const getRecommendations = (item) => {
    if (!item) return [];
    return mediaData.filter(m => m.id !== item.id && m.category === item.category);
  };

  return (
    <div 
      className="relative min-h-screen text-textPrimary selection:bg-primary selection:text-white overflow-hidden pb-6 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: "linear-gradient(rgba(10, 10, 15, 0.85), rgba(10, 10, 15, 0.95)), url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920')" 
      }}
    >
      
      {/* 1. Loading Preloader */}
      <AnimatePresence>
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main content grid */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col min-h-screen"
        >
          {/* 3. Navigation Header bar */}
          <Navbar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showBookmarksOnly={showBookmarksOnly}
            setShowBookmarksOnly={setShowBookmarksOnly}
            bookmarkCount={bookmarks.length}
          />

          {/* 4. Cinematic Hero Showcase */}
          {!showBookmarksOnly && searchQuery.trim() === "" && (
            <Hero
              activeMovie={activeHeroItem}
              onPlayClick={(item) => setPlayingItem(item)}
              onDetailsClick={(item) => setSelectedItem(item)}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          )}

          {/* 5. Spotlight Coverflow Carousel */}
          {!showBookmarksOnly && searchQuery.trim() === "" && activeCategory === "Tất Cả" && (
            <FeaturedCarousel
              items={featuredItems}
              onCardClick={(item) => setSelectedItem(item)}
              onPlayClick={(item) => setPlayingItem(item)}
            />
          )}

          {/* 6. Media Database Section Grid */}
          <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl md:text-3xl font-cinematic font-bold tracking-wider text-white">
                  {showBookmarksOnly 
                    ? "Danh Sách Yêu Thích Của Bạn" 
                    : activeCategory === "Tất Cả" 
                      ? "Khám Phá Các Tác Phẩm" 
                      : `${activeCategory} Chọn Lọc`
                  }
                </h2>
                <p className="text-xs text-textSecondary mt-1">
                  Đang hiển thị {filteredItems.length} tác phẩm
                </p>
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MediaCard
                      item={item}
                      isBookmarked={bookmarks.includes(item.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onCardClick={(item) => setSelectedItem(item)}
                      onPlayClick={(item) => setPlayingItem(item)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-5xl block mb-4">🛸</span>
                <h3 className="text-lg font-bold text-white mb-2">Không Tìm Thấy Tác Phẩm Nào</h3>
                <p className="text-sm text-textSecondary max-w-md mx-auto">
                  Hãy thử thay đổi từ khóa tìm kiếm, chọn danh mục khác hoặc thêm các tác phẩm vào mục yêu thích!
                </p>
              </div>
            )}
          </main>

          {/* 7. Footer Layout */}
          <Footer />

          {/* 8. Specs Detail Viewport Modal */}
          <DetailsModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            isBookmarked={selectedItem ? bookmarks.includes(selectedItem.id) : false}
            onToggleBookmark={handleToggleBookmark}
            recommendations={getRecommendations(selectedItem)}
            onRecommendationClick={(rec) => setSelectedItem(rec)}
            onPlayClick={(item) => {
              setSelectedItem(null);
              setPlayingItem(item);
            }}
          />

          {/* 9. Fullscreen Movie Theater Player Mode */}
          <AnimatePresence>
            {playingItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black flex flex-col justify-between"
              >
                {/* Cinema HUD Top Bar */}
                <div className="p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg text-white">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-cinematic">{playingItem.title}</h3>
                      <p className="text-xs text-accentCyan uppercase font-bold tracking-widest">{playingItem.genre}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setPlayingItem(null)}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Cinema Screen Video Player */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {getYoutubeId(playingItem.videoUrl) ? (
                    <iframe
                      key={playingItem.id}
                      className="w-full h-full object-contain aspect-video"
                      src={`https://www.youtube.com/embed/${getYoutubeId(playingItem.videoUrl)}?autoplay=1&mute=${isCinemaMuted ? 1 : 0}&playlist=${getYoutubeId(playingItem.videoUrl)}&loop=1&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
                      title={playingItem.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={playingItem.id}
                      className="w-full h-full object-contain"
                      src={playingItem.videoUrl}
                      autoPlay={isPlayingVideo}
                      loop
                      muted={isCinemaMuted}
                      playsInline
                    />
                  )}
                  
                  {/* Glowing Cinematic border lighting simulation */}
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-primary/10 shadow-[inset_0_0_80px_rgba(127,90,240,0.3)] animate-pulse" />
                </div>

                {/* Cinema Control HUD Bottom Bar */}
                <div className="p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col space-y-4">
                  {/* Fake seeker bar */}
                  <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accentPink to-accentCyan"
                      initial={{ width: "0%" }}
                      animate={isPlayingVideo ? { width: "100%" } : {}}
                      transition={{ duration: 40, ease: "linear" }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-white">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                      <button
                        onClick={() => setIsCinemaMuted(!isCinemaMuted)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {isCinemaMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>

                    <span className="text-xs text-textSecondary tracking-wider">
                      ĐANG TRẢI NGHIỆM &bull; CHẾ ĐỘ RẠP CHIẾU
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </div>
  );
}

export default App;
