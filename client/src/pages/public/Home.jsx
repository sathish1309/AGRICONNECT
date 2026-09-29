import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/cards/ProductCard';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  CheckCircle, 
  Store, 
  Building2, 
  Users, 
  DollarSign, 
  Percent, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products');
        if (res.success && res.products) {
          setFeaturedProducts(res.products.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
        color: '#ffffff',
        padding: '5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)',
            }}>
              <Sparkles size={16} color="#fbbf24" />
              <span>Technology-Driven Farmer-to-Buyer Marketplace</span>
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.025em',
            }}>
              Connecting Farmers <span style={{ color: '#fcd34d' }}>Directly With Buyers</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#d1fae5',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              fontWeight: 400,
            }}>
              Buy fresh agricultural products directly from farmers through a simple and transparent digital marketplace. Eliminating predatory intermediaries to empower growers and save buyers money.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/marketplace" className="btn btn-lg btn-secondary" style={{ boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)' }}>
                <Store size={20} />
                <span>Explore Products</span>
              </Link>
              <Link to="/register" className="btn btn-lg btn-outline" style={{ backgroundColor: '#ffffff', color: 'var(--primary-dark)', borderColor: '#ffffff' }}>
                <span>Join AgriConnect</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Quick Stats banner */}
            <div style={{
              marginTop: '4rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <div>
                <strong style={{ fontSize: '1.8rem', display: 'block', fontWeight: 800 }}>100% Direct</strong>
                <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Disintermediated Mandi Sourcing</span>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <strong style={{ fontSize: '1.8rem', display: 'block', fontWeight: 800 }}>Dynamic</strong>
                <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Farmer-Set Fair Pricing</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.8rem', display: 'block', fontWeight: 800 }}>Verified</strong>
                <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Admin Quality Inspection</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY AGRICONNECT? */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>STARTUP PROBLEM & SOLUTION</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Why AgriConnect?</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Traditional agricultural supply chains trap farmers with 3 to 5 middlemen, shaving off up to 55% of the produce value before reaching buyers. AgriConnect replaces this broken model with a digital direct marketplace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
                <DollarSign size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Fair Realized Farmer Prices</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Farmers set their own selling prices dynamically based on market reality rather than accepting forced distressed sales from local brokers.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-hover)', marginBottom: '1.25rem' }}>
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Bulk Commercial Procurement</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Supermarkets, restaurants, hotels, and retail stores can source bulk Grade A produce with transparent specifications and farm origin traceability.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--info)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', marginBottom: '1.25rem' }}>
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Integrated Logistics & Map Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Seamless pickup from the farm gate and coordinated dispatch to the buyer's destination with real-time route visualization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>FARM FRESH HARVEST</span>
              <h2 style={{ fontSize: '2.2rem' }}>Featured Agricultural Products</h2>
              <p style={{ color: 'var(--text-muted)' }}>Directly harvested and price-set by verified growers.</p>
            </div>
            <Link to="/marketplace" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading fresh produce...
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>STREAMLINED TRANSACTION</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>How AgriConnect Operates</h2>
            <p style={{ color: 'var(--text-muted)' }}>A transparent 4-stage workflow linking soil to store.</p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Farmer Lists Produce</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Farmer registers, specifies harvest quantity, quality grade, and sets current dynamic selling price.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Admin Quality Review</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Admin verifies farmer credentials, specifications, and approves produce for public marketplace discovery.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Buyer Order & Escrow</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Buyer adds items to cart, checks out, and initiates test payment via UPI, Card, or Net Banking.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem', fontWeight: 800 }}>
                4
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Dispatch & Settlement</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Farmer prepares crates, logistics dispatches to buyer with map tracking, and payout is settled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STARTUP BUSINESS MODEL SECTION (Entrepreneurship Subject Requirement) */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: '#0f172a',
        color: '#ffffff',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
              ENTREPRENEURSHIP & STARTUPS THESIS
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.85rem' }}>
              The AgriConnect Business Model
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
              Demonstrating a scalable, high-margin, technology-driven platform business model designed to disrupt traditional mandi supply chain frictions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8" style={{ marginBottom: '3rem' }}>
            
            {/* Value Proposition */}
            <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '1rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={22} color="#ffffff" />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '1.25rem' }}>Value Proposition</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Direct farmer-to-buyer connectivity with dynamic farmer-controlled pricing, verified product grading, and convenient digital escrow settlement.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <strong>For Farmers:</strong> +20% to 35% higher realized revenue; zero commission listing fees.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <strong>For Commercial Buyers:</strong> 15% lower procurement costs with guaranteed farm freshness.
                </li>
              </ul>
            </div>

            {/* Revenue Engine */}
            <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '1rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Percent size={22} color="#ffffff" />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '1.25rem' }}>4-Stream Revenue Engine</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#cbd5e1' }}>1. Platform Transaction Commission</span>
                  <strong style={{ color: '#fcd34d' }}>2% – 5% (Configurable)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#cbd5e1' }}>2. Logistics & Delivery Surcharge</span>
                  <strong style={{ color: '#fcd34d' }}>₹50 base fee + distance</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#cbd5e1' }}>3. Enterprise Buyer Subscriptions</span>
                  <strong style={{ color: '#fcd34d' }}>B2B recurring monthly tier</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#cbd5e1' }}>4. Sponsored Featured Listings</span>
                  <strong style={{ color: '#fcd34d' }}>Priority placement in search</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Target Customers */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>
              PLATFORM TARGET SEGMENTS
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {['Farmers & Farmer Producer Orgs (FPOs)', 'Retailers & Kirana Stores', 'Supermarket Chains', 'Hotels & Caterers', 'Restaurants & Cafes', 'Wholesale Distributors', 'Household Bulk Buyers'].map((s) => (
                <span
                  key={s}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--primary-50)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Ready to Experience the Direct Farm Marketplace?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Explore verified produce listings or test the farmer dynamic pricing and admin activity monitor in our fully functional demonstration.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/marketplace" className="btn btn-lg btn-primary">
              Browse Marketplace
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline" style={{ backgroundColor: '#ffffff' }}>
              Log in with Demo Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
