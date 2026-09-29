const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All admin routes require ADMIN role
router.use(authenticateToken, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/farmers/:farmerId/verify', adminController.toggleFarmerVerification);
router.put('/products/:id/approve', adminController.approveProduct);
router.put('/products/:id/reject', adminController.rejectProduct);
router.put('/settings', adminController.updateSettings);

module.exports = router;
