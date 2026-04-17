# Email Setup Guide for Reply Functionality

This guide will help you set up email sending so you can reply to messages directly from your portfolio admin panel.

## Step 1: Install Nodemailer

Run this command in the `server` directory:

```bash
cd server
npm install nodemailer
```

## Step 2: Configure Email Settings

Add these environment variables to your `server/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Your Name
```

## Step 3: Get Gmail App Password (Recommended)

If you're using Gmail, you need to create an App Password:

### For Gmail:
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. After enabling 2-Step Verification, go back to Security
5. Scroll down to "2-Step Verification" section
6. Click on "App passwords"
7. Select "Mail" and "Other (Custom name)"
8. Enter "Portfolio Admin" as the name
9. Click "Generate"
10. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)
11. Use this password in your `.env` file as `EMAIL_PASSWORD`

### Example `.env` configuration:
```env
EMAIL_USER=bosona@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=Bosona Gosaye
```

## Step 4: Alternative Email Services

### Using Outlook/Hotmail:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM_NAME=Your Name
```

Update `server/utils/emailService.js` line 6:
```javascript
service: 'outlook', // Change from 'gmail' to 'outlook'
```

### Using Yahoo:
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Your Name
```

Update `server/utils/emailService.js` line 6:
```javascript
service: 'yahoo', // Change from 'gmail' to 'yahoo'
```

### Using Custom SMTP (Any Email Provider):
```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM_NAME=Your Name
```

Update `server/utils/emailService.js`:
```javascript
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};
```

## Step 5: Test the Setup

1. Restart your server:
   ```bash
   cd server
   npm run dev
   ```

2. Go to your admin panel Messages section
3. Select a message
4. Click "Reply" button
5. Type your reply
6. Click "Send Reply"
7. Check if the email was sent successfully

## Step 6: Deploy to Production

### For Render:
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASSWORD`: your-app-password
   - `EMAIL_FROM_NAME`: Your Name
5. Click "Save Changes"
6. Render will automatically redeploy

### For Vercel (if using serverless functions):
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the same variables
4. Redeploy your project

## Troubleshooting

### Error: "Invalid login"
- Make sure you're using an App Password, not your regular password
- Check that 2-Step Verification is enabled for Gmail
- Verify the email and password are correct

### Error: "Connection timeout"
- Check your internet connection
- Try a different email service
- Check if your hosting provider blocks SMTP ports

### Error: "Failed to send email"
- Check server logs for detailed error message
- Verify all environment variables are set correctly
- Make sure nodemailer is installed: `npm list nodemailer`

### Emails going to spam:
- Add SPF and DKIM records to your domain (if using custom domain)
- Use a professional email service
- Avoid spam trigger words in your replies

## Security Best Practices

1. **Never commit `.env` file to Git**
   - Already in `.gitignore`
   - Keep passwords secret

2. **Use App Passwords**
   - Don't use your main email password
   - App passwords are more secure

3. **Rotate passwords regularly**
   - Change app passwords every few months
   - Revoke unused app passwords

4. **Monitor email sending**
   - Check for unusual activity
   - Set up email sending limits

## Email Template Customization

To customize the email template, edit `server/utils/emailService.js`:

- Change colors in the CSS
- Modify the HTML structure
- Add your logo or branding
- Customize the message format

## Rate Limiting

Gmail has sending limits:
- Free Gmail: 500 emails/day
- Google Workspace: 2000 emails/day

If you need more, consider:
- SendGrid (12,000 free emails/month)
- Mailgun (5,000 free emails/month)
- Amazon SES (62,000 free emails/month)

## Support

If you encounter issues:
1. Check the server console for error messages
2. Verify environment variables are set
3. Test with a simple email first
4. Check email service status pages

---

## Quick Start Checklist

- [ ] Install nodemailer: `npm install nodemailer`
- [ ] Add EMAIL_USER to `.env`
- [ ] Add EMAIL_PASSWORD to `.env`
- [ ] Add EMAIL_FROM_NAME to `.env`
- [ ] Enable 2-Step Verification (Gmail)
- [ ] Generate App Password (Gmail)
- [ ] Restart server
- [ ] Test sending a reply
- [ ] Add environment variables to production (Render)
- [ ] Redeploy backend

Once completed, you can reply to messages directly from your admin panel, and emails will be sent automatically!
