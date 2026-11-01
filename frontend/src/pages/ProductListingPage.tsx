import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useOutletContext } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Star,
  X,
  Search,
  Check,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ContextType {
  showToast: (msg: string) => void;
}

export const ProductListingPage: React.FC = () => {
  const { showToast } = useOutletContext<ContextType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const isDeal = searchParams.get('deal') === 'true';
  const isTrending = searchParams.get('trending') === 'true';
  const isSpotlight = searchParams.get('spotlight') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [minDiscount, setMinDiscount] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Fetch Categories for sidebar
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on URL and Filter parameters
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 12,
        sort: sortBy
      };

      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;
      if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.rating = minRating;
      if (minDiscount) params.discount = minDiscount;
      if (isDeal) params.deal = 'true';
      if (isTrending) params.trending = 'true';
      if (isSpotlight) params.spotlight = 'true';

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalProducts(res.data.total);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
        if (res.data.brands) {
          setAvailableBrands(res.data.brands);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [currentCategory, currentSearch, selectedBrands, minRating, minDiscount, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMinDiscount('');
    setSortBy('popularity');
    setSearchParams({});
  };

  const getPageTitle = () => {
    if (currentSearch) return `Search results for "${currentSearch}"`;
    if (currentCategory) {
      const cat = categories.find(c => c.slug === currentCategory);
      return cat ? cat.name : currentCategory.replace(/-/g, ' ');
    }
    if (isDeal) return 'Deals of the Day';
    if (isTrending) return 'Trending Products';
    if (isSpotlight) return 'In The Spotlight';
    return 'All Products';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Link to="/" className="hover:text-[#2874f0]">Home</Link>
            <span>›</span>
            <span className="font-semibold text-gray-700 capitalize">{getPageTitle()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
            {getPageTitle()}
            <span className="text-sm font-normal text-gray-500 ml-2">({totalProducts} products)</span>
          </h1>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700"
          >
            <Filter className="w-3.5 h-3.5 text-[#2874f0]" />
            <span>Filters ({selectedBrands.length + (minRating ? 1 : 0) + (minDiscount ? 1 : 0)})</span>
          </button>
        </div>

        {/* Sorting Dropdown & Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </span>
          {[
            { id: 'popularity', label: 'Popularity' },
            { id: 'price_asc', label: 'Price: Low to High' },
            { id: 'price_desc', label: 'Price: High to Low' },
            { id: 'rating', label: 'Customer Rating' },
            { id: 'newest', label: 'Newest First' }
          ].map(sortOpt => (
            <button
              key={sortOpt.id}
              onClick={() => setSortBy(sortOpt.id)}
              className={`text-xs px-3 py-1.5 rounded transition ${
                sortBy === sortOpt.id
                  ? 'bg-[#2874f0] text-white font-bold shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium'
              }`}
            >
              {sortOpt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: Left Sidebar + Right Products Grid */}
      <div className="flex gap-5 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 hidden sm:block flex-shrink-0 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
            <h2 className="font-bold text-sm uppercase text-gray-900 tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#2874f0]" />
              <span>Filters</span>
            </h2>
            {(selectedBrands.length > 0 || minPrice || maxPrice || minRating || minDiscount || currentCategory) && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#2874f0] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Categories</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              <div
                onClick={() => setSearchParams({})}
                className={`py-1 px-2 rounded cursor-pointer transition ${
                  !currentCategory ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`py-1 px-2 rounded cursor-pointer transition flex items-center justify-between ${
                    currentCategory === cat.slug ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {currentCategory === cat.slug && <Check className="w-3.5 h-3.5 text-[#2874f0]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Brands</h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-gray-300 text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Price (₹)</h3>
            <form onSubmit={handlePriceApply} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-2 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0]"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-2 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-[#2874f0] hover:bg-[#1259c3] text-white text-xs font-semibold rounded transition"
              >
                Apply Range
              </button>
            </form>
          </div>

          {/* Customer Rating Filter */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Customer Rating</h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map(star => (
                <label key={star} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === String(star)}
                    onChange={() => setMinRating(String(star))}
                    className="text-[#2874f0] focus:ring-[#2874f0]"
                  />
                  <div className="flex items-center gap-1">
                    <span>{star}★ & above</span>
                  </div>
                </label>
              ))}
              {minRating && (
                <button
                  type="button"
                  onClick={() => setMinRating('')}
                  className="text-[11px] text-gray-400 hover:text-gray-600 block mt-1"
                >
                  Reset rating filter
                </button>
              )}
            </div>
          </div>

          {/* Discount Filter */}
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Discount</h3>
            <div className="space-y-1.5">
              {[50, 30, 10].map(disc => (
                <label key={disc} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="minDiscount"
                    checked={minDiscount === String(disc)}
                    onChange={() => setMinDiscount(String(disc))}
                    className="text-[#2874f0] focus:ring-[#2874f0]"
                  />
                  <span>{disc}% or more</span>
                </label>
              ))}
              {minDiscount && (
                <button
                  type="button"
                  onClick={() => setMinDiscount('')}
                  className="text-[11px] text-gray-400 hover:text-gray-600 block mt-1"
                >
                  Reset discount filter
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse h-80 flex flex-col justify-between">
                  <div className="w-full h-44 bg-gray-200 rounded"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874f0] mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No products found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-5">
                We couldn't find any matches for your selected filters or search terms. Try clearing filters or searching for another term.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 bg-[#2874f0] text-white text-xs font-bold rounded shadow hover:bg-[#1259c3] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onToast={showToast} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => fetchProducts(currentPage - 1)}
                    className="px-3.5 py-1.5 border border-gray-300 rounded bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchProducts(pageNum)}
                        className={`w-8 h-8 rounded text-xs font-bold transition ${
                          pageNum === currentPage
                            ? 'bg-[#2874f0] text-white shadow'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchProducts(currentPage + 1)}
                    className="px-3.5 py-1.5 border border-gray-300 rounded bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-80 max-w-full h-full bg-white p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <h3 className="font-bold text-sm uppercase text-gray-800">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-700 mb-2">Category</h4>
                <select
                  value={currentCategory}
                  onChange={(e) => setSearchParams(e.target.value ? { category: e.target.value } : {})}
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-700 mb-2">Brands</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => handleBrandToggle(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2 bg-[#2874f0] text-white rounded text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

