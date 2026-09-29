import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Truck, MapPin, CheckCircle, Navigation, Info } from 'lucide-react';

export default function DeliveryTrackerMap({
  pickupLat = 11.0168445,
  pickupLng = 76.9558321,
  deliveryLat = 13.0826802,
  deliveryLng = 80.2707184,
  pickupAddress = 'Coimbatore Farm Gate',
  deliveryAddress = 'Buyer Destination Address',
  status = 'In Transit',
  distanceKm = 45.0,
  carrierName = 'AgriConnect Express Logistics',
  trackingNumber = 'TRK-2026-00101',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const pLat = parseFloat(pickupLat) || 11.0168;
    const pLng = parseFloat(pickupLng) || 76.9558;
    const dLat = parseFloat(deliveryLat) || 13.0826;
    const dLng = parseFloat(deliveryLng) || 80.2707;

    // Determine current simulated vehicle coordinates based on status
    let vehicleLat = pLat;
    let vehicleLng = pLng;

    if (status === 'Delivered') {
      vehicleLat = dLat;
      vehicleLng = dLng;
    } else if (status === 'In Transit' || status === 'Picked Up') {
      // Midpoint between pickup and drop
      vehicleLat = pLat + (dLat - pLat) * 0.65;
      vehicleLng = pLng + (dLng - pLng) * 0.65;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [(pLat + dLat) / 2, (pLng + dLng) / 2],
      zoom: 7,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Icons using SVG
    const createCustomIcon = (bgColor, iconHtml) => {
      return L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 14px;">${iconHtml}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
    };

    const originIcon = createCustomIcon('#059669', '🌱');
    const destinationIcon = createCustomIcon('#2563eb', '📍');
    const truckIcon = createCustomIcon('#d97706', '🚚');

    // Markers
    L.marker([pLat, pLng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`<b>Farm Pickup:</b><br/>${pickupAddress}`)
      .openPopup();

    L.marker([dLat, dLng], { icon: destinationIcon })
      .addTo(map)
      .bindPopup(`<b>Delivery Destination:</b><br/>${deliveryAddress}`);

    if (status !== 'Delivered') {
      L.marker([vehicleLat, vehicleLng], { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<b>Transit Position:</b><br/>Status: ${status}<br/>Carrier: ${carrierName}`);
    }

    // Route Polyline
    const routeCoords = [
      [pLat, pLng],
      [pLat + (dLat - pLat) * 0.3, pLng + (dLng - pLng) * 0.25],
      [vehicleLat, vehicleLng],
      [dLat, dLng],
    ];

    const polyline = L.polyline(routeCoords, {
      color: '#059669',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.85,
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng, status]);

  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
      
      {/* Tracker Header Bar */}
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
            <Truck size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Logistics & Delivery Route</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tracking: <strong style={{ color: 'var(--text-main)' }}>{trackingNumber}</strong> • {carrierName}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
            {status}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Est. Distance: {distanceKm} km
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height: '340px', width: '100%', zIndex: 1 }} />

      {/* Notice info */}
      <div style={{
        padding: '0.75rem 1.25rem',
        backgroundColor: '#f1f5f9',
        fontSize: '0.75rem',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Info size={14} />
        <span>
          Visual transit tracking calculated from agricultural dispatch origin to commercial buyer point. (Simulated milestone-based routing for academic demonstration).
        </span>
      </div>
    </div>
  );
}
