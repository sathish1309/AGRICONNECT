import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PriceUpdateModal from '../../components/modals/PriceUpdateModal';
import { 
  Package, 
  PlusCircle, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function MyProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForPrice, setSelectedProductForPrice] = useState(null);
  const [notice, setNotice] = useState('');

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      const farmerId = user?.profileId || user?.profile?.id || 1;
      const res = await api.get('/products', { farmerId });
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load farmer products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProducts();
  }, [user]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your active marketplace listings?`)) {
      return;
    }
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.success) {
        setNotice(`Product "${name}" removed from marketplace.`);
        setTimeout(() => setNotice(''), 3000);
        fetchFarmerProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to remove product');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const newAvailability = product.is_available ? 0 : 1;
      const res = await api.put(`/products/${product.id}`, {
        isAvailable: newAvailability,
      });
      if (res.success) {
        fetchFarmerProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle availability');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            My Agricultural Produce
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage listings, adjust dynamic selling prices, and track admin verification status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchFarmerProducts} className="btn btn-outline" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <Link to="/farmer/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} />
            <span>Add New Produce</span>
          </Link>
        </div>
      </div>

      {notice && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading your farm produce...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listed Produce</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You haven't added any crops or harvest items to your catalog yet.
            </p>
            <Link to="/farmer/products/new" className="btn btn-primary">
              List First Produce
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock Available</th>
                  <th>Current Selling Price</th>
                  <th>Quality Grade</th>
                  <th>Admin Status</th>
                  <th>Availability</th>
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
                            style={{ width: '48px', height: '48px', borderRadius: '0.375rem', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{p.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              Harvested: {p.harvest_date ? new Date(p.harvest_date).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{p.category_name}</td>

                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{p.quantity} {p.unit}</strong>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>
                            ₹{p.price_per_unit}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{p.unit}</span>
                          <button
                            onClick={() => setSelectedProductForPrice(p)}
                            className="btn btn-sm btn-secondary"
                            title="Adjust Dynamic Price"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            <TrendingUp size={12} />
                            <span>Change</span>
                          </button>
                        </div>
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
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p)}
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: p.is_available ? '#dcfce7' : '#fee2e2',
                            color: p.is_available ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {p.is_available ? 'In Stock' : 'Paused'}
                        </button>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <Link to={`/products/${p.id}`} className="btn btn-sm btn-outline" title="Public View" style={{ padding: '0.35rem' }}>
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="btn btn-sm btn-outline"
                            title="Remove Produce"
                            style={{ padding: '0.35rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Dynamic Price Modal */}
      {selectedProductForPrice && (
        <PriceUpdateModal
          product={selectedProductForPrice}
          onClose={() => setSelectedProductForPrice(null)}
          onSuccess={() => {
            setSelectedProductForPrice(null);
            fetchFarmerProducts();
          }}
        />
      )}
    </div>
  );
}
