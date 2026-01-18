const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages (for admin)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.status = req.body.status || message.status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
};
