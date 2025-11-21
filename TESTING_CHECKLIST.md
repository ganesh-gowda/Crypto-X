# ✅ Testing Checklist - Email Verification & 2FA

## Pre-Testing Setup

- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 5174
- [ ] MongoDB connected successfully
- [ ] Server console visible for email logs

## Email Verification Tests

### Test 1: Signup with Email Verification
- [ ] Navigate to `/signup`
- [ ] Fill in username, email, password
- [ ] Click "Sign Up"
- [ ] ✅ Success: Registration successful message appears
- [ ] ✅ Success: Redirected to home page
- [ ] ✅ Success: Yellow verification banner appears at top
- [ ] ✅ Success: Server console shows verification email
- [ ] ✅ Success: Email contains verification link

### Test 2: Email Verification Link
- [ ] Copy verification token from console email
- [ ] Navigate to `/verify-email?token=TOKEN_HERE`
- [ ] ✅ Success: "Email verified successfully" message
- [ ] ✅ Success: Green checkmark icon shown
- [ ] ✅ Success: Redirected to home after 3 seconds
- [ ] ✅ Success: Yellow banner no longer appears

### Test 3: Resend Verification Email
- [ ] Create unverified account
- [ ] Yellow banner appears
- [ ] Click "Resend Email" button
- [ ] ✅ Success: "Verification email sent" message in banner
- [ ] ✅ Success: New email logged to console
- [ ] ✅ Success: New token in verification link

### Test 4: Expired Verification Token
- [ ] Create account and get token
- [ ] Wait or manually expire token in database
- [ ] Try to verify with old token
- [ ] ✅ Success: "Invalid or expired verification token" error
- [ ] ✅ Success: Red X icon shown
- [ ] ✅ Success: Can resend new verification email

### Test 5: Already Verified Email
- [ ] Verify email successfully
- [ ] Try to send verification email again
- [ ] ✅ Success: "Email already verified" message
- [ ] ✅ Success: No duplicate emails sent

## Two-Factor Authentication Tests

### Test 6: 2FA Setup - QR Code Method
- [ ] Login to verified account
- [ ] Navigate to `/settings/2fa`
- [ ] Check "2FA Status" shows "Disabled"
- [ ] Click "Enable 2FA"
- [ ] ✅ Success: QR code appears
- [ ] ✅ Success: Manual entry key displayed
- [ ] Open Google Authenticator/Authy
- [ ] Scan QR code
- [ ] ✅ Success: Account added to authenticator app
- [ ] ✅ Success: 6-digit code generated

### Test 7: 2FA Verification
- [ ] Enter 6-digit code from authenticator
- [ ] Click "Verify & Enable"
- [ ] ✅ Success: "2FA enabled successfully" message
- [ ] ✅ Success: 8 backup codes displayed
- [ ] ✅ Success: Each backup code is 8 characters
- [ ] ✅ Success: Green success icon shown
- [ ] Click "Download Backup Codes"
- [ ] ✅ Success: .txt file downloaded
- [ ] ✅ Success: File contains all 8 codes

### Test 8: 2FA Login with TOTP Code
- [ ] Logout from account
- [ ] Navigate to `/login`
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] ✅ Success: 2FA modal appears
- [ ] ✅ Success: "Enter 6-digit code" prompt shown
- [ ] Open authenticator app
- [ ] Get current 6-digit code
- [ ] Enter code in modal
- [ ] Click "Verify"
- [ ] ✅ Success: "2FA verification successful" message
- [ ] ✅ Success: Redirected to portfolio
- [ ] ✅ Success: User is fully logged in

### Test 9: 2FA Login with Backup Code
- [ ] Logout from account
- [ ] Login with email & password
- [ ] 2FA modal appears
- [ ] Click "Use backup code instead"
- [ ] ✅ Success: Input changes to accept 8 characters
- [ ] ✅ Success: Placeholder shows "XXXXXXXX"
- [ ] Enter one of your backup codes
- [ ] Click "Verify"
- [ ] ✅ Success: Login successful
- [ ] Navigate to `/settings/2fa`
- [ ] Check backup codes list
- [ ] ✅ Success: Used code is crossed out

### Test 10: Invalid 2FA Code
- [ ] Logout and login with password
- [ ] 2FA modal appears
- [ ] Enter wrong code: "000000"
- [ ] Click "Verify"
- [ ] ✅ Success: "Invalid verification code" error
- [ ] ✅ Success: Modal stays open
- [ ] ✅ Success: Can try again

### Test 11: 2FA Modal Cancel
- [ ] Logout and login with password
- [ ] 2FA modal appears
- [ ] Click "Cancel" button
- [ ] ✅ Success: Modal closes
- [ ] ✅ Success: Still on login page
- [ ] ✅ Success: Not logged in
- [ ] ✅ Success: Password field cleared for security

### Test 12: Backup Code Management
- [ ] Login to account with 2FA enabled
- [ ] Navigate to `/settings/2fa`
- [ ] View backup codes section
- [ ] ✅ Success: All 8 codes displayed
- [ ] ✅ Success: Used codes shown crossed out
- [ ] Click "Download Codes"
- [ ] ✅ Success: File downloads
- [ ] Click "Regenerate Codes"
- [ ] Enter password in prompt
- [ ] ✅ Success: New codes generated
- [ ] ✅ Success: Old codes invalidated
- [ ] ✅ Success: All codes marked as unused

### Test 13: Disable 2FA
- [ ] Login to account with 2FA enabled
- [ ] Navigate to `/settings/2fa`
- [ ] Scroll to "Disable 2FA" section
- [ ] Enter current password
- [ ] Click "Disable 2FA"
- [ ] ✅ Success: "2FA disabled successfully" message
- [ ] ✅ Success: Status changes to "Disabled"
- [ ] ✅ Success: QR code section hidden
- [ ] ✅ Success: Backup codes cleared
- [ ] Logout and login
- [ ] ✅ Success: No 2FA modal appears

### Test 14: 2FA Setup with Invalid Code
- [ ] Enable 2FA, get QR code
- [ ] Enter wrong code: "123456"
- [ ] Click "Verify & Enable"
- [ ] ✅ Success: "Invalid verification code" error
- [ ] ✅ Success: 2FA not enabled
- [ ] ✅ Success: Can try again

### Test 15: Security Settings Access
- [ ] Login to any account
- [ ] Click user menu in navbar
- [ ] ✅ Success: "Security Settings" option visible
- [ ] Click "Security Settings"
- [ ] ✅ Success: Redirected to `/settings/2fa`
- [ ] ✅ Success: Current 2FA status shown

## Integration Tests

### Test 16: Complete New User Journey
- [ ] Go to `/signup`
- [ ] Create new account
- [ ] Verify email via link
- [ ] Login to account
- [ ] Go to Security Settings
- [ ] Enable 2FA with QR code
- [ ] Download backup codes
- [ ] Logout
- [ ] Login with 2FA code
- [ ] ✅ Success: All steps work seamlessly

### Test 17: Account Security Flow
- [ ] Create and verify account
- [ ] Enable 2FA
- [ ] Test login with TOTP
- [ ] Test login with backup code
- [ ] Regenerate backup codes
- [ ] Test new backup code
- [ ] Disable 2FA
- [ ] Re-enable 2FA with new QR
- [ ] ✅ Success: All security features work

### Test 18: Multiple Authenticator Apps
- [ ] Enable 2FA
- [ ] Scan same QR with Google Authenticator
- [ ] Scan same QR with Authy
- [ ] ✅ Success: Both apps generate same code
- [ ] Test login with code from Google Authenticator
- [ ] ✅ Success: Login works
- [ ] Test login with code from Authy
- [ ] ✅ Success: Login works

## Edge Cases

### Test 19: Rapid Code Changes
- [ ] Enable 2FA
- [ ] Wait for code to be about to change (last 5 seconds)
- [ ] Enter old code after it changes
- [ ] ✅ Success: Still works (time window tolerance)

### Test 20: Using All Backup Codes
- [ ] Enable 2FA
- [ ] Use all 8 backup codes one by one
- [ ] ✅ Success: All codes work once
- [ ] Try to reuse a backup code
- [ ] ✅ Success: "Invalid code" error
- [ ] Regenerate new codes
- [ ] ✅ Success: Can generate new set

### Test 21: Concurrent Login Attempts
- [ ] Open two browser tabs
- [ ] Start login in both
- [ ] Complete 2FA in first tab
- [ ] Try to use same code in second tab
- [ ] ✅ Success: Second tab still works (time window)

### Test 22: Browser Refresh During Setup
- [ ] Start 2FA setup
- [ ] Get QR code
- [ ] Refresh page before verifying
- [ ] ✅ Success: Can start setup again
- [ ] ✅ Success: New QR code generated

## Security Tests

### Test 23: Email Token Tampering
- [ ] Get verification token
- [ ] Modify token slightly
- [ ] Try to verify
- [ ] ✅ Success: "Invalid or expired token" error

### Test 24: 2FA Without Password
- [ ] Try to disable 2FA without password
- [ ] ✅ Success: Password required
- [ ] Try to regenerate codes without password
- [ ] ✅ Success: Password required

### Test 25: Protected Routes
- [ ] Logout completely
- [ ] Try to access `/settings/2fa` directly
- [ ] ✅ Success: Redirected to login page
- [ ] Login and access again
- [ ] ✅ Success: Page loads normally

## UI/UX Tests

### Test 26: Verification Banner UX
- [ ] Create unverified account
- [ ] Check banner appears
- [ ] ✅ Success: Yellow background, warning icon
- [ ] ✅ Success: Clear message text
- [ ] ✅ Success: "Resend Email" button visible
- [ ] ✅ Success: Close button (X) works
- [ ] Close banner
- [ ] Refresh page
- [ ] ✅ Success: Banner reappears (not permanently dismissed)

### Test 27: 2FA Modal UX
- [ ] Login to 2FA account
- [ ] Check modal appearance
- [ ] ✅ Success: Modal centered on screen
- [ ] ✅ Success: Backdrop darkens background
- [ ] ✅ Success: Can't click outside to close
- [ ] ✅ Success: Input autofocused
- [ ] ✅ Success: Number-only input for TOTP
- [ ] ✅ Success: Uppercase for backup codes

### Test 28: Mobile Responsiveness
- [ ] Resize browser to mobile width
- [ ] Test signup flow
- [ ] ✅ Success: Forms readable on mobile
- [ ] Test verification banner
- [ ] ✅ Success: Banner responsive
- [ ] Test 2FA modal
- [ ] ✅ Success: Modal fits mobile screen
- [ ] Test QR code size
- [ ] ✅ Success: QR code scannable on mobile

### Test 29: Error Messages
- [ ] Trigger various errors
- [ ] ✅ Success: All errors shown in red
- [ ] ✅ Success: Error messages clear and helpful
- [ ] ✅ Success: Errors dismiss after fixing issue

### Test 30: Success Messages
- [ ] Complete successful actions
- [ ] ✅ Success: All success messages shown in green
- [ ] ✅ Success: Success messages clear
- [ ] ✅ Success: Auto-dismiss after 5 seconds

## Performance Tests

### Test 31: QR Code Generation Speed
- [ ] Click "Enable 2FA"
- [ ] Time how long QR code appears
- [ ] ✅ Success: QR appears within 1 second

### Test 32: Email Send Speed
- [ ] Click "Resend Email"
- [ ] Time response
- [ ] ✅ Success: Response within 2 seconds

### Test 33: 2FA Verification Speed
- [ ] Enter correct 2FA code
- [ ] Click Verify
- [ ] Time login completion
- [ ] ✅ Success: Login completes within 2 seconds

## Browser Compatibility

### Test 34: Chrome
- [ ] All core features work
- [ ] ✅ Success: Full compatibility

### Test 35: Firefox
- [ ] All core features work
- [ ] ✅ Success: Full compatibility

### Test 36: Edge
- [ ] All core features work
- [ ] ✅ Success: Full compatibility

### Test 37: Safari (if available)
- [ ] All core features work
- [ ] ✅ Success: Full compatibility

## Final Validation

### Test 38: Production Readiness
- [ ] All tests passed
- [ ] No console errors
- [ ] No React warnings
- [ ] Email logging working
- [ ] Database updates working
- [ ] All routes accessible
- [ ] UI polished and responsive
- [ ] Documentation complete

---

## Test Results Summary

**Date**: _____________  
**Tester**: _____________  
**Total Tests**: 38  
**Tests Passed**: ___ / 38  
**Tests Failed**: ___ / 38  
**Critical Issues**: ___  
**Minor Issues**: ___  

**Status**: ✅ Ready for Production / ⚠️ Needs Fixes / ❌ Major Issues

**Notes**:
_____________________________________
_____________________________________
_____________________________________
