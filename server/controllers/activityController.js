const db = require('../config/db');

// Get all activity logs with rich multi-filtering and search
async function getActivities(req, res, next) {
  try {
    const {
      search,
      role,
      activityType,
      userId,
      productId,
      orderId,
      startDate,
      endDate,
      limit = 50,
      page = 1,
    } = req.query;

    let conditions = [];
    let params = [];

    if (search) {
      conditions.push('(a.description LIKE ? OR a.activity_type LIKE ? OR u.email LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (role && role !== 'ALL') {
      conditions.push('a.role = ?');
      params.push(role);
    }

    if (activityType && activityType !== 'ALL') {
      conditions.push('a.activity_type = ?');
      params.push(activityType);
    }

    if (userId) {
      conditions.push('a.user_id = ?');
      params.push(userId);
    }

    if (productId) {
      conditions.push('a.product_id = ?');
      params.push(productId);
    }

    if (orderId) {
      conditions.push('a.order_id = ?');
      params.push(orderId);
    }

    if (startDate) {
      conditions.push('a.created_at >= ?');
      params.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      conditions.push('a.created_at <= ?');
      params.push(`${endDate} 23:59:59`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        a.id as activity_id,
        a.user_id,
        a.role,
        a.activity_type,
        a.description,
        a.product_id,
        a.order_id,
        a.old_value,
        a.new_value,
        a.created_at,
        u.email as user_email,
        COALESCE(f.full_name, b.full_name, ad.full_name, 'System User') as user_name,
        p.name as product_name,
        o.order_number
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN farmers f ON u.id = f.user_id
      LEFT JOIN buyers b ON u.id = b.user_id
      LEFT JOIN admins ad ON u.id = ad.user_id
      LEFT JOIN products p ON a.product_id = p.id
      LEFT JOIN orders o ON a.order_id = o.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const parsedLimit = parseInt(limit, 10) || 50;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    params.push(parsedLimit, offset);

    const [activities] = await db.query(sql, params);

    // Get total count for pagination
    const countSql = `SELECT COUNT(a.id) as total FROM activity_logs a LEFT JOIN users u ON a.user_id = u.id ${whereClause}`;
    const [countResult] = await db.query(countSql, params.slice(0, -2));
    const totalCount = countResult && countResult[0] ? countResult[0].total : activities.length;

    res.json({
      success: true,
      totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
      activities,
    });
  } catch (error) {
    next(error);
  }
}

// Get activities for specific product
async function getProductActivities(req, res, next) {
  try {
    const { id } = req.params;
    const [activities] = await db.query(
      `SELECT a.*, u.email as user_email 
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.product_id = ?
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
}

// Get activities for specific order
async function getOrderActivities(req, res, next) {
  try {
    const { id } = req.params;
    const [activities] = await db.query(
      `SELECT a.*, u.email as user_email 
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.order_id = ?
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
}

// Get activities for specific user
async function getUserActivities(req, res, next) {
  try {
    const { id } = req.params;
    const [activities] = await db.query(
      `SELECT a.* 
       FROM activity_logs a
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActivities,
  getProductActivities,
  getOrderActivities,
  getUserActivities,
};
