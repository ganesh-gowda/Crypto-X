# Email Verification & 2FA Setup Guide

## Features Implemented

### ✅ Email Verification System
- **Verification on Signup**: Automatic verification email sent when users register
- **Token-based Verification**: Secure 24-hour expiring tokens
- **Resend Verification**: Users can resend verification email from banner
- **Verification Banner**: Yellow banner shown to unverified users
- **Email Templates**: Professional HTML emails with branding

### ✅ Two-Factor Authentication (2FA)
- **TOTP Support**: Works with Google Authenticator, Authy, Microsoft Authenticator
- **QR Code Generation**: Easy setup by scanning QR code
- **Manual Entry**: Alternative secret key for manual entry
- **8 Backup Codes**: Emergency access codes
- **Backup Code Management**: Download and regenerate codes
- **2FA Login Flow**: Modal appears after password verification
- **Enable/Disable**: Full control with password confirmation

## File Structure

### Backend Files Created/Modified
```
server/
├── models/
│   └── User.js (Modified - Added email & 2FA fields)
├── routes/
│   ├── auth.js (Modified - Added email verification on signup, 2FA login)
│   ├── emailVerification.js (NEW)
│   └── twoFactor.js (NEW)
├── services/
│   └── emailService.js (NEW)
└── index.js (Modified - Added new routes)
```

### Frontend Files Created/Modified
```
src/
├── pages/
│   ├── VerifyEmail.jsx (NEW)
│   ├── TwoFactorSettings.jsx (NEW)
│   └── Login.jsx (Modified - Added 2FA flow)
├── components/
│   ├── VerificationBanner.jsx (NEW)
│   ├── TwoFactorModal.jsx (NEW)
│   └── Navbar.jsx (Modified - Added Security Settings link)
├── context/
│   └── AuthContext.jsx (Modified - Handle 2FA response)
└── App.jsx (Modified - Added new routes & banner)
```

## User Model Updates

### New Fields Added
```javascript
{
  emailVerified: Boolean,              // Email verification status
  verificationToken: String,           // Verification token
  verificationTokenExpires: Date,      // Token expiry
  twoFactorEnabled: Boolean,           // 2FA status
  twoFactorSecret: String,             // TOTP secret
  backupCodes: [{                      // Emergency codes
    code: String,
    used: Boolean
  }]
}
```

## API Endpoints

### Email Verification
- `POST /api/verify/send` - Send verification email (Private)
- `POST /api/verify/confirm` - Verify email with token (Public)
- `GET /api/verify/status` - Check verification status (Private)

### Two-Factor Authentication
- `POST /api/2fa/setup` - Generate QR code & secret (Private)
- `POST /api/2fa/verify` - Verify code & enable 2FA (Private)
- `POST /api/2fa/verify-login` - Verify 2FA on login (Public)
- `POST /api/2fa/disable` - Disable 2FA (Private)
- `GET /api/2fa/status` - Check 2FA status (Private)
- `GET /api/2fa/backup-codes` - Get backup codes (Private)
- `POST /api/2fa/regenerate-backup-codes` - Regenerate codes (Private)

### Auth Routes Modified
- `POST /api/auth/register` - Now sends verification email
- `POST /api/auth/login` - Returns `requiresTwoFactor` flag if 2FA enabled
- `POST /api/auth/login-2fa` - Complete login after 2FA verification

## Email Configuration

### Development Mode (Current)
Emails are logged to console. No SMTP configuration required.

Console output example:
```
📧 Email would be sent:
To: user@example.com
Subject: Verify Your Email - CryptoX
HTML: [email content]
```

### Production Setup (Optional)

Add to `.env`:
```env
# Gmail Example
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=CryptoX <noreply@cryptox.com>
FRONTEND_URL=https://your-domain.com
```

#### Gmail Setup Steps:
1. Enable 2-Step Verification in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `EMAIL_PASSWORD`

#### SendGrid Alternative:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

## User Flow Diagrams

### Registration Flow
```
1. User fills signup form
   ↓
2. Account created in database
   ↓
3. Verification email sent (logged to console in dev)
   ↓
4. User redirected to home with yellow banner
   ↓
5. User clicks verification link from email
   ↓
6. Email verified, redirected to home
```

### 2FA Setup Flow
```
1. User navigates to Security Settings
   ↓
2. Clicks "Enable 2FA"
   ↓
3. QR code generated & displayed
   ↓
4. User scans with authenticator app
   ↓
5. User enters 6-digit code
   ↓
6. 8 backup codes generated & displayed
   ↓
7. User downloads backup codes
   ↓
8. 2FA enabled, email notification sent
```

### Login Flow with 2FA
```
1. User enters email & password
   ↓
2. Backend checks if 2FA enabled
   ↓
3a. No 2FA: Login complete
   ↓
3b. 2FA enabled: Show 2FA modal
   ↓
4. User enters TOTP code or backup code
   ↓
5. Code verified
   ↓
6. JWT token issued, login complete
```

## Testing Instructions

### Test Email Verification
1. Start server: `cd server && node index.js`
2. Start frontend: `npm run dev`
3. Create new account at `/signup`
4. Check server console for verification link
5. Copy verification link and paste in browser
6. Verify "Email verified successfully" message

### Test 2FA Setup
1. Login to your account
2. Click user menu → "Security Settings"
3. Click "Enable 2FA"
4. Download Google Authenticator app
5. Scan QR code or enter secret key manually
6. Enter 6-digit code from app
7. Save backup codes in secure location
8. Logout and login again
9. Enter 2FA code when prompted

### Test Backup Codes
1. Complete 2FA setup
2. Logout
3. Login with email & password
4. In 2FA modal, click "Use backup code instead"
5. Enter one of your backup codes
6. Verify code is marked as "used" in settings

### Test Email Resend
1. Create account (unverified)
2. Yellow banner appears at top
3. Click "Resend Email" button
4. Check console for new verification email
5. Success message shows in banner

## Security Features

### Email Verification
- ✅ 24-hour token expiry
- ✅ Secure random token generation (32 bytes)
- ✅ One-time use tokens
- ✅ Verification status stored in user model

### Two-Factor Authentication
- ✅ TOTP with 30-second time window
- ✅ Window tolerance of ±2 time steps
- ✅ Secure secret generation (32 characters)
- ✅ 8 backup codes (8 hex characters each)
- ✅ One-time use backup codes
- ✅ Password required to disable 2FA
- ✅ Password required to regenerate backup codes
- ✅ Email notification on 2FA enable

## Customization Options

### Email Templates
Edit `server/services/emailService.js` to customize:
- Email styling (HTML/CSS)
- Company branding
- Email content
- Links and CTAs

### 2FA Settings
Modify in `server/routes/twoFactor.js`:
- Number of backup codes (default: 8)
- Secret length (default: 32)
- Time window tolerance (default: ±2)
- TOTP issuer name

### UI Customization
- `VerificationBanner.jsx` - Banner colors & text
- `TwoFactorSettings.jsx` - Settings page layout
- `TwoFactorModal.jsx` - Login modal styling
- `VerifyEmail.jsx` - Verification page design

## Troubleshooting

### Email Not Sending (Production)
1. Check SMTP credentials in `.env`
2. Verify EMAIL_HOST and EMAIL_PORT
3. Check firewall/port blocking
4. Test with Gmail App Password first
5. Check spam folder for test emails

### 2FA Code Not Working
1. Ensure device time is synced
2. Check time zone on server
3. Try backup code instead
4. Regenerate secret if persistent issues

### Can't Access Account
1. Use backup codes to login
2. Contact admin to disable 2FA
3. Reset password if needed

### Verification Link Expired
1. Click "Resend Email" in banner
2. Check new email (console in dev)
3. Links expire after 24 hours

## NPM Packages Used

```json
{
  "nodemailer": "^6.9.8",      // Email sending
  "speakeasy": "^2.0.0",       // TOTP generation
  "qrcode": "^1.5.3"           // QR code generation
}
```

## Production Checklist

Before deploying to production:

- [ ] Configure real SMTP service (Gmail/SendGrid)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Test email delivery end-to-end
- [ ] Enable HTTPS for email links
- [ ] Test 2FA with multiple authenticator apps
- [ ] Backup user secrets securely
- [ ] Set up email monitoring/logging
- [ ] Add rate limiting to verification endpoints
- [ ] Test backup code recovery flow
- [ ] Document emergency access procedures

## Features Not Yet Implemented

Optional future enhancements:
- ❌ SMS verification via Twilio
- ❌ Email verification required to access premium features
- ❌ Remember device for 30 days
- ❌ Push notification 2FA
- ❌ Hardware key (WebAuthn) support
- ❌ Password reset flow
- ❌ Email change verification

## Support

For issues or questions:
1. Check server console for error logs
2. Verify `.env` configuration
3. Test with console email logging first
4. Review API endpoint responses

---

✅ **Implementation Complete!**

Both Email Verification and Two-Factor Authentication are fully functional and ready to use in development mode. Configure SMTP settings when ready for production.
