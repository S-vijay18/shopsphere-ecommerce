import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer for product image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Admin authorization on all admin routes
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAdminCustomers);

export default router;

