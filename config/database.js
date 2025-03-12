// config/database.js
const mongoose = require('mongoose');

const connectDB = async (serviceName) => {
  try {
    const conn = await mongoose.connect(`mongodb://localhost:27017/${serviceName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
