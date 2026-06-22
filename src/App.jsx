import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Film, Play, Bookmark, Sparkles, Volume2, VolumeX, Maximize, RotateCcw, X, MessageSquare, Send } from 'lucide-react';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCarousel from './components/FeaturedCarousel';
import MediaCard from './components/MediaCard';
import DetailsModal from './components/DetailsModal';
import Footer from './components/Footer';

import { categories, mediaData } from './services/mockData';
import { fetchWeeklyMediaFromGemini, askGeminiChat } from './services/geminiService';
import { fetchMediaListFromFirebase, saveMediaListToFirebase } from './services/firebase';

const getYoutubeId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

const sanitizeAndDeduplicateMediaList = (list) => {
  if (!Array.isArray(list)) return [];
  
  const uniqueItems = [];
  const titlesSeen = new Set();
  const imagesSeen = new Set();

  list.forEach((item, idx) => {
    if (!item.title || !item.id) return;
    
    const titleNormalized = item.title.trim().toUpperCase();
    if (titlesSeen.has(titleNormalized)) {
      return;
    }
    titlesSeen.add(titleNormalized);

    let poster = item.posterUrl || "";
    let backdrop = item.backdropUrl || "";

    const isFallbackPoster = !poster || 
      imagesSeen.has(poster) || 
      poster.includes("photo-1536440136628") || 
      poster.includes("photo-1511671782779") || 
      poster.includes("photo-1538481199705");

    const isFallbackBackdrop = !backdrop || 
      imagesSeen.has(backdrop) || 
      backdrop.includes("photo-1489599849927") || 
      backdrop.includes("photo-1514525253161") || 
      backdrop.includes("photo-1542751371-adc");

    if (isFallbackPoster) {
      const query = item.category === "Phim Ảnh" ? "movie,cinema" : item.category === "Âm Nhạc" ? "concert,singer" : "gaming,joystick";
      poster = `https://images.unsplash.com/featured/500x750/?${query}&sig=${encodeURIComponent(item.id || idx)}`;
    } else {
      imagesSeen.add(poster);
    }

    if (isFallbackBackdrop) {
      const query = item.category === "Phim Ảnh" ? "movie,theater" : item.category === "Âm Nhạc" ? "live,music" : "gaming,playstation";
      backdrop = `https://images.unsplash.com/featured/1200x675/?${query}&sig=${encodeURIComponent(item.id || idx)}`;
    } else {
      imagesSeen.add(backdrop);
    }

    uniqueItems.push({
      ...item,
      posterUrl: poster,
      backdropUrl: backdrop
    });
  });

  return uniqueItems;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Media list dynamically loaded from local storage or default data
  const [mediaList, setMediaList] = useState(() => {
    try {
      const saved = localStorage.getItem('2ht_media_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Automatic recovery: check if any item has invalid or blank YouTube video IDs
          const hasInvalidYtLinks = parsed.some(item => {
            if (item.videoUrl && (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be'))) {
              const ytId = getYoutubeId(item.videoUrl);
              return !ytId || ytId.length !== 11;
            }
            return !item.videoUrl; // if videoUrl is missing entirely
          });

          if (!hasInvalidYtLinks) {
            return sanitizeAndDeduplicateMediaList(parsed);
          }
        }
      }
      return sanitizeAndDeduplicateMediaList(mediaData);
    } catch (e) {
      console.error("Failed to parse 2ht_media_list, using default mediaData", e);
      return sanitizeAndDeduplicateMediaList(mediaData);
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('network_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      console.error("Failed to parse network_bookmarks, using empty array", e);
      return [];
    }
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeHeroItem, setActiveHeroItem] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // AI Settings Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [isFetchingAi, setIsFetchingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState(false);

  // Theater mode state
  const [playingItem, setPlayingItem] = useState(null);
  const [isCinemaMuted, setIsCinemaMuted] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  // Load random featured item for Hero when mediaList updates
  useEffect(() => {
    const featured = mediaList.filter(m => m.featured);
    if (featured.length > 0) {
      const random = featured[Math.floor(Math.random() * featured.length)];
      setActiveHeroItem(random);
    } else {
      setActiveHeroItem(mediaList[0]);
    }
  }, [mediaList]);

  // Fetch media list from Firebase on mount
  useEffect(() => {
    const loadFirebaseData = async () => {
      const fbData = await fetchMediaListFromFirebase();
      if (fbData && fbData.length > 0) {
        const cleanData = sanitizeAndDeduplicateMediaList(fbData);
        setMediaList(cleanData);
        localStorage.setItem('2ht_media_list', JSON.stringify(cleanData));
        console.log("🔥 Kết nối Firebase thành công! Đã nạp danh sách tác phẩm: ", cleanData);
      } else {
        // If Firebase is empty, initialize it with current mediaList
        console.log("🔥 Firebase chưa có dữ liệu. Đang khởi tạo cơ sở dữ liệu với danh sách mặc định...");
        await saveMediaListToFirebase(mediaList);
      }
    };
    loadFirebaseData();
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
  const filteredItems = mediaList.filter((item) => {
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

  const featuredItems = mediaList.filter(item => item.featured);

  // Recommendations logic for details modal
  const getRecommendations = (item) => {
    if (!item) return [];
    return mediaList.filter(m => m.id !== item.id && m.category === item.category);
  };

  const validateGeminiData = (data) => {
    if (!Array.isArray(data) || data.length < 5) return false;
    
    const validCategories = ["Phim Ảnh", "Trò Chơi", "Âm Nhạc"];
    
    // Check required fields and categories
    for (const item of data) {
      if (!item.id || !item.title || !item.category || !item.videoUrl || !item.posterUrl || !item.backdropUrl) {
        return false;
      }
      if (!validCategories.includes(item.category)) {
        return false;
      }
    }

    // Verify we have at least 2 featured items for Swiper
    const featuredCount = data.filter(item => item.featured).length;
    if (featuredCount < 2) {
      return false;
    }

    return true;
  };

  const handleUpdateFromAi = async () => {
    if (!geminiApiKey.trim()) {
      setAiError('Vui lòng nhập API Key.');
      return;
    }
    setIsFetchingAi(true);
    setAiError('');
    setAiSuccess(false);

    try {
      const data = await fetchWeeklyMediaFromGemini(geminiApiKey);
      const cleanData = sanitizeAndDeduplicateMediaList(data);
      if (!validateGeminiData(cleanData)) {
        throw new Error("Dữ liệu từ AI chưa đầy đủ hoặc không đúng danh mục hiển thị chuẩn. Đang thử lại sau.");
      }
      setMediaList(cleanData);
      localStorage.setItem('2ht_media_list', JSON.stringify(cleanData));
      localStorage.setItem('gemini_api_key', geminiApiKey);
      localStorage.setItem('2ht_last_ai_update', Date.now().toString());
      await saveMediaListToFirebase(cleanData);
      setAiSuccess(true);
      setTimeout(() => {
        setIsAiModalOpen(false);
        setAiSuccess(false);
      }, 1500);
    } catch (err) {
      console.warn("Lỗi Gemini update:", err);
      // Timeout hoặc lỗi format, thông báo lỗi và giữ nguyên danh sách hiện tại làm hàng đợi fallback
      setAiError(`${err.message || 'Không kết nối được Gemini API.'} Đã sử dụng danh sách hiện tại làm hàng đợi dự phòng.`);
    } finally {
      setIsFetchingAi(false);
    }
  };

  const handleResetToDefault = () => {
    localStorage.removeItem('2ht_media_list');
    localStorage.removeItem('2ht_last_ai_update');
    const cleanDefault = sanitizeAndDeduplicateMediaList(mediaData);
    setMediaList(cleanDefault);
    saveMediaListToFirebase(cleanDefault);
    setIsAiModalOpen(false);
  };

  // Chatbox States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI chuyên về phim truyện và âm nhạc Việt Nam của 2HT ENTERTAINMENT. Bạn cần tôi tư vấn bộ phim nào hay bản nhạc hot nào đang thịnh hành hôm nay?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = React.useRef(null);

  // Auto-scroll logic for chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen, chatMessages]);

  // Auto update logic (2 times a week = check every 3.5 days)
  useEffect(() => {
    const checkAutoUpdate = async () => {
      const lastUpdate = localStorage.getItem('2ht_last_ai_update');
      const now = Date.now();
      const threeAndHalfDaysMs = 3.5 * 24 * 60 * 60 * 1000;

      if (!lastUpdate || (now - parseInt(lastUpdate)) > threeAndHalfDaysMs) {
        if (geminiApiKey) {
          try {
            console.log("Auto-updating media database via Gemini AI...");
            const data = await fetchWeeklyMediaFromGemini(geminiApiKey);
            const cleanData = sanitizeAndDeduplicateMediaList(data);
            if (validateGeminiData(cleanData)) {
              setMediaList(cleanData);
              localStorage.setItem('2ht_media_list', JSON.stringify(cleanData));
              localStorage.setItem('2ht_last_ai_update', now.toString());
              await saveMediaListToFirebase(cleanData);
              console.log("Auto-update success!");
            } else {
              console.warn("Auto-update data validation failed. Kept current media list.");
            }
          } catch (err) {
            console.error("Auto-update from Gemini failed:", err);
          }
        }
      }
    };

    const timer = setTimeout(checkAutoUpdate, 4000);
    return () => clearTimeout(timer);
  }, [geminiApiKey]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isSendingChat) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setIsSendingChat(true);

    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);

    try {
      const reply = await askGeminiChat(userMessage, chatMessages, geminiApiKey);
      setChatMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'assistant', content: `⚠️ Lỗi: ${err.message || 'Không thể kết nối tới trợ lý AI.'}` }]);
    } finally {
      setIsSendingChat(false);
    }
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
            onAiClick={() => setIsAiModalOpen(true)}
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
                      src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(playingItem.videoUrl)}?autoplay=1&mute=${isCinemaMuted ? 1 : 0}&playlist=${getYoutubeId(playingItem.videoUrl)}&loop=1&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
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

          {/* 10. Gemini AI Settings Modal */}
          <AnimatePresence>
            {isAiModalOpen && (
              <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !isFetchingAi && setIsAiModalOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md bg-[#0f0f16]/95 border border-white/10 p-6 rounded-2xl shadow-2xl z-10 glassmorphism-premium"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-accentCyan animate-pulse" />
                      <h3 className="text-lg font-bold text-white font-cinematic">Gemini AI Auto-Update</h3>
                    </div>
                    <button
                      onClick={() => setIsAiModalOpen(false)}
                      disabled={isFetchingAi}
                      className="p-1 text-textSecondary hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-textSecondary leading-relaxed">
                      Nhập **Google Gemini API Key** của bạn để tự động cập nhật danh sách phim ảnh, âm nhạc và trò chơi hot nhất tuần từ AI.
                    </p>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-textSecondary block mb-1">
                        Gemini API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập API Key (AIzaSy...)"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        disabled={isFetchingAi}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {aiError && (
                      <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                        ⚠️ {aiError}
                      </p>
                    )}

                    {aiSuccess && (
                      <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                        🎉 Cập nhật thành công! Danh sách giải trí mới đã sẵn sàng.
                      </p>
                    )}

                     <div className="flex flex-col space-y-2">
                      <button
                        onClick={handleUpdateFromAi}
                        disabled={isFetchingAi}
                        className="w-full py-2.5 bg-gradient-to-r from-primary via-accentPink to-accentCyan text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isFetchingAi ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang tải đề xuất...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Cập nhật qua AI</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResetToDefault}
                        disabled={isFetchingAi}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-textSecondary hover:text-white rounded-lg text-xs font-semibold border border-white/5 transition-colors"
                      >
                        Khôi phục dữ liệu gốc
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 11. Floating Chat Assistant */}
          <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end">
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="mb-4 w-[360px] h-[480px] bg-[#0c0c12]/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden glassmorphism-premium"
                >
                  {/* Chat Header */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 via-accentPink/10 to-accentCyan/10 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accentPink flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-none">Trợ Lý Âm Nhạc & Phim</h4>
                        <span className="text-[9px] text-accentCyan uppercase tracking-widest font-bold">Powered by 2HT</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="p-1 text-textSecondary hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-tr from-primary to-accentPink text-white rounded-tr-none'
                              : 'bg-white/5 border border-white/5 text-textSecondary rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isSendingChat && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/5 text-textSecondary rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="p-3 bg-white/5 border-t border-white/10 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      placeholder="Hỏi về phim truyện, âm nhạc Việt Nam..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isSendingChat}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSendingChat || !chatInput.trim()}
                      className="p-2 bg-gradient-to-tr from-primary to-accentPink text-white rounded-xl hover:shadow-glow-primary transition-all disabled:opacity-40 disabled:hover:shadow-none flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
              onClick={() => setIsChatOpen(!isChatOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-tr from-primary via-accentPink to-accentCyan rounded-full flex items-center justify-center shadow-glow-primary text-white cursor-pointer relative overflow-hidden group/chatbtn"
            >
              <div className="absolute inset-[2px] bg-[#0c0c12] rounded-full flex items-center justify-center group-hover/chatbtn:bg-transparent transition-colors duration-300">
                <MessageSquare className="w-6 h-6 text-white group-hover/chatbtn:scale-110 transition-transform duration-300" />
              </div>
              
              {unreadCount > 0 && !isChatOpen && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-[#0c0c12] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </div>

        </motion.div>
      )}
    </div>
  );
}

export default App;
