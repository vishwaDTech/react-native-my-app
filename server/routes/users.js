const express = require('express');
const { 
    getUsers, 
    createUser, 
    createAdmin,
    updateUser, 
    deleteUser,
    toggleFavorite,
    getFavorites
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and restricted to Admin/SuperAdmin
router.use(protect);

router.post('/create-admin', authorize('superadmin'), createAdmin);

router.get('/favorites', getFavorites);
router.post('/favorites/:destinationId', toggleFavorite);

router.use(authorize('admin', 'superadmin'));

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
