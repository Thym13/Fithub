# Test Cases - UC-5 to UC-10 (Version 1)

## Test Suite Information
- **Use Cases**: UC-5 Create Campaign, UC-6 Campaign Stats, UC-7 Apply Discount, UC-8 Client Progress, UC-9 Gym Evaluation, UC-10 Customer Support
- **Version**: 1.0
- **Date**: 2026-05-11
- **Test Environment**: React 18.3.1, TypeScript, Vite
- **Tested By**: QA Team

---

# UC-5: Create Campaign with Promo Code

## TC-UC5-001: Successfully Create Marketing Campaign

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- User logged in as Manager
- Manager navigates to `/manager#campaigns`

### Test Steps
1. Click "Create Campaign"
2. Fill campaign details:
   - Name: "Summer Fitness Boost"
   - Description: "Get fit for summer with 20% off"
   - Budget: "5000"
   - Start Date: Today
   - End Date: +30 days
3. Generate promo code:
   - Click "Generate Code"
   - Code generated: "SUMMER20"
   - Discount: 20%
   - Max Uses: 100
4. Select marketing channels:
   - Social Media (40%)
   - Email (30%)
   - SMS (30%)
5. Preview campaign
6. Click "Create Campaign"

### Expected Results
- Campaign created with `status: "Active"`
- PromoCode created linked to campaign
- Marketing channels assigned with budget percentages
- Promo code visible on member membership page
- Success modal: "Campaign created! Promo Code: SUMMER20"
- Campaign appears in campaigns list

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc5-campaign.puml lines 24-153_

---

## TC-UC5-002: Promo Code Generation - Duplicate Check

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Create campaign
2. Enter existing promo code: "EXISTING20"
3. Attempt to proceed

### Expected Results
- System checks: `findOne({code: "EXISTING20"})`
- Error: "Code already in use. Try another."
- Must generate or enter different code
- Cannot create campaign with duplicate code

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc5-campaign.puml lines 48-65_

---

## TC-UC5-003: Campaign Budget Validation

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Create campaign
2. Enter budget: "0" or negative value
3. Attempt to create

### Expected Results
- Validation error: "Budget must be greater than 0"
- Cannot proceed with invalid budget
- Helpful hint: "Minimum budget: €100"

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

---

## TC-UC5-004: Marketing Channel Budget Distribution

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Budget Management

### Test Steps
1. Create campaign with €5000 budget
2. Assign channels:
   - Social Media: 50%
   - Email: 30%
   - SMS: 20%
3. Verify calculations

### Expected Results
- Total percentages must equal 100%
- Channel budgets calculated:
  - Social: €2500
  - Email: €1500
  - SMS: €1000
- Real-time budget breakdown displayed
- Cannot save if percentages != 100%

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

---

## TC-UC5-005: Member Views Active Promo Codes

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Member Experience

### Preconditions
- Active campaign with promo code exists
- Member logged in

### Test Steps
1. Member navigates to `/member#membership`
2. Views "Active Promotions" section
3. Clicks on promo card

### Expected Results
- All active promo codes displayed with:
  - Code string
  - Discount percentage
  - Expiry date
  - Campaign name
- Codes sorted by expiry (soonest first)
- Click auto-fills code in payment form
- Expired codes not shown

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc5-campaign.puml lines 156-172_

---

# UC-6: Campaign Performance Tracking

## TC-UC6-001: View Campaign Statistics

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Analytics

### Preconditions
- Manager logged in
- Active campaign exists with data

### Test Steps
1. Navigate to campaigns dashboard
2. Click on campaign "Summer Fitness Boost"
3. View statistics panel

### Expected Results
- Campaign stats displayed:
  - Impressions: count
  - Clicks: count
  - Signups: count
  - Revenue: € amount
  - ROI: calculated percentage
- CTR calculated: (clicks/impressions) * 100
- Conversion rate: (signups/clicks) * 100
- Stats update in real-time
- Visual charts display metrics

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc6-campaign-stats.puml lines 24-48_

---

## TC-UC6-002: Filter Campaign Stats by Date Range

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Reporting

### Test Steps
1. View campaign stats
2. Select date range filter
3. Choose: Last 7 days
4. Observe updated metrics

### Expected Results
- Data filtered to selected range
- Charts update to show filtered period
- Metrics recalculated for period
- Can export filtered report
- Date range persists during session

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc6-campaign-stats.puml lines 50-72_

---

## TC-UC6-003: View Promo Code Performance

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Analytics

### Test Steps
1. View campaign details
2. Click "Promo Code Performance"
3. View detailed statistics

### Expected Results
- Promo code stats shown:
  - Current uses: count
  - Max uses: limit
  - Usage percentage
  - Revenue generated: € amount
- Usage chart displays trend over time
- List of members who used code
- Can export user list

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc6-campaign-stats.puml lines 74-88_

---

## TC-UC6-004: Export Campaign Report

**Priority**: Low  
**Type**: Functional - Positive  
**Category**: Reporting

### Test Steps
1. View campaign statistics
2. Click "Export Report"
3. Select format: PDF
4. Download report

### Expected Results
- Report generates with all metrics
- PDF includes:
  - Campaign summary
  - Performance charts
  - ROI analysis
  - Promo code details
- File downloads successfully
- Report branded with FitHub logo

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc6-campaign-stats.puml lines 90-106_

---

## TC-UC6-005: ROI Calculation Accuracy

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Business Logic

### Test Steps
1. Create campaign with budget: €5000
2. Record revenue: €8000
3. View ROI calculation

### Expected Results
- ROI calculated: ((8000 - 5000) / 5000) * 100 = 60%
- ROI displayed correctly in dashboard
- ROI updated in database
- Color coding: Green if positive, Red if negative
- ROI history tracked over time

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

---

# UC-7: Apply Discount Code

## TC-UC7-001: Successfully Apply Valid Promo Code

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- Member on membership purchase page
- Active promo code "SUMMER20" exists (20% discount)

### Test Steps
1. Select "Premium" membership (€49.99/month)
2. Click on promo card or enter code manually
3. Code auto-fills: "SUMMER20"
4. Click "Apply"
5. Proceed to payment

### Expected Results
- Code validated: status=Active, expiryDate > NOW()
- Discount calculated:
  - Original: €49.99
  - Discount: -€9.998 (20%)
  - Final: €39.99
- Breakdown displayed to user
- Payment processes with discounted amount
- PromoCode `currentUses` incremented
- Transaction records discount applied
- Success: "Subscription activated! You saved €9.99"

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc7-discount-code.puml lines 24-146_

---

## TC-UC7-002: Promo Code Validation - Invalid Code

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Enter non-existent code: "INVALID99"
2. Click "Apply"

### Expected Results
- System queries: `findOne({code: "INVALID99"})`
- Returns null
- Error: "The promo code does not exist"
- No discount applied
- User can try different code

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc7-discount-code.puml lines 67-73_

---

## TC-UC7-003: Promo Code Validation - Expired Code

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Enter expired code: "EXPIRED20"
2. Click "Apply"

### Expected Results
- Code found but expiryDate < NOW()
- Error: "This promo code has expired"
- No discount applied
- Code remains in database but inactive

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc7-discount-code.puml lines 80-86_

---

## TC-UC7-004: Promo Code Usage Limit

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Business Rules

### Test Steps
1. Apply code with maxUses=100, currentUses=100
2. Attempt to use code

### Expected Results
- Validation checks: currentUses >= maxUses
- Error: "This promo code has reached its usage limit"
- No discount applied
- Code automatically deactivated

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

---

## TC-UC7-005: Payment Confirmation Email with Discount

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Notifications

### Preconditions
- User successfully applies promo and completes payment

### Test Steps
1. Complete discounted purchase
2. Check email

### Expected Results
- Receipt email includes:
  - Original price
  - Discount amount and code used
  - Final price paid
  - Amount saved highlighted
  - Membership details
- Email sent within 2 minutes

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc7-discount-code.puml lines 128-138_

---

# UC-8: Client Progress Tracking

## TC-UC8-001: Trainer Views Client List

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Navigation

### Preconditions
- Trainer logged in
- Trainer has assigned clients

### Test Steps
1. Navigate to `/trainer#clients`
2. View client list
3. Verify client cards display

### Expected Results
- All assigned clients displayed
- Each card shows:
  - Client name and photo
  - Current program
  - Last measurement date
  - Progress summary
- Clients searchable and filterable
- Click opens client detail page

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc8-client-progress.puml lines 22-33_

---

## TC-UC8-002: Add Client Measurements

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Progress Tracking

### Test Steps
1. Trainer selects client "John Doe"
2. Navigate to client detail page
3. Click "Add Measurement"
4. Enter measurements:
   - Weight: 85kg
   - Body Fat: 22%
   - Muscle Mass: 60kg
   - Waist: 90cm
   - Chest: 105cm
5. Add trainer notes
6. Click "Submit"

### Expected Results
- Measurement record created with date
- Stats automatically calculated:
  - Weight change from previous
  - Body fat change
  - Progress percentage
- Comparison view shows changes
- Charts updated with new data point
- Client notification sent
- Success: "Measurement recorded successfully!"

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc8-client-progress.puml lines 70-136_

---

## TC-UC8-003: Measurement Validation - Invalid Values

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Add measurement with invalid values:
   - Weight: 0kg or 500kg
   - Body Fat: -5% or 150%
   - Muscle Mass: -10kg
2. Attempt to submit

### Expected Results
- Validation errors:
  - "Weight must be between 20-300kg"
  - "Body fat must be between 3-60%"
  - "Muscle mass must be positive"
- Cannot submit with invalid data
- Form highlights errors

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc8-client-progress.puml lines 86-96_

---

## TC-UC8-004: View Progress History

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Data Visualization

### Test Steps
1. Open client detail page
2. View "Progress History" tab
3. Observe measurement timeline

### Expected Results
- All measurements displayed chronologically
- Line charts show trends:
  - Weight over time
  - Body fat over time
  - Muscle mass over time
- Data table shows all measurements
- Can filter by date range
- Export data option available

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc8-client-progress.puml lines 45-68_

---

## TC-UC8-005: Set Client Goals

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Goal Management

### Test Steps
1. Open client profile
2. Click "Set Goals"
3. Enter targets:
   - Target Weight: 75kg
   - Target Body Fat: 15%
   - Target Muscle Mass: 65kg
   - Deadline: 3 months from now
4. Save goals

### Expected Results
- Goals saved to database
- Client notified of new goals
- Progress calculated vs goals
- Dashboard shows goal progress
- Goals visible to both trainer and client
- Success: "Goals updated successfully!"

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc8-client-progress.puml lines 137-174_

---

# UC-9: Gym Evaluation

## TC-UC9-001: Submit Class Evaluation

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- Member completed "Yoga" class
- Evaluation prompt triggered

### Test Steps
1. Member receives evaluation prompt
2. Selects completed class
3. Rates with 5 stars
4. Enters comments: "Excellent class! Great instructor."
5. (Optional) Adds suggestions
6. Clicks "Submit Review"

### Expected Results
- Evaluation validated (rating required)
- Content scanned for inappropriate language
- Review created with status: "Approved"
- Trainer notification sent
- Manager notification sent
- Trainer's average rating recalculated
- Success: "Thank you for your review!"

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc9-gym-evaluation.puml lines 24-112_

---

## TC-UC9-002: Review Rejected - Inappropriate Content

**Priority**: High  
**Type**: Functional - Negative  
**Category**: Content Moderation

### Test Steps
1. Submit review with profanity
2. Observe validation

### Expected Results
- Content scanned for:
  - Profanity
  - Personal information
  - Spam patterns
- Review rejected with status: "Rejected"
- Error: "Review contains inappropriate content"
- Review not published
- No notification sent to trainer

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc9-gym-evaluation.puml lines 80-86_

---

## TC-UC9-003: Trainer Views Reviews

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Feedback Management

### Test Steps
1. Trainer navigates to `/trainer#reviews`
2. Views review list
3. Check average rating

### Expected Results
- All reviews for trainer's classes shown
- Average rating displayed prominently
- Reviews sorted by date (newest first)
- Can filter by rating (1-5 stars)
- Can view review details
- Response option available

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc9-gym-evaluation.puml lines 125-142_

---

## TC-UC9-004: Manager Views All Reviews

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: Quality Management

### Test Steps
1. Manager navigates to `/manager#reviews`
2. Views all gym reviews
3. Filter and analyze

### Expected Results
- All approved reviews displayed
- Can filter by:
  - Trainer
  - Class
  - Rating
  - Date range
- Overall gym rating calculated
- Insights dashboard shows trends
- Export reviews option

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc9-gym-evaluation.puml lines 116-123_

---

## TC-UC9-005: Review Submission Without Rating

**Priority**: Medium  
**Type**: Functional - Negative  
**Category**: Validation

### Test Steps
1. Open evaluation form
2. Leave rating empty
3. Enter comments only
4. Attempt to submit

### Expected Results
- Validation error: "Please select a rating"
- Star rating field highlighted
- Cannot submit without rating
- Comments saved as draft

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

---

# UC-10: Customer Support

## TC-UC10-001: Create Support Ticket

**Priority**: High  
**Type**: Functional - Positive  
**Category**: End-to-End

### Preconditions
- Member logged in

### Test Steps
1. Click support icon/button
2. Select category: "Technical"
3. Enter title: "Cannot book class"
4. Enter description: "Getting error when trying to book yoga class"
5. Click "Submit Ticket"

### Expected Results
- Ticket created with:
  - Unique ticketId: "TKT-XXXXXX"
  - Status: "Open"
  - HandlerType: "AI" (initial)
- AI analyzes issue category
- Auto-response generated based on category
- Ticket appears in member's support history
- Success: "Ticket created. You'll receive a response soon."

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc10-customer-support.puml lines 24-78_

---

## TC-UC10-002: AI Chatbot Response

**Priority**: High  
**Type**: Functional - Positive  
**Category**: AI Integration

### Test Steps
1. Create ticket with technical issue
2. Wait for AI response
3. View automated reply

### Expected Results
- AI analyzes ticket content
- Generates contextual response
- Message added to ticket within 30 seconds
- Response includes:
  - Acknowledgment
  - Troubleshooting steps
  - Escalation option
- Message count incremented

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc10-customer-support.puml lines 52-70_

---

## TC-UC10-003: Escalate to Human Support

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Support Workflow

### Test Steps
1. Member replies to AI response
2. AI cannot resolve issue
3. Escalation option appears
4. Member clicks "Escalate to Human"
5. Ticket assigned to receptionist

### Expected Results
- Ticket updated:
  - HandlerType: "Human"
  - Status: "Escalated"
  - AssignedTo: receptionistId
- Receptionist receives notification
- Member notified of escalation
- Response time SLA applies
- Receptionist can view full chat history

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc10-customer-support.puml lines 80-108_

---

## TC-UC10-004: Resolve Support Ticket

**Priority**: High  
**Type**: Functional - Positive  
**Category**: Support Workflow

### Test Steps
1. Receptionist views ticket
2. Provides solution
3. Marks ticket as resolved
4. Member confirms resolution

### Expected Results
- Ticket updated:
  - Status: "Resolved"
  - ResolvedAt: DateTime.now()
- Resolution message sent to member
- Member asked to rate support (1-5)
- Satisfaction rating recorded
- Ticket moved to closed list
- Stats updated (avg resolution time)

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc10-customer-support.puml lines 110-134_

---

## TC-UC10-005: View Support Ticket History

**Priority**: Medium  
**Type**: Functional - Positive  
**Category**: User Experience

### Test Steps
1. Member navigates to support section
2. Views "My Tickets"
3. Opens closed ticket
4. Reviews conversation history

### Expected Results
- All tickets displayed (open and closed)
- Sorted by status then date
- Each ticket shows:
  - Ticket ID
  - Category
  - Status
  - Last updated
  - Unread message indicator
- Full conversation history preserved
- Can reopen closed tickets if needed

### Status
- [ ] Pass  
- [ ] Fail  
- [ ] Blocked

### Notes
_Reference: sequence-diagram-uc10-customer-support.puml lines 136-158_

---

## Test Coverage Summary - All Use Cases

| Use Case | Test Cases | Positive | Negative | Coverage % |
|----------|-----------|----------|----------|------------|
| UC-1 Registration | 15 | 4 | 9 | - |
| UC-2 Book Class | 15 | 7 | 5 | - |
| UC-3 Training Program | 15 | 9 | 4 | - |
| UC-4 Assign Tasks | 15 | 11 | 2 | - |
| UC-5 Campaign | 5 | 3 | 2 | - |
| UC-6 Campaign Stats | 5 | 4 | 0 | - |
| UC-7 Discount Code | 5 | 2 | 3 | - |
| UC-8 Client Progress | 5 | 4 | 1 | - |
| UC-9 Evaluation | 5 | 3 | 2 | - |
| UC-10 Support | 5 | 4 | 0 | - |
| **TOTAL** | **90** | **51** | **28** | **-** |

---

## General Testing Notes

### Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Benchmarks
- Page load: < 2 seconds
- API response: < 500ms
- Database queries: < 100ms
- Real-time notifications: < 2 seconds

### Security Testing
- SQL injection prevention
- XSS attack prevention
- CSRF token validation
- Password strength enforcement
- Session timeout: 30 minutes

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus indicators

### Data Integrity
- Transaction atomicity
- Referential integrity
- Cascade delete rules
- Audit trail logging
