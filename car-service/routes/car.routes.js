// car.routes.js
const express = require('express');
const carController = require('../controllers/car.controller');

const router = express.Router();

router.post('/cars', carController.addCar);
router.get('/cars', carController.getAllCars);
router.get('/cars/:carId', carController.getCar);
router.put('/cars/:carId', carController.updateCar);

module.exports = router;