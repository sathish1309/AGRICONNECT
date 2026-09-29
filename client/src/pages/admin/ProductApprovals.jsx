import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckSquare, CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';

export default function ProductApprovals() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', { status: 'PENDING' });
      if (res.success && res.products) {
        setPendingProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load pending products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (product) => {
    try {
      const res = await api.put(`/admin/products/${product.id}/approve`);
      if (res.success) {
        setNotice(`Approved "${product.name}"! Listing is now published to the buyer marketplace.`);
        setTimeout(() => setNotice(''), 3500);
        fetchPendingProducts();
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (product) => {
    const reason = window.prompt(
      `Enter reason for rejecting "${product.name}":`,
      'Produce grading specifications do not match marketplace standards'
    );
    if (!reason) return;

    try {
      const res = await api.put(`/admin/products/${product.id}/reject`, { reason });
      if (res.success) {
        setNotice(`Listing for "${product.name}" rejected.`);
        setTimeout(() => setNotice(''), 3500);
        fetchPendingProducts();
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

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
          <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>QUALITY COMPLIANCE</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Product Approval Queue</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review pending farmer submissions before publishing them to the public buyer marketplace.
          </p>
        </div>

        <button onClick={fetchPendingProducts} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {notice && (
        <div style={{
          padding: '0.875rem 1.25rem',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading approval queue...</p>
        ) : pendingProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <CheckCircle2 size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Pending Approvals</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              All submitted farmer crops have been processed and approved for the digital marketplace.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Grower / Farmer</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Selling Price</th>
                  <th>Grade</th>
                  <th>Harvest Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.image_url}
                          alt={p.name}
                          style={{ width: '48px', height: '48px', borderRadius: '0.375rem', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{p.location}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>{p.farmer_name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{p.farmer_city}</span>
                    </td>

                    <td>{p.category_name}</td>

                    <td>
                      <strong>{p.quantity} {p.unit}</strong>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>
                        ₹{p.price_per_unit}/{p.unit}
                      </strong>
                    </td>

                    <td>
                      <span className={`badge ${p.quality_grade === 'Organic' ? 'badge-success' : 'badge-info'}`}>
                        {p.quality_grade || 'Grade A'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem' }}>
                      {p.harvest_date ? new Date(p.harvest_date).toLocaleDateString() : 'Recent'}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(p)}
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(p)}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
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
