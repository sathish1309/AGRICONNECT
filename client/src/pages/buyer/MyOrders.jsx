import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ReviewModal from '../../components/modals/ReviewModal';
import { ShoppingBag, Truck, Star, Eye, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>My Orders & Shipments</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review commercial orders, track logistics milestones, and submit farmer quality reviews.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading your procurement orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You have not placed any orders yet. Visit our marketplace to procure fresh farm produce.
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const statusBadge = {
              'Delivered': 'badge-success',
              'Cancelled': 'badge-danger',
              'Out for Delivery': 'badge-warning',
              'Ready for Pickup': 'badge-info',
              'Payment Confirmed': 'badge-info',
              'Order Placed': 'badge-gray',
            }[order.order_status] || 'badge-gray';

            return (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                
                {/* Order Top Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ORDER NUMBER</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary-dark)' }}>{order.order_number}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>DATE PLACED</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span className={`badge ${statusBadge}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.items && order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            style={{ width: '48px', height: '48px', borderRadius: '0.375rem', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{item.product_name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                            Farmer: {item.farmer_name || 'Grower'} • {item.quantity} {item.unit} @ ₹{item.unit_price}/{item.unit}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700 }}>₹{parseFloat(item.subtotal).toFixed(2)}</span>

                        {/* Review Button for Delivered Orders */}
                        {order.order_status === 'Delivered' && (
                          <button
                            onClick={() => setSelectedItemForReview({ item, orderId: order.id })}
                            className="btn btn-sm btn-outline"
                            style={{ fontSize: '0.75rem', borderColor: '#f59e0b', color: '#b45309' }}
                          >
                            <Star size={13} color="#f59e0b" fill="#f59e0b" />
                            <span>Rate Produce</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} />
                    <span>Destination: {order.shipping_city}, {order.shipping_state} ({order.shipping_pincode})</span>
                  </div>

                  <Link to={`/buyer/orders/${order.id}`} className="btn btn-sm btn-primary">
                    <Truck size={15} />
                    <span>Track Shipment & Map</span>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedItemForReview && (
        <ReviewModal
          orderItem={selectedItemForReview.item}
          orderId={selectedItemForReview.orderId}
          onClose={() => setSelectedItemForReview(null)}
          onSuccess={() => {
            setSelectedItemForReview(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
