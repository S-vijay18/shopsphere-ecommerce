import express from 'express';
import { register, login, getProfile, updateProfile, getAddresses, addAddress, deleteAddress } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);

export default router;

