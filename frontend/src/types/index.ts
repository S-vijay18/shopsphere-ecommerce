export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  pincode: string;
  locality: string;
  address_line: string;
  city: string;
  state: string;
  landmark?: string;
  alternate_phone?: string;
  address_type: 'Home' | 'Work';
  is_default: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image_url: string;
  description: string;
  is_featured: number | boolean;
  display_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  brand: string;
  model_number?: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percent: number;
  stock: number;
  rating: number;
  rating_count: number;
  reviews_count: number;
  is_assured: number | boolean;
  is_featured: number | boolean;
  is_deal_of_the_day: number | boolean;
  is_trending: number | boolean;
  is_spotlight: number | boolean;
  is_popular_pick: number | boolean;
  popular_pick_title?: string | null;
  badge?: string;
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  images?: string[];
  primary_image?: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: number | boolean;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  brand: string;
  slug: string;
  image: string;
  original_price: number;
  discounted_price: number;
  discount_percent: number;
  stock: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  item_total: number;
}

export interface CartSummary {
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
  totalSavings: number;
  deliveryCharge: number;
  packagingFee: number;
  finalAmount: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_color?: string;
  selected_size?: string;
}

export interface TrackingStep {
  status: string;
  timestamp: string | null;
  message: string;
}

export interface Order {
  id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  address_id: number;
  address: Partial<Address>;
  total_amount: number;
  discount_amount: number;
  delivery_charge: number;
  final_amount: number;
  payment_method: 'cod' | 'upi' | 'card' | 'netbanking';
  payment_status: 'pending' | 'completed' | 'failed';
  order_status: 'Order Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  tracking_number: string;
  estimated_delivery: string;
  created_at: string;
  items: OrderItem[];
  tracking_history?: TrackingStep[];
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  avgOrderValue: number;
  recentOrders: Order[];
  categoryStats: { id: number; name: string; count: number }[];
}

