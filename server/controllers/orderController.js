const db = require('../config/db');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES, ORDER_STATUSES, DELIVERY_STATUSES } = require('../utils/constants');

// Create a new order (Buyer Checkout)
async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const [buyers] = await db.query('SELECT * FROM buyers WHERE user_id = ?', [userId]);

    if (!buyers || buyers.length === 0) {
      return res.status(403).json({ success: false, message: 'Buyer profile required to place order' });
    }

    const buyer = buyers[0];
    const {
      items,
      shippingName,
      shippingMobile,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      notes,
      paymentMethod = 'Online Payment (Razorpay Test)',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingName || !shippingMobile || !shippingAddress || !shippingCity || !shippingState || !shippingPincode) {
      return res.status(400).json({ success: false, message: 'All shipping details are required' });
    }

    // Retrieve platform commission & delivery settings
    const [settings] = await db.query('SELECT setting_key, setting_value FROM platform_settings');
    let commissionPct = 3.5;
    let baseDeliveryFee = 50.0;

    if (settings && settings.length > 0) {
      settings.forEach(s => {
        if (s.setting_key === 'platform_commission_pct') commissionPct = parseFloat(s.setting_value) || 3.5;
        if (s.setting_key === 'base_delivery_charge') baseDeliveryFee = parseFloat(s.setting_value) || 50.0;
      });
    }

    // Validate products and check inventory stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const [productRows] = await db.query(
        `SELECT p.*, f.full_name as farmer_name, f.village_city as farmer_city, f.state as farmer_state, f.address as farmer_address
         FROM products p
         JOIN farmers f ON p.farmer_id = f.id
         WHERE p.id = ?`,
        [item.productId]
      );

      if (!productRows || productRows.length === 0) {
        return res.status(404).json({ success: false, message: `Product ID ${item.productId} not found` });
      }

      const product = productRows[0];

      if (parseFloat(product.quantity) < parseFloat(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity} ${product.unit}, Requested: ${item.quantity} ${product.unit}`,
        });
      }

      const unitPrice = parseFloat(product.price_per_unit);
      const itemSubtotal = unitPrice * parseFloat(item.quantity);
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        farmerId: product.farmer_id,
        productName: product.name,
        unit: product.unit,
        quantity: parseFloat(item.quantity),
        unitPrice,
        subtotal: itemSubtotal,
        farmerAddress: `${product.farmer_address}, ${product.farmer_city}, ${product.farmer_state}`,
      });
    }

    const deliveryFee = baseDeliveryFee;
    const commissionAmount = (subtotal * commissionPct) / 100;
    const totalAmount = subtotal + deliveryFee;

    // Generate unique order number: AGRI-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `AGRI-2026-${randomSuffix}`;

    // Insert order
    const [orderResult] = await db.query(
      `INSERT INTO orders 
        (order_number, buyer_id, subtotal, delivery_fee, commission_rate, commission_amount, total_amount, order_status, payment_status, payment_method, shipping_name, shipping_mobile, shipping_address, shipping_city, shipping_state, shipping_pincode, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        buyer.id,
        subtotal,
        deliveryFee,
        commissionPct,
        commissionAmount,
        totalAmount,
        ORDER_STATUSES.ORDER_PLACED,
        'PENDING',
        paymentMethod,
        shippingName,
        shippingMobile,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPincode,
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert items & decrement product stock
    for (const item of validatedItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, farmer_id, product_name, unit, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.farmerId, item.productName, item.unit, item.quantity, item.unitPrice, item.subtotal]
      );

      // Decrement inventory
      await db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.productId]);
    }

    // Generate delivery record with tracking
    const trackingNumber = `TRK-2026-${randomSuffix}`;
    const pickupAddress = validatedItems[0].farmerAddress;
    const deliveryAddress = `${shippingAddress}, ${shippingCity}, ${shippingState} - ${shippingPincode}`;

    // Estimated delivery in 2 days
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2);
    const estimatedDateStr = estimatedDate.toISOString().split('T')[0];

    await db.query(
      `INSERT INTO delivery (order_id, tracking_number, pickup_address, delivery_address, status, estimated_delivery, distance_km)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, trackingNumber, pickupAddress, deliveryAddress, DELIVERY_STATUSES.PENDING, estimatedDateStr, 45.0]
    );

    // Initial payment record
    await db.query(
      `INSERT INTO payments (order_id, buyer_id, payment_method, amount, payment_status, transaction_ref)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, buyer.id, paymentMethod, totalAmount, 'INITIATED', `TXN-${orderNumber}`]
    );

    // Clear cart if buyer has items
    const [cartRows] = await db.query('SELECT id FROM cart WHERE buyer_id = ?', [buyer.id]);
    if (cartRows && cartRows.length > 0) {
      await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartRows[0].id]);
    }

    // Automatic Activity Log: "Buyer ABC Supermarket placed Order #1045"
    await logActivity({
      userId,
      role: 'BUYER',
      activityType: ACTIVITY_TYPES.ORDER_PLACED,
      description: `Buyer ${buyer.full_name} placed Order #${orderNumber} for ₹${totalAmount.toFixed(2)}`,
      orderId,
      newValue: orderNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId,
      orderNumber,
      totalAmount,
      deliveryFee,
      commissionAmount,
      trackingNumber,
    });
  } catch (error) {
    next(error);
  }
}

// Get Orders (Role-Filtered)
async function getOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let sql = '';
    let params = [];

    if (role === 'BUYER') {
      const [buyers] = await db.query('SELECT id FROM buyers WHERE user_id = ?', [userId]);
      if (!buyers.length) return res.json({ success: true, orders: [] });

      sql = `
        SELECT o.*, d.status as delivery_status, d.tracking_number, d.estimated_delivery
        FROM orders o
        LEFT JOIN delivery d ON o.id = d.order_id
        WHERE o.buyer_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [buyers[0].id];
    } else if (role === 'FARMER') {
      const [farmers] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [userId]);
      if (!farmers.length) return res.json({ success: true, orders: [] });

      sql = `
        SELECT DISTINCT o.*, b.full_name as buyer_name, b.mobile as buyer_mobile, b.business_type as buyer_business_type,
               d.status as delivery_status, d.tracking_number
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN buyers b ON o.buyer_id = b.id
        LEFT JOIN delivery d ON o.id = d.order_id
        WHERE oi.farmer_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [farmers[0].id];
    } else if (role === 'ADMIN') {
      sql = `
        SELECT o.*, b.full_name as buyer_name, b.mobile as buyer_mobile,
               d.status as delivery_status, d.tracking_number
        FROM orders o
        JOIN buyers b ON o.buyer_id = b.id
        LEFT JOIN delivery d ON o.id = d.order_id
        ORDER BY o.created_at DESC
      `;
    }

    const [orders] = await db.query(sql, params);

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.image_url, f.full_name as farmer_name
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         LEFT JOIN farmers f ON oi.farmer_id = f.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

// Get Single Order Details
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT o.*, b.full_name as buyer_name, b.mobile as buyer_mobile, b.business_type as buyer_business_type,
              d.tracking_number, d.pickup_address, d.delivery_address, d.status as delivery_status,
              d.pickup_lat, d.pickup_lng, d.delivery_lat, d.delivery_lng, d.distance_km, d.carrier_name, d.estimated_delivery,
              p.payment_method, p.payment_status as payment_record_status, p.transaction_ref, p.razorpay_payment_id
       FROM orders o
       JOIN buyers b ON o.buyer_id = b.id
       LEFT JOIN delivery d ON o.id = d.order_id
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.id = ? OR o.order_number = ?`,
      [id, id]
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.*, p.image_url, f.full_name as farmer_name, f.mobile as farmer_mobile, f.village_city as farmer_city
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN farmers f ON oi.farmer_id = f.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
}

// Update Order Status (Farmer / Admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const validStatuses = Object.values(ORDER_STATUSES);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];
    const oldStatus = order.order_status;

    // Update order status
    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);

    // Keep delivery status synchronized
    let deliveryStatus = null;
    if (status === ORDER_STATUSES.READY_FOR_PICKUP) {
      deliveryStatus = DELIVERY_STATUSES.PICKUP_READY;
    } else if (status === ORDER_STATUSES.OUT_FOR_DELIVERY) {
      deliveryStatus = DELIVERY_STATUSES.IN_TRANSIT;
    } else if (status === ORDER_STATUSES.DELIVERED) {
      deliveryStatus = DELIVERY_STATUSES.DELIVERED;
    }

    if (deliveryStatus) {
      await db.query('UPDATE delivery SET status = ? WHERE order_id = ?', [deliveryStatus, id]);
    }

    // Automatic Activity Log
    let activityType = ACTIVITY_TYPES.ORDER_STATUS_CHANGED;
    if (status === ORDER_STATUSES.FARMER_CONFIRMED) {
      activityType = ACTIVITY_TYPES.ORDER_CONFIRMED;
    } else if (status === ORDER_STATUSES.DELIVERED) {
      activityType = ACTIVITY_TYPES.DELIVERY_STATUS_CHANGED;
    }

    const desc = status === ORDER_STATUSES.DELIVERED
      ? `Order #${order.order_number} marked as Delivered`
      : `Order #${order.order_number} status changed from "${oldStatus}" to "${status}"`;

    await logActivity({
      userId,
      role,
      activityType,
      description: desc,
      orderId: id,
      oldValue: oldStatus,
      newValue: status,
    });

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      oldStatus,
      newStatus: status,
      deliveryStatus,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
