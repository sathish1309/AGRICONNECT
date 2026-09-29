import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Sprout, ArrowLeft, AlertCircle, CheckCircle2, Upload } from 'lucide-react';

export default function AddEditProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [location, setLocation] = useState(
    user?.profile ? `${user.profile.village_city}, ${user.profile.state}` : 'Coimbatore, Tamil Nadu'
  );
  const [imageUrl, setImageUrl] = useState('');

  // Default suggested imagery presets
  const sampleImages = [
    { label: 'Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
    { label: 'Red Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80' },
    { label: 'Farm Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80' },
    { label: 'Crisp Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
    { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Ripe Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/products/categories');
        if (res.success && res.categories) {
          setCategories(res.categories);
          if (res.categories.length > 0) {
            setCategoryId(res.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !categoryId || !quantity || !pricePerUnit) {
      setError('Please fill in all mandatory produce fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/products', {
        name,
        categoryId: parseInt(categoryId, 10),
        description,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        harvestDate,
        qualityGrade,
        location,
        imageUrl: imageUrl || sampleImages[0].url,
      });

      if (res.success) {
        navigate('/farmer/products');
      }
    } catch (err) {
      setError(err.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <Link
        to="/farmer/products"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Products</span>
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>List New Agricultural Produce</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Directly submit your harvest to the marketplace. You can update your selling price at any time.
        </p>
      </div>

      <div className="card">
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
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Produce / Crop Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Fresh Red Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Produce Category *</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Cultivation Highlights</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Vine-ripened, naturally cultivated tomatoes handpicked this morning. Ideal for supermarkets and hotels..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Harvest Quantity *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                placeholder="e.g. 150"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure *</label>
              <select
                className="form-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="quintal">quintal (100 kg)</option>
                <option value="ton">ton (1,000 kg)</option>
                <option value="dozen">dozen (Units)</option>
                <option value="box">box (Crates)</option>
                <option value="litre">litre (Liquid/Dairy)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Farmer Selling Price *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  style={{ paddingLeft: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)' }}
                  placeholder="e.g. 30"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Harvest Date</label>
              <input
                type="date"
                className="form-input"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quality / Grade</label>
              <select
                className="form-select"
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
              >
                <option value="Grade A">Grade A (Standard Market)</option>
                <option value="Premium">Premium Export Quality</option>
                <option value="Organic">Certified Organic Produce</option>
                <option value="Grade B">Grade B (Culinary/Processing)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dispatch Origin Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Product Image Selection */}
          <div className="form-group">
            <label className="form-label">Product Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="Paste direct image URL or choose a preset below..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
              Quick Presets:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {sampleImages.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setImageUrl(s.url)}
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div style={{ padding: '0.875rem', backgroundColor: 'var(--primary-50)', borderRadius: '0.5rem', border: '1px solid var(--primary-light)', fontSize: '0.8rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
            <strong>Approval Workflow:</strong> New listings undergo standard compliance verification by Admin before appearing in the buyer marketplace.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Link to="/farmer/products" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting Produce...' : 'Publish Produce Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
