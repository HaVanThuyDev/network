import React from 'react';
import { Globe, Tv, Headphones, ArrowUp, Sparkles } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-background border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-primary/10 filter blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accentPink flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-cinematic font-bold tracking-widest text-white">
                VIETPLAY
              </span>
            </div>
            <p className="text-sm text-textSecondary max-w-sm">
              Khám phá, trải nghiệm và hòa mình vào những tác phẩm phim ảnh, âm nhạc và trò chơi chọn lọc hàng đầu Việt Nam.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: <Globe className="w-5 h-5" />, href: "#", color: "hover:text-primary hover:shadow-glow-primary" },
                { icon: <Tv className="w-5 h-5" />, href: "#", color: "hover:text-accentPink hover:shadow-glow-pink" },
                { icon: <Headphones className="w-5 h-5" />, href: "#", color: "hover:text-accentCyan hover:shadow-glow-cyan" }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`p-2 bg-white/5 border border-white/10 rounded-full text-textSecondary transition-all duration-300 ${item.color}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-textPrimary uppercase mb-4">Vũ Trụ Giải Trí</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Phim Ảnh & Điện Ảnh</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Trò Chơi Tương Tác</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Âm Nhạc Đặc Sắc</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Nghệ Sĩ Nổi Bật</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-widest text-textPrimary uppercase mb-4">Nhận Bản Tin</h4>
            <p className="text-xs text-textSecondary">Đăng ký để nhận thông tin cập nhật các tác phẩm mới nhất hàng tuần.</p>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-white/5 border border-white/10 focus:border-primary/50 text-xs px-3 py-2 rounded-lg outline-none text-textPrimary w-full"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/80 transition-colors text-xs font-medium rounded-lg text-white">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-textSecondary/50">
            &copy; 2026 VIETPLAY Inc. Bảo lưu mọi quyền. Thiết kế theo phong cách trải nghiệm đẳng cấp.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-textSecondary hover:text-white rounded-full transition-all duration-300"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
