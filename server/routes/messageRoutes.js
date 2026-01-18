const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(sendMessage)
  .get(protect, getMessages);

router.route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

module.exports = router;
