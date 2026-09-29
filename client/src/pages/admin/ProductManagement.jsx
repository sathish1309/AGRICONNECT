import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, Search, Trash2, Eye, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      };
      const res = await api.get('/products', params);
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const handleRemove = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}" from the marketplace?`)) {
      return;
    }
    try {
      const res = await api.delete(`/products/${product.id}`);
      if (res.success) {
        fetchProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to remove product');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Platform Product Catalog</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Comprehensive directory of agricultural crop listings across all participating farmers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search produce name or farmer..."
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
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending Review</option>
          <option value="REJECTED">Rejected</option>
          <option value="REMOVED">Removed</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading catalog...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No products found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Farmer</th>
                  <th>Category</th>
                  <th>Available Stock</th>
                  <th>Current Price</th>
                  <th>Quality Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const statusBadge = {
                    'APPROVED': 'badge-success',
                    'PENDING': 'badge-warning',
                    'REJECTED': 'badge-danger',
                    'REMOVED': 'badge-gray',
                  }[p.status] || 'badge-gray';

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.image_url}
                            alt={p.name}
                            style={{ width: '40px', height: '40px', borderRadius: '0.375rem', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
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
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                          ₹{p.price_per_unit}/{p.unit}
                        </strong>
                      </td>

                      <td>
                        <span className={`badge ${p.quality_grade === 'Organic' ? 'badge-success' : 'badge-info'}`}>
                          {p.quality_grade || 'Grade A'}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${statusBadge}`}>
                          {p.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <Link to={`/products/${p.id}`} className="btn btn-sm btn-outline" title="View details" style={{ padding: '0.35rem' }}>
                            <Eye size={14} />
                          </Link>
                          {p.status !== 'REMOVED' && (
                            <button
                              onClick={() => handleRemove(p)}
                              className="btn btn-sm btn-outline"
                              title="Remove listing"
                              style={{ padding: '0.35rem', color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
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
