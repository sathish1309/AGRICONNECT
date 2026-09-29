import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Sprout, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Menu, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const cartCount = cartItems.length;

  const handleDemoSwitch = async (role) => {
    setDemoDropdownOpen(false);
    await demoLogin(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'farmer') navigate('/farmer');
    else if (role === 'buyer') navigate('/buyer');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'FARMER') return '/farmer';
    return '/buyer';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
          }}>
            <Sprout size={26} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary-dark)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              Agri<span style={{ color: 'var(--secondary)' }}>Connect</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              DIRECT FARMER MARKETPLACE
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.95rem', color: isActive('/') ? 'var(--primary)' : 'var(--text-main)' }}>
            Home
          </Link>
          <Link to="/marketplace" style={{ fontWeight: 600, fontSize: '0.95rem', color: isActive('/marketplace') ? 'var(--primary)' : 'var(--text-main)' }}>
            Marketplace
          </Link>
          <Link to="/how-it-works" style={{ fontWeight: 600, fontSize: '0.95rem', color: isActive('/how-it-works') ? 'var(--primary)' : 'var(--text-main)' }}>
            How It Works
          </Link>
          <Link to="/about" style={{ fontWeight: 600, fontSize: '0.95rem', color: isActive('/about') ? 'var(--primary)' : 'var(--text-main)' }}>
            Business Model
          </Link>
        </div>

        {/* Right CTA / User State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Demo 1-Click Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}
              title="1-Click Demo Login Switcher"
            >
              <Sparkles size={14} color="#d97706" />
              <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>Demo Login</span>
              <ChevronDown size={14} />
            </button>

            {demoDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                boxShadow: 'var(--shadow-lg)',
                width: '230px',
                padding: '0.5rem',
                zIndex: 200,
              }}>
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid #f1f5f9' }}>
                  INSTANT ROLE SWITCH
                </div>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                  Admin (System Manager)
                </button>
                <button
                  onClick={() => handleDemoSwitch('farmer')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  Farmer (Ravi Kumar)
                </button>
                <button
                  onClick={() => handleDemoSwitch('buyer')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                  Buyer (ABC Supermarket)
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon (Always visible) */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              textDecoration: 'none',
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(217, 119, 6, 0.4)',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Info or Login */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to={getDashboardLink()} className="btn btn-sm btn-primary">
                <LayoutDashboard size={16} />
                <span>Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-sm btn-outline"
                title="Logout"
                style={{ padding: '0.45rem', color: 'var(--danger)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Marketplace</Link>
          <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>How It Works</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Business Model & Rationale</Link>
          {isAuthenticated && (
            <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Open {user.role} Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Responsive helper inline style */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
