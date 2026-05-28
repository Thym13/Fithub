# Test Cases - UC-4: Assign Tasks (Version 1)

## Test Suite Information
- **Use Case**: UC-4 Assign Tasks
- **Version**: 1.0
- **Date**: 2026-05-11
- **Test Environment**: React 18.3.1, TypeScript, Vite
- **Tested By**: QA Team

---

## TC-UC4-001: Successfully Assign Task to Employee

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User logged in as Manager
- At least one active employee (Trainer or Receptionist) exists
- Manager navigates to `/manager#tasks`

### Test Steps
1. Navigate to Tasks tab in manager dashboard
2. Click "Add Task" button
3. Fill task details:
   - Title: "Greet Members at Entrance"
   - Description: "Welcome members and assist with check-ins"
   - Type: "Member Service"
   - Assign To: "John Smith"
   - Deadline: Tomorrow's date
   - Frequency: "Daily"
4. Click "Assign Task"
5. Verify success confirmation

### Expected Results
- Task form modal opens
- Employee dropdown populated with active staff
- Task created with:
  - `taskId: generated`
  - `status: "Pending"`
  - `priority: calculated based on deadline`
  - `assignedAt: DateTime.now()`
- Push notification sent to John Smith
- Badge count incremented on employee's dashboard
- Success modal: "Task assigned successfully to John Smith"
- Task appears in manager's task list
- Employee receives in-app notification

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc4-assign-tasks.puml lines 24-88_

---

## TC-UC4-002: Assign Recurring Weekly Task

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Task Management

### Test Steps
1. Click "Add Task"
2. Fill details:
   - Title: "Equipment Maintenance Check"
   - Type: "Maintenance"
   - Frequency: "Weekly"
   - Assign To: "Lisa Anderson"
   - Deadline: Every Friday
3. Click "Assign Task"

### Expected Results
- Task created with `frequency: "Weekly"`
- System auto-generates recurring instances
- Employee receives notification for upcoming instance
- Completed tasks auto-generate next occurrence
- Recurring pattern visible in task details

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-003: Task Assignment Fails - Missing Required Fields

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Click "Add Task"
2. Leave required fields empty:
   - Title (empty)
   - Assign To (not selected)
   - Deadline (not set)
3. Click "Assign Task"

### Expected Results
- Validation errors displayed:
  - "Task title is required"
  - "Please select an employee"
  - "Deadline is required"
- "Assign Task" button remains disabled
- No task created in database
- Form stays open for correction

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc4-assign-tasks.puml lines 50-58_

---

## TC-UC4-004: Employee Marks Task as In Progress

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Task Workflow

### Preconditions
- Employee logged in as John Smith
- Has pending task assigned

### Test Steps
1. Employee views notifications
2. Clicks on task notification
3. Reviews task details
4. Clicks "Start Task" button
5. Confirms status change

### Expected Results
- Task updated with:
  - `status: "In Progress"`
  - `startedAt: DateTime.now()`
- Status badge changes color to blue
- Manager receives notification of status change
- Task moves to "In Progress" section in dashboard
- Time tracking begins

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc4-assign-tasks.puml lines 90-108_

---

## TC-UC4-005: Employee Completes Task

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Task Workflow

### Preconditions
- Employee has task in "In Progress" status

### Test Steps
1. Employee opens task
2. Clicks "Mark as Complete"
3. (Optional) Adds completion notes
4. Confirms completion

### Expected Results
- Task updated with:
  - `status: "Completed"`
  - `completedAt: DateTime.now()`
- Manager notification sent
- Task moves to completed list
- Completion statistics updated
- If recurring, next instance auto-created
- Success message displayed to employee

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc4-assign-tasks.puml lines 110-130_

---

## TC-UC4-006: Manager Reassigns Task

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Task Management

### Preconditions
- Manager has created task assigned to John Smith
- Task is still pending or in progress

### Test Steps
1. Manager navigates to task list
2. Selects task
3. Clicks "Reassign"
4. Selects new employee: "Lisa Anderson"
5. (Optional) Adds reassignment reason
6. Confirms reassignment

### Expected Results
- Task updated with new `assignedToId`
- Original assignee receives cancellation notification
- New assignee receives assignment notification
- Task history logged with reassignment details
- Success notification to manager
- Task appears in new assignee's dashboard

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-007: Task Overdue Notification

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Notifications

### Preconditions
- Task deadline has passed
- Task status is still "Pending"

### Test Steps
1. Wait for task deadline to pass (or simulate system date)
2. Check employee notifications
3. Check manager notifications

### Expected Results
- System identifies overdue tasks (deadline < NOW(), status != "Completed")
- Overdue notification sent to employee
- Escalation notification sent to manager
- Task marked with overdue indicator (red flag)
- Task priority auto-elevated
- Email reminder sent if overdue > 24 hours

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-008: Filter Tasks by Status

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: User Interface

### Test Steps
1. Manager views task list
2. Click "Filter by Status"
3. Select "In Progress"
4. Verify filtered results
5. Clear filter

### Expected Results
- Only "In Progress" tasks displayed
- Task count updates to show filtered count
- Filter persists during session
- "Clear Filter" restores all tasks
- Multiple filters can be combined

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-009: Filter Tasks by Employee

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: User Interface

### Test Steps
1. Manager views task list
2. Filter by employee: "John Smith"
3. Verify results show only John's tasks
4. View task statistics for John

### Expected Results
- Only tasks assigned to John displayed
- Statistics show John's completion rate
- Can combine with status filter
- Employee performance metrics visible
- Export option available for employee tasks

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-010: Task with Past Deadline Validation

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Create new task
2. Set deadline to yesterday's date
3. Attempt to assign

### Expected Results
- Validation error: "Deadline cannot be in the past"
- Calendar widget blocks past dates
- Task cannot be created
- Helpful message suggests valid date range

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-011: Delete Task

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Task Management

### Test Steps
1. Manager selects pending task
2. Clicks "Delete Task"
3. Confirms deletion
4. Verify task removed

### Expected Results
- Confirmation dialog: "Delete this task? Employee will be notified."
- Task marked as deleted (soft delete)
- Employee receives cancellation notification
- Task removed from active lists
- Audit log updated
- Cannot delete completed tasks

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-012: View Task Completion Statistics

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Reporting

### Test Steps
1. Manager navigates to Tasks tab
2. View statistics panel
3. Check completion metrics

### Expected Results
- Dashboard displays:
  - Total tasks
  - Completed count and percentage
  - In Progress count
  - Pending count
  - Overdue count
- Stats update in real-time
- Charts visualize task distribution
- Exportable reports available

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-013: Task Priority Levels

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Task Management

### Test Steps
1. Create task with urgent deadline (today)
2. Create task with normal deadline (next week)
3. Create task with low deadline (next month)
4. View task list sorted by priority

### Expected Results
- System auto-assigns priority based on deadline:
  - High: deadline within 24 hours
  - Medium: deadline within 7 days
  - Low: deadline > 7 days
- Tasks sorted by priority by default
- Visual indicators (colors) show priority
- High priority tasks highlighted

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-014: Add Notes to Task

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Collaboration

### Test Steps
1. Employee opens assigned task
2. Clicks "Add Notes"
3. Enters notes: "Equipment checked, all functional"
4. Saves notes
5. Manager views task with notes

### Expected Results
- Notes field editable by employee
- Notes saved with timestamp and author
- Manager can view notes
- Notes appear in task history
- Multiple notes can be added
- Notes support basic formatting

### Actual Results
- [To be filled during testing]

### Status
- [ ] Pass
- [ ] Fail
- [ ] Blocked

---

## TC-UC4-015: Bulk Task Assignment

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Efficiency

### Test Steps
1. Manager clicks "Bulk Assign"
2. Selects multiple employees
3. Enters task details (same for all)
4. Assigns task to all selected

### Expected Results
- Multiple task instances created
- Each employee receives individual task
- Each receives notification
- All tasks appear in manager's list
- Confirmation shows count of tasks created

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
| Positive Tests | 11 | - | - | - | - |
| Negative Tests | 2 | - | - | - | - |
| UI/Reporting | 2 | - | - | - | - |
| **Total** | **15** | **-** | **-** | **-** | **-** |

---

## Notes
- Test notification delivery across channels (in-app, email, push)
- Verify task data persists across sessions
- Test with multiple managers assigning simultaneously
- Performance: Task list should load < 1 second with 100+ tasks
