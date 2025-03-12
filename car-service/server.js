// car-service/server.js
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const carRoutes = require('./routes/car.routes');

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// Routes
app.use(carRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/carService', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(3002, () => {
    console.log('Car Service running on port 3002');
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});