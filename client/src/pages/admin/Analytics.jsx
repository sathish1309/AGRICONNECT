import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, Users, PieChart, RefreshCw, Calendar } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics');
      if (res.success && res.analytics) {
        setData(res.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Calculating marketplace analytics from database...
      </div>
    );
  }

  const {
    monthlyData = [],
    userDistribution = [],
    categoryDistribution = [],
    orderStatusDistribution = [],
    paymentStatusDistribution = [],
  } = data || {};

  // Compute maximum sales for monthly chart normalization
  const maxSales = Math.max(...monthlyData.map(m => parseFloat(m.total_sales || 0)), 100000);
  const maxOrders = Math.max(...monthlyData.map(m => parseInt(m.total_orders || 0, 10)), 50);

  const totalUsers = userDistribution.reduce((sum, u) => sum + u.count, 0);

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>DATABASE-DRIVEN METRICS</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Platform Business Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Calculated directly from relational database tables. (Standard transactional calculations, no AI/ML models).
          </p>
        </div>

        <button onClick={fetchAnalytics} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Recalculate Metrics</span>
        </button>
      </div>

      {/* Grid of 6 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }} className="analytics-grid">
        
        {/* Chart 1: Orders per Month */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary)" />
              <span>1. Orders Per Month</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fulfillment Volume</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem' }}>
            {monthlyData.map((m) => {
              const heightPct = Math.round((parseInt(m.total_orders, 10) / maxOrders) * 100);

              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    {m.total_orders}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: `${Math.max(15, heightPct)}%`,
                      backgroundColor: 'var(--primary)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Sales & Commission per Month */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--secondary)" />
              <span>2. Sales & Platform Commission (₹)</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Volume vs 3.5% Fee</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem' }}>
            {monthlyData.map((m) => {
              const salesPct = Math.round((parseFloat(m.total_sales) / maxSales) * 100);

              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    ₹{Math.round(m.total_sales / 1000)}k
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: `${Math.max(15, salesPct)}%`,
                      backgroundColor: 'var(--secondary)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Farmers vs Buyers User Ratio */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#0284c7" />
              <span>3. Marketplace Participant Ratio</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Farmers vs Commercial Buyers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {userDistribution.map((u) => {
              const pct = totalUsers > 0 ? Math.round((u.count / totalUsers) * 100) : 50;
              const isFarmer = u.role === 'FARMER';

              return (
                <div key={u.role}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <strong style={{ color: isFarmer ? 'var(--primary)' : '#0284c7' }}>
                      {isFarmer ? 'Registered Farmers' : 'Commercial Buyers'}
                    </strong>
                    <span>{u.count} users ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: isFarmer ? 'var(--primary)' : '#0284c7',
                      borderRadius: '6px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Product Categories Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} color="#8b5cf6" />
              <span>4. Produce by Crop Category</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Listing Count</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {categoryDistribution.slice(0, 5).map((c) => (
              <div key={c.category_name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0.6rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
                <span style={{ fontWeight: 600 }}>{c.category_name}</span>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  {c.product_count} listed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 5: Order Status Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>5. Order Status Distribution</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fulfillment Pipeline</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orderStatusDistribution.map((os) => (
              <div key={os.order_status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{os.order_status}</span>
                <strong style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {os.count}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 6: Payment Status Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>6. Payment Settlement Ratio</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Razorpay Test Gateway</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
            {paymentStatusDistribution.map((ps) => {
              const isSuccess = ps.payment_status === 'SUCCESS';
              return (
                <div key={ps.payment_status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <strong style={{ color: isSuccess ? '#15803d' : '#b91c1c' }}>
                      {ps.payment_status} Payments
                    </strong>
                    <span>{ps.count} transactions</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: isSuccess ? '90%' : '10%',
                      height: '100%',
                      backgroundColor: isSuccess ? '#10b981' : '#ef4444',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
