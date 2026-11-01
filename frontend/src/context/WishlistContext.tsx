import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  wishlistIds: number[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopsphere_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

