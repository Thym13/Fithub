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

class MockDatabase {
  private USERS_KEY = 'fithub_users';
  private MEMBERSHIPS_KEY = 'fithub_memberships';
  private TRANSACTIONS_KEY = 'fithub_transactions';
  private GOALS_KEY = 'fithub_goals';
  private CLASSES_KEY = 'fithub_classes';
  private BOOKINGS_KEY = 'fithub_bookings';

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
  }
}

export const db = new MockDatabase();

// Initialize demo data on first load
db.initializeDemoData();
