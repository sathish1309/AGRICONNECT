const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/order/:orderId', authenticateToken, deliveryController.getDeliveryByOrderId);
router.put('/:id/status', authenticateToken, requireRole('ADMIN', 'FARMER'), deliveryController.updateDeliveryStatus);

module.exports = router;
