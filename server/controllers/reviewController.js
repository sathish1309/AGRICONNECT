const db = require('../config/db');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES } = require('../utils/constants');

// Submit Product Review (Buyer)
async function createReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ success: false, message: 'Product ID and rating are required' });
    }

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }

    const [buyers] = await db.query('SELECT id, full_name FROM buyers WHERE user_id = ?', [userId]);
    if (!buyers || buyers.length === 0) {
      return res.status(403).json({ success: false, message: 'Buyer profile required to submit review' });
    }

    const buyer = buyers[0];

    const [products] = await db.query(
      `SELECT p.id, p.name, p.farmer_id, f.full_name as farmer_name
       FROM products p
       JOIN farmers f ON p.farmer_id = f.id
       WHERE p.id = ?`,
      [productId]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    // Insert review
    const [result] = await db.query(
      `INSERT INTO reviews (product_id, buyer_id, order_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, buyer.id, orderId || null, ratingVal, comment || '']
    );

    // Update farmer average rating
    const [stats] = await db.query(
      `SELECT AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE p.farmer_id = ?`,
      [product.farmer_id]
    );

    if (stats && stats.length > 0) {
      const avgRating = parseFloat(stats[0].avg_rating) || 5.0;
      const count = stats[0].review_count || 1;
      await db.query(
        'UPDATE farmers SET rating = ?, total_reviews = ? WHERE id = ?',
        [avgRating.toFixed(2), count, product.farmer_id]
      );
    }

    // Automatic Activity Log: "Buyer ABC Supermarket left 5-star review for Fresh Red Tomatoes"
    await logActivity({
      userId,
      role: 'BUYER',
      activityType: ACTIVITY_TYPES.REVIEW_SUBMITTED,
      description: `Buyer ${buyer.full_name} submitted a ${ratingVal}-star review for ${product.name}`,
      productId,
      orderId: orderId || null,
      newValue: `${ratingVal} Stars`,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

// Get reviews for a specific product
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;

    const [reviews] = await db.query(
      `SELECT r.*, b.full_name as buyer_name, b.city as buyer_city
       FROM reviews r
       JOIN buyers b ON r.buyer_id = b.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getProductReviews,
};
