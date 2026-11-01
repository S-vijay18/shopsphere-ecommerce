import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { Order, Address, Product } from '../types';

interface ContextType {
  showToast: (msg: string) => void;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { showToast } = useOutletContext<ContextType>();
  const { user, logout, addresses, fetchAddresses, addAddress, deleteAddress, updateUser } = useAuth();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Wishlist Products
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Add Address Form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLocality, setAddrLocality] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrType, setAddrType] = useState<'Home' | 'Work'>('Home');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    setName(user.name);
    setPhone(user.phone || '');
  }, [user]);

  // Load orders if on orders tab
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.get('/orders/my-orders');
          if (res.data.success) {
            setOrders(res.data.orders);
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }

    if (activeTab === 'wishlist') {
      const fetchWishlistProds = async () => {
        setLoadingWishlist(true);
        try {
          const res = await api.get('/products?limit=50');
          if (res.data.success) {
            const filtered = res.data.products.filter((p: Product) => wishlistIds.includes(p.id));
            setWishlistProducts(filtered);
          }
        } catch (err) {
          console.error('Error fetching wishlist products:', err);
        } finally {
          setLoadingWishlist(false);
        }
      };
      fetchWishlistProds();
    }
  }, [activeTab, wishlistIds]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile information updated successfully');
      }
    } catch {
      showToast('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await addAddress({
      full_name: addrName,
      phone: addrPhone,
      pincode: addrPincode,
      locality: addrLocality,
      address_line: addrLine,
      city: addrCity,
      state: addrState,
      address_type: addrType,
      is_default: addresses.length === 0 ? 1 : 0
    });

    if (ok) {
      showToast('Address added successfully');
      setShowAddressModal(false);
      setAddrName('');
      setAddrPhone('');
      setAddrPincode('');
      setAddrLocality('');
      setAddrLine('');
      setAddrCity('');
      setAddrState('');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: 'Cancelled' } : o));
      }
    } catch {
      showToast('Failed to cancel order');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#2874f0]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-gray-400 block">Hello,</span>
              <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
              <span className="text-xs text-gray-500 truncate block">{user.email}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
            
            <button
              onClick={() => setSearchParams({ tab: 'profile' })}
              className={`w-full flex items-center justify-between p-3.5 transition text-left ${
                activeTab === 'profile' ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-4 h-4 text-[#2874f0]" />
                <span>Profile Information</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'orders' })}
              className={`w-full flex items-center justify-between p-3.5 transition text-left ${
                activeTab === 'orders' ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#2874f0]" />
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'addresses' })}
              className={`w-full flex items-center justify-between p-3.5 transition text-left ${
                activeTab === 'addresses' ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#2874f0]" />
                <span>Manage Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'wishlist' })}
              className={`w-full flex items-center justify-between p-3.5 transition text-left ${
                activeTab === 'wishlist' ? 'bg-blue-50 text-[#2874f0] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#2874f0]" />
                <span>My Wishlist ({wishlistIds.length})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-between p-3.5 text-amber-900 bg-amber-50/60 hover:bg-amber-100 font-bold transition"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 p-3.5 text-red-600 hover:bg-red-50 font-medium transition text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

          </div>

        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Manage your name, contact details and email address</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 91234 56789"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Account Role</label>
                  <span className="inline-block px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold capitalize">
                    {user.role}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="py-2.5 px-6 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs rounded shadow transition disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Order History</h3>
                <span className="text-xs text-gray-500">{orders.length} past orders</span>
              </div>

              {loadingOrders ? (
                <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 border-3 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-xs text-gray-500">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-800 mb-1">No orders placed yet</h4>
                  <p className="text-xs text-gray-500 mb-4">When you place an order, it will appear here with full tracking.</p>
                  <Link to="/products" className="py-2 px-5 bg-[#2874f0] text-white text-xs font-bold rounded">
                    Explore Deals
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:border-gray-300 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        <div>
                          <span className="text-xs font-bold text-gray-900">Order #{order.id}</span>
                          <span className="text-[11px] text-gray-400 block">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            order.order_status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.order_status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            ● {order.order_status}
                          </span>
                          <span className="text-sm font-bold text-gray-900">₹{order.final_amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="py-3 divide-y divide-gray-50">
                        {order.items?.map(it => (
                          <div key={it.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={it.product_image} alt={it.product_name} className="w-12 h-12 object-contain rounded border border-gray-100 p-0.5" />
                              <div>
                                <h5 className="font-semibold text-gray-800 line-clamp-1">{it.product_name}</h5>
                                <p className="text-[11px] text-gray-500">Qty: {it.quantity} • ₹{it.unit_price}</p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-800">₹{it.total_price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Payment: <strong className="uppercase">{order.payment_method}</strong> ({order.payment_status})</span>
                        <div className="flex gap-2">
                          {order.order_status !== 'Delivered' && order.order_status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded font-semibold text-xs transition"
                            >
                              Cancel Order
                            </button>
                          )}
                          <Link
                            to={`/order-success/${order.id}`}
                            className="px-3 py-1 bg-blue-50 text-[#2874f0] hover:bg-blue-100 rounded font-bold text-xs transition"
                          >
                            Track Order →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Manage Addresses</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-3 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded shadow hover:bg-[#1259c3] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-start">
                      <div className="text-xs text-gray-700 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{addr.full_name}</span>
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded uppercase">
                            {addr.address_type}
                          </span>
                          {addr.is_default ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              DEFAULT
                            </span>
                          ) : null}
                        </div>
                        <p className="text-gray-600">{addr.address_line}, {addr.locality}</p>
                        <p className="text-gray-600">{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></p>
                        <p className="text-gray-500">Phone: {addr.phone}</p>
                      </div>

                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 transition"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="text-base font-bold text-gray-900">My Wishlist ({wishlistIds.length})</h3>
              </div>

              {loadingWishlist ? (
                <div className="p-8 text-center bg-white rounded-lg">
                  <div className="w-8 h-8 border-3 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-xs text-gray-500">Loading wishlist...</span>
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-gray-800 mb-1">Your wishlist is empty</h4>
                  <p className="text-xs text-gray-500 mb-4">Click the heart icon on any product to save it here for later.</p>
                  <Link to="/products" className="py-2 px-5 bg-[#2874f0] text-white text-xs font-bold rounded">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wishlistProducts.map(prod => (
                    <div key={prod.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm flex flex-col justify-between">
                      <div className="relative h-36 bg-gray-50 rounded overflow-hidden mb-2 p-2">
                        <img src={prod.primary_image || (prod.images && prod.images[0])} alt={prod.name} className="w-full h-full object-contain" />
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-xs"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link to={`/product/${prod.slug}`} className="text-xs font-semibold text-gray-800 line-clamp-1 hover:text-[#2874f0]">
                        {prod.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-bold text-sm text-gray-900">₹{prod.discounted_price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{prod.original_price}</span>
                      </div>
                      <button
                        onClick={async () => {
                          await addToCart(prod.id, 1);
                          showToast('Added to cart!');
                        }}
                        className="mt-3 w-full py-1.5 bg-[#ff9f00] text-gray-900 font-bold text-xs rounded hover:bg-[#f59700] transition"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="font-bold text-base text-gray-900 mb-4">Add New Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={addrName}
                onChange={(e) => setAddrName(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs"
              />
              <input
                type="tel"
                required
                placeholder="10-digit Phone"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Pincode (6 digits)"
                  value={addrPincode}
                  onChange={(e) => setAddrPincode(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Locality"
                  value={addrLocality}
                  onChange={(e) => setAddrLocality(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="Address (House No, Building, Street)"
                value={addrLine}
                onChange={(e) => setAddrLine(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                />
              </div>

              <div className="flex gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="addressTypeModal"
                    checked={addrType === 'Home'}
                    onChange={() => setAddrType('Home')}
                  />
                  <span>Home</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="addressTypeModal"
                    checked={addrType === 'Work'}
                    onChange={() => setAddrType('Work')}
                  />
                  <span>Work</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border rounded text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2874f0] text-white rounded text-xs font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

