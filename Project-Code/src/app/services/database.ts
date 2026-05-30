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

class MockDatabase {
  private USERS_KEY = 'fithub_users';
  private MEMBERSHIPS_KEY = 'fithub_memberships';
  private TRANSACTIONS_KEY = 'fithub_transactions';
  private GOALS_KEY = 'fithub_goals';
  private CLASSES_KEY = 'fithub_classes';
  private BOOKINGS_KEY = 'fithub_bookings';
  private PROGRAMS_KEY = 'fithub_programs';
  private TASKS_KEY = 'fithub_tasks';

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
  }
}

export const db = new MockDatabase();

// Initialize demo data on first load
db.initializeDemoData();
