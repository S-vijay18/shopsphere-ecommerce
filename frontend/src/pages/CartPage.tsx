import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Trash2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ContextType {
  showToast: (msg: string) => void;
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<ContextType>();
  const { items, itemCount, summary, updateQuantity, removeFromCart, isLoading } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleProceedToCheckout = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your cart is empty!</h2>
          <p className="text-xs text-gray-500 mb-6">Explore our popular picks and hot deals to add items.</p>
          <Link
            to="/products"
            className="py-2.5 px-6 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs uppercase tracking-wider rounded shadow transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      
      {/* Page Title */}
      <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>Shopping Cart</span>
        <span className="text-sm font-normal text-gray-500">({itemCount} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                
                {/* Image & Controls on Mobile */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:w-28 flex-shrink-0">
                  <Link to={`/product/${item.slug}`} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 p-1 bg-white border border-gray-100 rounded">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </Link>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeFromCart(item.id);
                          showToast(`Removed "${item.name.slice(0, 20)}..."`);
                        }
                      }}
                      className="w-7 h-7 bg-gray-50 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
                      title={item.quantity === 1 ? 'Remove' : 'Decrease'}
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 bg-gray-50 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition disabled:opacity-40"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-sm font-semibold text-gray-800 hover:text-[#2874f0] line-clamp-2 transition leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          showToast(`Removed from cart`);
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Brand: <strong>{item.brand}</strong></span>
                      {item.selected_color && <span>• Color: <strong>{item.selected_color}</strong></span>}
                      {item.selected_size && <span>• Size: <strong>{item.selected_size}</strong></span>}
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ₹{(item.discounted_price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.original_price > item.discounted_price && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(item.original_price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-[#388e3c]">
                            {item.discount_percent}% Off
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold pt-3 mt-3 border-t border-gray-100">
                    <span className="text-emerald-700 font-medium">In Stock • Delivery in 2-3 Days</span>
                  </div>
                </div>

              </div>
            ))}

            {/* Place Order Row */}
            <div className="p-4 bg-gray-50 flex justify-end">
              <button
                onClick={handleProceedToCheckout}
                className="py-3 px-8 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-sm uppercase rounded shadow transition flex items-center gap-2"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Safe & Secure Guarantee */}
          <div className="flex items-center gap-3 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
            <ShieldCheck className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>

        </div>

        {/* Right Column: Price Details Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3">
              Price Details
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>₹{summary.totalOriginalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[#388e3c]">
                <span>Discount</span>
                <span>- ₹{summary.totalSavings.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {summary.deliveryCharge === 0 ? (
                    <span className="text-[#388e3c] font-semibold">FREE</span>
                  ) : (
                    `₹${summary.deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Secured Packaging Fee</span>
                <span>₹{summary.packagingFee}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between font-bold text-base text-gray-900">
              <span>Total Amount</span>
              <span className="text-lg text-gray-900">₹{summary.finalAmount.toLocaleString('en-IN')}</span>
            </div>

            {summary.totalSavings > 0 && (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs font-bold text-[#388e3c] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You will save ₹{summary.totalSavings.toLocaleString('en-IN')} on this order</span>
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-sm uppercase rounded shadow transition text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

