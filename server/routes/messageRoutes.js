const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
  replyToMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(sendMessage)
  .get(protect, getMessages);

router.route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

router.route('/:id/reply')
  .post(protect, replyToMessage);

module.exports = router;
