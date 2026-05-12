const express = require('express');
const {
    getDestinations,
    getDestination,
    createDestination,
    updateDestination,
    deleteDestination
} = require('../controllers/destinationController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getDestinations)
    .post(protect, authorize('admin', 'superadmin'), createDestination);

router
    .route('/:id')
    .get(getDestination)
    .put(protect, authorize('admin', 'superadmin'), updateDestination)
    .delete(protect, authorize('admin', 'superadmin'), deleteDestination);

module.exports = router;
