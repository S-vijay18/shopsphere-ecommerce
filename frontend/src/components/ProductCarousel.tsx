import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  hasTimer?: boolean;
  bannerImage?: string;
  onToast?: (msg: string) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  products,
  viewAllLink = '/products',
  hasTimer = false,
  bannerImage,
  onToast
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Deals Countdown Timer (simulated e.g. 14h:32m:15s)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    if (!hasTimer) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasTimer]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 mb-5 relative">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>

          {/* Deal Countdown Timer */}
          {hasTimer && (
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-200">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>
                Ending in {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          )}
        </div>

        {/* View All Button */}
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2874f0] hover:text-[#1259c3] transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Content with Optional Left Promo Banner and Cards Carousel */}
      <div className="relative group/carousel pt-4">
        
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:text-[#2874f0] hover:bg-gray-50 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Row */}
        <div
          ref={scrollRef}
          className="flex items-stretch space-x-4 overflow-x-auto pb-2 scrollbar-none no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bannerImage && (
            <div className="min-w-[220px] max-w-[220px] hidden lg:block rounded-lg overflow-hidden relative shadow-sm border border-gray-100 flex-shrink-0">
              <img src={bannerImage} alt="Promo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-xs uppercase font-bold text-amber-300">Special Selection</span>
                <h4 className="text-base font-bold leading-tight mb-2">Curated for You</h4>
                <Link
                  to={viewAllLink}
                  className="inline-block text-center py-1.5 px-3 bg-white text-gray-900 rounded text-xs font-bold hover:bg-amber-400 transition"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          )}

          {products.map((prod) => (
            <div key={prod.id} className="min-w-[210px] sm:min-w-[240px] max-w-[250px] flex-shrink-0">
              <ProductCard product={prod} onToast={onToast} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:text-[#2874f0] hover:bg-gray-50 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

