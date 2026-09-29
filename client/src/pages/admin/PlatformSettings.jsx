import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sliders, CheckCircle2, AlertCircle, Percent, Truck, ShieldCheck } from 'lucide-react';

export default function PlatformSettings() {
  const [commissionPct, setCommissionPct] = useState('3.5');
  const [deliveryFee, setDeliveryFee] = useState('50.00');
  const [autoApprove, setAutoApprove] = useState('false');
  const [marketplaceStatus, setMarketplaceStatus] = useState('active');

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.settings) {
        res.settings.forEach(s => {
          if (s.setting_key === 'platform_commission_pct') setCommissionPct(s.setting_value);
          if (s.setting_key === 'base_delivery_charge') setDeliveryFee(s.setting_value);
          if (s.setting_key === 'auto_approve_products') setAutoApprove(s.setting_value);
          if (s.setting_key === 'marketplace_status') setMarketplaceStatus(s.setting_value);
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setNotice('');
    setError('');

    try {
      setLoading(true);
      const res = await api.put('/admin/settings', {
        settings: [
          { key: 'platform_commission_pct', value: commissionPct },
          { key: 'base_delivery_charge', value: deliveryFee },
          { key: 'auto_approve_products', value: autoApprove },
          { key: 'marketplace_status', value: marketplaceStatus },
        ],
      });

      if (res.success) {
        setNotice('Platform business settings updated and logged to Activity Monitor!');
        setTimeout(() => setNotice(''), 3500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Platform & Business Model Settings
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Configure dynamic commission percentages, logistics charges, and quality compliance automation.
        </p>
      </div>

      <div className="card">
        {notice && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          
          {/* Commission setting */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Platform Transaction Commission Rate (%)
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Deducted automatically from gross order value upon successful delivery settlement (typically 2% to 5%).
            </p>
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                className="form-input"
                style={{ fontWeight: 700, fontSize: '1.1rem', paddingRight: '2rem' }}
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
                required
              />
              <Percent size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Delivery fee setting */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Base Freight & Logistics Charge (₹)
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Standard dispatch handling fee added to buyer checkout cart.
            </p>
            <div style={{ position: 'relative', width: '220px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
              <input
                type="number"
                step="5"
                min="0"
                className="form-input"
                style={{ fontWeight: 700, fontSize: '1.1rem', paddingLeft: '1.8rem' }}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quality Approval setting */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Produce Approval Compliance
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Whether new crop listings require manual Admin approval before appearing in public marketplace.
            </p>
            <select
              className="form-select"
              value={autoApprove}
              onChange={(e) => setAutoApprove(e.target.value)}
              style={{ width: '320px' }}
            >
              <option value="false">Manual Review Required (Recommended for Quality)</option>
              <option value="true">Instant Auto-Approve on Submission</option>
            </select>
          </div>

          {/* Marketplace Status */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Marketplace Operational State
            </label>
            <select
              className="form-select"
              value={marketplaceStatus}
              onChange={(e) => setMarketplaceStatus(e.target.value)}
              style={{ width: '220px' }}
            >
              <option value="active">Active & Open</option>
              <option value="maintenance">Maintenance Mode</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving Settings...' : 'Save Business Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
