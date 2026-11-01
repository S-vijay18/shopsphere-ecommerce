import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onToast?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onToast }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isInWishlist(product.id);
  const image = product.primary_image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);
    if (success) {
      setJustAdded(true);
      if (onToast) onToast(`Added "${product.name.slice(0, 25)}..." to cart`);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (onToast) {
      onToast(isFav ? `Removed from Wishlist` : `Saved to Wishlist!`);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5">
      
      {/* Top Bar: Badge & Wishlist Heart */}
      <div className="flex items-center justify-between z-10 mb-2">
        {product.badge ? (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            {product.badge}
          </span>
        ) : (
          <span></span>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`p-1.5 rounded-full transition ${
            isFav
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-300 hover:text-red-500 hover:bg-gray-100'
          }`}
          title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} className="block relative w-full h-44 sm:h-48 overflow-hidden mb-3">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 justify-between pt-1">
        <div>
          {/* Brand & Assured */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</span>
            {product.is_assured && (
              <span className="text-[10px] font-bold text-[#2874f0] bg-blue-50 px-1.5 py-0.2 rounded italic flex items-center gap-0.5">
                ✦ Assured
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-gray-800 hover:text-[#2874f0] line-clamp-2 leading-snug mb-2 transition"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-gray-400">
              ({product.rating_count ? product.rating_count.toLocaleString('en-IN') : '100+'})
            </span>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                ₹{product.discounted_price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.discounted_price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount_percent > 0 && (
              <span className="text-[11px] font-semibold text-[#388e3c] block">
                {product.discount_percent}% off
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#ff9f00] hover:bg-[#f59700] text-gray-900 hover:text-black'
            }`}
            title="Add to Cart"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

