import db, { saveStoreToFile } from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    const store = db.getStore();

    const totalProducts = (store.products || []).length;
    const totalOrders = (store.orders || []).length;
    const totalCustomers = (store.users || []).filter(u => u.role === 'customer').length;

    const totalRevenue = (store.orders || []).reduce((sum, o) => {
      if (o.order_status !== 'Cancelled') {
        return sum + (parseFloat(o.final_amount) || 0);
      }
      return sum;
    }, 0);

    const pendingOrders = (store.orders || []).filter(o => o.order_status === 'Order Confirmed' || o.order_status === 'Processing').length;
    const deliveredOrders = (store.orders || []).filter(o => o.order_status === 'Delivered').length;

    // Recent orders
    const recentOrders = (store.orders || []).slice(0, 8);

    // Category breakdown
    const categoryStats = (store.categories || []).map(c => {
      const prods = (store.products || []).filter(p => p.category_id === c.id);
      return {
        id: c.id,
        name: c.name,
        count: prods.length
      };
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders,
        deliveredOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        recentOrders,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category_id,
      brand,
      model_number,
      description,
      original_price,
      discounted_price,
      stock,
      badge,
      colors,
      sizes,
      specifications,
      images,
      is_featured,
      is_deal_of_the_day,
      is_trending,
      is_spotlight,
      is_popular_pick,
      popular_pick_title
    } = req.body;

    if (!name || !category_id || !original_price || !discounted_price) {
      return res.status(400).json({ success: false, message: 'Please provide all required product details' });
    }

    const store = db.getStore();
    const newId = store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${newId}`;

    const orig = parseFloat(original_price);
    const disc = parseFloat(discounted_price);
    const discount_percent = Math.round(((orig - disc) / orig) * 100);

    const productImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80'
    ];

    const newProduct = {
      id: newId,
      category_id: parseInt(category_id),
      name: name.trim(),
      slug,
      brand: brand || 'Generic',
      model_number: model_number || '',
      description: description || '',
      original_price: orig,
      discounted_price: disc,
      discount_percent,
      stock: parseInt(stock) || 50,
      rating: 4.5,
      rating_count: 1,
      reviews_count: 0,
      is_assured: 1,
      is_featured: is_featured ? 1 : 0,
      is_deal_of_the_day: is_deal_of_the_day ? 1 : 0,
      is_trending: is_trending ? 1 : 0,
      is_spotlight: is_spotlight ? 1 : 0,
      is_popular_pick: is_popular_pick ? 1 : 0,
      popular_pick_title: popular_pick_title || null,
      badge: badge || 'Top Deal',
      colors: Array.isArray(colors) ? colors : (colors ? [colors] : ['Default']),
      sizes: Array.isArray(sizes) ? sizes : (sizes ? [sizes] : ['Standard']),
      specifications: specifications || {},
      images: productImages,
      created_at: new Date().toISOString()
    };

    store.products.unshift(newProduct);
    saveStoreToFile();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const store = db.getStore();
    const product = store.products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = req.body;
    if (updates.original_price && updates.discounted_price) {
      const orig = parseFloat(updates.original_price);
      const disc = parseFloat(updates.discounted_price);
      updates.discount_percent = Math.round(((orig - disc) / orig) * 100);
    }

    Object.assign(product, updates, { updated_at: new Date().toISOString() });
    saveStoreToFile();

    return res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const store = db.getStore();
    const index = store.products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    store.products.splice(index, 1);
    saveStoreToFile();

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const store = db.getStore();
    const orders = store.orders || [];
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const store = db.getStore();
    const order = (store.orders || []).find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.order_status = status;
    order.updated_at = new Date().toISOString();

    // Update tracking history timestamp
    if (order.tracking_history) {
      const step = order.tracking_history.find(h => h.status === status);
      if (step) {
        step.timestamp = new Date().toISOString();
      }
    }

    saveStoreToFile();
    return res.status(200).json({ success: true, message: `Order status updated to "${status}"`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

export const getAdminCustomers = async (req, res) => {
  try {
    const store = db.getStore();
    const customers = (store.users || [])
      .filter(u => u.role === 'customer')
      .map(u => {
        const userOrders = (store.orders || []).filter(o => o.user_id === u.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + (parseFloat(o.final_amount) || 0), 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          avatar_url: u.avatar_url,
          orderCount: userOrders.length,
          totalSpent: Math.round(totalSpent),
          created_at: u.created_at
        };
      });

    return res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers' });
  }
};

