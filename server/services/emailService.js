import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For development, use Ethereal email (fake SMTP service)
  // In production, replace with your actual email service (Gmail, SendGrid, etc.)
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Fallback to console logging in development
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('HTML:', mailOptions.html);
      console.log('Text:', mailOptions.text);
      return { messageId: 'console-logged' };
    },
  };
};

const transporter = createTransporter();

// Send verification email
export const sendVerificationEmail = async (email, username, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CryptoX <noreply@cryptox.com>',
    to: email,
    subject: 'Verify Your Email - CryptoX',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to CryptoX!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thanks for signing up! Please verify your email address to get started with tracking your crypto portfolio.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with CryptoX, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 CryptoX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${username},\n\nThanks for signing up! Please verify your email address by clicking this link:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account with CryptoX, you can safely ignore this email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('[Email] Error sending verification email:', error);
    throw error;
  }
};

// Send 2FA setup email notification
export const send2FAEnabledEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CryptoX <noreply@cryptox.com>',
    to: email,
    subject: 'Two-Factor Authentication Enabled - CryptoX',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #fef3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Security Alert</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Two-factor authentication has been successfully enabled on your CryptoX account.</p>
            <div class="alert">
              <strong>Important:</strong> Make sure to save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.
            </div>
            <p>If you didn't enable 2FA, please contact support immediately and change your password.</p>
          </div>
          <div class="footer">
            <p>© 2025 CryptoX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${username},\n\nTwo-factor authentication has been successfully enabled on your CryptoX account.\n\nMake sure to save your backup codes in a secure location.\n\nIf you didn't enable 2FA, please contact support immediately.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] 2FA enabled email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('[Email] Error sending 2FA email:', error);
    throw error;
  }
};

// Send password reset email (for future use)
export const sendPasswordResetEmail = async (email, username, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CryptoX <noreply@cryptox.com>',
    to: email,
    subject: 'Reset Your Password - CryptoX',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 CryptoX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${username},\n\nWe received a request to reset your password. Click this link to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('[Email] Error sending password reset email:', error);
    throw error;
  }
};
