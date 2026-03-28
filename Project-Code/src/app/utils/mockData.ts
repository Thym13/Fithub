// Mock data for FitHub CRM system

export const mockMembers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-15',
    expiryDate: '2026-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    trainer: 'Sarah Johnson',
    lastCheckIn: '2026-03-19',
    totalVisits: 145
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 234-5678',
    membershipType: 'Standard',
    status: 'Active',
    joinDate: '2024-06-20',
    expiryDate: '2026-06-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    trainer: 'Mike Chen',
    lastCheckIn: '2026-03-20',
    totalVisits: 89
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2023-11-10',
    expiryDate: '2025-11-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    trainer: 'Sarah Johnson',
    lastCheckIn: '2026-03-18',
    totalVisits: 234
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '(555) 456-7890',
    membershipType: 'Basic',
    status: 'Expiring Soon',
    joinDate: '2025-03-25',
    expiryDate: '2026-03-25',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    trainer: 'Mike Chen',
    lastCheckIn: '2026-03-17',
    totalVisits: 42
  },
  {
    id: '5',
    name: 'David Martinez',
    email: 'david.martinez@email.com',
    phone: '(555) 567-8901',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2024-09-05',
    expiryDate: '2026-09-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    trainer: 'Sarah Johnson',
    lastCheckIn: '2026-03-20',
    totalVisits: 112
  }
];

export const mockClasses = [
  {
    id: '1',
    name: 'Morning Yoga',
    instructor: 'Sarah Johnson',
    time: '07:00 AM',
    duration: '60 min',
    capacity: 20,
    enrolled: 15,
    day: 'Monday',
    category: 'Yoga'
  },
  {
    id: '2',
    name: 'HIIT Training',
    instructor: 'Mike Chen',
    time: '06:00 PM',
    duration: '45 min',
    capacity: 15,
    enrolled: 15,
    day: 'Monday',
    category: 'Cardio'
  },
  {
    id: '3',
    name: 'Spin Class',
    instructor: 'Lisa Anderson',
    time: '05:30 PM',
    duration: '45 min',
    capacity: 25,
    enrolled: 22,
    day: 'Tuesday',
    category: 'Cycling'
  },
  {
    id: '4',
    name: 'CrossFit',
    instructor: 'Mike Chen',
    time: '07:00 AM',
    duration: '60 min',
    capacity: 12,
    enrolled: 10,
    day: 'Wednesday',
    category: 'Strength'
  },
  {
    id: '5',
    name: 'Pilates',
    instructor: 'Sarah Johnson',
    time: '09:00 AM',
    duration: '50 min',
    capacity: 18,
    enrolled: 14,
    day: 'Thursday',
    category: 'Pilates'
  },
  {
    id: '6',
    name: 'Zumba',
    instructor: 'Lisa Anderson',
    time: '07:00 PM',
    duration: '55 min',
    capacity: 30,
    enrolled: 28,
    day: 'Friday',
    category: 'Dance'
  }
];

export const mockStaff = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Trainer',
    email: 'sarah.j@fithub.com',
    phone: '(555) 111-2222',
    status: 'Active',
    hireDate: '2023-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
    clients: 28,
    specialization: 'Yoga & Pilates'
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Trainer',
    email: 'mike.c@fithub.com',
    phone: '(555) 222-3333',
    status: 'Active',
    hireDate: '2023-03-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeC',
    clients: 24,
    specialization: 'HIIT & CrossFit'
  },
  {
    id: '3',
    name: 'Lisa Anderson',
    role: 'Trainer',
    email: 'lisa.a@fithub.com',
    phone: '(555) 333-4444',
    status: 'Active',
    hireDate: '2022-11-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaA',
    clients: 32,
    specialization: 'Cycling & Dance'
  },
  {
    id: '4',
    name: 'Rachel Green',
    role: 'Receptionist',
    email: 'rachel.g@fithub.com',
    phone: '(555) 444-5555',
    status: 'Active',
    hireDate: '2024-02-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RachelG'
  },
  {
    id: '5',
    name: 'Tom Wilson',
    role: 'Manager',
    email: 'tom.w@fithub.com',
    phone: '(555) 555-6666',
    status: 'Active',
    hireDate: '2022-06-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TomW'
  }
];

export const mockPayments = [
  {
    id: '1',
    memberName: 'John Smith',
    amount: 99.99,
    type: 'Monthly Membership',
    status: 'Paid',
    date: '2026-03-01',
    method: 'Credit Card'
  },
  {
    id: '2',
    memberName: 'Emily Davis',
    amount: 59.99,
    type: 'Monthly Membership',
    status: 'Paid',
    date: '2026-03-05',
    method: 'Debit Card'
  },
  {
    id: '3',
    memberName: 'Michael Brown',
    amount: 99.99,
    type: 'Monthly Membership',
    status: 'Paid',
    date: '2026-03-10',
    method: 'Bank Transfer'
  },
  {
    id: '4',
    memberName: 'Sarah Wilson',
    amount: 39.99,
    type: 'Monthly Membership',
    status: 'Pending',
    date: '2026-03-15',
    method: 'Credit Card'
  },
  {
    id: '5',
    memberName: 'David Martinez',
    amount: 150.00,
    type: 'Personal Training (5 sessions)',
    status: 'Paid',
    date: '2026-03-18',
    method: 'Credit Card'
  }
];

export const mockRevenueData = [
  { month: 'Sep', revenue: 24500, members: 145 },
  { month: 'Oct', revenue: 27800, members: 156 },
  { month: 'Nov', revenue: 29200, members: 162 },
  { month: 'Dec', revenue: 31500, members: 175 },
  { month: 'Jan', revenue: 35200, members: 188 },
  { month: 'Feb', revenue: 38600, members: 201 },
  { month: 'Mar', revenue: 42100, members: 218 }
];

export const mockCheckIns = [
  {
    id: '1',
    memberName: 'John Smith',
    memberId: '1',
    time: '08:45 AM',
    date: '2026-03-20',
    status: 'Checked In'
  },
  {
    id: '2',
    memberName: 'Emily Davis',
    memberId: '2',
    time: '09:15 AM',
    date: '2026-03-20',
    status: 'Checked In'
  },
  {
    id: '3',
    memberName: 'David Martinez',
    memberId: '5',
    time: '10:30 AM',
    date: '2026-03-20',
    status: 'Checked In'
  }
];

export const mockTrainerClients = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    program: 'Muscle Building',
    nextSession: '2026-03-21 10:00 AM',
    progress: 75,
    goals: 'Build muscle, increase strength',
    startWeight: 180,
    currentWeight: 175,
    targetWeight: 170
  },
  {
    id: '3',
    name: 'Michael Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    program: 'Weight Loss',
    nextSession: '2026-03-22 02:00 PM',
    progress: 60,
    goals: 'Lose weight, improve cardio',
    startWeight: 220,
    currentWeight: 205,
    targetWeight: 190
  },
  {
    id: '5',
    name: 'David Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    program: 'Athletic Performance',
    nextSession: '2026-03-20 04:00 PM',
    progress: 85,
    goals: 'Improve endurance, speed',
    startWeight: 165,
    currentWeight: 168,
    targetWeight: 170
  }
];

export const mockMembershipPlans = [
  {
    id: '1',
    name: 'Basic',
    price: 39.99,
    duration: 'Monthly',
    features: ['Gym Access', 'Locker Room'],
    activeMembers: 45
  },
  {
    id: '2',
    name: 'Standard',
    price: 59.99,
    duration: 'Monthly',
    features: ['Gym Access', 'Group Classes', 'Locker Room', 'Shower Facilities'],
    activeMembers: 89
  },
  {
    id: '3',
    name: 'Premium',
    price: 99.99,
    duration: 'Monthly',
    features: ['Gym Access', 'Group Classes', 'Personal Training (2/month)', 'Nutrition Consultation', 'All Facilities'],
    activeMembers: 84
  }
];

export const userRoles = [
  { id: 'owner', name: 'Gym Owner', icon: '👔' },
  { id: 'manager', name: 'Manager', icon: '⚙️' },
  { id: 'receptionist', name: 'Receptionist', icon: '🎯' },
  { id: 'trainer', name: 'Trainer', icon: '💪' },
  { id: 'member', name: 'Member', icon: '🏃' }
];