import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Database, Award, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      borderTop: '1px solid #1e293b',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Sprout size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Agri<span style={{ color: 'var(--secondary)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1rem' }}>
              A technology-driven digital farmer-to-buyer marketplace connecting growers directly with retailers, restaurants, and consumers.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                Direct Sourcing
              </span>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                Zero Middlemen
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/marketplace" style={{ color: '#94a3b8' }}>Fresh Vegetables</Link></li>
              <li><Link to="/marketplace?category=fruits" style={{ color: '#94a3b8' }}>Orchard Fruits</Link></li>
              <li><Link to="/marketplace?category=grains" style={{ color: '#94a3b8' }}>Staple Grains & Rice</Link></li>
              <li><Link to="/marketplace?category=spices" style={{ color: '#94a3b8' }}>Pure Spices</Link></li>
              <li><Link to="/how-it-works" style={{ color: '#94a3b8' }}>How Ordering Works</Link></li>
            </ul>
          </div>

          {/* Business & Startup Rationale */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Business Model
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/about#value-prop" style={{ color: '#94a3b8' }}>Value Proposition</Link></li>
              <li><Link to="/about#revenue" style={{ color: '#94a3b8' }}>Commission Structure (3.5%)</Link></li>
              <li><Link to="/about#target-market" style={{ color: '#94a3b8' }}>Commercial Buyers & Retailers</Link></li>
              <li><Link to="/about#pricing" style={{ color: '#94a3b8' }}>Dynamic Farmer Pricing</Link></li>
              <li><Link to="/about#transparency" style={{ color: '#94a3b8' }}>Marketplace Transparency</Link></li>
            </ul>
          </div>

          {/* Academic Project Context */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Academic Project Info
            </h4>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              border: '1px solid #334155'
            }}>
              <p style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>B.Tech Information Technology</p>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Subject: Entrepreneurship and Startups</p>
              <div style={{ borderTop: '1px solid #334155', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ color: '#38bdf8' }}>• React.js + Node.js + Express.js</span>
                <span style={{ color: '#38bdf8' }}>• MySQL Relational Database</span>
                <span style={{ color: '#38bdf8' }}>• Razorpay Test Mode & Maps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} AgriConnect Marketplace. Academic Startup Demonstration Project.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Verified Role-Based Access (Farmer / Buyer / Admin)</span>
            <span>Real Automatic Audit Logging</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
