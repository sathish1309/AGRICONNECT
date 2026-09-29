import React, { useState } from 'react';
import api from '../../services/api';
import { IndianRupee, ArrowRight, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function PriceUpdateModal({ product, onClose, onSuccess }) {
  const [newPrice, setNewPrice] = useState(product.price_per_unit || '');
  const [reason, setReason] = useState('Market demand adjustment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid positive price');
      return;
    }

    if (priceNum === parseFloat(product.price_per_unit)) {
      setError('New price must be different from current price');
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/products/${product.id}/price`, {
        newPrice: priceNum,
        reason,
      });

      if (res.success) {
        setSuccessResult(res);
        setTimeout(() => {
          onSuccess(res);
          onClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to update selling price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Adjust Farmer Selling Price
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Dynamic pricing: You decide your market selling price based on current harvest quality, season, and demand.
        </p>

        {successResult ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            backgroundColor: 'var(--primary-50)',
            borderRadius: '0.75rem',
            border: '1px solid var(--primary-light)'
          }}>
            <CheckCircle2 size={42} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Price Updated Successfully!
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              <strong>{product.name}:</strong> ₹{product.price_per_unit}/{product.unit} → <strong style={{ color: 'var(--primary)' }}>₹{newPrice}/{product.unit}</strong>
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Logged automatically to Admin Activity Monitor.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* Product summary card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '56px', height: '56px', borderRadius: '0.375rem', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{product.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current Market Price: <strong style={{ color: 'var(--text-main)' }}>₹{product.price_per_unit}/{product.unit}</strong>
                </div>
              </div>
            </div>

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

            {/* Price Input Comparison */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Price</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{product.price_per_unit}</strong>
              </div>

              <ArrowRight size={20} color="var(--text-muted)" />

              <div style={{ flex: 1 }}>
                <span className="form-label" style={{ fontSize: '0.75rem' }}>New Price (₹/{product.unit})</span>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-dark)' }}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 32"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Price change reason */}
            <div className="form-group">
              <label className="form-label">Reason for Price Adjustment</label>
              <select
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Market demand adjustment">Market demand adjustment</option>
                <option value="Seasonal harvest change">Seasonal harvest change</option>
                <option value="Enhanced premium grade selection">Enhanced premium grade selection</option>
                <option value="Direct bulk procurement incentive">Direct bulk procurement incentive</option>
                <option value="Mandi benchmark alignment">Mandi benchmark alignment</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating Price...' : 'Confirm Price Change'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
