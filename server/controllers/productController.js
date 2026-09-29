const db = require('../config/db');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES, PRODUCT_STATUSES } = require('../utils/constants');

// Get all products (Marketplace with filters, search, sorting)
async function getProducts(req, res, next) {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      qualityGrade,
      status,
      farmerId,
      sortBy = 'newest',
    } = req.query;

    let conditions = [];
    let params = [];

    // Marketplace sees APPROVED products by default
    if (status) {
      conditions.push('p.status = ?');
      params.push(status);
    } else if (!farmerId) {
      conditions.push("p.status = 'APPROVED'");
      conditions.push('p.is_available = 1');
    }

    if (farmerId) {
      conditions.push('p.farmer_id = ?');
      params.push(farmerId);
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR f.full_name LIKE ? OR p.description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      conditions.push('(c.slug = ? OR c.id = ?)');
      params.push(category, category);
    }

    if (location) {
      conditions.push('p.location LIKE ?');
      params.push(`%${location}%`);
    }

    if (minPrice) {
      conditions.push('p.price_per_unit >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push('p.price_per_unit <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (qualityGrade) {
      conditions.push('p.quality_grade = ?');
      params.push(qualityGrade);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY p.created_at DESC';
    if (sortBy === 'price_asc') {
      orderClause = 'ORDER BY p.price_per_unit ASC';
    } else if (sortBy === 'price_desc') {
      orderClause = 'ORDER BY p.price_per_unit DESC';
    } else if (sortBy === 'newest') {
      orderClause = 'ORDER BY p.created_at DESC';
    } else if (sortBy === 'rating') {
      orderClause = 'ORDER BY f.rating DESC';
    }

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        f.full_name as farmer_name,
        f.mobile as farmer_mobile,
        f.village_city as farmer_city,
        f.state as farmer_state,
        f.rating as farmer_rating,
        f.verified as farmer_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN farmers f ON p.farmer_id = f.id
      ${whereClause}
      ${orderClause}
    `;

    const [products] = await db.query(sql, params);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
}

// Get single product details + reviews + price history
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        f.full_name as farmer_name,
        f.mobile as farmer_mobile,
        f.address as farmer_address,
        f.village_city as farmer_city,
        f.state as farmer_state,
        f.rating as farmer_rating,
        f.verified as farmer_verified,
        f.farm_size as farmer_farm_size
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN farmers f ON p.farmer_id = f.id
      WHERE p.id = ?`,
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = products[0];

    // Fetch reviews
    const [reviews] = await db.query(
      `SELECT r.*, b.full_name as buyer_name, b.city as buyer_city
       FROM reviews r
       JOIN buyers b ON r.buyer_id = b.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Fetch price change history
    const [priceHistory] = await db.query(
      `SELECT ph.*, u.email as changed_by_email
       FROM price_history ph
       JOIN users u ON ph.changed_by = u.id
       WHERE ph.product_id = ?
       ORDER BY ph.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      product,
      reviews,
      priceHistory,
    });
  } catch (error) {
    next(error);
  }
}

// Add new product (Farmer)
async function createProduct(req, res, next) {
  try {
    const userId = req.user.id;
    const [farmers] = await db.query('SELECT * FROM farmers WHERE user_id = ?', [userId]);

    if (!farmers || farmers.length === 0) {
      return res.status(403).json({ success: false, message: 'Farmer profile not found' });
    }

    const farmer = farmers[0];
    const {
      categoryId,
      name,
      description,
      quantity,
      unit = 'kg',
      pricePerUnit,
      harvestDate,
      imageUrl,
      location,
      qualityGrade = 'Grade A',
    } = req.body;

    if (!categoryId || !name || !quantity || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Product category, name, quantity, and price per unit are required',
      });
    }

    // Check platform settings for auto-approval
    const [settings] = await db.query(
      "SELECT setting_value FROM platform_settings WHERE setting_key = 'auto_approve_products'"
    );
    const autoApprove = settings && settings.length > 0 && settings[0].setting_value === 'true';
    const initialStatus = autoApprove ? 'APPROVED' : 'PENDING';

    const defaultImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
    const productLocation = location || `${farmer.village_city}, ${farmer.state}`;

    const [result] = await db.query(
      `INSERT INTO products 
        (farmer_id, category_id, name, description, quantity, unit, price_per_unit, harvest_date, image_url, location, quality_grade, status, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmer.id,
        categoryId,
        name.trim(),
        description || '',
        parseFloat(quantity),
        unit,
        parseFloat(pricePerUnit),
        harvestDate || null,
        defaultImage,
        productLocation,
        qualityGrade,
        initialStatus,
        1,
      ]
    );

    const productId = result.insertId;

    // Record initial price history
    await db.query(
      `INSERT INTO price_history (product_id, farmer_id, old_price, new_price, changed_by, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, farmer.id, parseFloat(pricePerUnit), parseFloat(pricePerUnit), userId, 'Initial product listing price']
    );

    // Automatic Activity Log
    await logActivity({
      userId,
      role: 'FARMER',
      activityType: ACTIVITY_TYPES.PRODUCT_CREATED,
      description: `Farmer ${farmer.full_name} added ${name} (${quantity} ${unit} @ ₹${pricePerUnit}/${unit})`,
      productId,
      newValue: name,
    });

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'APPROVED'
          ? 'Product created and published to marketplace'
          : 'Product created and submitted for Admin approval',
      productId,
      status: initialStatus,
    });
  } catch (error) {
    next(error);
  }
}

// Dynamic Farmer-Set Price Update (CORE REQUIREMENT)
async function updateProductPrice(req, res, next) {
  try {
    const { id } = req.params;
    const { newPrice, reason } = req.body;
    const userId = req.user.id;

    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid new selling price is required',
      });
    }

    const [products] = await db.query(
      `SELECT p.*, f.full_name as farmer_name, f.user_id as farmer_user_id
       FROM products p
       JOIN farmers f ON p.farmer_id = f.id
       WHERE p.id = ?`,
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    // Authorization: Only the owning farmer or admin can update price
    if (req.user.role === 'FARMER' && product.farmer_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only change prices for your own listed products',
      });
    }

    const oldPrice = parseFloat(product.price_per_unit);
    const updatedPrice = parseFloat(newPrice);

    // Update product price
    await db.query('UPDATE products SET price_per_unit = ? WHERE id = ?', [updatedPrice, id]);

    // Record in price_history
    await db.query(
      `INSERT INTO price_history (product_id, farmer_id, old_price, new_price, changed_by, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, product.farmer_id, oldPrice, updatedPrice, userId, reason || 'Market demand adjustment']
    );

    // Automatic Activity Log: "Farmer Ravi changed Tomato price from ₹30/kg to ₹32/kg"
    const activityDesc = `Farmer ${product.farmer_name} changed ${product.name} price from ₹${oldPrice}/${product.unit} to ₹${updatedPrice}/${product.unit}`;
    await logActivity({
      userId,
      role: req.user.role,
      activityType: ACTIVITY_TYPES.PRICE_CHANGED,
      description: activityDesc,
      productId: id,
      oldValue: oldPrice,
      newValue: updatedPrice,
    });

    res.json({
      success: true,
      message: `Price successfully updated to ₹${updatedPrice}/${product.unit}`,
      oldPrice,
      newPrice: updatedPrice,
      description: activityDesc,
    });
  } catch (error) {
    next(error);
  }
}

// Update product general details (quantity, availability, grade)
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      quantity,
      unit,
      location,
      qualityGrade,
      isAvailable,
      imageUrl,
      harvestDate,
    } = req.body;

    const [products] = await db.query(
      `SELECT p.*, f.user_id as farmer_user_id, f.full_name as farmer_name
       FROM products p
       JOIN farmers f ON p.farmer_id = f.id
       WHERE p.id = ?`,
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    if (req.user.role === 'FARMER' && product.farmer_user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this product' });
    }

    await db.query(
      `UPDATE products 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           quantity = COALESCE(?, quantity),
           unit = COALESCE(?, unit),
           location = COALESCE(?, location),
           quality_grade = COALESCE(?, quality_grade),
           is_available = COALESCE(?, is_available),
           image_url = COALESCE(?, image_url),
           harvest_date = COALESCE(?, harvest_date)
       WHERE id = ?`,
      [
        name,
        description,
        quantity !== undefined ? parseFloat(quantity) : null,
        unit,
        location,
        qualityGrade,
        isAvailable !== undefined ? (isAvailable ? 1 : 0) : null,
        imageUrl,
        harvestDate,
        id,
      ]
    );

    await logActivity({
      userId,
      role: req.user.role,
      activityType: ACTIVITY_TYPES.PRODUCT_UPDATED,
      description: `Product ${product.name} updated by ${req.user.role === 'ADMIN' ? 'Admin' : product.farmer_name}`,
      productId: id,
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Delete or remove product
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [products] = await db.query(
      `SELECT p.*, f.user_id as farmer_user_id, f.full_name as farmer_name
       FROM products p
       JOIN farmers f ON p.farmer_id = f.id
       WHERE p.id = ?`,
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    if (req.user.role === 'FARMER' && product.farmer_user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this product' });
    }

    await db.query("UPDATE products SET status = 'REMOVED', is_available = 0 WHERE id = ?", [id]);

    await logActivity({
      userId,
      role: req.user.role,
      activityType: req.user.role === 'ADMIN' ? ACTIVITY_TYPES.PRODUCT_REMOVED : ACTIVITY_TYPES.PRODUCT_DELETED,
      description: `Product ${product.name} removed from marketplace`,
      productId: id,
    });

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Get product categories list
async function getCategories(req, res, next) {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductPrice,
  updateProduct,
  deleteProduct,
  getCategories,
};
