import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Upload,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Product, Order, AdminStats, Category } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<number>(3);
  const [prodBrand, setProdBrand] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodDiscPrice, setProdDiscPrice] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodBadge, setProdBadge] = useState('Top Deal');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [isDeal, setIsDeal] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isSpotlight, setIsSpotlight] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Status updating state for orders
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes, ordersRes, custRes, catsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products?limit=100'),
        api.get('/admin/orders'),
        api.get('/admin/customers'),
        api.get('/categories')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (prodsRes.data.success) setProducts(prodsRes.data.products);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (custRes.data.success) setCustomers(custRes.data.customers);
      if (catsRes.data.success) setCategories(catsRes.data.categories);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory(categories[0]?.id || 3);
    setProdBrand('');
    setProdDesc('');
    setProdOrigPrice('');
    setProdDiscPrice('');
    setProdStock('50');
    setProdBadge('Top Deal');
    setProdImageUrl('');
    setIsDeal(false);
    setIsTrending(false);
    setIsSpotlight(false);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category_id);
    setProdBrand(prod.brand);
    setProdDesc(prod.description);
    setProdOrigPrice(String(prod.original_price));
    setProdDiscPrice(String(prod.discounted_price));
    setProdStock(String(prod.stock));
    setProdBadge(prod.badge || 'Top Deal');
    setProdImageUrl(prod.primary_image || (prod.images && prod.images[0]) || '');
    setIsDeal(Boolean(prod.is_deal_of_the_day));
    setIsTrending(Boolean(prod.is_trending));
    setIsSpotlight(Boolean(prod.is_spotlight));
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);

    const payload = {
      name: prodName,
      category_id: prodCategory,
      brand: prodBrand,
      description: prodDesc,
      original_price: parseFloat(prodOrigPrice),
      discounted_price: parseFloat(prodDiscPrice),
      stock: parseInt(prodStock),
      badge: prodBadge,
      images: [prodImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80'],
      is_deal_of_the_day: isDeal,
      is_trending: isTrending,
      is_spotlight: isSpotlight
    };

    try {
      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setShowProductModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      
      {/* Top Banner */}
      <div className="bg-[#172337] text-white p-5 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400">Admin Control Center</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight mt-1">ShopSphere Store Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="py-2 px-4 bg-[#ff9f00] hover:bg-[#f59700] text-gray-900 font-bold text-xs rounded shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 bg-white p-1 rounded-t-lg shadow-xs">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-[#2874f0] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Revenue</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '0'}
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% this week
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Orders</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{stats?.totalOrders || orders.length}</h3>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  {stats?.pendingOrders || 0} requiring fulfillment
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Products</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{stats?.totalProducts || products.length}</h3>
                <span className="text-[11px] text-gray-500 mt-1 block">Across 14 categories</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Registered Users</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{stats?.totalCustomers || customers.length}</h3>
                <span className="text-[11px] text-gray-500 mt-1 block">Active shoppers</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Orders Overview Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs text-[#2874f0] font-bold hover:underline">
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#2874f0]">{o.id}</td>
                      <td className="p-3">{o.user_name || o.user_email}</td>
                      <td className="p-3 font-bold">₹{o.final_amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {o.order_status}
                        </span>
                      </td>
                      <td className="p-3 uppercase">{o.payment_method}</td>
                      <td className="p-3 text-gray-400">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900">Manage Products Catalog</h3>
              <p className="text-xs text-gray-500">Add, edit pricing, update stock and photos</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="py-2 px-4 bg-[#2874f0] hover:bg-[#1259c3] text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Price (Original / Offer)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Badges</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.primary_image || (p.images && p.images[0])} alt={p.name} className="w-10 h-10 object-contain rounded border p-0.5" />
                      <div>
                        <Link to={`/product/${p.slug}`} className="font-bold text-gray-800 hover:text-[#2874f0] line-clamp-1">
                          {p.name}
                        </Link>
                        <span className="text-[10px] text-gray-400">ID: {p.id} • {p.category_name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{p.brand}</td>
                    <td className="p-3">
                      <span className="font-bold text-gray-900">₹{p.discounted_price}</span>
                      <span className="text-gray-400 line-through ml-1.5">₹{p.original_price}</span>
                    </td>
                    <td className="p-3 font-semibold">
                      <span className={p.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-0.5 font-bold text-emerald-700">
                        {p.rating} ★
                      </span>
                    </td>
                    <td className="p-3">
                      {p.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900">Order Management & Fulfillment</h3>
              <p className="text-xs text-gray-500">Update order tracking status and inspect shipment details</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer & Address</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Final Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Change Status</th>
                  <th className="p-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#2874f0]">{o.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-gray-800">{o.address?.full_name || o.user_name}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{o.address?.city}, {o.address?.pincode}</p>
                    </td>
                    <td className="p-3">{o.items?.length || 0} items</td>
                    <td className="p-3 font-bold text-gray-900">₹{o.final_amount}</td>
                    <td className="p-3">
                      <span className="font-semibold uppercase">{o.payment_method}</span>
                      <span className="block text-[10px] text-emerald-600 font-bold capitalize">{o.payment_status}</span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded font-semibold text-xs bg-white"
                      >
                        {['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/order-success/${o.id}`}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900">Customer Base</h3>
            <p className="text-xs text-gray-500">Registered users, purchasing history & activity</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Orders Placed</th>
                  <th className="p-3">Lifetime Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={c.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-gray-900">{c.name}</span>
                    </td>
                    <td className="p-3 text-gray-600">{c.email}</td>
                    <td className="p-3 text-gray-600">{c.phone || 'N/A'}</td>
                    <td className="p-3 font-semibold">{c.orderCount || 0}</td>
                    <td className="p-3 font-bold text-emerald-700">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b">
              {editingProductId ? 'Edit Product' : 'Add New Product to Store'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Sony Wireless Noise Cancelling Headphones"
                  className="w-full px-3 py-2 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded text-xs bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="e.g. Sony, Apple, Puma"
                    className="w-full px-3 py-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(e.target.value)}
                    placeholder="2499"
                    className="w-full px-3 py-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodDiscPrice}
                    onChange={(e) => setProdDiscPrice(e.target.value)}
                    placeholder="1299"
                    className="w-full px-3 py-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Image URL</label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Describe technical specs, materials, and highlights..."
                  className="w-full px-3 py-2 border rounded text-xs"
                />
              </div>

              <div className="flex gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeal}
                    onChange={(e) => setIsDeal(e.target.checked)}
                  />
                  <span>Deal of the Day</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                  />
                  <span>Trending Pick</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpotlight}
                    onChange={(e) => setIsSpotlight(e.target.checked)}
                  />
                  <span>Spotlight Flagship</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2 bg-[#2874f0] text-white rounded text-xs font-bold shadow hover:bg-[#1259c3] disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

