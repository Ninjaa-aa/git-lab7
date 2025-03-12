// user-service/server.js
const express = require('express');
const userRoutes = require('./routes/user.routes');
const connectDB = require('../config/database');

const app = express();
app.use(express.json());
app.use(userRoutes);

// Connect to MongoDB before starting the server
connectDB('userService').then(() => {
  app.listen(3001, () => {
    console.log('User Service running on port 3001');
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});