import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Trash2, ArrowRight, Store, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, totalAmount } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <ShoppingCart size={36} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Procurement Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
          Explore our agricultural marketplace to source directly from verified farmers at transparent grower-set prices.
        </p>
        <Link to="/marketplace" className="btn btn-primary">
          <Store size={18} />
          <span>Browse Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container">
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem' }}>Procurement Cart</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review bulk farm produce before dispatch authorization.</p>
          </div>
          <button
            onClick={clearCart}
            style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }} className="cart-grid">
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Produce image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }}
                />

                {/* Details */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    <Link to={`/products/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Farmer: <strong style={{ color: 'var(--text-main)' }}>{item.farmer_name}</strong> • {item.location}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    ₹{item.price_per_unit} / {item.unit}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: '#ffffff' }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.4rem 0.75rem', fontWeight: 700, minWidth: '40px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Subtotal</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                    ₹{(item.price_per_unit * item.quantity).toFixed(2)}
                  </strong>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: '#94a3b8', padding: '0.4rem', cursor: 'pointer' }}
                  title="Remove item"
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Procurement Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Produce Subtotal</span>
                  <strong>₹{subtotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Standard Delivery Logistics</span>
                  <strong>₹{deliveryFee.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '1.15rem' }}>
                  <strong>Total Amount</strong>
                  <strong style={{ color: 'var(--primary-dark)' }}>₹{totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '1rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span>Escrow Guarantee: Payment released only after delivery confirmation.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
