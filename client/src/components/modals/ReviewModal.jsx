import React, { useState } from 'react';
import api from '../../services/api';
import { Star, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ReviewModal({ orderItem, orderId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res = await api.post('/reviews', {
        productId: orderItem.product_id,
        orderId,
        rating,
        comment,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(res);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Rate Product Quality
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          {orderItem.product_name} • Sourced from {orderItem.farmer_name || 'Farmer'}
        </p>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: '0.75rem' }}>
            <CheckCircle2 size={40} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'var(--primary-dark)', fontWeight: 800 }}>Review Submitted!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Thank you for providing quality feedback to empower our farming community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Star selector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ padding: '0.25rem' }}
                  >
                    <Star
                      size={32}
                      color="#fbbf24"
                      fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'}
                    />
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>
                {rating === 5 && 'Outstanding Quality (5 Stars)'}
                {rating === 4 && 'Very Good Quality (4 Stars)'}
                {rating === 3 && 'Average / Acceptable (3 Stars)'}
                {rating === 2 && 'Below Expectations (2 Stars)'}
                {rating === 1 && 'Poor Harvest Quality (1 Star)'}
              </span>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label">Review Comments</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe freshness, packaging, grading accuracy, and delivery condition..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
