# Test Cases - UC-2: Book Class (Version 1)

## Test Suite Information
- **Use Case**: UC-2 Book Class
- **Version**: 1.0
- **Date**: 2026-05-11
- **Test Environment**: React 18.3.1, TypeScript, Vite
- **Tested By**: QA Team

---

## TC-UC2-001: Successful Class Booking with Available Spots

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User is logged in as Member
- Active membership with available class bookings
- Class "Morning Yoga" has available spots (enrolled < capacity)
- User navigates to `/member` dashboard

### Test Steps
1. Navigate to `/member` dashboard
2. Click on "Browse Classes" tab
3. View class calendar with available classes
4. Click on "Morning Yoga" class (Monday, 9:00 AM)
5. Verify class details modal opens showing:
   - Instructor: "Sarah Johnson"
   - Available spots: "5/20"
   - Duration: "60 minutes"
6. Click "Book This Class" button
7. Confirm booking in confirmation dialog

### Expected Results
- System calls `findById(classId)` and retrieves class details
- Availability validated: `enrolled < capacity` returns true
- Membership status check: `status: "Active"` confirmed
- Booking created with:
  - `status: "confirmed"`
  - `bookingType: "class"`
  - `createdAt: DateTime.now()`
- Class enrollment incremented: `enrolled: enrolled + 1`
- Booking notification sent to trainer
- Success modal: "Class booked successfully! See you Monday at 9:00 AM."
- Booking appears in Member's "My Schedule" tab

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc2-book-class.puml lines 24-92_

---

## TC-UC2-002: Booking Fails - Class Full (Join Waitlist)

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Capacity Management

### Preconditions
- User logged in as Member
- Class "HIIT Training" is at full capacity (enrolled == capacity)

### Test Steps
1. Navigate to class calendar
2. Click on full class "HIIT Training"
3. Observe "Class Full" indicator
4. View "Join Waitlist" button
5. Click "Join Waitlist"
6. Confirm waitlist registration

### Expected Results
- System validates: `enrolled >= capacity` returns true
- Error message: "This class is currently full"
- "Join Waitlist" button displayed instead of "Book"
- Clicking waitlist creates Waitlist record:
  - `position: calculatePosition(classId)`
  - `status: "waiting"`
  - `notified: false`
- Confirmation: "You've been added to the waitlist at position #3"
- Waitlist entry appears in Member dashboard

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc2-book-class.puml lines 94-128_

---

## TC-UC2-003: Booking Fails - Expired Membership

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Membership Validation

### Preconditions
- User logged in as Member
- Membership has expired (`expiryDate < today`)

### Test Steps
1. Navigate to class calendar
2. Attempt to click "Book This Class"
3. Observe validation error

### Expected Results
- System checks: `checkMembershipStatus(memberId)`
- Database returns: `status: "Expired"` or `expiryDate < NOW()`
- Error modal displayed: "Your membership has expired. Please renew to book classes."
- "Renew Membership" button shown
- No booking created
- User redirected to membership renewal page if clicked

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc2-book-class.puml lines 58-70_

---

## TC-UC2-004: Booking Fails - Class Limit Reached

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Membership Tier Limits

### Preconditions
- User has Basic membership with `classLimit: 10`
- User already has 10 active bookings this month

### Test Steps
1. Navigate to class calendar
2. Attempt to book 11th class
3. Observe limit validation

### Expected Results
- System counts current bookings: `countBookings(memberId, thisMonth)`
- Validates against membership: `currentBookings >= classLimit`
- Error modal: "You've reached your monthly class limit (10). Upgrade to Premium for more classes."
- "Upgrade Membership" button displayed
- No booking created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-005: Successful Booking Cancellation

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Booking Management

### Preconditions
- User has an active booking for "Yoga" class tomorrow
- Cancellation is within allowed timeframe (> 2 hours before class)

### Test Steps
1. Navigate to "My Schedule" tab
2. Locate upcoming booking
3. Click "Cancel Booking" button
4. Enter cancellation reason: "Schedule conflict"
5. Confirm cancellation

### Expected Results
- System validates cancellation timing
- Booking updated:
  - `status: "cancelled"`
  - `cancelledAt: DateTime.now()`
  - `cancellationReason: "Schedule conflict"`
- Class enrollment decremented: `enrolled: enrolled - 1`
- If waitlist exists, notify first person in queue
- Confirmation: "Booking cancelled successfully"
- Booking removed from "My Schedule"
- Cancellation confirmation email sent

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc2-book-class.puml lines 130-158_

---

## TC-UC2-006: Cancellation Fails - Too Late

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Business Rules

### Preconditions
- User has booking for class starting in 1 hour
- Cancellation policy: minimum 2 hours notice

### Test Steps
1. Navigate to "My Schedule"
2. Attempt to cancel upcoming class
3. Observe policy enforcement

### Expected Results
- System calculates: `classStartTime - now < 2 hours`
- Error message: "Cancellations must be made at least 2 hours before class"
- Cancel button disabled or shows warning
- No cancellation processed
- Booking remains active

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-007: Waitlist to Booking Conversion

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Waitlist Management

### Preconditions
- User is on waitlist position #1
- Another member cancels their booking
- Spot becomes available

### Test Steps
1. Member A cancels booking
2. System automatically checks waitlist
3. User (position #1) receives notification
4. User clicks notification link
5. User confirms booking acceptance
6. Verify booking created

### Expected Results
- Cancellation triggers: `checkWaitlist(classId)`
- System finds: `position: 1, status: "waiting"`
- Notification sent: "A spot is available for HIIT Training!"
- Notification includes booking link (expires in 1 hour)
- User clicks and confirms within timeframe
- Waitlist entry updated: `status: "converted"`
- Booking created with `status: "confirmed"`
- User removed from waitlist
- Remaining waitlist positions updated (decremented by 1)

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc2-book-class.puml lines 116-128_

---

## TC-UC2-008: Filter Classes by Category

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Search and Filter

### Test Steps
1. Navigate to class calendar
2. Click "Category" dropdown
3. Select "Yoga" category
4. Observe filtered results

### Expected Results
- System calls: `findAll({category: "Yoga", status: "Active"})`
- Only Yoga classes displayed
- Other categories hidden
- Class count updates to show filtered count
- Filter can be cleared to show all classes

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-009: View Class Schedule by Day

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Calendar Navigation

### Test Steps
1. Navigate to class calendar
2. View weekly calendar layout
3. Click on specific day (e.g., "Wednesday")
4. Verify classes displayed for that day only
5. Navigate to next/previous week

### Expected Results
- Calendar displays 7 days with classes
- Clicking day filters to show that day's schedule
- Classes sorted by time (earliest to latest)
- Empty days show "No classes scheduled"
- Week navigation works correctly
- Current day highlighted

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-010: Duplicate Booking Prevention

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Business Rules

### Preconditions
- User already has confirmed booking for "Yoga - Monday 9:00 AM"

### Test Steps
1. Navigate to class calendar
2. Attempt to book the same class again
3. Observe validation

### Expected Results
- System checks: `findOne({memberId, classId, status: "confirmed"})`
- Existing booking found
- Error message: "You already have a booking for this class"
- "Book" button disabled or replaced with "Already Booked"
- No duplicate booking created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-011: Booking Confirmation Email

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Notifications

### Preconditions
- User successfully books a class

### Test Steps
1. Complete successful class booking
2. Check email inbox
3. Verify email contents

### Expected Results
- Email received within 2 minutes
- Email contains:
  - Class name and category
  - Date and time
  - Instructor name
  - Location/Room number
  - Cancellation policy
  - "Add to Calendar" link
- Email sent from: noreply@fithub.com
- Member name personalized in greeting

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-012: Trainer Notification on Booking

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Notifications

### Preconditions
- Trainer logged into system
- Member books trainer's class

### Test Steps
1. Member books class instructed by trainer
2. Trainer views notifications
3. Verify notification details

### Expected Results
- Notification created with:
  - `type: "new_booking"`
  - `title: "New booking for your class"`
  - `content: "[Member Name] booked your [Class Name] class"`
- Notification appears in trainer dashboard
- Badge count increments
- Notification marked unread

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-013: View Booking History

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: User Experience

### Test Steps
1. Navigate to "My Bookings" page
2. View "Past" tab
3. Verify completed bookings display
4. Check booking details

### Expected Results
- All past bookings displayed (status: "completed")
- Sorted by date (most recent first)
- Each booking shows:
  - Class name
  - Date attended
  - Instructor
  - Completion badge
- Option to submit review for completed classes
- Pagination for bookings > 20

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-014: Concurrent Booking Race Condition

**Priority**: High  
**Type**: Functional - Edge Case  
**Category**: Concurrency

### Preconditions
- Class has exactly 1 spot remaining
- Two users attempt to book simultaneously

### Test Steps
1. User A and User B both view class with 1 spot
2. Both click "Book" at nearly same time
3. Observe booking resolution

### Expected Results
- Database transaction ensures atomicity
- Only one booking succeeds
- First transaction wins, second fails
- Second user receives: "This class just filled up. Would you like to join the waitlist?"
- Waitlist option offered automatically
- No overbooking occurs

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC2-015: Mobile Responsive Class Calendar

**Priority**: Medium  
**Type**: Non-Functional  
**Category**: Responsive Design

### Test Steps
1. Open application on mobile device (375px width)
2. Navigate to class calendar
3. Verify layout and usability
4. Book a class on mobile

### Expected Results
- Calendar switches to mobile-optimized view
- Touch targets minimum 44px
- Classes displayed in list view (not grid)
- All booking functionality works
- Modals fit screen without horizontal scroll
- Typography readable (minimum 16px)

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
| Positive Tests | 7 | - | - | - | - |
| Negative Tests | 5 | - | - | - | - |
| Edge Cases | 2 | - | - | - | - |
| Non-Functional | 1 | - | - | - | - |
| **Total** | **15** | **-** | **-** | **-** | **-** |

---

## Traceability Matrix

| Test Case ID | Requirement | Sequence Diagram Reference |
|--------------|-------------|---------------------------|
| TC-UC2-001 | Successful booking | Lines 24-92 |
| TC-UC2-002 | Full class waitlist | Lines 94-128 |
| TC-UC2-003 | Membership validation | Lines 58-70 |
| TC-UC2-004 | Class limit check | Lines 58-70 |
| TC-UC2-005 | Booking cancellation | Lines 130-158 |
| TC-UC2-006 | Cancellation policy | Lines 130-140 |
| TC-UC2-007 | Waitlist conversion | Lines 116-128 |
| TC-UC2-008 | Class filtering | Lines 27-34 |
| TC-UC2-009 | Calendar navigation | Lines 27-34 |
| TC-UC2-010 | Duplicate prevention | Lines 58-66 |
| TC-UC2-011 | Email notification | Lines 82-92 |
| TC-UC2-012 | Trainer notification | Lines 74-80 |
| TC-UC2-013 | Booking history | Lines 24-34 |
| TC-UC2-014 | Race condition | Lines 62-70 |
| TC-UC2-015 | Mobile responsiveness | UI Components |

---

## Notes
- Test on multiple browsers: Chrome, Firefox, Safari
- Verify timezone handling for class times
- Performance: Calendar should load within 2 seconds
- Accessibility: Keyboard navigation must work for all booking actions
