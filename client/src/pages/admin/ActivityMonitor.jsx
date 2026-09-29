import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Activity, 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ActivityMonitor() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
        ...(search ? { search } : {}),
        ...(roleFilter !== 'ALL' ? { role: roleFilter } : {}),
        ...(typeFilter !== 'ALL' ? { activityType: typeFilter } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      const res = await api.get('/admin/activities', params);
      if (res.success && res.activities) {
        setActivities(res.activities);
        setTotalCount(res.totalCount || res.activities.length);
      }
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [search, roleFilter, typeFilter, startDate, endDate]);

  // Optional auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchActivities();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, search, roleFilter, typeFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setTypeFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  const activityTypesList = [
    'ALL',
    'PRICE_CHANGED',
    'PRODUCT_CREATED',
    'PRODUCT_APPROVED',
    'PRODUCT_REJECTED',
    'PRODUCT_UPDATED',
    'PRODUCT_REMOVED',
    'ORDER_PLACED',
    'ORDER_CONFIRMED',
    'ORDER_STATUS_CHANGED',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'DELIVERY_STATUS_CHANGED',
    'DELIVERY_COMPLETED',
    'REVIEW_SUBMITTED',
    'FARMER_REGISTERED',
    'BUYER_REGISTERED',
    'USER_ACTIVATED',
    'USER_DEACTIVATED',
    'SETTINGS_UPDATED',
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-danger">CORE PLATFORM AUDIT ENGINE</span>
            <span className="badge badge-success">AUTOMATIC LOGGING ACTIVE</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Activity Monitor</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            System automatically captures and records every price update, order, payment, and lifecycle change in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn btn-sm ${autoRefresh ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.8rem' }}
          >
            <Clock size={14} />
            <span>{autoRefresh ? 'Live Auto-Refresh: ON' : 'Live Auto-Refresh: OFF'}</span>
          </button>

          <button onClick={fetchActivities} className="btn btn-outline" title="Refresh Now">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }} className="filters-grid">
          
          {/* Keyword Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                placeholder="Search descriptions, orders, names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>User Role</label>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="FARMER">Farmers</option>
              <option value="BUYER">Buyers</option>
              <option value="ADMIN">Admins</option>
              <option value="SYSTEM">System / Logistics</option>
            </select>
          </div>

          {/* Activity Type Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Activity Type</label>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {activityTypesList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Date</label>
            <input
              type="date"
              className="form-input"
              style={{ fontSize: '0.85rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{activities.length}</strong> recorded audit actions (Total: {totalCount})
          </span>
          <button
            onClick={handleResetFilters}
            style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <RefreshCw size={12} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Activity Log Data Table */}
      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading activity logs...</p>
        ) : activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No activity records match your current filters.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Role</th>
                  <th>User / Trigger</th>
                  <th>Activity Type</th>
                  <th>Description</th>
                  <th>Old Value → New Value</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => {
                  const roleBadge = {
                    'FARMER': 'badge-success',
                    'BUYER': 'badge-info',
                    'ADMIN': 'badge-danger',
                    'SYSTEM': 'badge-gray',
                  }[act.role] || 'badge-gray';

                  const isPriceChange = act.activity_type === 'PRICE_CHANGED';

                  return (
                    <tr key={act.activity_id || act.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        <div>{new Date(act.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                        <strong style={{ color: 'var(--text-main)' }}>
                          {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </td>

                      <td>
                        <span className={`badge ${roleBadge}`} style={{ fontSize: '0.7rem' }}>
                          {act.role}
                        </span>
                      </td>

                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{act.user_name || 'System Engine'}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          {act.user_email || 'automated'}
                        </span>
                      </td>

                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isPriceChange ? 'var(--secondary-light)' : '#f1f5f9',
                          color: isPriceChange ? 'var(--secondary-hover)' : '#334155',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-block',
                        }}>
                          {act.activity_type}
                        </span>
                      </td>

                      <td style={{ maxWidth: '380px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {act.description}
                        </span>
                      </td>

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {act.old_value !== null || act.new_value !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                            <span style={{ color: '#b45309', fontWeight: 700, backgroundColor: '#fef3c7', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {act.old_value || 'None'}
                            </span>
                            <ArrowRight size={12} color="var(--text-muted)" />
                            <span style={{ color: '#15803d', fontWeight: 700, backgroundColor: '#dcfce7', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {act.new_value || 'None'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
