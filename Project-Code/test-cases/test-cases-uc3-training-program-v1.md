# Test Cases - UC-3: Create Training Program (Version 1)

## Test Suite Information
- **Use Case**: UC-3 Create Training Program
- **Version**: 1.0
- **Date**: 2026-05-11
- **Test Environment**: React 18.3.1, TypeScript, Vite
- **Tested By**: QA Team

---

## TC-UC3-001: Create Personal Training Program Successfully

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User logged in as Trainer
- Trainer has at least one assigned client
- Trainer navigates to `/trainer#programs`

### Test Steps
1. Navigate to trainer dashboard
2. Click "Create Program" button
3. Select program type: "Workout Program"
4. Fill program details:
   - Name: "Weight Loss Challenge"
   - Goal: "Lose 10kg in 12 weeks"
   - Duration: "12 weeks"
   - Difficulty: "Intermediate"
   - Weekly Frequency: "4 sessions"
5. Select target: "Personal" (assign to specific client)
6. Select client: "John Doe"
7. Click "Next: Add Exercises"
8. Search and add exercises:
   - "Barbell Squat" (4 sets, 12 reps, 60kg)
   - "Running" (30 minutes)
   - "Push-ups" (3 sets, 15 reps)
9. Click "Preview Program"
10. Review summary
11. Click "Create Program"

### Expected Results
- Program creation form renders with all fields
- Client dropdown populated with trainer's clients
- Exercise library loads with searchable exercises
- Program created with:
  - `programId: generated`
  - `status: "active"`
  - `programType: "personal"`
  - `startDate: today`
  - `endDate: today + 12 weeks`
- Exercises linked to program (3 exercises added)
- Notification sent to assigned client
- Success modal: "Training program created successfully!"
- Program appears in trainer's program list
- Client can view program in their dashboard

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 24-116_

---

## TC-UC3-002: Create Group Training Program Successfully

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Program Creation

### Test Steps
1. Click "Create Program"
2. Select type: "Workout Program"
3. Fill program details (same as TC-UC3-001)
4. Select target: "All Members"
5. Add 5 exercises
6. Click "Create Program"

### Expected Results
- Program created with `programType: "group"`
- No specific member assignment
- Notification sent to ALL members
- Program visible to all members in "Available Programs"
- Any member can enroll
- Success message indicates group program created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 76-84_

---

## TC-UC3-003: Create Nutrition Plan Successfully

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Program Types

### Test Steps
1. Click "Create Program"
2. Select type: "Nutrition Plan"
3. Fill nutrition plan details:
   - Name: "High Protein Diet"
   - Goal: "Muscle gain"
   - Duration: "8 weeks"
4. Add meal plans and guidelines
5. Assign to client
6. Click "Create Program"

### Expected Results
- Nutrition-specific form fields displayed
- Program created with `programType: "nutrition"`
- Nutrition guidelines saved
- Client receives nutrition plan notification
- Plan accessible in client's nutrition tab

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-004: Program Creation Fails - Missing Required Fields

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Click "Create Program"
2. Leave required fields empty:
   - Name (empty)
   - Duration (not selected)
   - Goal (empty)
3. Click "Next"

### Expected Results
- Validation errors displayed:
  - "Program name is required"
  - "Duration is required"
  - "Goal is required"
- "Next" button remains disabled
- Form does not proceed to next step
- Error fields highlighted in red
- No program created

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 65-74_

---

## TC-UC3-005: Program Creation Fails - No Exercises Added

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Business Rules

### Test Steps
1. Create program with valid details
2. Proceed to exercise selection step
3. Do not add any exercises
4. Attempt to create program

### Expected Results
- Validation error: "Please add at least one exercise to the program"
- "Create Program" button disabled
- Cannot complete program creation
- User must add minimum 1 exercise

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-006: Add Exercise from Library

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Exercise Management

### Test Steps
1. In program creation, reach exercise step
2. Click "Add Exercise"
3. Search for "Squat" in exercise library
4. Select "Barbell Squat"
5. Configure parameters:
   - Sets: 4
   - Reps: 12
   - Weight: 80kg
6. Click "Add to Program"

### Expected Results
- Exercise library modal opens
- Search filters exercises correctly
- Exercise details displayed (muscle groups, equipment)
- Parameter fields editable
- Exercise added to program list
- Exercise counter increments
- Can add multiple exercises

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 86-98_

---

## TC-UC3-007: Remove Exercise from Program

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Exercise Management

### Test Steps
1. Add 3 exercises to program
2. Click "Remove" on second exercise
3. Confirm removal
4. Verify exercise list updates

### Expected Results
- Confirmation dialog: "Remove this exercise?"
- Exercise removed from list
- Remaining exercises re-ordered
- Exercise counter decrements
- Can still add more exercises
- No impact on saved programs (only draft)

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-008: Program Preview Before Creation

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: User Experience

### Test Steps
1. Complete program details and add exercises
2. Click "Preview Program"
3. Review preview modal
4. Click "Edit" to make changes
5. Return to preview
6. Click "Create Program"

### Expected Results
- Preview modal shows:
  - Program name and goal
  - Duration and frequency
  - Complete exercise list with parameters
  - Assigned client/group
- "Edit" button returns to form with data preserved
- "Create" button finalizes program
- Preview accurately reflects entered data

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 100-116_

---

## TC-UC3-009: Edit Existing Training Program

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Program Management

### Test Steps
1. Navigate to "My Programs"
2. Select existing program "Weight Loss Challenge"
3. Click "Edit Program"
4. Modify:
   - Change duration from 12 to 16 weeks
   - Add 2 new exercises
   - Update 1 exercise parameters
5. Click "Save Changes"

### Expected Results
- Edit form pre-populated with current data
- Changes saved to database
- `updatedAt` timestamp updated
- Assigned client receives update notification
- Program version history maintained
- Success message: "Program updated successfully"

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-010: Delete Training Program

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Program Management

### Test Steps
1. Navigate to "My Programs"
2. Select program to delete
3. Click "Delete Program"
4. Confirm deletion in dialog
5. Verify program removed

### Expected Results
- Confirmation dialog: "Delete this program? This cannot be undone."
- Program status updated to `status: "deleted"` (soft delete)
- Program removed from active list
- Client notified of program removal
- Historical data preserved for analytics
- Success: "Program deleted successfully"

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-011: Duplicate Existing Program

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: User Experience

### Test Steps
1. Navigate to "My Programs"
2. Select successful program
3. Click "Duplicate"
4. Modify name: "Weight Loss Challenge v2"
5. Assign to different client
6. Click "Create"

### Expected Results
- All program details copied
- All exercises copied with parameters
- New unique `programId` generated
- Original program unchanged
- Faster program creation using template
- Success message confirms duplication

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-012: Invalid Duration Values

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Create program
2. Enter invalid durations:
   - 0 weeks
   - 100 weeks
   - -5 weeks
   - "abc" (non-numeric)
3. Attempt to proceed

### Expected Results
- Validation errors:
  - "Duration must be between 1 and 52 weeks"
  - "Please enter a valid number"
- Field highlighted with error
- Cannot proceed with invalid value
- Helpful range hint displayed

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-013: Search Exercise Library

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Search Functionality

### Test Steps
1. Open exercise library
2. Search for "chest" in search box
3. Verify results
4. Apply filter: "Strength Training" category
5. Sort by difficulty

### Expected Results
- Search returns relevant exercises (Bench Press, Chest Fly, etc.)
- Category filter narrows results
- Sorting works correctly
- Search is case-insensitive
- Minimum 2 characters required for search
- "No results" message if no matches

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC3-014: Program Notification to Client

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Notifications

### Preconditions
- Trainer creates program for client

### Test Steps
1. Complete program creation
2. Log in as assigned client
3. Check notifications
4. Verify email received

### Expected Results
- In-app notification created:
  - `type: "new_program"`
  - `title: "New training program assigned"`
- Email sent to client with program details
- Notification badge appears
- Click opens program details
- Email includes program overview and start date

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc3-training-program.puml lines 108-116_

---

## TC-UC3-015: Exercise Parameter Validation

**Priority**: Low  
**Type**: Functional - Negative  
**Category**: Input Validation

### Test Steps
1. Add exercise to program
2. Enter invalid parameters:
   - Sets: 0 or 100
   - Reps: -10 or 500
   - Weight: -50kg or 1000kg
3. Attempt to add exercise

### Expected Results
- Validation errors for each invalid field:
  - "Sets must be between 1 and 20"
  - "Reps must be between 1 and 100"
  - "Weight must be between 0 and 500kg"
- Exercise cannot be added with invalid params
- Real-time validation feedback
- Helpful range hints displayed

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
| Positive Tests | 9 | - | - | - | - |
| Negative Tests | 4 | - | - | - | - |
| User Experience | 2 | - | - | - | - |
| **Total** | **15** | **-** | **-** | **-** | **-** |

---

## Traceability Matrix

| Test Case ID | Requirement | Sequence Diagram Reference |
|--------------|-------------|---------------------------|
| TC-UC3-001 | Personal program creation | Lines 24-116 |
| TC-UC3-002 | Group program creation | Lines 76-84 |
| TC-UC3-003 | Nutrition plan creation | Lines 24-50 |
| TC-UC3-004 | Required field validation | Lines 65-74 |
| TC-UC3-005 | Exercise requirement | Lines 86-98 |
| TC-UC3-006 | Add exercise | Lines 86-98 |
| TC-UC3-007 | Remove exercise | Lines 86-98 |
| TC-UC3-008 | Program preview | Lines 100-116 |
| TC-UC3-009 | Edit program | Lines 24-116 |
| TC-UC3-010 | Delete program | Data management |
| TC-UC3-011 | Duplicate program | User experience |
| TC-UC3-012 | Duration validation | Lines 40-50 |
| TC-UC3-013 | Exercise search | Lines 86-98 |
| TC-UC3-014 | Client notification | Lines 108-116 |
| TC-UC3-015 | Parameter validation | Lines 86-98 |

---

## Notes
- Test exercise library performance with 500+ exercises
- Verify program data persists across sessions
- Test concurrent program creation by same trainer
- Accessibility: Keyboard navigation for exercise selection
