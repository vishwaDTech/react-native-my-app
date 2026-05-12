const express = require('express');
const {
    getNotifications,
    markAsRead,
    getUnreadCount
} = require('../controllers/notificationController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/:id/read', markAsRead);

module.exports = router;
