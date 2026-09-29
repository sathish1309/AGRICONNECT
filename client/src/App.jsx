import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Marketplace from './pages/public/Marketplace';
import ProductDetails from './pages/public/ProductDetails';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Buyer Pages
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerDashboard from './pages/buyer/Dashboard';
import MyOrders from './pages/buyer/MyOrders';
import OrderTracking from './pages/buyer/OrderTracking';
import PaymentHistory from './pages/buyer/PaymentHistory';
import BuyerProfile from './pages/buyer/Profile';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import MyProducts from './pages/farmer/MyProducts';
import AddEditProduct from './pages/farmer/AddEditProduct';
import FarmerOrders from './pages/farmer/FarmerOrders';
import Earnings from './pages/farmer/Earnings';
import FarmerProfile from './pages/farmer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductApprovals from './pages/admin/ProductApprovals';
import ActivityMonitor from './pages/admin/ActivityMonitor';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Analytics from './pages/admin/Analytics';
import PlatformSettings from './pages/admin/PlatformSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Farmer Dashboard Layout */}
            <Route
              path="/farmer"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FarmerDashboard />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="products/new" element={<AddEditProduct />} />
              <Route path="orders" element={<FarmerOrders />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="profile" element={<FarmerProfile />} />
            </Route>

            {/* Buyer Dashboard Layout */}
            <Route
              path="/buyer"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<BuyerDashboard />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="orders/:id" element={<OrderTracking />} />
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="profile" element={<BuyerProfile />} />
            </Route>

            {/* Admin Dashboard Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="approvals" element={<ProductApprovals />} />
              <Route path="activities" element={<ActivityMonitor />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<PlatformSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
