import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import {
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  ShoppingCart,
  ArrowLeft,
  Clock,
  ShieldCheck,
  TrendingUp,
  User,
  AlertTriangle,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.success && res.product) {
          setProduct(res.product);
          setReviews(res.reviews || []);
          setPriceHistory(res.priceHistory || []);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setErrorNotice('');
    if (quantity > product.quantity) {
      setErrorNotice(`Only ${product.quantity} ${product.unit} available in current farm stock.`);
      return;
    }

    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    } else {
      setErrorNotice(res.message);
    }
  };

  const handleBuyNow = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      navigate('/cart');
    } else {
      setErrorNotice(res.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This agricultural produce is no longer available.</p>
        <Link to="/marketplace" className="btn btn-primary">Return to Marketplace</Link>
      </div>
    );
  }

  const formattedHarvest = product.harvest_date
    ? new Date(product.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recent harvest';

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container">
        
        {/* Back Link */}
        <Link
          to="/marketplace"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>

        {/* Product Hero Split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '3rem',
        }} className="product-details-grid">
          
          {/* Left: Product Image & Badges */}
          <div>
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              height: '380px',
              backgroundColor: '#f1f5f9',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                className={`badge ${product.quality_grade === 'Organic' ? 'badge-success' : 'badge-info'}`}
                style={{ position: 'absolute', top: '14px', left: '14px', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
              >
                {product.quality_grade || 'Grade A'}
              </span>
            </div>

            {/* Quality assurance notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '1.25rem',
              padding: '0.875rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span>Admin Verified Harvest: Graded for freshness and weight accuracy prior to dispatch.</span>
            </div>
          </div>

          {/* Right: Specifications & Pricing */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Category & Location */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                {product.category_name}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} />
                {product.location}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Farmer Tag & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cultivated by:</span>
                <strong style={{ color: 'var(--text-main)' }}>{product.farmer_name}</strong>
                {product.farmer_verified && <CheckCircle2 size={16} color="var(--primary)" />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, color: '#b45309' }}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span>{parseFloat(product.farmer_rating || 5.0).toFixed(1)}</span>
                <span style={{ fontWeight: 400, color: '#78350f' }}>({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Farmer-Set Dynamic Price Callout */}
            <div style={{
              backgroundColor: 'var(--primary-50)',
              border: '1px solid var(--primary-light)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)', display: 'block' }}>
                  CURRENT FARMER-SET PRICE
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>
                  ₹{product.price_per_unit}
                  <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {' '}/ {product.unit}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stock Available</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {product.quantity} {product.unit}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description || 'Farm-fresh crop handpicked directly from grower orchards and fields. No artificial preservatives or chemical ripening agents used.'}
            </p>

            {/* Harvest Date & Specifications Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1.75rem',
              fontSize: '0.85rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Harvest Date</span>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} color="var(--primary)" />
                  {formattedHarvest}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Grading Standard</span>
                <strong>{product.quality_grade || 'Grade A'}</strong>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ marginTop: 'auto' }}>
              {errorNotice && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <AlertTriangle size={16} />
                  <span>{errorNotice}</span>
                </div>
              )}

              {addedNotice && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <CheckCircle2 size={16} />
                  <span>Added {quantity} {product.unit} to your cart!</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: '#ffffff' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.65rem 1rem', fontWeight: 700, minWidth: '45px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-outline"
                  style={{ flex: 1, height: '44px' }}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '44px' }}
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. DYNAMIC PRICING AUDIT & REVIEWS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="product-split-bottom">
          
          {/* Dynamic Price History Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <TrendingUp size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Farmer Pricing History</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Transparent record of price adjustments made by the grower based on market factors.
            </p>

            {priceHistory.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No prior price revisions. Currently selling at original listing price (₹{product.price_per_unit}/{product.unit}).
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {priceHistory.map((ph) => (
                  <div
                    key={ph.id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                        ₹{ph.old_price} → ₹{ph.new_price} / {product.unit}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ph.reason || 'Farmer market adjustment'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(ph.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews & Quality Ratings */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Buyer Ratings & Reviews ({reviews.length})</h3>
            </div>

            {reviews.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No buyer reviews yet. Be the first commercial buyer to rate this produce after delivery.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.85rem' }}>{r.buyer_name} ({r.buyer_city || 'Buyer'})</strong>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={13} color="#f59e0b" fill="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                      "{r.comment}"
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .product-details-grid {
            grid-template-columns: 1fr !important;
          }
          .product-split-bottom {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
