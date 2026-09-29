const db = require('../config/db');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES, DELIVERY_STATUSES, ORDER_STATUSES } = require('../utils/constants');

// Get Delivery Details for an Order
async function getDeliveryByOrderId(req, res, next) {
  try {
    const { orderId } = req.params;

    const [deliveries] = await db.query(
      `SELECT d.*, o.order_number, o.order_status, o.shipping_name, o.shipping_mobile,
              o.shipping_city, o.shipping_state, o.shipping_pincode,
              b.full_name as buyer_name, b.mobile as buyer_mobile
       FROM delivery d
       JOIN orders o ON d.order_id = o.id
       JOIN buyers b ON o.buyer_id = b.id
       WHERE d.order_id = ? OR o.order_number = ?`,
      [orderId, orderId]
    );

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ success: false, message: 'Delivery record not found' });
    }

    const delivery = deliveries[0];

    res.json({
      success: true,
      delivery,
    });
  } catch (error) {
    next(error);
  }
}

// Update Delivery Status (Admin or Courier)
async function updateDeliveryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, carrierName, notes } = req.body;
    const userId = req.user.id;

    const validStatuses = Object.values(DELIVERY_STATUSES);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid delivery status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const [deliveries] = await db.query(
      `SELECT d.*, o.order_number, o.id as order_id
       FROM delivery d
       JOIN orders o ON d.order_id = o.id
       WHERE d.id = ? OR d.order_id = ?`,
      [id, id]
    );

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ success: false, message: 'Delivery record not found' });
    }

    const delivery = deliveries[0];
    const oldStatus = delivery.status;

    await db.query(
      `UPDATE delivery 
       SET status = ?,
           carrier_name = COALESCE(?, carrier_name)
       WHERE id = ?`,
      [status, carrierName || null, delivery.id]
    );

    // Keep order status synchronized
    let newOrderStatus = null;
    if (status === DELIVERY_STATUSES.PICKUP_READY) {
      newOrderStatus = ORDER_STATUSES.READY_FOR_PICKUP;
    } else if (status === DELIVERY_STATUSES.PICKED_UP || status === DELIVERY_STATUSES.IN_TRANSIT) {
      newOrderStatus = ORDER_STATUSES.OUT_FOR_DELIVERY;
    } else if (status === DELIVERY_STATUSES.DELIVERED) {
      newOrderStatus = ORDER_STATUSES.DELIVERED;
    }

    if (newOrderStatus) {
      await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [newOrderStatus, delivery.order_id]);
    }

    // Automatic Activity Log
    await logActivity({
      userId,
      role: req.user.role,
      activityType: status === DELIVERY_STATUSES.DELIVERED ? 'DELIVERY_COMPLETED' : ACTIVITY_TYPES.DELIVERY_STATUS_CHANGED,
      description: status === DELIVERY_STATUSES.DELIVERED
        ? `Order #${delivery.order_number} marked as Delivered`
        : `Delivery for Order #${delivery.order_number} changed from "${oldStatus}" to "${status}"`,
      orderId: delivery.order_id,
      oldValue: oldStatus,
      newValue: status,
    });

    res.json({
      success: true,
      message: `Delivery status updated to "${status}"`,
      deliveryStatus: status,
      orderStatus: newOrderStatus,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDeliveryByOrderId,
  updateDeliveryStatus,
};
