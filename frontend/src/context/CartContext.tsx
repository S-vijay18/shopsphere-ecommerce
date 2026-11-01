import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { CartItem, CartSummary } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  summary: CartSummary;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number, color?: string, size?: string) => Promise<boolean>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const defaultSummary: CartSummary = {
  totalOriginalPrice: 0,
  totalDiscountedPrice: 0,
  totalSavings: 0,
  deliveryCharge: 0,
  packagingFee: 0,
  finalAmount: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [summary, setSummary] = useState<CartSummary>(defaultSummary);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setItems(res.data.items || []);
        setItemCount(res.data.itemCount || 0);
        setSummary(res.data.summary || defaultSummary);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: number, quantity = 1, color?: string, size?: string): Promise<boolean> => {
    try {
      const res = await api.post('/cart/add', {
        product_id: productId,
        quantity,
        selected_color: color,
        selected_size: size
      });
      if (res.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      if (res.data.success) {
        setItems([]);
        setItemCount(0);
        setSummary(defaultSummary);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        summary,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

