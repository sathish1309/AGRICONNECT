import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { MapPin, Calendar, Star, CheckCircle2, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } else {
      alert(res.message);
    }
  };

  const formattedDate = product.harvest_date
    ? new Date(product.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent';

  return (
    <div className="card" style={{
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Product Image */}
      <div style={{ position: 'relative', height: '190px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Quality / Grade Badge */}
        <span
          className={`badge ${product.quality_grade === 'Organic' ? 'badge-success' : 'badge-info'}`}
          style={{ position: 'absolute', top: '10px', left: '10px', backdropFilter: 'blur(4px)' }}
        >
          {product.quality_grade || 'Grade A'}
        </span>

        {/* Farmer Rating */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#ffffff',
          borderRadius: '9999px',
          padding: '0.2rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          backdropFilter: 'blur(4px)'
        }}>
          <Star size={12} color="#fbbf24" fill="#fbbf24" />
          <span>{parseFloat(product.farmer_rating || 5.0).toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Category & Location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--primary)' }}>
            {product.category_name || 'Produce'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <MapPin size={12} />
            {product.location ? product.location.split(',')[0] : 'Farm direct'}
          </span>
        </div>

        {/* Product Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.name}
          </Link>
        </h3>

        {/* Farmer Name */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Farmer:</span>
          <strong style={{ color: 'var(--text-main)' }}>{product.farmer_name || 'Verified Grower'}</strong>
          {product.farmer_verified && <CheckCircle2 size={14} color="#059669" />}
        </p>

        {/* Harvest Date & Stock Info */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          padding: '0.6rem 0.75rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Available</span>
            <strong>{product.quantity} {product.unit}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Harvest Date</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Farmer Price</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{product.price_per_unit}
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                /{product.unit}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/products/${product.id}`}
              className="btn btn-sm btn-outline"
              title="View Details"
              style={{ padding: '0.5rem' }}
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={handleAddToCart}
              className="btn btn-sm btn-primary"
              disabled={parseFloat(product.quantity) <= 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ShoppingCart size={15} />
              <span>{addedNotice ? 'Added!' : 'Add'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
