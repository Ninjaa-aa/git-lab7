// car.controller.js
const Car = require('../models/car.model');

exports.addCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const { available, model, year } = req.query;
    let query = {};
    
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }
    if (model) {
      query.model = { $regex: model, $options: 'i' };
    }
    if (year) {
      query.year = parseInt(year);
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.carId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).json({ message: error.message });
  }
};