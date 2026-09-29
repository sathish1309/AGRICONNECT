import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PriceUpdateModal from '../../components/modals/PriceUpdateModal';
import { 
  Sprout, 
  Package, 
  Clock, 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForPrice, setSelectedProductForPrice] = useState(null);

  const fetchFarmerData = async () => {
    try {
      setLoading(true);
      const farmerId = user?.profileId || user?.profile?.id || 1;
      
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products', { farmerId }),
        api.get('/orders'),
      ]);

      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (orderRes.success && orderRes.orders) {
        setOrders(orderRes.orders);
      }
    } catch (err) {
      console.error('Failed to load farmer dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, [user]);

  // Derived metrics
  const activeProducts = products.filter(p => p.status === 'APPROVED');
  const pendingProducts = products.filter(p => p.status === 'PENDING');
  const completedOrders = orders.filter(o => o.order_status === 'Delivered');

  // Calculate gross sales for items belonging to this farmer
  const grossSales = orders.reduce((sum, o) => {
    if (o.payment_status === 'PAID') {
      const farmerItemsTotal = (o.items || []).reduce((itemSum, item) => itemSum + parseFloat(item.subtotal || 0), 0);
      return sum + farmerItemsTotal;
    }
    return sum;
  }, 0);

  const platformCommissionDeducted = grossSales * 0.035; // 3.5%
  const netEarnings = grossSales - platformCommissionDeducted;

  return (
    <div>
      {/* Top Welcome Banner */}
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
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>FARMER GROWER PORTAL</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            Welcome back, {user?.fullName || 'Farmer Partner'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {user?.profile?.village_city || 'Farm Cluster'}, {user?.profile?.state || 'India'} • Verified Direct Grower
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/farmer/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} />
            <span>List New Crop</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        
        {/* Total Products */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Listings</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={16} />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>{activeProducts.length}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
            {products.length} total listed produce
          </span>
        </div>

        {/* Pending Approval */}
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>{pendingProducts.length}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', display: 'block', marginTop: '0.2rem' }}>
            Under admin verification
          </span>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Commercial Orders</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>{orders.length}</strong>
          <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', marginTop: '0.2rem' }}>
            {completedOrders.length} successfully delivered
          </span>
        </div>

        {/* Net Farmer Earnings */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Farmer Payout</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={16} />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: '#15803d' }}>₹{netEarnings.toFixed(2)}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
            Gross: ₹{grossSales.toFixed(2)} (Less 3.5% fee)
          </span>
        </div>
      </div>

      {/* Dynamic Price Quick-Action Bar */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" />
              <span>Dynamic Farmer-Set Pricing Controls</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Adjust selling prices in real time. Adjustments instantly update the marketplace and log to the Admin Activity Monitor.
            </p>
          </div>
          <Link to="/farmer/products" className="btn btn-sm btn-outline">
            <span>Manage All Listings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>Loading listings...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No listed produce found. Click "List New Crop" to add your harvest.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Available Stock</th>
                  <th>Current Selling Price</th>
                  <th>Grading</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.image_url}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '0.375rem', objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{p.category_name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{p.quantity} {p.unit}</strong>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
                        ₹{p.price_per_unit} / {p.unit}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${p.quality_grade === 'Organic' ? 'badge-success' : 'badge-info'}`}>
                        {p.quality_grade || 'Grade A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedProductForPrice(p)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
                      >
                        <TrendingUp size={13} />
                        <span>Update Price</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Dynamic Price Revision */}
      {selectedProductForPrice && (
        <PriceUpdateModal
          product={selectedProductForPrice}
          onClose={() => setSelectedProductForPrice(null)}
          onSuccess={() => {
            setSelectedProductForPrice(null);
            fetchFarmerData();
          }}
        />
      )}
    </div>
  );
}
