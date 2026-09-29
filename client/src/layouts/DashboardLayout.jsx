import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  IndianRupee,
  User,
  Users,
  CheckSquare,
  Activity,
  BarChart3,
  Sliders,
  LogOut,
  Store,
  CreditCard,
  Menu,
  X,
  Sprout,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'BUYER';

  // Navigation Items per Role
  const getNavItems = () => {
    if (role === 'FARMER') {
      return [
        { label: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
        { label: 'My Products', path: '/farmer/products', icon: Package },
        { label: 'Add Product', path: '/farmer/products/new', icon: PlusCircle },
        { label: 'Orders Received', path: '/farmer/orders', icon: ShoppingBag },
        { label: 'Earnings & Payouts', path: '/farmer/earnings', icon: IndianRupee },
        { label: 'Farm Profile', path: '/farmer/profile', icon: User },
      ];
    } else if (role === 'ADMIN') {
      return [
        { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
        { label: 'Product Approvals', path: '/admin/approvals', icon: CheckSquare },
        { label: 'Activity Monitor', path: '/admin/activities', icon: Activity, badge: 'CORE' },
        { label: 'User Directory', path: '/admin/users', icon: Users },
        { label: 'All Products', path: '/admin/products', icon: Package },
        { label: 'Platform Orders', path: '/admin/orders', icon: ShoppingBag },
        { label: 'Payment Ledger', path: '/admin/payments', icon: CreditCard },
        { label: 'Business Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Platform Settings', path: '/admin/settings', icon: Sliders },
      ];
    } else {
      // BUYER
      return [
        { label: 'Buyer Dashboard', path: '/buyer', icon: LayoutDashboard },
        { label: 'Browse Marketplace', path: '/marketplace', icon: Store },
        { label: 'My Orders', path: '/buyer/orders', icon: ShoppingBag },
        { label: 'Payment History', path: '/buyer/payments', icon: CreditCard },
        { label: 'My Profile', path: '/buyer/profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleTheme = {
    ADMIN: { badge: 'badge-danger', title: 'System Administrator' },
    FARMER: { badge: 'badge-success', title: 'Farmer Partner' },
    BUYER: { badge: 'badge-info', title: 'Commercial Buyer' },
  }[role] || { badge: 'badge-gray', title: 'User' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 90 }}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Sprout size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)' }}>AgriConnect</span>
              <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)', fontWeight: 700 }}>
                {role} CONSOLE
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="mobile-close" style={{ display: 'none', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.fullName || 'User'}
              </h4>
              <span className={`badge ${roleTheme.badge}`} style={{ fontSize: '0.65rem' }}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : 'var(--text-main)',
                  backgroundColor: active ? 'var(--primary)' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={active ? '#ffffff' : '#64748b'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#fee2e2',
                    color: active ? '#ffffff' : '#dc2626',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/marketplace"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.875rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              borderRadius: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <Store size={16} />
            <span>Open Marketplace</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.875rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--danger)',
              borderRadius: '0.5rem',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dashboard-main">
        
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 80,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-sidebar-toggle"
              style={{ display: 'none', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }}
            >
              <Menu size={20} />
            </button>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>AgriConnect</span>
              <ChevronRight size={14} />
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{role}</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {navItems.find(i => i.path === location.pathname)?.label || 'Console'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/marketplace" className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem' }}>
              <Store size={14} />
              <span>Public Store</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0 !important;
          }
          .mobile-sidebar-toggle {
            display: block !important;
          }
          .mobile-close {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
