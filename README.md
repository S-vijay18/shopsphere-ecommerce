# ShopSphere — Complete Modern E-Commerce Web Application

A full-stack, responsive e-commerce web application inspired by the **Flipkart** homepage design, layout, color scheme, navigation structure, and shopping experience. Features an original brand identity (**ShopSphere** / *"Explore Plus ✦"*), Indian Rupee (₹) pricing, festive promotional banners, and a complete end-to-end shopping workflow.

---

## 🌟 Key Features

### 1. Flipkart-Inspired Homepage Design
* **Sticky Header:** Brand logo with yellow *Explore Plus ✦* sparkle, Shopping/Grocery/Travel tabs, large search bar with real-time autocomplete suggestions, delivery location selector with PIN code modal, 1-click user authentication dropdown, and shopping cart counter badge.
* **14 Category Navigation Bar:**
  1. For You
  2. Fashion
  3. Mobiles
  4. Electronics
  5. Beauty
  6. Home
  7. Appliances
  8. Toys & Baby Products
  9. Food & Health
  10. Auto Accessories
  11. Sports
  12. Furniture
  13. Books
  14. Two Wheelers
* **Festive "Popular Picks" Promotional Banner:**
  - Vibrant warm orange & yellow festive gradient.
  - Four showcase cards featuring individual high-res product photos:
    - *Milton Bottles* – From ₹129
    - *Comfortable Shoes* – From ₹199
    - *Watches* – From ₹99
    - *Best Deals* – Under ₹469
* **Curated Homepage Sections:**
  - **In The Spotlight:** Flagship smartphones, M3 MacBooks, Sony ANC headphones, and OLED TVs with *✦ Assured* quality badges.
  - **Best Deals of the Day:** With live 24-hour countdown timer (`Ending in 14h : 28m : 45s`), horizontal scroll carousel, and View All link.
  - **Trending Products:** Top selling picks with ratings.
  - **Top Fashion Deals:** Levi's jeans, BIBA Anarkalis, Puma running shoes.
  - **Best Electronics:** Laptops, 5G phones, TWS earbuds.
  - **Home & Kitchen Essentials:** Milton vacuum bottles, induction cooktops, food storage container sets.
  - **Recommended For You:** Algorithmic product recommendations.

### 2. Product Listing & Multi-Filter System
* **Grid Layout:** Responsive 2 to 4-column product grid with rounded cards and hover zoom effects.
* **Faceted Sidebar Filters:**
  - Category selector (14 categories)
  - Brand filter checkboxes (Apple, Samsung, Sony, boAt, Puma, Levi's, Philips, Milton, etc.)
  - Price range min/max filter
  - Customer rating filter (4★ & above, 3★ & above, etc.)
  - Discount filter (10%+, 30%+, 50%+, 70%+)
* **Sorting Options:** Popularity, Price: Low to High, Price: High to Low, Customer Rating, Newest First.
* **Pagination:** Interactive page numbers with Previous/Next controls.

### 3. Product Details Page
* **Interactive Image Gallery:** Main zoomable preview with vertical thumbnail gallery.
* **Product Specifications:** Dynamic key-value technical specifications table (Processor, Display, Battery, Material, Warranty, etc.).
* **Flipkart Action Buttons:** Vibrant Yellow **ADD TO CART** and Vibrant Orange **BUY NOW**.
* **Bank Offers & Coupons:** 5% Cashback on Axis Bank, ₹1,500 off coupons, partner offers.
* **Live PIN Code Checker:** 6-digit Indian PIN delivery estimator with real delivery dates and Free Delivery badge.
* **Customer Ratings & Reviews:** Breakdown progress bars and a verified customer review submission form.
* **Related Products:** Horizontal carousel with same-category recommendations.

### 4. Fully Functional Shopping Cart
* Real-time quantity increment/decrement with stock availability limits.
* Automatic calculation of MRP Subtotal, Total Discount, Free Delivery eligibility threshold, and Secured Packaging Fee.
* Highlight badge: *"You will save ₹X on this order"*.
* Cart state persistence across page refreshes.

### 5. Multi-Step Checkout & Orders
* **Step 1 — Delivery Address:** Select from saved addresses or add a new address with PIN code and address type (Home/Work).
* **Step 2 — Order Summary:** Review quantities and pricing.
* **Step 3 — Payment Options:** Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Card, and Net Banking.
* **Order Confirmation Page:**
  - Unique Order ID (e.g. `ORD-2026-894102`)
  - Estimated delivery date
  - Visual 5-stage shipment tracking stepper:
    `[Order Confirmed] → [Processing] → [Shipped] → [Out for Delivery] → [Delivered]`

### 6. User Authentication & Profiles
* Secure JWT token authentication with bcrypt password hashing.
* User Profile tab with Personal Information editing.
* Address Book management (Add, Delete, Set Default).
* Order history with status badges and order cancellation option.
* Wishlist management with 1-click "Move to Cart".

### 7. Protected Store Admin Dashboard
* Accessible via role-based authentication (`admin`).
* Live Metrics: Total Revenue, Total Orders, Total Products, Total Customers, Pending Shipments.
* Product Management: Add New Product, Edit Product, Delete Product, Stock Tracking.
* Order Fulfillment: Change order status across the lifecycle (`Order Confirmed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered` → `Cancelled`).
* Customer Base Explorer: Lifetime order counts and total spent per customer.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Router v6, Lucide React icons, Axios |
| **Backend** | Node.js, Express.js (ES Modules), JWT, bcryptjs, Multer |
| **Database** | MySQL 8.0+ relational schema (`database/schema.sql`, `database/seed.sql`) with dual-mode fallback |
| **Tooling** | Vite, PostCSS, Autoprefixer |

---

## 📁 Project Structure

```text
wt web/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL pool & resilient fallback relational engine
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profiles & addresses
│   │   ├── productController.js  # Filters, sorting, search, pincode checker & homepage
│   │   ├── categoryController.js # 14 Flipkart categories
│   │   ├── cartController.js     # Add, remove, update quantities, price calculations
│   │   ├── orderController.js    # Order creation, order tracking & status
│   │   ├── reviewController.js   # Customer reviews & ratings
│   │   └── adminController.js    # Admin analytics, product CRUD & order management
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verifier & admin role guard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                  # Upload directory for product assets
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Flipkart-style sticky search, logo & user menu
│   │   │   ├── CategoryBar.tsx   # 14 horizontal categories with icons
│   │   │   ├── ProductCard.tsx   # Rounded cards with ratings, prices & quick add
│   │   │   ├── ProductCarousel.tsx # Horizontal carousel with timer & scroll buttons
│   │   │   ├── PincodeModal.tsx  # Delivery location & PIN code checker
│   │   │   ├── AuthModal.tsx     # Login & Register modal dialog with 1-click demo
│   │   │   ├── Toast.tsx         # Notification toast
│   │   │   └── Footer.tsx        # Comprehensive Flipkart-style footer
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   # User state, token & address book
│   │   │   ├── CartContext.tsx   # Cart items, badge count & summary
│   │   │   └── WishlistContext.tsx # Wishlist toggle & persistence
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx    # Header, outlet, footer & toast wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Popular Picks, Deals of the Day, Spotlight
│   │   │   ├── ProductListingPage.tsx # Category/brand/price filters & sorting
│   │   │   ├── ProductDetailPage.tsx # Image gallery, variants, reviews & specs
│   │   │   ├── CartPage.tsx      # Item list, quantity controls & savings summary
│   │   │   ├── CheckoutPage.tsx  # Address selection & payment options
│   │   │   ├── OrderSuccessPage.tsx # Order confirmation & visual tracking stepper
│   │   │   ├── ProfilePage.tsx   # Personal info, addresses, orders & wishlist
│   │   │   ├── AdminDashboardPage.tsx # Metrics, CRUD, and order fulfillment
│   │   │   └── NotFoundPage.tsx  # 404 handler
│   │   ├── services/
│   │   │   └── api.ts            # Axios interceptor for JWT & session IDs
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # Route definitions
│   │   ├── main.tsx              # React root entry
│   │   ├── index.css             # Tailwind base & custom animations
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── database/
│   ├── schema.sql                # Production MySQL DDL tables schema
│   └── seed.sql                  # Initial catalog data (14 categories, 20 products)
│
├── package.json                  # Root runner script
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v18+ (tested with v26)
* **npm** v9+
* **MySQL Server 8.0+** (optional — built-in resilient database runs automatically if MySQL service is not started)

---

### Step 1: Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Or navigate to `backend/` and run `npm install`, then to `frontend/` and run `npm install`).*

---

### Step 2: Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopsphere_db

# JWT Secret
JWT_SECRET=shopsphere_super_secure_jwt_secret_key_2026_flipkart_style
JWT_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:5173
```

---

### Step 3: MySQL Database Setup (Optional)
If running MySQL Server on port 3306:
1. Open MySQL Workbench or mysql CLI:
```bash
mysql -u root -p
```
2. Run the provided schema and seed files:
```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```
> **Note:** If MySQL is not running on your machine, the backend will automatically activate its built-in relational store with all 20 products, 14 categories, and demo accounts pre-seeded with zero setup required.

---

### Step 4: Run the Application

#### Terminal 1 — Start Backend Server:
```bash
npm run dev:backend
```
*Backend runs at:* **`http://localhost:5000`**  
*API Health check:* **`http://localhost:5000/api/health`**

#### Terminal 2 — Start Frontend Application:
```bash
npm run dev:frontend
```
*Frontend runs at:* **`http://localhost:5173`**

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔑 Pre-Configured Demo Accounts

For fast testing, the Login modal includes **1-Click Demo Account** buttons:

| Account Type | Email | Password | Access Level |
|---|---|---|---|
| **Customer** | `customer@example.com` | `password123` | Full shopping, orders, wishlist, addresses |
| **Store Admin** | `admin@shopsphere.com` | `admin123` | Admin dashboard, product CRUD, order status updates |

---

## 🧪 Testing Checklist
- [x] **Homepage:** Sticky header with search, 14 categories bar, orange/yellow Popular Picks banner, live Deals countdown timer.
- [x] **Search Autocomplete:** Live product suggestions as you type with keyboard enter navigation.
- [x] **Product Listing:** Filter by Category, Brand, Price, Rating, and Discount with instant sorting.
- [x] **Product Details:** High-res image gallery, variant selectors, PIN code checker, and review submission.
- [x] **Shopping Cart:** Quantity increment/decrement, free delivery threshold calculation, and savings badge.
- [x] **Checkout:** Saved address selector, new address modal, payment options (COD, UPI, Card, Net Banking).
- [x] **Order Confirmation:** Unique order ID generation and 5-stage visual progress stepper.
- [x] **Admin Dashboard:** Revenue and order statistics, product addition/editing, and status management.

