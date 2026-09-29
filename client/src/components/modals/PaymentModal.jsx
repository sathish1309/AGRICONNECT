import React, { useState } from 'react';
import api from '../../services/api';
import { CreditCard, QrCode, Building, ShieldCheck, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';

export default function PaymentModal({ order, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('buyer@upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPayable = parseFloat(order.total_amount || 0);

  const handleSimulatePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.post('/payments/verify', {
        orderId: order.id,
        paymentMethod: selectedMethod,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        isDemoMode: true,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(res);
          onClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Razorpay Test Mode Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{
            backgroundColor: '#0369a1',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.04em'
          }}>
            RAZORPAY
          </div>
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
            TEST SANDBOX MODE
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Complete Payment
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Order #{order.order_number} • Total Payable: <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>₹{totalPayable.toFixed(2)}</strong>
        </p>

        {isSuccess ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            backgroundColor: 'var(--primary-50)',
            borderRadius: '0.75rem',
            border: '1px solid var(--primary-light)'
          }}>
            <CheckCircle2 size={44} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Payment Verified Successfully!
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Transaction Reference: TXN-{order.order_number}
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
              Order status updated to: <strong>Payment Confirmed</strong>
            </p>
          </div>
        ) : (
          <div>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Methods */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${selectedMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedMethod === 'UPI' ? 'var(--primary-50)' : '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <QrCode size={20} color={selectedMethod === 'UPI' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${selectedMethod === 'Card' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedMethod === 'Card' ? 'var(--primary-50)' : '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <CreditCard size={20} color={selectedMethod === 'Card' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Net Banking')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${selectedMethod === 'Net Banking' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedMethod === 'Net Banking' ? 'var(--primary-50)' : '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Building size={20} color={selectedMethod === 'Net Banking' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Net Banking</span>
              </button>
            </div>

            {/* Dynamic details based on method */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              {selectedMethod === 'UPI' && (
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okaxis"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Test mode: Any sample VPA is accepted.
                  </span>
                </div>
              )}

              {selectedMethod === 'Card' && (
                <div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Card Number (Test)</label>
                    <input
                      type="text"
                      className="form-input"
                      value="4111 •••• •••• 1111"
                      disabled
                      style={{ backgroundColor: '#f1f5f9' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Expiry</label>
                      <input type="text" className="form-input" value="12/28" disabled style={{ backgroundColor: '#f1f5f9' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>CVV</label>
                      <input type="password" className="form-input" value="•••" disabled style={{ backgroundColor: '#f1f5f9' }} />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'Net Banking' && (
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Bank</label>
                  <select className="form-select" defaultValue="HDFC Bank">
                    <option value="HDFC Bank">HDFC Bank (Sandbox)</option>
                    <option value="State Bank of India">State Bank of India (Sandbox)</option>
                    <option value="ICICI Bank">ICICI Bank (Sandbox)</option>
                    <option value="Axis Bank">Axis Bank (Sandbox)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
              <Lock size={14} color="#059669" />
              <span>PCI-DSS compliant test sandbox. Zero sensitive payment information is stored.</span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${totalPayable.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
