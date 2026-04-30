# FitHub Domain Model - Class Descriptions

## User (Abstract Class)
The User class serves as the abstract base class for all user types in the FitHub system, establishing common attributes shared across different roles. It maintains essential user information including authentication credentials (email and password), contact details (first name, last name, phone), and account metadata such as account status, creation date, last login timestamp, and email verification status. This class enforces a consistent user identity structure across the system while allowing specialized user roles to inherit and extend its core functionality with role-specific attributes and behaviors.

## GymOwner
The GymOwner class represents the highest-level stakeholder in the FitHub system, responsible for overseeing one or more gym facilities. This class extends the User class with ownership-specific attributes including the number of gyms under their management and total revenue generated across all facilities. Gym owners have full access to the system and can monitor business performance, approve strategic decisions such as employment contracts and campaigns, and oversee all aspects of gym operations from staffing to financial performance.

## Manager
The Manager class represents administrative personnel responsible for day-to-day operations within specific departments of the gym. Managers inherit from the User class and add department assignment, access level privileges, and the count of employees under their supervision. They play a crucial role in intermediate-level decision-making including task assignment, campaign creation, reviewing trainer applications, creating employment contracts, and monitoring departmental performance metrics while bridging the gap between ownership and operational staff.

## Receptionist
The Receptionist class represents front-desk staff members who handle member interactions, check-ins, and customer support. This class extends User with shift scheduling information, working hours tracking, the number of check-ins processed, and application status for tracking their hiring process. Receptionists are responsible for member verification, handling escalated support tickets, managing check-in records, and serving as the first point of contact for members visiting the gym facility.

## Trainer
The Trainer class represents fitness professionals who provide personalized training services to gym members. This class extends User with comprehensive professional attributes including specialty areas, years of experience, average rating from client reviews, certifications, hourly rate, availability schedule, CV document reference, application status, application date, and current number of clients. Trainers are responsible for creating customized training programs, tracking client progress through measurements and notes, conducting personal training sessions, receiving reviews from members, and maintaining professional standards through ongoing certification.

## Member
The Member class represents individuals who have purchased memberships to use the gym facilities and services. Extending the User class, members have attributes related to their membership type, membership duration (member since and expiry dates), fitness goals, demographic information (age, gender), physical measurements (weight, height), activity level, medical history for safety considerations, and class preferences. Members can book classes, join waitlists, submit reviews, track their fitness progress, receive personalized training programs, purchase memberships with promotional codes, and engage with the customer support system.

## Membership
The Membership class defines the subscription plans available to gym members, encapsulating all terms and conditions of gym access. It includes a unique membership identifier, plan type, monthly cost, duration in months, start and expiry dates, current status, auto-renewal settings, and specific entitlements such as class booking limits, personal training sessions, spa access privileges, and applicable discount percentages. This class has a strong composition relationship with Member, ensuring every member has exactly one active membership that governs their access rights and billing cycles.

## Class
The Class class represents scheduled group fitness sessions offered by the gym, such as yoga, spinning, or aerobics. Each class has a unique identifier, name, category, description, scheduled day and time, duration in minutes, capacity limits, current enrollment count, assigned room, difficulty level, required equipment list, and operational status. Classes are led by trainers and can be booked by members, with overflow demand managed through waitlists when capacity is reached, making this a central entity for scheduling and member engagement.

## Booking
The Booking class manages member reservations for scheduled classes, tracking the complete lifecycle of a class attendance commitment. It records the booking identifier, booking date and time, current status (confirmed, cancelled, completed), creation timestamp, cancellation details (timestamp and reason), and booking type classification. Bookings create associations between members and classes, enabling the gym to manage class capacity, track attendance patterns, and ensure members can plan their workout schedules while respecting class size limitations.

## Waitlist
The Waitlist class handles the queue management system when classes reach full capacity, allowing members to register interest and receive automatic notifications when spots become available. It tracks a unique waitlist identifier, the member's position in queue, join timestamp, current status, notification flag indicating whether the member has been alerted about availability, and an expiry date after which the waitlist entry becomes invalid. This ensures fair access to popular classes and maximizes class utilization by filling cancellations promptly.

## TrainingProgram
The TrainingProgram class represents customized fitness plans created by trainers for individual members or groups. Each program includes a unique identifier, descriptive name, fitness goal, duration in weeks, difficulty level, weekly training frequency, start and end dates, current status, program type (personal or group), and detailed instructions. The program has a strong compositional relationship with exercises, meaning it owns and manages a collection of specific exercises that together form a coherent training plan tailored to the client's objectives and fitness level.

## Exercise
The Exercise class defines individual workout activities that comprise training programs, providing detailed specifications for each movement or activity. It includes an exercise identifier, name, category, description, targeted muscle groups, prescribed sets and repetitions, weight in kilograms, distance in kilometers (for cardio), duration in minutes, rest intervals in seconds, execution instructions, difficulty level, and required equipment. Exercises are the building blocks of training programs and can be reused across multiple programs, forming a comprehensive exercise library that trainers draw from when designing client workouts.

## ClientProgress
The ClientProgress class tracks the physical evolution of members over time through systematic body measurements and trainer assessments. It records a unique progress identifier, measurements including weight, body fat percentage, muscle mass, and circumferences of waist, chest, arms, and thighs, the measurement date, trainer notes with qualitative observations, and optional progress photos. This class enables trainers to monitor client transformations, adjust training programs based on measurable results, and provide data-driven motivation by visualizing improvements over time.

## Review
The Review class captures member feedback and satisfaction ratings for classes and trainers, supporting quality assurance and continuous improvement. Each review contains a unique identifier, numerical rating, detailed comments, improvement suggestions, submission date, approval status, potential rejection reason if the review violated policies, and review type classification (class or trainer review). Reviews undergo validation to filter inappropriate content before publication and contribute to trainer average ratings, helping other members make informed decisions about class selection and trainer choice.

## SupportTicket
The SupportTicket class manages the customer support system where members can report issues, ask questions, and receive assistance from AI or human staff. It includes a ticket identifier, issue category, title and description of the problem, current status, priority level, handler type (AI or human receptionist), timestamps for creation, assignment, and resolution, satisfaction rating provided after closure, and message count tracking conversation length. The ticketing system ensures member concerns are tracked, escalated when necessary, and resolved systematically while measuring support quality.

## Message
The Message class represents individual communications within support ticket conversations, creating a complete chat history between members and support staff. Each message has a unique identifier, sender identification, message content, timestamp, read status flag, and message type classification (member message, AI response, or human response). Messages are owned by their parent support ticket and form a chronological conversation thread that provides context for issue resolution and quality review of support interactions.

## Payment
The Payment class records all financial transactions processed through the FitHub system, maintaining comprehensive billing and receipt information. It stores a transaction identifier, payment amount, transaction type, payment method used, transaction date, processing status, receipt document reference, tax percentage, calculated tax amount, and total amount including taxes. Payments can be associated with membership purchases, promotional code discounts, or individual class bookings, creating an auditable financial record for both business analytics and member transaction history.

## Campaign
The Campaign class represents marketing initiatives designed to promote the gym and drive membership growth through promotional activities. Each campaign has a unique identifier, name, description, allocated budget, amount spent, start and end dates, current status, and performance metrics including impressions, clicks, signups generated, revenue attributed to the campaign, and calculated return on investment (ROI). Campaigns are managed by gym owners or managers and include promotional codes with specific discounts, utilizing various marketing channels to reach potential members.

## PromoCode
The PromoCode class defines discount codes distributed through marketing campaigns to incentivize membership purchases and renewals. It includes a unique promo identifier, the actual discount code string, discount percentage, validity period (start and expiry dates), maximum usage limit, current usage count, minimum purchase value requirement, and active status. Promo codes are exclusively owned by their parent campaigns and can be applied to memberships during payment, reducing the final price and tracking campaign effectiveness through redemption rates.

## MarketingChannel
The MarketingChannel class represents the various communication platforms and media used to distribute marketing campaigns, such as social media, email, or print advertising. Each channel has a unique identifier, name, channel type classification, allocated budget percentage of the total campaign budget, and active status flag. Multiple channels can be associated with a single campaign, allowing managers to execute multi-channel marketing strategies and analyze which channels provide the best return on investment for member acquisition.

## Task
The Task class manages work assignments delegated by managers to operational staff including trainers and receptionists. Each task contains a unique identifier, title and description, task type classification, deadline date, recurrence frequency for recurring tasks, current status, priority level, timestamps tracking creation, assignment, and completion, and additional notes for clarification. Tasks enable managers to distribute responsibilities, track completion rates, and ensure operational activities are performed on schedule, while employees receive notifications and can update task status as work progresses.

## Notification
The Notification class handles all system-generated alerts and messages sent to users across the platform, ensuring timely communication of important events. It includes a notification identifier, type classification, title and content text, priority level, read status flag, delivery channel (email, in-app, SMS), and timestamp. Notifications are sent to all user types for various triggers including task assignments, booking confirmations, contract responses, waitlist availability, progress updates, and campaign announcements, creating a comprehensive communication layer across the system.

## EmploymentContract
The EmploymentContract class formalizes the working relationship between the gym and its trainers, defining terms of employment and compensation. Each contract has a unique identifier, position title, monthly salary amount, working hours and days requirements, start and end dates for contract validity, list of services the trainer will provide, detailed terms and conditions, current contract status, date sent to the trainer, response date, and the trainer's response (accepted or rejected). Contracts are created by managers or gym owners during the trainer onboarding process and require trainer acceptance before employment begins.

## TrainerApplication
The TrainerApplication class manages the hiring pipeline for prospective trainers, capturing all information submitted during the application process. It includes an application identifier, submission date, current status (pending, approved, rejected), CV document URL, certification document URLs, years of experience, specialty areas, manager notes from the review process, and review date. Applications are strongly associated with document attachments and are reviewed by managers or receptionists who can approve qualified candidates and trigger the contract creation workflow.

## Document
The Document class provides a generic file management system for storing and referencing uploaded files throughout the platform. Each document has a unique identifier, document type classification (CV, certification, receipt, contract), original file name, file size in bytes, storage URL for retrieval, upload date, and document status. Documents are owned by specific entities like trainer applications, providing secure, organized file storage with metadata for tracking and validation purposes.

## CheckInRecord
The CheckInRecord class tracks member facility access by recording entry and exit timestamps at the gym reception. Each record contains a check-in identifier, check-in time, optional check-out time, visit purpose, and membership verification flag confirming that the member's subscription was valid at entry. These records are created by receptionists during member arrivals, supporting attendance analytics, facility utilization monitoring, access control enforcement, and behavioral insights about member engagement patterns.

## Schedule
The Schedule class manages the gym's operational calendar, defining when facilities are open and available for activities. It includes a schedule identifier, week and month indicators, year, and a map of operating hours for each day of the week. Classes are associated with schedules to ensure they are only offered during operational hours, supporting facility planning, resource allocation, and member expectations about when they can access gym services and attend scheduled classes.
