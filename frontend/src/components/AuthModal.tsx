import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authModalTab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!name) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, phone);
      if (!res.success) {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = async (type: 'customer' | 'admin') => {
    setError('');
    setLoading(true);
    if (type === 'admin') {
      await login('admin@shopsphere.com', 'admin123');
    } else {
      await login('customer@example.com', 'password123');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px]">
        
        {/* Left Flipkart-style Banner */}
        <div className="md:w-5/12 bg-[#2874f0] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              {authModalTab === 'login' ? 'Login' : 'Looks like you\'re new here!'}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              {authModalTab === 'login'
                ? 'Get access to your Orders, Wishlist and Personalized Recommendations'
                : 'Sign up with your mobile number & email to get started with ShopSphere'}
            </p>
          </div>

          <div className="relative z-10 my-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <ShoppingBag className="w-12 h-12 text-[#ffeb3b]" />
            </div>
          </div>

          {/* Quick Demo Accounts */}
          <div className="relative z-10 pt-4 border-t border-blue-400/40">
            <p className="text-xs text-blue-200 mb-2 font-medium">1-Click Test Accounts:</p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="w-full text-left px-2.5 py-1.5 rounded bg-white/15 hover:bg-white/25 text-xs text-white transition flex justify-between items-center"
              >
                <span>Customer: Rahul</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full text-left px-2.5 py-1.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-xs text-amber-200 transition flex justify-between items-center"
              >
                <span>Admin: Store Mgr</span>
                <span className="text-[10px] bg-amber-400/30 text-amber-100 px-1.5 py-0.5 rounded">Admin</span>
              </button>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-600 rounded-full opacity-50 pointer-events-none" />
        </div>

        {/* Right Form Container */}
        <div className="md:w-7/12 p-8 flex flex-col justify-between relative bg-white">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-sm outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-sm outline-none transition"
                />
              </div>
            </div>

            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-sm outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password (min 6 chars)"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-sm outline-none transition"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 pt-1">
              By continuing, you agree to ShopSphere's{' '}
              <span className="text-[#2874f0] font-medium cursor-pointer">Terms of Use</span> and{' '}
              <span className="text-[#2874f0] font-medium cursor-pointer">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#fb641b] hover:bg-[#e6530b] text-white font-semibold rounded shadow-md text-sm transition flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : authModalTab === 'login' ? (
                'Login'
              ) : (
                'Continue & Create Account'
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-4 text-center border-t border-gray-100 mt-4">
            {authModalTab === 'login' ? (
              <p className="text-xs text-gray-600">
                New to ShopSphere?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-[#2874f0] font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-600">
                Existing User?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-[#2874f0] font-bold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

