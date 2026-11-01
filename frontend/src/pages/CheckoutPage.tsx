import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, itemCount, summary, clearCart } = useCart();
  const { user, addresses, addAddress, fetchAddresses } = useAuth();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // New Address Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPincode, setNewPincode] = useState('560034');
  const [newLocality, setNewLocality] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newType, setNewType] = useState<'Home' | 'Work'>('Home');

  // Multi-step accordion active step
  // 1: Delivery Address, 2: Order Summary, 3: Payment
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (!user) {
      navigate('/cart');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find(a => a.is_default);
      setSelectedAddressId(def ? def.id : addresses[0].id);
    }
  }, [user, items, addresses]);

  const handleCreateNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newPincode || !newAddressLine) {
      setErrorMessage('Please fill in required address fields');
      return;
    }

    const ok = await addAddress({
      full_name: newFullName,
      phone: newPhone,
      pincode: newPincode,
      locality: newLocality || 'Downtown',
      address_line: newAddressLine,
      city: newCity,
      state: newState,
      address_type: newType,
      is_default: 1
    });

    if (ok) {
      setShowNewAddressForm(false);
      await fetchAddresses();
      // Select the newly added address
      if (addresses.length > 0) {
        setSelectedAddressId(addresses[addresses.length - 1].id);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setErrorMessage('Please select or add a delivery address');
      setActiveStep(1);
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      setErrorMessage('Please enter your UPI ID (e.g. name@okhdfcbank)');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setErrorMessage('Please fill all card payment details');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.post('/orders', {
        address_id: selectedAddressId,
        payment_method: paymentMethod
      });

      if (res.data.success) {
        const order = res.data.order;
        clearCart();
        navigate(`/order-success/${order.id}`);
      } else {
        setErrorMessage(res.data.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.response?.data?.message || 'Error occurred while processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      
      {/* Page Title */}
      <h1 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>Secure Checkout</span>
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
      </h1>

      {errorMessage && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Accordion Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setActiveStep(1)}
              className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Delivery Address</h3>
                  {activeStep !== 1 && selectedAddress && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {selectedAddress.full_name}, {selectedAddress.address_line}, {selectedAddress.city} - {selectedAddress.pincode}
                    </p>
                  )}
                </div>
              </div>
              {activeStep !== 1 && (
                <button className="text-xs font-bold text-[#2874f0] uppercase hover:underline">
                  Change
                </button>
              )}
            </div>

            {activeStep === 1 && (
              <div className="p-4 sm:p-5 space-y-4">
                {/* Saved Addresses List */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                        selectedAddressId === addr.id
                          ? 'border-[#2874f0] bg-blue-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-[#2874f0] focus:ring-[#2874f0]"
                      />
                      <div className="flex-1 text-xs text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-900">{addr.full_name}</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 font-semibold text-[10px] rounded uppercase">
                            {addr.address_type}
                          </span>
                          <span className="font-bold text-gray-900">{addr.phone}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {addr.address_line}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Toggle & Form */}
                {!showNewAddressForm ? (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 text-xs font-bold text-[#2874f0] hover:underline pt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add a new delivery address</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateNewAddress} className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs uppercase text-gray-800">Add New Address</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">10-Digit Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="+91 91234 56789"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Locality</label>
                        <input
                          type="text"
                          required
                          value={newLocality}
                          onChange={(e) => setNewLocality(e.target.value)}
                          placeholder="e.g. Koramangala 4th Block"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">City / Town</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Address (House No, Building, Street, Area)</label>
                      <textarea
                        required
                        rows={2}
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        placeholder="Flat 402, Sunshine Residency, 80 Feet Road"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded shadow hover:bg-[#1259c3]"
                      >
                        Save & Use Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Continue to Step 2 */}
                <div className="pt-2 flex justify-end">
                  <button
                    disabled={!selectedAddressId}
                    onClick={() => setActiveStep(2)}
                    className="py-2.5 px-6 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-xs uppercase rounded shadow transition disabled:opacity-50"
                  >
                    Deliver Here & Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setActiveStep(2)}
              className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Order Summary</h3>
                  <p className="text-xs text-gray-500">{itemCount} items</p>
                </div>
              </div>
              {activeStep !== 2 && (
                <button className="text-xs font-bold text-[#2874f0] uppercase hover:underline">
                  View Items
                </button>
              )}
            </div>

            {activeStep === 2 && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className="divide-y divide-gray-100">
                  {items.map(it => (
                    <div key={it.id} className="py-3 flex items-center gap-4">
                      <img src={it.image} alt={it.name} className="w-14 h-14 object-contain rounded p-1 border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{it.name}</h4>
                        <p className="text-[11px] text-gray-500">Qty: {it.quantity} {it.selected_color && `• ${it.selected_color}`}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">₹{(it.discounted_price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                  <span className="text-xs text-gray-500">Order confirmation will be sent to <strong>{user?.email}</strong></span>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="py-2.5 px-6 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-xs uppercase rounded shadow transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Payment Options */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setActiveStep(3)}
              className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Payment Options</h3>
              </div>
            </div>

            {activeStep === 3 && (
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* 1. Cash on Delivery */}
                <label className={`p-4 rounded-lg border cursor-pointer block transition ${
                  paymentMethod === 'cod' ? 'border-[#2874f0] bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-xs text-gray-800 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">Pay cash or UPI at your doorstep upon arrival</span>
                    </div>
                  </div>
                </label>

                {/* 2. UPI */}
                <label className={`p-4 rounded-lg border cursor-pointer block transition ${
                  paymentMethod === 'upi' ? 'border-[#2874f0] bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1">
                      <span className="font-bold text-xs text-gray-800 block">UPI (PhonePe, Google Pay, Paytm, BHIM)</span>
                      <span className="text-[11px] text-gray-500">Instant verification & zero transaction fees</span>
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-blue-200 max-w-sm">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Enter VPA / UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis / 9876543210@paytm"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
                      />
                    </div>
                  )}
                </label>

                {/* 3. Credit / Debit Card */}
                <label className={`p-4 rounded-lg border cursor-pointer block transition ${
                  paymentMethod === 'card' ? 'border-[#2874f0] bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <div className="flex-1">
                      <span className="font-bold text-xs text-gray-800 block">Credit / Debit / ATM Card</span>
                      <span className="text-[11px] text-gray-500">All major Indian cards supported (Visa, MasterCard, RuPay)</span>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-blue-200 max-w-md space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* 4. Net Banking */}
                <label className={`p-4 rounded-lg border cursor-pointer block transition ${
                  paymentMethod === 'netbanking' ? 'border-[#2874f0] bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <Landmark className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-gray-800 block">Net Banking</span>
                      <span className="text-[11px] text-gray-500">SBI, HDFC, ICICI, Axis & 50+ other Indian banks</span>
                    </div>
                  </div>
                </label>

                {/* Confirm & Place Order Button */}
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="py-3 px-10 bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold text-sm uppercase rounded shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Confirm & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Right Column: Price Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Items Total ({itemCount})</span>
                <span>₹{summary.totalOriginalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[#388e3c]">
                <span>Total Discount</span>
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
                <span>Secured Packaging</span>
                <span>₹{summary.packagingFee}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between font-bold text-base text-gray-900">
              <span>Final Payable</span>
              <span className="text-lg text-[#2874f0]">₹{summary.finalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs font-bold text-[#388e3c] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>You save ₹{summary.totalSavings.toLocaleString('en-IN')} on this order!</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

