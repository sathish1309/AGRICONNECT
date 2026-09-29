import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { IndianRupee, TrendingUp, Percent, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Earnings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders for earnings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Compute farmer-specific earnings
  const paidOrders = orders.filter(o => o.payment_status === 'PAID');
  
  const grossTotal = paidOrders.reduce((sum, o) => {
    const itemsTotal = (o.items || []).reduce((iSum, item) => iSum + parseFloat(item.subtotal || 0), 0);
    return sum + itemsTotal;
  }, 0);

  const commissionRate = 3.5; // Platform Commission %
  const commissionAmount = (grossTotal * commissionRate) / 100;
  const netEarnings = grossTotal - commissionAmount;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Earnings & Financial Settlements
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Transparent financial breakdown of gross produce turnover, platform commission deductions, and net payouts.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Produce Turnover</span>
          <strong style={{ fontSize: '1.9rem', color: 'var(--text-main)', display: 'block', margin: '0.4rem 0' }}>
            ₹{grossTotal.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total volume ordered across {paidOrders.length} commercial batches
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Commission (3.5%)</span>
          <strong style={{ fontSize: '1.9rem', color: 'var(--secondary)', display: 'block', margin: '0.4rem 0' }}>
            ₹{commissionAmount.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Transparent service fee funding logistics & buyer verification
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Farmer Realization</span>
          <strong style={{ fontSize: '1.9rem', color: '#15803d', display: 'block', margin: '0.4rem 0' }}>
            ₹{netEarnings.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
            +28% higher than typical physical mandi broker payouts
          </span>
        </div>

      </div>

      {/* Settlements Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          Batch Settlement History
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading settlement history...</p>
        ) : paidOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No settled transactions yet. Once orders are paid and fulfilled, settlements appear here.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Buyer</th>
                  <th>Order Date</th>
                  <th>Gross Produce</th>
                  <th>Platform Fee (3.5%)</th>
                  <th>Net Farmer Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders.map((o) => {
                  const itemsGross = (o.items || []).reduce((s, i) => s + parseFloat(i.subtotal || 0), 0);
                  const fee = (itemsGross * 0.035);
                  const net = itemsGross - fee;

                  return (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)' }}>{o.order_number}</strong>
                      </td>
                      <td>{o.buyer_name || 'Commercial Buyer'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <strong>₹{itemsGross.toFixed(2)}</strong>
                      </td>
                      <td style={{ color: 'var(--secondary)' }}>
                        -₹{fee.toFixed(2)}
                      </td>
                      <td>
                        <strong style={{ color: '#15803d', fontSize: '1rem' }}>
                          ₹{net.toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          Settled
                        </span>
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
