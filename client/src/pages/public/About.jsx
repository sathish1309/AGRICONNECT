import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Users, 
  Layers, 
  Database, 
  ArrowRight,
  Target,
  CheckCircle2
} from 'lucide-react';

export default function About() {
  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Academic Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
            ENTREPRENEURSHIP & STARTUPS • B.TECH IT
          </span>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '0.75rem' }}>
            AgriConnect: Academic Startup Blueprint
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
            A technology-driven digital marketplace addressing structural market inefficiencies in agricultural product procurement and farmer income realization.
          </p>
        </div>

        {/* 1. Problem Statement */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={22} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>1. The Real-World Agricultural Problem</h2>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
            In traditional Indian agricultural markets, small and medium farmers sell their harvest at physical mandis where pricing is determined by commission agents (artiyas) and layers of middlemen. As a result:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#334155', fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>Depressed Farmer Realization:</strong> Farmers often receive as little as 30% to 45% of the final consumer price.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>Commercial Buyer Inflation:</strong> Supermarkets, restaurants, and retail stores pay heavy middleman markups for produce that has degraded over 3–5 days of delayed transit.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
              <span><strong>Lack of Direct Relationship:</strong> Farmers have no direct communication or demand feedback from bulk commercial buyers.</span>
            </li>
          </ul>
        </div>

        {/* 2. Startup Opportunity & Value Proposition */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>2. Technology-Driven Business Opportunity</h2>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
            AgriConnect creates a <strong>disintermediated B2B/B2C marketplace platform</strong> that replaces multiple physical middlemen with an efficient, transparent digital workflow:
          </p>
          <div className="grid grid-cols-2 gap-4" style={{ marginTop: '1rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>For Farmers</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Direct access to supermarkets, hotels, and retail buyers. Full freedom to set dynamic prices based on quality and seasonal demand. Zero listing fee barriers.
              </p>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--secondary)', marginBottom: '0.35rem' }}>For Buyers</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                15% to 20% lower procurement expenses, farm origin provenance, guaranteed fresh harvest dates, and integrated logistics delivery tracking.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Dynamic Farmer Pricing Philosophy */}
        <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '5px solid var(--secondary)' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            3. Dynamic Farmer-Set Pricing Model
          </h2>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Unlike rigid fixed-price platforms or opaque algorithmic prediction models, AgriConnect empowers the grower to actively manage prices.
          </p>
          <p style={{ color: '#475569', lineHeight: 1.7 }}>
            A farmer with Grade A firm tomatoes can adjust price from <strong>₹30/kg to ₹32/kg</strong> during high weekend restaurant demand, or discount to <strong>₹28/kg</strong> for quick bulk volume dispatch. Every adjustment is recorded in an auditable price history and automatically logged in the platform's central Activity Monitor.
          </p>
        </div>

        {/* 4. Revenue Engine & Unit Economics */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent size={22} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>4. Marketplace Revenue Engine</h2>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            The business model sustains long-term platform operations and logistics infrastructure through 4 diversified revenue channels:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                1
              </div>
              <div>
                <strong>Transaction Commission (2% – 5% Configurable):</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  A minor commission deducted upon successful order delivery from the transaction amount, automatically calculated by the platform engine (default 3.5%).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                2
              </div>
              <div>
                <strong>Logistics & Cold-Chain Delivery Charges:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Distance-based freight fee for coordinated farm-to-destination delivery via verified logistics partners.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                3
              </div>
              <div>
                <strong>Premium Commercial Buyer Subscriptions:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Monthly B2B tier for supermarket chains offering automated weekly standing orders and volume credit terms.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#8b5cf6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                4
              </div>
              <div>
                <strong>Promoted Produce & FPO Spotlights:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Featured top-of-category placement for certified organic cooperatives and seasonal harvest surges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Technology Stack Rationale */}
        <div className="card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--primary)" />
            <span>5. Technical Implementation Architecture</span>
          </h2>
          <div className="grid grid-cols-3 gap-4" style={{ fontSize: '0.85rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>React.js Frontend</strong>
              <p style={{ color: 'var(--text-muted)' }}>Responsive single-page application with modular state management, interactive map views, and live UI updates.</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>Node.js & Express REST API</strong>
              <p style={{ color: 'var(--text-muted)' }}>Stateless RESTful microservices, JWT authentication, role guards, and automated activity audit logging engine.</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '0.25rem' }}>MySQL Relational Engine</strong>
              <p style={{ color: 'var(--text-muted)' }}>ACID-compliant relational schema, foreign key integrity, transaction records, price history, and activity audit trails.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/marketplace" className="btn btn-lg btn-primary">
            <span>Explore the Working Platform</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
