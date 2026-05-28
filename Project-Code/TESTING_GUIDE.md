# FitHub Testing Guide

This guide helps you test all implemented features of the FitHub system.

## 🚀 Getting Started

1. **Start the development server**:
   ```bash
   cd /workspaces/default/code
   pnpm install
   pnpm dev
   ```

2. **Open in browser**: http://localhost:5173

---

## ✅ STEP 1: Form Validation & Password Security

### Test Case: Valid Registration
1. Navigate to http://localhost:5173/register
2. Click "Member" role
3. Fill in the form:
   - **Name**: Γιάννης Παπαδόπουλος
   - **Email**: test@example.com
   - **Phone**: +30 698 123 4567
   - **Date of Birth**: Select a date (16+ years ago)
   - **Password**: Test123!@#
   - **Confirm Password**: Test123!@#

**Expected Result**: ✅ All fields validate, password strength shows "Strong"

### Test Case: Invalid Email
1. Enter email: "invalid.email"
2. Try to continue

**Expected Result**: ❌ Error: "Please enter a valid email address"

### Test Case: Password Mismatch
1. Password: Test123!
2. Confirm Password: Different123!

**Expected Result**: ❌ Error: "Passwords do not match"

### Test Case: Weak Password
1. Enter password: "weak"

**Expected Result**: 
- ❌ Error: "Password must be at least 8 characters long"
- Password strength meter shows "Weak" (red)

### Test Case: Greek Phone Validation
1. Enter phone: "123" or "abcd"

**Expected Result**: ❌ Error: "Please enter a valid Greek phone number (+30 XXX XXX XXXX)"

---

## ✅ STEP 2: Email Verification & Duplicate Check

### Test Case: Email Verification Flow
1. Complete registration with valid data
2. On "Verify Your Email" screen:
   - See verification link in dev box
   - Click "Copy" button to copy link
   - Click "Simulate Email Verification" button

**Expected Result**: 
- ✅ Email verified successfully
- Redirects to preferences step after 1.5 seconds

### Test Case: Duplicate Email Detection
1. Register user with email: test@example.com
2. Try to register again with same email

**Expected Result**: ❌ Error: "This email is already registered. Please login or use a different email."

### Test Case: Verification Link
1. After registration, copy verification link
2. Open in new tab: http://localhost:5173/verify-email?token=...

**Expected Result**:
- ✅ Shows "Email Verified!" success message
- Auto-redirects to login after 3 seconds

### Test Case: Admin Notification
1. Register new member
2. Open DevTools → Application → Local Storage
3. Check `fithub_sent_emails`

**Expected Result**:
- ✅ See verification email
- ✅ See admin notification email to secretary@fithub.gr and manager@fithub.gr

---

## ✅ STEP 3: Payment Integration & Transaction Management

### Test Case: Successful Payment
1. Complete registration up to payment step
2. Select subscription: "Premium" (€99.99)
3. Fill payment details:
   - **Card Holder**: JOHN DOE
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: 12/28
   - **CVV**: 123
4. Click "Pay €99.00"

**Expected Result**:
- ✅ Payment processes (2 second delay with loading spinner)
- ✅ Transaction created with status "Completed"
- ✅ Membership activated
- ✅ Shows transaction summary on pending approval screen
- ✅ Payment confirmation email sent

### Test Case: Payment Declined
1. Complete registration up to payment step
2. Use declined test card: **4000 0000 0000 0002**
3. Fill other details and submit

**Expected Result**:
- ❌ Error: "Your card was declined. Please check your card details and try again."
- Transaction created with status "Failed"
- Can retry with different card

### Test Case: Card Validation
1. Enter invalid card number: "1234"

**Expected Result**: ❌ Error: "Card number must be between 13 and 19 digits"

### Test Case: Expired Card
1. Enter expiry: "01/20" (expired)

**Expected Result**: ❌ Error: "Card has expired"

### Test Case: Invalid CVV
1. Enter CVV: "12" (too short)

**Expected Result**: ❌ Error: "CVV must be 3 or 4 digits"

### Test Case: Auto-Formatting
1. Type card number: "4111111111111111"

**Expected Result**: ✅ Auto-formats to "4111 1111 1111 1111"

1. Type expiry: "1228"

**Expected Result**: ✅ Auto-formats to "12/28"

### Test Case: Card Type Detection
1. Enter Visa: 4111 1111 1111 1111

**Expected Result**: ✅ Shows "Visa" on right side of input

1. Enter Mastercard: 5555 5555 5555 4444

**Expected Result**: ✅ Shows "Mastercard"

### Test Case: Transaction Recording
1. After successful payment
2. Open DevTools → Application → Local Storage
3. Check `fithub_transactions`

**Expected Result**:
```json
{
  "id": "...",
  "userId": "...",
  "amount": 99,
  "status": "Completed",
  "paymentMethod": "Card",
  "description": "Premium Membership - First Month",
  "createdAt": "2026-05-27T..."
}
```

---

## 🧪 Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | ✅ Success |
| 4000 0000 0000 0002 | Visa | ❌ Declined |
| 5555 5555 5555 4444 | Mastercard | ✅ Success |
| 3782 822463 10005 | Amex | ✅ Success |

**Valid Expiry Dates**: Any future date (e.g., 12/28)  
**Valid CVV**: Any 3-4 digits (e.g., 123)

---

## 📧 Email Testing

### View Sent Emails
1. Open DevTools → Console
2. Run:
   ```javascript
   JSON.parse(localStorage.getItem('fithub_sent_emails'))
   ```

**Expected**: Array of all sent emails with subjects, bodies, and timestamps

### Email Types Sent:
1. ✅ **Verification Email** - To new user
2. ✅ **Admin Notification** - To secretary/manager
3. ✅ **Payment Confirmation** - After successful payment

---

## 💾 Database Testing

### View Users
```javascript
JSON.parse(localStorage.getItem('fithub_users'))
```

### View Memberships
```javascript
JSON.parse(localStorage.getItem('fithub_memberships'))
```

### View Transactions
```javascript
JSON.parse(localStorage.getItem('fithub_transactions'))
```

### View Fitness Goals
```javascript
JSON.parse(localStorage.getItem('fithub_goals'))
```

### Clear All Data
```javascript
localStorage.clear()
location.reload()
```

---

## 🔍 Testing Checklist

### Registration Flow (Member)
- [ ] Form validation works
- [ ] Password strength indicator appears
- [ ] Email verification sent
- [ ] Duplicate email blocked
- [ ] Subscription selection works
- [ ] Payment processing works
- [ ] Transaction recorded
- [ ] Membership activated
- [ ] Emails sent (verification, payment confirmation)

### Payment Features
- [ ] Card auto-formatting works
- [ ] Card type detected
- [ ] CVV masked (password field)
- [ ] Expiry auto-formatted (MM/YY)
- [ ] Luhn validation works
- [ ] Payment success flow
- [ ] Payment declined flow
- [ ] Transaction summary displayed

### Data Persistence
- [ ] User saved in localStorage
- [ ] Membership saved
- [ ] Transaction saved
- [ ] Emails logged
- [ ] Data persists after page reload

---

## 🐛 Common Issues

### Issue: "Email already registered"
**Solution**: Use a different email or clear localStorage

### Issue: Payment doesn't process
**Solution**: Check card number is valid (use test cards)

### Issue: Data not saving
**Solution**: Check browser localStorage is enabled

### Issue: Email verification fails
**Solution**: Ensure token in URL matches stored token

---

## 📊 Expected Data Flow

```
1. User fills registration form
   ↓
2. Validation checks pass
   ↓
3. User created in database (status: Pending, emailVerified: false)
   ↓
4. Verification email sent
   ↓
5. User verifies email (emailVerified: true)
   ↓
6. User selects subscription
   ↓
7. Membership created (status: Pending)
   ↓
8. User sets fitness goals
   ↓
9. User enters payment details
   ↓
10. Payment processed
   ↓
11. Transaction created (status: Completed)
   ↓
12. Membership updated (status: Active, dates set)
   ↓
13. Fitness goals saved
   ↓
14. Payment confirmation email sent
   ↓
15. User sees confirmation (Pending Approval screen)
```

---

## 🎯 Success Criteria

After completing all test cases:
- ✅ All validation errors display correctly
- ✅ Password strength indicator works
- ✅ Email verification system functional
- ✅ Duplicate email detection works
- ✅ Payment processing completes
- ✅ Transactions recorded
- ✅ Memberships activated
- ✅ Emails sent and logged
- ✅ Data persists in localStorage

---

**Last Updated**: 2026-05-27  
**Steps Tested**: 1-3  
**Total Test Cases**: 25+
