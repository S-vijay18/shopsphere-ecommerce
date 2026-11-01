import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Truck,
  Tag,
  Share2,
  Check,
  AlertCircle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCarousel } from '../components/ProductCarousel';

interface ContextType {
  showToast: (msg: string) => void;
}

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<ContextType>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openAuthModal, selectedPincode, setSelectedPincode } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Pincode check
  const [pincodeInput, setPincodeInput] = useState<string>(selectedPincode || '560034');
  const [pincodeStatus, setPincodeStatus] = useState<{ deliverable: boolean; message: string } | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelated(res.data.related || []);
          setActiveImageIndex(0);
          if (prod.colors && prod.colors.length > 0) setSelectedColor(prod.colors[0]);
          if (prod.sizes && prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Check default pincode
  useEffect(() => {
    if (selectedPincode && selectedPincode.length === 6) {
      checkDelivery(selectedPincode);
    }
  }, [selectedPincode]);

  const checkDelivery = async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) return;
    setPincodeLoading(true);
    try {
      const res = await api.get(`/products/pincode/${pin}`);
      if (res.data.success) {
        setPincodeStatus({ deliverable: true, message: res.data.message });
        setSelectedPincode(pin);
      } else {
        setPincodeStatus({ deliverable: false, message: res.data.message });
      }
    } catch {
      setPincodeStatus({ deliverable: false, message: 'Delivery information unavailable' });
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const ok = await addToCart(product.id, quantity, selectedColor, selectedSize);
    if (ok) {
      showToast(`Added ${quantity} item(s) to Cart!`);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    // Add to cart and navigate straight to checkout
    await addToCart(product.id, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews/product', {
        product_id: product?.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });
      if (res.data.success) {
        showToast('Thank you! Review submitted successfully.');
        setShowReviewForm(false);
        setReviewComment('');
        setReviewTitle('');
        // Reload reviews
        const updated = await api.get(`/products/${slug}`);
        if (updated.data.success) {
          setProduct(updated.data.product);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-gray-500">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">The item you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded">
          Browse All Products
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  ];
  const activeImage = images[activeImageIndex] || images[0];
  const isFav = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
        <Link to="/" className="hover:text-[#2874f0]">Home</Link>
        <span>›</span>
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-[#2874f0] capitalize">
          {product.category_name}
        </Link>
        <span>›</span>
        <span className="text-gray-400">{product.brand}</span>
        <span>›</span>
        <span className="font-semibold text-gray-800 line-clamp-1 max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery & Buy Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              
              {/* Thumbnails Vertical Column */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-96">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      onMouseEnter={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-16 sm:h-16 rounded border-2 overflow-hidden flex-shrink-0 transition p-1 bg-white ${
                        idx === activeImageIndex ? 'border-[#2874f0] shadow-sm' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Large Main Preview Image */}
              <div className="relative flex-1 h-80 sm:h-96 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-4 bg-white group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Wishlist Floating Button */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(isFav ? 'Removed from Wishlist' : 'Saved to Wishlist!');
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                    isFav ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Flipkart-Style Action Buttons: Yellow Add to Cart & Orange Buy Now */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 bg-[#ff9f00] hover:bg-[#f59700] text-gray-900 font-bold text-sm sm:text-base rounded-sm shadow transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-sm sm:text-base rounded-sm shadow transition flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Right Column: Product Information & Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Brand and Model */}
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {product.brand} {product.model_number && `• ${product.model_number}`}
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>

              {/* Ratings and Assured Badge */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {product.rating_count ? product.rating_count.toLocaleString('en-IN') : 100} Ratings &{' '}
                  {product.reviews_count ? product.reviews_count.toLocaleString('en-IN') : 40} Reviews
                </span>
                {product.is_assured && (
                  <span className="text-xs font-extrabold text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded italic">
                    ✦ Assured
                  </span>
                )}
              </div>

              {/* Pricing Section */}
              <div className="mb-4 p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                <span className="text-xs font-semibold text-[#388e3c] block mb-0.5">Special Price</span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    ₹{product.discounted_price.toLocaleString('en-IN')}
                  </span>
                  {product.original_price > product.discounted_price && (
                    <>
                      <span className="text-sm sm:text-base text-gray-400 line-through">
                        ₹{product.original_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#388e3c]">
                        {product.discount_percent}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Available Bank Offers (Flipkart Style) */}
              <div className="mb-5 space-y-1.5 text-xs text-gray-700">
                <h4 className="font-bold text-gray-800 text-xs mb-2">Available offers</h4>
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Bank Offer:</strong> 5% Cashback on ShopSphere Axis Bank Credit Card</span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Special Offer:</strong> Get extra 10% off (price inclusive of cashback/coupon)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Partner Offer:</strong> Sign-up for ShopSphere Pay Later & get ₹500 Gift Card</span>
                </div>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="mb-5 p-3.5 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2874f0]" />
                    <span>Delivery Availability</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN code"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] font-medium"
                  />
                  <button
                    type="button"
                    disabled={pincodeLoading || pincodeInput.length !== 6}
                    onClick={() => checkDelivery(pincodeInput)}
                    className="px-3.5 py-1.5 bg-[#2874f0] text-white rounded text-xs font-semibold hover:bg-[#1259c3] disabled:opacity-50 transition"
                  >
                    {pincodeLoading ? 'Checking...' : 'Check'}
                  </button>
                </div>

                {pincodeStatus && (
                  <div className={`mt-2 text-xs flex items-center gap-1.5 ${
                    pincodeStatus.deliverable ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {pincodeStatus.deliverable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{pincodeStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Variant Selectors: Colors, Sizes, Quantity */}
              <div className="space-y-4 mb-6">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-1.5">Color: {selectedColor}</span>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded text-xs font-medium border transition ${
                            selectedColor === color
                              ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold shadow-xs'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-1.5">Size / Variant: {selectedSize}</span>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded text-xs font-medium border transition ${
                            selectedSize === sz
                              ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold shadow-xs'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <span className="text-xs font-bold text-gray-700 block mb-1.5">Quantity:</span>
                  <div className="inline-flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  {product.stock <= 5 && (
                    <span className="text-[11px] text-rose-600 font-semibold ml-3">
                      Hurry, only {product.stock} left in stock!
                    </span>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                    {Object.entries(product.specifications).map(([key, val], index) => (
                      <div
                        key={key}
                        className={`flex py-2.5 px-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <span className="w-1/3 text-gray-500 font-medium">{key}</span>
                        <span className="w-2/3 text-gray-800 font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Ratings and Reviews Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ratings & Customer Reviews</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-sm font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-gray-500">
                {product.rating_count ? product.rating_count.toLocaleString('en-IN') : 100} Ratings &{' '}
                {product.reviews ? product.reviews.length : 0} Verified Reviews
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded shadow hover:bg-[#1259c3] transition w-max flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Rate & Review Product</span>
          </button>
        </div>

        {/* Write a Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200 space-y-3 animate-fade-in">
            <h4 className="font-bold text-xs uppercase text-gray-800 tracking-wider">Leave Your Review</h4>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setReviewRating(st)}
                    className={`p-1.5 rounded transition ${st <= reviewRating ? 'text-amber-500' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Review Headline</label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Excellent build quality, totally worth the price!"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Detailed Feedback</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your personal experience with this product..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded shadow hover:bg-[#1259c3] disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="mt-6 divide-y divide-gray-100">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map(rev => (
              <div key={rev.id} className="py-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.2 rounded">
                    <span>{rev.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">{rev.title}</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="font-semibold text-gray-600">{rev.user_name}</span>
                  {rev.verified_purchase && (
                    <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
                      <Check className="w-3 h-3" /> Certified Buyer
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(rev.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 py-4">No reviews yet for this product. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <ProductCarousel
          title="Similar Products You May Like"
          subtitle="Based on this category"
          products={related}
          onToast={showToast}
        />
      )}

    </div>
  );
};

