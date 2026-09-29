import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import DeliveryTrackerMap from '../../components/maps/DeliveryTrackerMap';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Package, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading shipment tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h3>Shipment Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Unable to locate tracking information for this order.</p>
        <Link to="/buyer/orders" className="btn btn-primary">Return to Orders</Link>
      </div>
    );
  }

  // 8-stage progress definition
  const stages = [
    { label: 'Order Placed', key: 'Order Placed' },
    { label: 'Payment Confirmed', key: 'Payment Confirmed' },
    { label: 'Farmer Confirmed', key: 'Farmer Confirmed' },
    { label: 'Preparing', key: 'Preparing' },
    { label: 'Ready for Pickup', key: 'Ready for Pickup' },
    { label: 'Out for Delivery', key: 'Out for Delivery' },
    { label: 'Delivered', key: 'Delivered' },
  ];

  const currentStatusIndex = stages.findIndex(s => s.key === order.order_status);

  return (
    <div>
      <Link
        to="/buyer/orders"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Orders List</span>
      </Link>

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
          <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>SHIPMENT TRACKER</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            Order #{order.order_number}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tracking Number: <strong style={{ color: 'var(--text-main)' }}>{order.tracking_number || 'TRK-2026-PENDING'}</strong> • Carrier: {order.carrier_name || 'AgriConnect ColdChain Express'}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ESTIMATED DELIVERY</span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--primary-dark)' }}>
            {order.estimated_delivery
              ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Within 48 Hours'}
          </strong>
        </div>
      </div>

      {/* 8-Stage Progress Milestone Tracker */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Milestone Fulfillment Timeline
        </h3>

        <div className="tracker-timeline" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {stages.map((stage, idx) => {
            const isCompleted = currentStatusIndex > idx;
            const isActive = currentStatusIndex === idx;

            return (
              <div
                key={stage.key}
                className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                style={{ minWidth: '100px' }}
              >
                <div className="tracker-circle">
                  {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <div className="tracker-label">
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map & Route Section */}
      <div style={{ marginBottom: '2rem' }}>
        <DeliveryTrackerMap
          pickupLat={order.pickup_lat || 11.0168}
          pickupLng={order.pickup_lng || 76.9558}
          deliveryLat={order.delivery_lat || 13.0826}
          deliveryLng={order.delivery_lng || 80.2707}
          pickupAddress={order.pickup_address || 'Coimbatore Farm Gate, Tamil Nadu'}
          deliveryAddress={order.delivery_address || `${order.shipping_address}, ${order.shipping_city}`}
          status={order.delivery_status || 'In Transit'}
          distanceKm={order.distance_km || 45.0}
          carrierName={order.carrier_name || 'AgriConnect Express Logistics'}
          trackingNumber={order.tracking_number || `TRK-${order.order_number}`}
        />
      </div>

      {/* Order Details & Items Split */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Destination & Logistics */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            Dispatch & Logistics Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Farm Pickup Location</span>
              <strong>{order.pickup_address || 'Coimbatore Agro Cluster, Tamil Nadu'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Delivery Receiving Point</span>
              <strong>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Payment Status</span>
              <span className={`badge ${order.payment_status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                {order.payment_status} ({order.payment_method})
              </span>
            </div>
          </div>
        </div>

        {/* Harvest Items in Shipment */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            Produce Harvest In This Batch
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items && order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div>
                  <strong>{item.product_name}</strong>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    {item.quantity} {item.unit} @ ₹{item.unit_price}/{item.unit} • Farmer: {item.farmer_name}
                  </span>
                </div>
                <span style={{ fontWeight: 700 }}>₹{parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
              <span>Total Shipment Value</span>
              <span style={{ color: 'var(--primary-dark)' }}>₹{parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
