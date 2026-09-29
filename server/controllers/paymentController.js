const crypto = require('crypto');
const db = require('../config/db');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES, ORDER_STATUSES } = require('../utils/constants');

// Create Razorpay / Demo Payment Order
async function createPaymentOrder(req, res, next) {
  try {
    const { orderId } = req.body;

    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // If order already paid
    if (order.payment_status === 'PAID') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    // Generate test Razorpay order token
    const razorpayOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await db.query(
      `UPDATE payments SET razorpay_order_id = ? WHERE order_id = ?`,
      [razorpayOrderId, orderId]
    );

    res.json({
      success: true,
      razorpayOrderId,
      amount: Math.round(order.total_amount * 100), // in paise
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_agriconnect_demo',
      orderNumber: order.order_number,
      orderTotal: order.total_amount,
    });
  } catch (error) {
    next(error);
  }
}

// Verify Payment / Process Sandbox Test Payment
async function verifyPayment(req, res, next) {
  try {
    const {
      orderId,
      paymentMethod = 'UPI',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isDemoMode = true,
    } = req.body;

    const userId = req.user.id;

    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    const paymentId = razorpayPaymentId || `pay_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const txnRef = `TXN-${order.order_number}-${Date.now().toString().slice(-4)}`;

    // Update payment record safely: never store sensitive cards/CVV
    await db.query(
      `UPDATE payments 
       SET payment_method = ?,
           razorpay_order_id = COALESCE(?, razorpay_order_id),
           razorpay_payment_id = ?,
           razorpay_signature = ?,
           payment_status = 'SUCCESS',
           transaction_ref = ?
       WHERE order_id = ?`,
      [
        paymentMethod,
        razorpayOrderId || null,
        paymentId,
        razorpaySignature || 'simulated_valid_test_signature',
        txnRef,
        orderId,
      ]
    );

    // Update order status: Order Placed -> Payment Confirmed
    await db.query(
      `UPDATE orders 
       SET payment_status = 'PAID',
           order_status = ?,
           payment_method = ?
       WHERE id = ?`,
      [ORDER_STATUSES.PAYMENT_CONFIRMED, paymentMethod, orderId]
    );

    // Automatic Activity Log: "Payment ₹3,000 received for Order #1045"
    const activityDesc = `Payment ₹${parseFloat(order.total_amount).toFixed(2)} received via ${paymentMethod} for Order #${order.order_number}`;
    await logActivity({
      userId,
      role: 'BUYER',
      activityType: ACTIVITY_TYPES.PAYMENT_SUCCESS,
      description: activityDesc,
      orderId,
      oldValue: 'INITIATED',
      newValue: 'SUCCESS',
    });

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      paymentId,
      transactionRef: txnRef,
      orderStatus: ORDER_STATUSES.PAYMENT_CONFIRMED,
      orderNumber: order.order_number,
      amount: order.total_amount,
    });
  } catch (error) {
    next(error);
  }
}

// Get Payments List (Buyer or Admin)
async function getPayments(req, res, next) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let sql = '';
    let params = [];

    if (role === 'BUYER') {
      const [buyers] = await db.query('SELECT id FROM buyers WHERE user_id = ?', [userId]);
      if (!buyers.length) return res.json({ success: true, payments: [] });

      sql = `
        SELECT p.*, o.order_number, o.created_at as order_date
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.buyer_id = ?
        ORDER BY p.created_at DESC
      `;
      params = [buyers[0].id];
    } else if (role === 'ADMIN') {
      sql = `
        SELECT p.*, o.order_number, o.commission_amount, b.full_name as buyer_name
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN buyers b ON p.buyer_id = b.id
        ORDER BY p.created_at DESC
      `;
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [payments] = await db.query(sql, params);

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPayments,
};
