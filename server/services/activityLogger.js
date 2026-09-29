const db = require('../config/db');

/**
 * Automatically records important platform activities into the activity_logs table.
 * @param {Object} params
 * @param {number|null} params.userId - User ID who triggered the action
 * @param {string} params.role - User role: FARMER, BUYER, ADMIN, SYSTEM
 * @param {string} params.activityType - Constants like PRODUCT_CREATED, PRICE_CHANGED, etc.
 * @param {string} params.description - Human readable summary of the event
 * @param {number|null} params.productId - Associated product ID if applicable
 * @param {number|null} params.orderId - Associated order ID if applicable
 * @param {string|null} params.oldValue - Prior value (e.g. old price, prior status)
 * @param {string|null} params.newValue - New value (e.g. new price, new status)
 */
async function logActivity({
  userId = null,
  role = 'SYSTEM',
  activityType,
  description,
  productId = null,
  orderId = null,
  oldValue = null,
  newValue = null,
}) {
  try {
    const query = `
      INSERT INTO activity_logs (user_id, role, activity_type, description, product_id, order_id, old_value, new_value, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [
      userId,
      role,
      activityType,
      description,
      productId,
      orderId,
      oldValue !== null ? String(oldValue) : null,
      newValue !== null ? String(newValue) : null,
    ]);
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
}

module.exports = {
  logActivity,
};
