import { Globe, Tv, Headphones, ArrowUp, Sparkles, Mail, Phone } from 'lucide-react';

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
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-accentPink to-accentCyan flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-[1px] bg-[#0b0b10] rounded-[9px] flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-primary via-accentPink to-accentCyan font-black text-xs tracking-tighter">
                    2HT
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-cinematic font-black tracking-widest text-white leading-none">
                  2HT
                </span>
                <span className="text-[7px] font-bold tracking-[0.3em] text-accentCyan uppercase leading-none mt-1">
                  ENTERTAINMENT
                </span>
              </div>
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

          {/* Web Design Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-widest text-textPrimary uppercase mb-4">
              Thiết Kế Website
            </h4>
            <p className="text-xs text-textSecondary leading-relaxed">
              Hệ thống được thiết kế và phát triển bởi <strong className="text-white">Hà Văn Thủy</strong>. Liên hệ nhận tư vấn thiết kế web chuyên nghiệp:
            </p>
            <ul className="space-y-3 text-xs text-textSecondary">
              <li className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-accentCyan">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a href="tel:0383717785" className="hover:text-white transition-colors">
                  038.371.7785
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6 2 11c0 2.8 1.5 5.3 3.7 6.9-.1 1.3-.6 3.1-.7 3.4-.1.5.2.4.4.3.2-.1.2.3 1-1.6.9-2.1 1.5-3.6 1.5-3.8.1-.2.1-.3.1-.3 2.1 1.3 4.8 1.5 7.2.5 4.2-1.8 5.6-6.2 5.6-10.5C20.8 6 16.8 2 12 2zm3.4 12.8h-6.8v-1.6l2.9-3.6h-2.9V8h6.8v1.6l-2.9 3.6h2.9v1.6z" />
                  </svg>
                </div>
                <a href="https://zalo.me/0383717785" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Zalo: 038.371.7785
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-accentPink">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </div>
                <a href="https://www.facebook.com/havanthuy2003" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Hà Văn Thủy
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:hathuongthuy113@gmail.com" className="hover:text-white transition-colors break-all">
                  hathuongthuy113@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-textSecondary/50">
            &copy; 2026 2HT ENTERTAINMENT. Bảo lưu mọi quyền. Thiết kế theo phong cách trải nghiệm đẳng cấp.
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
