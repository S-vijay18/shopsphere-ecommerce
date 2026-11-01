import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Sparkles, ChevronRight, Zap, Flame, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { CategoryBar } from '../components/CategoryBar';
import { ProductCarousel } from '../components/ProductCarousel';
import api from '../services/api';
import { Category, Product } from '../types';

interface ContextType {
  showToast: (msg: string) => void;
}

export const HomePage: React.FC = () => {
  const { showToast } = useOutletContext<ContextType>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<{
    popularPicks: Product[];
    spotlight: Product[];
    dealsOfDay: Product[];
    trending: Product[];
    topFashion: Product[];
    bestElectronics: Product[];
    homeKitchen: Product[];
    recommended: Product[];
  }>({
    popularPicks: [],
    spotlight: [],
    dealsOfDay: [],
    trending: [],
    topFashion: [],
    bestElectronics: [],
    homeKitchen: [],
    recommended: []
  });

  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Carousel Banners
  const heroBanners = [
    {
      id: 1,
      title: 'Grand Festive Electronics Carnival',
      subtitle: 'Up to 80% Off on Smartphones, Laptops & Smart TVs',
      cta: 'Shop Flagship Deals',
      link: '/products?category=electronics',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80',
      tag: 'Big Festive Sale'
    },
    {
      id: 2,
      title: 'The Great Autumn Fashion Gala',
      subtitle: 'Min. 60% Off on Denim, Kurtas, Ethnic Wear & Footwear',
      cta: 'Explore Styles',
      link: '/products?category=fashion',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
      tag: 'Trending Fashion'
    },
    {
      id: 3,
      title: 'Upgrade Your Home & Kitchen',
      subtitle: 'Starting ₹199 | Cooktops, Blenders, Organizers & Decor',
      cta: 'Shop Kitchenware',
      link: '/products?category=home',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      tag: 'Home Makeover'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, secRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/sections/homepage')
        ]);

        if (catsRes.data.success) {
          setCategories(catsRes.data.categories);
        }
        if (secRes.data.success) {
          setSections(secRes.data.sections);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto rotate hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  return (
    <div className="pb-12">
      {/* Category Navigation Bar */}
      <CategoryBar categories={categories} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
        
        {/* Hero Slider Banner */}
        <div className="relative w-full h-56 sm:h-72 md:h-84 lg:h-96 rounded-xl overflow-hidden shadow-md mb-6">
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
                <span className="inline-block bg-[#ff9f00] text-black text-xs sm:text-sm font-extrabold uppercase px-2.5 py-0.5 rounded-sm tracking-wider mb-2 w-max">
                  {banner.tag}
                </span>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight max-w-xl leading-tight mb-2">
                  {banner.title}
                </h1>
                <p className="text-xs sm:text-base text-gray-200 max-w-lg mb-4 hidden sm:block">
                  {banner.subtitle}
                </p>
                <div>
                  <Link
                    to={banner.link}
                    className="inline-flex items-center gap-2 py-2 px-5 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs sm:text-sm rounded shadow-lg transition"
                  >
                    <span>{banner.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Banner Dots Navigation */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* Promotional Banner – POPULAR PICKS (Flipkart festive orange & yellow design) */}
        {/* -------------------------------------------------------------------------- */}
        <section className="mb-6 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-[#ff9f00] via-[#fb641b] to-[#e6530b] p-4 sm:p-6 text-white relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-md">
                <Flame className="w-5 h-5 text-yellow-200 fill-yellow-200" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Popular Picks</span>
                  <span className="text-xs bg-white text-[#fb641b] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Festive Deals
                  </span>
                </h2>
                <p className="text-xs text-orange-100 font-medium">
                  Hand-picked blockbuster prices across top trending categories
                </p>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold bg-white text-[#e6530b] hover:bg-orange-50 px-3.5 py-1.5 rounded-md shadow-sm transition w-max"
            >
              <span>Explore All Deals</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Promotional Product Cards (Milton Bottle, Puma Shoes, Fastrack Watch, Philips Mixer) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {sections.popularPicks.map((pick) => {
              const image = pick.primary_image || (pick.images && pick.images[0]);
              return (
                <Link
                  key={pick.id}
                  to={`/product/${pick.slug}`}
                  className="group bg-white rounded-lg p-3 sm:p-4 text-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="w-full h-36 sm:h-44 rounded-md overflow-hidden bg-gray-50 mb-3 flex items-center justify-center p-2 relative">
                    <img
                      src={image}
                      alt={pick.name}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {pick.discount_percent}% OFF
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-1 group-hover:text-[#2874f0] transition">
                      {pick.popular_pick_title || pick.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-black text-[#2874f0]">
                        ₹{pick.discounted_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{pick.original_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#388e3c]">
                      Starting from ₹{pick.discounted_price}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Section 1: Best Deals of the Day (with live countdown timer!)               */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Best Deals of the Day"
          subtitle="Refreshes every 24 hours. Grab them before stock runs out!"
          products={sections.dealsOfDay}
          viewAllLink="/products?deal=true"
          hasTimer={true}
          bannerImage="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=400&q=80"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Section 2: In The Spotlight (Flagships & Top Brand Launches)                */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="In The Spotlight"
          subtitle="Premium flagships, OLED TVs & wireless audio"
          products={sections.spotlight}
          viewAllLink="/products?spotlight=true"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Mid-Page Promo Banners (Dual Flipkart Banner)                               */}
        {/* -------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            to="/products?category=fashion"
            className="group relative rounded-xl overflow-hidden shadow-sm h-40 sm:h-48 block"
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
              alt="Fashion Promo"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center p-6 text-white">
              <span className="text-xs uppercase font-extrabold text-[#ff9f00] tracking-wider">Top Brands</span>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight mt-1">Trendy Ethnic & Western</h3>
              <p className="text-xs text-gray-200 mt-1">Min. 50-70% Off on Levi's, BIBA & Puma</p>
              <span className="mt-3 inline-block font-bold text-xs bg-white text-gray-900 px-3 py-1.5 rounded w-max group-hover:bg-[#ff9f00] transition">
                Shop Collection →
              </span>
            </div>
          </Link>

          <Link
            to="/products?category=mobiles"
            className="group relative rounded-xl overflow-hidden shadow-sm h-40 sm:h-48 block"
          >
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
              alt="Mobiles Promo"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/40 to-transparent flex flex-col justify-center p-6 text-white">
              <span className="text-xs uppercase font-extrabold text-[#ffeb3b] tracking-wider">5G Revolution</span>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight mt-1">Galaxy AI & Flagship 5G</h3>
              <p className="text-xs text-blue-100 mt-1">Exchange bonus up to ₹15,000 + No Cost EMI</p>
              <span className="mt-3 inline-block font-bold text-xs bg-[#ff9f00] text-gray-950 px-3 py-1.5 rounded w-max group-hover:bg-yellow-300 transition">
                Explore Phones →
              </span>
            </div>
          </Link>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* Section 3: Trending Products                                               */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Trending Products"
          subtitle="What shoppers are buying right now"
          products={sections.trending}
          viewAllLink="/products?trending=true"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Section 4: Top Fashion Deals                                               */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Top Fashion Deals"
          subtitle="Jeans, Dresses, Kurtas & Footwear at lowest prices"
          products={sections.topFashion}
          viewAllLink="/products?category=fashion"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Section 5: Best Electronics                                                */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Best Electronics & Gadgets"
          subtitle="Laptops, TWS earbuds, smartwatches & accessories"
          products={sections.bestElectronics}
          viewAllLink="/products?category=electronics"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Section 6: Home & Kitchen Essentials                                       */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Home & Kitchen Essentials"
          subtitle="Induction cooktops, comforters, bottles & organizers"
          products={sections.homeKitchen}
          viewAllLink="/products?category=home"
          onToast={showToast}
        />

        {/* -------------------------------------------------------------------------- */}
        {/* Section 7: Recommended For You                                             */}
        {/* -------------------------------------------------------------------------- */}
        <ProductCarousel
          title="Recommended For You"
          subtitle="Based on browsing and purchase trends"
          products={sections.recommended}
          viewAllLink="/products"
          onToast={showToast}
        />

        {/* Flipkart Trust & Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="bg-white p-4 rounded-lg border border-gray-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-800">100% Authentic</h4>
              <p className="text-[11px] text-gray-500">Products sourced directly from brands</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-800">Fast Delivery</h4>
              <p className="text-[11px] text-gray-500">Express doorstep shipping across India</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-800">Best Price Guarantee</h4>
              <p className="text-[11px] text-gray-500">Unmatched discounts on everyday picks</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-800">Easy Returns</h4>
              <p className="text-[11px] text-gray-500">Hassle-free 7-day return policy</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

