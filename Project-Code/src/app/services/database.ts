/**
 * Mock Database Service for FitHub
 * Simulates database operations using localStorage
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  role: 'member' | 'trainer' | 'secretary' | 'manager';
  accountStatus: 'Pending' | 'Active' | 'Suspended' | 'Rejected';
  emailVerified: boolean;
  emailVerificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  type: 'Basic' | 'Premium' | 'Elite';
  monthlyCost: number;
  status: 'Pending' | 'Active' | 'Expired' | 'Cancelled';
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod: 'Card' | 'Cash' | 'Bank Transfer';
  description: string;
  createdAt: string;
}

export interface FitnessGoal {
  id: string;
  userId: string;
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  currentWeight: number;
  targetWeight?: number;
  weeklyWorkouts: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  category: 'Yoga' | 'HIIT' | 'Pilates' | 'Cycling' | 'Strength' | 'Cardio' | 'CrossFit' | 'Boxing' | 'Dance' | 'Other';
  instructorId: string;
  instructorName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string; // Format: "HH:MM" (e.g., "09:00")
  duration: number; // Duration in minutes
  capacity: number; // Maximum number of participants
  enrolled: number; // Current number of enrolled participants
  waitlist: number; // Number of people on waitlist
  status: 'Active' | 'Cancelled' | 'Full';
  location?: string; // Room/Area in the gym
  createdAt: string;
  updatedAt: string;
}

export interface ClassBooking {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  bookedAt: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  goal: string;
  duration: number; // Duration in weeks
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  exercises: Exercise[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'Balance' | 'HIIT' | 'Other';
  sets?: number;
  reps?: string;
  duration?: string; // e.g., "30 minutes" or "5 minutes"
  intensity?: 'Low' | 'Medium' | 'High';
  instructions?: string;
  day: string; // e.g., "Monday", "Tuesday" or "Day 1", "Day 2"
  completed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'Administrative' | 'Maintenance' | 'Training' | 'Customer Service' | 'Marketing' | 'Other';
  assignedTo: string; // User ID
  assignedToName: string;
  assignedBy: string; // User ID
  assignedByName: string;
  deadline: string; // ISO date string
  priority: 'Low' | 'Medium' | 'High';
  frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedAt: string; // ISO date string
  completedAt?: string;
  isNew: boolean;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'Email' | 'SMS' | 'Push Notification' | 'In-App';
  targetAudience: 'All Members' | 'Premium Members' | 'Basic Members' | 'Inactive Members' | 'New Members' | 'Custom';
  customFilters?: {
    membershipType?: string[];
    minAge?: number;
    maxAge?: number;
    joinedAfter?: string;
    joinedBefore?: string;
  };
  subject: string;
  message: string;
  scheduledDate?: string; // ISO date string
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Cancelled';
  createdBy: string; // User ID
  createdByName: string;
  createdAt: string; // ISO date string
  sentAt?: string;
  analytics: {
    targetCount: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
  };
}

export interface DiscountCode {
  id: string;
  code: string; // The actual discount code (e.g., "WELCOME20", "SUMMER50")
  name: string; // Display name for the discount
  description: string;
  discountType: 'Percentage' | 'Fixed Amount'; // Percentage off or fixed amount off
  discountValue: number; // Percentage (e.g., 20 for 20%) or fixed amount (e.g., 10 for €10 off)
  applicableTo: 'All Memberships' | 'Premium Only' | 'Basic Only' | 'Specific Membership'; // What memberships can use this
  specificMembership?: string; // If applicableTo is 'Specific Membership', which one
  minPurchaseAmount?: number; // Minimum purchase amount required to use code
  maxDiscountAmount?: number; // Maximum discount amount (for percentage discounts)
  usageLimit?: number; // Total number of times this code can be used (null = unlimited)
  usageCount: number; // Current number of times this code has been used
  usagePerUser?: number; // Max number of times a single user can use this code
  validFrom: string; // ISO date string - when code becomes active
  validUntil: string; // ISO date string - when code expires
  status: 'Active' | 'Expired' | 'Disabled';
  createdBy: string; // User ID
  createdByName: string;
  createdAt: string; // ISO date string
  updatedAt: string;
}

export interface DiscountCodeUsage {
  id: string;
  discountCodeId: string;
  discountCode: string; // The code used
  userId: string;
  userName: string;
  membershipId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  usedAt: string; // ISO date string
}

export interface ClientProgress {
  id: string;
  clientId: string;
  clientName: string;
  trainerId: string;
  trainerName: string;
  date: string; // ISO date string
  weight?: number; // in kg
  bodyFat?: number; // percentage
  muscleMass?: number; // in kg
  measurements?: {
    chest?: number; // in cm
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  exercisePerformance?: {
    exerciseName: string;
    sets: number;
    reps: string; // e.g., "10-12" or "8"
    weight: number; // in kg
    difficulty: 'Easy' | 'Medium' | 'Hard';
    notes?: string;
  }[];
  goals?: string; // New goals set by trainer
  notes?: string; // Trainer's notes about this session
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  // Link to class or training program
  targetType: 'Class' | 'Training Program';
  targetId: string; // Class ID or Training Program ID
  targetName: string; // Class name or program name
  instructorId: string;
  instructorName: string;
  // Ratings (1-5 stars)
  instructorRating: number;
  facilityRating: number;
  overallRating: number;
  // Feedback
  comments?: string;
  suggestions?: string;
  // Moderation
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  moderatedBy?: string; // Admin/Manager who approved/rejected
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string; // User ID or 'ai' or 'secretary'
  senderName: string;
  senderType: 'member' | 'ai' | 'secretary';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // Human-readable ticket number (e.g., "TKT-001234")
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Technical Problem' | 'Subscription Info' | 'System Errors' | 'Billing' | 'Classes & Programs' | 'General Inquiry';
  subject: string;
  description: string;
  status: 'Open' | 'AI Responding' | 'Escalated' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string; // Secretary ID if escalated
  assignedToName?: string;
  messages: TicketMessage[];
  aiErrorOccurred?: boolean; // Flag for AI system errors
  closedBy?: string; // 'member' | 'ai' | 'secretary'
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  membershipType: 'Basic' | 'Premium' | 'Elite';
  checkInTime: string; // ISO timestamp
  checkOutTime?: string; // ISO timestamp (optional)
  duration?: number; // Duration in minutes (calculated on checkout)
  method: 'QR Code' | 'Manual' | 'Card Scan'; // Check-in method
  receptionistId?: string; // ID of receptionist who checked in manually
  receptionistName?: string;
  notes?: string; // Any notes about the check-in
  status: 'Active' | 'Completed'; // Active = still in gym, Completed = checked out
  createdAt: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  description: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  ingredients: string[];
  instructions?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Performance';
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  duration: number; // weeks
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  meals: { [day: string]: Meal[] }; // e.g., { "Monday": [meal1, meal2, ...] }
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionLog {
  id: string;
  userId: string;
  userName: string;
  mealPlanId?: string;
  date: string; // ISO date
  meals: {
    mealId?: string;
    name: string;
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  waterIntake: number; // ml
  notes?: string;
  createdAt: string;
}

export class MockDatabase {
  private static instance: MockDatabase;

  private USERS_KEY = 'fithub_users';
  private MEMBERSHIPS_KEY = 'fithub_memberships';
  private TRANSACTIONS_KEY = 'fithub_transactions';
  private GOALS_KEY = 'fithub_goals';
  private CLASSES_KEY = 'fithub_classes';
  private BOOKINGS_KEY = 'fithub_bookings';
  private PROGRAMS_KEY = 'fithub_programs';
  private TASKS_KEY = 'fithub_tasks';
  private CAMPAIGNS_KEY = 'fithub_campaigns';
  private DISCOUNT_CODES_KEY = 'fithub_discount_codes';
  private DISCOUNT_CODE_USAGE_KEY = 'fithub_discount_code_usage';
  private CLIENT_PROGRESS_KEY = 'fithub_client_progress';
  private REVIEWS_KEY = 'fithub_reviews';
  private SUPPORT_TICKETS_KEY = 'fithub_support_tickets';
  private CHECKINS_KEY = 'fithub_checkins';
  private MEAL_PLANS_KEY = 'fithub_meal_plans';
  private NUTRITION_LOGS_KEY = 'fithub_nutrition_logs';

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // User Operations

  getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  findUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getAllUsers();

    // Check for duplicate email
    if (this.findUserByEmail(userData.email)) {
      throw new Error('Email already registered. Please use a different email or login.');
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers(users);
    return users[index];
  }

  verifyEmail(token: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.emailVerificationToken === token);

    if (!user) return null;

    return this.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: undefined
    });
  }

  // Membership Operations

  getAllMemberships(): Membership[] {
    const memberships = localStorage.getItem(this.MEMBERSHIPS_KEY);
    return memberships ? JSON.parse(memberships) : [];
  }

  saveMemberships(memberships: Membership[]): void {
    localStorage.setItem(this.MEMBERSHIPS_KEY, JSON.stringify(memberships));
  }

  createMembership(membershipData: Omit<Membership, 'id' | 'createdAt'>): Membership {
    const memberships = this.getAllMemberships();

    const newMembership: Membership = {
      ...membershipData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    memberships.push(newMembership);
    this.saveMemberships(memberships);
    return newMembership;
  }

  getMembershipByUserId(userId: string): Membership | null {
    const memberships = this.getAllMemberships();
    return memberships.find(m => m.userId === userId) || null;
  }

  // Transaction Operations

  getAllTransactions(): Transaction[] {
    const transactions = localStorage.getItem(this.TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getAllTransactions();

    const newTransaction: Transaction = {
      ...transactionData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  // Fitness Goal Operations

  getAllGoals(): FitnessGoal[] {
    const goals = localStorage.getItem(this.GOALS_KEY);
    return goals ? JSON.parse(goals) : [];
  }

  saveGoals(goals: FitnessGoal[]): void {
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
  }

  createFitnessGoal(goalData: Omit<FitnessGoal, 'id' | 'createdAt'>): FitnessGoal {
    const goals = this.getAllGoals();

    const newGoal: FitnessGoal = {
      ...goalData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    goals.push(newGoal);
    this.saveGoals(goals);
    return newGoal;
  }

  // Class Operations

  getAllClasses(): Class[] {
    const classes = localStorage.getItem(this.CLASSES_KEY);
    return classes ? JSON.parse(classes) : [];
  }

  saveClasses(classes: Class[]): void {
    localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
  }

  findClassById(id: string): Class | null {
    const classes = this.getAllClasses();
    return classes.find(c => c.id === id) || null;
  }

  createClass(classData: Omit<Class, 'id' | 'enrolled' | 'waitlist' | 'createdAt' | 'updatedAt'>): Class {
    const classes = this.getAllClasses();

    const newClass: Class = {
      ...classData,
      id: this.generateId(),
      enrolled: 0,
      waitlist: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    classes.push(newClass);
    this.saveClasses(classes);
    return newClass;
  }

  updateClass(id: string, updates: Partial<Class>): Class | null {
    const classes = this.getAllClasses();
    const index = classes.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    classes[index] = {
      ...classes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveClasses(classes);
    return classes[index];
  }

  deleteClass(id: string): boolean {
    const classes = this.getAllClasses();
    const filteredClasses = classes.filter(c => c.id !== id);

    if (filteredClasses.length === classes.length) {
      return false; // Class not found
    }

    this.saveClasses(filteredClasses);
    return true;
  }

  // Class Booking Operations

  getAllBookings(): ClassBooking[] {
    const bookings = localStorage.getItem(this.BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  }

  saveBookings(bookings: ClassBooking[]): void {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  }

  getClassBookings(classId: string): ClassBooking[] {
    const bookings = this.getAllBookings();
    return bookings.filter(b => b.classId === classId && b.status !== 'Cancelled');
  }

  getUserBookings(userId: string): ClassBooking[] {
    const bookings = this.getAllBookings();
    return bookings.filter(b => b.userId === userId && b.status !== 'Cancelled');
  }

  createBooking(bookingData: Omit<ClassBooking, 'id' | 'bookedAt'>): ClassBooking {
    const bookings = this.getAllBookings();

    const newBooking: ClassBooking = {
      ...bookingData,
      id: this.generateId(),
      bookedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  }

  cancelBooking(id: string): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) {
      return false;
    }

    bookings[index].status = 'Cancelled';
    this.saveBookings(bookings);
    return true;
  }

  // Training Program Operations

  getAllPrograms(): TrainingProgram[] {
    const programs = localStorage.getItem(this.PROGRAMS_KEY);
    return programs ? JSON.parse(programs) : [];
  }

  savePrograms(programs: TrainingProgram[]): void {
    localStorage.setItem(this.PROGRAMS_KEY, JSON.stringify(programs));
  }

  findProgramById(id: string): TrainingProgram | null {
    const programs = this.getAllPrograms();
    return programs.find(p => p.id === id) || null;
  }

  getProgramsByTrainer(trainerId: string): TrainingProgram[] {
    const programs = this.getAllPrograms();
    return programs.filter(p => p.trainerId === trainerId);
  }

  getProgramsByClient(clientId: string): TrainingProgram[] {
    const programs = this.getAllPrograms();
    return programs.filter(p => p.clientId === clientId);
  }

  createProgram(programData: Omit<TrainingProgram, 'id' | 'createdAt' | 'updatedAt'>): TrainingProgram {
    const programs = this.getAllPrograms();

    const newProgram: TrainingProgram = {
      ...programData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    programs.push(newProgram);
    this.savePrograms(programs);
    return newProgram;
  }

  updateProgram(id: string, updates: Partial<TrainingProgram>): TrainingProgram | null {
    const programs = this.getAllPrograms();
    const index = programs.findIndex(p => p.id === id);

    if (index === -1) {
      return null;
    }

    programs[index] = {
      ...programs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.savePrograms(programs);
    return programs[index];
  }

  deleteProgram(id: string): boolean {
    const programs = this.getAllPrograms();
    const filteredPrograms = programs.filter(p => p.id !== id);

    if (filteredPrograms.length === programs.length) {
      return false;
    }

    this.savePrograms(filteredPrograms);
    return true;
  }

  // Task Operations

  getAllTasks(): Task[] {
    const tasks = localStorage.getItem(this.TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  createTask(taskData: Omit<Task, 'id' | 'assignedAt' | 'isNew'>): Task {
    const task: Task = {
      ...taskData,
      id: this.generateId(),
      assignedAt: new Date().toISOString(),
      isNew: true
    };

    const tasks = this.getAllTasks();
    tasks.push(task);
    this.saveTasks(tasks);

    return task;
  }

  getTaskById(id: string): Task | null {
    const tasks = this.getAllTasks();
    return tasks.find(t => t.id === id) || null;
  }

  getTasksByAssignee(userId: string): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter(t => t.assignedTo === userId);
  }

  getTasksByAssigner(userId: string): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter(t => t.assignedBy === userId);
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    tasks[index] = { ...tasks[index], ...updates };
    this.saveTasks(tasks);
    return tasks[index];
  }

  deleteTask(id: string): boolean {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);

    if (filteredTasks.length === tasks.length) {
      return false;
    }

    this.saveTasks(filteredTasks);
    return true;
  }

  // Campaign Operations

  getAllCampaigns(): Campaign[] {
    const campaigns = localStorage.getItem(this.CAMPAIGNS_KEY);
    return campaigns ? JSON.parse(campaigns) : [];
  }

  saveCampaigns(campaigns: Campaign[]): void {
    localStorage.setItem(this.CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }

  createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'analytics'>): Campaign {
    const campaign: Campaign = {
      ...campaignData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      analytics: {
        targetCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0
      }
    };

    const campaigns = this.getAllCampaigns();
    campaigns.push(campaign);
    this.saveCampaigns(campaigns);

    return campaign;
  }

  getCampaignById(id: string): Campaign | null {
    const campaigns = this.getAllCampaigns();
    return campaigns.find(c => c.id === id) || null;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const campaigns = this.getAllCampaigns();
    const index = campaigns.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    campaigns[index] = { ...campaigns[index], ...updates };
    this.saveCampaigns(campaigns);
    return campaigns[index];
  }

  deleteCampaign(id: string): boolean {
    const campaigns = this.getAllCampaigns();
    const filteredCampaigns = campaigns.filter(c => c.id !== id);

    if (filteredCampaigns.length === campaigns.length) {
      return false;
    }

    this.saveCampaigns(filteredCampaigns);
    return true;
  }

  // Get members based on target audience
  getTargetMembers(campaign: Campaign): User[] {
    const allUsers = this.getAllUsers();
    const members = allUsers.filter(u => u.role === 'member');

    if (campaign.targetAudience === 'All Members') {
      return members;
    }

    const memberships = this.getAllMemberships();

    return members.filter(member => {
      const membership = memberships.find(m => m.userId === member.id);

      if (campaign.targetAudience === 'Premium Members') {
        return membership?.subscriptionType === 'Premium';
      }
      if (campaign.targetAudience === 'Basic Members') {
        return membership?.subscriptionType === 'Basic';
      }
      if (campaign.targetAudience === 'Inactive Members') {
        // Members who haven't logged in recently (simplified logic)
        return member.accountStatus === 'Active';
      }
      if (campaign.targetAudience === 'New Members') {
        // Members who joined in the last 30 days
        const joinDate = new Date(member.createdAt || Date.now());
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate > thirtyDaysAgo;
      }

      return true;
    });
  }

  // Discount Code Operations

  getAllDiscountCodes(): DiscountCode[] {
    const codes = localStorage.getItem(this.DISCOUNT_CODES_KEY);
    return codes ? JSON.parse(codes) : [];
  }

  saveDiscountCodes(codes: DiscountCode[]): void {
    localStorage.setItem(this.DISCOUNT_CODES_KEY, JSON.stringify(codes));
  }

  createDiscountCode(codeData: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): DiscountCode {
    const code: DiscountCode = {
      ...codeData,
      id: this.generateId(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const codes = this.getAllDiscountCodes();
    codes.push(code);
    this.saveDiscountCodes(codes);

    return code;
  }

  getDiscountCodeById(id: string): DiscountCode | null {
    const codes = this.getAllDiscountCodes();
    return codes.find(c => c.id === id) || null;
  }

  getDiscountCodeByCode(code: string): DiscountCode | null {
    const codes = this.getAllDiscountCodes();
    return codes.find(c => c.code.toUpperCase() === code.toUpperCase()) || null;
  }

  updateDiscountCode(id: string, updates: Partial<DiscountCode>): DiscountCode | null {
    const codes = this.getAllDiscountCodes();
    const index = codes.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    codes[index] = {
      ...codes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDiscountCodes(codes);
    return codes[index];
  }

  deleteDiscountCode(id: string): boolean {
    const codes = this.getAllDiscountCodes();
    const filteredCodes = codes.filter(c => c.id !== id);

    if (filteredCodes.length === codes.length) {
      return false;
    }

    this.saveDiscountCodes(filteredCodes);
    return true;
  }

  // Validate discount code
  validateDiscountCode(code: string, userId: string, membershipType: string, amount: number): {
    valid: boolean;
    message: string;
    discountCode?: DiscountCode;
  } {
    const discountCode = this.getDiscountCodeByCode(code);

    if (!discountCode) {
      return { valid: false, message: 'Invalid discount code' };
    }

    // Check if code is disabled
    if (discountCode.status === 'Disabled') {
      return { valid: false, message: 'This discount code has been disabled' };
    }

    // Check if code is expired
    const now = new Date();
    const validFrom = new Date(discountCode.validFrom);
    const validUntil = new Date(discountCode.validUntil);

    if (now < validFrom) {
      return { valid: false, message: 'This discount code is not yet active' };
    }

    if (now > validUntil) {
      return { valid: false, message: 'This discount code has expired' };
    }

    // Check usage limit
    if (discountCode.usageLimit && discountCode.usageCount >= discountCode.usageLimit) {
      return { valid: false, message: 'This discount code has reached its usage limit' };
    }

    // Check per-user usage limit
    if (discountCode.usagePerUser) {
      const usages = this.getDiscountCodeUsagesByUser(userId, discountCode.id);
      if (usages.length >= discountCode.usagePerUser) {
        return { valid: false, message: 'You have already used this discount code the maximum number of times' };
      }
    }

    // Check minimum purchase amount
    if (discountCode.minPurchaseAmount && amount < discountCode.minPurchaseAmount) {
      return {
        valid: false,
        message: `Minimum purchase amount of €${discountCode.minPurchaseAmount} required`
      };
    }

    // Check if applicable to membership type
    if (discountCode.applicableTo !== 'All Memberships') {
      if (discountCode.applicableTo === 'Premium Only' && membershipType !== 'Premium') {
        return { valid: false, message: 'This code is only valid for Premium memberships' };
      }
      if (discountCode.applicableTo === 'Basic Only' && membershipType !== 'Basic') {
        return { valid: false, message: 'This code is only valid for Basic memberships' };
      }
      if (discountCode.applicableTo === 'Specific Membership' && membershipType !== discountCode.specificMembership) {
        return { valid: false, message: `This code is only valid for ${discountCode.specificMembership} memberships` };
      }
    }

    return { valid: true, message: 'Valid code', discountCode };
  }

  // Calculate discount amount
  calculateDiscount(discountCode: DiscountCode, amount: number): {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  } {
    let discountAmount = 0;

    if (discountCode.discountType === 'Percentage') {
      discountAmount = (amount * discountCode.discountValue) / 100;

      // Apply maximum discount cap if specified
      if (discountCode.maxDiscountAmount && discountAmount > discountCode.maxDiscountAmount) {
        discountAmount = discountCode.maxDiscountAmount;
      }
    } else {
      // Fixed Amount
      discountAmount = discountCode.discountValue;

      // Can't discount more than the original amount
      if (discountAmount > amount) {
        discountAmount = amount;
      }
    }

    const finalAmount = amount - discountAmount;

    return {
      originalAmount: amount,
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
      finalAmount: Math.round(finalAmount * 100) / 100
    };
  }

  // Discount Code Usage Operations

  getAllDiscountCodeUsages(): DiscountCodeUsage[] {
    const usages = localStorage.getItem(this.DISCOUNT_CODE_USAGE_KEY);
    return usages ? JSON.parse(usages) : [];
  }

  saveDiscountCodeUsages(usages: DiscountCodeUsage[]): void {
    localStorage.setItem(this.DISCOUNT_CODE_USAGE_KEY, JSON.stringify(usages));
  }

  createDiscountCodeUsage(usageData: Omit<DiscountCodeUsage, 'id' | 'usedAt'>): DiscountCodeUsage {
    const usage: DiscountCodeUsage = {
      ...usageData,
      id: this.generateId(),
      usedAt: new Date().toISOString()
    };

    const usages = this.getAllDiscountCodeUsages();
    usages.push(usage);
    this.saveDiscountCodeUsages(usages);

    // Increment usage count on discount code
    const discountCode = this.getDiscountCodeById(usageData.discountCodeId);
    if (discountCode) {
      this.updateDiscountCode(discountCode.id, {
        usageCount: discountCode.usageCount + 1
      });
    }

    return usage;
  }

  getDiscountCodeUsagesByUser(userId: string, discountCodeId?: string): DiscountCodeUsage[] {
    const usages = this.getAllDiscountCodeUsages();
    if (discountCodeId) {
      return usages.filter(u => u.userId === userId && u.discountCodeId === discountCodeId);
    }
    return usages.filter(u => u.userId === userId);
  }

  getDiscountCodeUsagesByCode(discountCodeId: string): DiscountCodeUsage[] {
    const usages = this.getAllDiscountCodeUsages();
    return usages.filter(u => u.discountCodeId === discountCodeId);
  }

  // Client Progress Operations

  getAllClientProgress(): ClientProgress[] {
    const progress = localStorage.getItem(this.CLIENT_PROGRESS_KEY);
    return progress ? JSON.parse(progress) : [];
  }

  saveClientProgress(progress: ClientProgress[]): void {
    localStorage.setItem(this.CLIENT_PROGRESS_KEY, JSON.stringify(progress));
  }

  createClientProgress(progressData: Omit<ClientProgress, 'id' | 'createdAt' | 'updatedAt'>): ClientProgress {
    const progress: ClientProgress = {
      ...progressData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allProgress = this.getAllClientProgress();
    allProgress.push(progress);
    this.saveClientProgress(allProgress);

    return progress;
  }

  getClientProgressById(id: string): ClientProgress | null {
    const allProgress = this.getAllClientProgress();
    return allProgress.find(p => p.id === id) || null;
  }

  getClientProgressByClient(clientId: string): ClientProgress[] {
    const allProgress = this.getAllClientProgress();
    return allProgress.filter(p => p.clientId === clientId).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getClientProgressByTrainer(trainerId: string): ClientProgress[] {
    const allProgress = this.getAllClientProgress();
    return allProgress.filter(p => p.trainerId === trainerId).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  updateClientProgress(id: string, updates: Partial<ClientProgress>): ClientProgress | null {
    const allProgress = this.getAllClientProgress();
    const index = allProgress.findIndex(p => p.id === id);

    if (index === -1) {
      return null;
    }

    allProgress[index] = {
      ...allProgress[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveClientProgress(allProgress);
    return allProgress[index];
  }

  deleteClientProgress(id: string): boolean {
    const allProgress = this.getAllClientProgress();
    const filteredProgress = allProgress.filter(p => p.id !== id);

    if (filteredProgress.length === allProgress.length) {
      return false;
    }

    this.saveClientProgress(filteredProgress);
    return true;
  }

  // Get clients for a trainer (members who have programs assigned by this trainer)
  getTrainerClients(trainerId: string): User[] {
    const programs = this.getProgramsByTrainer(trainerId);
    const clientIds = [...new Set(programs.map(p => p.clientId))]; // Unique client IDs

    const allUsers = this.getAllUsers();
    return allUsers.filter(u => clientIds.includes(u.id));
  }

  // ============ REVIEW METHODS ============

  getAllReviews(): Review[] {
    const data = localStorage.getItem(this.REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveReviews(reviews: Review[]): void {
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Review {
    const reviews = this.getAllReviews();
    const newReview: Review = {
      ...reviewData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    this.saveReviews(reviews);

    // Send notification to instructor
    this.sendEmail({
      to: `${reviewData.instructorName.toLowerCase().replace(' ', '.')}@fithub.gr`,
      subject: 'New Review Received',
      body: `Hi ${reviewData.instructorName},\n\nYou have received a new review for "${reviewData.targetName}".\n\nOverall Rating: ${reviewData.overallRating}/5 stars\nInstructor Rating: ${reviewData.instructorRating}/5 stars\n${reviewData.comments ? `\nComments: ${reviewData.comments}` : ''}\n\nThe review is pending moderation.\n\nBest regards,\nFitHub Team`
    });

    // Send notification to manager
    this.sendEmail({
      to: 'manager@fithub.gr',
      subject: 'New Review Pending Moderation',
      body: `A new review has been submitted and requires moderation.\n\nReviewer: ${reviewData.userName}\nTarget: ${reviewData.targetName} (${reviewData.targetType})\nInstructor: ${reviewData.instructorName}\nOverall Rating: ${reviewData.overallRating}/5 stars\n${reviewData.comments ? `\nComments: ${reviewData.comments}` : ''}\n\nPlease review and approve/reject accordingly.\n\nBest regards,\nFitHub System`
    });

    return newReview;
  }

  getReviewById(id: string): Review | null {
    const reviews = this.getAllReviews();
    return reviews.find(r => r.id === id) || null;
  }

  getReviewsByUser(userId: string): Review[] {
    const reviews = this.getAllReviews();
    return reviews.filter(r => r.userId === userId);
  }

  getReviewsByTarget(targetType: 'Class' | 'Training Program', targetId: string): Review[] {
    const reviews = this.getAllReviews();
    return reviews.filter(r => r.targetType === targetType && r.targetId === targetId && r.status === 'Approved');
  }

  getReviewsByInstructor(instructorId: string): Review[] {
    const reviews = this.getAllReviews();
    return reviews.filter(r => r.instructorId === instructorId);
  }

  getReviewsByStatus(status: 'Pending' | 'Approved' | 'Rejected'): Review[] {
    const reviews = this.getAllReviews();
    return reviews.filter(r => r.status === status);
  }

  updateReview(id: string, updates: Partial<Review>): Review | null {
    const reviews = this.getAllReviews();
    const index = reviews.findIndex(r => r.id === id);

    if (index === -1) {
      return null;
    }

    reviews[index] = {
      ...reviews[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveReviews(reviews);
    return reviews[index];
  }

  approveReview(id: string, moderatorName: string): Review | null {
    const review = this.getReviewById(id);
    if (!review) return null;

    const updatedReview = this.updateReview(id, {
      status: 'Approved',
      moderatedBy: moderatorName,
      moderatedAt: new Date().toISOString(),
    });

    if (updatedReview) {
      // Notify the user
      this.sendEmail({
        to: updatedReview.userEmail,
        subject: 'Your Review Has Been Approved',
        body: `Hi ${updatedReview.userName},\n\nYour review for "${updatedReview.targetName}" has been approved and is now visible to other members.\n\nThank you for your feedback!\n\nBest regards,\nFitHub Team`
      });
    }

    return updatedReview;
  }

  rejectReview(id: string, moderatorName: string, reason: string): Review | null {
    const review = this.getReviewById(id);
    if (!review) return null;

    const updatedReview = this.updateReview(id, {
      status: 'Rejected',
      moderatedBy: moderatorName,
      moderatedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    if (updatedReview) {
      // Notify the user
      this.sendEmail({
        to: updatedReview.userEmail,
        subject: 'Your Review Was Not Approved',
        body: `Hi ${updatedReview.userName},\n\nYour review for "${updatedReview.targetName}" was not approved due to the following reason:\n\n${reason}\n\nIf you have questions, please contact our support team.\n\nBest regards,\nFitHub Team`
      });
    }

    return updatedReview;
  }

  deleteReview(id: string): boolean {
    const reviews = this.getAllReviews();
    const filteredReviews = reviews.filter(r => r.id !== id);

    if (filteredReviews.length === reviews.length) {
      return false;
    }

    this.saveReviews(filteredReviews);
    return true;
  }

  // Get average rating for a target (class or training program)
  getAverageRating(targetType: 'Class' | 'Training Program', targetId: string): { overall: number; instructor: number; facility: number; count: number } {
    const reviews = this.getReviewsByTarget(targetType, targetId);

    if (reviews.length === 0) {
      return { overall: 0, instructor: 0, facility: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, r) => ({
      overall: acc.overall + r.overallRating,
      instructor: acc.instructor + r.instructorRating,
      facility: acc.facility + r.facilityRating,
    }), { overall: 0, instructor: 0, facility: 0 });

    return {
      overall: parseFloat((sum.overall / reviews.length).toFixed(1)),
      instructor: parseFloat((sum.instructor / reviews.length).toFixed(1)),
      facility: parseFloat((sum.facility / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  }

  // ============ SUPPORT TICKET METHODS ============

  getAllSupportTickets(): SupportTicket[] {
    const data = localStorage.getItem(this.SUPPORT_TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveSupportTickets(tickets: SupportTicket[]): void {
    localStorage.setItem(this.SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
  }

  generateTicketNumber(): string {
    const tickets = this.getAllSupportTickets();
    const ticketCount = tickets.length + 1;
    return `TKT-${ticketCount.toString().padStart(6, '0')}`;
  }

  createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'messages' | 'status' | 'createdAt' | 'updatedAt'>): SupportTicket {
    const tickets = this.getAllSupportTickets();
    const newTicket: SupportTicket = {
      ...ticketData,
      id: this.generateId(),
      ticketNumber: this.generateTicketNumber(),
      messages: [],
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tickets.push(newTicket);
    this.saveSupportTickets(tickets);

    return newTicket;
  }

  getSupportTicketById(id: string): SupportTicket | null {
    const tickets = this.getAllSupportTickets();
    return tickets.find(t => t.id === id) || null;
  }

  getSupportTicketsByUser(userId: string): SupportTicket[] {
    const tickets = this.getAllSupportTickets();
    return tickets.filter(t => t.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getSupportTicketsByStatus(status: 'Open' | 'AI Responding' | 'Escalated' | 'Closed'): SupportTicket[] {
    const tickets = this.getAllSupportTickets();
    return tickets.filter(t => t.status === status).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getSupportTicketsBySecretary(secretaryId: string): SupportTicket[] {
    const tickets = this.getAllSupportTickets();
    return tickets.filter(t => t.assignedTo === secretaryId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateSupportTicket(id: string, updates: Partial<SupportTicket>): SupportTicket | null {
    const tickets = this.getAllSupportTickets();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveSupportTickets(tickets);
    return tickets[index];
  }

  addMessageToTicket(ticketId: string, message: Omit<TicketMessage, 'id' | 'ticketId' | 'timestamp'>): TicketMessage | null {
    const ticket = this.getSupportTicketById(ticketId);
    if (!ticket) return null;

    const newMessage: TicketMessage = {
      ...message,
      id: this.generateId(),
      ticketId: ticketId,
      timestamp: new Date().toISOString(),
    };

    ticket.messages.push(newMessage);

    // Update ticket status based on message sender
    if (message.senderType === 'ai') {
      ticket.status = 'AI Responding';
    } else if (message.senderType === 'secretary') {
      ticket.status = 'Escalated';
    }

    this.updateSupportTicket(ticketId, {
      messages: ticket.messages,
      status: ticket.status,
    });

    return newMessage;
  }

  escalateTicketToSecretary(ticketId: string, secretaryId: string, secretaryName: string): SupportTicket | null {
    const ticket = this.getSupportTicketById(ticketId);
    if (!ticket) return null;

    const updatedTicket = this.updateSupportTicket(ticketId, {
      status: 'Escalated',
      assignedTo: secretaryId,
      assignedToName: secretaryName,
    });

    if (updatedTicket) {
      // Notify secretary
      const secretary = this.findUserById(secretaryId);
      if (secretary) {
        this.sendEmail({
          to: secretary.email,
          subject: `New Support Ticket Escalated: ${ticket.ticketNumber}`,
          body: `Hi ${secretaryName},\n\nA support ticket has been escalated to you for assistance.\n\nTicket #: ${ticket.ticketNumber}\nCategory: ${ticket.category}\nSubject: ${ticket.subject}\nMember: ${ticket.userName}\n\nPlease respond to the member through the support system.\n\nBest regards,\nFitHub System`
        });
      }
    }

    return updatedTicket;
  }

  closeTicket(ticketId: string, closedBy: 'member' | 'ai' | 'secretary'): SupportTicket | null {
    return this.updateSupportTicket(ticketId, {
      status: 'Closed',
      closedBy,
      closedAt: new Date().toISOString(),
    });
  }

  // Simulate AI response (mock AI)
  generateAIResponse(userMessage: string, category: string): string {
    const responses: { [key: string]: string[] } = {
      'Technical Problem': [
        "I understand you're experiencing a technical issue. Can you please provide more details about the error message you're seeing?",
        "Let me help you with that technical problem. Have you tried refreshing the page or logging out and back in?",
        "For technical issues, I recommend clearing your browser cache and cookies. Would you like step-by-step instructions?",
      ],
      'Subscription Info': [
        "I'd be happy to help you with subscription information. Our gym offers Basic (€49/month), Premium (€79/month), and Elite (€99/month) memberships.",
        "Regarding subscriptions, you can upgrade or downgrade your plan at any time from your Membership page. What specific information do you need?",
        "Your current subscription details are available in your dashboard under the Membership tab. Is there something specific you'd like to know?",
      ],
      'System Errors': [
        "I'm sorry you're encountering a system error. Let me look into this for you. What were you trying to do when the error occurred?",
        "System errors can sometimes be resolved by logging out and logging back in. Have you tried that yet?",
        "I apologize for the inconvenience. Can you describe the error message you received? This will help me assist you better.",
      ],
      'Billing': [
        "I can help you with billing questions. What would you like to know about your payments or invoices?",
        "For billing inquiries, you can view all your transactions in the Membership section. Is there a specific charge you'd like to discuss?",
        "Regarding billing, all payments are processed securely. What billing information do you need help with?",
      ],
      'Classes & Programs': [
        "I'd be happy to help with information about our classes and training programs. What would you like to know?",
        "You can browse all available classes in the Book Classes section. Are you looking for a specific type of class?",
        "Our trainers offer personalized training programs. Would you like information about how to get started?",
      ],
      'General Inquiry': [
        "Thank you for contacting FitHub support! How can I assist you today?",
        "I'm here to help! What question do you have about our gym services?",
        "Hello! I'm the FitHub AI assistant. What can I help you with?",
      ]
    };

    const categoryResponses = responses[category] || responses['General Inquiry'];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);

    // Simulate occasional AI error (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('AI System Error');
    }

    return categoryResponses[randomIndex];
  }

  deleteSupportTicket(id: string): boolean {
    const tickets = this.getAllSupportTickets();
    const filteredTickets = tickets.filter(t => t.id !== id);

    if (filteredTickets.length === tickets.length) {
      return false;
    }

    this.saveSupportTickets(filteredTickets);
    return true;
  }

  // Check-In Operations

  private saveCheckIns(checkIns: CheckIn[]): void {
    localStorage.setItem(this.CHECKINS_KEY, JSON.stringify(checkIns));
  }

  getAllCheckIns(): CheckIn[] {
    const checkIns = localStorage.getItem(this.CHECKINS_KEY);
    return checkIns ? JSON.parse(checkIns) : [];
  }

  getCheckInById(id: string): CheckIn | null {
    const checkIns = this.getAllCheckIns();
    return checkIns.find(c => c.id === id) || null;
  }

  getCheckInsByUser(userId: string): CheckIn[] {
    const checkIns = this.getAllCheckIns();
    return checkIns.filter(c => c.userId === userId);
  }

  getCheckInsByStatus(status: 'Active' | 'Completed'): CheckIn[] {
    const checkIns = this.getAllCheckIns();
    return checkIns.filter(c => c.status === status);
  }

  getCheckInsByDateRange(startDate: string, endDate: string): CheckIn[] {
    const checkIns = this.getAllCheckIns();
    return checkIns.filter(c => {
      const checkInDate = new Date(c.checkInTime);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return checkInDate >= start && checkInDate <= end;
    });
  }

  getTodaysCheckIns(): CheckIn[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getCheckInsByDateRange(today.toISOString(), tomorrow.toISOString());
  }

  getActiveCheckIns(): CheckIn[] {
    return this.getCheckInsByStatus('Active');
  }

  createCheckIn(data: {
    userId: string;
    method: 'QR Code' | 'Manual' | 'Card Scan';
    receptionistId?: string;
    receptionistName?: string;
    notes?: string;
  }): CheckIn {
    const user = this.findUserById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const membership = this.getMembershipByUserId(data.userId);
    if (!membership || membership.status !== 'Active') {
      throw new Error('No active membership found');
    }

    // Check if user has an active check-in
    const activeCheckIns = this.getActiveCheckIns();
    const existingCheckIn = activeCheckIns.find(c => c.userId === data.userId);
    if (existingCheckIn) {
      throw new Error('User already checked in. Please check out first.');
    }

    const checkIn: CheckIn = {
      id: this.generateId(),
      userId: data.userId,
      userName: user.name,
      userEmail: user.email,
      membershipType: membership.type,
      checkInTime: new Date().toISOString(),
      method: data.method,
      receptionistId: data.receptionistId,
      receptionistName: data.receptionistName,
      notes: data.notes,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const checkIns = this.getAllCheckIns();
    checkIns.push(checkIn);
    this.saveCheckIns(checkIns);

    return checkIn;
  }

  checkOutMember(checkInId: string): CheckIn | null {
    const checkIns = this.getAllCheckIns();
    const checkIn = checkIns.find(c => c.id === checkInId);

    if (!checkIn) {
      return null;
    }

    if (checkIn.status === 'Completed') {
      throw new Error('Member already checked out');
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(checkIn.checkInTime);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    checkIn.checkOutTime = checkOutTime.toISOString();
    checkIn.duration = durationMinutes;
    checkIn.status = 'Completed';

    this.saveCheckIns(checkIns);
    return checkIn;
  }

  checkOutMemberByUserId(userId: string): CheckIn | null {
    const activeCheckIns = this.getActiveCheckIns();
    const checkIn = activeCheckIns.find(c => c.userId === userId);

    if (!checkIn) {
      return null;
    }

    return this.checkOutMember(checkIn.id);
  }

  updateCheckInNotes(checkInId: string, notes: string): CheckIn | null {
    const checkIns = this.getAllCheckIns();
    const checkIn = checkIns.find(c => c.id === checkInId);

    if (!checkIn) {
      return null;
    }

    checkIn.notes = notes;
    this.saveCheckIns(checkIns);
    return checkIn;
  }

  deleteCheckIn(id: string): boolean {
    const checkIns = this.getAllCheckIns();
    const filteredCheckIns = checkIns.filter(c => c.id !== id);

    if (filteredCheckIns.length === checkIns.length) {
      return false;
    }

    this.saveCheckIns(filteredCheckIns);
    return true;
  }

  // Check-In Analytics

  getCheckInStats(startDate?: string, endDate?: string): {
    total: number;
    active: number;
    completed: number;
    averageDuration: number;
    byMembershipType: { [key: string]: number };
    byMethod: { [key: string]: number };
    byHour: { [key: string]: number };
    byDay: { [key: string]: number };
    peakHour: string;
    peakDay: string;
  } {
    let checkIns = this.getAllCheckIns();

    if (startDate && endDate) {
      checkIns = this.getCheckInsByDateRange(startDate, endDate);
    }

    const total = checkIns.length;
    const active = checkIns.filter(c => c.status === 'Active').length;
    const completed = checkIns.filter(c => c.status === 'Completed').length;

    const completedCheckIns = checkIns.filter(c => c.duration);
    const totalDuration = completedCheckIns.reduce((sum, c) => sum + (c.duration || 0), 0);
    const averageDuration = completedCheckIns.length > 0 ? Math.floor(totalDuration / completedCheckIns.length) : 0;

    const byMembershipType: { [key: string]: number } = {};
    const byMethod: { [key: string]: number } = {};
    const byHour: { [key: string]: number } = {};
    const byDay: { [key: string]: number } = {};

    checkIns.forEach(c => {
      // By membership type
      byMembershipType[c.membershipType] = (byMembershipType[c.membershipType] || 0) + 1;

      // By method
      byMethod[c.method] = (byMethod[c.method] || 0) + 1;

      // By hour
      const hour = new Date(c.checkInTime).getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      byHour[hourKey] = (byHour[hourKey] || 0) + 1;

      // By day
      const day = new Date(c.checkInTime).toLocaleDateString('en-US', { weekday: 'long' });
      byDay[day] = (byDay[day] || 0) + 1;
    });

    // Find peak hour and day
    let peakHour = '00:00';
    let maxHourCount = 0;
    Object.entries(byHour).forEach(([hour, count]) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = hour;
      }
    });

    let peakDay = 'Monday';
    let maxDayCount = 0;
    Object.entries(byDay).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = day;
      }
    });

    return {
      total,
      active,
      completed,
      averageDuration,
      byMembershipType,
      byMethod,
      byHour,
      byDay,
      peakHour,
      peakDay,
    };
  }

  getMemberCheckInHistory(userId: string, limit?: number): CheckIn[] {
    const checkIns = this.getCheckInsByUser(userId);
    const sorted = checkIns.sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }

  getMemberCheckInCount(userId: string): number {
    return this.getCheckInsByUser(userId).length;
  }

  getMemberTotalGymTime(userId: string): number {
    const checkIns = this.getCheckInsByUser(userId).filter(c => c.duration);
    return checkIns.reduce((sum, c) => sum + (c.duration || 0), 0);
  }

  // Meal Plan Operations

  private saveMealPlans(mealPlans: MealPlan[]): void {
    localStorage.setItem(this.MEAL_PLANS_KEY, JSON.stringify(mealPlans));
  }

  getAllMealPlans(): MealPlan[] {
    const mealPlans = localStorage.getItem(this.MEAL_PLANS_KEY);
    return mealPlans ? JSON.parse(mealPlans) : [];
  }

  getMealPlanById(id: string): MealPlan | null {
    const mealPlans = this.getAllMealPlans();
    return mealPlans.find(m => m.id === id) || null;
  }

  getMealPlansByTrainer(trainerId: string): MealPlan[] {
    const mealPlans = this.getAllMealPlans();
    return mealPlans.filter(m => m.trainerId === trainerId);
  }

  getMealPlansByClient(clientId: string): MealPlan[] {
    const mealPlans = this.getAllMealPlans();
    return mealPlans.filter(m => m.clientId === clientId);
  }

  getActiveMealPlanForClient(clientId: string): MealPlan | null {
    const mealPlans = this.getMealPlansByClient(clientId);
    const active = mealPlans.filter(m => m.status === 'Active');
    return active.length > 0 ? active[0] : null;
  }

  createMealPlan(data: {
    name: string;
    description: string;
    trainerId: string;
    trainerName: string;
    clientId: string;
    clientName: string;
    goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Performance';
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
    duration: number;
    startDate: string;
    endDate: string;
    meals?: { [day: string]: Meal[] };
    notes?: string;
  }): MealPlan {
    const mealPlan: MealPlan = {
      id: this.generateId(),
      name: data.name,
      description: data.description,
      trainerId: data.trainerId,
      trainerName: data.trainerName,
      clientId: data.clientId,
      clientName: data.clientName,
      goal: data.goal,
      dailyCalories: data.dailyCalories,
      dailyProtein: data.dailyProtein,
      dailyCarbs: data.dailyCarbs,
      dailyFats: data.dailyFats,
      duration: data.duration,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'Active',
      meals: data.meals || {},
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mealPlans = this.getAllMealPlans();
    mealPlans.push(mealPlan);
    this.saveMealPlans(mealPlans);

    // Send notification to client
    this.sendEmail({
      to: data.clientName,
      subject: 'New Meal Plan Created',
      body: `Your trainer ${data.trainerName} has created a new meal plan for you: "${data.name}". Check it out in your dashboard!`,
    });

    return mealPlan;
  }

  updateMealPlan(id: string, updates: Partial<MealPlan>): MealPlan | null {
    const mealPlans = this.getAllMealPlans();
    const index = mealPlans.findIndex(m => m.id === id);

    if (index === -1) return null;

    mealPlans[index] = {
      ...mealPlans[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveMealPlans(mealPlans);
    return mealPlans[index];
  }

  addMealToPlan(planId: string, day: string, meal: Meal): MealPlan | null {
    const mealPlan = this.getMealPlanById(planId);
    if (!mealPlan) return null;

    if (!mealPlan.meals[day]) {
      mealPlan.meals[day] = [];
    }

    mealPlan.meals[day].push(meal);
    return this.updateMealPlan(planId, { meals: mealPlan.meals });
  }

  removeMealFromPlan(planId: string, day: string, mealId: string): MealPlan | null {
    const mealPlan = this.getMealPlanById(planId);
    if (!mealPlan || !mealPlan.meals[day]) return null;

    mealPlan.meals[day] = mealPlan.meals[day].filter(m => m.id !== mealId);
    return this.updateMealPlan(planId, { meals: mealPlan.meals });
  }

  completeMealPlan(id: string): MealPlan | null {
    return this.updateMealPlan(id, { status: 'Completed' });
  }

  deleteMealPlan(id: string): boolean {
    const mealPlans = this.getAllMealPlans();
    const filtered = mealPlans.filter(m => m.id !== id);

    if (filtered.length === mealPlans.length) {
      return false;
    }

    this.saveMealPlans(filtered);
    return true;
  }

  // Nutrition Log Operations

  private saveNutritionLogs(logs: NutritionLog[]): void {
    localStorage.setItem(this.NUTRITION_LOGS_KEY, JSON.stringify(logs));
  }

  getAllNutritionLogs(): NutritionLog[] {
    const logs = localStorage.getItem(this.NUTRITION_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  }

  getNutritionLogById(id: string): NutritionLog | null {
    const logs = this.getAllNutritionLogs();
    return logs.find(l => l.id === id) || null;
  }

  getNutritionLogsByUser(userId: string): NutritionLog[] {
    const logs = this.getAllNutritionLogs();
    return logs.filter(l => l.userId === userId).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getNutritionLogByDate(userId: string, date: string): NutritionLog | null {
    const logs = this.getNutritionLogsByUser(userId);
    return logs.find(l => l.date === date) || null;
  }

  getNutritionLogsByDateRange(userId: string, startDate: string, endDate: string): NutritionLog[] {
    const logs = this.getNutritionLogsByUser(userId);
    return logs.filter(l => {
      const logDate = new Date(l.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return logDate >= start && logDate <= end;
    });
  }

  createNutritionLog(data: {
    userId: string;
    userName: string;
    mealPlanId?: string;
    date: string;
    meals: {
      mealId?: string;
      name: string;
      type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }[];
    waterIntake?: number;
    notes?: string;
  }): NutritionLog {
    const totalCalories = data.meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = data.meals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = data.meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFats = data.meals.reduce((sum, m) => sum + m.fats, 0);

    const log: NutritionLog = {
      id: this.generateId(),
      userId: data.userId,
      userName: data.userName,
      mealPlanId: data.mealPlanId,
      date: data.date,
      meals: data.meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      waterIntake: data.waterIntake || 0,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    const logs = this.getAllNutritionLogs();
    logs.push(log);
    this.saveNutritionLogs(logs);

    return log;
  }

  updateNutritionLog(id: string, updates: Partial<NutritionLog>): NutritionLog | null {
    const logs = this.getAllNutritionLogs();
    const index = logs.findIndex(l => l.id === id);

    if (index === -1) return null;

    // Recalculate totals if meals are updated
    if (updates.meals) {
      updates.totalCalories = updates.meals.reduce((sum, m) => sum + m.calories, 0);
      updates.totalProtein = updates.meals.reduce((sum, m) => sum + m.protein, 0);
      updates.totalCarbs = updates.meals.reduce((sum, m) => sum + m.carbs, 0);
      updates.totalFats = updates.meals.reduce((sum, m) => sum + m.fats, 0);
    }

    logs[index] = {
      ...logs[index],
      ...updates,
    };

    this.saveNutritionLogs(logs);
    return logs[index];
  }

  addMealToLog(logId: string, meal: {
    mealId?: string;
    name: string;
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }): NutritionLog | null {
    const log = this.getNutritionLogById(logId);
    if (!log) return null;

    log.meals.push(meal);
    return this.updateNutritionLog(logId, { meals: log.meals });
  }

  deleteNutritionLog(id: string): boolean {
    const logs = this.getAllNutritionLogs();
    const filtered = logs.filter(l => l.id !== id);

    if (filtered.length === logs.length) {
      return false;
    }

    this.saveNutritionLogs(filtered);
    return true;
  }

  // Nutrition Analytics

  getNutritionStats(userId: string, days: number = 7): {
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFats: number;
    averageWater: number;
    totalLogs: number;
    adherenceRate: number;
  } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = this.getNutritionLogsByDateRange(
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    const totalLogs = logs.length;

    if (totalLogs === 0) {
      return {
        averageCalories: 0,
        averageProtein: 0,
        averageCarbs: 0,
        averageFats: 0,
        averageWater: 0,
        totalLogs: 0,
        adherenceRate: 0,
      };
    }

    const averageCalories = Math.round(logs.reduce((sum, l) => sum + l.totalCalories, 0) / totalLogs);
    const averageProtein = Math.round(logs.reduce((sum, l) => sum + l.totalProtein, 0) / totalLogs);
    const averageCarbs = Math.round(logs.reduce((sum, l) => sum + l.totalCarbs, 0) / totalLogs);
    const averageFats = Math.round(logs.reduce((sum, l) => sum + l.totalFats, 0) / totalLogs);
    const averageWater = Math.round(logs.reduce((sum, l) => sum + l.waterIntake, 0) / totalLogs);
    const adherenceRate = Math.round((totalLogs / days) * 100);

    return {
      averageCalories,
      averageProtein,
      averageCarbs,
      averageFats,
      averageWater,
      totalLogs,
      adherenceRate,
    };
  }

  // Utility Methods

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateVerificationToken(): string {
    return Math.random().toString(36).substr(2, 32) + Date.now().toString(36);
  }

  sendEmail(emailData: { to: string; subject: string; body: string }): void {
    // Mock email sending - log to console
    console.log('📧 Email sent:', {
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
    });
  }

  clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.MEMBERSHIPS_KEY);
    localStorage.removeItem(this.TRANSACTIONS_KEY);
    localStorage.removeItem(this.GOALS_KEY);
    localStorage.removeItem(this.CLASSES_KEY);
    localStorage.removeItem(this.BOOKINGS_KEY);
    localStorage.removeItem(this.PROGRAMS_KEY);
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.CAMPAIGNS_KEY);
    localStorage.removeItem(this.DISCOUNT_CODES_KEY);
    localStorage.removeItem(this.DISCOUNT_CODE_USAGE_KEY);
    localStorage.removeItem(this.CLIENT_PROGRESS_KEY);
    localStorage.removeItem(this.REVIEWS_KEY);
    localStorage.removeItem(this.SUPPORT_TICKETS_KEY);
    localStorage.removeItem(this.CHECKINS_KEY);
    localStorage.removeItem(this.MEAL_PLANS_KEY);
    localStorage.removeItem(this.NUTRITION_LOGS_KEY);
  }

  // Initialize demo data
  initializeDemoData(): void {
    const users = this.getAllUsers();
    if (users.length === 0) {
      // Create demo secretary/manager
      this.createUser({
        name: 'Maria Papadopoulou',
        email: 'secretary@fithub.gr',
        phone: '+30 698 000 0001',
        dateOfBirth: '1990-05-15',
        password: 'Admin123!',
        role: 'secretary',
        accountStatus: 'Active',
        emailVerified: true
      });

      // Create demo manager
      this.createUser({
        name: 'Nikos Georgiou',
        email: 'manager@fithub.gr',
        phone: '+30 698 000 0002',
        dateOfBirth: '1985-08-20',
        password: 'Manager123!',
        role: 'manager',
        accountStatus: 'Active',
        emailVerified: true
      });

      console.log('✅ Demo admin users initialized');
    }

    // Initialize demo classes
    const classes = this.getAllClasses();
    if (classes.length === 0) {
      const demoClasses = [
        {
          name: 'Morning Yoga Flow',
          description: 'Start your day with energizing yoga poses and breathing exercises',
          category: 'Yoga' as const,
          instructorId: 'trainer-1',
          instructorName: 'Elena Dimitriou',
          day: 'Monday' as const,
          time: '09:00',
          duration: 60,
          capacity: 20,
          status: 'Active' as const,
          location: 'Studio A'
        },
        {
          name: 'HIIT Cardio Blast',
          description: 'High-intensity interval training to burn calories and build endurance',
          category: 'HIIT' as const,
          instructorId: 'trainer-2',
          instructorName: 'Kostas Papadopoulos',
          day: 'Monday' as const,
          time: '18:00',
          duration: 45,
          capacity: 25,
          status: 'Active' as const,
          location: 'Main Gym'
        },
        {
          name: 'Pilates Core',
          description: 'Strengthen your core and improve flexibility with Pilates',
          category: 'Pilates' as const,
          instructorId: 'trainer-1',
          instructorName: 'Elena Dimitriou',
          day: 'Wednesday' as const,
          time: '10:00',
          duration: 50,
          capacity: 15,
          status: 'Active' as const,
          location: 'Studio B'
        },
        {
          name: 'Cycling Power Hour',
          description: 'Indoor cycling class with motivating music and challenging intervals',
          category: 'Cycling' as const,
          instructorId: 'trainer-3',
          instructorName: 'Sofia Nikolaou',
          day: 'Tuesday' as const,
          time: '19:00',
          duration: 60,
          capacity: 30,
          status: 'Active' as const,
          location: 'Cycling Studio'
        },
        {
          name: 'Strength & Conditioning',
          description: 'Build muscle and increase strength with weights and resistance training',
          category: 'Strength' as const,
          instructorId: 'trainer-2',
          instructorName: 'Kostas Papadopoulos',
          day: 'Thursday' as const,
          time: '17:00',
          duration: 60,
          capacity: 20,
          status: 'Active' as const,
          location: 'Weight Room'
        },
        {
          name: 'Boxing Fundamentals',
          description: 'Learn boxing techniques while getting an intense cardio workout',
          category: 'Boxing' as const,
          instructorId: 'trainer-4',
          instructorName: 'Dimitris Vasileiou',
          day: 'Friday' as const,
          time: '18:30',
          duration: 60,
          capacity: 18,
          status: 'Active' as const,
          location: 'Boxing Ring'
        },
        {
          name: 'Weekend Yoga',
          description: 'Relaxing yoga session to unwind and restore balance',
          category: 'Yoga' as const,
          instructorId: 'trainer-1',
          instructorName: 'Elena Dimitriou',
          day: 'Saturday' as const,
          time: '11:00',
          duration: 75,
          capacity: 25,
          status: 'Active' as const,
          location: 'Studio A'
        }
      ];

      demoClasses.forEach(classData => {
        this.createClass(classData);
      });

      console.log('✅ Demo classes initialized');
    }

    // Initialize demo training programs
    const programs = this.getAllPrograms();
    if (programs.length === 0) {
      // Create demo trainer
      const trainer = this.createUser({
        name: 'Sarah Johnson',
        email: 'trainer@fithub.gr',
        phone: '+30 698 000 0003',
        dateOfBirth: '1988-03-12',
        password: 'Trainer123!',
        role: 'trainer',
        accountStatus: 'Active',
        emailVerified: true
      });

      // Create demo member
      const member = this.createUser({
        name: 'Alex Smith',
        email: 'member@fithub.gr',
        phone: '+30 698 000 0004',
        dateOfBirth: '1995-06-18',
        password: 'Member123!',
        role: 'member',
        accountStatus: 'Active',
        emailVerified: true
      });

      // Create demo membership for the member
      this.createMembership({
        userId: member.id,
        type: 'Premium',
        monthlyCost: 79,
        status: 'Active',
        startDate: '2026-01-01',
        endDate: '2027-01-01',
      });

      // Create demo training programs
      const demoPrograms = [
        {
          name: 'Strength & Muscle Building',
          description: 'Progressive overload program designed to build muscle mass and increase overall strength',
          trainerId: trainer.id,
          trainerName: trainer.name,
          clientId: member.id,
          clientName: member.name,
          goal: 'Build muscle and increase strength',
          duration: 12,
          startDate: '2026-05-01',
          endDate: '2026-07-24',
          status: 'Active' as const,
          exercises: [
            {
              id: crypto.randomUUID(),
              name: 'Barbell Squats',
              category: 'Strength' as const,
              sets: 4,
              reps: '8-10',
              intensity: 'High' as const,
              instructions: 'Keep your back straight, chest up. Descend until thighs are parallel to ground.',
              day: 'Monday',
              completed: true
            },
            {
              id: crypto.randomUUID(),
              name: 'Bench Press',
              category: 'Strength' as const,
              sets: 4,
              reps: '8-10',
              intensity: 'High' as const,
              instructions: 'Lower bar to chest, press explosively. Keep elbows at 45-degree angle.',
              day: 'Monday',
              completed: true
            },
            {
              id: crypto.randomUUID(),
              name: 'Deadlifts',
              category: 'Strength' as const,
              sets: 3,
              reps: '6-8',
              intensity: 'High' as const,
              instructions: 'Keep bar close to body. Drive through heels, engage core throughout.',
              day: 'Wednesday',
              completed: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Pull-ups',
              category: 'Strength' as const,
              sets: 3,
              reps: '10-12',
              intensity: 'Medium' as const,
              instructions: 'Full range of motion. Control the descent.',
              day: 'Wednesday',
              completed: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Overhead Press',
              category: 'Strength' as const,
              sets: 4,
              reps: '8-10',
              intensity: 'High' as const,
              instructions: 'Press bar straight overhead. Keep core tight.',
              day: 'Friday',
              completed: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Barbell Rows',
              category: 'Strength' as const,
              sets: 4,
              reps: '8-10',
              intensity: 'Medium' as const,
              instructions: 'Pull bar to lower chest. Squeeze shoulder blades together.',
              day: 'Friday',
              completed: false
            }
          ],
          notes: 'Focus on progressive overload. Increase weight by 2.5-5kg when you can complete all sets with good form.'
        },
        {
          name: 'Cardio Endurance Program',
          description: '8-week program to improve cardiovascular fitness and stamina',
          trainerId: trainer.id,
          trainerName: trainer.name,
          clientId: member.id,
          clientName: member.name,
          goal: 'Improve cardiovascular endurance',
          duration: 8,
          startDate: '2026-05-01',
          endDate: '2026-06-26',
          status: 'Active' as const,
          exercises: [
            {
              id: crypto.randomUUID(),
              name: 'Treadmill Intervals',
              category: 'Cardio' as const,
              duration: '30 minutes',
              intensity: 'High' as const,
              instructions: '5 min warm-up, then 1 min sprint / 2 min jog intervals x 8, 5 min cool down',
              day: 'Tuesday',
              completed: true
            },
            {
              id: crypto.randomUUID(),
              name: 'Cycling Steady State',
              category: 'Cardio' as const,
              duration: '45 minutes',
              intensity: 'Medium' as const,
              instructions: 'Maintain steady pace at 70-75% max heart rate',
              day: 'Thursday',
              completed: false
            },
            {
              id: crypto.randomUUID(),
              name: 'Jump Rope',
              category: 'Cardio' as const,
              duration: '20 minutes',
              intensity: 'High' as const,
              instructions: '30 seconds on / 30 seconds rest. Focus on rhythm and footwork.',
              day: 'Saturday',
              completed: false
            }
          ],
          notes: 'Monitor heart rate. Stay hydrated. If you feel dizzy, stop and rest.'
        }
      ];

      demoPrograms.forEach(programData => {
        this.createProgram(programData);
      });

      console.log('✅ Demo training programs initialized');
    }

    // Initialize demo tasks
    const tasks = this.getAllTasks();
    if (tasks.length === 0) {
      // Get manager user for task assignment
      const manager = this.findUserByEmail('manager@fithub.gr');
      const trainer = this.findUserByEmail('trainer@fithub.gr');

      if (manager && trainer) {
        const demoTasks = [
          {
            title: 'Update Class Schedule Board',
            description: 'Update the weekly class schedule on the main board in the reception area',
            type: 'Administrative' as const,
            assignedTo: trainer.id,
            assignedToName: trainer.name,
            assignedBy: manager.id,
            assignedByName: manager.name,
            deadline: '2026-05-30',
            priority: 'Medium' as const,
            frequency: 'Weekly' as const,
            status: 'Pending' as const,
            notes: 'Make sure to highlight new classes'
          },
          {
            title: 'Equipment Maintenance Check',
            description: 'Inspect all cardio and strength equipment for safety and functionality',
            type: 'Maintenance' as const,
            assignedTo: trainer.id,
            assignedToName: trainer.name,
            assignedBy: manager.id,
            assignedByName: manager.name,
            deadline: '2026-05-28',
            priority: 'High' as const,
            frequency: 'Weekly' as const,
            status: 'In Progress' as const,
            notes: 'Pay special attention to the treadmills'
          },
          {
            title: 'Client Follow-up Calls',
            description: 'Call clients who haven\'t visited in the last 2 weeks to check in',
            type: 'Customer Service' as const,
            assignedTo: trainer.id,
            assignedToName: trainer.name,
            assignedBy: manager.id,
            assignedByName: manager.name,
            deadline: '2026-06-01',
            priority: 'Low' as const,
            frequency: 'Weekly' as const,
            status: 'Pending' as const
          }
        ];

        demoTasks.forEach(taskData => {
          this.createTask(taskData);
        });

        console.log('✅ Demo tasks initialized');
      }
    }

    // Initialize demo campaigns
    const campaigns = this.getAllCampaigns();
    if (campaigns.length === 0) {
      const manager = this.findUserByEmail('manager@fithub.gr');

      if (manager) {
        const demoCampaigns = [
          {
            name: 'New Year Fitness Challenge',
            description: 'Promote our New Year fitness challenge to all members',
            type: 'Email' as const,
            targetAudience: 'All Members' as const,
            subject: 'Join Our New Year Fitness Challenge! 🎯',
            message: `
              <h2>Start 2026 Strong!</h2>
              <p>Dear Member,</p>
              <p>We're excited to announce our New Year Fitness Challenge!</p>
              <ul>
                <li>6-week structured program</li>
                <li>Weekly fitness assessments</li>
                <li>Prizes for top performers</li>
                <li>Free nutrition consultation</li>
              </ul>
              <p>Sign up now and transform your fitness journey!</p>
              <p>Best regards,<br>FitHub Team</p>
            `,
            status: 'Sent' as const,
            createdBy: manager.id,
            createdByName: manager.name,
            sentAt: '2026-01-01T09:00:00Z'
          },
          {
            name: 'Premium Membership Upgrade Offer',
            description: 'Target basic members with premium upgrade offer',
            type: 'Email' as const,
            targetAudience: 'Basic Members' as const,
            subject: 'Upgrade to Premium - 20% Off This Month Only! 💎',
            message: `
              <h2>Unlock Premium Benefits</h2>
              <p>Hello,</p>
              <p>As a valued Basic member, we'd like to offer you an exclusive 20% discount on Premium membership!</p>
              <h3>Premium Benefits Include:</h3>
              <ul>
                <li>Unlimited class bookings</li>
                <li>Free personal training sessions</li>
                <li>Access to premium equipment</li>
                <li>Priority support</li>
                <li>Nutrition consultation</li>
              </ul>
              <p>Use code: <strong>PREMIUM20</strong></p>
              <p>Offer valid until end of month.</p>
            `,
            status: 'Scheduled' as const,
            scheduledDate: '2026-06-01T10:00:00Z',
            createdBy: manager.id,
            createdByName: manager.name
          },
          {
            name: 'Summer Bootcamp Registration',
            description: 'Draft campaign for summer bootcamp program',
            type: 'Email' as const,
            targetAudience: 'All Members' as const,
            subject: 'Get Beach Ready - Summer Bootcamp Starting Soon! 🌞',
            message: `
              <h2>Summer Bootcamp 2026</h2>
              <p>Transform your body this summer with our intensive bootcamp program!</p>
              <p>Early bird registration opens next week.</p>
              <p>Stay tuned for more details!</p>
            `,
            status: 'Draft' as const,
            createdBy: manager.id,
            createdByName: manager.name
          }
        ];

        demoCampaigns.forEach(campaignData => {
          const campaign = this.createCampaign(campaignData);
          // Simulate analytics for sent campaign
          if (campaign.status === 'Sent') {
            this.updateCampaign(campaign.id, {
              analytics: {
                targetCount: 150,
                sentCount: 150,
                deliveredCount: 148,
                openedCount: 112,
                clickedCount: 45
              }
            });
          } else if (campaign.status === 'Scheduled') {
            this.updateCampaign(campaign.id, {
              analytics: {
                targetCount: 75,
                sentCount: 0,
                deliveredCount: 0,
                openedCount: 0,
                clickedCount: 0
              }
            });
          }
        });

        console.log('✅ Demo campaigns initialized');
      }
    }

    // Initialize demo discount codes
    const discountCodes = this.getAllDiscountCodes();
    if (discountCodes.length === 0) {
      const manager = this.findUserByEmail('manager@fithub.gr');

      if (manager) {
        const demoDiscountCodes = [
          {
            code: 'WELCOME20',
            name: 'Welcome Discount',
            description: '20% off for new members',
            discountType: 'Percentage' as const,
            discountValue: 20,
            applicableTo: 'All Memberships' as const,
            maxDiscountAmount: 20, // Max €20 discount
            usageLimit: 100, // Total usage limit
            usagePerUser: 1, // One time per user
            validFrom: '2026-01-01T00:00:00Z',
            validUntil: '2026-12-31T23:59:59Z',
            status: 'Active' as const,
            createdBy: manager.id,
            createdByName: manager.name
          },
          {
            code: 'PREMIUM20',
            name: 'Premium Upgrade',
            description: '20% off Premium membership upgrade',
            discountType: 'Percentage' as const,
            discountValue: 20,
            applicableTo: 'Premium Only' as const,
            validFrom: '2026-05-01T00:00:00Z',
            validUntil: '2026-06-30T23:59:59Z',
            status: 'Active' as const,
            createdBy: manager.id,
            createdByName: manager.name
          },
          {
            code: 'SUMMER50',
            name: 'Summer Special',
            description: '€50 off any membership',
            discountType: 'Fixed Amount' as const,
            discountValue: 50,
            applicableTo: 'All Memberships' as const,
            minPurchaseAmount: 100, // Minimum €100 purchase
            usageLimit: 50,
            validFrom: '2026-06-01T00:00:00Z',
            validUntil: '2026-08-31T23:59:59Z',
            status: 'Active' as const,
            createdBy: manager.id,
            createdByName: manager.name
          },
          {
            code: 'NEWYEAR2026',
            name: 'New Year Special',
            description: '15% off all memberships - expired',
            discountType: 'Percentage' as const,
            discountValue: 15,
            applicableTo: 'All Memberships' as const,
            usageLimit: 200,
            validFrom: '2026-01-01T00:00:00Z',
            validUntil: '2026-01-31T23:59:59Z',
            status: 'Expired' as const,
            createdBy: manager.id,
            createdByName: manager.name
          }
        ];

        demoDiscountCodes.forEach(codeData => {
          this.createDiscountCode(codeData);
        });

        console.log('✅ Demo discount codes initialized');
      }
    }

    // Initialize demo client progress
    const clientProgress = this.getAllClientProgress();
    if (clientProgress.length === 0) {
      const trainer = this.findUserByEmail('trainer@fithub.gr');
      const member = this.findUserByEmail('member@fithub.gr');

      if (trainer && member) {
        const demoProgress = [
          {
            clientId: member.id,
            clientName: member.name,
            trainerId: trainer.id,
            trainerName: trainer.name,
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            weight: 85,
            bodyFat: 22,
            muscleMass: 35,
            measurements: {
              chest: 102,
              waist: 88,
              hips: 98,
              biceps: 36,
              thighs: 58
            },
            exercisePerformance: [
              {
                exerciseName: 'Bench Press',
                sets: 3,
                reps: '10',
                weight: 60,
                difficulty: 'Medium' as const,
                notes: 'Good form, increasing weight next session'
              },
              {
                exerciseName: 'Squats',
                sets: 4,
                reps: '8',
                weight: 80,
                difficulty: 'Hard' as const,
                notes: 'Struggled with last set'
              }
            ],
            goals: 'Reduce body fat to 18%, increase muscle mass',
            notes: 'Client is motivated and consistent. Good progress on strength exercises.'
          },
          {
            clientId: member.id,
            clientName: member.name,
            trainerId: trainer.id,
            trainerName: trainer.name,
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
            weight: 83.5,
            bodyFat: 20.5,
            muscleMass: 36,
            measurements: {
              chest: 103,
              waist: 86,
              hips: 97,
              biceps: 37,
              thighs: 59
            },
            exercisePerformance: [
              {
                exerciseName: 'Bench Press',
                sets: 3,
                reps: '10',
                weight: 65,
                difficulty: 'Medium' as const,
                notes: 'Weight increased successfully'
              },
              {
                exerciseName: 'Squats',
                sets: 4,
                reps: '8',
                weight: 85,
                difficulty: 'Medium' as const,
                notes: 'Better form today'
              },
              {
                exerciseName: 'Deadlifts',
                sets: 3,
                reps: '6',
                weight: 90,
                difficulty: 'Hard' as const,
                notes: 'First time with this weight'
              }
            ],
            goals: 'Continue current program, focus on compound movements',
            notes: 'Excellent progress! Lost 1.5kg, gained muscle mass. Keep up the good work.'
          },
          {
            clientId: member.id,
            clientName: member.name,
            trainerId: trainer.id,
            trainerName: trainer.name,
            date: new Date().toISOString(), // Today
            weight: 82,
            bodyFat: 19,
            muscleMass: 37,
            measurements: {
              chest: 104,
              waist: 84,
              hips: 96,
              biceps: 38,
              thighs: 60
            },
            exercisePerformance: [
              {
                exerciseName: 'Bench Press',
                sets: 4,
                reps: '10',
                weight: 70,
                difficulty: 'Medium' as const,
                notes: 'Added extra set, good endurance'
              },
              {
                exerciseName: 'Squats',
                sets: 4,
                reps: '10',
                weight: 90,
                difficulty: 'Medium' as const,
                notes: 'Perfect form throughout'
              },
              {
                exerciseName: 'Deadlifts',
                sets: 3,
                reps: '8',
                weight: 95,
                difficulty: 'Medium' as const,
                notes: 'Strength improving steadily'
              },
              {
                exerciseName: 'Pull-ups',
                sets: 3,
                reps: '12',
                weight: 0,
                difficulty: 'Easy' as const,
                notes: 'Bodyweight - consider adding weight'
              }
            ],
            goals: 'Target: 80kg, 17% body fat by next month',
            notes: 'Outstanding progress! Client has lost 3kg and gained 2kg muscle in one month. Ready to increase training intensity.'
          }
        ];

        demoProgress.forEach(progressData => {
          this.createClientProgress(progressData);
        });

        console.log('✅ Demo client progress initialized');
      }
    }

    // Initialize demo reviews
    const reviews = this.getAllReviews();
    if (reviews.length === 0) {
      const allUsers = this.getAllUsers();
      const allClasses = this.getAllClasses();
      const allPrograms = this.getAllPrograms();

      // Find some users and targets for demo reviews
      const memberUser = allUsers.find(u => u.role === 'member');
      const yogaClass = allClasses.find(c => c.category === 'Yoga');
      const hiitClass = allClasses.find(c => c.category === 'HIIT');
      const program = allPrograms[0];

      if (memberUser && yogaClass) {
        // Approved review for Yoga class
        this.saveReviews([
          {
            id: this.generateId(),
            userId: memberUser.id,
            userName: memberUser.name,
            userEmail: memberUser.email,
            targetType: 'Class',
            targetId: yogaClass.id,
            targetName: yogaClass.name,
            instructorId: yogaClass.instructorId,
            instructorName: yogaClass.instructorName,
            instructorRating: 5,
            facilityRating: 5,
            overallRating: 5,
            comments: 'Amazing class! The instructor is very knowledgeable and the atmosphere is perfect for relaxation.',
            suggestions: 'Maybe add more beginner-friendly sessions?',
            status: 'Approved',
            moderatedBy: 'Nikos Georgiou',
            moderatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ]);
      }

      if (hiitClass) {
        const reviewsData = this.getAllReviews();
        // Pending review for HIIT class
        reviewsData.push({
          id: this.generateId(),
          userId: memberUser?.id || 'user-2',
          userName: memberUser?.name || 'John Doe',
          userEmail: memberUser?.email || 'john@example.com',
          targetType: 'Class',
          targetId: hiitClass.id,
          targetName: hiitClass.name,
          instructorId: hiitClass.instructorId,
          instructorName: hiitClass.instructorName,
          instructorRating: 4,
          facilityRating: 4,
          overallRating: 4,
          comments: 'Great workout! Very intense and effective. The instructor pushes you to your limits.',
          status: 'Pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        });
        this.saveReviews(reviewsData);
      }

      if (program) {
        const reviewsData = this.getAllReviews();
        // Approved review for Training Program
        reviewsData.push({
          id: this.generateId(),
          userId: program.clientId,
          userName: program.clientName,
          userEmail: 'client@example.com',
          targetType: 'Training Program',
          targetId: program.id,
          targetName: program.name,
          instructorId: program.trainerId,
          instructorName: program.trainerName,
          instructorRating: 5,
          facilityRating: 4,
          overallRating: 5,
          comments: 'Excellent personalized program! I have seen great results in just 4 weeks. My trainer is very professional and supportive.',
          suggestions: 'Would love to see more variety in exercises.',
          status: 'Approved',
          moderatedBy: 'Nikos Georgiou',
          moderatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        });

        // Rejected review with inappropriate content
        reviewsData.push({
          id: this.generateId(),
          userId: 'user-test-reject',
          userName: 'Test User',
          userEmail: 'test@example.com',
          targetType: 'Class',
          targetId: yogaClass?.id || 'class-1',
          targetName: yogaClass?.name || 'Yoga Class',
          instructorId: yogaClass?.instructorId || 'trainer-1',
          instructorName: yogaClass?.instructorName || 'Elena Dimitriou',
          instructorRating: 1,
          facilityRating: 1,
          overallRating: 1,
          comments: 'This review violated gym policy terms.',
          status: 'Rejected',
          rejectionReason: 'Review contains inappropriate language and violates community guidelines.',
          moderatedBy: 'Maria Papadopoulou',
          moderatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

        // Another approved review
        reviewsData.push({
          id: this.generateId(),
          userId: 'user-test-2',
          userName: 'Maria Konstantinou',
          userEmail: 'maria.k@example.com',
          targetType: 'Class',
          targetId: yogaClass?.id || 'class-1',
          targetName: yogaClass?.name || 'Yoga Class',
          instructorId: yogaClass?.instructorId || 'trainer-1',
          instructorName: yogaClass?.instructorName || 'Elena Dimitriou',
          instructorRating: 4,
          facilityRating: 5,
          overallRating: 4,
          comments: 'Love the morning yoga sessions! Perfect way to start the day. The instructor is patient and provides clear instructions.',
          suggestions: 'Could use some more advanced poses for experienced practitioners.',
          status: 'Approved',
          moderatedBy: 'Nikos Georgiou',
          moderatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        });

        this.saveReviews(reviewsData);
        console.log('✅ Demo reviews initialized');
      }
    }

    // Initialize demo support tickets
    const supportTickets = this.getAllSupportTickets();
    if (supportTickets.length === 0) {
      const allUsers = this.getAllUsers();
      const memberUser = allUsers.find(u => u.role === 'member');
      const secretary = allUsers.find(u => u.role === 'secretary');

      if (memberUser) {
        // Open ticket with AI responding
        const ticket1 = this.createSupportTicket({
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          category: 'Technical Problem',
          subject: 'Cannot access my training program',
          description: 'I am trying to view my training program but the page keeps loading. Can you help?',
          priority: 'Medium',
        });

        // Add AI message
        this.addMessageToTicket(ticket1.id, {
          senderId: 'ai',
          senderName: 'FitHub AI Assistant',
          senderType: 'ai',
          message: "I understand you're having trouble accessing your training program. Let me help you with that. Have you tried refreshing the page or logging out and back in?",
        });

        // Add member response
        this.addMessageToTicket(ticket1.id, {
          senderId: memberUser.id,
          senderName: memberUser.name,
          senderType: 'member',
          message: "I tried that but it's still not working. The page just shows a loading spinner.",
        });

        // Closed ticket - resolved by AI
        const ticket2 = this.createSupportTicket({
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          category: 'Subscription Info',
          subject: 'Question about upgrading membership',
          description: 'What are the benefits of upgrading from Basic to Premium?',
          priority: 'Low',
        });

        this.addMessageToTicket(ticket2.id, {
          senderId: 'ai',
          senderName: 'FitHub AI Assistant',
          senderType: 'ai',
          message: "Great question! Premium membership (€79/month) offers additional benefits over Basic (€49/month) including: access to all classes, priority booking, 2 personal training sessions per month, and access to premium equipment. Would you like to know more about any specific benefit?",
        });

        this.addMessageToTicket(ticket2.id, {
          senderId: memberUser.id,
          senderName: memberUser.name,
          senderType: 'member',
          message: "That's perfect! Thank you for the information.",
        });

        this.closeTicket(ticket2.id, 'ai');

        // Escalated ticket - secretary handling
        if (secretary) {
          const ticket3 = this.createSupportTicket({
            userId: memberUser.id,
            userName: memberUser.name,
            userEmail: memberUser.email,
            category: 'Billing',
            subject: 'Incorrect charge on my account',
            description: 'I was charged twice for my membership this month. Can someone help me resolve this?',
            priority: 'High',
          });

          this.addMessageToTicket(ticket3.id, {
            senderId: 'ai',
            senderName: 'FitHub AI Assistant',
            senderType: 'ai',
            message: "I'm sorry to hear about the billing issue. Let me check your recent transactions. Can you confirm the dates of the two charges?",
          });

          this.addMessageToTicket(ticket3.id, {
            senderId: memberUser.id,
            senderName: memberUser.name,
            senderType: 'member',
            message: "Both charges were on May 15th, €49 each.",
          });

          this.addMessageToTicket(ticket3.id, {
            senderId: 'ai',
            senderName: 'FitHub AI Assistant',
            senderType: 'ai',
            message: "I understand this is urgent. Let me escalate this to our billing team for immediate assistance.",
          });

          // Escalate to secretary
          this.escalateTicketToSecretary(ticket3.id, secretary.id, secretary.name);

          this.addMessageToTicket(ticket3.id, {
            senderId: secretary.id,
            senderName: secretary.name,
            senderType: 'secretary',
            message: "Hello! I'm Maria from the FitHub team. I've reviewed your account and confirmed the duplicate charge. I've processed a refund for €49 which should appear in your account within 3-5 business days. My apologies for the inconvenience!",
          });
        }

        console.log('✅ Demo support tickets initialized');
      }
    }

    // Check-In Demo Data
    const checkIns = this.getAllCheckIns();
    if (checkIns.length === 0) {
      const memberUser = users.find(u => u.role === 'member');
      const secretary = users.find(u => u.role === 'secretary');

      if (memberUser && secretary) {
        // Ensure member has active membership
        let membership = this.getMembershipByUserId(memberUser.id);
        if (!membership || membership.status !== 'Active') {
          this.createMembership({
            userId: memberUser.id,
            type: 'Premium',
            monthlyCost: 79,
            status: 'Active',
            startDate: '2026-01-01',
            endDate: '2027-01-01',
          });
        }

        // Active check-in (member currently in gym)
        const activeCheckIn = this.createCheckIn({
          userId: memberUser.id,
          method: 'QR Code',
          notes: 'Regular morning workout',
        });

        // Completed check-in from earlier today (2 hours)
        const today = new Date();
        const twoHoursAgo = new Date(today.getTime() - 2 * 60 * 60 * 1000);
        const completedToday: CheckIn = {
          id: this.generateId(),
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          membershipType: 'Premium',
          checkInTime: twoHoursAgo.toISOString(),
          checkOutTime: new Date(twoHoursAgo.getTime() + 90 * 60 * 1000).toISOString(), // 90 min session
          duration: 90,
          method: 'Card Scan',
          status: 'Completed',
          createdAt: twoHoursAgo.toISOString(),
        };

        // Yesterday's check-in
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(18, 30, 0, 0);
        const yesterdayCheckIn: CheckIn = {
          id: this.generateId(),
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          membershipType: 'Premium',
          checkInTime: yesterday.toISOString(),
          checkOutTime: new Date(yesterday.getTime() + 75 * 60 * 1000).toISOString(),
          duration: 75,
          method: 'QR Code',
          status: 'Completed',
          createdAt: yesterday.toISOString(),
        };

        // 2 days ago check-in
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        twoDaysAgo.setHours(7, 0, 0, 0);
        const twoDaysAgoCheckIn: CheckIn = {
          id: this.generateId(),
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          membershipType: 'Premium',
          checkInTime: twoDaysAgo.toISOString(),
          checkOutTime: new Date(twoDaysAgo.getTime() + 60 * 60 * 1000).toISOString(),
          duration: 60,
          method: 'Manual',
          receptionistId: secretary.id,
          receptionistName: secretary.name,
          notes: 'Forgot membership card',
          status: 'Completed',
          createdAt: twoDaysAgo.toISOString(),
        };

        // 3 days ago check-in
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        threeDaysAgo.setHours(19, 0, 0, 0);
        const threeDaysAgoCheckIn: CheckIn = {
          id: this.generateId(),
          userId: memberUser.id,
          userName: memberUser.name,
          userEmail: memberUser.email,
          membershipType: 'Premium',
          checkInTime: threeDaysAgo.toISOString(),
          checkOutTime: new Date(threeDaysAgo.getTime() + 105 * 60 * 1000).toISOString(),
          duration: 105,
          method: 'QR Code',
          status: 'Completed',
          createdAt: threeDaysAgo.toISOString(),
        };

        // Save all demo check-ins
        const allCheckIns = [activeCheckIn, completedToday, yesterdayCheckIn, twoDaysAgoCheckIn, threeDaysAgoCheckIn];
        this.saveCheckIns(allCheckIns);

        console.log('✅ Demo check-ins initialized');
      }
    }

    // Meal Plans and Nutrition Demo Data
    const mealPlans = this.getAllMealPlans();
    if (mealPlans.length === 0) {
      const memberUser = users.find(u => u.role === 'member');
      const trainerUser = users.find(u => u.role === 'trainer');

      if (memberUser && trainerUser) {
        // Create demo meal plan
        const demoMealPlan = this.createMealPlan({
          name: 'Muscle Building Nutrition Plan',
          description: 'High-protein meal plan designed to support muscle growth and recovery',
          trainerId: trainerUser.id,
          trainerName: trainerUser.name,
          clientId: memberUser.id,
          clientName: memberUser.name,
          goal: 'Muscle Gain',
          dailyCalories: 2800,
          dailyProtein: 180,
          dailyCarbs: 300,
          dailyFats: 80,
          duration: 8,
          startDate: '2026-05-01',
          endDate: '2026-06-26',
          notes: 'Focus on lean proteins, complex carbs, and healthy fats. Stay hydrated!',
        });

        // Add meals to the plan
        const mondayMeals: Meal[] = [
          {
            id: this.generateId(),
            name: 'Protein Oatmeal Bowl',
            type: 'Breakfast',
            description: 'Oatmeal with protein powder, banana, and almond butter',
            calories: 550,
            protein: 35,
            carbs: 70,
            fats: 15,
            ingredients: ['Oats (1 cup)', 'Protein powder (1 scoop)', 'Banana (1 medium)', 'Almond butter (1 tbsp)', 'Cinnamon'],
            instructions: 'Cook oats, mix in protein powder, top with sliced banana and almond butter',
          },
          {
            id: this.generateId(),
            name: 'Grilled Chicken & Rice',
            type: 'Lunch',
            description: 'Grilled chicken breast with brown rice and steamed vegetables',
            calories: 700,
            protein: 55,
            carbs: 80,
            fats: 12,
            ingredients: ['Chicken breast (200g)', 'Brown rice (1 cup cooked)', 'Broccoli (1 cup)', 'Olive oil (1 tsp)'],
            instructions: 'Grill chicken, cook rice, steam broccoli, season to taste',
          },
          {
            id: this.generateId(),
            name: 'Greek Yogurt & Berries',
            type: 'Snack',
            description: 'High-protein greek yogurt with mixed berries and honey',
            calories: 250,
            protein: 20,
            carbs: 35,
            fats: 5,
            ingredients: ['Greek yogurt (200g)', 'Mixed berries (1 cup)', 'Honey (1 tsp)'],
          },
          {
            id: this.generateId(),
            name: 'Salmon & Sweet Potato',
            type: 'Dinner',
            description: 'Baked salmon with roasted sweet potato and asparagus',
            calories: 650,
            protein: 50,
            carbs: 60,
            fats: 20,
            ingredients: ['Salmon fillet (200g)', 'Sweet potato (1 large)', 'Asparagus (1 cup)', 'Lemon', 'Herbs'],
            instructions: 'Bake salmon and sweet potato, roast asparagus, season with lemon and herbs',
          },
        ];

        this.updateMealPlan(demoMealPlan.id, {
          meals: {
            Monday: mondayMeals,
            Tuesday: mondayMeals, // Reuse for demo
            Wednesday: mondayMeals,
            Thursday: mondayMeals,
            Friday: mondayMeals,
            Saturday: mondayMeals,
            Sunday: mondayMeals,
          },
        });

        // Create demo nutrition logs for the past 3 days
        const today = new Date();

        for (let i = 0; i < 3; i++) {
          const logDate = new Date(today);
          logDate.setDate(logDate.getDate() - i);
          const dateStr = logDate.toISOString().split('T')[0];

          this.createNutritionLog({
            userId: memberUser.id,
            userName: memberUser.name,
            mealPlanId: demoMealPlan.id,
            date: dateStr,
            meals: [
              {
                name: 'Protein Oatmeal Bowl',
                type: 'Breakfast',
                calories: 550,
                protein: 35,
                carbs: 70,
                fats: 15,
              },
              {
                name: 'Grilled Chicken & Rice',
                type: 'Lunch',
                calories: 700,
                protein: 55,
                carbs: 80,
                fats: 12,
              },
              {
                name: 'Greek Yogurt & Berries',
                type: 'Snack',
                calories: 250,
                protein: 20,
                carbs: 35,
                fats: 5,
              },
              {
                name: 'Salmon & Sweet Potato',
                type: 'Dinner',
                calories: 650,
                protein: 50,
                carbs: 60,
                fats: 20,
              },
            ],
            waterIntake: 2500, // 2.5L
            notes: i === 0 ? 'Felt great today! Energy levels were high.' : undefined,
          });
        }

        console.log('✅ Demo meal plans and nutrition logs initialized');
      }
    }
  }
}

export const db = MockDatabase.getInstance();

// Initialize demo data on first load
db.initializeDemoData();
