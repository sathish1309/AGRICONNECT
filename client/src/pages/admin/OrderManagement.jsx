import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ShoppingBag, Truck, Search, Eye, RefreshCw } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !search || 
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.buyer_name && o.buyer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.shipping_city && o.shipping_city.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || o.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Platform Orders & Lifecycle</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Supervise end-to-end procurement contracts between commercial buyers and farmers.
          </p>
        </div>

        <button onClick={fetchOrders} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search by order #, buyer, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Payment Confirmed">Payment Confirmed</option>
          <option value="Farmer Confirmed">Farmer Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No orders match the filters.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Buyer Account</th>
                  <th>Harvest Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th>Logistics</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const statusBadge = {
                    'Delivered': 'badge-success',
                    'Cancelled': 'badge-danger',
                    'Out for Delivery': 'badge-warning',
                    'Ready for Pickup': 'badge-info',
                    'Payment Confirmed': 'badge-info',
                    'Order Placed': 'badge-gray',
                  }[o.order_status] || 'badge-gray';

                  return (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{o.order_number}</strong>
                      </td>
                      <td>
                        <strong>{o.buyer_name || 'Buyer'}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{o.buyer_mobile}</span>
                      </td>
                      <td>
                        {o.items && o.items.length > 0 ? (
                          <div style={{ fontSize: '0.8rem' }}>
                            {o.items.map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ')}
                          </div>
                        ) : 'Produce batch'}
                      </td>
                      <td>
                        <strong>₹{parseFloat(o.total_amount).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${o.payment_status === 'PAID' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge}`} style={{ fontSize: '0.7rem' }}>
                          {o.order_status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {o.delivery_status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/buyer/orders/${o.id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}>
                          <Truck size={13} />
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
