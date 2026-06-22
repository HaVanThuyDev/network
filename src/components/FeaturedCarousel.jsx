import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { Play, Sparkles, Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FeaturedCarousel = ({ items, onCardClick, onPlayClick }) => {
  return (
    <div className="relative w-full py-16 px-6 overflow-hidden bg-background/50">
      {/* Decorative Neon Blurs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary/5 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accentCyan/5 filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl md:text-3xl font-cinematic font-bold tracking-wider text-white">
            Đề Cử Đặc Sắc
          </h2>
        </div>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          className="featured-swiper !pb-12"
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            }
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="relative w-[340px] md:w-[420px] aspect-[16/10] rounded-2xl overflow-hidden glassmorphism border border-white/10 group cursor-pointer">
              {/* Cover Image */}
              <img
                src={item.backdropUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex space-x-2 z-10">
                <span className="px-2.5 py-1 bg-primary/80 border border-primary/20 backdrop-blur-md rounded-md text-[10px] uppercase font-bold tracking-wider text-white flex items-center gap-1 shadow-glow-primary">
                  <Sparkles className="w-3 h-3" />
                  Nổi Bật
                </span>
                <span className="px-2.5 py-1 bg-black/60 border border-white/5 backdrop-blur-md rounded-md text-[10px] uppercase font-bold tracking-wider text-accentCyan flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accentCyan" />
                  {item.rating}
                </span>
              </div>

              {/* Bottom Info Details */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-10 flex flex-col justify-end">
                <span className="text-[10px] text-accentPink font-bold tracking-widest uppercase mb-1">{item.genre}</span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-textSecondary line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayClick(item);
                    }}
                    className="flex items-center justify-center p-2.5 bg-white text-background rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => onCardClick(item)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-lg transition-colors duration-300"
                  >
                    Chi Tiết
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
