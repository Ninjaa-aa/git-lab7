const express = require('express');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:userId', bookingController.getBookingsByUser);
router.delete('/bookings/:bookingId', bookingController.cancelBooking);

module.exports = router;