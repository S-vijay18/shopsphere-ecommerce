import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#2874f0]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">About Us & Contact</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2874f0] to-[#1259c3] text-white rounded-xl p-8 sm:p-12 mb-8 shadow-md">
        <div className="max-w-2xl">
          <span className="inline-block bg-[#ff9f00] text-black text-xs font-black uppercase px-2.5 py-1 rounded mb-3">
            ShopSphere India
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3">
            India's Leading Trusted E-Commerce Marketplace
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Delivering millions of authentic products to over 19,000+ PIN codes across India with lightning fast delivery, genuine brand warranties, and customer-first support.
          </p>
        </div>
      </div>

      {/* 4 Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Fast & Free Delivery</h3>
            <p className="text-xs text-gray-500">Free delivery on eligible orders above ₹499 across all cities.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-[#388e3c] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">100% Genuine Assured</h3>
            <p className="text-xs text-gray-500">Every product goes through strict quality checks before dispatch.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#ff9f00] flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Easy 7-Day Returns</h3>
            <p className="text-xs text-gray-500">Hassle-free doorstep pickup with instant refund initiation.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">24x7 Customer Care</h3>
            <p className="text-xs text-gray-500">Dedicated assistance round the clock via chat, phone, and email.</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Story & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* About Company Story */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2874f0]" />
            <span>Our Mission & Promise</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p>
              Started with a vision to democratize e-commerce in India, <strong>ShopSphere</strong> brings millions of products from verified sellers, top national brands, and local artisans straight to your doorstep. Inspired by India’s dynamic shopping culture, we combine cutting-edge technology with intuitive design to make online shopping seamless, affordable, and joyful for every Indian.
            </p>
            <p>
              From the latest flagship 5G smartphones, fashion collections, and energy-efficient kitchen appliances, to curated home decor and daily essentials, our catalog is curated to give you maximum value with festive discounts and verified customer reviews.
            </p>
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded text-center">
                <span className="block text-xl font-extrabold text-[#2874f0]">10M+</span>
                <span className="text-[11px] text-gray-500">Happy Customers</span>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <span className="block text-xl font-extrabold text-[#388e3c]">100%</span>
                <span className="text-[11px] text-gray-500">Authentic Products</span>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center col-span-2 sm:col-span-1">
                <span className="block text-xl font-extrabold text-[#ff9f00]">19,000+</span>
                <span className="text-[11px] text-gray-500">Pincodes Covered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Customer Support</h2>
          <div className="space-y-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#2874f0] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-gray-900">Toll-Free Helpline</span>
                <span className="text-gray-500">1800 208 9898 / 044-45614700</span>
                <span className="block text-[11px] text-gray-400">Available 24x7 in 8 regional languages</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#2874f0] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-gray-900">Email Support</span>
                <a href="mailto:support@shopsphere.com" className="text-[#2874f0] hover:underline">
                  support@shopsphere.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2874f0] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-gray-900">Headquarters</span>
                <span className="text-gray-500 text-xs leading-relaxed block">
                  ShopSphere Internet Pvt Ltd,<br />
                  Buildings Alyssa, Outer Ring Road,<br />
                  Devarabeesanahalli, Bengaluru 560103
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/products"
                className="w-full py-2.5 px-4 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs rounded transition text-center block shadow"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
