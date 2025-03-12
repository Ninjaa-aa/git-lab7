// car.model.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  licensePlate: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Car', carSchema);