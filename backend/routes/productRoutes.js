import express from 'express';
import { getProducts, getProductBySlugOrId, getHomepageSections, checkPincode } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/sections/homepage', getHomepageSections);
router.get('/pincode/:pincode', checkPincode);
router.get('/:identifier', getProductBySlugOrId);

export default router;

