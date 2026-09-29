import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  IndianRupee, 
  Activity, 
  Sliders 
} from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('FARMER');

  const workflows = {
    FARMER: [
      { step: 1, title: 'Register & Farm Profile', desc: 'Sign up with full farm address, village/city, acreage, and cultivated primary crop categories.' },
      { step: 2, title: 'Add Agricultural Product', desc: 'Specify produce name, grade (Grade A / Organic), harvest date, and initial available stock quantity.' },
      { step: 3, title: 'Set Dynamic Selling Price', desc: 'Farmer sets competitive market selling price (e.g. Tomato ₹30/kg) with freedom to adjust anytime.' },
      { step: 4, title: 'Admin Quality Approval', desc: 'Platform admin validates specifications; once approved, produce becomes instantly discoverable.' },
      { step: 5, title: 'Receive Commercial Order', desc: 'Get instant notification when supermarkets, restaurants, or bulk buyers place an order.' },
      { step: 6, title: 'Confirm Order & Prepare Produce', desc: 'Farmer confirms fulfillment readiness and packs fresh produce into standardized transport crates.' },
      { step: 7, title: 'Farm Gate Logistics Pickup', desc: 'AgriConnect logistics partner collects crates directly from farm gate with milestone tracking.' },
      { step: 8, title: 'Fast Escrow Payout', desc: 'Once delivery is marked complete, payout is settled to farmer with transparent platform commission.' },
    ],
    BUYER: [
      { step: 1, title: 'Register as Buyer', desc: 'Sign up as Retailer, Supermarket, Restaurant, Hotel, Wholesaler, or Individual consumer.' },
      { step: 2, title: 'Browse & Filter Marketplace', desc: 'Search by crop name, category, region, minimum stock, and quality grading certifications.' },
      { step: 3, title: 'View Farmer-Set Dynamic Price', desc: 'See transparent, live selling prices set directly by the farmer with zero intermediary inflation.' },
      { step: 4, title: 'Add to Cart & Validate Stock', desc: 'Choose precise procurement volume with real-time stock ceiling validation.' },
      { step: 5, title: 'Secure Checkout & Payment', desc: 'Review shipping destination and pay securely via Razorpay test sandbox (UPI, Card, Net Banking).' },
      { step: 6, title: 'Interactive Route Tracking', desc: 'Follow transit journey on interactive map with pickup point, route line, distance, and ETA.' },
      { step: 7, title: 'Receive Quality Inspected Produce', desc: 'Accept farm-fresh harvest directly at retail outlet, commercial kitchen, or doorstep.' },
      { step: 8, title: 'Rate & Review Grower', desc: 'Submit 1–5 star rating and feedback to establish reputation for top agricultural growers.' },
    ],
    ADMIN: [
      { step: 1, title: 'Platform Operations Access', desc: 'Authenticate into central Admin Console with elevated monitoring and management privileges.' },
      { step: 2, title: 'Verify Users & Farmers', desc: 'Review farmer documentation and toggle account verification and operational active status.' },
      { step: 3, title: 'Product Approval Queue', desc: 'Inspect pending produce listings, review price reasonableness, and approve or reject with comments.' },
      { step: 4, title: 'Automatic Activity Monitor', desc: 'System automatically logs all price changes, orders, payments, and delivery movements without manual watching.' },
      { step: 5, title: 'Order & Logistics Oversight', desc: 'Track end-to-end status of all platform orders from confirmation through transit to delivery.' },
      { step: 6, title: 'Commission & Payment Ledger', desc: 'Monitor gross platform transactions and track accumulated commission revenue (e.g. 3.5%).' },
      { step: 7, title: 'Database Business Analytics', desc: 'Inspect monthly orders, category breakdowns, and user distributions using pure database metrics.' },
      { step: 8, title: 'Marketplace Business Settings', desc: 'Dynamically configure platform commission rate %, base delivery fees, and auto-approval rules.' },
    ],
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>TRANSPARENT ARCHITECTURE</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>How AgriConnect Works</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            A streamlined digital marketplace workflow designed for agricultural empowerment, disintermediation, and full transaction traceability.
          </p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
          <button
            onClick={() => setActiveTab('FARMER')}
            className={`btn btn-lg ${activeTab === 'FARMER' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Sprout size={20} />
            <span>Farmer Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('BUYER')}
            className={`btn btn-lg ${activeTab === 'BUYER' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <ShoppingBag size={20} />
            <span>Buyer Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`btn btn-lg ${activeTab === 'ADMIN' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <ShieldCheck size={20} />
            <span>Admin Workflow</span>
          </button>
        </div>

        {/* Workflow Steps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '4rem',
        }} className="workflow-grid">
          {workflows[activeTab].map((s) => (
            <div
              key={s.step}
              className="card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderTop: '4px solid var(--primary)',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                marginBottom: '1rem',
              }}>
                {s.step}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {s.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '1rem',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Test The Entire Live Workflow
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Use our built-in 1-Click Demo accounts to log in as Farmer Ravi, change a price, order as Buyer ABC, and watch the Admin Activity Monitor record it live!
            </p>
          </div>

          <Link to="/marketplace" className="btn btn-lg btn-secondary">
            <span>Explore Marketplace</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .workflow-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
