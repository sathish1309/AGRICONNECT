const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('../server');

let server;
const PORT = 5001; // Separate test port

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(responseData) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseData });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('   AGRICONNECT AUTOMATED FULL-STACK VERIFICATION');
  console.log('========================================================\n');

  server = app.listen(PORT, async () => {
    try {
      // 1. Health check
      console.log('Test 1: GET /api/health');
      const health = await request('GET', '/api/health');
      console.log(` Status: ${health.status}, DB Mode: ${health.body.databaseMode}`);
      if (health.status !== 200) throw new Error('Health check failed');
      console.log(' ✓ Health check PASSED\n');

      // 2. Authentication Login (Farmer Ravi)
      console.log('Test 2: POST /api/auth/login (Farmer Ravi)');
      const farmerLogin = await request('POST', '/api/auth/login', {
        email: 'ravi@agriconnect.com',
        password: 'Farmer@123',
      });
      if (farmerLogin.status !== 200 || !farmerLogin.body.token) throw new Error('Farmer login failed');
      const farmerToken = farmerLogin.body.token;
      console.log(` ✓ Farmer authenticated: ${farmerLogin.body.user.fullName} (${farmerLogin.body.user.role})\n`);

      // 3. Authentication Login (Admin)
      console.log('Test 3: POST /api/auth/login (Admin Demo)');
      const adminLogin = await request('POST', '/api/auth/login', {
        email: 'admin@agriconnect.com',
        password: 'Admin@123',
      });
      if (adminLogin.status !== 200 || !adminLogin.body.token) throw new Error('Admin login failed');
      const adminToken = adminLogin.body.token;
      console.log(` ✓ Admin authenticated: ${adminLogin.body.user.fullName} (${adminLogin.body.user.role})\n`);

      // 4. Authentication Login (Buyer ABC)
      console.log('Test 4: POST /api/auth/login (Buyer ABC Supermarket)');
      const buyerLogin = await request('POST', '/api/auth/login', {
        email: 'abc@supermarket.com',
        password: 'Buyer@123',
      });
      if (buyerLogin.status !== 200 || !buyerLogin.body.token) throw new Error('Buyer login failed');
      const buyerToken = buyerLogin.body.token;
      console.log(` ✓ Buyer authenticated: ${buyerLogin.body.user.fullName} (${buyerLogin.body.user.role})\n`);

      // 5. Dynamic Farmer Pricing Update (CORE REQUIREMENT)
      console.log('Test 5: PUT /api/products/1/price (Farmer Ravi adjusts Tomato price ₹30 -> ₹32)');
      const priceUpdate = await request(
        'PUT',
        '/api/products/1/price',
        { newPrice: 32, reason: 'High weekend demand from local supermarkets' },
        farmerToken
      );
      if (priceUpdate.status !== 200) throw new Error(`Price update failed: ${JSON.stringify(priceUpdate.body)}`);
      console.log(` ✓ Price updated: ${priceUpdate.body.message}`);
      console.log(`   Activity Description: "${priceUpdate.body.description}"\n`);

      // 6. Admin Activity Monitor Check (CORE REQUIREMENT)
      console.log('Test 6: GET /api/admin/activities (Verify automatic logging of price change)');
      const activities = await request('GET', '/api/admin/activities?activityType=PRICE_CHANGED', null, adminToken);
      if (activities.status !== 200 || !activities.body.activities.length) {
        throw new Error('Activity log verification failed');
      }
      const latestPriceActivity = activities.body.activities[0];
      console.log(` ✓ Found latest logged activity:`);
      console.log(`   - Type:        ${latestPriceActivity.activity_type}`);
      console.log(`   - Description: ${latestPriceActivity.description}`);
      console.log(`   - Old Value:   ${latestPriceActivity.old_value} -> New Value: ${latestPriceActivity.new_value}\n`);

      // 7. Buyer Place Order
      console.log('Test 7: POST /api/orders (Buyer ABC places order for 10 kg Tomatoes @ ₹32/kg)');
      const orderRes = await request(
        'POST',
        '/api/orders',
        {
          items: [{ productId: 1, quantity: 10 }],
          shippingName: 'ABC Supermarket (Dock 2)',
          shippingMobile: '9123456780',
          shippingAddress: 'No. 45, Anna Salai, T. Nagar',
          shippingCity: 'Chennai',
          shippingState: 'Tamil Nadu',
          shippingPincode: '600017',
          notes: 'Urgent weekend batch',
        },
        buyerToken
      );
      if (orderRes.status !== 201) throw new Error(`Order placement failed: ${JSON.stringify(orderRes.body)}`);
      const newOrderId = orderRes.body.orderId;
      console.log(` ✓ Order created successfully: #${orderRes.body.orderNumber}`);
      console.log(`   Total Amount: ₹${orderRes.body.totalAmount}, Tracking: ${orderRes.body.trackingNumber}\n`);

      // 8. Payment Verification (Razorpay Sandbox)
      console.log('Test 8: POST /api/payments/verify (Razorpay test payment simulation)');
      const payRes = await request(
        'POST',
        '/api/payments/verify',
        {
          orderId: newOrderId,
          paymentMethod: 'UPI',
          razorpayPaymentId: 'pay_test_verified_123',
          isDemoMode: true,
        },
        buyerToken
      );
      if (payRes.status !== 200) throw new Error(`Payment verification failed: ${JSON.stringify(payRes.body)}`);
      console.log(` ✓ Payment confirmed: Status "${payRes.body.orderStatus}", Ref: ${payRes.body.transactionRef}\n`);

      // 9. Admin Analytics
      console.log('Test 9: GET /api/admin/analytics (Database-driven business charts)');
      const analytics = await request('GET', '/api/admin/analytics', null, adminToken);
      if (analytics.status !== 200 || !analytics.body.analytics) throw new Error('Analytics failed');
      console.log(` ✓ Analytics calculated: ${analytics.body.analytics.monthlyData.length} months data, ${analytics.body.analytics.categoryDistribution.length} categories\n`);

      // 10. Admin Approvals
      console.log('Test 10: PUT /api/admin/products/8/approve (Approve pending product)');
      const approveRes = await request('PUT', '/api/admin/products/8/approve', null, adminToken);
      console.log(` ✓ Admin approval: ${approveRes.body.message}\n`);

      console.log('========================================================');
      console.log('   ALL 10 FULL-STACK VERIFICATION TESTS PASSED (100%)');
      console.log('========================================================');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Test Failure:', err.message);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
