const Message = require('../models/Message');
const { sendReplyEmail } = require('../utils/emailService');

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
      
      // Update reply fields if provided
      if (req.body.reply) {
        message.reply = req.body.reply;
      }
      if (req.body.repliedAt) {
        message.repliedAt = req.body.repliedAt;
      }
      
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a message (send email)
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
const replyToMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!replyText) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    // Send email
    try {
      await sendReplyEmail({
        to: message.email,
        subject: message.subject,
        replyText: replyText,
        originalMessage: message.message,
        senderName: message.name
      });

      // Update message status
      message.status = 'replied';
      message.reply = replyText;
      message.repliedAt = new Date();
      await message.save();

      res.json({
        success: true,
        message: 'Reply sent successfully',
        data: message
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ 
        message: 'Failed to send email. Please check your email configuration.',
        error: emailError.message 
      });
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
  replyToMessage,
  deleteMessage
};
