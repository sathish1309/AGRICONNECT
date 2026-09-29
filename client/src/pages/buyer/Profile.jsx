import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BuyerProfile() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.profile?.mobile || '');
  const [businessType, setBusinessType] = useState(user?.profile?.business_type || 'Supermarket');
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [state, setState] = useState(user?.profile?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(user?.profile?.pincode || '');

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setNotice('');
    setError('');

    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        fullName,
        mobile,
        businessType,
        address,
        city,
        state,
        pincode,
      });

      if (res.success) {
        setNotice('Profile updated successfully!');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Buyer Entity Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage receiving destination, contact person, and business category.</p>
      </div>

      <div className="card">
        {notice && (
          <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name / Entity Contact</label>
              <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Mobile</label>
              <input type="tel" className="form-input" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Business Type</label>
            <select className="form-select" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              <option value="Supermarket">Supermarket Chain</option>
              <option value="Retailer">Independent Retail Store</option>
              <option value="Restaurant">Restaurant / Hotel / Catering</option>
              <option value="Wholesaler">Wholesale Food Distributor</option>
              <option value="Individual">Individual Consumer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Receiving Address</label>
            <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" className="form-input" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input type="text" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
