@startuml FitHub Use Case Diagram

left to right direction

' Styling
skinparam actorStyle awesome
skinparam packageStyle rectangle
skinparam usecase {
    BackgroundColor LightBlue
    BorderColor DarkBlue
    ArrowColor Black
}

' Actors
actor "Member\n(Μέλος)" as member
actor "Trainer\n(Γυμναστής)" as trainer
actor "Receptionist\n(Γραμματέας)" as receptionist
actor "Manager\n(Διαχειριστής)" as manager
actor "Gym Owner\n(Ιδιοκτήτης)" as owner
actor "AI System" as ai <<system>>
actor "Payment Gateway" as payment <<system>>

' System Boundary
rectangle "FitHub Gym CRM System" {
    
    ' Use Case 1: Registration
    usecase "UC-1: Registration and\nActivation Guide\n(Εγγραφή και Οδηγός Ενεργοποίησης)" as UC1 #LightGreen
    usecase "Member Registration" as UC1a
    usecase "Trainer Registration" as UC1b
    usecase "Receptionist Registration" as UC1c
    
    ' Use Case 2: Book Class
    usecase "UC-2: Book Group Class\n(Κράτηση Μαθήματος)" as UC2 #LightGreen
    usecase "Join Waitlist" as UC2a
    usecase "Pay for Session" as UC2b
    
    ' Use Case 3: Create Training Program
    usecase "UC-3: Create Personal\nTraining Program\n(Δημιουργία Προσωπικού\nΣχεδίου Γυμναστικής)" as UC3 #LightGreen
    usecase "Group Program" as UC3a
    usecase "Personal Program" as UC3b
    
    ' Use Case 4: Assign Tasks
    usecase "UC-4: Assign Tasks\nto Employees\n(Ανάθεση Εργασιών\nστους Υπαλλήλους)" as UC4 #LightGreen
    usecase "Reassign Task" as UC4a
    
    ' Use Case 5: Manage Discounts
    usecase "UC-5: Manage Discounts\nand Offers\n(Διαχείριση Εκπτώσεων\nκαι Προσφορών)" as UC5 #LightGreen
    usecase "New Member Offer" as UC5a
    usecase "Group Registration Offer" as UC5b
    
    ' Use Case 6: Track Campaign Stats
    usecase "UC-6: Track Campaign\nStatistics\n(Παρακολούθηση Στατιστικών\nΚαμπάνιας)" as UC6 #LightGreen
    usecase "Real-time Tracking" as UC6a
    usecase "Compare Campaigns" as UC6b
    
    ' Use Case 7: Apply Discount Code
    usecase "UC-7: Apply Discount Code\n(Εφαρμογή Κωδικού Έκπτωσης)" as UC7 #LightGreen
    usecase "Invalid Code Error" as UC7a
    usecase "Expired Code Error" as UC7b
    
    ' Use Case 8: Track Client Progress
    usecase "UC-8: Track Client\nProgress\n(Παρακολούθηση Προόδου\nΠελάτη)" as UC8 #LightGreen
    usecase "Add Measurements" as UC8a
    usecase "System Error" as UC8b
    
    ' Use Case 9: Gym Evaluation
    usecase "UC-9: Submit Gym\nEvaluation\n(Αξιολόγηση Γυμναστηρίου)" as UC9 #LightGreen
    usecase "Review Rejected" as UC9a
    
    ' Use Case 10: Customer Support
    usecase "UC-10: Customer Support\nSystem\n(Σύστημα Υποστήριξης\nΠελατών)" as UC10 #LightGreen
    usecase "Escalate to Human" as UC10a
    usecase "AI System Error" as UC10b
}

' UC-1 Connections
member --> UC1
trainer --> UC1
receptionist --> UC1

UC1 .> UC1a : <<include>>
UC1 .> UC1b : <<include>>
UC1 .> UC1c : <<include>>

payment --> UC1a
payment --> UC1b

' UC-2 Connections
member --> UC2

UC2a .> UC2 : <<extend>>
UC2b .> UC2 : <<extend>>

payment --> UC2b
receptionist --> UC2
trainer --> UC2

' UC-3 Connections
trainer --> UC3

UC3a .> UC3 : <<extend>>
UC3b .> UC3 : <<extend>>

' UC-4 Connections
manager --> UC4

UC4a .> UC4 : <<extend>>

' UC-5 Connections
manager --> UC5

UC5a .> UC5 : <<extend>>
UC5b .> UC5 : <<extend>>

' UC-6 Connections
manager --> UC6

UC6a .> UC6 : <<extend>>
UC6b .> UC6 : <<extend>>

' UC-7 Connections
member --> UC7

UC7a .> UC7 : <<extend>>
UC7b .> UC7 : <<extend>>

payment --> UC7

' UC-8 Connections
trainer --> UC8

UC8 .> UC8a : <<include>>
UC8b .> UC8 : <<extend>>

' UC-9 Connections
member --> UC9

UC9a .> UC9 : <<extend>>

trainer --> UC9
manager --> UC9

' UC-10 Connections
member --> UC10

UC10 .> UC10a : <<include>>
UC10a .> UC10 : <<extend>>
UC10b .> UC10 : <<extend>>

ai --> UC10
receptionist --> UC10a

' Notes
note right of UC1
  <b>Basic Flow:</b>
  1. User selects role
  2. Fills registration form
  3. Email verification
  4. Payment processing
  5. Admin approval
  
  <b>Alternative Flows:</b>
  - Trainer: CV upload, interview
  - Receptionist: Pre-agreement
  - Rejection handling
end note

note right of UC2
  <b>Basic Flow:</b>
  1. View available classes
  2. Select class
  3. Check subscription
  4. Confirm booking
  5. Notify staff
  
  <b>Alternative Flows:</b>
  - Join waitlist (class full)
  - Pay for session (no subscription)
end note

note left of UC3
  <b>Basic Flow:</b>
  1. Trainer creates program
  2. Sets goals & difficulty
  3. Defines exercises
  4. Sets reps & sets
  
  <b>Alternative Flows:</b>
  - Group program
  - Personal program for client
end note

note left of UC4
  <b>Basic Flow:</b>
  1. Manager selects employee
  2. Creates task
  3. Sets deadline
  4. Employee notified
  5. Track completion
  
  <b>Alternative Flow:</b>
  - Reassign task
end note

note bottom of UC5
  <b>Basic Flow:</b>
  1. Create discount code
  2. Set percentage & expiry
  3. Define rules
  4. Notify members
  
  <b>Alternative Flows:</b>
  - New member offers
  - Group registration offers
  - Social media campaigns
end note

note bottom of UC6
  <b>Basic Flow:</b>
  1. Select campaign
  2. View statistics
  3. Analyze performance
  4. Download report
  
  <b>Alternative Flows:</b>
  - Real-time tracking
  - Compare campaigns
  - System error handling
end note

note right of UC7
  <b>Basic Flow:</b>
  1. Member enters code
  2. System validates
  3. Apply discount
  4. Update total
  5. Confirm payment
  
  <b>Alternative Flows:</b>
  - Invalid code error
  - Expired/cancelled code
end note

note right of UC8
  <b>Basic Flow:</b>
  1. Trainer selects client
  2. View history
  3. Add measurements (kg, cm)
  4. Update progress
  5. Set new goals
  6. Notify client
  
  <b>Alternative Flows:</b>
  - No history available
  - System error
end note

note right of UC9
  <b>Basic Flow:</b>
  1. Periodic prompt
  2. Select recent activity
  3. Rate experience (5 stars)
  4. Add comments
  5. Submit evaluation
  6. Notify trainer & admin
  
  <b>Alternative Flow:</b>
  - Review rejected (policy violation)
end note

note bottom of UC10
  <b>Basic Flow:</b>
  1. Select issue category
  2. Describe problem
  3. Create ticket
  4. AI chat response
  5. Close ticket
  
  <b>Alternative Flows:</b>
  - Escalate after 5 messages
  - AI system error
  - Human support takeover
end note

note bottom of ai
  Provides intelligent
  automated responses
  in real-time chat
end note

note bottom of payment
  External payment
  processing for
  subscriptions & sessions
end note

@enduml
