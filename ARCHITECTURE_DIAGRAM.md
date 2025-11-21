# 📊 System Architecture - Email Verification & 2FA

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Signup     │    │    Login     │    │  Verify      │ │
│  │   Page       │───▶│    Page      │    │  Email Page  │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│         │                    │                    │         │
│         ▼                    ▼                    │         │
│  ┌──────────────┐    ┌──────────────┐           │         │
│  │ Verification │    │ TwoFactor    │           │         │
│  │   Banner     │    │   Modal      │           │         │
│  └──────────────┘    └──────────────┘           │         │
│         │                    │                    │         │
│         │                    │                    │         │
│         │                    ▼                    │         │
│         │            ┌──────────────┐            │         │
│         │            │ TwoFactor    │            │         │
│         │            │  Settings    │            │         │
│         │            └──────────────┘            │         │
│         │                    │                    │         │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │   API Calls        │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Auth Routes  │    │   Verify     │    │    2FA       │ │
│  │              │    │   Routes     │    │   Routes     │ │
│  │ /auth/*      │    │ /verify/*    │    │  /2fa/*      │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│         │                    │                    │         │
│         ▼                    ▼                    ▼         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Email Service                          │   │
│  │  - sendVerificationEmail()                          │   │
│  │  - send2FAEnabledEmail()                            │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                         │         │
│         │                                         │         │
│         ▼                                         ▼         │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │   MongoDB    │                        │   Nodemailer │  │
│  │   User DB    │                        │   (Console)  │  │
│  └──────────────┘                        └──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Signup & Email Verification Flow

```
User                Frontend              Backend               Database          Email Service
 │                     │                     │                     │                    │
 │  Fill Signup Form   │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /auth/register│                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Create User        │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │  (emailVerified=false)                   │
 │                     │                     │                     │                    │
 │                     │                     │  Generate Token     │                    │
 │                     │                     │  (32 bytes random)  │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Send Email         │                    │
 │                     │                     ├────────────────────────────────────────▶│
 │                     │                     │                     │  Console Log      │
 │                     │                     │                     │  Verification URL │
 │                     │                     │                     │                    │
 │                     │  User + JWT Token   │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  Yellow Banner      │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │  "Verify Email"     │                     │                     │                    │
 │                     │                     │                     │                    │
 │  Copy Token from    │                     │                     │                    │
 │  Console            │                     │                     │                    │
 │                     │                     │                     │                    │
 │  Click Verify Link  │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /verify/confirm                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │  {token: "..."}     │                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Find User by Token │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │                     │                    │
 │                     │                     │  Update User        │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │  (emailVerified=true)                    │
 │                     │                     │                     │                    │
 │                     │  Success Message    │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  ✅ Verified!       │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │  (Redirect to Home) │                     │                     │                    │
```

### 2. Enable 2FA Flow

```
User                Frontend              Backend               Database          Authenticator App
 │                     │                     │                     │                    │
 │  Click Enable 2FA   │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /2fa/setup    │                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Generate Secret    │                    │
 │                     │                     │  (32 chars base32)  │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Create QR Code URL │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Save Secret        │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │  (temporary)        │                    │
 │                     │                     │                     │                    │
 │                     │  QR Code + Secret   │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  Display QR Code    │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │                     │                     │                     │                    │
 │  Scan QR Code       │                     │                     │                    │
 ├─────────────────────────────────────────────────────────────────────────────────────▶│
 │                     │                     │                     │   Add Account      │
 │                     │                     │                     │   Generate TOTP    │
 │                     │                     │                     │                    │
 │  View 6-digit Code  │                     │                     │                    │
 │◀─────────────────────────────────────────────────────────────────────────────────────┤
 │  (e.g., 123456)     │                     │                     │                    │
 │                     │                     │                     │                    │
 │  Enter Code         │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /2fa/verify   │                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │  {token: "123456"}  │                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Verify TOTP        │                    │
 │                     │                     │  (speakeasy lib)    │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Generate 8 Codes   │                    │
 │                     │                     │  (backup codes)     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Update User        │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │  twoFactorEnabled=true                   │
 │                     │                     │  backupCodes=[...]  │                    │
 │                     │                     │                     │                    │
 │                     │  Backup Codes       │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  Display Codes      │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │  Download as .txt   │                     │                     │                    │
 │                     │                     │                     │                    │
 │  ✅ 2FA Enabled!    │                     │                     │                    │
```

### 3. Login with 2FA Flow

```
User                Frontend              Backend               Database          Authenticator App
 │                     │                     │                     │                    │
 │  Enter Email/Pass   │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /auth/login   │                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │  {email, password}  │                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Verify Password    │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │  Check 2FA Status   │                    │
 │                     │                     │                     │                    │
 │                     │  requiresTwoFactor  │                     │                    │
 │                     │  userId: "..."      │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  Show 2FA Modal     │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │                     │                     │                     │                    │
 │  Open Auth App      │                     │                     │                    │
 ├─────────────────────────────────────────────────────────────────────────────────────▶│
 │                     │                     │                     │   Get Current Code │
 │                     │                     │                     │   (e.g., 789012)   │
 │  View Code          │                     │                     │                    │
 │◀─────────────────────────────────────────────────────────────────────────────────────┤
 │                     │                     │                     │                    │
 │  Enter Code         │                     │                     │                    │
 ├────────────────────▶│                     │                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /2fa/verify-login                   │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │  {userId, token}    │                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Get User Secret    │                    │
 │                     │                     ├────────────────────▶│                    │
 │                     │                     │                     │                    │
 │                     │                     │  Verify TOTP        │                    │
 │                     │                     │  (time-based check) │                    │
 │                     │                     │                     │                    │
 │                     │  Verified: true     │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │                     │  POST /auth/login-2fa                     │                    │
 │                     ├────────────────────▶│                     │                    │
 │                     │  {userId, token}    │                     │                    │
 │                     │                     │                     │                    │
 │                     │                     │  Generate JWT Token │                    │
 │                     │                     │                     │                    │
 │                     │  User + JWT Token   │                     │                    │
 │                     │◀────────────────────┤                     │                    │
 │                     │                     │                     │                    │
 │  ✅ Logged In!      │                     │                     │                    │
 │◀────────────────────┤                     │                     │                    │
 │  (Redirect)         │                     │                     │                    │
```

## Database Schema

### User Model (Updated Fields)

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  
  // Email Verification
  emailVerified: Boolean,              // Default: false
  verificationToken: String,           // Random 32-byte hex
  verificationTokenExpires: Date,      // 24 hours from creation
  
  // Two-Factor Authentication
  twoFactorEnabled: Boolean,           // Default: false
  twoFactorSecret: String,             // Base32 TOTP secret
  backupCodes: [
    {
      code: String,                    // 8-char hex (uppercase)
      used: Boolean                    // Default: false
    }
  ],
  
  // Existing fields
  portfolio: [...],
  alerts: [...],
  timestamps: {
    createdAt: Date,
    updatedAt: Date
  }
}
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Security Layer 1: Password          │
│  - Bcrypt hashing (10 rounds)               │
│  - Minimum 6 characters                     │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│      Security Layer 2: Email Verification   │
│  - Token: 32 bytes random                   │
│  - Expiry: 24 hours                         │
│  - One-time use                             │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│    Security Layer 3: Two-Factor Auth (2FA)  │
│  - TOTP: Time-based 6-digit code            │
│  - Secret: 32-char base32                   │
│  - Time window: ±60 seconds                 │
│  - Backup codes: 8 one-time codes           │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Security Layer 4: JWT Token         │
│  - Signed with secret                       │
│  - Expiry: 30 days                          │
│  - HttpOnly (when cookies used)             │
└─────────────────────────────────────────────┘
```

## State Management

### AuthContext State

```javascript
{
  currentUser: {
    _id: String,
    username: String,
    email: String,
    emailVerified: Boolean,           // NEW
    twoFactorEnabled: Boolean,        // NEW
    displayName: String,
    uid: String
  },
  token: String,
  loading: Boolean
}
```

### Component State Examples

#### TwoFactorSettings Component
```javascript
{
  loading: Boolean,
  twoFactorEnabled: Boolean,
  setupStep: 'initial' | 'qr' | 'verify' | 'success',
  qrCode: String (data URL),
  secret: String (base32),
  verificationCode: String (6 digits),
  backupCodes: Array<{code, used}>,
  password: String,
  error: String,
  success: String
}
```

#### TwoFactorModal Component
```javascript
{
  code: String,
  useBackupCode: Boolean,
  loading: Boolean,
  error: String
}
```

## File Organization

```
Project Root
│
├── server/
│   ├── models/
│   │   └── User.js                    [Modified]
│   │
│   ├── routes/
│   │   ├── auth.js                    [Modified]
│   │   ├── emailVerification.js       [NEW]
│   │   └── twoFactor.js               [NEW]
│   │
│   ├── services/
│   │   └── emailService.js            [NEW]
│   │
│   └── index.js                        [Modified]
│
├── src/
│   ├── pages/
│   │   ├── VerifyEmail.jsx             [NEW]
│   │   ├── TwoFactorSettings.jsx       [NEW]
│   │   └── Login.jsx                   [Modified]
│   │
│   ├── components/
│   │   ├── VerificationBanner.jsx      [NEW]
│   │   ├── TwoFactorModal.jsx          [NEW]
│   │   └── Navbar.jsx                  [Modified]
│   │
│   ├── context/
│   │   └── AuthContext.jsx             [Modified]
│   │
│   └── App.jsx                          [Modified]
│
├── .env                                 [Modified]
├── EMAIL_2FA_GUIDE.md                  [NEW]
├── QUICK_REFERENCE.md                  [NEW]
└── TESTING_CHECKLIST.md                [NEW]
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              FRONTEND                       │
├─────────────────────────────────────────────┤
│  React 18                                   │
│  React Router v6                            │
│  Axios                                      │
│  Tailwind CSS                               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              BACKEND                        │
├─────────────────────────────────────────────┤
│  Node.js + Express                          │
│  MongoDB + Mongoose                         │
│  JWT (jsonwebtoken)                         │
│  Bcrypt.js                                  │
│  Nodemailer                                 │
│  Speakeasy (TOTP)                           │
│  QRCode                                     │
└─────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Multiple security layers
- ✅ Scalable component structure
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Production-ready design
