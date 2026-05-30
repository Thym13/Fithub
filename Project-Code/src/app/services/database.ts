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

  // Utility Methods

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateVerificationToken(): string {
    return Math.random().toString(36).substr(2, 32) + Date.now().toString(36);
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
  }
}

export const db = MockDatabase.getInstance();

// Initialize demo data on first load
db.initializeDemoData();
