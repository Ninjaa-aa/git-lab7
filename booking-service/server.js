// booking-service/server.js
const express = require('express');
const bookingRoutes = require('./routes/booking.routes');
const connectDB = require('../config/database');

const app = express();
app.use(express.json());
app.use(bookingRoutes);

// Connect to MongoDB before starting the server
connectDB('bookingService').then(() => {
  app.listen(3003, () => {
    console.log('Booking Service running on port 3003');
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});