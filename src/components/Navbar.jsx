import React, { useState } from 'react';
import { Search, Bookmark, Sparkles, Menu, X } from 'lucide-react';

const Navbar = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  showBookmarksOnly, 
  setShowBookmarksOnly,
  bookmarkCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 w-full z-40 backdrop-blur-xl border-b border-white/5 bg-background/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accentPink flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-cinematic font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-textPrimary via-primary to-accentCyan">
            VIETPLAY
          </span>
        </div>

        {/* Center: Main Desktop Navigation (Categories) */}
        <div className="hidden md:flex items-center space-x-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setShowBookmarksOnly(false);
              }}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:text-white ${
                activeCategory === category && !showBookmarksOnly
                  ? 'text-white bg-white/5 border border-white/10 shadow-glow-primary'
                  : 'text-textSecondary'
              }`}
            >
              {category}
              {activeCategory === category && !showBookmarksOnly && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Side: Search and Bookmarks */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dynamic Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm giải trí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-primary/50 rounded-full text-sm text-textPrimary placeholder:text-textSecondary/50 outline-none transition-all duration-300 focus:shadow-glow-primary"
            />
          </div>

          {/* Bookmarks Toggle button */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`relative p-2.5 rounded-full border transition-all duration-300 ${
              showBookmarksOnly
                ? 'bg-accentPink/15 border-accentPink text-accentPink shadow-glow-pink'
                : 'bg-white/5 border-white/10 text-textSecondary hover:text-textPrimary hover:bg-white/10'
            }`}
            title="Hiển thị danh sách yêu thích"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold bg-accentPink text-white rounded-full flex items-center justify-center border border-background">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Toggle Button */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`relative p-2 rounded-full border transition-all duration-300 ${
              showBookmarksOnly
                ? 'bg-accentPink/15 border-accentPink text-accentPink shadow-glow-pink'
                : 'bg-white/5 border-white/10 text-textSecondary'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-accentPink text-white rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white/5 border border-white/10 text-textSecondary rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-white/5 py-6 px-6 flex flex-col space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-white/5 border border-white/10 rounded-full text-sm text-textPrimary outline-none focus:border-primary/50"
            />
          </div>
          
          <div className="flex flex-col space-y-2 pt-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setShowBookmarksOnly(false);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  activeCategory === category && !showBookmarksOnly
                    ? 'bg-white/10 text-white border-l-2 border-primary'
                    : 'text-textSecondary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
