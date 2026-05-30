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

## ✅ STEP 4: Admin Approval Workflow

### Test Case: Admin Login (Manager)
1. Navigate to http://localhost:5173/manager
2. The manager dashboard should load
3. Default tab: "Pending Registrations"

**Expected Result**: ✅ Pending Registrations tab loads by default

### Test Case: View Pending Registrations
1. Login as manager or secretary
2. Navigate to "Pending Registrations" tab
3. See list of users with accountStatus === 'Pending'

**Expected Result**: 
- ✅ All pending users displayed in cards
- ✅ Shows user name, email, phone, DOB
- ✅ Shows role badge with color coding
- ✅ Shows membership plan and cost
- ✅ Shows payment status with transaction details
- ✅ Shows registration date/time
- ✅ Different UI for member vs trainer applications

### Test Case: No Pending Registrations
1. When no users are pending
2. View "Pending Registrations" tab

**Expected Result**:
- ✅ Shows green checkmark icon
- ✅ "All Clear! ✅" message
- ✅ "No pending registrations at the moment"

### Test Case: Approve User Registration
1. Register new member (complete full flow with payment)
2. Login as manager (manager@fithub.gr / Manager123!)
3. Go to "Pending Registrations" tab
4. Click "Approve" button on pending user
5. Review details in confirmation modal
6. Click "Confirm Approval"

**Expected Result**:
- ✅ Modal shows user details
- ✅ Lists what happens on approval
- ✅ Processing state shown (spinning icon)
- ✅ User accountStatus → "Active"
- ✅ Membership status → "Active"
- ✅ Welcome email sent
- ✅ Approval email sent
- ✅ Success notification created
- ✅ User removed from pending list
- ✅ Modal closes

**Check localStorage**:
```javascript
JSON.parse(localStorage.getItem('fithub_users'))
// User should have accountStatus: 'Active'

JSON.parse(localStorage.getItem('fithub_memberships'))
// Membership should have status: 'Active'

JSON.parse(localStorage.getItem('fithub_sent_emails'))
// Should see welcome and approval emails

JSON.parse(localStorage.getItem('fithub_notifications'))
// Should see success notification
```

### Test Case: Reject User Registration
1. Register new member (complete full flow)
2. Login as manager
3. Go to "Pending Registrations" tab
4. Click "Reject" button
5. Enter rejection reason: "Incomplete documentation"
6. Click "Confirm Rejection"

**Expected Result**:
- ✅ Modal prompts for rejection reason
- ✅ Rejection reason is required (button disabled if empty)
- ✅ Processing state shown
- ✅ User accountStatus → "Rejected"
- ✅ Membership status → "Cancelled"
- ✅ Rejection email sent with reason
- ✅ Notification created with reason
- ✅ User removed from pending list
- ✅ Modal closes

**Check localStorage**:
```javascript
JSON.parse(localStorage.getItem('fithub_users'))
// User should have accountStatus: 'Rejected'

JSON.parse(localStorage.getItem('fithub_memberships'))
// Membership should have status: 'Cancelled'

JSON.parse(localStorage.getItem('fithub_sent_emails'))
// Should see rejection email with reason
```

### Test Case: Reject Without Reason
1. Click "Reject" button
2. Leave rejection reason empty
3. Try to click "Confirm Rejection"

**Expected Result**:
- ❌ Button is disabled
- ❌ Cannot submit without reason
- ✅ Alert: "Please provide a rejection reason"

### Test Case: Secretary Access
1. Login as secretary (secretary@fithub.gr / Admin123!)
2. Navigate to dashboard
3. Access "Pending Registrations" tab

**Expected Result**:
- ✅ Secretary has full access
- ✅ Can approve registrations
- ✅ Can reject registrations
- ✅ Same functionality as manager

### Test Case: Trainer Application Review
1. Register as trainer (complete flow)
2. Login as manager
3. View pending registration for trainer
4. See special "Trainer Application" alert

**Expected Result**:
- ✅ Shows Dumbbell icon
- ✅ Green badge for trainer role
- ✅ Special alert: "Trainer Application - Documents and certifications have been uploaded"
- ✅ Approve/Reject functionality works same as members

### Test Case: Multiple Pending Users
1. Register 3 different users (member, trainer, secretary)
2. Login as manager
3. View pending registrations

**Expected Result**:
- ✅ All 3 users listed
- ✅ Different role icons and colors
- ✅ Alert shows: "3 registrations waiting for approval"
- ✅ Can approve/reject each independently
- ✅ List refreshes after each action

### Test Case: Refresh After Action
1. Approve a user
2. Check pending list

**Expected Result**:
- ✅ Approved user removed from list
- ✅ List automatically refreshes
- ✅ Count updated in alert

---

## 🔍 Testing Checklist (Updated)

### Registration Flow (Member)
- [x] Form validation works
- [x] Password strength indicator appears
- [x] Email verification sent
- [x] Duplicate email blocked
- [x] Subscription selection works
- [x] Payment processing works
- [x] Transaction recorded
- [x] Membership activated
- [x] Emails sent (verification, payment confirmation)

### Admin Approval Workflow (NEW)
- [ ] Pending registrations displayed
- [ ] User details shown correctly
- [ ] Payment status visible
- [ ] Approve functionality works
- [ ] Reject functionality requires reason
- [ ] Welcome email sent on approval
- [ ] Rejection email sent with reason
- [ ] User status updated to Active/Rejected
- [ ] Membership status updated
- [ ] Notifications created
- [ ] List refreshes after action
- [ ] Both manager and secretary can approve/reject

### Payment Features
- [x] Card auto-formatting works
- [x] Card type detected
- [x] CVV masked (password field)
- [x] Expiry auto-formatted (MM/YY)
- [x] Luhn validation works
- [x] Payment success flow
- [x] Payment declined flow
- [x] Transaction summary displayed

### Data Persistence
- [x] User saved in localStorage
- [x] Membership saved
- [x] Transaction saved
- [x] Emails logged
- [x] Data persists after page reload
- [x] Notifications saved

---

## 🐛 Common Issues (Updated)

### Issue: Can't access admin dashboard
**Solution**: Use demo accounts:
- Manager: manager@fithub.gr / Manager123!
- Secretary: secretary@fithub.gr / Admin123!

### Issue: No pending registrations showing
**Solution**: 
1. Register a new user first
2. Complete the full registration flow including payment
3. User must be in "Pending" status
4. Check localStorage: `JSON.parse(localStorage.getItem('fithub_users'))`

### Issue: Approval/rejection not working
**Solution**: 
- Check browser console for errors
- Verify localStorage is enabled
- Ensure emails are being logged
- Check that user and membership exist in database

---

## ✅ STEP 5: Login System & Authentication

### Test Case: Access Login Page
1. Navigate to http://localhost:5173 or http://localhost:5173/login
2. Login page should display

**Expected Result**: 
- ✅ Shows FitHub logo with dumbbell icon
- ✅ "Welcome to FitHub" heading
- ✅ Email and password input fields
- ✅ "Sign In" button
- ✅ "Register here" link
- ✅ Demo accounts section with quick-login buttons

### Test Case: Login with Manager Account
1. Navigate to login page
2. Click "Manager" quick-login button (or enter manually):
   - Email: manager@fithub.gr
   - Password: Manager123!
3. Click "Sign In"

**Expected Result**:
- ✅ Shows loading spinner "Signing in..."
- ✅ Login successful (500ms delay)
- ✅ Redirected to /manager dashboard
- ✅ Dashboard loads with "Pending Registrations" tab
- ✅ Session saved in localStorage

**Check localStorage**:
```javascript
JSON.parse(localStorage.getItem('fithub_session'))
// Should show: { user: {...}, token: "...", expiresAt: "..." }
```

### Test Case: Login with Secretary Account
1. Click "Secretary" quick-login button
   - Email: secretary@fithub.gr
   - Password: Admin123!

**Expected Result**:
- ✅ Login successful
- ✅ Redirected to /receptionist dashboard
- ✅ Can access pending registrations

### Test Case: Login with New Registered User (Pending Status)
1. Register a new member (complete full flow)
2. Verify email
3. Do NOT get admin approval yet
4. Go to /login
5. Enter your registered email and password
6. Click "Sign In"

**Expected Result**:
- ❌ Error message: "Your account is pending approval. You will receive an email once your account is approved."
- ❌ Not redirected to dashboard
- ❌ No session created

### Test Case: Login with Approved User
1. Register a new member
2. Verify email
3. Login as manager and approve the registration
4. Go to /login
5. Login with the member credentials

**Expected Result**:
- ✅ Login successful
- ✅ Redirected to /member dashboard
- ✅ Session created

### Test Case: Login with Rejected User
1. Register a new member
2. Verify email
3. Login as manager and reject the registration
4. Try to login with rejected user credentials

**Expected Result**:
- ❌ Error: "Your account registration was not approved. Please contact support for more information."
- ❌ Cannot login

### Test Case: Login with Unverified Email
1. Register a new user
2. Do NOT verify email
3. Try to login

**Expected Result**:
- ❌ Error: "Please verify your email address before logging in. Check your inbox for the verification link."
- ❌ Cannot access dashboard

### Test Case: Invalid Email
1. Enter email: "notexist@example.com"
2. Enter password: "anything"
3. Click "Sign In"

**Expected Result**:
- ❌ Error: "Invalid email or password"
- ❌ Form stays on login page

### Test Case: Wrong Password
1. Enter email: "manager@fithub.gr"
2. Enter password: "wrongpassword"
3. Click "Sign In"

**Expected Result**:
- ❌ Error: "Invalid email or password"
- ❌ Cannot login

### Test Case: Empty Fields
1. Leave email or password empty
2. Try to submit

**Expected Result**:
- ❌ Browser validation: "Please fill out this field"
- ❌ Cannot submit form

### Test Case: Session Persistence
1. Login successfully as manager
2. Navigate to /manager
3. Refresh the page (F5)
4. Close browser and reopen
5. Navigate to /manager again

**Expected Result**:
- ✅ Session persists across page refreshes
- ✅ User stays logged in
- ✅ Dashboard loads without redirect to login
- ✅ Session lasts 24 hours

### Test Case: Logout
1. Login as manager
2. Dashboard loads
3. Click "Logout" button in top-right header
4. Check localStorage

**Expected Result**:
- ✅ Redirected to /login
- ✅ Session cleared: `localStorage.getItem('fithub_session')` returns null
- ✅ Cannot access /manager without logging in again

### Test Case: Session Expiration (Manual Test)
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Find `fithub_session`
4. Edit the JSON, change `expiresAt` to a past date (e.g., "2020-01-01T00:00:00.000Z")
5. Refresh the page

**Expected Result**:
- ✅ Session auto-expires
- ✅ Session cleared from localStorage
- ✅ User treated as logged out

### Test Case: Role-Based Routing
1. Register 4 different users (member, trainer, secretary role if possible)
2. Get all approved
3. Login with each account

**Expected Result**:
- Member → Redirected to /member
- Trainer → Redirected to /trainer
- Secretary → Redirected to /receptionist
- Manager → Redirected to /manager

### Test Case: Quick Login Buttons
1. Go to login page
2. Click "Manager" demo account button
3. Should auto-fill and login

**Expected Result**:
- ✅ Email and password auto-filled
- ✅ Login happens automatically
- ✅ Redirected to manager dashboard

### Test Case: Register Link
1. On login page
2. Click "Register here" link

**Expected Result**:
- ✅ Redirected to /register
- ✅ Registration form loads

---

## 🔍 Testing Checklist (Updated)

### Authentication & Authorization (NEW)
- [ ] Login page loads correctly
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials fails
- [ ] Email verification required for login
- [ ] Pending users cannot login
- [ ] Rejected users cannot login
- [ ] Approved users can login
- [ ] Role-based routing works
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Session expires after 24 hours
- [ ] Quick-login buttons work
- [ ] Error messages display correctly

### Registration Flow (Member)
- [x] Form validation works
- [x] Password strength indicator appears
- [x] Email verification sent
- [x] Duplicate email blocked
- [x] Subscription selection works
- [x] Payment processing works
- [x] Transaction recorded
- [x] Membership activated
- [x] Emails sent (verification, payment confirmation)

### Admin Approval Workflow
- [x] Pending registrations displayed
- [x] User details shown correctly
- [x] Payment status visible
- [x] Approve functionality works
- [x] Reject functionality requires reason
- [x] Welcome email sent on approval
- [x] Rejection email sent with reason
- [x] User status updated to Active/Rejected
- [x] Membership status updated
- [x] Notifications created
- [x] List refreshes after action
- [x] Both manager and secretary can approve/reject

### Payment Features
- [x] Card auto-formatting works
- [x] Card type detected
- [x] CVV masked (password field)
- [x] Expiry auto-formatted (MM/YY)
- [x] Luhn validation works
- [x] Payment success flow
- [x] Payment declined flow
- [x] Transaction summary displayed

### Data Persistence
- [x] User saved in localStorage
- [x] Membership saved
- [x] Transaction saved
- [x] Emails logged
- [x] Data persists after page reload
- [x] Notifications saved
- [x] Sessions saved and validated

---

## 🐛 Common Issues (Updated)

### Issue: Can't login even with correct credentials
**Solution**: 
- Check account status: `JSON.parse(localStorage.getItem('fithub_users'))`
- User must have `emailVerified: true`
- User must have `accountStatus: 'Active'`
- If pending, get admin to approve first

### Issue: Session not persisting
**Solution**: 
- Check browser localStorage is enabled
- Check `fithub_session` exists in localStorage
- Verify `expiresAt` is in the future
- Clear localStorage and login again

### Issue: Redirected to login after refresh
**Solution**: 
- Session may have expired (24 hour limit)
- Check localStorage for `fithub_session`
- Login again to create new session

### Issue: Quick-login buttons not working
**Solution**: 
- Verify demo accounts exist in localStorage
- Check that manager@fithub.gr and secretary@fithub.gr have:
  - `emailVerified: true`
  - `accountStatus: 'Active'`
  - Correct passwords (Manager123!, Admin123!)

---

## ✅ STEP 6: Protected Routes & Auth Guards

### Test Case: Access Protected Route (Not Logged In)
1. Clear localStorage: Open DevTools → Console → Run: `localStorage.clear()`
2. Refresh page
3. Navigate to http://localhost:5173/manager (or any dashboard URL)

**Expected Result**:
- 🚫 Redirected to /login immediately
- ❌ Dashboard does not load
- 📝 Console log: "🚫 Not authenticated, redirecting to login"
- ✅ URL changes to /login

### Test Case: Access Login Page (Already Logged In)
1. Login as manager (manager@fithub.gr / Manager123!)
2. Navigate to http://localhost:5173/login

**Expected Result**:
- ✅ Automatically redirected to /manager dashboard
- ❌ Login form does not display
- ✅ Dashboard loads immediately

### Test Case: Role-Based Access (Member tries Manager route)
1. Register and approve a new member account
2. Login as the member
3. Try to navigate to http://localhost:5173/manager

**Expected Result**:
- 🚫 Redirected to /login
- 📝 Console log: "🚫 Insufficient permissions, redirecting to login"
- ❌ Manager dashboard does not load

### Test Case: Role-Based Access (Manager tries Member route)
1. Login as manager
2. Navigate to http://localhost:5173/member

**Expected Result**:
- 🚫 Redirected to /login
- 📝 Console log: "🚫 Insufficient permissions, redirecting to login"
- ❌ Member dashboard does not load

### Test Case: Role-Based Access (Trainer routes)
1. Register and approve a trainer account
2. Login as trainer
3. Access http://localhost:5173/trainer

**Expected Result**:
- ✅ Trainer dashboard loads successfully
- ✅ Can navigate to /trainer/client/:clientId

4. Try to access http://localhost:5173/manager

**Expected Result**:
- 🚫 Redirected to /login
- ❌ Cannot access manager dashboard

### Test Case: Multi-Role Access (Receptionist)
1. Login as secretary (secretary@fithub.gr / Admin123!)
2. Access http://localhost:5173/receptionist

**Expected Result**:
- ✅ Receptionist dashboard loads

3. Login as manager
4. Access http://localhost:5173/receptionist

**Expected Result**:
- ✅ Receptionist dashboard loads (managers can access)

### Test Case: Public Routes (Always Accessible)
1. Without logging in, access these routes:
   - http://localhost:5173/login
   - http://localhost:5173/register
   - http://localhost:5173/verify-email

**Expected Result**:
- ✅ All pages load without authentication
- ✅ No redirect to login

### Test Case: Direct URL Access (Protected)
1. Logout completely
2. Type http://localhost:5173/manager directly in browser address bar
3. Press Enter

**Expected Result**:
- 🚫 Redirected to /login before dashboard loads
- ❌ Dashboard never renders

### Test Case: Back Button After Logout
1. Login as manager
2. Access /manager dashboard
3. Click "Logout"
4. Click browser back button

**Expected Result**:
- 🚫 Redirected to /login (not back to dashboard)
- ✅ Uses `replace: true` to prevent back-button access
- ❌ Cannot access dashboard via back button

### Test Case: Session Expiration on Route Access
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Find `fithub_session`
4. Modify `expiresAt` to past date: "2020-01-01T00:00:00.000Z"
5. Try to access any protected route

**Expected Result**:
- 🚫 Session expires automatically
- 🚫 Redirected to /login
- 📝 Session cleared from localStorage

### Test Case: Browser Console Logs
1. Open browser console (F12)
2. Clear localStorage
3. Try to access /manager

**Expected Result in Console**:
```
🚫 Not authenticated, redirecting to login
```

4. Login as member
5. Try to access /trainer

**Expected Result in Console**:
```
🚫 Insufficient permissions, redirecting to login
```

6. Login successfully as manager

**Expected Result in Console**:
```
✅ Login successful: manager@fithub.gr Role: manager
```

### Test Case: Multiple Tab Logout
1. Open two browser tabs
2. Login in Tab 1
3. Navigate to dashboard in Tab 1
4. Navigate to dashboard in Tab 2 (should work)
5. Logout in Tab 1
6. Refresh Tab 2

**Expected Result**:
- ✅ Tab 2 redirects to /login (session cleared)
- ❌ Cannot access dashboard in Tab 2 after logout in Tab 1

### Test Case: Refresh on Protected Route
1. Login as manager
2. Navigate to /manager dashboard
3. Refresh page (F5)

**Expected Result**:
- ✅ Dashboard reloads successfully
- ✅ User stays logged in
- ✅ No redirect to login

### Test Case: useAuth Hook (Developer Test)
1. Add this code temporarily to any component:
```typescript
import { useAuth } from '../hooks/useAuth';

const { user, isAuthenticated, hasRole } = useAuth();
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
console.log('Is Manager:', hasRole('manager'));
```

**Expected Result**:
- ✅ Shows current user object
- ✅ Shows authentication status
- ✅ Role check works correctly

---

## 🔍 Testing Checklist (Updated)

### Route Protection & Security (NEW)
- [ ] Protected routes redirect to login when not authenticated
- [ ] Login page redirects to dashboard when already logged in
- [ ] Role-based access control works (wrong role = redirect)
- [ ] Public routes accessible without authentication
- [ ] Direct URL access to protected routes is blocked
- [ ] Back button after logout doesn't allow access
- [ ] Session expiration triggers redirect
- [ ] Console logs show protection events
- [ ] Multiple tabs respect logout state
- [ ] Refresh on protected route maintains session
- [ ] useAuth hook provides correct state

### Authentication & Authorization (Updated)
- [x] Login page loads correctly
- [x] Login with valid credentials works
- [x] Login with invalid credentials fails
- [x] Email verification required for login
- [x] Pending users cannot login
- [x] Rejected users cannot login
- [x] Approved users can login
- [x] Role-based routing works
- [x] Session persists across page refresh
- [x] Logout clears session
- [x] Session expires after 24 hours
- [x] Quick-login buttons work
- [x] Error messages display correctly
- [ ] Route protection enforced
- [ ] Role authorization enforced

### Registration Flow (Member)
- [x] Form validation works
- [x] Password strength indicator appears
- [x] Email verification sent
- [x] Duplicate email blocked
- [x] Subscription selection works
- [x] Payment processing works
- [x] Transaction recorded
- [x] Membership activated
- [x] Emails sent (verification, payment confirmation)

### Admin Approval Workflow
- [x] Pending registrations displayed
- [x] User details shown correctly
- [x] Payment status visible
- [x] Approve functionality works
- [x] Reject functionality requires reason
- [x] Welcome email sent on approval
- [x] Rejection email sent with reason
- [x] User status updated to Active/Rejected
- [x] Membership status updated
- [x] Notifications created
- [x] List refreshes after action
- [x] Both manager and secretary can approve/reject

### Payment Features
- [x] Card auto-formatting works
- [x] Card type detected
- [x] CVV masked (password field)
- [x] Expiry auto-formatted (MM/YY)
- [x] Luhn validation works
- [x] Payment success flow
- [x] Payment declined flow
- [x] Transaction summary displayed

### Data Persistence
- [x] User saved in localStorage
- [x] Membership saved
- [x] Transaction saved
- [x] Emails logged
- [x] Data persists after page reload
- [x] Notifications saved
- [x] Sessions saved and validated

---

## 🐛 Common Issues (Updated)

### Issue: Infinite redirect loop between /login and /manager
**Solution**: 
- Check session in localStorage
- Verify session `expiresAt` is in the future
- Ensure user has correct `accountStatus: 'Active'`
- Clear localStorage and login again

### Issue: Can access protected routes when logged out
**Solution**: 
- Verify ProtectedRoute is wrapping the route in routes.tsx
- Check authService.isAuthenticated() returns false
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Wrong role can access restricted routes
**Solution**: 
- Check `allowedRoles` array in routes.tsx
- Verify user role in localStorage: `JSON.parse(localStorage.getItem('fithub_session')).user.role`
- Ensure role matches allowed roles

### Issue: Login page shows briefly before redirecting
**Solution**: 
- This is expected behavior (useEffect runs after render)
- The redirect happens very quickly
- Not a security issue (route protection still works)

### Issue: Back button allows access after logout
**Solution**: 
- Verify ProtectedRoute uses `<Navigate replace />`
- Check that logout clears session completely
- Hard refresh page to clear browser cache

---

## ✅ STEP 7: Class Management (Creation & Scheduling)

### Test Case: Access Class Management (Manager)
1. Login as manager (manager@fithub.gr / Manager123!)
2. Navigate to "Class Management" tab

**Expected Result**:
- ✅ Tab loads successfully
- ✅ Shows 7 demo classes in table
- ✅ "Create Class" button visible
- ✅ Table shows class details (name, instructor, schedule, capacity, status)

### Test Case: Access Class Management (Secretary)
1. Login as secretary (secretary@fithub.gr / Admin123!)
2. Navigate to "Class Management" tab

**Expected Result**:
- ✅ Secretary has same access as manager
- ✅ Can view all classes
- ✅ Can create/edit/delete classes

### Test Case: Create New Class
1. Login as manager
2. Go to "Class Management" tab
3. Click "Create Class" button
4. Fill in form:
   - Name: "Evening Zumba"
   - Description: "Dance fitness party"
   - Category: "Dance"
   - Instructor: "Maria Costa"
   - Day: "Thursday"
   - Time: "20:00"
   - Duration: "60"
   - Capacity: "30"
   - Location: "Dance Studio"
5. Click "Create Class"

**Expected Result**:
- ✅ Modal closes
- ✅ New class appears in table
- ✅ Has correct details
- ✅ Status: "Active"
- ✅ Enrolled: 0/30
- ✅ Saved to localStorage

**Check localStorage**:
```javascript
JSON.parse(localStorage.getItem('fithub_classes'))
// Should show new class in array
```

### Test Case: Create Class (Validation)
1. Click "Create Class"
2. Leave all fields empty
3. Click "Create Class"

**Expected Result**:
- ❌ Error: "Class name is required"

4. Fill name only
5. Click "Create Class"

**Expected Result**:
- ❌ Error: "Category is required"

6. Continue filling required fields one by one

**Expected Result**:
- ❌ Each missing field shows appropriate error
- ✅ Cannot create until all required fields filled

### Test Case: Edit Existing Class
1. Click edit button (pencil icon) on "Morning Yoga Flow"
2. Edit modal opens with pre-filled data
3. Change:
   - Capacity: from 20 to 25
   - Time: from 09:00 to 10:00
4. Click "Update Class"

**Expected Result**:
- ✅ Modal closes
- ✅ Table shows updated capacity: 0/25
- ✅ Table shows updated time: 10:00
- ✅ Changes saved to localStorage

### Test Case: Delete Class
1. Click delete button (trash icon) on "Boxing Fundamentals"
2. Confirmation modal opens
3. Shows class details
4. Shows warning: "This action cannot be undone. All bookings for this class will also be cancelled."
5. Click "Delete Class"

**Expected Result**:
- ✅ Modal closes
- ✅ Class removed from table
- ✅ Deleted from localStorage
- ✅ Total class count decreases

### Test Case: Cancel Delete
1. Click delete button on any class
2. Click "Cancel" in confirmation modal

**Expected Result**:
- ✅ Modal closes
- ✅ Class NOT deleted
- ✅ Still appears in table

### Test Case: View Class Details in Table
1. Look at any class row in table

**Expected Result**:
- ✅ Class name displayed
- ✅ Category badge with color coding (e.g., purple for Yoga)
- ✅ Location shown with map pin icon (if set)
- ✅ Instructor name
- ✅ Schedule: Day with calendar icon
- ✅ Time and duration with clock icon
- ✅ Capacity: enrolled/total with users icon
- ✅ Status badge (green for Active)
- ✅ Edit and delete buttons

### Test Case: Empty State
1. Delete all classes
2. View Class Management tab

**Expected Result**:
- ✅ Shows dumbbell icon
- ✅ "No Classes Yet" heading
- ✅ "Create your first fitness class to get started" message
- ✅ "Create Your First Class" button
- ✅ Clicking button opens create modal

### Test Case: Demo Classes
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login as manager
4. Go to Class Management

**Expected Result**:
- ✅ 7 demo classes auto-created:
  - Morning Yoga Flow (Monday 09:00)
  - HIIT Cardio Blast (Monday 18:00)
  - Pilates Core (Wednesday 10:00)
  - Cycling Power Hour (Tuesday 19:00)
  - Strength & Conditioning (Thursday 17:00)
  - Boxing Fundamentals (Friday 18:30)
  - Weekend Yoga (Saturday 11:00)

### Test Case: Category Colors
1. View classes in table
2. Check category badge colors

**Expected Result**:
- ✅ Yoga: Purple badge
- ✅ HIIT: Red badge
- ✅ Pilates: Pink badge
- ✅ Cycling: Blue badge
- ✅ Strength: Orange badge
- ✅ Cardio: Green badge (if any)

### Test Case: Time Picker
1. Create or edit class
2. Click time field

**Expected Result**:
- ✅ Shows native time picker (HH:MM format)
- ✅ Can select hour and minute
- ✅ 24-hour format

### Test Case: Form Reset on Cancel
1. Click "Create Class"
2. Fill in some fields
3. Click "Cancel"
4. Click "Create Class" again

**Expected Result**:
- ✅ All fields are empty
- ✅ No data carried over from previous attempt

### Test Case: Processing States
1. Create or edit a class
2. Click submit button
3. Observe button state

**Expected Result**:
- ✅ Button disabled during processing
- ✅ Shows "Creating..." or "Updating..." text
- ✅ Shows spinning clock icon
- ✅ Modal closes after success

### Test Case: Multiple Classes Same Day
1. Create multiple classes on Monday:
   - Morning Yoga (09:00)
   - HIIT Blast (18:00)
   - Evening Stretch (20:00)

**Expected Result**:
- ✅ All classes created successfully
- ✅ No conflicts
- ✅ All appear in table

---

## 🔍 Testing Checklist (Updated)

### Class Management (NEW)
- [ ] Manager can access class management
- [ ] Secretary can access class management  
- [ ] Can create new classes
- [ ] All required field validation works
- [ ] Can edit existing classes
- [ ] Can delete classes with confirmation
- [ ] Empty state shows when no classes
- [ ] Demo classes initialize on first load
- [ ] Category badges show correct colors
- [ ] Time picker works correctly
- [ ] Form resets after cancel
- [ ] Processing states display correctly
- [ ] Class data persists in localStorage
- [ ] Table displays all class information

### Route Protection & Security
- [x] Protected routes redirect to login when not authenticated
- [x] Login page redirects to dashboard when already logged in
- [x] Role-based access control works (wrong role = redirect)
- [x] Public routes accessible without authentication
- [x] Direct URL access to protected routes is blocked
- [x] Back button after logout doesn't allow access
- [x] Session expiration triggers redirect
- [x] Console logs show protection events
- [x] Multiple tabs respect logout state
- [x] Refresh on protected route maintains session
- [x] useAuth hook provides correct state

### Authentication & Authorization
- [x] Login page loads correctly
- [x] Login with valid credentials works
- [x] Login with invalid credentials fails
- [x] Email verification required for login
- [x] Pending users cannot login
- [x] Rejected users cannot login
- [x] Approved users can login
- [x] Role-based routing works
- [x] Session persists across page refresh
- [x] Logout clears session
- [x] Session expires after 24 hours
- [x] Quick-login buttons work
- [x] Error messages display correctly
- [x] Route protection enforced
- [x] Role authorization enforced

### Registration Flow (Member)
- [x] Form validation works
- [x] Password strength indicator appears
- [x] Email verification sent
- [x] Duplicate email blocked
- [x] Subscription selection works
- [x] Payment processing works
- [x] Transaction recorded
- [x] Membership activated
- [x] Emails sent (verification, payment confirmation)

### Admin Approval Workflow
- [x] Pending registrations displayed
- [x] User details shown correctly
- [x] Payment status visible
- [x] Approve functionality works
- [x] Reject functionality requires reason
- [x] Welcome email sent on approval
- [x] Rejection email sent with reason
- [x] User status updated to Active/Rejected
- [x] Membership status updated
- [x] Notifications created
- [x] List refreshes after action
- [x] Both manager and secretary can approve/reject

### Payment Features
- [x] Card auto-formatting works
- [x] Card type detected
- [x] CVV masked (password field)
- [x] Expiry auto-formatted (MM/YY)
- [x] Luhn validation works
- [x] Payment success flow
- [x] Payment declined flow
- [x] Transaction summary displayed

### Data Persistence
- [x] User saved in localStorage
- [x] Membership saved
- [x] Transaction saved
- [x] Emails logged
- [x] Data persists after page reload
- [x] Notifications saved
- [x] Sessions saved and validated
- [ ] Classes saved in localStorage
- [ ] Class changes persist

---

## ✅ STEP 8: Class Booking System

### Test Case: Browse Classes (Member)
1. Register and approve a member account
2. Login as member
3. Navigate to "Book Classes" tab

**Expected Result**:
- ✅ Shows grid of available classes
- ✅ Each class shows: name, category, description, instructor, schedule, capacity
- ✅ Book button or "Join Waitlist" button
- ✅ Search bar and filters (category, day) visible

### Test Case: Search Classes
1. In "Book Classes" tab
2. Search for "Yoga"

**Expected Result**:
- ✅ Filters to show only yoga classes
- ✅ Matches class name and instructor name

3. Clear search, search for instructor name (e.g., "Elena")

**Expected Result**:
- ✅ Shows all classes by that instructor

### Test Case: Filter by Category
1. Select "HIIT" from category dropdown

**Expected Result**:
- ✅ Shows only HIIT classes
- ✅ Other classes hidden

### Test Case: Filter by Day
1. Select "Monday" from day dropdown

**Expected Result**:
- ✅ Shows only Monday classes
- ✅ Other days hidden

### Test Case: Combined Filters
1. Search "Yoga", Category "Yoga", Day "Monday"

**Expected Result**:
- ✅ Shows only Monday Yoga classes
- ✅ All filters work together

### Test Case: Book Available Class
1. Find class with available spots (e.g., "Morning Yoga Flow" - 0/20)
2. Click "Book Class" button
3. Confirmation modal appears
4. Click "Confirm Booking"

**Expected Result**:
- ✅ Modal closes
- ✅ Booking created in database
- ✅ Class enrolled count: 1/20
- ✅ Class shows blue border + "Booked" badge
- ✅ Button changes to "Cancel Booking"
- ✅ Booking appears in "My Bookings" tab
- ✅ Confirmation email sent

**Check localStorage**:
```javascript
JSON.parse(localStorage.getItem('fithub_bookings'))
// Should show booking with status: "Confirmed"

JSON.parse(localStorage.getItem('fithub_classes'))
// Class enrolled should be 1

JSON.parse(localStorage.getItem('fithub_sent_emails'))
// Should see booking confirmation email
```

### Test Case: Book Full Class (Waitlist)
1. Book "Pilates Core" class 15 times (capacity: 15)
2. Try to book again with 16th user

**Expected Result**:
- ✅ Button shows "Join Waitlist"
- ✅ Clicking opens modal: "This class is full. You will be added to the waitlist."
- ✅ Confirm waitlist
- ✅ Booking created with status: "Waitlisted"
- ✅ Waitlist count: 1
- ✅ Waitlist email sent
- ✅ Class shows yellow "Waitlisted" badge
- ✅ Appears in "My Bookings" → Waitlisted section

### Test Case: Duplicate Booking Prevention
1. Book a class
2. Try to book the same class again

**Expected Result**:
- ❌ Alert: "You have already booked this class!"
- ❌ No duplicate booking created
- ✅ Original booking remains

### Test Case: View My Bookings (Empty)
1. New member with no bookings
2. Go to "My Bookings" tab

**Expected Result**:
- ✅ Shows calendar icon
- ✅ "No Bookings Yet" heading
- ✅ "Browse classes and book your first session!" message

### Test Case: View My Bookings (Confirmed)
1. Book 3 classes
2. Go to "My Bookings" tab
3. Check "Confirmed Bookings" section

**Expected Result**:
- ✅ Heading: "Confirmed Bookings (3)"
- ✅ Green checkmark icon
- ✅ All 3 bookings displayed in grid
- ✅ Each booking has green border
- ✅ Shows class details (name, instructor, day, time, location)
- ✅ "Cancel Booking" button on each

### Test Case: View My Bookings (Waitlisted)
1. Join waitlist for 2 full classes
2. Go to "My Bookings" tab
3. Check "Waitlisted" section

**Expected Result**:
- ✅ Heading: "Waitlisted (2)"
- ✅ Yellow clock icon
- ✅ Both waitlisted bookings displayed
- ✅ Each has yellow border
- ✅ Shows "Waitlisted" badge
- ✅ Shows alert: "You'll be notified if a spot becomes available"
- ✅ "Leave Waitlist" button

### Test Case: Cancel Confirmed Booking
1. Book a class
2. Go to "My Bookings"
3. Click "Cancel Booking"
4. Confirmation modal appears
5. Click "Cancel Booking" (red button)

**Expected Result**:
- ✅ Modal closes
- ✅ Booking status → "Cancelled"
- ✅ Removed from "My Bookings" tab
- ✅ Class enrolled count decreased
- ✅ Class status changed to "Active" (if was full)
- ✅ Cancellation email sent
- ✅ Class no longer shows as booked in Browse tab

### Test Case: Cancel and Auto-Promote Waitlist
1. Fill class to capacity (15/15)
2. Add user to waitlist (waitlist: 1)
3. Login as first booked user
4. Cancel their booking

**Expected Result**:
- ✅ Booking cancelled
- ✅ Enrolled: 14/15 temporarily
- ✅ Waitlisted user automatically promoted
- ✅ Their booking status → "Confirmed"
- ✅ Waitlist count: 0
- ✅ Enrolled: 15/15 (spot refilled)
- ✅ Promotion email sent to promoted user
- ✅ Promoted user sees booking in Confirmed section

### Test Case: Cancel Waitlisted Booking
1. Join waitlist for full class
2. Click "Leave Waitlist"
3. Confirm

**Expected Result**:
- ✅ Booking cancelled
- ✅ Waitlist count decreased
- ✅ Removed from "My Bookings"

### Test Case: Booking Badge Count
1. Book 3 classes
2. Join 2 waitlists
3. Look at "My Bookings" tab button

**Expected Result**:
- ✅ Shows badge with number "5"
- ✅ Badge is blue

### Test Case: Tab Navigation
1. Switch between "Browse Classes" and "My Bookings" tabs

**Expected Result**:
- ✅ Tabs switch smoothly
- ✅ Active tab highlighted
- ✅ Content changes appropriately

### Test Case: Booking Email Content
1. Book a class
2. Check localStorage for email

**Expected Result**:
```javascript
JSON.parse(localStorage.getItem('fithub_sent_emails'))
```
- ✅ Email subject: "Class Booking Confirmed: {ClassName}"
- ✅ Email body includes:
  - Greeting with user name
  - Class name, instructor, day, time, duration, location
  - Status: Confirmed
  - Motivational message

### Test Case: Waitlist Email Content
1. Join waitlist
2. Check email

**Expected Result**:
- ✅ Subject: "Added to Waitlist: {ClassName}"
- ✅ Body includes:
  - Waitlist notice
  - Class details
  - "We'll notify you if a spot becomes available"

### Test Case: Real-time Capacity Updates
1. Open two browser windows
2. Login as different members
3. Book same class from both
4. Observe capacity

**Expected Result**:
- ✅ First booking: enrolled increases
- ✅ Second booking: enrolled increases again
- ✅ Both users see updated capacity after refresh

---

## 🔍 Testing Checklist (Updated)

### Class Booking System (NEW)
- [ ] Browse classes tab loads
- [ ] Search by class name works
- [ ] Search by instructor name works
- [ ] Filter by category works
- [ ] Filter by day works
- [ ] Combined filters work
- [ ] Book available class works
- [ ] Booking confirmation email sent
- [ ] Enrolled count increases
- [ ] Class shows as booked
- [ ] Join waitlist for full class works
- [ ] Waitlist email sent
- [ ] Waitlist count increases
- [ ] Duplicate booking prevented
- [ ] My Bookings tab shows bookings
- [ ] Confirmed section displays correctly
- [ ] Waitlisted section displays correctly
- [ ] Cancel confirmed booking works
- [ ] Enrolled count decreases on cancel
- [ ] Waitlist auto-promotion works
- [ ] Promotion email sent
- [ ] Cancel waitlisted booking works
- [ ] Empty state shows when no bookings
- [ ] Badge count accurate

### Class Management
- [x] Manager can access class management
- [x] Secretary can access class management  
- [x] Can create new classes
- [x] All required field validation works
- [x] Can edit existing classes
- [x] Can delete classes with confirmation
- [x] Empty state shows when no classes
- [x] Demo classes initialize on first load
- [x] Category badges show correct colors
- [x] Time picker works correctly
- [x] Form resets after cancel
- [x] Processing states display correctly
- [x] Class data persists in localStorage
- [x] Table displays all class information

### Route Protection & Security
- [x] Protected routes redirect to login when not authenticated
- [x] Login page redirects to dashboard when already logged in
- [x] Role-based access control works (wrong role = redirect)
- [x] Public routes accessible without authentication
- [x] Direct URL access to protected routes is blocked
- [x] Back button after logout doesn't allow access
- [x] Session expiration triggers redirect
- [x] Console logs show protection events
- [x] Multiple tabs respect logout state
- [x] Refresh on protected route maintains session
- [x] useAuth hook provides correct state

### Authentication & Authorization
- [x] Login page loads correctly
- [x] Login with valid credentials works
- [x] Login with invalid credentials fails
- [x] Email verification required for login
- [x] Pending users cannot login
- [x] Rejected users cannot login
- [x] Approved users can login
- [x] Role-based routing works
- [x] Session persists across page refresh
- [x] Logout clears session
- [x] Session expires after 24 hours
- [x] Quick-login buttons work
- [x] Error messages display correctly
- [x] Route protection enforced
- [x] Role authorization enforced

### Registration Flow (Member)
- [x] Form validation works
- [x] Password strength indicator appears
- [x] Email verification sent
- [x] Duplicate email blocked
- [x] Subscription selection works
- [x] Payment processing works
- [x] Transaction recorded
- [x] Membership activated
- [x] Emails sent (verification, payment confirmation)

### Admin Approval Workflow
- [x] Pending registrations displayed
- [x] User details shown correctly
- [x] Payment status visible
- [x] Approve functionality works
- [x] Reject functionality requires reason
- [x] Welcome email sent on approval
- [x] Rejection email sent with reason
- [x] User status updated to Active/Rejected
- [x] Membership status updated
- [x] Notifications created
- [x] List refreshes after action
- [x] Both manager and secretary can approve/reject

### Payment Features
- [x] Card auto-formatting works
- [x] Card type detected
- [x] CVV masked (password field)
- [x] Expiry auto-formatted (MM/YY)
- [x] Luhn validation works
- [x] Payment success flow
- [x] Payment declined flow
- [x] Transaction summary displayed

### Data Persistence
- [x] User saved in localStorage
- [x] Membership saved
- [x] Transaction saved
- [x] Emails logged
- [x] Data persists after page reload
- [x] Notifications saved
- [x] Sessions saved and validated
- [x] Classes saved in localStorage
- [x] Class changes persist
- [ ] Bookings saved in localStorage
- [ ] Booking changes persist

---

**Last Updated**: 2026-05-27  
**Steps Tested**: 1-8  
**Total Test Cases**: 105+
