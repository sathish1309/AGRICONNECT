# AgriConnect – A Digital Farmer-to-Buyer Marketplace

> **Academic Project Course:** B.Tech Information Technology  
> **Subject:** Entrepreneurship and Startups  
> **Project Focus:** Technology-driven business opportunity and digital marketplace  
> **Notice:** Functional full-stack application (Non-AI/ML core).  

---

## 1. Project Introduction

**AgriConnect** is a full-stack digital marketplace connecting agricultural growers (farmers) directly with commercial buyers (supermarkets, restaurants, retail outlets, food processors, and wholesalers) as well as individual consumers.

By eliminating predatory middlemen (commission agents and physical mandi brokers) who traditionally shave off up to 55% of crop value, AgriConnect delivers higher, fair income to farmers and reduces procurement expenses for food businesses through transparent, grower-set dynamic pricing, integrated cold-chain route tracking, and secure digital escrow payments.

---

## 2. Problem Statement & Startup Rationale

In traditional agricultural supply chains:
1. **Middleman Markups:** Between 3 and 5 intermediaries extract margins, leaving smallholder farmers with only 30%–45% of final consumer price.
2. **Fixed Mandi Distress Sales:** Farmers have virtually no leverage to set prices based on quality or local demand at physical auction yards.
3. **Lack of Traceability:** Commercial buyers (hotels, supermarkets) pay inflated prices for harvest produce that has deteriorated through delayed transit without farm origin verification.
4. **Logistics Bottlenecks:** Direct farm-to-dock transport coordination is fractured.

### The Startup Solution
AgriConnect provides a **disintermediated digital marketplace** where:
- Farmers retain 100% control over their selling price (**Dynamic Farmer-Set Pricing**).
- Buyers discover verified harvest batches with origin location, harvest date, and quality grading.
- The platform generates sustainable startup revenue through a **2%–5% transaction commission** (configurable) and logistics dispatch fees.
- The platform maintains an **Automated Activity Monitor** recording every price change, order, payment, and delivery transition.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) + Lucide Icons + CSS Design System | Responsive SPA with Farmer, Buyer, and Admin dashboards |
| **Backend** | Node.js + Express.js | Stateless REST API microservices, JWT security, audit engine |
| **Database** | MySQL 5.7+ / 8.0+ | Relational schema (15+ tables), foreign keys, audit log tables |
| **Authentication** | JWT + bcryptjs | Role-based access control (`FARMER`, `BUYER`, `ADMIN`) |
| **Payments** | Razorpay Test Sandbox | UPI, Card, Net Banking with zero storage of sensitive card data |
| **Logistics & Maps**| Leaflet + OpenStreetMap (Google Maps API compatible) | Route lines, coordinates, distance in km, delivery milestones |

---

## 4. System Architecture

```
            [ Farmer / Buyer / Admin ]
                        ↓
             React.js Frontend (Vite)
                        ↓  (REST API with JWT)
           Node.js + Express.js Server
                        ↓
            MySQL Relational Database
             (schema.sql & seed.sql)
                        ↓
     External Integrations:
     - Razorpay Test Sandbox (Payment Simulation)
     - Interactive Leaflet / Google Maps API (Routing)
```

---

## 5. User Roles & Credentials

The platform features 3 role-based portals with pre-seeded demo accounts:

| Role | Demo Email | Demo Password | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@agriconnect.com` | `Admin@123` | System oversight, product approvals, user management, order monitoring, activity logs, platform settings |
| **FARMER** | `ravi@agriconnect.com` | `Farmer@123` | Farm crop listings, dynamic price changes, order confirmation, harvest preparation, earnings ledger |
| **BUYER** | `abc@supermarket.com` | `Buyer@123` | Marketplace discovery, multi-filter search, cart & checkout, test payment, map route tracking, product reviews |

*Additional Seed Farmers:* `suresh@agriconnect.com`, `priya@agriconnect.com` (Password: `Farmer@123`)  
*Additional Seed Buyers:* `freshfoods@restaurant.com`, `green@retail.com` (Password: `Buyer@123`)

---

## 6. Core Features & Business Mechanics

### 1. Dynamic Farmer-Set Pricing (No Artificial AI Prediction)
- Farmers set the initial selling price (e.g. Tomato ₹30/kg).
- Farmers can adjust the price at any time (e.g. ₹30/kg → ₹32/kg or ₹28/kg) based on seasonal demand, harvest quality, or bulk incentives.
- Every price update immediately modifies the marketplace and automatically writes an auditable record into `price_history` and `activity_logs`:
  > *"Farmer Ravi Kumar changed Fresh Red Tomatoes price from ₹30.00/kg to ₹32.00/kg"*

### 2. Product Compliance & Approval Workflow
- When a farmer lists produce, the status is set to `PENDING`.
- Admin reviews the harvest grade, price, and farm details in the **Product Approvals Queue**.
- Upon Admin approval, produce immediately becomes visible in the public marketplace.

### 3. Cart, Stock Ceilings & Order Placement
- Validates procurement volume against current available farm stock (prevents over-ordering).
- Generates a unique corporate Order ID (e.g. `AGRI-2026-00125`).
- Calculates subtotal, base logistics fee (₹50), platform commission (3.5%), and grand total.

### 4. Razorpay Test Mode Payment
- Supports UPI (VPA), Credit/Debit Card, and Net Banking options.
- PCI-DSS compliant sandbox: No CVV, card numbers, or passwords stored.
- Instant sandbox confirmation updates order status to `Payment Confirmed` and logs `PAYMENT_SUCCESS`.

### 5. Order & Delivery Lifecycle Tracker
- **8 Order Stages:** `Order Placed` → `Payment Confirmed` → `Farmer Confirmed` → `Preparing` → `Ready for Pickup` → `Out for Delivery` → `Delivered` → `Cancelled`.
- **Interactive Delivery Map:** Renders farm pickup origin, destination dock, transit position marker, route polyline, and distance in km.

### 6. Automatic Activity Monitor (Core Admin Feature)
- System automatically captures and logs all key platform events into `activity_logs`:
  - `PRODUCT_CREATED`, `PRICE_CHANGED`, `PRODUCT_APPROVED`, `PRODUCT_REJECTED`
  - `ORDER_PLACED`, `ORDER_CONFIRMED`, `ORDER_STATUS_CHANGED`, `PAYMENT_SUCCESS`
  - `DELIVERY_STATUS_CHANGED`, `DELIVERY_COMPLETED`, `REVIEW_SUBMITTED`
  - `USER_ACTIVATED`, `USER_DEACTIVATED`, `SETTINGS_UPDATED`
- Multi-filtering by User Role, Activity Type, Date range, and keyword search.

### 7. Database-Driven Business Analytics
- 6 pure relational database queries (no AI/ML):
  1. Orders per month
  2. Sales and commission per month
  3. Farmers vs. Buyers distribution
  4. Product categories distribution
  5. Order status breakdown
  6. Payment status settlement ratio

### 8. Configurable Startup Business Model
- Admin can configure platform commission percentage (2% to 5%), base delivery fees, and auto-approval toggles.

---

## 7. Database Architecture

The MySQL database `agriconnect` includes all 17 relational tables:

1. `users` – Core authentication credentials, password hashes, and user roles.
2. `farmers` – Farm size, primary crops, address, village/city, verification badge, rating.
3. `buyers` – Commercial business type (Supermarket, Restaurant, Wholesaler), delivery address.
4. `admins` – Administrative personnel and departmental responsibilities.
5. `categories` – Agricultural produce categories (Vegetables, Fruits, Grains, Pulses, Spices, Dairy, Other).
6. `products` – Produce details, quantity, unit, price_per_unit, harvest date, quality grade, approval status.
7. `price_history` – Farmer price change audit trail (old_price, new_price, changed_by, reason).
8. `cart` – Per-buyer shopping cart container.
9. `cart_items` – Produce items in cart with stock validation.
10. `orders` – Master order transaction record with unique `order_number` (AGRI-2026-XXXXX).
11. `order_items` – Line items with unit price, farmer FK, and subtotal.
12. `payments` – Razorpay test transaction IDs, payment method, payment status.
13. `delivery` – Tracking number, pickup & destination coordinates, distance_km, carrier name.
14. `reviews` – 1 to 5 star rating, buyer feedback comments.
15. `locations` – Regional coordinates and pincode hubs.
16. `activity_logs` – **Core activity monitor table** (user_id, role, activity_type, description, product_id, order_id, old_value, new_value, created_at).
17. `platform_settings` – Admin configurable business parameters (commission %, delivery fee).

---

## 8. Installation & Setup Guide

### Prerequisites
- **Node.js** (v18+ or v20+ / v24 LTS recommended)
- **npm** (v9+ / v11+)
- **MySQL Server** (XAMPP, MySQL Community Server, or MariaDB on port 3306)  
  *(Note: Backend includes automatic zero-config embedded SQL fallback if MySQL daemon is not running during evaluation).*

### Step 1: Clone or Navigate to Project
```bash
cd e:/AGRICONNECT
```

### Step 2: Database Initialization (MySQL)
Ensure your MySQL server is running (e.g. via XAMPP or Windows Service):
```bash
# Initialize database tables and populate rich demo seed data
npm run init-db
```
*Or import manually in MySQL / phpMyAdmin:*
```sql
SOURCE e:/AGRICONNECT/database/schema.sql;
SOURCE e:/AGRICONNECT/database/seed.sql;
```

### Step 3: Backend Setup
```bash
cd server
npm install
npm start
```
*The backend server will run on `http://localhost:5000`.*  
*Health Check:* `http://localhost:5000/api/health`

### Step 4: Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*The React frontend will run on `http://localhost:5173`.*

---

## 9. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register/farmer` – Register grower account
- `POST /api/auth/register/buyer` – Register commercial buyer
- `POST /api/auth/login` – Authenticate with email & password
- `GET /api/auth/profile` – Fetch current authenticated user
- `PUT /api/auth/profile` – Update contact details or address

### Products & Dynamic Pricing (`/api/products`)
- `GET /api/products` – Discover approved marketplace crops (with search, category, location, price filters)
- `GET /api/products/:id` – View produce details, farmer bio, price history, and reviews
- `POST /api/products` – Farmer creates crop listing (status: `PENDING`)
- `PUT /api/products/:id/price` – **Farmer updates selling price (emits `PRICE_CHANGED` activity log)**
- `PUT /api/products/:id` – Farmer updates produce quantity or details
- `DELETE /api/products/:id` – Farmer/Admin removes listing

### Orders (`/api/orders`)
- `POST /api/orders` – Place order with stock decrement and commission calculation
- `GET /api/orders` – Retrieve role-specific orders (Buyer, Farmer, Admin)
- `GET /api/orders/:id` – Detailed order breakdown with delivery and payment
- `PUT /api/orders/:id/status` – Advance order status (emits `ORDER_STATUS_CHANGED` activity log)

### Payments (`/api/payments`)
- `POST /api/payments/create` – Initialize Razorpay test transaction
- `POST /api/payments/verify` – Verify payment, advance order to `Payment Confirmed`, log `PAYMENT_SUCCESS`
- `GET /api/payments` – Retrieve payment ledger

### Delivery & Route (`/api/delivery`)
- `GET /api/delivery/order/:orderId` – Retrieve route coordinates, distance, and carrier status
- `PUT /api/delivery/:id/status` – Update dispatch milestone (`Pickup Ready`, `In Transit`, `Delivered`)

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard` – 11 platform KPI cards & recent activities
- `GET /api/admin/activities` – **Admin Activity Monitor audit table with multi-filters**
- `PUT /api/admin/products/:id/approve` – Approve pending produce listing
- `PUT /api/admin/products/:id/reject` – Reject produce listing with reason
- `GET /api/admin/users` – User directory with status toggles
- `PUT /api/admin/users/:id/status` – Activate/Deactivate user
- `PUT /api/admin/farmers/:farmerId/verify` – Verify farmer account
- `GET /api/admin/analytics` – Monthly sales, orders, user ratio, and category metrics
- `PUT /api/admin/settings` – Update platform commission % and delivery fees

---

## 10. Step-by-Step Demonstration Walkthrough

Follow these steps for an impressive viva or academic evaluation:

### Step A: Explore Landing Page & Startup Rationale
1. Open `http://localhost:5173`.
2. Review the **Hero Section**, **Why AgriConnect**, and the **Business Model Thesis** section detailing the 3.5% transaction commission and market problem statement.

### Step B: Test Dynamic Farmer-Set Pricing
1. Click **Demo Login** in the top navbar → Select **Farmer Ravi**.
2. Go to **My Products** (`/farmer/products`).
3. Click **Change Price** on *Fresh Red Tomatoes*.
4. Update price from `₹30/kg` to `₹32/kg` and confirm.
5. Notice the green success alert indicating the change was recorded in the database and audit log!

### Step C: Verify Admin Activity Monitor (Core Feature)
1. Use the navbar **Demo Login** dropdown → Select **Admin**.
2. Go to **Activity Monitor** (`/admin/activities`).
3. Observe the newly logged entry at the top:
   > *"Farmer Ravi Kumar changed Fresh Red Tomatoes price from ₹30.00/kg to ₹32.00/kg"*
4. Filter by role `FARMER` or activity `PRICE_CHANGED` to showcase the filtering capability.

### Step D: Buyer Order Placement, Test Payment & Map Tracking
1. Use **Demo Login** → Select **Buyer ABC**.
2. Go to **Marketplace** (`/marketplace`). Notice the Tomatoes now display at **₹32/kg**.
3. Click **Add to Cart** → Open **Cart** (`/cart`).
4. Click **Proceed to Checkout** → Review delivery destination.
5. Click **Authorize & Pay** → Razorpay Test Modal opens.
6. Click **Simulate Test Payment** → Instant verification!
7. The **Order Tracking** screen loads with the 8-stage progress tracker and the **Interactive Leaflet Route Map** showing pickup in Coimbatore, delivery in Chennai, distance in km, and carrier details.

### Step E: Admin Product Approvals & Business Analytics
1. Switch to **Admin** via top navbar.
2. Open **Product Approvals** (`/admin/approvals`) to review pending produce (e.g. *Guntur Hot Red Chillies*). Click **Approve**.
3. Open **Business Analytics** (`/admin/analytics`) to inspect the 6 database-calculated charts showing monthly orders, sales volume, and user distributions.

---

## 11. Deploy & Share Online (Shareable Public Link)

AgriConnect includes built-in scripts to expose the application to the internet via an instant secure HTTPS tunnel for remote demonstrations and evaluator reviews.

### 1-Click Online Sharing
Double-click `share-online.bat` in the root folder.
It will start the unified server (port 5000) and establish a secure HTTPS tunnel link (e.g. `https://<subdomain>.lhr.life`).
Anyone with the link can access the full website, place orders, and test all 3 demo accounts without installing anything!

---

## 12. Academic Declaration

This project was built for the **B.Tech Information Technology** curriculum under the subject **Entrepreneurship and Startups**. It demonstrates a working, technology-driven platform startup model that solves real agricultural supply-chain challenges through full-stack software engineering.
