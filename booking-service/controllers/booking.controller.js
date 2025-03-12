const Booking = require('../models/booking.model');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CAR_SERVICE_URL = process.env.CAR_SERVICE_URL || 'http://localhost:3002';

exports.createBooking = async (req, res) => {
  try {
    const { userId, carId, startDate, endDate } = req.body;

    // Check user's active bookings
    const userResponse = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    const user = userResponse.data;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.activeBookings >= user.maxBookings) {
      return res.status(400).json({ message: 'Booking limit reached' });
    }

    // Check car availability
    const carResponse = await axios.get(`${CAR_SERVICE_URL}/cars/${carId}`);
    const car = carResponse.data;
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    if (!car.isAvailable) {
      return res.status(400).json({ message: 'Car not available' });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      status: 'active'
    });

    try {
      // Update user's active bookings
      await axios.put(`${USER_SERVICE_URL}/users/${userId}`, {
        activeBookings: user.activeBookings + 1
      });

      // Update car availability
      await axios.put(`${CAR_SERVICE_URL}/cars/${carId}`, {
        isAvailable: false
      });

      res.status(201).json(booking);
    } catch (error) {
      // If updating related services fails, delete the booking
      await Booking.findByIdAndDelete(booking._id);
      
      // Attempt to rollback any successful updates
      try {
        if (user.activeBookings > 0) {
          await axios.put(`${USER_SERVICE_URL}/users/${userId}`, {
            activeBookings: user.activeBookings
          });
        }
        await axios.put(`${CAR_SERVICE_URL}/cars/${carId}`, {
          isAvailable: true
        });
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      throw new Error('Failed to update services');
    }
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    // First verify user exists
    const userResponse = await axios.get(`${USER_SERVICE_URL}/users/${req.params.userId}`);
    if (!userResponse.data) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ userId: req.params.userId });
    
    // Fetch car details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const carResponse = await axios.get(`${CAR_SERVICE_URL}/cars/${booking.carId}`);
          return {
            ...booking.toObject(),
            car: carResponse.data
          };
        } catch (error) {
          return {
            ...booking.toObject(),
            car: { error: 'Car details not available' }
          };
        }
      })
    );

    res.json(bookingsWithDetails);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Get current user and car status
    const [userResponse, carResponse] = await Promise.all([
      axios.get(`${USER_SERVICE_URL}/users/${booking.userId}`),
      axios.get(`${CAR_SERVICE_URL}/cars/${booking.carId}`)
    ]);

    const user = userResponse.data;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    try {
      // Update user's active bookings and car availability
      await Promise.all([
        axios.put(`${USER_SERVICE_URL}/users/${booking.userId}`, {
          activeBookings: Math.max(0, user.activeBookings - 1)
        }),
        axios.put(`${CAR_SERVICE_URL}/cars/${booking.carId}`, {
          isAvailable: true
        })
      ]);

      res.json(booking);
    } catch (error) {
      // Rollback booking status if service updates fail
      booking.status = 'active';
      await booking.save();
      
      throw new Error('Failed to update services');
    }
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};