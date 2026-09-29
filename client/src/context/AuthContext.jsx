import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agriconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/profile');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Profile load failed or token expired:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      localStorage.setItem('agriconnect_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const registerFarmer = async (formData) => {
    const res = await api.post('/auth/register/farmer', formData);
    if (res.success && res.token) {
      localStorage.setItem('agriconnect_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const registerBuyer = async (formData) => {
    const res = await api.post('/auth/register/buyer', formData);
    if (res.success && res.token) {
      localStorage.setItem('agriconnect_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('agriconnect_token');
    setToken(null);
    setUser(null);
  };

  const demoLogin = async (roleType) => {
    if (roleType === 'admin') {
      return login('admin@agriconnect.com', 'Admin@123');
    } else if (roleType === 'farmer') {
      return login('ravi@agriconnect.com', 'Farmer@123');
    } else if (roleType === 'buyer') {
      return login('abc@supermarket.com', 'Buyer@123');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'FARMER',
    isBuyer: user?.role === 'BUYER',
    isAdmin: user?.role === 'ADMIN',
    login,
    registerFarmer,
    registerBuyer,
    logout,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
