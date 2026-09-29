const { verifyToken } = require('../config/jwt');
const db = require('../config/db');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
    }

    const [rows] = await db.query(
      'SELECT id, email, role, status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found',
      });
    }

    const user = rows[0];

    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error',
    });
  }
}

// Optional authentication for public routes that can personalize if token exists
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const [rows] = await db.query(
          'SELECT id, email, role, status FROM users WHERE id = ?',
          [decoded.id]
        );
        if (rows && rows.length > 0) {
          req.user = rows[0];
        }
      }
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
};
