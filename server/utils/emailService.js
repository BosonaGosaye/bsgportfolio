const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
  });
};

// Send reply email
const sendReplyEmail = async ({ to, subject, replyText, originalMessage, senderName }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Portfolio Admin'}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Re: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .reply-box {
              background: white;
              padding: 20px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .original-message {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 14px;
              color: #6b7280;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
            .signature {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              font-style: italic;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Reply to Your Message</h1>
          </div>
          
          <div class="content">
            <p>Hi ${senderName},</p>
            <p>Thank you for reaching out! Here's my response to your message:</p>
            
            <div class="reply-box">
              ${replyText.replace(/\n/g, '<br>')}
            </div>
            
            <div class="original-message">
              <strong>Your Original Message:</strong><br>
              <em>"${originalMessage}"</em>
            </div>
            
            <div class="signature">
              <p>Best regards,<br>
              ${process.env.EMAIL_FROM_NAME || 'Portfolio Admin'}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent in response to your message submitted through the portfolio contact form.</p>
            <p>Please do not reply to this email directly. If you have further questions, please use the contact form.</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendReplyEmail };
