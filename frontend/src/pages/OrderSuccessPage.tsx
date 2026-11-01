import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-gray-500 font-semibold">Retrieving your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <Link to="/" className="text-xs text-[#2874f0] font-bold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', desc: 'Placed & Verified', active: true },
    { label: 'Processing', desc: 'Packed by seller', active: order.order_status !== 'Order Confirmed' },
    { label: 'Shipped', desc: 'In courier transit', active: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.order_status) },
    { label: 'Out for Delivery', desc: 'Near your area', active: ['Out for Delivery', 'Delivered'].includes(order.order_status) },
    { label: 'Delivered', desc: 'Arrived at doorstep', active: order.order_status === 'Delivered' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Confirmation Header Banner */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Order Placed Successfully!</h1>
        <p className="text-xs text-gray-500 mb-4">
          Thank you for shopping with ShopSphere. A confirmation email has been sent to <strong>{order.user_email}</strong>.
        </p>
        <div className="inline-block bg-gray-50 border border-gray-200 px-4 py-2 rounded-md text-xs font-semibold text-gray-700">
          Order ID: <span className="font-bold text-[#2874f0] select-all">{order.id}</span>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tracking Status</h3>
            <p className="text-xs text-gray-500">Waybill: {order.tracking_number}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Estimated Delivery</span>
            <span className="text-sm font-bold text-[#388e3c]">
              {new Date(order.estimated_delivery).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative flex items-center justify-between">
          <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: order.order_status === 'Delivered'
                  ? '100%'
                  : order.order_status === 'Out for Delivery'
                  ? '75%'
                  : order.order_status === 'Shipped'
                  ? '50%'
                  : order.order_status === 'Processing'
                  ? '25%'
                  : '0%'
              }}
            ></div>
          </div>

          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                  st.active
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {st.active ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[11px] font-bold mt-2 ${st.active ? 'text-gray-900' : 'text-gray-400'}`}>
                {st.label}
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block">{st.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Delivery Address */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#2874f0]" />
            <span>Delivery Address</span>
          </h3>
          <p className="text-sm font-bold text-gray-900 mb-1">{order.address?.full_name}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {order.address?.address_line}, {order.address?.locality}<br />
            {order.address?.city}, {order.address?.state} - <strong>{order.address?.pincode}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-2">Phone: <strong>{order.address?.phone}</strong></p>
        </div>

        {/* Payment & Charges */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#2874f0]" />
            <span>Payment Summary</span>
          </h3>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase text-gray-900">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold text-emerald-600 capitalize">{order.payment_status}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span className="text-emerald-600 font-bold">{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-sm text-gray-900">
              <span>Total Paid / Payable:</span>
              <span className="text-[#2874f0]">₹{order.final_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Items Ordered List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Purchased Items ({order.items?.length || 0})
        </h3>
        <div className="divide-y divide-gray-100">
          {order.items?.map(it => (
            <div key={it.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={it.product_image} alt={it.product_name} className="w-14 h-14 object-contain rounded p-1 border border-gray-100" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{it.product_name}</h4>
                  <p className="text-[11px] text-gray-500">Qty: {it.quantity} {it.selected_color && `• ${it.selected_color}`}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">₹{(it.unit_price * it.quantity).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/profile?tab=orders"
          className="py-2.5 px-6 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
        >
          View All My Orders
        </Link>
        <Link
          to="/"
          className="py-2.5 px-6 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs rounded shadow transition flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

