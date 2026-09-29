const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../config/jwt');
const { logActivity } = require('../services/activityLogger');
const { ACTIVITY_TYPES } = require('../utils/constants');

// Register Farmer
async function registerFarmer(req, res, next) {
  try {
    const {
      email,
      password,
      fullName,
      mobile,
      address,
      villageCity,
      state,
      pincode,
      farmSize,
      primaryCrops,
    } = req.body;

    if (!email || !password || !fullName || !mobile || !address || !villageCity || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required farmer registration fields',
      });
    }

    // Check duplicate email
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await db.query(
      'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
      [email.toLowerCase().trim(), passwordHash, 'FARMER', 'ACTIVE']
    );
    const userId = userResult.insertId;

    // Insert farmer profile
    const [farmerResult] = await db.query(
      `INSERT INTO farmers (user_id, full_name, mobile, address, village_city, state, pincode, farm_size, primary_crops, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        fullName.trim(),
        mobile.trim(),
        address.trim(),
        villageCity.trim(),
        state.trim(),
        pincode.trim(),
        farmSize || null,
        primaryCrops || null,
        true,
      ]
    );

    // Log activity
    await logActivity({
      userId,
      role: 'FARMER',
      activityType: ACTIVITY_TYPES.FARMER_REGISTERED,
      description: `Farmer ${fullName} registered from ${villageCity}, ${state}`,
    });

    const token = generateToken({ id: userId, email: email.toLowerCase().trim(), role: 'FARMER' });

    res.status(201).json({
      success: true,
      message: 'Farmer account registered successfully',
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        role: 'FARMER',
        fullName: fullName.trim(),
        farmerId: farmerResult.insertId,
        location: `${villageCity}, ${state}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Register Buyer
async function registerBuyer(req, res, next) {
  try {
    const {
      email,
      password,
      fullName,
      mobile,
      businessType,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (!email || !password || !fullName || !mobile || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required buyer registration fields',
      });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
      [email.toLowerCase().trim(), passwordHash, 'BUYER', 'ACTIVE']
    );
    const userId = userResult.insertId;

    const [buyerResult] = await db.query(
      `INSERT INTO buyers (user_id, full_name, mobile, business_type, address, city, state, pincode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        fullName.trim(),
        mobile.trim(),
        businessType || 'Individual',
        address.trim(),
        city.trim(),
        state.trim(),
        pincode.trim(),
      ]
    );

    // Initialize cart for buyer
    await db.query('INSERT INTO cart (buyer_id) VALUES (?)', [buyerResult.insertId]);

    // Log activity
    await logActivity({
      userId,
      role: 'BUYER',
      activityType: ACTIVITY_TYPES.BUYER_REGISTERED,
      description: `Buyer ${fullName} (${businessType || 'Individual'}) registered from ${city}, ${state}`,
    });

    const token = generateToken({ id: userId, email: email.toLowerCase().trim(), role: 'BUYER' });

    res.status(201).json({
      success: true,
      message: 'Buyer account registered successfully',
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        role: 'BUYER',
        fullName: fullName.trim(),
        buyerId: buyerResult.insertId,
        businessType: businessType || 'Individual',
      },
    });
  } catch (error) {
    next(error);
  }
}

// User Login (Farmer, Buyer, Admin)
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact AgriConnect administration.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Fetch role details
    let profile = null;
    if (user.role === 'FARMER') {
      const [farmers] = await db.query('SELECT * FROM farmers WHERE user_id = ?', [user.id]);
      if (farmers.length > 0) profile = farmers[0];
    } else if (user.role === 'BUYER') {
      const [buyers] = await db.query('SELECT * FROM buyers WHERE user_id = ?', [user.id]);
      if (buyers.length > 0) profile = buyers[0];
    } else if (user.role === 'ADMIN') {
      const [admins] = await db.query('SELECT * FROM admins WHERE user_id = ?', [user.id]);
      if (admins.length > 0) profile = admins[0];
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: profile ? profile.full_name : 'User',
        profileId: profile ? profile.id : null,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get Current User Profile
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT id, email, role, status, created_at FROM users WHERE id = ?', [userId]);

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];
    let profile = null;

    if (user.role === 'FARMER') {
      const [farmers] = await db.query('SELECT * FROM farmers WHERE user_id = ?', [userId]);
      profile = farmers[0] || null;
    } else if (user.role === 'BUYER') {
      const [buyers] = await db.query('SELECT * FROM buyers WHERE user_id = ?', [userId]);
      profile = buyers[0] || null;
    } else if (user.role === 'ADMIN') {
      const [admins] = await db.query('SELECT * FROM admins WHERE user_id = ?', [userId]);
      profile = admins[0] || null;
    }

    res.json({
      success: true,
      user: {
        ...user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Update Profile
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const data = req.body;

    if (role === 'FARMER') {
      await db.query(
        `UPDATE farmers SET full_name = ?, mobile = ?, address = ?, village_city = ?, state = ?, pincode = ?, farm_size = ?, primary_crops = ?
         WHERE user_id = ?`,
        [
          data.fullName || data.full_name,
          data.mobile,
          data.address,
          data.villageCity || data.village_city,
          data.state,
          data.pincode,
          data.farmSize || data.farm_size || null,
          data.primaryCrops || data.primary_crops || null,
          userId,
        ]
      );
    } else if (role === 'BUYER') {
      await db.query(
        `UPDATE buyers SET full_name = ?, mobile = ?, business_type = ?, address = ?, city = ?, state = ?, pincode = ?
         WHERE user_id = ?`,
        [
          data.fullName || data.full_name,
          data.mobile,
          data.businessType || data.business_type || 'Individual',
          data.address,
          data.city,
          data.state,
          data.pincode,
          userId,
        ]
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerFarmer,
  registerBuyer,
  login,
  getProfile,
  updateProfile,
};
