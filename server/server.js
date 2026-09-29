require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const activityRoutes = require('./routes/activityRoutes');

const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AgriConnect REST API Server',
    databaseMode: db.isFallbackMode() ? 'Embedded Local Engine' : 'MySQL Database',
    timestamp: new Date().toISOString(),
  });
});

// REST API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/activities', activityRoutes);
app.use('/api/admin', adminRoutes);

// Static client build serving for production / unified full-stack execution
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`   AGRICONNECT BACKEND SERVER RUNNING ON PORT ${PORT} `);
  console.log(`   Health Check: http://localhost:${PORT}/api/health `);
  console.log('====================================================');
});

module.exports = app;
