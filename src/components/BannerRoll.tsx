import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { BannerItem } from '../types';


interface BannerRollProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
  onBannerClick?: (banner: BannerItem) => void;
  className?: string;
  badgePrefix?: string;
}

export const BannerRoll: React.FC<BannerRollProps> = ({
  banners,
  autoPlayInterval = 4500,
  onBannerClick,
  className = '',
  badgePrefix = 'PUBLICIDADE',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      // swipe left
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (diff < -50) {
      // swipe right
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    touchStartX.current = null;
  };

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 group select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => onBannerClick && onBannerClick(currentBanner)}
    >
      {/* Banner Image Container */}
      <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-slate-900 cursor-pointer">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette Gradient */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />

            {/* Banner Content Overlay */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end text-white z-20">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-xs ${
                    banner.badgeColor || 'bg-sky-600'
                  }`}
                >
                  {banner.tag || badgePrefix}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base sm:text-xl md:text-2xl font-bold leading-tight line-clamp-1 drop-shadow-md">
                {banner.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 mt-1 max-w-xl drop-shadow-sm font-normal">
                {banner.subtitle}
              </p>

              {/* CTA button in banner */}
              {banner.ctaText && (
                <div className="mt-3 flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-900 px-3.5 py-1.5 rounded-full shadow-md group-hover:bg-sky-50 transition-colors">
                    {banner.ctaText}
                    <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (visible on hover or desktop) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 text-white/90 hover:bg-black/70 hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 focus:outline-hidden"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 text-white/90 hover:bg-black/70 hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 focus:outline-hidden"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Indicators Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-2.5 right-4 z-30 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
