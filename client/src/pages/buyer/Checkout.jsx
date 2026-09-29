import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PaymentModal from '../../components/modals/PaymentModal';
import { ShieldCheck, Truck, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { cartItems, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping details state
  const [shippingName, setShippingName] = useState(user?.fullName || '');
  const [shippingMobile, setShippingMobile] = useState(user?.profile?.mobile || '');
  const [shippingAddress, setShippingAddress] = useState(user?.profile?.address || '');
  const [shippingCity, setShippingCity] = useState(user?.profile?.city || 'Chennai');
  const [shippingState, setShippingState] = useState(user?.profile?.state || 'Tamil Nadu');
  const [shippingPincode, setShippingPincode] = useState(user?.profile?.pincode || '600001');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !activePaymentOrder) {
      navigate('/cart');
    }
  }, [cartItems, activePaymentOrder, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!shippingName || !shippingMobile || !shippingAddress || !shippingCity || !shippingState || !shippingPincode) {
      setError('Please provide all required delivery destination details.');
      return;
    }

    try {
      setLoading(true);
      const itemsPayload = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const res = await api.post('/orders', {
        items: itemsPayload,
        shippingName,
        shippingMobile,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPincode,
        notes,
      });

      if (res.success && res.orderId) {
        clearCart();
        // Trigger Razorpay Test Payment Modal
        setActivePaymentOrder({
          id: res.orderId,
          order_number: res.orderNumber,
          total_amount: res.totalAmount,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please review your cart.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentRes) => {
    navigate(`/buyer/orders/${activePaymentOrder.id}`);
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <Link
          to="/cart"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Cart</span>
        </Link>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Checkout & Dispatch Authorization</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Provide procurement shipping destination for farm gate logistics coordination.
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }} className="checkout-grid">
            
            {/* Left: Destination Details */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--primary)" />
                <span>Delivery & Receiving Destination</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Receiving Contact / Business Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={shippingMobile}
                    onChange={(e) => setShippingMobile(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Street Address / Warehouse Dock</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Plot/Door number, Road, Industrial area..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingPincode}
                    onChange={(e) => setShippingPincode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Delivery / Unloading Instructions (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Unload at commercial kitchen entrance before 8:00 AM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Order Summary & Place Order */}
            <div>
              <div className="card" style={{ position: 'sticky', top: '90px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                  Order Review
                </h3>

                {/* Items List snippet */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div>
                        <strong>{item.name}</strong>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                          {item.quantity} {item.unit} × ₹{item.price_per_unit}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(item.quantity * item.price_per_unit).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Produce Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Freight Logistics Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '1.15rem' }}>
                    <strong>Total Payable</strong>
                    <strong style={{ color: 'var(--primary-dark)' }}>₹{totalAmount.toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', height: '46px', fontSize: '1rem' }}
                  disabled={loading}
                >
                  <CreditCard size={18} />
                  <span>{loading ? 'Submitting Order...' : 'Authorize & Pay'}</span>
                </button>

                <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                  <span>Razorpay Test Sandbox integration with instantaneous mock settlement.</span>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Payment Modal */}
        {activePaymentOrder && (
          <PaymentModal
            order={activePaymentOrder}
            onClose={() => navigate(`/buyer/orders/${activePaymentOrder.id}`)}
            onSuccess={handlePaymentSuccess}
          />
        )}

      </div>

      <style>{`
        @media (max-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
