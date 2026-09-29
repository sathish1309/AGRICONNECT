import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CreditCard, IndianRupee, Percent, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      if (res.success && res.payments) {
        setPayments(res.payments);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalVolume = payments.reduce((sum, p) => sum + (p.payment_status === 'SUCCESS' ? parseFloat(p.amount) : 0), 0);
  const totalCommission = totalVolume * 0.035; // 3.5%
  const successfulTxns = payments.filter(p => p.payment_status === 'SUCCESS').length;

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
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Platform Payment & Commission Ledger</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Audit gross transactional throughput, payment gateways, and startup commission revenues.
          </p>
        </div>

        <button onClick={fetchPayments} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Transaction Volume</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)', display: 'block', margin: '0.4rem 0' }}>
            ₹{totalVolume.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{successfulTxns} successful transactions</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #dc2626', backgroundColor: '#fef2f2' }}>
          <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 700 }}>Total Platform Commission</span>
          <strong style={{ fontSize: '1.8rem', color: '#b91c1c', display: 'block', margin: '0.4rem 0' }}>
            ₹{totalCommission.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#991b1b' }}>Accumulated at 3.5% default rate</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Farmer Net Settlements</span>
          <strong style={{ fontSize: '1.8rem', color: '#15803d', display: 'block', margin: '0.4rem 0' }}>
            ₹{(totalVolume - totalCommission).toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#15803d' }}>Disbursed to grower bank accounts</span>
        </div>

      </div>

      {/* Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          Payment Transactions
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading ledger...</p>
        ) : payments.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No payment transactions recorded.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction Reference</th>
                  <th>Order #</th>
                  <th>Buyer Account</th>
                  <th>Amount</th>
                  <th>Platform Fee</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const fee = parseFloat(p.amount) * 0.035;

                  return (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                          {p.transaction_ref || `TXN-AGRI-${p.id}`}
                        </strong>
                      </td>
                      <td>
                        <Link to={`/buyer/orders/${p.order_id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {p.order_number || `Order #${p.order_id}`}
                        </Link>
                      </td>
                      <td>
                        <strong>{p.buyer_name || 'Buyer'}</strong>
                      </td>
                      <td>
                        <strong>₹{parseFloat(p.amount).toFixed(2)}</strong>
                      </td>
                      <td style={{ color: '#b91c1c', fontWeight: 600 }}>
                        +₹{fee.toFixed(2)}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{p.payment_method}</span>
                      </td>
                      <td>
                        <span className={`badge ${p.payment_status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(p.created_at).toLocaleString()}
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
