import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShoppingBag, CheckCircle, Clock, Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load farmer orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.success) {
        setNotice(`Order status updated to "${newStatus}"! Logged automatically to Activity Monitor.`);
        setTimeout(() => setNotice(''), 3000);
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Orders Received
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review purchase requests from supermarkets, restaurants, and retail buyers. Confirm availability and stage produce for logistics collection.
        </p>
      </div>

      {notice && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Received Orders</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            When buyers place orders for your produce, they will appear here with fulfillment controls.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const statusBadge = {
              'Delivered': 'badge-success',
              'Cancelled': 'badge-danger',
              'Out for Delivery': 'badge-warning',
              'Ready for Pickup': 'badge-info',
              'Farmer Confirmed': 'badge-info',
              'Preparing': 'badge-warning',
              'Payment Confirmed': 'badge-info',
              'Order Placed': 'badge-gray',
            }[order.order_status] || 'badge-gray';

            return (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ORDER NUMBER</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{order.order_number}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>BUYER</span>
                      <strong style={{ fontSize: '0.9rem' }}>{order.buyer_name || 'Commercial Buyer'}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {order.buyer_business_type || 'Supermarket'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ORDER DATE</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <span className={`badge ${statusBadge}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Produce Items Requested */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.items && order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            style={{ width: '44px', height: '44px', borderRadius: '0.375rem', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <strong>{item.product_name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                            Volume: <strong>{item.quantity} {item.unit}</strong> @ ₹{item.unit_price}/{item.unit}
                          </span>
                        </div>
                      </div>

                      <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>
                        ₹{parseFloat(item.subtotal).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Delivery Location: <strong>{order.shipping_city}, {order.shipping_state}</strong></span>
                  </div>

                  {/* Progressive Farmer Status Controls */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.order_status === 'Payment Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Farmer Confirmed')}
                        className="btn btn-sm btn-primary"
                      >
                        <CheckCircle size={14} />
                        <span>Confirm Order Availability</span>
                      </button>
                    )}

                    {order.order_status === 'Farmer Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                        className="btn btn-sm btn-warning"
                        style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}
                      >
                        <Clock size={14} />
                        <span>Mark as Preparing / Packing</span>
                      </button>
                    )}

                    {order.order_status === 'Preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Ready for Pickup')}
                        className="btn btn-sm btn-primary"
                      >
                        <Truck size={14} />
                        <span>Ready for Logistics Pickup</span>
                      </button>
                    )}

                    {['Ready for Pickup', 'Out for Delivery', 'Delivered'].includes(order.order_status) && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Logistics Handled by AgriConnect Freight</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
