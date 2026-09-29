import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/cards/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw, X } from 'lucide-react';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [qualityGrade, setQualityGrade] = useState(searchParams.get('grade') || 'ALL');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/products/categories');
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {
          sortBy,
          ...(search ? { search } : {}),
          ...(selectedCategory !== 'ALL' ? { category: selectedCategory } : {}),
          ...(selectedLocation ? { location: selectedLocation } : {}),
          ...(maxPrice ? { maxPrice } : {}),
          ...(qualityGrade !== 'ALL' ? { qualityGrade } : {}),
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
    }
    fetchProducts();
  }, [search, selectedCategory, selectedLocation, maxPrice, qualityGrade, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedLocation('');
    setMaxPrice('');
    setQualityGrade('ALL');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Marketplace Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>DIRECT SOURCING</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Agricultural Marketplace</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Discover fresh harvest listed with transparent dynamic pricing directly from local farmers.
          </p>
        </div>

        {/* Search & Main Controls Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by product (Tomato, Onion) or farmer name..."
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600 }}>
              Sort:
            </span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Farmer Rating</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.15rem' }}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`btn btn-sm ${selectedCategory === c.slug ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px', padding: '0.45rem 1.15rem' }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Layout: Filters Sidebar + Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="marketplace-layout">
          
          {/* Filters Sidebar */}
          <aside style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            padding: '1.5rem',
            height: 'fit-content',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <RefreshCw size={12} />
                Reset
              </button>
            </div>

            {/* Location filter */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Location / Region</label>
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                <option value="Nashik">Nashik, Maharashtra</option>
                <option value="Guntur">Guntur, Andhra Pradesh</option>
                <option value="Chennai">Chennai, Tamil Nadu</option>
                <option value="Bangalore">Bangalore, Karnataka</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
              </select>
            </div>

            {/* Quality Grade filter */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Quality / Grade</label>
              <select
                className="form-select"
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
              >
                <option value="ALL">All Grades</option>
                <option value="Grade A">Grade A (Standard)</option>
                <option value="Premium">Premium Export</option>
                <option value="Organic">Certified Organic</option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Price (₹/unit)</label>
              <input
                type="number"
                placeholder="e.g. 100"
                className="form-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Note badge */}
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--primary-50)', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--primary-dark)', border: '1px solid var(--primary-light)' }}>
              <strong>Farmer-Set Pricing:</strong> All listed prices are updated directly by verified farmers in real-time.
            </div>
          </aside>

          {/* Products Grid */}
          <main>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid var(--border-color)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p>Loading marketplace produce...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  No approved agricultural produce matches your criteria.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try resetting your filters or search keywords.
                </p>
                <button onClick={handleResetFilters} className="btn btn-sm btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing <strong style={{ color: 'var(--text-main)' }}>{products.length}</strong> verified agricultural product{products.length > 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </main>

        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .marketplace-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
