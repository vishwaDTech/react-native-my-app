const express = require('express');
const {
    createBooking,
    getMyBookings,
    getBookings,
    updateBooking
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(authorize('admin', 'superadmin'), getBookings)
    .post(createBooking);

router.get('/my', getMyBookings);

router.put('/:id', authorize('admin', 'superadmin'), updateBooking);

module.exports = router;
