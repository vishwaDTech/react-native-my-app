const express = require('express');
const { 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and restricted to Admin/SuperAdmin
router.use(protect);
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
