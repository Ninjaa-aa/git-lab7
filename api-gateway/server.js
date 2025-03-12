const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy middleware for routing
app.use('/users', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/cars', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/bookings', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

// Start the gateway
app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});