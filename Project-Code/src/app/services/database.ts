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

class MockDatabase {
  private USERS_KEY = 'fithub_users';
  private MEMBERSHIPS_KEY = 'fithub_memberships';
  private TRANSACTIONS_KEY = 'fithub_transactions';
  private GOALS_KEY = 'fithub_goals';

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
    }
  }
}

export const db = new MockDatabase();

// Initialize demo data on first load
db.initializeDemoData();
