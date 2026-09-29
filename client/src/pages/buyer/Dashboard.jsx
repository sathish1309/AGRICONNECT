import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ShoppingBag, Truck, CreditCard, Store, ArrowRight, Clock, Star, MapPin } from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get('/orders');
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load buyer orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + (o.payment_status === 'PAID' ? parseFloat(o.total_amount) : 0), 0);
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.order_status));
  const completedOrders = orders.filter(o => o.order_status === 'Delivered');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: '1.75rem 2rem',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>BUYER PORTAL</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Hello, {user?.fullName || 'Valued Buyer'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {user?.profile?.business_type || 'Commercial Procurement'} • Direct agricultural dispatch dashboard
          </p>
        </div>

        <Link to="/marketplace" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={18} />
          <span>Browse Fresh Produce</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Shipments</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
              <Truck size={18} />
            </div>
          </div>
          <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>{activeOrders.length}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'block', marginTop: '0.25rem' }}>
            {activeOrders.length > 0 ? 'Produce in preparation / transit' : 'No shipments currently in transit'}
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-hover)' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>{orders.length}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
            {completedOrders.length} completed & delivered
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Procurement Volume</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>₹{totalSpent.toFixed(2)}</strong>
          <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', marginTop: '0.25rem' }}>
            Direct farm procurement savings ~18%
          </span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Procurement Orders</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track lifecycle and transit status from harvest to unloading dock</p>
          </div>
          <Link to="/buyer/orders" className="btn btn-sm btn-outline">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '1rem' }}>You have not placed any agricultural procurement orders yet.</p>
            <Link to="/marketplace" className="btn btn-sm btn-primary">
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
                  const statusColors = {
                    'Delivered': 'badge-success',
                    'Cancelled': 'badge-danger',
                    'Out for Delivery': 'badge-warning',
                    'Ready for Pickup': 'badge-info',
                    'Payment Confirmed': 'badge-info',
                    'Order Placed': 'badge-gray',
                  }[order.order_status] || 'badge-gray';

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)' }}>{order.order_number}</strong>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        {order.items && order.items.length > 0
                          ? order.items.map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ')
                          : 'Produce harvest'}
                      </td>
                      <td>
                        <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${statusColors}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/buyer/orders/${order.id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem' }}>
                          <Truck size={14} />
                          <span>Track</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
