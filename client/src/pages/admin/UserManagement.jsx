import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, ShieldCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        ...(roleFilter ? { role: roleFilter } : {}),
        ...(search ? { search } : {}),
      };
      const res = await api.get('/admin/users', params);
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await api.put(`/admin/users/${user.id}/status`, { status: newStatus });
      if (res.success) {
        setNotice(`User account ${user.email} marked as ${newStatus}`);
        setTimeout(() => setNotice(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Status toggle failed');
    }
  };

  const handleToggleVerification = async (farmerId, currentVerified) => {
    try {
      const res = await api.put(`/admin/farmers/${farmerId}/verify`, { verified: !currentVerified });
      if (res.success) {
        setNotice('Farmer verification updated');
        setTimeout(() => setNotice(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Verification update failed');
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>User & Account Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor and manage farmers, buyers, credentials, and verification privileges.
          </p>
        </div>

        <button onClick={fetchUsers} className="btn btn-outline">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {notice && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setRoleFilter('')}
            className={`btn btn-sm ${!roleFilter ? 'btn-primary' : 'btn-outline'}`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('FARMER')}
            className={`btn btn-sm ${roleFilter === 'FARMER' ? 'btn-primary' : 'btn-outline'}`}
          >
            Farmers Only
          </button>
          <button
            onClick={() => setRoleFilter('BUYER')}
            className={`btn btn-sm ${roleFilter === 'BUYER' ? 'btn-primary' : 'btn-outline'}`}
          >
            Buyers Only
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No users found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User / Name</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Account Status</th>
                  <th>Verification</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const roleBadge = {
                    'FARMER': 'badge-success',
                    'BUYER': 'badge-info',
                    'ADMIN': 'badge-danger',
                  }[u.role] || 'badge-gray';

                  const displayName = u.farmer_name || u.buyer_name || 'Admin User';
                  const displayMobile = u.farmer_mobile || u.buyer_mobile || '—';
                  const displayCity = u.farmer_city || u.buyer_city || 'HQ';

                  return (
                    <tr key={u.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{displayName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{u.email}</span>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>{displayMobile}</td>

                      <td>
                        <span className={`badge ${roleBadge}`} style={{ fontSize: '0.7rem' }}>
                          {u.role}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>{displayCity}</td>

                      <td>
                        <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                          {u.status}
                        </span>
                      </td>

                      <td>
                        {u.role === 'FARMER' ? (
                          <button
                            onClick={() => handleToggleVerification(u.farmer_id, u.farmer_verified)}
                            className="btn btn-sm btn-outline"
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              borderColor: u.farmer_verified ? '#10b981' : '#cbd5e1',
                              color: u.farmer_verified ? '#047857' : '#64748b',
                            }}
                          >
                            <ShieldCheck size={12} />
                            <span>{u.farmer_verified ? 'Verified' : 'Unverified'}</span>
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>N/A</span>
                        )}
                      </td>

                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      <td>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="btn btn-sm btn-outline"
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              color: u.status === 'ACTIVE' ? 'var(--danger)' : 'var(--primary)',
                            }}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
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
    </div>
  );
}
