import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Shirt,
  Smartphone,
  Laptop,
  Heart,
  Home,
  Tv,
  Baby,
  Apple,
  Car,
  Trophy,
  Armchair,
  BookOpen,
  Bike,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Category } from '../types';

interface CategoryBarProps {
  categories?: Category[];
}

// Fallback category catalog matching the 14 Flipkart categories
const defaultCategoryList = [
  { id: 1, name: 'For You', slug: 'for-you', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
  { id: 2, name: 'Fashion', slug: 'fashion', icon: Shirt, color: 'text-pink-500 bg-pink-50' },
  { id: 3, name: 'Mobiles', slug: 'mobiles', icon: Smartphone, color: 'text-blue-500 bg-blue-50' },
  { id: 4, name: 'Electronics', slug: 'electronics', icon: Laptop, color: 'text-indigo-500 bg-indigo-50' },
  { id: 5, name: 'Beauty', slug: 'beauty', icon: Heart, color: 'text-rose-500 bg-rose-50' },
  { id: 6, name: 'Home', slug: 'home', icon: Home, color: 'text-amber-600 bg-amber-50' },
  { id: 7, name: 'Appliances', slug: 'appliances', icon: Tv, color: 'text-purple-500 bg-purple-50' },
  { id: 8, name: 'Toys & Baby Products', slug: 'toys-baby', icon: Baby, color: 'text-orange-500 bg-orange-50' },
  { id: 9, name: 'Food & Health', slug: 'food-health', icon: Apple, color: 'text-emerald-500 bg-emerald-50' },
  { id: 10, name: 'Auto Accessories', slug: 'auto-accessories', icon: Car, color: 'text-red-500 bg-red-50' },
  { id: 11, name: 'Sports', slug: 'sports', icon: Trophy, color: 'text-cyan-500 bg-cyan-50' },
  { id: 12, name: 'Furniture', slug: 'furniture', icon: Armchair, color: 'text-yellow-600 bg-yellow-50' },
  { id: 13, name: 'Books', slug: 'books', icon: BookOpen, color: 'text-teal-500 bg-teal-50' },
  { id: 14, name: 'Two Wheelers', slug: 'two-wheelers', icon: Bike, color: 'text-violet-500 bg-violet-50' }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({ categories }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
  };

  return (
    <div className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 relative group">
        
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:text-[#2874f0] hover:bg-gray-50 transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Categories Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto py-3 px-2 scrollbar-none no-scrollbar select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {defaultCategoryList.map((cat) => {
            const Icon = cat.icon;
            // Match backend image if available
            const backendMatch = categories?.find(c => c.slug === cat.slug);
            const imageUrl = backendMatch?.image_url;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex flex-col items-center justify-center cursor-pointer min-w-[70px] sm:min-w-[80px] group/item transition-transform hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-1.5 flex items-center justify-center bg-gray-50 border border-gray-100 group-hover/item:border-[#2874f0] transition shadow-xs">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <span className="text-[12px] sm:text-[13px] font-medium text-gray-700 text-center leading-tight whitespace-nowrap group-hover/item:text-[#2874f0] transition">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:text-[#2874f0] hover:bg-gray-50 transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

