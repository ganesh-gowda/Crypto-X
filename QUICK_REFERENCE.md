# 🔐 Quick Reference: Email Verification & 2FA

## 🚀 How to Test

### Start the Application
```powershell
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend  
npm run dev
```

### Test Email Verification
1. **Sign Up**: Go to http://localhost:5174/signup
2. **Check Console**: Server console shows verification email
3. **Copy Link**: Get verification URL from console output
4. **Verify**: Paste link in browser → Email verified!
5. **Resend**: Click "Resend Email" in yellow banner if needed

### Test 2FA Setup
1. **Login**: Login to your account
2. **Settings**: Click user menu → "Security Settings"
3. **Enable**: Click "Enable 2FA" button
4. **Scan QR**: Use Google Authenticator/Authy to scan
5. **Verify**: Enter 6-digit code from app
6. **Save Codes**: Download your 8 backup codes
7. **Done**: 2FA is now active!

### Test 2FA Login
1. **Logout**: Click logout in menu
2. **Login**: Enter email & password
3. **2FA Modal**: Modal appears asking for code
4. **Enter Code**: Type 6-digit code from authenticator app
5. **Success**: You're logged in!

## 📱 Authenticator Apps

Download any of these (free):
- **Google Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **Microsoft Authenticator** (iOS/Android)

## 🔑 Key URLs

| Feature | URL | Auth Required |
|---------|-----|---------------|
| Email Verification | `/verify-email?token=...` | No |
| Security Settings | `/settings/2fa` | Yes |
| Login | `/login` | No |
| Signup | `/signup` | No |

## 📧 Email Configuration (Optional)

For production, add to `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=CryptoX <noreply@cryptox.com>
FRONTEND_URL=https://your-domain.com
```

**Gmail App Password**: https://myaccount.google.com/apppasswords

## 🛡️ Security Features

### Email Verification
- ✅ Automatic email on signup
- ✅ 24-hour token expiry
- ✅ Resend capability
- ✅ Yellow banner for unverified users

### Two-Factor Authentication
- ✅ TOTP with authenticator apps
- ✅ QR code for easy setup
- ✅ 8 backup codes
- ✅ Download codes as .txt file
- ✅ Regenerate codes anytime
- ✅ Disable with password confirmation

## 🎯 User Journey

### New User
```
Signup → Verify Email → Login → Enable 2FA → Login with 2FA
```

### Existing User
```
Login → Security Settings → Enable 2FA → Done
```

### Lost Authenticator
```
Login → Use Backup Code → Security Settings → Regenerate Codes
```

## 📝 Important Notes

1. **Development Mode**: Emails logged to console (no SMTP needed)
2. **Backup Codes**: Save them! Each code works only once
3. **Time Sync**: Ensure device time is accurate for TOTP codes
4. **2FA Optional**: Users can choose to enable or not
5. **Email Banner**: Shows only to unverified users

## 🔧 API Endpoints

### Email Verification
```
POST   /api/verify/send        - Send verification email
POST   /api/verify/confirm     - Verify email token
GET    /api/verify/status      - Check verification status
```

### 2FA
```
POST   /api/2fa/setup                  - Generate QR code
POST   /api/2fa/verify                 - Enable 2FA
POST   /api/2fa/verify-login           - Verify on login
POST   /api/2fa/disable                - Disable 2FA
GET    /api/2fa/status                 - Check status
GET    /api/2fa/backup-codes           - Get backup codes
POST   /api/2fa/regenerate-backup-codes - New backup codes
```

### Auth
```
POST   /api/auth/register      - Signup (sends verification email)
POST   /api/auth/login         - Login (returns 2FA flag if enabled)
POST   /api/auth/login-2fa     - Complete 2FA login
GET    /api/auth/me            - Get current user
```

## 🎨 UI Components

| Component | Purpose |
|-----------|---------|
| `VerificationBanner` | Yellow banner at top when unverified |
| `VerifyEmail` | Email verification page |
| `TwoFactorSettings` | Complete 2FA management page |
| `TwoFactorModal` | 2FA code input during login |

## 🐛 Troubleshooting

### Email Link Expired
- Click "Resend Email" in banner
- Links expire after 24 hours

### 2FA Code Not Working
- Check device time is synced
- Try backup code instead
- Ensure 6 digits entered

### Can't Access Account
- Use backup codes to login
- Have admin disable 2FA
- Check caps lock for backup codes

### Verification Banner Won't Disappear
- Complete email verification first
- Refresh page after verification
- Check `emailVerified` field in database

## ✨ Features Highlights

1. **Professional Emails**: HTML templates with gradient headers
2. **Smart Fallback**: Console logging when SMTP not configured
3. **User-Friendly**: Clear instructions and error messages
4. **Secure**: Token expiry, one-time use, password confirmations
5. **Mobile Ready**: Works on all authenticator apps
6. **Flexible**: Optional features, users control security level

## 🚀 Next Steps (Optional)

Future enhancements you could add:
- SMS verification via Twilio
- Remember device for 30 days
- Email change verification
- Password reset flow
- Account recovery options
- Security audit log

---

**Status**: ✅ Fully Implemented & Ready to Use

See `EMAIL_2FA_GUIDE.md` for complete documentation.
