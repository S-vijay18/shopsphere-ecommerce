import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  MapPin,
  Heart,
  Package,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Store,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Compass,
  Plane,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PincodeModal } from './PincodeModal';
import api from '../services/api';
import { Product } from '../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, openAuthModal, selectedPincode } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.products);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/product/${slug}`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : 'border-b border-gray-200'
        }`}
      >
        {/* Top Mini Bar with Shopping, Travel & Offers */}
        <div className="bg-[#f8f9fa] border-b border-gray-200/80 hidden md:block text-xs text-gray-600">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
            <div className="flex items-center space-x-6 font-medium">
              <Link to="/" className="flex items-center gap-1.5 text-[#2874f0] hover:text-[#1259c3]">
                <Compass className="w-3.5 h-3.5" />
                <span>Shop</span>
              </Link>
              <Link to="/products?category=food-health" className="flex items-center gap-1.5 hover:text-[#2874f0]">
                <span>Grocery & Essentials</span>
              </Link>
              <Link to="/products?category=for-you" className="flex items-center gap-1.5 hover:text-[#2874f0]">
                <Plane className="w-3.5 h-3.5" />
                <span>Travel & Flights</span>
              </Link>
              <Link to="/products?deal=true" className="flex items-center gap-1.5 text-orange-600 font-semibold hover:text-orange-700">
                <Tag className="w-3.5 h-3.5" />
                <span>Top Offers & Super Deals</span>
              </Link>
            </div>

            {/* Right side helper links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setIsPincodeModalOpen(true)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#2874f0] font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>Deliver to <strong>{selectedPincode}</strong></span>
              </button>
              <span className="text-gray-400">|</span>
              <a href="#footer" className="hover:text-[#2874f0]">24x7 Customer Care</a>
            </div>
          </div>
        </div>

        {/* Main Flipkart-Style Blue Accent / White Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-700 hover:text-[#2874f0] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo on the Left */}
          <Link to="/" className="flex flex-col items-start select-none flex-shrink-0">
            <div className="flex items-center gap-1 text-[#2874f0] font-extrabold text-2xl tracking-tight leading-none italic font-sans">
              <span>Shop</span>
              <span className="text-[#fb641b]">Sphere</span>
              <Sparkles className="w-4 h-4 text-[#ff9f00] fill-[#ff9f00]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 italic mt-0.5">
              <span>Explore</span>
              <span className="text-[#ff9f00] font-bold">Plus</span>
              <span className="text-[#ff9f00] text-xs">✦</span>
            </div>
          </Link>

          {/* Large Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl mx-2 md:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search for Products, Brands and More"
                className="w-full pl-10 pr-12 py-2.5 bg-[#f0f5ff]/70 hover:bg-[#f0f5ff] focus:bg-white border border-transparent focus:border-[#2874f0] rounded-lg text-sm text-gray-800 placeholder-gray-500 outline-none transition shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-10 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-[#2874f0] hover:text-[#1259c3]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2 border-b border-gray-100 text-[11px] font-semibold uppercase text-gray-400 flex items-center justify-between">
                  <span>Matching Products</span>
                  {isSearching && <span className="text-[#2874f0]">Searching...</span>}
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item.slug)}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center gap-3 transition"
                    >
                      <img
                        src={item.primary_image || (item.images && item.images[0])}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded bg-white border border-gray-100 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500">in {item.category_name} • {item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">₹{item.discounted_price.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">{item.discount_percent}% off</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={handleSearchSubmit}
                  className="p-2.5 text-center text-xs font-semibold text-[#2874f0] bg-gray-50 hover:bg-blue-50 cursor-pointer"
                >
                  View all results for "{searchTerm}" →
                </div>
              </div>
            )}
          </div>

          {/* Right Header Navigation Options */}
          <div className="flex items-center space-x-2 md:space-x-5">
            
            {/* Delivery location selector for mobile/desktop */}
            <button
              onClick={() => setIsPincodeModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#2874f0] py-1.5 px-2.5 rounded-md hover:bg-gray-100 transition"
              title="Change Delivery PIN code"
            >
              <MapPin className="w-4 h-4 text-[#2874f0]" />
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 uppercase leading-none">Deliver to</span>
                <span className="font-bold text-gray-800 leading-none">{selectedPincode}</span>
              </div>
            </button>

            {/* Login / Register Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#2874f0]"
                  />
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              ) : (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 py-1.5 px-4 bg-[#2874f0] hover:bg-[#1259c3] text-white rounded-md text-sm font-semibold shadow-sm transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 z-50 animate-fade-in divide-y divide-gray-100">
                  {!user ? (
                    <div className="p-3 bg-blue-50/60 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">New customer?</span>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          openAuthModal('register');
                        }}
                        className="text-xs font-bold text-[#2874f0] hover:underline"
                      >
                        Sign Up
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          Store Administrator
                        </span>
                      )}
                    </div>
                  )}

                  <div className="py-1 text-xs text-gray-700">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <UserIcon className="w-4 h-4 text-[#2874f0]" />
                      <span>My Profile</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-amber-50 text-amber-900 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <Package className="w-4 h-4 text-[#2874f0]" />
                      <span>Orders</span>
                    </Link>

                    <Link
                      to="/profile?tab=wishlist"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-[#2874f0]" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-red-100 text-red-600 rounded-full font-bold text-[10px]">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-600">
                      <Sparkles className="w-4 h-4 text-[#ff9f00]" />
                      <span>ShopSphere Plus Zone</span>
                    </div>
                  </div>

                  {user ? (
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          openAuthModal('login');
                        }}
                        className="w-full py-1.5 bg-[#2874f0] text-white text-xs font-semibold rounded hover:bg-[#1259c3]"
                      >
                        Log In
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* More Options Dropdown */}
            <div ref={moreMenuRef} className="relative hidden md:block">
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#2874f0] hover:bg-gray-100 transition"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showMoreDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-fade-in text-xs text-gray-700">
                  <a
                    href="#seller"
                    onClick={() => setShowMoreDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 font-medium"
                  >
                    <Store className="w-4 h-4 text-[#2874f0]" />
                    <span>Become a Seller</span>
                  </a>
                  <Link
                    to="/about"
                    onClick={() => setShowMoreDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100"
                  >
                    <HelpCircle className="w-4 h-4 text-[#2874f0]" />
                    <span>24x7 Customer Care & About</span>
                  </Link>
                  <a
                    href="#advertise"
                    onClick={() => setShowMoreDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100"
                  >
                    <TrendingUp className="w-4 h-4 text-[#2874f0]" />
                    <span>Advertise on ShopSphere</span>
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-4 py-2 text-[11px] text-gray-400">
                    App Version 2.8.4 • Made with Pride
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Icon with Live Badge */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 py-1.5 px-3 rounded-lg text-gray-800 hover:text-[#2874f0] hover:bg-gray-100 transition font-semibold text-sm"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#ff6161] text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3 animate-fade-in shadow-lg">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="w-full flex items-center gap-2 text-xs py-2 px-3 bg-gray-50 rounded border border-gray-200 text-gray-700"
            >
              <MapPin className="w-4 h-4 text-[#2874f0]" />
              <span>Deliver to <strong>{selectedPincode}</strong> (Change)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-gray-100 text-gray-800 text-center"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-blue-50 text-[#2874f0] text-center font-bold"
              >
                All Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-gray-100 text-gray-800 text-center flex items-center justify-center gap-1"
              >
                Cart ({itemCount})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-gray-100 text-gray-800 text-center"
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Pincode Modal */}
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
      />
    </>
  );
};

