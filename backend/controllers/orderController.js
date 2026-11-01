import db, { saveStoreToFile } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_id, payment_method = 'cod', items, directBuyProduct } = req.body;

    const store = db.getStore();

    // Verify Address
    const address = (store.addresses || []).find(a => a.id === parseInt(address_id) && a.user_id === userId);
    if (!address) {
      return res.status(400).json({ success: false, message: 'Please select a valid delivery address' });
    }

    let orderItems = [];
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;

    if (directBuyProduct) {
      // Direct Buy Now flow
      const prod = store.products.find(p => p.id === parseInt(directBuyProduct.product_id));
      if (!prod) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const qty = parseInt(directBuyProduct.quantity) || 1;
      orderItems.push({
        id: 1,
        product_id: prod.id,
        product_name: prod.name,
        product_image: prod.images && prod.images.length > 0 ? prod.images[0] : '',
        quantity: qty,
        unit_price: prod.discounted_price,
        total_price: prod.discounted_price * qty,
        selected_color: directBuyProduct.selected_color || (prod.colors ? prod.colors[0] : null),
        selected_size: directBuyProduct.selected_size || (prod.sizes ? prod.sizes[0] : null)
      });
      totalOriginalPrice = prod.original_price * qty;
      totalDiscountedPrice = prod.discounted_price * qty;
    } else {
      // Cart items flow
      const cartItems = (store.cart_items || []).filter(item => item.user_id === userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Your cart is empty' });
      }

      orderItems = cartItems.map((item, idx) => {
        const prod = store.products.find(p => p.id === item.product_id);
        const unit = prod ? prod.discounted_price : 0;
        const orig = prod ? prod.original_price : 0;
        totalOriginalPrice += orig * item.quantity;
        totalDiscountedPrice += unit * item.quantity;

        // Decrement stock
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }

        return {
          id: idx + 1,
          product_id: item.product_id,
          product_name: prod ? prod.name : 'Product',
          product_image: prod && prod.images && prod.images.length > 0 ? prod.images[0] : '',
          quantity: item.quantity,
          unit_price: unit,
          total_price: unit * item.quantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size
        };
      });

      // Clear user cart
      store.cart_items = store.cart_items.filter(item => item.user_id !== userId);
    }

    const discountAmount = totalOriginalPrice - totalDiscountedPrice;
    const deliveryCharge = totalDiscountedPrice > 500 ? 0 : 40;
    const finalAmount = totalDiscountedPrice + deliveryCharge;

    const uniqueRandom = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-2026-${uniqueRandom}`;
    const trackingNumber = `FMPC2026${uniqueRandom}IN`;

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estimatedDelivery = estDate.toISOString().split('T')[0];

    const newOrder = {
      id: orderId,
      user_id: userId,
      user_name: req.user.name,
      user_email: req.user.email,
      address_id: address.id,
      address: {
        full_name: address.full_name,
        phone: address.phone,
        address_line: address.address_line,
        locality: address.locality,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        address_type: address.address_type
      },
      total_amount: totalOriginalPrice,
      discount_amount: discountAmount,
      delivery_charge: deliveryCharge,
      final_amount: finalAmount,
      payment_method: payment_method,
      payment_status: payment_method === 'cod' ? 'pending' : 'completed',
      order_status: 'Order Confirmed',
      tracking_number: trackingNumber,
      estimated_delivery: estimatedDelivery,
      created_at: new Date().toISOString(),
      items: orderItems,
      tracking_history: [
        { status: 'Order Confirmed', timestamp: new Date().toISOString(), message: 'Your order has been placed and verified.' },
        { status: 'Processing', timestamp: null, message: 'Seller is preparing your package.' },
        { status: 'Shipped', timestamp: null, message: 'Package handed over to courier hub.' },
        { status: 'Out for Delivery', timestamp: null, message: 'Delivery partner is en route to your address.' },
        { status: 'Delivered', timestamp: null, message: 'Order delivered successfully.' }
      ]
    };

    if (!store.orders) store.orders = [];
    store.orders.unshift(newOrder);
    saveStoreToFile();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const store = db.getStore();
    const userOrders = (store.orders || []).filter(o => o.user_id === userId);
    return res.status(200).json({ success: true, orders: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const store = db.getStore();
    const order = (store.orders || []).find(o => o.id === orderId && (o.user_id === userId || req.user.role === 'admin'));

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order details' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const store = db.getStore();
    const order = (store.orders || []).find(o => o.id === orderId && o.user_id === userId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.order_status === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled' });
    }

    order.order_status = 'Cancelled';
    saveStoreToFile();

    return res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

