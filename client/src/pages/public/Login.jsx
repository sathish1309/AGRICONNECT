import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (user.role === 'ADMIN') navigate('/admin');
    else if (user.role === 'FARMER') navigate('/farmer');
    else navigate('/buyer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await login(email, password);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    try {
      setLoading(true);
      const user = await demoLogin(role);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
          }}>
            <Sprout size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome to AgriConnect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Direct Farmer-to-Buyer Marketplace Console
          </p>
        </div>

        {/* Demo Fast-Login Box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>
            <Sparkles size={16} />
            <span>ACADEMIC PROJECT DEMO ACCOUNTS (1-CLICK)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="btn btn-sm btn-outline"
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', borderColor: '#ef4444', color: '#b91c1c' }}
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              className="btn btn-sm btn-outline"
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', borderColor: '#10b981', color: '#047857' }}
            >
              Farmer Ravi
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="btn btn-sm btn-outline"
              disabled={loading}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', borderColor: '#3b82f6', color: '#1d4ed8' }}
            >
              Buyer ABC
            </button>
          </div>
        </div>

        {/* Login Card */}
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
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. admin@agriconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            New to AgriConnect?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
