const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, paymentController.createPaymentOrder);
router.post('/verify', authenticateToken, paymentController.verifyPayment);
router.get('/', authenticateToken, paymentController.getPayments);

module.exports = router;
