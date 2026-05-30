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
- [x] Bookings saved in localStorage
- [x] Booking changes persist
- [x] Training programs saved in localStorage
- [x] Program changes persist

---

## ✅ STEP 9: Training Program Creation

### Test Case: Access Training Programs (Trainer)
1. Login as trainer (create one if needed, or use demo account)
2. Navigate to "Training Programs" tab

**Expected Result**:
- ✅ Tab loads successfully
- ✅ Shows empty state if no programs (or existing programs)
- ✅ "Create Training Program" button visible

### Test Case: Create Training Program (Full Flow)
1. Click "Create Training Program"
2. Fill in program details:
   - **Name**: 6-Week Strength Builder
   - **Description**: Build muscle and increase strength
   - **Client**: Select a member from dropdown
   - **Goal**: Muscle Building
   - **Duration**: 6 weeks
   - **Start Date**: Today's date
   - **Notes**: Focus on compound movements
3. Click "Add Exercise"
4. Add first exercise:
   - **Name**: Squats
   - **Category**: Strength
   - **Day**: Monday
   - **Sets**: 4
   - **Reps**: 8-10
   - **Intensity**: High
   - **Instructions**: Keep back straight, go below parallel
5. Add second exercise:
   - **Name**: Bench Press
   - **Category**: Strength
   - **Day**: Monday
   - **Sets**: 4
   - **Reps**: 8-10
   - **Intensity**: High
6. Add third exercise:
   - **Name**: Deadlifts
   - **Category**: Strength
   - **Day**: Wednesday
   - **Sets**: 3
   - **Reps**: 5
   - **Intensity**: High
7. Click "Create Program"

**Expected Result**:
- ✅ Program created successfully
- ✅ Appears in grid layout
- ✅ Shows all program details (client, goal, duration, dates, exercise count)
- ✅ Status badge shows "Active" (green)
- ✅ Email sent to client
- ✅ Saved to localStorage
- ✅ Modal closes

### Test Case: Validation on Create
1. Click "Create Training Program"
2. Try to submit without filling required fields

**Expected Result**:
- ❌ Error: "Please fill all required fields"
- ❌ Cannot proceed

3. Fill all fields except exercises
4. Try to submit

**Expected Result**:
- ❌ Error: "Please add at least one exercise to the program"
- ❌ Cannot create program without exercises

### Test Case: Add Multiple Exercises
1. Create program
2. Add 5-6 different exercises with various categories:
   - Cardio: Running (30 min duration)
   - Strength: Squats (4 sets, 10 reps)
   - Flexibility: Stretching (15 min duration)
   - HIIT: Burpees (3 sets, 20 reps)

**Expected Result**:
- ✅ All exercises appear in list
- ✅ Each exercise shows correct details
- ✅ Category badges color-coded correctly
- ✅ Can remove exercises individually

### Test Case: Edit Training Program
1. Click edit button on any program
2. Modal opens with pre-filled data
3. Change program name to "Updated Program Name"
4. Add a new exercise
5. Remove an existing exercise
6. Change duration from 6 to 8 weeks
7. Click "Update Program"

**Expected Result**:
- ✅ Program updated successfully
- ✅ Changes visible in grid
- ✅ Exercise count updated if changed
- ✅ End date recalculated based on new duration
- ✅ Updated timestamp saved

### Test Case: Delete Training Program
1. Click delete button on program card
2. Confirmation modal appears
3. Modal shows program name and warning
4. Click "Delete Program"

**Expected Result**:
- ✅ Program removed from grid
- ✅ Deleted from localStorage
- ✅ Modal closes

### Test Case: Cancel Delete
1. Click delete button
2. Click "Cancel" in modal

**Expected Result**:
- ✅ Modal closes
- ✅ Program NOT deleted
- ✅ Program still visible in grid

### Test Case: Client Selection
1. Create program
2. Open client dropdown

**Expected Result**:
- ✅ Shows all members
- ✅ No trainers/secretaries/managers in list
- ✅ Client names displayed clearly

3. Select a client

**Expected Result**:
- ✅ Client name appears in form
- ✅ Client saved to program

### Test Case: Goal Options
1. Click "Goal" dropdown

**Expected Result**:
- ✅ 5 goals available:
  - Weight Loss
  - Muscle Building
  - Endurance
  - Flexibility
  - General Fitness

### Test Case: Exercise Categories
1. Add exercise
2. Click "Category" dropdown

**Expected Result**:
- ✅ 6 categories available:
  - Cardio (blue badge)
  - Strength (orange badge)
  - Flexibility (green badge)
  - Balance (purple badge)
  - HIIT (red badge)
  - Other (gray badge)

### Test Case: Intensity Levels
1. Add exercise
2. Click "Intensity" dropdown

**Expected Result**:
- ✅ 3 levels available:
  - Low (green)
  - Medium (yellow)
  - High (red)

### Test Case: Exercise Day Assignment
1. Add exercise
2. Click "Day" dropdown

**Expected Result**:
- ✅ 7 days available (Monday - Sunday)
- ✅ Plus "Daily" option

### Test Case: Email Notification
1. Create a training program
2. Open DevTools → Application → Local Storage
3. Check `fithub_sent_emails`

**Expected Result**:
```json
{
  "to": "client@example.com",
  "subject": "New Training Program Assigned: [Program Name]",
  "body": "Contains program details, exercises, trainer name",
  "sentAt": "2026-05-27T..."
}
```

### Test Case: Program Grid Display
1. Create multiple programs (3-4)

**Expected Result**:
- ✅ Programs display in grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- ✅ Each card shows:
  - Program name
  - Client name with user icon
  - Goal with target icon
  - Duration (X weeks)
  - Date range (start - end)
  - Exercise count with dumbbell icon
  - Status badge
  - Edit and delete buttons

### Test Case: Status Badge Colors
1. View programs with different statuses

**Expected Result**:
- ✅ Active: Green badge
- ✅ Completed: Blue badge
- ✅ Cancelled: Red badge

### Test Case: Empty State
1. Delete all programs (or start fresh)

**Expected Result**:
- ✅ Shows dumbbell icon
- ✅ "No Programs Yet" message
- ✅ Helpful text about creating first program
- ✅ "Create Training Program" button visible

### Test Case: Date Calculations
1. Create program with:
   - Start date: 2026-05-27
   - Duration: 6 weeks
2. Check program card

**Expected Result**:
- ✅ End date calculated correctly (2026-07-08)
- ✅ Displays as "May 27, 2026 - Jul 8, 2026"

### Test Case: Exercise Instructions (Optional Field)
1. Add exercise without instructions

**Expected Result**:
- ✅ Can create exercise without instructions
- ✅ Instructions are optional

2. Add exercise with detailed instructions

**Expected Result**:
- ✅ Instructions saved
- ✅ Instructions visible in exercise list

### Test Case: Sets/Reps vs Duration
1. Add strength exercise with sets/reps (e.g., 4 sets, 10 reps)
2. Add cardio exercise with duration (e.g., 30 min)

**Expected Result**:
- ✅ Both formats supported
- ✅ Can use sets/reps for strength exercises
- ✅ Can use duration for cardio/flexibility

### Test Case: Multiple Programs for Same Client
1. Create 2 different programs for the same client

**Expected Result**:
- ✅ Both programs created successfully
- ✅ Client can have multiple programs
- ✅ No conflicts

### Test Case: Program Persistence
1. Create a program
2. Refresh page
3. Navigate away and back to "Training Programs" tab
4. Logout and login again

**Expected Result**:
- ✅ Program persists after page refresh
- ✅ Program persists after navigation
- ✅ Program persists after logout/login
- ✅ All program data intact

### Test Case: Remove Exercise from Program
1. Edit a program
2. Click "X" button on an exercise in the list

**Expected Result**:
- ✅ Exercise removed from list immediately
- ✅ Exercise count decreases
- ✅ Can still save program with fewer exercises

### Test Case: Validation - Exercise Name Required
1. Create program
2. Try to add exercise without name

**Expected Result**:
- ❌ Error: "Exercise name is required"
- ❌ Cannot add exercise

### Test Case: Check Data in Console
1. Create several programs
2. Open DevTools → Console
3. Run:
   ```javascript
   JSON.parse(localStorage.getItem('fithub_programs'))
   ```

**Expected Result**:
```json
[
  {
    "id": "...",
    "name": "6-Week Strength Builder",
    "description": "Build muscle...",
    "trainerId": "...",
    "trainerName": "Sarah Johnson",
    "clientId": "...",
    "clientName": "John Doe",
    "goal": "Muscle Building",
    "duration": 6,
    "startDate": "2026-05-27",
    "endDate": "2026-07-08",
    "status": "Active",
    "exercises": [...],
    "notes": "Focus on compound movements",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### Test Case: Access Restriction (Member tries to access)
1. Login as member
2. Try to navigate to /trainer

**Expected Result**:
- ❌ Redirected to /login
- ❌ Cannot access trainer dashboard
- ❌ Cannot create programs

---

## 🔍 Final Testing Checklist (Step 9 Added)

### Training Program Management
- [x] Trainer can access Training Programs tab
- [x] Create program with all required fields
- [x] Add multiple exercises to program
- [x] Edit existing program
- [x] Delete program with confirmation
- [x] Client selection works
- [x] Goal selection works (5 options)
- [x] Exercise categories work (6 options)
- [x] Intensity levels work (3 options)
- [x] Day assignment works (7 days + Daily)
- [x] Sets/Reps fields work
- [x] Duration field works
- [x] Instructions field (optional)
- [x] Email notification sent to client
- [x] Programs display in grid layout
- [x] Status badges color-coded
- [x] Empty state displays correctly
- [x] Date calculations correct
- [x] Program data persists in localStorage
- [x] Remove exercise from program works
- [x] Validation prevents empty programs
- [x] Members cannot access trainer features

---

## ✅ STEP 10: Client View of Training Programs

### Test Case 10.1: View Program List with Demo Data
1. Login as member: `member@fithub.gr` / `Member123!`
2. Navigate to "Training Programs" tab
3. Observe the program list

**Expected Result**:
- ✅ See 2 demo training programs
- ✅ "Strength & Muscle Building" program card displayed
- ✅ "Cardio Endurance Program" card displayed
- ✅ Each card shows:
  - Program name and description
  - Status badge (Active)
  - Trainer name (Sarah Johnson)
  - Goal, Duration, End Date
  - Progress bar with percentage
  - Exercise completion count (e.g., "2/6 exercises")
  - "View Program" button

### Test Case 10.2: Statistics Dashboard
1. On Training Programs tab, check top statistics cards

**Expected Result**:
- ✅ Active Programs: 2
- ✅ Total Exercises: 9 (6 from program 1 + 3 from program 2)
- ✅ Completed: 3 (2 from program 1 + 1 from program 2)
- ✅ Icons displayed correctly (Dumbbell, Activity, Award)

### Test Case 10.3: View Program Details
1. Click "View Program" on "Strength & Muscle Building"
2. Examine the detail modal

**Expected Result**:
- ✅ Modal opens with program details
- ✅ Header shows program name and Active status badge
- ✅ Program info section shows Trainer, Goal, Duration, Progress
- ✅ Trainer notes displayed in blue box
- ✅ "Send Feedback" button visible
- ✅ Exercises grouped by day (Monday, Wednesday, Friday)
- ✅ Completed exercises have green background
- ✅ Incomplete exercises have white background
- ✅ Each exercise shows category and intensity badges

### Test Case 10.4: Toggle Exercise Completion
1. In program detail modal, find "Deadlifts" (incomplete)
2. Click the checkbox next to "Deadlifts"

**Expected Result**:
- ✅ Checkbox changes from empty to checked
- ✅ Exercise background turns green
- ✅ Progress percentage updates
- ✅ Change persists when closing and reopening modal

### Test Case 10.5: Log Workout
1. Find an incomplete exercise (e.g., "Pull-ups")
2. Click "Log Workout" button
3. Fill in: Sets: 3, Reps: 12, Weight: 0, Difficulty: Medium, Notes: "Great workout!"
4. Click "Save & Mark Complete"

**Expected Result**:
- ✅ Log modal opens with exercise details
- ✅ All form fields accept input
- ✅ After saving: modal closes, exercise marked complete, progress updates

### Test Case 10.6: Send Feedback to Trainer
1. In program detail modal, click "Send Feedback"
2. Type: "The program is great! Could we add more core exercises?"
3. Click "Send Feedback"

**Expected Result**:
- ✅ Feedback modal opens with trainer info
- ✅ Send button disabled when empty
- ✅ Success alert after sending
- ✅ Modal closes

### Test Case 10.7: Empty State (New User)
1. Login as a new member with no programs
2. Go to Training Programs tab

**Expected Result**:
- ✅ Dumbbell icon displayed
- ✅ Message: "No Training Programs Yet"
- ✅ Statistics show all zeros

### Test Case 10.8: Progress Calculation
1. View a program with 2 out of 6 exercises completed

**Expected Result**:
- ✅ Progress bar shows 33%
- ✅ Text shows "2/6 exercises"
- ✅ Updates immediately when toggling completion

### Test Case 10.9: Responsive Design
1. Resize browser from desktop to mobile

**Expected Result**:
- ✅ Desktop: 2-column grid
- ✅ Mobile: 1-column grid
- ✅ Modals scrollable on small screens
- ✅ All elements remain accessible

### Test Case 10.10: Data Persistence
1. Complete an exercise
2. Navigate away and return

**Expected Result**:
- ✅ Completed exercise still marked complete
- ✅ Progress unchanged
- ✅ Data persists in localStorage

---

## 🔍 Final Testing Checklist (Step 10 Added)

### Training Program Management (Trainer - Step 9)
- [x] Trainer can access Training Programs tab
- [x] Create program with all required fields
- [x] Add multiple exercises to program
- [x] Edit existing program
- [x] Delete program with confirmation
- [x] Client selection works
- [x] Goal selection works (5 options)
- [x] Exercise categories work (6 options)
- [x] Intensity levels work (3 options)
- [x] Day assignment works (7 days + Daily)
- [x] Sets/Reps fields work
- [x] Duration field works
- [x] Instructions field (optional)
- [x] Email notification sent to client
- [x] Programs display in grid layout
- [x] Status badges color-coded
- [x] Empty state displays correctly
- [x] Date calculations correct
- [x] Program data persists in localStorage
- [x] Remove exercise from program works
- [x] Validation prevents empty programs
- [x] Members cannot access trainer features

### Client Training Program View (Member - Step 10)
- [x] Member can access Training Programs tab
- [x] Program list displays correctly
- [x] Statistics cards show accurate counts
- [x] Program cards show all details
- [x] Progress bars display correct percentage
- [x] "View Program" opens detail modal
- [x] Program info section complete
- [x] Trainer notes displayed
- [x] Exercises grouped by day
- [x] Exercise completion toggle works
- [x] Completed exercises have green background
- [x] "Log Workout" button appears
- [x] Log workout modal works
- [x] Difficulty selector works
- [x] Send feedback modal works
- [x] Empty state displays for new users
- [x] Progress updates in real-time
- [x] Multiple programs display correctly
- [x] Data persists across navigation
- [x] Responsive design works
- [x] Demo data loads correctly

---

## ✅ STEP 11: Task Assignment System

### Test Case 11.1: Access Task Assignment (Manager)
1. Login as manager: `manager@fithub.gr` / `Manager123!`
2. Navigate to "Task Assignment" tab

**Expected Result**:
- ✅ Task Assignment page loads
- ✅ Statistics cards show correct counts
- ✅ See demo tasks (3 tasks assigned to trainer)
- ✅ "Assign New Task" button visible

### Test Case 11.2: View Statistics Dashboard
1. On Task Assignment page, check statistics

**Expected Result**:
- ✅ Total Tasks: 3
- ✅ Pending: 2 (or current count)
- ✅ In Progress: 1 (or current count)
- ✅ Completed: 0 (initially)
- ✅ High Priority: 1 (Equipment Maintenance)

### Test Case 11.3: Create New Task
1. Click "Assign New Task" button
2. Fill in the form:
   - Title: "Organize Locker Room"
   - Description: "Clean and reorganize the locker room area"
   - Type: Maintenance
   - Assign To: Select a staff member (e.g., Sarah Johnson - trainer)
   - Priority: Medium
   - Frequency: Weekly
   - Deadline: Select a future date
   - Notes: "Check lost and found items"
3. Click "Create Task"

**Expected Result**:
- ✅ Modal opens with empty form
- ✅ All fields accept input
- ✅ Assign To dropdown shows staff members (trainers, secretaries, managers only)
- ✅ After creating:
  - Modal closes
  - New task appears in list
  - Email sent to assignee
  - Statistics update (Total Tasks increases)

### Test Case 11.4: Filter Tasks by Status
1. Use "Filter by Status" dropdown
2. Select "Pending"

**Expected Result**:
- ✅ Only shows pending tasks
- ✅ In Progress and Completed tasks hidden
- ✅ Empty state if no pending tasks

### Test Case 11.5: Filter Tasks by Assignee
1. Use "Filter by Assignee" dropdown
2. Select a specific staff member

**Expected Result**:
- ✅ Only shows tasks assigned to that person
- ✅ Other tasks hidden
- ✅ Empty state if no tasks for that person

### Test Case 11.6: View Task Details
1. Click "View" (eye icon) on any task

**Expected Result**:
- ✅ Detail modal opens
- ✅ Shows all task information:
  - Title, Description
  - Type, Status, Priority badges (color-coded)
  - Frequency
  - Assigned To, Assigned By
  - Deadline, Assigned On (formatted dates)
  - Notes (if any)
- ✅ "Close" button works

### Test Case 11.7: Edit Task
1. Click "Edit" (pencil icon) on any task
2. Modify some fields:
   - Change priority to High
   - Update deadline
   - Add notes
3. Click "Update Task"

**Expected Result**:
- ✅ Edit modal opens with pre-filled data
- ✅ All fields editable
- ✅ After updating:
  - Modal closes
  - Task shows updated information
  - Changes persist in database

### Test Case 11.8: Delete Task
1. Click "Delete" (trash icon) on any task
2. Confirm deletion

**Expected Result**:
- ✅ Confirmation modal opens
- ✅ Shows task title and assignee
- ✅ Warning about irreversible action
- ✅ After confirming:
  - Modal closes
  - Task removed from list
  - Statistics update (Total Tasks decreases)

### Test Case 11.9: Form Validation (Create Task)
1. Click "Assign New Task"
2. Leave required fields empty
3. Click "Create Task"

**Expected Result**:
- ✅ Alert: "Please fill in all required fields"
- ✅ Modal stays open
- ✅ Task not created

### Test Case 11.10: View Tasks as Trainer
1. Logout and login as trainer: `trainer@fithub.gr` / `Trainer123!`
2. Navigate to "My Tasks" tab

**Expected Result**:
- ✅ See tasks assigned to this trainer
- ✅ New task alert banner if any tasks are new
- ✅ Task count badge in navigation
- ✅ Tasks display with all details
- ✅ Status badges show current status

### Test Case 11.11: Start Task (Trainer)
1. As trainer, find a Pending task
2. Click "Start" button

**Expected Result**:
- ✅ Task status changes to "In Progress"
- ✅ Status badge updates to blue
- ✅ "Start" button disappears
- ✅ "Complete" button appears
- ✅ Change persists after page refresh

### Test Case 11.12: Complete Task (Trainer)
1. As trainer, find an "In Progress" task
2. Click "Complete" button

**Expected Result**:
- ✅ Task status changes to "Completed"
- ✅ Status badge updates to green
- ✅ "Complete" button disappears
- ✅ Success message shown
- ✅ completedAt timestamp recorded
- ✅ Change persists in database

### Test Case 11.13: Task Email Notification
1. As manager, create a new task
2. Check sent emails in DevTools → localStorage

**Expected Result**:
- ✅ Email sent to assignee
- ✅ Subject: "New Task Assigned"
- ✅ Body includes:
  - Task title
  - Type, Priority, Deadline
  - Description
  - Notes (if any)
  - Assigned by name

### Test Case 11.14: Empty State
1. As manager, delete all tasks
2. View task list

**Expected Result**:
- ✅ Empty state displayed
- ✅ Icon (ClipboardList)
- ✅ Message: "No Tasks Found"
- ✅ Helpful text suggesting to create first task

### Test Case 11.15: Task Types Display
1. View tasks with different types

**Expected Result**:
- ✅ Administrative: Purple badge
- ✅ Maintenance: Orange badge
- ✅ Training: Green badge
- ✅ Customer Service: Blue badge
- ✅ Marketing: Pink badge
- ✅ Other: Gray badge

### Test Case 11.16: Priority Levels Display
1. View tasks with different priorities

**Expected Result**:
- ✅ Low: Blue badge
- ✅ Medium: Yellow badge
- ✅ High: Red badge

### Test Case 11.17: Frequency Options
1. Create tasks with different frequencies

**Expected Result**:
- ✅ One-time option works
- ✅ Daily option works
- ✅ Weekly option works
- ✅ Monthly option works
- ✅ Frequency displays correctly in task list

### Test Case 11.18: Demo Data Loading
1. Fresh install/clear localStorage
2. Reload page and login as manager

**Expected Result**:
- ✅ 3 demo tasks created automatically
- ✅ All assigned to trainer (Sarah Johnson)
- ✅ Different types: Administrative, Maintenance, Customer Service
- ✅ Different priorities: Medium, High, Low
- ✅ Different statuses: Pending, In Progress

### Test Case 11.19: Combined Filters
1. Set Status filter to "Pending"
2. Set Assignee filter to specific person

**Expected Result**:
- ✅ Shows only tasks matching BOTH filters
- ✅ Empty state if no matches
- ✅ Filters work together correctly

### Test Case 11.20: Data Persistence
1. Create a task
2. Navigate to another tab
3. Return to Task Assignment tab

**Expected Result**:
- ✅ Task still exists
- ✅ All data intact
- ✅ Changes persisted in localStorage

---

## 🔍 Final Testing Checklist (Step 11 Added)

### Training Program Management (Trainer - Step 9)
- [x] Trainer can access Training Programs tab
- [x] Create program with all required fields
- [x] Add multiple exercises to program
- [x] Edit existing program
- [x] Delete program with confirmation
- [x] Client selection works
- [x] Goal selection works (5 options)
- [x] Exercise categories work (6 options)
- [x] Intensity levels work (3 options)
- [x] Day assignment works (7 days + Daily)
- [x] Sets/Reps fields work
- [x] Duration field works
- [x] Instructions field (optional)
- [x] Email notification sent to client
- [x] Programs display in grid layout
- [x] Status badges color-coded
- [x] Empty state displays correctly
- [x] Date calculations correct
- [x] Program data persists in localStorage
- [x] Remove exercise from program works
- [x] Validation prevents empty programs
- [x] Members cannot access trainer features

### Client Training Program View (Member - Step 10)
- [x] Member can access Training Programs tab
- [x] Program list displays correctly
- [x] Statistics cards show accurate counts
- [x] Program cards show all details
- [x] Progress bars display correct percentage
- [x] "View Program" opens detail modal
- [x] Program info section complete
- [x] Trainer notes displayed
- [x] Exercises grouped by day
- [x] Exercise completion toggle works
- [x] Completed exercises have green background
- [x] "Log Workout" button appears
- [x] Log workout modal works
- [x] Difficulty selector works
- [x] Send feedback modal works
- [x] Empty state displays for new users
- [x] Progress updates in real-time
- [x] Multiple programs display correctly
- [x] Data persists across navigation
- [x] Responsive design works
- [x] Demo data loads correctly

### Task Assignment System (Manager/Trainer - Step 11)
- [x] Manager can access Task Assignment tab
- [x] Statistics dashboard shows correct counts
- [x] Create new task with all fields
- [x] Task types work (6 options)
- [x] Priority levels work (3 options)
- [x] Frequency options work (4 options)
- [x] Staff member selection works
- [x] Deadline date picker works
- [x] Edit existing task
- [x] Delete task with confirmation
- [x] View task details modal
- [x] Filter by status works
- [x] Filter by assignee works
- [x] Combined filters work
- [x] Email notification sent on assignment
- [x] Trainer can view assigned tasks
- [x] Trainer can start tasks (Pending → In Progress)
- [x] Trainer can complete tasks (In Progress → Completed)
- [x] Task status updates persist
- [x] Color-coded badges for type, priority, status
- [x] Empty state displays correctly
- [x] Demo data loads (3 tasks)
- [x] Data persists in localStorage
- [x] Form validation works
- [x] Members cannot access task system

---

## ✅ STEP 12: Campaign Management

### Test Case 12.1: Access Campaign Management (Manager)
1. Login as manager: `manager@fithub.gr` / `Manager123!`
2. Navigate to "Promotions & Campaigns" tab

**Expected Result**:
- ✅ Campaign Management page loads
- ✅ Statistics cards show correct counts
- ✅ See 3 demo campaigns (1 Draft, 1 Scheduled, 1 Sent)
- ✅ "Create Campaign" button visible

### Test Case 12.2: View Statistics Dashboard
1. On Campaign Management page, check statistics

**Expected Result**:
- ✅ Total Campaigns: 3
- ✅ Draft: 1
- ✅ Scheduled: 1
- ✅ Sent: 1
- ✅ Total Emails Sent: 150 (from demo sent campaign)

### Test Case 12.3: Create New Campaign
1. Click "Create Campaign" button
2. Fill in the form:
   - Name: "Summer Membership Drive"
   - Description: "Promote summer memberships"
   - Type: Email
   - Target Audience: All Members
   - Subject: "Summer Special - Join Now!"
   - Message: "Get fit this summer with our special offers!"
   - Status: Draft
3. Click "Create Campaign"

**Expected Result**:
- ✅ Modal opens with empty form
- ✅ All fields accept input
- ✅ After creating:
  - Modal closes
  - New campaign appears in list
  - Status shows "Draft"
  - Target count calculated automatically
  - Statistics update

### Test Case 12.4: Target Audience Selection
1. Create campaigns with different target audiences:
   - All Members
   - Premium Members
   - Basic Members
   - New Members

**Expected Result**:
- ✅ Each option selects correctly
- ✅ Target count varies based on audience
- ✅ All Members has highest count
- ✅ Specific audiences have filtered counts

### Test Case 12.5: Send Campaign Now
1. Find a Draft campaign
2. Click "Send" (paper plane icon) button

**Expected Result**:
- ✅ Campaign sent immediately
- ✅ Status changes to "Sent"
- ✅ sentAt timestamp recorded
- ✅ Emails sent to all target members
- ✅ Alert shows: "Campaign sent to X members!"
- ✅ Analytics populated with sent count
- ✅ "Send" button disappears
- ✅ "Analytics" button appears

### Test Case 12.6: View Campaign Details
1. Click "View" (eye icon) on any campaign

**Expected Result**:
- ✅ Detail modal opens
- ✅ Shows all campaign information:
  - Name, Description
  - Type and Status badges (color-coded)
  - Target Audience
  - Subject
  - Message (rendered as HTML)
  - Created By, Created On
  - Sent On (if sent)
- ✅ "Close" button works

### Test Case 12.7: View Campaign Analytics
1. Find a Sent campaign
2. Click "Analytics" (chart icon) button

**Expected Result**:
- ✅ Analytics modal opens
- ✅ Shows campaign name and sent date
- ✅ Displays statistics cards:
  - Target Recipients
  - Sent
  - Delivered
  - Opened (with open rate %)
  - Clicked (with CTR %)
- ✅ Progress bars show:
  - Delivery Rate
  - Open Rate
  - Click-through Rate
- ✅ Percentages calculated correctly

### Test Case 12.8: Edit Draft Campaign
1. Find a Draft campaign
2. Click "Edit" (pencil icon) button
3. Modify fields:
   - Change subject
   - Update message
   - Change target audience
4. Click "Update Campaign"

**Expected Result**:
- ✅ Edit modal opens with pre-filled data
- ✅ All fields editable
- ✅ After updating:
  - Modal closes
  - Campaign shows updated information
  - Target count recalculated if audience changed
  - Changes persist

### Test Case 12.9: Edit Sent Campaign
1. Find a Sent campaign
2. Check available actions

**Expected Result**:
- ✅ No "Edit" button (sent campaigns cannot be edited)
- ✅ No "Send" button
- ✅ "Analytics" button available
- ✅ "View" button available
- ✅ "Delete" button available

### Test Case 12.10: Delete Campaign
1. Click "Delete" (trash icon) on any campaign
2. Confirm deletion

**Expected Result**:
- ✅ Confirmation modal opens
- ✅ Shows campaign name and status
- ✅ Warning about irreversible action
- ✅ After confirming:
  - Modal closes
  - Campaign removed from list
  - Statistics update

### Test Case 12.11: Filter Campaigns by Status
1. Use "Filter by Status" dropdown
2. Select "Draft"

**Expected Result**:
- ✅ Only shows Draft campaigns
- ✅ Scheduled and Sent campaigns hidden
- ✅ Empty state if no draft campaigns

### Test Case 12.12: Schedule Campaign for Future
1. Create new campaign
2. Set Schedule Date to future date/time
3. Set Status to "Scheduled"
4. Create campaign

**Expected Result**:
- ✅ Campaign created with Scheduled status
- ✅ Scheduled date displayed
- ✅ Blue "Scheduled" badge shown
- ✅ Cannot send immediately
- ✅ Can edit before scheduled time

### Test Case 12.13: Campaign Types
1. Create campaigns with different types

**Expected Result**:
- ✅ Email option works (purple badge)
- ✅ SMS option works (orange badge)
- ✅ Push Notification option works (blue badge)
- ✅ In-App option works (green badge)
- ✅ Type badge displays with correct color

### Test Case 12.14: Form Validation
1. Click "Create Campaign"
2. Leave required fields empty
3. Click "Create Campaign"

**Expected Result**:
- ✅ Alert: "Please fill in all required fields"
- ✅ Modal stays open
- ✅ Campaign not created

### Test Case 12.15: Demo Data Loading
1. Fresh install/clear localStorage
2. Reload page and login as manager

**Expected Result**:
- ✅ 3 demo campaigns created automatically
- ✅ "New Year Fitness Challenge" (Sent with analytics)
- ✅ "Premium Membership Upgrade Offer" (Scheduled)
- ✅ "Summer Bootcamp Registration" (Draft)
- ✅ Analytics populated for sent campaign

### Test Case 12.16: Analytics Calculations
1. View analytics for sent campaign with these numbers:
   - Sent: 150
   - Delivered: 148
   - Opened: 112
   - Clicked: 45

**Expected Result**:
- ✅ Delivery Rate: 99% (148/150)
- ✅ Open Rate: 76% (112/148)
- ✅ Click-through Rate: 40% (45/112)
- ✅ Progress bars show correct percentages
- ✅ All numbers display correctly

### Test Case 12.17: Email Distribution
1. Send a campaign to "All Members"
2. Check sent emails in DevTools → localStorage

**Expected Result**:
- ✅ Individual email sent to each member
- ✅ Subject matches campaign subject
- ✅ Body matches campaign message
- ✅ All target members receive email
- ✅ Email count matches target count

### Test Case 12.18: Empty State
1. As manager, delete all campaigns
2. View campaign list

**Expected Result**:
- ✅ Empty state displayed
- ✅ Megaphone icon
- ✅ Message: "No Campaigns Found"
- ✅ Helpful text suggesting to create first campaign

### Test Case 12.19: HTML Message Rendering
1. Create campaign with HTML in message:
   ```html
   <h2>Special Offer</h2>
   <p>Get <strong>20% off</strong>!</p>
   ```
2. View campaign details

**Expected Result**:
- ✅ HTML renders correctly in view modal
- ✅ Heading displays as heading
- ✅ Bold text displays as bold
- ✅ Formatting preserved

### Test Case 12.20: Data Persistence
1. Create a campaign
2. Navigate to another tab
3. Return to Promotions & Campaigns tab

**Expected Result**:
- ✅ Campaign still exists
- ✅ All data intact
- ✅ Changes persisted in localStorage

---

## ✅ STEP 13: Analytics Dashboard

### Test Case 13.1: Access Analytics Dashboard
1. Login as manager (manager@fithub.gr / Manager123!)
2. Navigate to manager dashboard
3. Click "Analytics & Reports" tab

**Expected Result**:
- ✅ Analytics dashboard loads
- ✅ Shows all analytics sections
- ✅ Data loads from database

### Test Case 13.2: Overview Statistics Display
1. View overview statistics section at top of dashboard

**Expected Result**:
- ✅ 4 stat cards displayed:
  - Total Members (with active member count)
  - New This Month (last 30 days count)
  - Total Revenue (all time)
  - Monthly Revenue (last 30 days)
- ✅ Color-coded icons (blue, green, purple, orange)
- ✅ Numbers display correctly
- ✅ Subtitle text shows context

### Test Case 13.3: Membership Distribution
1. View "Membership Distribution" section

**Expected Result**:
- ✅ 3 cards displayed:
  - Premium Members with count and percentage
  - Basic Members with count and percentage
  - Active Members with count and percentage
- ✅ Progress bars show correct percentages
- ✅ Percentages calculated correctly (count/total * 100)
- ✅ Subtitle shows "X% of total"

### Test Case 13.4: Activity Metrics
1. View "Activity Metrics" section

**Expected Result**:
- ✅ 4 metric cards displayed:
  - Total Classes
  - Class Bookings
  - Training Programs (with active count)
  - Campaigns Sent
- ✅ Icon indicators for each metric
- ✅ Correct counts from database
- ✅ Subtitle text provides context

### Test Case 13.5: Class Utilization Analysis
1. Scroll to "Class Utilization" section

**Expected Result**:
- ✅ Shows top 10 classes by utilization
- ✅ Each class shows:
  - Name and category
  - Enrolled/capacity count
  - Utilization percentage badge
  - Progress bar
- ✅ Color-coded badges:
  - Green: ≥80% utilization
  - Yellow: ≥50% utilization
  - Red: <50% utilization
- ✅ Sorted by utilization (highest first)

### Test Case 13.6: Revenue Trend Visualization
1. View "Revenue Trend (Last 6 Months)" section

**Expected Result**:
- ✅ 6 months displayed (Jan-Jun)
- ✅ Each month shows revenue amount
- ✅ Progress bars show relative amounts
- ✅ Amounts formatted as currency (€X,XXX)
- ✅ Largest revenue gets 100% bar

### Test Case 13.7: Task Completion Rate
1. View "Operations" section → "Task Completion Rate" card

**Expected Result**:
- ✅ Shows completed task count
- ✅ Shows pending task count
- ✅ Shows total task count
- ✅ Progress bar shows completion percentage
- ✅ Percentage calculated correctly: (completed / total) * 100
- ✅ Text shows "X% completion rate"

### Test Case 13.8: Quick Stats
1. View "Operations" section → "Quick Stats" card

**Expected Result**:
- ✅ Avg. Class Size calculated (total enrolled / number of classes)
- ✅ Avg. Class Utilization calculated (average of all utilization percentages)
- ✅ Avg. Revenue/Member calculated (total revenue / total members)
- ✅ All averages rounded to whole numbers
- ✅ Revenue shown with € symbol

### Test Case 13.9: Real-time Data Updates
1. Create a new member from secretary dashboard
2. Navigate back to Analytics dashboard

**Expected Result**:
- ✅ Total Members count increased by 1
- ✅ New This Month count increased by 1
- ✅ Active Members updated
- ✅ All calculations recalculated

### Test Case 13.10: Handle No Data Scenarios
1. Create new database or clear data
2. View analytics dashboard

**Expected Result**:
- ✅ All counts show 0
- ✅ Percentages show 0%
- ✅ No division by zero errors
- ✅ Class utilization shows "No classes available"
- ✅ Progress bars handle 0 values

### Test Case 13.11: Member Type Calculations
1. View membership distribution
2. Check that counts match database

**Expected Result**:
- ✅ Premium count = memberships with type "Premium"
- ✅ Basic count = memberships with type "Basic"
- ✅ Active count = users with accountStatus "Active"
- ✅ Total = all members
- ✅ Percentages add up correctly

### Test Case 13.12: Revenue Calculations
1. View revenue statistics

**Expected Result**:
- ✅ Total Revenue = sum of all completed transactions
- ✅ Monthly Revenue = sum of completed transactions in last 30 days
- ✅ Only "Completed" status transactions counted
- ✅ Failed/Pending transactions excluded
- ✅ Amounts displayed with thousand separators (€1,234)

### Test Case 13.13: New Members This Month
1. View "New This Month" statistic
2. Check against database

**Expected Result**:
- ✅ Only counts members created in last 30 days
- ✅ Uses createdAt timestamp
- ✅ Calculation: new Date() - 30 days
- ✅ Count updates daily automatically

### Test Case 13.14: Loading State
1. Reload analytics dashboard
2. Observe loading behavior

**Expected Result**:
- ✅ Shows "Loading analytics..." message initially
- ✅ Loading state displays briefly
- ✅ Transitions to full dashboard when ready
- ✅ No flash of empty content

### Test Case 13.15: Responsive Design
1. View analytics on different screen sizes:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

**Expected Result**:
- ✅ Desktop: 4 columns for overview stats
- ✅ Tablet: 2 columns for overview stats
- ✅ Mobile: 1 column (stacked)
- ✅ All sections responsive
- ✅ No horizontal scrolling
- ✅ Cards resize properly

### Test Case 13.16: Campaign Analytics Integration
1. Send a campaign from Promotions tab
2. Return to Analytics dashboard

**Expected Result**:
- ✅ Campaigns Sent count increased by 1
- ✅ Data updates in real-time
- ✅ Count matches database

### Test Case 13.17: Class Utilization Edge Cases
1. Create a class with 0 capacity
2. View class utilization

**Expected Result**:
- ✅ Handles division by zero
- ✅ Shows 0% or N/A
- ✅ No errors in console

### Test Case 13.18: Progress Bar Accuracy
1. View multiple progress bars across dashboard

**Expected Result**:
- ✅ All progress bars show correct percentage
- ✅ Progress fills from left to right
- ✅ Color matches percentage:
  - High (≥80%): Green
  - Medium (≥50%): Yellow
  - Low (<50%): Red
- ✅ Visual representation matches number

### Test Case 13.19: Icon Display
1. Check all icons across dashboard

**Expected Result**:
- ✅ Total Members: Users icon (blue)
- ✅ New Members: TrendingUp icon (green)
- ✅ Total Revenue: DollarSign icon (purple)
- ✅ Monthly Revenue: Activity icon (orange)
- ✅ Premium Members: Award icon (yellow)
- ✅ Basic Members: Target icon (blue)
- ✅ Active Members: Activity icon (green)
- ✅ All icons render correctly
- ✅ Icons sized consistently

### Test Case 13.20: Data Persistence
1. View analytics dashboard
2. Navigate to another tab
3. Return to analytics dashboard

**Expected Result**:
- ✅ Data reloads from database
- ✅ Fresh calculations performed
- ✅ No stale data displayed
- ✅ Always shows current state

---

## 🔍 Final Testing Checklist (Step 13 Added)

### Training Program Management (Trainer - Step 9)
- [x] Trainer can access Training Programs tab
- [x] Create program with all required fields
- [x] Add multiple exercises to program
- [x] Edit existing program
- [x] Delete program with confirmation
- [x] Client selection works
- [x] Goal selection works (5 options)
- [x] Exercise categories work (6 options)
- [x] Intensity levels work (3 options)
- [x] Day assignment works (7 days + Daily)
- [x] Sets/Reps fields work
- [x] Duration field works
- [x] Instructions field (optional)
- [x] Email notification sent to client
- [x] Programs display in grid layout
- [x] Status badges color-coded
- [x] Empty state displays correctly
- [x] Date calculations correct
- [x] Program data persists in localStorage
- [x] Remove exercise from program works
- [x] Validation prevents empty programs
- [x] Members cannot access trainer features

### Client Training Program View (Member - Step 10)
- [x] Member can access Training Programs tab
- [x] Program list displays correctly
- [x] Statistics cards show accurate counts
- [x] Program cards show all details
- [x] Progress bars display correct percentage
- [x] "View Program" opens detail modal
- [x] Program info section complete
- [x] Trainer notes displayed
- [x] Exercises grouped by day
- [x] Exercise completion toggle works
- [x] Completed exercises have green background
- [x] "Log Workout" button appears
- [x] Log workout modal works
- [x] Difficulty selector works
- [x] Send feedback modal works
- [x] Empty state displays for new users
- [x] Progress updates in real-time
- [x] Multiple programs display correctly
- [x] Data persists across navigation
- [x] Responsive design works
- [x] Demo data loads correctly

### Task Assignment System (Manager/Trainer - Step 11)
- [x] Manager can access Task Assignment tab
- [x] Statistics dashboard shows correct counts
- [x] Create new task with all fields
- [x] Task types work (6 options)
- [x] Priority levels work (3 options)
- [x] Frequency options work (4 options)
- [x] Staff member selection works
- [x] Deadline date picker works
- [x] Edit existing task
- [x] Delete task with confirmation
- [x] View task details modal
- [x] Filter by status works
- [x] Filter by assignee works
- [x] Combined filters work
- [x] Email notification sent on assignment
- [x] Trainer can view assigned tasks
- [x] Trainer can start tasks (Pending → In Progress)
- [x] Trainer can complete tasks (In Progress → Completed)
- [x] Task status updates persist
- [x] Color-coded badges for type, priority, status
- [x] Empty state displays correctly
- [x] Demo data loads (3 tasks)
- [x] Data persists in localStorage
- [x] Form validation works
- [x] Members cannot access task system

### Campaign Management (Manager - Step 12)
- [x] Manager can access Promotions & Campaigns tab
- [x] Statistics dashboard shows correct counts
- [x] Create new campaign with all fields
- [x] Campaign types work (4 options)
- [x] Target audience options work (5 options)
- [x] Subject and message fields work
- [x] Schedule date picker works
- [x] Send campaign immediately
- [x] View campaign details
- [x] View campaign analytics
- [x] Edit draft campaigns
- [x] Delete campaigns with confirmation
- [x] Filter by status works
- [x] Email distribution to target members
- [x] Target count calculated correctly
- [x] Analytics calculations accurate (delivery, open, CTR)
- [x] Progress bars show correct percentages
- [x] Color-coded badges for type and status
- [x] Empty state displays correctly
- [x] Demo data loads (3 campaigns with analytics)
- [x] HTML message rendering works
- [x] Data persists in localStorage
- [x] Form validation works
- [x] Sent campaigns cannot be edited

### Analytics Dashboard (Manager - Step 13)
- [x] Manager can access Analytics & Reports tab
- [x] Overview statistics display correctly
- [x] Total Members count accurate
- [x] New This Month calculation (last 30 days)
- [x] Total Revenue calculated correctly
- [x] Monthly Revenue calculated correctly
- [x] Membership distribution breakdown works
- [x] Premium Members count and percentage
- [x] Basic Members count and percentage
- [x] Active Members count and percentage
- [x] Progress bars show correct percentages
- [x] Activity metrics display correctly
- [x] Total Classes count accurate
- [x] Class Bookings count accurate
- [x] Training Programs count accurate
- [x] Campaigns Sent count accurate
- [x] Class utilization analysis works
- [x] Top 10 classes displayed
- [x] Utilization percentages calculated correctly
- [x] Color-coded utilization badges (green/yellow/red)
- [x] Revenue trend visualization works
- [x] 6 months revenue displayed
- [x] Progress bars for revenue amounts
- [x] Task completion rate accurate
- [x] Quick stats calculations correct
- [x] Average class size calculated
- [x] Average utilization calculated
- [x] Average revenue per member calculated
- [x] Real-time data updates
- [x] Loading state displays
- [x] Empty states handled (no data)
- [x] No division by zero errors
- [x] Responsive design works
- [x] Icons display correctly
- [x] Data persistence across navigation
- [x] Currency formatting (€ with separators)
- [x] Percentage calculations accurate
- [x] All metrics aggregated from database

---

## ✅ STEP 14: Discount Code System

### Manager - Discount Code Management

### Test Case 14.1: View Discount Code Statistics
1. Login as manager (manager@fithub.gr / Manager123!)
2. Navigate to "Discount Codes" tab

**Expected Result**:
- ✅ Statistics cards show: Total Codes (4), Active (3), Expired (1), Total Usage (0)
- ✅ 4 demo discount codes displayed

### Test Case 14.2: Create Percentage Discount Code
1. Click "Create Code"
2. Fill in form:
   - Code: SPRING25
   - Name: Spring Special
   - Description: 25% off all memberships
   - Discount Type: Percentage
   - Discount Value: 25
   - Applies To: All Memberships
   - Max Discount Amount: 30
   - Usage Limit: 50
   - Usage Per User: 1
   - Valid From: Today
   - Valid Until: +30 days
3. Click "Create Code"

**Expected Result**:
- ✅ Code created successfully
- ✅ Appears in discount codes list
- ✅ Status shows "Active"
- ✅ Statistics updated (Total Codes: 5, Active: 4)

### Test Case 14.3: Create Fixed Amount Discount Code
1. Click "Create Code"
2. Fill in:
   - Code: SAVE40
   - Discount Type: Fixed Amount
   - Discount Value: 40
   - Min Purchase Amount: 80
3. Create code

**Expected Result**:
- ✅ Code created with fixed amount discount
- ✅ Shows "€40" discount in list

### Test Case 14.4: Edit Discount Code
1. Click edit button on SPRING25 code
2. Change Discount Value to 30
3. Change Status to Disabled
4. Click "Update Code"

**Expected Result**:
- ✅ Code updated successfully
- ✅ Shows 30% discount
- ✅ Status badge shows "Disabled"
- ✅ Active count decreased by 1

### Test Case 14.5: View Discount Code Details
1. Click "View" on any discount code

**Expected Result**:
- ✅ Modal opens with all code details
- ✅ Shows code, name, description
- ✅ Shows discount type and value
- ✅ Shows applies to, usage, validity dates
- ✅ Shows created by and creation date

### Test Case 14.6: Delete Discount Code
1. Click delete button on a code
2. Confirm deletion

**Expected Result**:
- ✅ Confirmation modal appears
- ✅ Shows warning message
- ✅ Code deleted from list
- ✅ Statistics updated

### Test Case 14.7: Filter Discount Codes by Status
1. Select "Active" from filter dropdown
2. Select "Expired"
3. Select "All"

**Expected Result**:
- ✅ Shows only active codes when filtered by Active
- ✅ Shows only expired codes when filtered by Expired
- ✅ Shows all codes when "All" selected

### Test Case 14.8: Premium-Only Code Validation
1. Create code with "Applies To: Premium Only"
2. Note the code

**Expected Result**:
- ✅ Code created
- ✅ Shows "Premium Only" in details

### Test Case 14.9: Form Validation
1. Try to create code without required fields
2. Try to create code with invalid dates

**Expected Result**:
- ✅ Create button disabled when fields missing
- ✅ Validation messages shown

### Test Case 14.10: Usage Limit Tracking
1. View code details
2. Check usage count

**Expected Result**:
- ✅ Shows "0/50" or similar usage count
- ✅ Unlimited shows as "0/∞"

### Member - Apply Discount Code

### Test Case 14.11: View Current Membership
1. Login as member (member@fithub.gr / Member123!)
2. Navigate to "Discounts & Offers" tab

**Expected Result**:
- ✅ Shows current membership card (if exists)
- ✅ Shows membership type, status, expiry date
- ✅ Shows monthly cost

### Test Case 14.12: Select Membership Plan
1. Click on Basic plan
2. Click on Premium plan
3. Click on Elite plan

**Expected Result**:
- ✅ Plan selection highlights with blue border
- ✅ Shows pricing for each plan (€49, €79, €99)
- ✅ Discount resets when changing plans

### Test Case 14.13: Apply Valid Discount Code
1. Select Basic plan (€49)
2. Enter code: WELCOME20
3. Click "Apply"

**Expected Result**:
- ✅ Success message shown
- ✅ Green box displays discount details
- ✅ Shows original amount: €49
- ✅ Shows discount: -€9.80 (20%)
- ✅ Shows final amount: €39.20
- ✅ Shows "You save €9.80!"
- ✅ "Proceed to Payment" button appears

### Test Case 14.14: Apply Invalid Code
1. Enter code: INVALIDCODE
2. Click "Apply"

**Expected Result**:
- ✅ Error message: "Invalid discount code"
- ✅ Red alert box shown
- ✅ No discount applied

### Test Case 14.15: Apply Expired Code
1. Enter code: NEWYEAR2026
2. Click "Apply"

**Expected Result**:
- ✅ Error message: "This discount code has expired"
- ✅ Red alert box shown

### Test Case 14.16: Premium-Only Code on Basic Plan
1. Select Basic plan
2. Enter code: PREMIUM20
3. Click "Apply"

**Expected Result**:
- ✅ Error message: "This code is only valid for Premium memberships"
- ✅ Code not applied

### Test Case 14.17: Premium-Only Code on Premium Plan
1. Select Premium plan (€79)
2. Enter code: PREMIUM20
3. Click "Apply"

**Expected Result**:
- ✅ Success! Code applied
- ✅ Shows 20% discount (€15.80 off)
- ✅ Final amount: €63.20

### Test Case 14.18: Fixed Amount Discount
1. Select Premium plan (€79)
2. Enter code: SUMMER50
3. Click "Apply"

**Expected Result**:
- ✅ Code applied successfully
- ✅ Shows fixed discount: -€50.00
- ✅ Final amount: €29.00
- ✅ Badge shows "€50" discount type

### Test Case 14.19: Min Purchase Amount Validation
1. Select Basic plan (€49)
2. Enter code: SUMMER50 (requires min €100)
3. Click "Apply"

**Expected Result**:
- ✅ Error: "Minimum purchase amount of €100 required"
- ✅ Code not applied

### Test Case 14.20: Remove Applied Code
1. Apply a valid code
2. Click "Remove" button

**Expected Result**:
- ✅ Code removed
- ✅ Discount calculation cleared
- ✅ Input field enabled again
- ✅ Proceed to Payment button hidden

### Test Case 14.21: Proceed to Payment
1. Apply valid code WELCOME20 to Basic plan
2. Click "Proceed to Payment"

**Expected Result**:
- ✅ Alert shows: "Discount applied! You saved €9.80"
- ✅ Shows final amount in alert
- ✅ Form resets after confirmation

### Test Case 14.22: Loading State
1. Enter a code
2. Click "Apply"
3. Observe during validation

**Expected Result**:
- ✅ Button shows "Validating" with spinner
- ✅ Button disabled during validation
- ✅ 500ms delay simulated

### Test Case 14.23: View Available Codes Info
1. Scroll to bottom of discount code section

**Expected Result**:
- ✅ Blue info box shows available codes
- ✅ Lists WELCOME20, PREMIUM20, SUMMER50
- ✅ Shows brief description of each
- ✅ Shows terms note

### Test Case 14.24: Plan Change with Active Discount
1. Apply code to Basic plan
2. Change to Premium plan

**Expected Result**:
- ✅ Discount automatically removed
- ✅ Success message cleared
- ✅ Input field cleared
- ✅ User can apply code again for new plan

### Test Case 14.25: Max Discount Cap (Percentage)
1. Create code: 50% off with max €20 cap
2. Apply to Elite plan (€99)
3. Expected discount: 50% = €49.50, but capped at €20

**Expected Result**:
- ✅ Discount shown as €20.00 (not €49.50)
- ✅ Final amount: €79.00

### Integration Tests

### Test Case 14.26: Usage Tracking
1. As member, apply code WELCOME20 and proceed
2. As manager, view WELCOME20 code details

**Expected Result**:
- ✅ Usage count incremented (0/100 → 1/100)
- ✅ Code still active

### Test Case 14.27: Usage Per User Limit
1. Apply code with usagePerUser: 1
2. Complete purchase (mock)
3. Try to apply same code again

**Expected Result**:
- ✅ Error: "You have already used this discount code the maximum number of times"

### Test Case 14.28: Total Usage Limit Reached
1. Create code with usage limit: 1
2. Use code once
3. Try to use code again (as different user or same)

**Expected Result**:
- ✅ Error: "This discount code has reached its usage limit"

### Test Case 14.29: Discount Code in Campaign Email
1. View campaign "Premium Membership Upgrade Offer"
2. Check message content

**Expected Result**:
- ✅ Email mentions code PREMIUM20
- ✅ Code exists and is valid

### Test Case 14.30: Statistics Accuracy
1. Create 3 codes
2. Expire 1 code
3. Disable 1 code
4. Use 2 codes (mock usage)

**Expected Result**:
- ✅ Total Codes: increases by 3
- ✅ Active Codes: increases by 1
- ✅ Expired Codes: increases by 1
- ✅ Total Usage: increases by 2

### Checklist - Discount Code Management (Manager)
- [x] Statistics display correctly
- [x] Create percentage discount code works
- [x] Create fixed amount discount code works
- [x] Edit discount code works
- [x] Delete discount code works
- [x] View discount code details works
- [x] Filter by status works (All, Active, Expired, Disabled)
- [x] Form validation enforced
- [x] Required fields validated
- [x] Date pickers work
- [x] Status dropdown works
- [x] Discount type selection works
- [x] Applicable membership type selection works
- [x] Usage limits configurable
- [x] Max discount cap for percentage codes
- [x] Min purchase amount configurable
- [x] Empty state shown when no codes
- [x] Modal close buttons work
- [x] Demo codes initialized (4 codes)
- [x] Responsive design works

### Checklist - Apply Discount Code (Member)
- [x] Membership selection works
- [x] Input field functional
- [x] Apply button triggers validation
- [x] Valid code accepted
- [x] Invalid code rejected
- [x] Expired code rejected
- [x] Disabled code rejected
- [x] Usage limit validated
- [x] Per-user limit validated
- [x] Min purchase amount validated
- [x] Membership type restriction validated
- [x] Percentage discount calculated correctly
- [x] Fixed amount discount calculated correctly
- [x] Max discount cap applied
- [x] Savings displayed correctly
- [x] Success message shown
- [x] Error messages shown
- [x] Remove code works
- [x] Loading state displays
- [x] Proceed to payment functional
- [x] Plan change resets discount
- [x] Available codes info displayed
- [x] Responsive design works
- [x] Code input uppercase conversion works
- [x] Real-time validation (500ms delay)

---

## Step 15: Client Progress Tracking (UC-8)

### Test Case 15.1: Client Selection

**Steps**:
1. Login as trainer (sarah@fithub.com / password)
2. Navigate to "Progress Tracking" tab
3. Verify client dropdown is populated
4. Select a client from dropdown
5. Verify progress summary loads

**Expected Result**:
- ✅ Dropdown shows all assigned clients
- ✅ Client name and email displayed in dropdown options
- ✅ Progress summary cards appear when client selected
- ✅ Chart displays if progress records exist
- ✅ "No progress records yet" message if no data

### Test Case 15.2: View Progress Summary

**Steps**:
1. Login as trainer
2. Select client "John Doe" (has demo data)
3. View the 4 summary cards

**Expected Result**:
- ✅ Weight card shows latest weight and trend (down arrow, green)
- ✅ Body Fat card shows latest percentage and trend (down arrow, green)
- ✅ Muscle Mass card shows latest mass and trend (up arrow, green)
- ✅ Total Records card shows count of progress entries
- ✅ Trend indicators accurate (comparing current vs previous)

### Test Case 15.3: View Progress Chart

**Steps**:
1. Login as trainer
2. Select client with progress data
3. View the "Progress Trends" chart

**Expected Result**:
- ✅ LineChart displays with date on X-axis
- ✅ Three lines visible (Weight, Body Fat, Muscle Mass)
- ✅ Legend shows color coding
- ✅ Tooltip displays on hover
- ✅ Chart responsive to screen size
- ✅ Data points sorted chronologically

### Test Case 15.4: Add Progress Record - Body Metrics Only

**Steps**:
1. Login as trainer
2. Select a client
3. Click "Add Progress Record"
4. Fill in body metrics:
   - Weight: 82.5
   - Body Fat: 19.5
   - Muscle Mass: 36.0
5. Click "Save & Notify Client"

**Expected Result**:
- ✅ Modal opens with form
- ✅ Body metrics inputs accept decimal values
- ✅ Record saved successfully
- ✅ Modal closes
- ✅ Progress history updates with new entry
- ✅ Summary cards update with new data
- ✅ Email sent to client (check console)
- ✅ Chart updates with new data point

### Test Case 15.5: Add Progress Record - Complete Entry

**Steps**:
1. Login as trainer
2. Select a client
3. Click "Add Progress Record"
4. Fill in all fields:
   - Weight: 80
   - Body Fat: 18
   - Muscle Mass: 37
   - Chest: 100
   - Waist: 85
   - Hips: 98
   - Biceps: 35
   - Thighs: 58
   - Goals: "Reach 77kg by end of month"
   - Notes: "Excellent progress this week"
5. Add 2 exercises:
   - Bench Press: 4 sets, 8-10 reps, 70kg, Medium difficulty
   - Squats: 4 sets, 10-12 reps, 100kg, Hard difficulty
6. Click "Save & Notify Client"

**Expected Result**:
- ✅ All input fields functional
- ✅ Exercise performance section allows adding multiple exercises
- ✅ Difficulty dropdown works (Easy/Medium/Hard)
- ✅ Record saved with all data
- ✅ Progress history shows "2 exercises logged" badge
- ✅ Email notification sent

### Test Case 15.6: Add Exercise Performance

**Steps**:
1. Open "Add Progress Record" modal
2. Click "Add Exercise" button
3. Fill in exercise details:
   - Exercise Name: "Deadlift"
   - Sets: 3
   - Reps: "6-8"
   - Weight: 120
   - Difficulty: "Hard"
   - Notes: "New PR!"
4. Click "Add Exercise" again
5. Remove the first exercise
6. Save the record

**Expected Result**:
- ✅ "Add Exercise" button creates new exercise form
- ✅ Exercise counter increments (Exercise 1, Exercise 2, etc.)
- ✅ All exercise fields editable
- ✅ "Remove" button deletes exercise
- ✅ Exercise count updates after removal
- ✅ Saved record contains only remaining exercises

### Test Case 15.7: View Progress History

**Steps**:
1. Login as trainer
2. Select client with multiple progress records
3. Scroll to "Progress History" section
4. Observe the list of records

**Expected Result**:
- ✅ Records sorted by date (newest first)
- ✅ Each card shows date icon and formatted date
- ✅ Weight/body fat/muscle mass displayed if present
- ✅ Icons color-coded (blue for weight, orange for body fat, green for muscle)
- ✅ Exercise badge shows count if exercises logged
- ✅ Cards have hover effect
- ✅ Eye icon visible on each card

### Test Case 15.8: View Progress Details

**Steps**:
1. Login as trainer
2. Select client
3. Click on any progress record in history
4. Modal opens with full details

**Expected Result**:
- ✅ Modal displays record date
- ✅ Body metrics section shows all recorded metrics
- ✅ Body measurements section (if present) shows all 5 measurements
- ✅ Exercise performance section (if present) lists all exercises
- ✅ Exercise difficulty badge color-coded (Easy=outline, Medium=secondary, Hard=destructive)
- ✅ Goals displayed if present
- ✅ Trainer notes displayed if present
- ✅ Footer shows recorded by trainer name and timestamp
- ✅ "Close" button functional

### Test Case 15.9: Progress Trend Calculation - Weight Loss

**Steps**:
1. Login as trainer
2. Select client with weight trend
3. View Weight summary card

**Expected Result**:
- ✅ If weight decreased: green text, down arrow, "-X.X kg"
- ✅ If weight increased: red text, up arrow, "+X.X kg"
- ✅ If weight stable (<0.1 kg diff): gray text, minus icon, "Stable"
- ✅ Calculation accurate comparing latest vs previous

### Test Case 15.10: Progress Trend Calculation - Muscle Gain

**Steps**:
1. Login as trainer
2. Select client with muscle mass trend
3. View Muscle Mass summary card

**Expected Result**:
- ✅ If muscle increased: green text, up arrow, "+X.X kg"
- ✅ If muscle decreased: red text, down arrow, "-X.X kg"
- ✅ If muscle stable: gray text, minus icon, "Stable"
- ✅ Trend direction appropriate for muscle gain goal

### Test Case 15.11: Email Notification

**Steps**:
1. Login as trainer
2. Select a client
3. Add progress record
4. Click "Save & Notify Client"
5. Check browser console for email log

**Expected Result**:
- ✅ Email sent to client's email address
- ✅ Subject: "Progress Update Recorded"
- ✅ Body includes trainer name
- ✅ Body includes recorded date
- ✅ Body includes weight/body fat/muscle mass (if present)
- ✅ Body includes notes (if present)
- ✅ Email logged to console with ✉️ icon

### Test Case 15.12: Empty State

**Steps**:
1. Login as trainer
2. Select client with no progress records
3. Scroll to Progress History

**Expected Result**:
- ✅ Summary cards show "N/A" for metrics
- ✅ No trend indicators displayed
- ✅ Total Records shows "0"
- ✅ Chart hidden (no data to display)
- ✅ Progress history shows "No progress records yet. Add the first one!"
- ✅ "Add Progress Record" button still functional

### Test Case 15.13: Modal Form Validation

**Steps**:
1. Login as trainer
2. Open "Add Progress Record" modal
3. Try saving without filling any fields
4. Fill in partial data and save

**Expected Result**:
- ✅ All fields optional (can save with minimal data)
- ✅ Number inputs accept decimal values
- ✅ Exercise fields allow empty state
- ✅ Measurements can be individually skipped
- ✅ Record saves with only filled fields

### Test Case 15.14: Cancel Modal

**Steps**:
1. Open "Add Progress Record" modal
2. Fill in some data
3. Click "Cancel" button
4. Re-open modal

**Expected Result**:
- ✅ Modal closes on cancel
- ✅ Data not saved
- ✅ Form resets when modal re-opened
- ✅ No progress record added to history

### Test Case 15.15: Multiple Clients Progress

**Steps**:
1. Login as trainer
2. Select first client, add progress
3. Switch to second client
4. Verify correct data displays
5. Add progress for second client
6. Switch back to first client

**Expected Result**:
- ✅ Client switch loads correct progress records
- ✅ Summary cards update per client
- ✅ Chart data specific to selected client
- ✅ History filtered by client
- ✅ No data mixing between clients

### Test Case 15.16: Chart Responsiveness

**Steps**:
1. Login as trainer and view progress chart
2. Resize browser window
3. View on mobile viewport
4. Return to desktop size

**Expected Result**:
- ✅ Chart resizes smoothly
- ✅ ResponsiveContainer maintains aspect ratio
- ✅ Legend readable at all sizes
- ✅ Tooltip functional on mobile
- ✅ Chart height fixed at 300px

### Test Case 15.17: Database Integration

**Steps**:
1. Add progress for client
2. Refresh page
3. Navigate back to Progress Tracking tab
4. Select same client

**Expected Result**:
- ✅ Progress data persists in localStorage
- ✅ Data reloads after page refresh
- ✅ All fields preserved (metrics, measurements, exercises, goals, notes)
- ✅ Timestamps accurate

### Test Case 15.18: getTrainerClients Method

**Steps**:
1. Login as trainer
2. Check client dropdown
3. Verify only assigned clients appear

**Expected Result**:
- ✅ getTrainerClients() returns clients from trainer's programs
- ✅ Unique client list (no duplicates)
- ✅ Only clients with programs by this trainer
- ✅ Client objects include id, name, email

### Test Case 15.19: Progress Record Sorting

**Steps**:
1. Add 3 progress records on different dates
2. View progress history

**Expected Result**:
- ✅ Records sorted newest first
- ✅ Dates displayed in localized format
- ✅ Chart shows chronological progression (oldest to newest)
- ✅ Latest metric used in summary cards

### Test Case 15.20: Exercise Badge Display

**Steps**:
1. Add progress without exercises
2. Add progress with 1 exercise
3. Add progress with 3 exercises
4. View history

**Expected Result**:
- ✅ No badge if no exercises
- ✅ "1 exercises logged" badge if 1 exercise (grammar correct)
- ✅ "3 exercises logged" badge if 3 exercises
- ✅ Badge has outline variant styling

### Checklist - Client Progress Tracking (Trainer)
- [x] Client selection dropdown works
- [x] Progress summary cards display correctly
- [x] Trend indicators show accurate direction and value
- [x] LineChart visualization renders
- [x] Chart data sorted chronologically
- [x] "Add Progress Record" button opens modal
- [x] Body metrics inputs functional
- [x] Body measurements inputs functional
- [x] Add exercise button works
- [x] Remove exercise button works
- [x] Exercise form inputs functional
- [x] Difficulty dropdown works
- [x] Goals textarea functional
- [x] Trainer notes textarea functional
- [x] Save button creates record
- [x] Cancel button closes without saving
- [x] Modal form resets after save
- [x] Email notification sent to client
- [x] Progress history displays records
- [x] Records sorted newest first
- [x] Click record opens detail modal
- [x] Detail modal shows all data
- [x] Exercise badges display correctly
- [x] Empty state shown for no records
- [x] Chart hidden when no data
- [x] Data persists in localStorage
- [x] Client switch updates data correctly
- [x] getTrainerClients returns correct clients
- [x] Responsive design works
- [x] All optional fields work
- [x] Demo progress records initialized (3 records)

---

## Step 16: Gym Review and Rating System (UC-9)

### Test Case 16.1: View Available Items to Review

**Steps**:
1. Login as member (john@example.com / password123)
2. Navigate to "Submit Reviews" tab
3. Click on "Select Class or Training Program" dropdown

**Expected Result**:
- ✅ Dropdown shows classes the member has booked (Confirmed bookings only)
- ✅ Dropdown shows training programs assigned to the member
- ✅ Each item shows type badge (Class or Training Program)
- ✅ Each item shows instructor name
- ✅ Empty message if no items available

### Test Case 16.2: Submit Review - Star Ratings

**Steps**:
1. Login as member
2. Select a class from dropdown
3. Click "Start Review"
4. Rate instructor: 5 stars
5. Rate facility: 4 stars
6. Rate overall experience: 5 stars
7. Click "Submit Review"

**Expected Result**:
- ✅ Modal opens with selected item details
- ✅ Star rating interactive (hover and click)
- ✅ Selected stars highlighted in yellow
- ✅ Unselected stars in gray
- ✅ Rating count displayed next to stars (e.g., "5/5")
- ✅ All three ratings required before submission
- ✅ Success modal appears after submission
- ✅ Review created with status "Pending"

### Test Case 16.3: Submit Review - Complete with Comments

**Steps**:
1. Login as member
2. Select training program
3. Open review modal
4. Provide all ratings (5, 4, 5)
5. Add comment: "Great program! Very effective."
6. Add suggestion: "More variety in exercises would be nice."
7. Submit review

**Expected Result**:
- ✅ Comments textarea functional
- ✅ Suggestions textarea functional
- ✅ Both fields optional
- ✅ Review saved with all data
- ✅ Email sent to instructor
- ✅ Email sent to manager
- ✅ Success modal confirms submission
- ✅ "Pending moderation" message shown

### Test Case 16.4: Submit Review - Validation

**Steps**:
1. Login as member
2. Select a class
3. Open review modal
4. Leave all ratings at 0
5. Try to submit

**Expected Result**:
- ✅ Alert message: "Please provide all ratings before submitting."
- ✅ Review not submitted
- ✅ Modal remains open
- ✅ Form data preserved

### Test Case 16.5: Review Guidelines Display

**Steps**:
1. Navigate to "Submit Reviews" tab
2. View the guidelines section

**Expected Result**:
- ✅ Blue info box displays guidelines
- ✅ Guidelines include:
  - Be honest and constructive
  - Focus on experience
  - Avoid inappropriate language
  - Reviews are moderated
- ✅ Guidelines visible before submission

### Test Case 16.6: Manager Review Dashboard - Statistics

**Steps**:
1. Login as manager (manager@fithub.gr / Manager123!)
2. Navigate to "Review Management" tab
3. View statistics cards

**Expected Result**:
- ✅ Total Reviews card shows count
- ✅ Pending Reviews card shows count with yellow icon
- ✅ Approved Reviews card shows count with green icon
- ✅ Rejected Reviews card shows count with red icon
- ✅ Statistics accurate and real-time

### Test Case 16.7: Manager View Review Details

**Steps**:
1. Login as manager
2. Navigate to "Review Management"
3. Click "View Details" on any review

**Expected Result**:
- ✅ Modal opens with complete review information
- ✅ Status badge displayed
- ✅ Target info (class/program name, type)
- ✅ Reviewer info (name, email, date)
- ✅ All three ratings with stars
- ✅ Comments displayed if present
- ✅ Suggestions displayed if present
- ✅ Moderation info shown for approved/rejected reviews

### Test Case 16.8: Approve Review

**Steps**:
1. Login as manager
2. Navigate to "Review Management"
3. Filter by "Pending"
4. Click "Approve" on a pending review

**Expected Result**:
- ✅ Review status changes to "Approved"
- ✅ moderatedBy set to manager name
- ✅ moderatedAt timestamp recorded
- ✅ Email sent to member confirming approval
- ✅ Review moves to "Approved" filter
- ✅ Pending count decreases
- ✅ Approved count increases

### Test Case 16.9: Reject Review with Reason

**Steps**:
1. Login as manager
2. Find pending review
3. Click "Reject"
4. Modal opens for rejection reason
5. Enter reason: "Contains inappropriate language"
6. Click "Confirm Rejection"

**Expected Result**:
- ✅ Rejection modal opens
- ✅ Reason textarea functional
- ✅ Submit button disabled until reason entered
- ✅ Review status changes to "Rejected"
- ✅ Rejection reason saved
- ✅ Email sent to member with reason
- ✅ Review moves to "Rejected" filter
- ✅ Moderator name and timestamp recorded

### Test Case 16.10: Filter Reviews by Status

**Steps**:
1. Login as manager
2. Navigate to Review Management
3. Test each filter: All, Pending, Approved, Rejected

**Expected Result**:
- ✅ "All Reviews" shows all reviews
- ✅ "Pending" shows only pending reviews
- ✅ "Approved" shows only approved reviews
- ✅ "Rejected" shows only rejected reviews
- ✅ Filter dropdown responsive
- ✅ Statistics update based on filter
- ✅ Empty state if no reviews match filter

### Test Case 16.11: Review List Display

**Steps**:
1. Login as manager
2. View review list

**Expected Result**:
- ✅ Each review card shows:
  - Target name and type badge
  - Status badge (color-coded)
  - Reviewer name
  - Date created
  - Instructor name
  - All three ratings with stars
  - Comments preview (truncated)
- ✅ Hover effect on cards
- ✅ Action buttons visible based on status
- ✅ Pending reviews show Approve and Reject buttons
- ✅ Approved/Rejected reviews show only View Details

### Test Case 16.12: Email Notifications - New Review

**Steps**:
1. Member submits a review
2. Check browser console for email logs

**Expected Result**:
- ✅ Email to instructor with:
  - Subject: "New Review Received"
  - Target name
  - Overall and instructor ratings
  - Comments if present
  - "Pending moderation" note
- ✅ Email to manager with:
  - Subject: "New Review Pending Moderation"
  - Reviewer name
  - Target name and type
  - Instructor name
  - Overall rating
  - Request to moderate

### Test Case 16.13: Email Notifications - Approval

**Steps**:
1. Manager approves a review
2. Check console for email

**Expected Result**:
- ✅ Email sent to member
- ✅ Subject: "Your Review Has Been Approved"
- ✅ Body confirms approval
- ✅ Thanks member for feedback
- ✅ Email address matches reviewer

### Test Case 16.14: Email Notifications - Rejection

**Steps**:
1. Manager rejects review with reason
2. Check console for email

**Expected Result**:
- ✅ Email sent to member
- ✅ Subject: "Your Review Was Not Approved"
- ✅ Body includes rejection reason
- ✅ Polite tone with support contact option

### Test Case 16.15: Average Rating Calculation

**Steps**:
1. Create 3 reviews for same class:
   - Review 1: Overall 5, Instructor 5, Facility 4
   - Review 2: Overall 4, Instructor 4, Facility 5
   - Review 3: Overall 5, Instructor 5, Facility 5
2. Call getAverageRating(targetType, targetId)

**Expected Result**:
- ✅ Overall average: 4.7 (rounded to 1 decimal)
- ✅ Instructor average: 4.7
- ✅ Facility average: 4.7
- ✅ Count: 3
- ✅ Only approved reviews counted

### Test Case 16.16: Demo Reviews Initialized

**Steps**:
1. Clear localStorage
2. Refresh page to trigger initializeDemoData
3. Login as manager
4. Navigate to Review Management

**Expected Result**:
- ✅ 5 demo reviews created
- ✅ 3 approved reviews
- ✅ 1 pending review
- ✅ 1 rejected review
- ✅ Reviews for different classes and programs
- ✅ Realistic content and ratings
- ✅ Moderation history on approved/rejected reviews

### Test Case 16.17: Review Sorting

**Steps**:
1. View review list as manager
2. Check review order

**Expected Result**:
- ✅ Reviews sorted by creation date
- ✅ Newest reviews appear first
- ✅ Consistent sorting across filters

### Test Case 16.18: Star Rating Interaction

**Steps**:
1. Open review submission modal
2. Hover over stars
3. Click different star values
4. Re-click to change rating

**Expected Result**:
- ✅ Hover effect scales star (scale-110)
- ✅ Stars light up on hover
- ✅ Click sets rating
- ✅ Can change rating after selection
- ✅ Visual feedback immediate
- ✅ All three rating sections independent

### Test Case 16.19: Multiple Reviews from Same User

**Steps**:
1. Login as member
2. Submit review for Class A
3. Submit review for Class B
4. Submit review for Training Program C

**Expected Result**:
- ✅ All reviews created successfully
- ✅ Each linked to correct target
- ✅ All have same userId
- ✅ getReviewsByUser returns all 3
- ✅ No limit on reviews per user

### Test Case 16.20: Data Persistence

**Steps**:
1. Submit 2 reviews as member
2. Approve 1 review as manager
3. Refresh page
4. Check reviews still exist

**Expected Result**:
- ✅ All reviews persist in localStorage
- ✅ Review statuses preserved
- ✅ Moderation data preserved
- ✅ Data reloads after refresh

### Checklist - Submit Review (Member)
- [x] Dropdown loads user's classes and programs
- [x] Dropdown shows type badge and instructor
- [x] Selected item details displayed
- [x] Review modal opens on button click
- [x] Star rating interactive (all 3 sections)
- [x] Star rating visual feedback works
- [x] Rating count displays next to stars
- [x] Comments textarea functional
- [x] Suggestions textarea functional
- [x] Validation enforces all ratings
- [x] Validation error message shown
- [x] Success modal appears on submit
- [x] Review created with Pending status
- [x] Email sent to instructor
- [x] Email sent to manager
- [x] Form resets after submission
- [x] Guidelines displayed
- [x] Empty state for no items
- [x] Responsive design works

### Checklist - Review Management (Manager)
- [x] Statistics cards display correctly
- [x] Total reviews count accurate
- [x] Pending reviews count accurate
- [x] Approved reviews count accurate
- [x] Rejected reviews count accurate
- [x] Filter dropdown functional
- [x] Filter by All works
- [x] Filter by Pending works
- [x] Filter by Approved works
- [x] Filter by Rejected works
- [x] Review cards display all info
- [x] Status badges color-coded
- [x] Star ratings displayed correctly
- [x] View Details modal opens
- [x] Modal shows complete review info
- [x] Approve button functional
- [x] Reject modal opens
- [x] Rejection reason required
- [x] Confirm rejection works
- [x] Email sent on approval
- [x] Email sent on rejection
- [x] Moderation info recorded
- [x] Review sorting works (newest first)
- [x] Empty state shown when no reviews
- [x] Responsive design works
- [x] Demo reviews initialized (5 reviews)

---

## 🎫 STEP 17: Customer Support and Ticketing System (UC-10)

### Test Case 17.1: Create Support Ticket - Basic Flow

**Steps**:
1. Login as member
2. Navigate to Customer Support section
3. Click "Create New Ticket"
4. Fill in:
   - Category: "Technical Problem"
   - Subject: "Cannot reset password"
   - Description: "Password reset link not working"
5. Click "Submit Ticket"

**Expected Result**:
- ✅ Ticket created successfully
- ✅ Unique ticket number generated (TKT-XXXXXX format)
- ✅ Status: "AI Responding"
- ✅ Priority auto-assigned
- ✅ AI sends first response immediately
- ✅ Email sent to member confirming ticket creation
- ✅ Email sent to secretary notifying of new ticket

### Test Case 17.2: AI Response - Category-Specific

**Steps**:
1. Create tickets with different categories:
   - Technical Problem
   - Subscription Info
   - System Errors
   - Billing
   - Classes & Programs
   - General Inquiry
2. Check AI responses for each

**Expected Result**:
- ✅ AI responds with category-relevant message
- ✅ Different response for each category
- ✅ Response appears immediately after member message
- ✅ AI sender type: "ai"
- ✅ Message appears in purple chat bubble

### Test Case 17.3: Chat Interface - Member Messages

**Steps**:
1. Open existing ticket
2. Type message in textarea
3. Click send button
4. Send multiple messages

**Expected Result**:
- ✅ Message appears in blue chat bubble (right-aligned)
- ✅ Sender name shown as member name
- ✅ Timestamp displayed
- ✅ Member icon shown
- ✅ AI responds to each message
- ✅ Chat scrollable if many messages
- ✅ Message input clears after sending

### Test Case 17.4: Escalation - After 5 Messages

**Steps**:
1. Create new support ticket
2. Send 5 member messages (AI responds to each)
3. Check for escalation option
4. Send 6th message

**Expected Result**:
- ✅ "Escalate to Support" button appears after 5 member messages
- ✅ AI continues responding
- ✅ Counter shows member message count
- ✅ Only member messages counted (not AI/secretary)

### Test Case 17.5: Manual Escalation

**Steps**:
1. Open ticket with 5+ member messages
2. Click "Escalate to Support Staff"
3. Confirm escalation

**Expected Result**:
- ✅ Status changes to "Escalated"
- ✅ Ticket assigned to secretary (assignedTo, assignedToName set)
- ✅ Email sent to secretary with ticket details
- ✅ Email sent to member confirming escalation
- ✅ AI stops responding
- ✅ Chat still accessible

### Test Case 17.6: AI Error Simulation

**Steps**:
1. Create ticket and send messages until AI error occurs (5% chance per message)
2. Check error handling

**Expected Result**:
- ✅ AI error message shown to member
- ✅ Red error notice displayed: "AI System Error Occurred"
- ✅ Error notice explains manual intervention needed
- ✅ Email sent to member apologizing for error
- ✅ Email sent to secretary for manual resolution
- ✅ Ticket flagged with aiErrorOccurred: true
- ✅ Red "AI Error" badge shown on ticket card
- ✅ Status remains "AI Responding" or changes to "Escalated"

### Test Case 17.7: Secretary Ticket Management - Statistics

**Steps**:
1. Login as secretary
2. Navigate to "Support Tickets" tab
3. View statistics cards

**Expected Result**:
- ✅ 5 statistic cards displayed:
  - Total Tickets
  - Open
  - AI Responding
  - Escalated
  - With Errors
- ✅ Counts accurate and update in real-time
- ✅ Icons match categories
- ✅ Color-coded appropriately

### Test Case 17.8: Secretary View Ticket Details

**Steps**:
1. Login as secretary
2. Click "View & Respond" on a ticket
3. Check modal content

**Expected Result**:
- ✅ Ticket number displayed
- ✅ Subject shown
- ✅ Status badge visible
- ✅ Ticket info section shows:
  - Member name
  - Member email
  - Category
  - Priority
  - Description
- ✅ Full chat history displayed
- ✅ Messages color-coded by sender type
- ✅ AI error notice shown if applicable

### Test Case 17.9: Secretary Respond to Ticket

**Steps**:
1. Login as secretary
2. Open escalated ticket
3. Type response in textarea
4. Click send
5. Send multiple messages

**Expected Result**:
- ✅ Secretary message appears in green chat bubble
- ✅ Message right-aligned (secretary side)
- ✅ Secretary icon shown
- ✅ Sender name shows secretary name
- ✅ Timestamp displayed
- ✅ Message persists after modal close
- ✅ Member can see secretary response

### Test Case 17.10: Secretary Close Ticket

**Steps**:
1. Login as secretary
2. Open ticket
3. Click "Close Ticket"
4. Confirm

**Expected Result**:
- ✅ Status changes to "Closed"
- ✅ closedBy set to "secretary"
- ✅ closedAt timestamp recorded
- ✅ Modal closes
- ✅ Ticket list updates
- ✅ Message input disabled for closed tickets
- ✅ Cannot reopen from UI

### Test Case 17.11: Member Close Ticket

**Steps**:
1. Login as member
2. Open own support ticket
3. Click "Close Ticket" or "Mark as Resolved"
4. Confirm

**Expected Result**:
- ✅ Status changes to "Closed"
- ✅ closedBy set to "member"
- ✅ closedAt timestamp recorded
- ✅ Cannot send more messages
- ✅ Ticket shown in "My Tickets" with Closed status

### Test Case 17.12: Filter Tickets by Status

**Steps**:
1. Login as secretary
2. Use filter dropdown
3. Select each status:
   - All Tickets
   - Open
   - AI Responding
   - Escalated
   - Closed

**Expected Result**:
- ✅ Filter dropdown functional
- ✅ "All Tickets" shows all
- ✅ Each filter shows only matching tickets
- ✅ Statistics update based on filter
- ✅ Empty state shown if no tickets match
- ✅ Filter persists during session

### Test Case 17.13: Ticket Number Generation

**Steps**:
1. Create 5 support tickets
2. Check ticket numbers

**Expected Result**:
- ✅ Format: TKT-XXXXXX (6 digits, zero-padded)
- ✅ Sequential numbering (TKT-000001, TKT-000002, etc.)
- ✅ Unique for each ticket
- ✅ Numbers persist after refresh
- ✅ Counter increments correctly

### Test Case 17.14: Priority Assignment

**Steps**:
1. Create tickets with different categories
2. Check auto-assigned priority

**Expected Result**:
- ✅ Priority badge displayed
- ✅ High priority: red badge
- ✅ Medium priority: yellow badge
- ✅ Low priority: outline badge
- ✅ Priority logic based on category/keywords
- ✅ Can be manually updated by secretary

### Test Case 17.15: Email Notifications - Ticket Creation

**Steps**:
1. Member creates ticket
2. Check console for emails

**Expected Result**:
- ✅ Email to member confirming creation
- ✅ Subject: mentions ticket number
- ✅ Body includes ticket details
- ✅ Email to secretary notifying new ticket
- ✅ Secretary email includes category and priority

### Test Case 17.16: Email Notifications - Escalation

**Steps**:
1. Escalate a ticket
2. Check console for emails

**Expected Result**:
- ✅ Email to member confirming escalation
- ✅ Email to secretary with assignment
- ✅ Secretary email includes ticket details
- ✅ Member email explains next steps

### Test Case 17.17: Email Notifications - AI Error

**Steps**:
1. Trigger AI error (keep sending until error occurs)
2. Check console for emails

**Expected Result**:
- ✅ Email to member apologizing for error
- ✅ Email to secretary requesting manual intervention
- ✅ Secretary email flagged as urgent
- ✅ Member email reassuring and professional

### Test Case 17.18: Demo Tickets Initialization

**Steps**:
1. Clear localStorage
2. Refresh page
3. Login as secretary
4. View support tickets

**Expected Result**:
- ✅ 3 demo tickets created
- ✅ Ticket 1: AI Responding status
- ✅ Ticket 2: Closed status
- ✅ Ticket 3: Escalated status
- ✅ Demo tickets have realistic content
- ✅ Each has multiple messages
- ✅ Different categories represented

### Test Case 17.19: Chat Message Persistence

**Steps**:
1. Member sends message
2. AI responds
3. Close modal
4. Reopen ticket
5. Refresh page
6. Check messages

**Expected Result**:
- ✅ All messages persist
- ✅ Message order preserved
- ✅ Timestamps accurate
- ✅ Sender info preserved
- ✅ Data survives page refresh

### Test Case 17.20: Ticket Sorting

**Steps**:
1. Create tickets at different times
2. View ticket list

**Expected Result**:
- ✅ Tickets sorted by creation date
- ✅ Newest tickets appear first
- ✅ Sorting consistent across filters
- ✅ Recently updated tickets don't resort (based on createdAt only)

### Checklist - Customer Support (Member)

- [x] Create ticket button visible
- [x] Category dropdown functional (6 options)
- [x] Subject field required
- [x] Description textarea functional
- [x] Form validation enforces required fields
- [x] Ticket created with unique number
- [x] AI responds immediately
- [x] Chat interface displays messages
- [x] Member messages appear right-aligned (blue)
- [x] AI messages appear left-aligned (purple)
- [x] Send message button functional
- [x] Message input clears after send
- [x] Timestamp shown on messages
- [x] Escalation option appears after 5 messages
- [x] Manual escalation button works
- [x] Close ticket option available
- [x] Ticket list shows own tickets
- [x] Status badges color-coded
- [x] Priority badges displayed
- [x] AI error notice shown when error occurs
- [x] Email notifications sent
- [x] Responsive design works

### Checklist - Support Ticket Management (Secretary)

- [x] Statistics dashboard displays (5 cards)
- [x] Total tickets count accurate
- [x] Open tickets count accurate
- [x] AI Responding count accurate
- [x] Escalated count accurate
- [x] With Errors count accurate
- [x] Filter dropdown functional
- [x] Filter by All works
- [x] Filter by Open works
- [x] Filter by AI Responding works
- [x] Filter by Escalated works
- [x] Filter by Closed works
- [x] Ticket cards display all info
- [x] Status badges color-coded
- [x] Priority badges shown
- [x] AI Error badge shown when applicable
- [x] Ticket number displayed
- [x] Category and user info shown
- [x] Message count displayed
- [x] Creation date shown
- [x] View & Respond button opens modal
- [x] Modal shows complete ticket details
- [x] Chat history displayed
- [x] Messages color-coded (member blue, AI purple, secretary green)
- [x] Message textarea functional
- [x] Send button works
- [x] Secretary messages appear in green
- [x] Close ticket button functional
- [x] Closed tickets have disabled input
- [x] AI error notice displayed in modal
- [x] Ticket sorting works (newest first)
- [x] Empty state shown when no tickets
- [x] Responsive design works
- [x] Demo tickets initialized (3 tickets)

---

## 👤 STEP 18: Member Profile Management

### Test Case 18.1: View Profile Overview

**Steps**:
1. Login as member
2. Navigate to "My Profile" tab
3. View profile overview section

**Expected Result**:
- ✅ Profile completion percentage displayed
- ✅ Personal information shown:
  - Full name
  - Email address
  - Phone number
  - Date of birth
  - Member since date
- ✅ Quick stats cards displayed:
  - Classes booked
  - Training programs enrolled
  - Progress records
  - Reviews submitted
- ✅ Avatar/profile picture shown
- ✅ Membership type badge visible

### Test Case 18.2: Edit Profile - Basic Information

**Steps**:
1. Click "Edit Profile" button
2. Edit modal opens
3. Change name
4. Change phone number
5. Change date of birth
6. Click "Save Changes"

**Expected Result**:
- ✅ Modal opens with pre-filled data
- ✅ Name field editable
- ✅ Phone field editable with validation
- ✅ Date of birth editable
- ✅ Email field disabled (cannot change)
- ✅ Changes saved to database
- ✅ Profile updates immediately
- ✅ Success notification shown
- ✅ Modal closes

### Test Case 18.3: Edit Profile - Validation

**Steps**:
1. Open edit profile modal
2. Try to save with:
   - Empty name
   - Invalid phone format
   - Invalid date of birth (too young)

**Expected Result**:
- ✅ Validation prevents saving
- ✅ Error messages displayed
- ✅ Name must be at least 2 characters
- ✅ Phone must be valid Greek format
- ✅ Age must be 16+ years
- ✅ Form highlights errors in red

### Test Case 18.4: Change Password

**Steps**:
1. Click "Change Password" button
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Change Password"

**Expected Result**:
- ✅ Password modal opens
- ✅ Current password field shown
- ✅ New password field with strength meter
- ✅ Confirm password field shown
- ✅ Validation enforces password requirements
- ✅ Passwords must match
- ✅ Password updated in database
- ✅ Success message shown
- ✅ Modal closes
- ✅ Can login with new password

### Test Case 18.5: Change Password - Validation

**Steps**:
1. Open change password modal
2. Try various scenarios:
   - Wrong current password
   - Weak new password
   - Passwords don't match
   - Empty fields

**Expected Result**:
- ✅ Error: "Current password is incorrect"
- ✅ Error: "Password too weak"
- ✅ Error: "Passwords do not match"
- ✅ Required field validation
- ✅ Password strength indicator works
- ✅ Visual feedback (red borders)

### Test Case 18.6: Membership Tab

**Steps**:
1. Click on "Membership" tab
2. View membership details

**Expected Result**:
- ✅ Membership type displayed
- ✅ Start date shown
- ✅ Expiry date shown
- ✅ Status badge (Active/Expired)
- ✅ Monthly fee displayed
- ✅ Benefits list shown
- ✅ Auto-renewal status shown
- ✅ Upgrade/downgrade options available

### Test Case 18.7: Activity Tab

**Steps**:
1. Click on "Activity" tab
2. View recent activity

**Expected Result**:
- ✅ Recent bookings displayed
- ✅ Training program enrollments shown
- ✅ Class attendance history
- ✅ Reviews submitted listed
- ✅ Progress records shown
- ✅ Activity sorted by date (newest first)
- ✅ Empty state if no activity

### Test Case 18.8: Transactions Tab

**Steps**:
1. Click on "Transactions" tab
2. View transaction history

**Expected Result**:
- ✅ All transactions listed
- ✅ Transaction date shown
- ✅ Description displayed
- ✅ Amount shown
- ✅ Payment method indicated
- ✅ Status badge (Paid/Pending/Failed)
- ✅ Receipt download option
- ✅ Sorted by date (newest first)

### Test Case 18.9: Security Tab

**Steps**:
1. Click on "Security" tab
2. View security settings

**Expected Result**:
- ✅ Email verification status shown
- ✅ Password last changed date
- ✅ "Change Password" button available
- ✅ Two-factor authentication option (if implemented)
- ✅ Active sessions list (if implemented)
- ✅ Security recommendations shown

### Test Case 18.10: Profile Completion Percentage

**Steps**:
1. View profile with missing information
2. Add phone number
3. Add date of birth
4. Check completion percentage

**Expected Result**:
- ✅ Percentage starts low with minimal info
- ✅ Percentage increases as fields filled
- ✅ 100% when all fields complete
- ✅ Progress bar visual indicator
- ✅ List of missing fields shown
- ✅ Click suggestion navigates to edit

### Test Case 18.11: Quick Stats Accuracy

**Steps**:
1. Book a class
2. Enroll in training program
3. Submit a review
4. Add progress record
5. Check profile quick stats

**Expected Result**:
- ✅ Classes booked count increments
- ✅ Training programs count increments
- ✅ Reviews count increments
- ✅ Progress records count increments
- ✅ Stats update in real-time
- ✅ Counts accurate

### Test Case 18.12: Avatar/Profile Picture

**Steps**:
1. View profile
2. Click on avatar/profile picture
3. Upload new image (if implemented)

**Expected Result**:
- ✅ Current avatar displayed
- ✅ Click opens upload modal (if implemented)
- ✅ Image upload functional
- ✅ Preview before saving
- ✅ Image size validation
- ✅ Supported formats: JPG, PNG
- ✅ Avatar updates across app

### Test Case 18.13: Email Verification Status

**Steps**:
1. Check email verification badge
2. If unverified, click "Resend Verification"

**Expected Result**:
- ✅ Verification status shown clearly
- ✅ Green checkmark if verified
- ✅ Yellow warning if unverified
- ✅ "Resend Verification" button available if unverified
- ✅ Email resent successfully
- ✅ Confirmation message shown

### Test Case 18.14: Data Persistence

**Steps**:
1. Update profile information
2. Change password
3. Refresh page
4. Check data still saved

**Expected Result**:
- ✅ All changes persist
- ✅ Profile data saved to database
- ✅ Password change saved
- ✅ Stats remain accurate
- ✅ Data survives page refresh

### Test Case 18.15: Responsive Design

**Steps**:
1. View profile on desktop
2. Resize to tablet view
3. Resize to mobile view

**Expected Result**:
- ✅ Layout adapts to screen size
- ✅ Tabs stack on mobile
- ✅ Cards resize appropriately
- ✅ Modals responsive
- ✅ Touch-friendly buttons
- ✅ No horizontal scroll
- ✅ Readable text on all sizes

### Checklist - Member Profile

- [x] Profile tab accessible from member dashboard
- [x] Profile overview displays all personal info
- [x] Profile completion percentage shown
- [x] Quick stats cards displayed (4 cards)
- [x] Edit profile button functional
- [x] Edit modal opens with pre-filled data
- [x] Name field editable
- [x] Phone field editable
- [x] Date of birth editable
- [x] Email field disabled (cannot edit)
- [x] Form validation works
- [x] Changes save successfully
- [x] Profile updates in real-time
- [x] Change password button functional
- [x] Password modal opens
- [x] Current password verification
- [x] New password strength meter
- [x] Password confirmation required
- [x] Password requirements enforced
- [x] Password change successful
- [x] Membership tab functional
- [x] Activity tab displays history
- [x] Transactions tab shows payments
- [x] Security tab displays settings
- [x] All tabs navigate correctly
- [x] Email verification status shown
- [x] Avatar/profile picture displayed
- [x] Quick stats accurate and real-time
- [x] Data persistence across refreshes
- [x] Responsive design works
- [x] Success/error notifications shown
- [x] Empty states for no data
- [x] Loading states during operations

---

## 🔐 STEP 19: Member Check-In System

### Test Case 19.1: Check-In Member - Basic Flow

**Steps**:
1. Login as receptionist
2. Navigate to "Check-Ins" tab
3. Click "Check In Member" button
4. Select member from dropdown
5. Choose check-in method: "Manual"
6. Click "Check In"

**Expected Result**:
- ✅ Modal opens with form
- ✅ Member dropdown populated with active members
- ✅ Check-in method dropdown shows 3 options
- ✅ Check-in created successfully
- ✅ Member appears in "Currently in Gym" list
- ✅ Modal closes
- ✅ Statistics update (Currently in Gym +1)
- ✅ Today's check-ins count increases

### Test Case 19.2: Check-In Methods - All Types

**Steps**:
1. Login as receptionist
2. Check in member with method "QR Code"
3. Check out member
4. Check in same member with method "Card Scan"
5. Check out member
6. Check in same member with method "Manual"

**Expected Result**:
- ✅ All three methods work
- ✅ QR Code: Blue badge displayed
- ✅ Card Scan: Green badge displayed
- ✅ Manual: Purple badge displayed
- ✅ Each check-in recorded with correct method
- ✅ History shows all three check-ins

### Test Case 19.3: Check-In with Notes

**Steps**:
1. Login as receptionist
2. Click "Check In Member"
3. Select member
4. Choose "Manual" method
5. Add note: "Forgot membership card"
6. Click "Check In"

**Expected Result**:
- ✅ Check-in created with notes
- ✅ Notes displayed in "Currently in Gym" card
- ✅ Notes appear in check-in history
- ✅ Notes italic formatted
- ✅ Receptionist name recorded

### Test Case 19.4: Validation - Duplicate Check-In Prevention

**Steps**:
1. Login as receptionist
2. Check in a member
3. Try to check in the same member again while still active

**Expected Result**:
- ❌ Error message: "User already checked in. Please check out first."
- ❌ Second check-in not created
- ✅ First check-in remains active
- ✅ Modal stays open

### Test Case 19.5: Validation - No Active Membership

**Steps**:
1. Login as receptionist
2. Try to check in a member with expired/no membership

**Expected Result**:
- ❌ Error message: "No active membership found"
- ❌ Check-in not created
- ✅ Member cannot access gym

### Test Case 19.6: Check-Out Member - Basic Flow

**Steps**:
1. Member is checked in (active status)
2. Receptionist clicks "Check Out" button
3. Confirmation modal appears
4. Click "Confirm Check Out"

**Expected Result**:
- ✅ Check-out confirmation modal opens
- ✅ Shows member name
- ✅ Shows check-in time
- ✅ Shows current duration
- ✅ Shows method and notes
- ✅ On confirm: status changes to "Completed"
- ✅ Check-out time recorded
- ✅ Duration calculated automatically
- ✅ Member removed from "Currently in Gym"
- ✅ Appears in "Today's Check-Ins" as completed

### Test Case 19.7: Duration Calculation

**Steps**:
1. Check in member at 09:00 AM
2. Check out member at 10:30 AM
3. View check-in record

**Expected Result**:
- ✅ Duration calculated as 90 minutes
- ✅ Duration displayed as "1h 30m"
- ✅ Duration only shown after check-out
- ✅ Active check-ins show live duration counter

### Test Case 19.8: Member Search Functionality

**Steps**:
1. Open check-in modal
2. Type member name in search box
3. Observe dropdown filtering

**Expected Result**:
- ✅ Dropdown filters by name
- ✅ Dropdown filters by email
- ✅ Case-insensitive search
- ✅ Real-time filtering
- ✅ Shows "No members found" if no match

### Test Case 19.9: Currently in Gym Display

**Steps**:
1. Check in 3 members
2. View "Currently in Gym" section

**Expected Result**:
- ✅ Shows all 3 active check-ins
- ✅ Green highlighted cards
- ✅ "Active" badge displayed
- ✅ Real-time duration counter updating
- ✅ Member details visible (name, email)
- ✅ Membership type badge shown
- ✅ Check-in method badge shown
- ✅ Check-in time displayed
- ✅ Notes visible if present
- ✅ Receptionist name shown if manual
- ✅ "Check Out" button available

### Test Case 19.10: Today's Check-Ins List

**Steps**:
1. Check in and check out 5 members
2. View "Today's Check-Ins" section

**Expected Result**:
- ✅ Shows all 5 check-ins
- ✅ Both active and completed visible
- ✅ Sorted by time (newest first)
- ✅ Completed: shows duration
- ✅ Active: shows "Check Out" button
- ✅ Check-in time displayed
- ✅ Check-out time shown for completed
- ✅ Notes visible if present

### Test Case 19.11: Statistics Dashboard - Receptionist

**Steps**:
1. Login as receptionist
2. Navigate to Check-Ins tab
3. View statistics cards

**Expected Result**:
- ✅ 4 statistics cards displayed
- ✅ "Currently in Gym" shows active count
- ✅ "Today's Check-Ins" shows total today
- ✅ "Completed Today" shows finished sessions
- ✅ "Avg. Duration" shows mean time
- ✅ Icons match categories
- ✅ Real-time updates when check-in/out

### Test Case 19.12: Member View - Check-In History

**Steps**:
1. Login as member
2. Navigate to "My Check-Ins" tab
3. View check-in history

**Expected Result**:
- ✅ Last 10 check-ins displayed
- ✅ Sorted newest first
- ✅ Each shows date and time
- ✅ Duration shown for completed
- ✅ Check-in and check-out times visible
- ✅ Method badge displayed
- ✅ Notes shown if present
- ✅ Receptionist name if manual check-in

### Test Case 19.13: Member View - Active Check-In Banner

**Steps**:
1. Receptionist checks in a member
2. Member logs in
3. Navigates to "My Check-Ins" tab

**Expected Result**:
- ✅ Green highlighted alert banner shown
- ✅ Text: "You're Currently Checked In!"
- ✅ Shows check-in time
- ✅ Shows check-in method
- ✅ Shows live duration counter
- ✅ Shows notes if present
- ✅ Banner not shown when checked out

### Test Case 19.14: Member Statistics - Personal Stats

**Steps**:
1. Member has 10 check-ins in history
2. Member views "My Check-Ins" tab
3. Check statistics cards

**Expected Result**:
- ✅ Total Visits: 10
- ✅ Total Time: Sum of all durations
- ✅ Avg. Session: Mean duration
- ✅ This Week: Count of last 7 days
- ✅ Icons displayed
- ✅ Formatted correctly (e.g., "1h 30m")

### Test Case 19.15: Monthly Summary

**Steps**:
1. Member has check-ins this month
2. View monthly summary section

**Expected Result**:
- ✅ Shows visits this month
- ✅ Calculates daily average percentage
- ✅ Shows average session length
- ✅ 3 summary cards displayed
- ✅ Proper formatting

### Test Case 19.16: Empty State - No Check-Ins

**Steps**:
1. New member with no check-in history
2. Navigate to "My Check-Ins" tab

**Expected Result**:
- ✅ Empty state message shown
- ✅ Icon displayed (calendar)
- ✅ Helpful text: "No check-in history yet"
- ✅ Instructions: "Check in at reception..."
- ✅ No error messages

### Test Case 19.17: Empty State - No Active Check-Ins

**Steps**:
1. Receptionist view with no one in gym
2. View "Currently in Gym" section

**Expected Result**:
- ✅ Empty state shown
- ✅ Icon displayed (users)
- ✅ Message: "No members currently checked in"
- ✅ No error messages

### Test Case 19.18: Analytics - Date Range

**Steps**:
1. Create check-ins across multiple days
2. Call getCheckInsByDateRange() with specific range
3. View analytics

**Expected Result**:
- ✅ Only check-ins in range returned
- ✅ Start date inclusive
- ✅ End date inclusive
- ✅ Correct count
- ✅ Sorted properly

### Test Case 19.19: Analytics - Peak Hours

**Steps**:
1. Create check-ins at various hours
2. 10 check-ins at 18:00 (most)
3. 5 check-ins at 09:00
4. Call getCheckInStats()

**Expected Result**:
- ✅ Peak hour identified: "18:00"
- ✅ byHour object shows all hours
- ✅ Correct counts per hour
- ✅ Peak hour has highest count

### Test Case 19.20: Analytics - By Membership Type

**Steps**:
1. Check in 3 Premium members
2. Check in 2 Basic members
3. Check in 1 Elite member
4. View stats

**Expected Result**:
- ✅ byMembershipType.Premium = 3
- ✅ byMembershipType.Basic = 2
- ✅ byMembershipType.Elite = 1
- ✅ Breakdown accurate

### Test Case 19.21: Analytics - By Method

**Steps**:
1. 4 check-ins via QR Code
2. 3 check-ins via Card Scan
3. 2 check-ins via Manual
4. View stats

**Expected Result**:
- ✅ byMethod['QR Code'] = 4
- ✅ byMethod['Card Scan'] = 3
- ✅ byMethod['Manual'] = 2
- ✅ All methods tracked

### Test Case 19.22: Demo Data Initialization

**Steps**:
1. Clear localStorage
2. Refresh page
3. Login as member
4. View check-ins

**Expected Result**:
- ✅ 5 demo check-ins created
- ✅ 1 active check-in
- ✅ 4 completed check-ins
- ✅ Different dates (today, yesterday, 2 days ago, etc.)
- ✅ Various durations (60, 75, 90, 105 min)
- ✅ Different methods
- ✅ One with notes
- ✅ One with receptionist name

### Test Case 19.23: Real-Time Duration Counter

**Steps**:
1. Check in a member
2. View active check-in card
3. Wait 1 minute
4. Observe duration

**Expected Result**:
- ✅ Duration updates in real-time
- ✅ Increments every minute
- ✅ Formatted correctly (e.g., "5m", "1h 5m")
- ✅ No page refresh needed

### Test Case 19.24: Check-Out Validation

**Steps**:
1. Check out a member
2. Try to check out the same member again

**Expected Result**:
- ❌ Error: "Member already checked out"
- ✅ Status remains "Completed"
- ✅ Duration unchanged
- ✅ Check-out time unchanged

### Test Case 19.25: Member Total Gym Time

**Steps**:
1. Member has 3 completed check-ins:
   - 60 minutes
   - 90 minutes
   - 75 minutes
2. Call getMemberTotalGymTime()

**Expected Result**:
- ✅ Returns 225 (total minutes)
- ✅ Formatted as "3h 45m" in UI
- ✅ Only counts completed check-ins
- ✅ Ignores active check-ins

### Test Case 19.26: Average Duration Calculation

**Steps**:
1. 3 completed check-ins today:
   - 60 min
   - 90 min
   - 120 min
2. View "Avg. Duration" stat

**Expected Result**:
- ✅ Average: 90 minutes
- ✅ Displayed as "1h 30m"
- ✅ Rounded to nearest minute
- ✅ Only includes completed check-ins
- ✅ Updates in real-time

### Test Case 19.27: Receptionist Name Recording

**Steps**:
1. Receptionist "Maria" checks in member manually
2. View check-in details

**Expected Result**:
- ✅ receptionistId recorded
- ✅ receptionistName: "Maria"
- ✅ Displayed in active check-in card
- ✅ Visible in history
- ✅ Only for manual check-ins
- ✅ QR/Card check-ins have no receptionist

### Test Case 19.28: Multiple Members Active

**Steps**:
1. Check in 5 different members
2. All stay active (no check-out)
3. View "Currently in Gym"

**Expected Result**:
- ✅ All 5 displayed
- ✅ Count shows 5
- ✅ Each has separate card
- ✅ Each has check-out button
- ✅ Durations independent
- ✅ No data mixing

### Test Case 19.29: Data Persistence

**Steps**:
1. Check in 2 members
2. Check out 1 member
3. Refresh page
4. Check data

**Expected Result**:
- ✅ 1 active check-in persists
- ✅ 1 completed check-in persists
- ✅ All data intact (time, method, notes)
- ✅ Statistics accurate after refresh
- ✅ localStorage working

### Test Case 19.30: Peak Day Identification

**Steps**:
1. Create check-ins across week:
   - Monday: 10 check-ins
   - Tuesday: 5 check-ins
   - Wednesday: 15 check-ins (most)
   - Thursday: 8 check-ins
2. Call getCheckInStats()

**Expected Result**:
- ✅ Peak day: "Wednesday"
- ✅ byDay object shows all days
- ✅ Correct counts per day
- ✅ Peak day has highest count

### Checklist - Member Check-In History

- [x] Tab accessible from member dashboard
- [x] Statistics cards display (4 cards)
- [x] Total visits count accurate
- [x] Total time calculated correctly
- [x] Average session accurate
- [x] This week count correct
- [x] Active check-in banner shows when in gym
- [x] Active banner shows live duration
- [x] Active banner shows check-in time
- [x] Active banner shows method
- [x] Recent 10 check-ins displayed
- [x] Check-ins sorted newest first
- [x] Date and time formatted correctly
- [x] Duration shown for completed
- [x] Check-in/check-out times visible
- [x] Method badges color-coded
- [x] Notes displayed if present
- [x] Receptionist name shown if manual
- [x] Empty state for no check-ins
- [x] Monthly summary displayed
- [x] Responsive design works

### Checklist - Receptionist Check-In Management

- [x] Tab accessible from receptionist dashboard
- [x] Statistics cards display (4 cards)
- [x] Currently in gym count accurate
- [x] Today's check-ins count accurate
- [x] Completed today count accurate
- [x] Average duration accurate
- [x] "Check In Member" button functional
- [x] Check-in modal opens
- [x] Member search works
- [x] Search filters by name
- [x] Search filters by email
- [x] Member dropdown populated
- [x] Method dropdown has 3 options
- [x] Notes textarea functional
- [x] Check-in validation works
- [x] Duplicate check-in prevented
- [x] Active membership required
- [x] Check-in created successfully
- [x] Currently in gym list updates
- [x] Active check-ins green highlighted
- [x] Real-time duration counter works
- [x] Check-out button functional
- [x] Check-out modal opens
- [x] Check-out confirmation works
- [x] Duration calculated on check-out
- [x] Status changes to completed
- [x] Today's check-ins list displays
- [x] Both active and completed shown
- [x] Method badges displayed
- [x] Notes visible if present
- [x] Receptionist name recorded for manual
- [x] Empty states shown appropriately
- [x] Responsive design works
- [x] Demo check-ins initialized (5 check-ins)

---

## 📊 STEP 20: Manager Analytics Dashboard

### Test Case 20.1: View Analytics Dashboard

**Steps**:
1. Login as manager
2. Navigate to "Advanced Analytics" tab
3. View dashboard

**Expected Result**:
- ✅ Dashboard loads successfully
- ✅ 4 KPI cards displayed
- ✅ All charts visible
- ✅ No loading errors
- ✅ Default time range: 30 days

### Test Case 20.2: Key Metrics - Total Members

**Steps**:
1. View Total Members KPI card
2. Check value and growth indicator

**Expected Result**:
- ✅ Shows accurate member count
- ✅ Growth percentage displayed
- ✅ Trend arrow (up/down) shown
- ✅ Green for growth, red for decline
- ✅ Icon displayed (Users)

### Test Case 20.3: Key Metrics - Total Revenue

**Steps**:
1. View Total Revenue KPI card
2. Check value and growth

**Expected Result**:
- ✅ Shows revenue in € format
- ✅ Revenue growth percentage shown
- ✅ Trend indicator displayed
- ✅ Compares with previous period
- ✅ Currency symbol (€) present

### Test Case 20.4: Key Metrics - Active Classes

**Steps**:
1. View Active Classes KPI card
2. Check class count and attendance

**Expected Result**:
- ✅ Shows number of active classes
- ✅ Average attendance percentage shown
- ✅ Formatted correctly (XX%)
- ✅ Icon displayed (Calendar)

### Test Case 20.5: Key Metrics - Total Check-Ins

**Steps**:
1. View Total Check-Ins KPI card
2. Check count and average session

**Expected Result**:
- ✅ Shows check-in count
- ✅ Average session time displayed
- ✅ Formatted as hours/minutes
- ✅ Icon displayed (Activity)

### Test Case 20.6: Member Status Breakdown

**Steps**:
1. View member status cards
2. Check active, pending, suspended counts

**Expected Result**:
- ✅ 3 status cards displayed
- ✅ Active members: green color
- ✅ Pending: yellow color
- ✅ Suspended: red color
- ✅ Percentages calculated correctly
- ✅ All counts accurate

### Test Case 20.7: Revenue Trend Chart

**Steps**:
1. View "Revenue Trend" line chart
2. Check data for last 6 months

**Expected Result**:
- ✅ Chart renders correctly
- ✅ Shows 6 months of data
- ✅ X-axis: Month names
- ✅ Y-axis: Revenue amounts
- ✅ Line connects all points
- ✅ Tooltips work on hover
- ✅ Legend displayed

### Test Case 20.8: Membership Distribution Pie Chart

**Steps**:
1. View "Membership Distribution" pie chart
2. Check segments

**Expected Result**:
- ✅ Pie chart renders
- ✅ 3 segments (Basic, Premium, Elite)
- ✅ Colors: Blue, Purple, Orange
- ✅ Labels show percentages
- ✅ Tooltips display on hover
- ✅ Percentages add up to 100%

### Test Case 20.9: Check-Ins by Day Bar Chart

**Steps**:
1. View "Check-Ins by Day of Week" chart
2. Check all days displayed

**Expected Result**:
- ✅ Bar chart renders
- ✅ 7 bars (one per day)
- ✅ X-axis: Day names
- ✅ Y-axis: Check-in counts
- ✅ Bars colored blue
- ✅ Peak day highlighted below chart
- ✅ Peak day identified correctly

### Test Case 20.10: Check-Ins by Hour Line Chart

**Steps**:
1. View "Check-Ins by Hour of Day" chart
2. Check hourly distribution

**Expected Result**:
- ✅ Line chart renders
- ✅ 24 data points (0:00 to 23:00)
- ✅ X-axis: Hour labels
- ✅ Y-axis: Check-in counts
- ✅ Line colored purple
- ✅ Peak hour displayed below
- ✅ Peak hour identified correctly

### Test Case 20.11: Top 5 Popular Classes

**Steps**:
1. View "Top 5 Most Popular Classes" section
2. Check rankings

**Expected Result**:
- ✅ 5 classes listed (if available)
- ✅ Sorted by enrollment (highest first)
- ✅ #1 has gold badge
- ✅ Others have gray badge
- ✅ Enrollment/capacity shown
- ✅ Percentage calculated correctly
- ✅ Progress bars displayed
- ✅ #1 has yellow/gold progress bar

### Test Case 20.12: Time Range Filter - 7 Days

**Steps**:
1. Change time range to "Last 7 days"
2. Observe dashboard updates

**Expected Result**:
- ✅ All metrics recalculate
- ✅ Charts update with 7-day data
- ✅ Growth comparisons change
- ✅ Previous period: 7 days before
- ✅ No errors during update

### Test Case 20.13: Time Range Filter - 30 Days

**Steps**:
1. Change time range to "Last 30 days"
2. Check all data

**Expected Result**:
- ✅ All metrics recalculate
- ✅ Charts show 30-day data
- ✅ Default selection
- ✅ Accurate comparisons

### Test Case 20.14: Time Range Filter - 90 Days

**Steps**:
1. Change time range to "Last 90 days"
2. Verify updates

**Expected Result**:
- ✅ All metrics recalculate
- ✅ 90-day period data shown
- ✅ Previous 90 days used for comparison
- ✅ Charts render correctly

### Test Case 20.15: Time Range Filter - 1 Year

**Steps**:
1. Change time range to "Last year"
2. Check annual data

**Expected Result**:
- ✅ All metrics recalculate
- ✅ 365-day period
- ✅ Year-over-year comparison
- ✅ Charts show full year

### Test Case 20.16: Key Insights - Peak Usage Time

**Steps**:
1. View "Peak Usage Time" insight card
2. Check peak day and hour

**Expected Result**:
- ✅ Card displayed with clock icon
- ✅ Peak day identified
- ✅ Peak hour identified
- ✅ Accurate based on check-in data
- ✅ Blue color scheme

### Test Case 20.17: Key Insights - Revenue Growth

**Steps**:
1. View "Revenue Growth" insight card
2. Check growth information

**Expected Result**:
- ✅ Card displayed with trend icon
- ✅ Shows up or down
- ✅ Percentage accurate
- ✅ Comparison period noted
- ✅ Green color scheme

### Test Case 20.18: Key Insights - Most Popular Class

**Steps**:
1. View "Most Popular Class" insight card
2. Check class name

**Expected Result**:
- ✅ Card displayed with award icon
- ✅ Shows class with highest enrollment
- ✅ Accurate class name
- ✅ Purple color scheme

### Test Case 20.19: Key Insights - Average Session

**Steps**:
1. View "Average Session" insight card
2. Check duration

**Expected Result**:
- ✅ Card displayed with activity icon
- ✅ Average duration shown
- ✅ Formatted as hours/minutes
- ✅ Accurate calculation
- ✅ Orange color scheme

### Test Case 20.20: Export Report Button

**Steps**:
1. Click "Export Report" button
2. Check functionality

**Expected Result**:
- ✅ Button visible
- ✅ Download icon displayed
- ✅ Click triggers action
- ✅ Alert/modal appears
- ✅ Ready for PDF/Excel integration

### Test Case 20.21: Empty State - No Classes

**Steps**:
1. Database with no active classes
2. View class popularity section

**Expected Result**:
- ✅ Empty state displayed
- ✅ Icon shown (Award)
- ✅ Message: "No class data available"
- ✅ No errors
- ✅ Graceful handling

### Test Case 20.22: Growth Calculation - Positive

**Steps**:
1. Current period: 50 new members
2. Previous period: 40 new members
3. View member growth

**Expected Result**:
- ✅ Growth: +25%
- ✅ Green arrow up
- ✅ Green text color
- ✅ Calculation accurate

### Test Case 20.23: Growth Calculation - Negative

**Steps**:
1. Current period: 30 revenue
2. Previous period: 50 revenue
3. View revenue growth

**Expected Result**:
- ✅ Growth: -40%
- ✅ Red arrow down
- ✅ Red text color
- ✅ Calculation accurate

### Test Case 20.24: Growth Calculation - Zero Previous

**Steps**:
1. Previous period: 0 members
2. Current period: 10 members
3. View growth

**Expected Result**:
- ✅ Growth: 0%
- ✅ No division by zero error
- ✅ Handles edge case
- ✅ No crash

### Test Case 20.25: Chart Tooltips

**Steps**:
1. Hover over revenue line chart
2. Hover over pie chart segment
3. Hover over bar chart bar

**Expected Result**:
- ✅ Tooltips appear on hover
- ✅ Show accurate values
- ✅ Formatted correctly
- ✅ Readable text
- ✅ Proper positioning

### Test Case 20.26: Responsive Design

**Steps**:
1. View on desktop (wide screen)
2. Resize to tablet width
3. Resize to mobile width

**Expected Result**:
- ✅ Charts resize appropriately
- ✅ Grid adjusts (4 cols → 2 cols → 1 col)
- ✅ No horizontal scroll
- ✅ All content visible
- ✅ Readable on all sizes

### Test Case 20.27: Data Accuracy - Member Count

**Steps**:
1. Create 5 active members
2. Create 2 pending members
3. View analytics

**Expected Result**:
- ✅ Total members: 7
- ✅ Active members: 5
- ✅ Pending members: 2
- ✅ Percentages correct
- ✅ Real-time accuracy

### Test Case 20.28: Data Accuracy - Revenue

**Steps**:
1. Create transactions totaling €500
2. Include failed transaction €100
3. View revenue

**Expected Result**:
- ✅ Total revenue: €500 (not €600)
- ✅ Only completed transactions counted
- ✅ Failed transactions excluded
- ✅ Currency formatting correct

### Test Case 20.29: Data Accuracy - Check-Ins

**Steps**:
1. Create 10 check-ins across different days
2. Create 5 check-ins on Monday
3. View analytics

**Expected Result**:
- ✅ Total: 15 check-ins
- ✅ Monday: 5 check-ins
- ✅ Peak day: Monday
- ✅ Bar chart accurate
- ✅ All days represented

### Test Case 20.30: Performance - Large Dataset

**Steps**:
1. Database with 1000+ members
2. 500+ transactions
3. 200+ check-ins
4. Load analytics dashboard

**Expected Result**:
- ✅ Loads within reasonable time (<3 seconds)
- ✅ No performance issues
- ✅ Charts render smoothly
- ✅ Filters work quickly
- ✅ No browser lag

### Checklist - Manager Analytics Dashboard

- [x] Tab accessible from manager dashboard
- [x] 4 KPI cards displayed
- [x] Total members count accurate
- [x] Member growth calculated correctly
- [x] Total revenue displayed in €
- [x] Revenue growth shown
- [x] Active classes count correct
- [x] Average attendance accurate
- [x] Total check-ins displayed
- [x] Average session time shown
- [x] Member status breakdown (3 cards)
- [x] Active/Pending/Suspended counts accurate
- [x] Percentages calculated correctly
- [x] Revenue trend chart renders
- [x] 6 months of data shown
- [x] Membership distribution pie chart
- [x] 3 segments (Basic/Premium/Elite)
- [x] Check-ins by day bar chart
- [x] Peak day identified
- [x] Check-ins by hour line chart
- [x] Peak hour identified
- [x] Top 5 popular classes listed
- [x] Rankings accurate
- [x] #1 has gold badge
- [x] Progress bars shown
- [x] Key insights section (4 cards)
- [x] Peak usage time insight
- [x] Revenue growth insight
- [x] Most popular class insight
- [x] Average session insight
- [x] Time range filter functional
- [x] 7/30/90/365 day options
- [x] Data recalculates on filter change
- [x] Export report button present
- [x] Tooltips work on charts
- [x] Responsive design works
- [x] Empty states handled
- [x] Growth indicators (arrows)
- [x] Color coding correct
- [x] Icons displayed
- [x] No performance issues
- [x] Data accuracy verified

---

**Last Updated**: 2026-05-27  
**Steps Tested**: 1-20  
**Total Test Cases**: 410+
