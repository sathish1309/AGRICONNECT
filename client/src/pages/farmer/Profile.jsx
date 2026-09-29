import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Sprout, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function FarmerProfile() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.profile?.mobile || '');
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [villageCity, setVillageCity] = useState(user?.profile?.village_city || '');
  const [state, setState] = useState(user?.profile?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(user?.profile?.pincode || '');
  const [farmSize, setFarmSize] = useState(user?.profile?.farm_size || '12 Acres');
  const [primaryCrops, setPrimaryCrops] = useState(user?.profile?.primary_crops || 'Tomato, Carrot, Banana');

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
        address,
        villageCity,
        state,
        pincode,
        farmSize,
        primaryCrops,
      });

      if (res.success) {
        setNotice('Farm profile updated successfully!');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update farm profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Farm Producer Profile
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your farm location, acreage, and cultivated crop specialties.
        </p>
      </div>

      <div className="card">
        {/* Verification Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Farmer Verification Status:</span>
          </div>
          <span className={`badge ${user?.profile?.verified ? 'badge-success' : 'badge-warning'}`}>
            {user?.profile?.verified ? 'Verified Direct Grower' : 'Pending Verification'}
          </span>
        </div>

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
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Mobile</label>
              <input type="tel" className="form-input" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Farm Physical Address</label>
            <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Village / City</label>
              <input type="text" className="form-input" value={villageCity} onChange={(e) => setVillageCity(e.target.value)} required />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Total Land Holding / Acreage</label>
              <input type="text" className="form-input" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Crops Cultivated</label>
              <input type="text" className="form-input" value={primaryCrops} onChange={(e) => setPrimaryCrops(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Saving Farm Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
