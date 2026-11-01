import db, { saveStoreToFile } from '../config/db.js';

export const getProductReviews = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const store = db.getStore();
    const reviews = (store.reviews || []).filter(r => r.product_id === productId);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });

    const total = reviews.length;
    const avgRating = total > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : '0.0';

    return res.status(200).json({
      success: true,
      reviews,
      stats: {
        total,
        avgRating,
        counts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
  }
};

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const { product_id, rating, title, comment } = req.body;

    if (!product_id || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating and comment are required' });
    }

    const store = db.getStore();
    const product = store.products.find(p => p.id === parseInt(product_id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!store.reviews) store.reviews = [];
    const newId = store.reviews.length > 0 ? Math.max(...store.reviews.map(r => r.id)) + 1 : 1;
    const newReview = {
      id: newId,
      product_id: parseInt(product_id),
      user_id: userId,
      user_name: userName,
      rating: parseInt(rating),
      title: title || '',
      comment,
      verified_purchase: 1,
      helpful_count: 0,
      created_at: new Date().toISOString()
    };

    store.reviews.unshift(newReview);

    // Update product rating and reviews count
    const prodReviews = store.reviews.filter(r => r.product_id === parseInt(product_id));
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    product.rating = parseFloat(avg.toFixed(1));
    product.reviews_count = prodReviews.length;
    product.rating_count = (product.rating_count || 100) + 1;

    saveStoreToFile();
    return res.status(201).json({ success: true, message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

