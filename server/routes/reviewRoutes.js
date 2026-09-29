const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/', authenticateToken, requireRole('BUYER'), reviewController.createReview);
router.get('/:productId', reviewController.getProductReviews);

module.exports = router;
