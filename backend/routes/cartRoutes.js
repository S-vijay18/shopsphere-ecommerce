import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';

// Optional auth token extractor middleware
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopsphere_super_secure_jwt_secret_key_2026_flipkart_style');
      const store = db.getStore();
      const user = store.users.find(u => u.id === decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Guest fallback
    }
  }
  next();
};

const router = express.Router();

router.use(optionalAuth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;

