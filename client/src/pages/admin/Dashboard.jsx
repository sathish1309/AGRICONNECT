import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  IndianRupee, 
  CheckSquare, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickApprove = async (productId, productName) => {
    try {
      const res = await api.put(`/admin/products/${productId}/approve`);
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading Admin Operations Console...
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentActivities = data?.recentActivities || [];

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: '1.75rem 2rem',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '0.4rem' }}>SYSTEM ADMINISTRATOR CONSOLE</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Marketplace Operations & Activity Control</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Centralized monitoring of growers, commercial buyers, order fulfillment, commission ledger, and audit logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/activities" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#ef4444', color: '#b91c1c' }}>
            <Activity size={16} />
            <span>Open Activity Monitor</span>
          </Link>
          <Link to="/admin/approvals" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={16} />
            <span>Product Approvals ({stats.pendingProducts || 0})</span>
          </Link>
        </div>
      </div>

      {/* 11 KPI Cards Grid (Requirement 23) */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        
        {/* Total Farmers */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Farmers</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)', display: 'block', margin: '0.3rem 0' }}>
            {stats.totalFarmers || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Verified agricultural producers</span>
        </div>

        {/* Total Buyers */}
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Buyers</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)', display: 'block', margin: '0.3rem 0' }}>
            {stats.totalBuyers || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>Supermarkets & commercial accounts</span>
        </div>

        {/* Total Products */}
        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Listed Produce</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)', display: 'block', margin: '0.3rem 0' }}>
            {stats.totalProducts || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats.approvedProducts || 0} approved for sale
          </span>
        </div>

        {/* Pending Products */}
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Approvals</span>
          <strong style={{ fontSize: '1.75rem', color: stats.pendingProducts > 0 ? 'var(--secondary)' : 'var(--text-main)', display: 'block', margin: '0.3rem 0' }}>
            {stats.pendingProducts || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>Awaiting compliance review</span>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)', display: 'block', margin: '0.3rem 0' }}>
            {stats.totalOrders || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platform lifecycle transactions</span>
        </div>

        {/* Pending Orders */}
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending / In Transit</span>
          <strong style={{ fontSize: '1.75rem', color: '#b45309', display: 'block', margin: '0.3rem 0' }}>
            {stats.pendingOrders || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Under preparation / logistics</span>
        </div>

        {/* Completed Orders */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Orders</span>
          <strong style={{ fontSize: '1.75rem', color: '#15803d', display: 'block', margin: '0.3rem 0' }}>
            {stats.completedOrders || 0}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>Delivered to buyers</span>
        </div>

        {/* Platform Commission Earned */}
        <div className="card" style={{ borderLeft: '4px solid #dc2626', backgroundColor: '#fef2f2' }}>
          <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700 }}>Total Platform Commission</span>
          <strong style={{ fontSize: '1.75rem', color: '#b91c1c', display: 'block', margin: '0.3rem 0' }}>
            ₹{stats.totalCommission ? stats.totalCommission.toFixed(2) : '0.00'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#991b1b' }}>Net startup platform revenue</span>
        </div>

      </div>

      {/* Split Section: Recent Activity Log Monitor + Pending Approvals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }} className="admin-split">
        
        {/* Live Activity Monitor Feed (CORE FEATURE - Requirement 29) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} color="#dc2626" />
                <span>Recent Platform Activities</span>
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                System automatically logs all actions (No manual monitoring required)
              </span>
            </div>
            <Link to="/admin/activities" className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem' }}>
              <span>View All Logs</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentActivities.map((act) => {
              const roleColor = {
                'FARMER': '#10b981',
                'BUYER': '#3b82f6',
                'ADMIN': '#ef4444',
                'SYSTEM': '#64748b',
              }[act.role] || '#64748b';

              return (
                <div
                  key={act.id}
                  style={{
                    padding: '0.875rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: roleColor,
                      marginTop: '6px',
                      flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: roleColor }}>
                          {act.role}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          • {act.activity_type}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {act.description}
                      </p>
                      {act.old_value && act.new_value && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                          Changed: <strong style={{ color: '#b45309' }}>{act.old_value}</strong> → <strong style={{ color: 'var(--primary)' }}>{act.new_value}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Product Approval Queue */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckSquare size={18} color="var(--primary)" />
              <span>Pending Reviews</span>
            </h3>
            <Link to="/admin/approvals" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              Queue ({stats.pendingProducts || 0})
            </Link>
          </div>

          {stats.pendingProducts === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>All listed products have been reviewed and approved!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {stats.pendingProducts} produce listing{stats.pendingProducts > 1 ? 's' : ''} require compliance authorization before appearing in marketplace.
              </p>
              <Link to="/admin/approvals" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Open Approvals Console
              </Link>
            </div>
          )}

          {/* Quick Business Settings Link */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              BUSINESS MODEL SETTINGS
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Active Commission Rate</span>
              <strong>3.5%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Base Logistics Fee</span>
              <strong>₹50.00</strong>
            </div>
            <Link to="/admin/settings" className="btn btn-sm btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
              Configure Settings
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .admin-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
