import db, { saveStoreToFile } from '../config/db.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_session';

    const store = db.getStore();
    const cartItems = (store.cart_items || []).filter(item => {
      if (userId) return item.user_id === userId;
      return item.session_id === sessionId;
    });

    let itemsWithDetails = [];
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;

    for (const item of cartItems) {
      const product = store.products.find(p => p.id === item.product_id);
      if (product) {
        const itemOriginal = product.original_price * item.quantity;
        const itemDiscounted = product.discounted_price * item.quantity;

        totalOriginalPrice += itemOriginal;
        totalDiscountedPrice += itemDiscounted;

        itemsWithDetails.push({
          id: item.id,
          product_id: product.id,
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          original_price: product.original_price,
          discounted_price: product.discounted_price,
          discount_percent: product.discount_percent,
          stock: product.stock,
          quantity: item.quantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size,
          item_total: itemDiscounted
        });
      }
    }

    const totalSavings = totalOriginalPrice - totalDiscountedPrice;
    const deliveryCharge = totalDiscountedPrice > 500 || totalDiscountedPrice === 0 ? 0 : 40;
    const packagingFee = totalDiscountedPrice > 0 ? 29 : 0;
    const finalAmount = totalDiscountedPrice + deliveryCharge + packagingFee;

    return res.status(200).json({
      success: true,
      items: itemsWithDetails,
      itemCount: itemsWithDetails.reduce((sum, i) => sum + i.quantity, 0),
      summary: {
        totalOriginalPrice,
        totalDiscountedPrice,
        totalSavings,
        deliveryCharge,
        packagingFee,
        finalAmount
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_session';
    const { product_id, quantity = 1, selected_color, selected_size } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const store = db.getStore();
    const product = store.products.find(p => p.id === parseInt(product_id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!store.cart_items) store.cart_items = [];

    // Find if already in cart
    const existingIndex = store.cart_items.findIndex(item => {
      const matchOwner = userId ? item.user_id === userId : item.session_id === sessionId;
      const matchProduct = item.product_id === parseInt(product_id);
      const matchColor = (!selected_color && !item.selected_color) || item.selected_color === selected_color;
      const matchSize = (!selected_size && !item.selected_size) || item.selected_size === selected_size;
      return matchOwner && matchProduct && matchColor && matchSize;
    });

    if (existingIndex > -1) {
      store.cart_items[existingIndex].quantity = Math.min(
        store.cart_items[existingIndex].quantity + parseInt(quantity),
        product.stock
      );
    } else {
      const newId = store.cart_items.length > 0 ? Math.max(...store.cart_items.map(i => i.id)) + 1 : 1;
      store.cart_items.push({
        id: newId,
        user_id: userId,
        session_id: sessionId,
        product_id: parseInt(product_id),
        quantity: Math.min(parseInt(quantity), product.stock),
        selected_color: selected_color || (product.colors ? product.colors[0] : null),
        selected_size: selected_size || (product.sizes ? product.sizes[0] : null),
        created_at: new Date().toISOString()
      });
    }

    saveStoreToFile();
    return res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_session';
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;

    const store = db.getStore();
    const item = (store.cart_items || []).find(i => {
      const matchOwner = userId ? i.user_id === userId : i.session_id === sessionId;
      return i.id === itemId && matchOwner;
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const product = store.products.find(p => p.id === item.product_id);
    const newQty = parseInt(quantity);

    if (newQty <= 0) {
      store.cart_items = store.cart_items.filter(i => i.id !== itemId);
    } else {
      item.quantity = Math.min(newQty, product ? product.stock : 10);
    }

    saveStoreToFile();
    return res.status(200).json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_session';
    const itemId = parseInt(req.params.id);

    const store = db.getStore();
    store.cart_items = (store.cart_items || []).filter(i => {
      const matchOwner = userId ? i.user_id === userId : i.session_id === sessionId;
      return !(i.id === itemId && matchOwner);
    });

    saveStoreToFile();
    return res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove cart item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_session';

    const store = db.getStore();
    store.cart_items = (store.cart_items || []).filter(i => {
      return userId ? i.user_id !== userId : i.session_id !== sessionId;
    });

    saveStoreToFile();
    return res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

