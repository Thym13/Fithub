# Test Cases - UC-1: Member Registration (Version 1)

## Test Suite Information
- **Use Case**: UC-1 Member Registration
- **Version**: 1.0
- **Date**: 2026-05-11
- **Test Environment**: React 18.3.1, TypeScript, Vite
- **Tested By**: QA Team

---

## TC-UC1-001: Successful Member Registration with Basic Membership

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User is on the registration page
- System is operational
- Payment gateway is available

### Test Steps
1. Navigate to `/register`
2. Click on "Member" role selection
3. Fill in personal information:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone: "+30 698 123 4567"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
4. Select membership type: "Basic"
5. Enter payment details:
   - Card Number: "4111111111111111"
   - CVV: "123"
   - Expiry: "12/28"
6. Click "Complete Registration"
7. Check email inbox for verification email

### Expected Results
- User successfully redirected to role selection
- Personal information form accepts valid data
- Payment processes successfully (status: "Completed")
- User account created with `role: "member"`
- Membership record created with type: "Basic"
- Verification email sent with token
- Success modal displays: "Registration successful! Please check your email."
- User redirected to login page

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc1-registration.puml lines 24-110_

---

## TC-UC1-002: Successful Trainer Registration with Application

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User is on the registration page
- System is operational
- File upload service is available

### Test Steps
1. Navigate to `/register`
2. Click on "Trainer" role selection
3. Fill in personal information:
   - First Name: "Maria"
   - Last Name: "Papadopoulos"
   - Email: "maria.trainer@example.com"
   - Phone: "+30 697 987 6543"
   - Password: "TrainerPass456!"
   - Confirm Password: "TrainerPass456!"
4. Fill in trainer-specific fields:
   - Specialty: "Yoga, Pilates"
   - Years of Experience: "5"
5. Upload CV document (PDF, < 5MB)
6. Upload certification documents (PDF, < 5MB)
7. Click "Submit Application"

### Expected Results
- User account created with `role: "trainer"`, `accountStatus: "Pending"`
- TrainerApplication record created with `status: "Pending"`
- Documents uploaded successfully with valid URLs
- Application notification sent to Manager
- Success message: "Application submitted! You'll be notified once reviewed."
- User redirected to pending status page

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc1-registration.puml lines 112-150_

---

## TC-UC1-003: Registration Fails - Duplicate Email

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Preconditions
- Existing user with email "existing@example.com" in database
- User is on registration page

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Fill in personal information with existing email:
   - Email: "existing@example.com"
   - Other fields: valid data
4. Click "Continue"

### Expected Results
- System calls `findOne({email: "existing@example.com"})`
- Database returns existing user record
- Error message displayed: "This email is already registered. Please login or use a different email."
- User remains on registration form
- No user account created
- No payment processing initiated

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc1-registration.puml lines 48-56_

---

## TC-UC1-004: Registration Fails - Invalid Email Format

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Enter invalid email formats:
   - "invalidemail" (no @ symbol)
   - "test@" (incomplete domain)
   - "@example.com" (no username)
   - "test @example.com" (space in email)
4. Attempt to proceed to next step

### Expected Results
- Inline validation error appears: "Please enter a valid email address"
- "Continue" button remains disabled
- Form does not submit
- No API calls made

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-005: Registration Fails - Password Mismatch

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Fill in valid personal information
4. Enter password: "Password123!"
5. Enter confirm password: "Password456!" (different)
6. Click "Continue"

### Expected Results
- Validation error displayed: "Passwords do not match"
- Form highlights password fields in red
- User cannot proceed to membership selection
- No account created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-006: Registration Fails - Weak Password

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Security Validation

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Attempt passwords that don't meet requirements:
   - "pass" (too short)
   - "password" (no uppercase, no numbers)
   - "PASSWORD" (no lowercase, no numbers)
   - "Password" (no numbers, no special chars)
4. Observe validation feedback

### Expected Results
- Real-time validation feedback shows password strength
- Error message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
- Submit button remains disabled
- No account created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-007: Payment Processing Failure

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Payment Integration

### Preconditions
- User has completed registration form with valid data
- User is on payment screen

### Test Steps
1. Complete registration steps up to payment
2. Enter declined card details:
   - Card Number: "4000000000000002" (test decline card)
   - CVV: "123"
   - Expiry: "12/28"
3. Click "Complete Payment"

### Expected Results
- Payment gateway returns `{success: false, error: "Card declined"}`
- Error modal displayed: "Payment failed. Please check your card details and try again."
- Transaction record created with `status: "Failed"`
- No Membership record created
- User account created but with `accountStatus: "Payment Pending"`
- User can retry payment

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc1-registration.puml lines 92-106_

---

## TC-UC1-008: Email Verification Flow

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Email Verification

### Preconditions
- User has successfully registered
- Verification email has been sent

### Test Steps
1. Complete successful registration
2. Check email inbox for verification email
3. Click verification link in email
4. Observe account status change

### Expected Results
- Verification email received within 2 minutes
- Email contains valid verification token
- Clicking link calls `verifyEmail(token)`
- Database updates: `emailVerified: true`
- Success page displays: "Email verified! You can now login."
- Redirect to login page after 3 seconds

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc1-registration.puml lines 76-85_

---

## TC-UC1-009: Registration with Premium Membership

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Membership Tiers

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Fill in valid personal information
4. Select membership type: "Premium"
5. Verify pricing displays: €49.99/month
6. Complete payment with valid card
7. Verify membership creation

### Expected Results
- Premium membership price displayed correctly
- Payment amount matches premium tier
- Membership created with:
  - `type: "Premium"`
  - `monthlyCost: 49.99`
  - `classLimit: 20`
  - `ptSessions: 4`
  - `spaAccess: true`
- Success confirmation shows premium benefits
- User can immediately book up to 20 classes

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-010: Registration - File Upload Size Limit (Trainer)

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: File Upload Validation

### Preconditions
- User is registering as Trainer
- User is on document upload step

### Test Steps
1. Navigate to trainer registration
2. Complete personal information
3. Attempt to upload CV file > 5MB
4. Observe validation

### Expected Results
- File upload rejected with error: "File size must not exceed 5MB"
- Upload button remains disabled
- User must select different file
- No file uploaded to server
- Application not submitted

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-011: Registration - Invalid File Type (Trainer)

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: File Upload Validation

### Test Steps
1. Navigate to trainer registration
2. Complete personal information
3. Attempt to upload CV as .exe, .zip, or .jpg file
4. Observe validation

### Expected Results
- File upload rejected: "Only PDF and DOC files are allowed"
- File input cleared
- User must select valid file format
- Application cannot be submitted

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-012: Multi-Step Form Navigation

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: User Experience

### Test Steps
1. Navigate to `/register`
2. Select role and click "Continue"
3. Fill step 1 (personal info) and click "Continue"
4. On step 2, click "Back" button
5. Verify data persistence
6. Click "Continue" again
7. Complete registration

### Expected Results
- Form state persists when navigating back
- Previously entered data remains in fields
- Progress indicator shows current step
- User can complete registration after going back
- No data loss during navigation

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-013: Registration - Phone Number Validation

**Priority**: Low  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Enter invalid phone numbers:
   - "123" (too short)
   - "abcdefghij" (letters)
   - "+30 123" (incomplete)
4. Attempt to proceed

### Expected Results
- Validation error: "Please enter a valid phone number"
- Format hint displayed: "+30 XXX XXX XXXX"
- Form submission blocked
- Inline error styling applied

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-014: Registration - Required Fields Validation

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Navigate to `/register`
2. Select "Member" role
3. Leave required fields empty:
   - First Name
   - Last Name
   - Email
   - Password
4. Click "Continue"

### Expected Results
- Error messages appear under each empty required field
- "Continue" button remains disabled
- Red borders highlight incomplete fields
- Form does not submit
- User stays on current step

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC1-015: Concurrent Registration Prevention

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Race Condition

### Test Steps
1. Open registration form in two browser tabs
2. In both tabs, start registering with same email
3. Complete Tab 1 registration first
4. Attempt to complete Tab 2 registration with same email

### Expected Results
- Tab 1 completes successfully
- Tab 2 receives error: "This email is already registered"
- Database constraint prevents duplicate email
- Only one user account created
- Second attempt fails gracefully

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## Test Coverage Summary

| Category | Total | Passed | Failed | Blocked | Coverage % |
|----------|-------|--------|--------|---------|------------|
| Positive Tests | 4 | - | - | - | - |
| Negative Tests | 9 | - | - | - | - |
| Edge Cases | 2 | - | - | - | - |
| **Total** | **15** | **-** | **-** | **-** | **-** |

---

## Traceability Matrix

| Test Case ID | Requirement | Sequence Diagram Reference |
|--------------|-------------|---------------------------|
| TC-UC1-001 | Member registration flow | Lines 24-110 |
| TC-UC1-002 | Trainer registration flow | Lines 112-150 |
| TC-UC1-003 | Email uniqueness check | Lines 48-56 |
| TC-UC1-004 | Email format validation | Lines 39-43 |
| TC-UC1-005 | Password confirmation | Lines 58-66 |
| TC-UC1-006 | Password strength | Lines 58-66 |
| TC-UC1-007 | Payment failure handling | Lines 92-106 |
| TC-UC1-008 | Email verification | Lines 76-85 |
| TC-UC1-009 | Premium membership | Lines 68-90 |
| TC-UC1-010 | File size validation | Lines 129-139 |
| TC-UC1-011 | File type validation | Lines 129-139 |
| TC-UC1-012 | Form navigation | Lines 24-43 |
| TC-UC1-013 | Phone validation | Lines 39-43 |
| TC-UC1-014 | Required fields | Lines 39-56 |
| TC-UC1-015 | Duplicate prevention | Lines 48-56 |

---

## Notes
- All test cases should be executed in Chrome, Firefox, and Safari
- Mobile responsive testing required for all flows
- Performance: Registration should complete within 5 seconds
- Security: All passwords must be hashed before storage
- Accessibility: Form must be WCAG 2.1 AA compliant
