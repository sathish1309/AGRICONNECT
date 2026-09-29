const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Activity routes are accessible to Admin for platform monitoring
router.use(authenticateToken, requireRole('ADMIN'));

router.get('/', activityController.getActivities);
router.get('/product/:id', activityController.getProductActivities);
router.get('/order/:id', activityController.getOrderActivities);
router.get('/user/:id', activityController.getUserActivities);

module.exports = router;
