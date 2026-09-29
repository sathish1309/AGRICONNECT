import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { registerFarmer, registerBuyer } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('FARMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shared Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');

  // Farmer specific
  const [villageCity, setVillageCity] = useState('');
  const [farmSize, setFarmSize] = useState('5 Acres');
  const [primaryCrops, setPrimaryCrops] = useState('Tomato, Onions');

  // Buyer specific
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('Supermarket');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      if (role === 'FARMER') {
        const user = await registerFarmer({
          email,
          password,
          fullName,
          mobile,
          address,
          villageCity,
          state,
          pincode,
          farmSize,
          primaryCrops,
        });
        navigate('/farmer');
      } else {
        const user = await registerBuyer({
          email,
          password,
          fullName,
          mobile,
          businessType,
          address,
          city,
          state,
          pincode,
        });
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check form fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Join the AgriConnect Network</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Choose whether you are registering to sell harvest or purchase wholesale produce.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          <button
            type="button"
            onClick={() => setRole('FARMER')}
            style={{
              padding: '0.875rem',
              borderRadius: '0.5rem',
              border: `2px solid ${role === 'FARMER' ? 'var(--primary)' : 'var(--border-color)'}`,
              backgroundColor: role === 'FARMER' ? 'var(--primary-50)' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              color: role === 'FARMER' ? 'var(--primary-dark)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Sprout size={20} color={role === 'FARMER' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>I am a Farmer / Grower</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('BUYER')}
            style={{
              padding: '0.875rem',
              borderRadius: '0.5rem',
              border: `2px solid ${role === 'BUYER' ? 'var(--secondary)' : 'var(--border-color)'}`,
              backgroundColor: role === 'BUYER' ? 'var(--secondary-light)' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              color: role === 'BUYER' ? 'var(--secondary-hover)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <ShoppingBag size={20} color={role === 'BUYER' ? 'var(--secondary)' : 'var(--text-muted)'} />
            <span>I am a Buyer / Business</span>
          </button>
        </div>

        {/* Register Card */}
        <div className="card">
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name / Entity</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Buyer Specific: Business Type */}
            {role === 'BUYER' && (
              <div className="form-group">
                <label className="form-label">Buyer Business Category</label>
                <select
                  className="form-select"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="Supermarket">Supermarket Chain</option>
                  <option value="Retailer">Independent Retail Store</option>
                  <option value="Restaurant">Restaurant / Hotel / Cloud Kitchen</option>
                  <option value="Wholesaler">Wholesale Food Distributor</option>
                  <option value="Food Business">Food Processing Business</option>
                  <option value="Individual">Individual Consumer</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{role === 'FARMER' ? 'Farm Location Address' : 'Delivery Address'}</label>
              <input
                type="text"
                className="form-input"
                placeholder="Street address, landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">{role === 'FARMER' ? 'Village / City' : 'City'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={role === 'FARMER' ? 'Thondamuthur' : 'Chennai'}
                  value={role === 'FARMER' ? villageCity : city}
                  onChange={(e) => role === 'FARMER' ? setVillageCity(e.target.value) : setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 641001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {role === 'FARMER' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Farm Size (Acres)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 10 Acres"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Crops Cultivated</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tomatoes, Carrots, Onions"
                    value={primaryCrops}
                    onChange={(e) => setPrimaryCrops(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`btn ${role === 'FARMER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'FARMER' ? 'Farmer' : 'Buyer'}`}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
