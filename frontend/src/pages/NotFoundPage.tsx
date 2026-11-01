import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ShoppingCart } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex gap-3">
          <Link
            to="/"
            className="py-2.5 px-6 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs rounded shadow transition flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/products"
            className="py-2.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded transition flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

