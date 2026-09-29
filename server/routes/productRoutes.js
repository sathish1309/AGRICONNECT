const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public Marketplace Endpoints
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Farmer Product Management Endpoints
router.post('/', authenticateToken, requireRole('FARMER', 'ADMIN'), productController.createProduct);
router.put('/:id', authenticateToken, requireRole('FARMER', 'ADMIN'), productController.updateProduct);
router.put('/:id/price', authenticateToken, requireRole('FARMER', 'ADMIN'), productController.updateProductPrice);
router.delete('/:id', authenticateToken, requireRole('FARMER', 'ADMIN'), productController.deleteProduct);

module.exports = router;
