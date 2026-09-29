import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CreditCard, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
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
    }
    fetchPayments();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Payment History & Transactions</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Detailed digital ledger of transactions, payments, and payment methods.
        </p>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No payment transactions recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction Reference</th>
                  <th>Order #</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
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
                    <td>{p.payment_method}</td>
                    <td>
                      <strong>₹{parseFloat(p.amount).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${p.payment_status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                        {p.payment_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.created_at).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
