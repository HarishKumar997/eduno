import { User, UserRole, Department, AttendanceRecord, AuditLog } from '../types';

// Configuration for "Proportional Responsibility"
const DEPT_SIZES = {
  [Department.CS]: 25, // Large Dept
  [Department.EE]: 15, // Medium Dept
  [Department.ME]: 10, // Small Dept
  [Department.BA]: 8,  // Smallest
};

// Random name pools for generating realistic student names
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas',
  'Mia', 'Jackson', 'Charlotte', 'Aiden', 'Amelia', 'Caden', 'Harper', 'Logan', 'Evelyn', 'Maya',
  'James', 'Benjamin', 'Henry', 'Alexander', 'Michael', 'Daniel', 'Matthew', 'David', 'Joseph', 'William',
  'Emily', 'Madison', 'Abigail', 'Chloe', 'Elizabeth', 'Samantha', 'Grace', 'Natalie', 'Victoria', 'Hannah',
  'Ryan', 'Tyler', 'Brandon', 'Jake', 'Connor', 'Nathan', 'Dylan', 'Cameron', 'Hunter', 'Zachary',
  'Jessica', 'Ashley', 'Brittany', 'Amanda', 'Melissa', 'Nicole', 'Stephanie', 'Rachel', 'Lauren', 'Michelle'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
  'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris'
];

// Generate a random name for a student
const getRandomName = (seed: number): string => {
  // Use seed for deterministic randomness (same seed = same name)
  const firstIndex = seed % FIRST_NAMES.length;
  const lastIndex = (seed * 7) % LAST_NAMES.length;
  return `${FIRST_NAMES[firstIndex]} ${LAST_NAMES[lastIndex]}`;
};

// --- Mock Data Generator ---
const generateMockData = () => {
  const users: User[] = [
    {
      id: 'u1',
      name: 'Eleanor Rigby',
      email: 'super@eduno.com',
      role: UserRole.SUPER_ADMIN,
      department: Department.ALL,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'u2',
      name: 'John Doe',
      email: 'admin.cs@eduno.com',
      role: UserRole.ADMIN,
      department: Department.CS,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'u3',
      name: 'Sarah Smith',
      email: 'hod.cs@eduno.com',
      role: UserRole.HOD,
      department: Department.CS,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'u4',
      name: 'Mike Ross',
      email: 'teacher.cs@eduno.com',
      role: UserRole.TEACHER,
      department: Department.CS,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const records: AttendanceRecord[] = [];
  const today = new Date();

  // Generate Students and their records
  let studentCounter = 0;
  Object.entries(DEPT_SIZES).forEach(([dept, count]) => {
    for (let s = 1; s <= count; s++) {
       studentCounter++;
       const userId = `mock-${dept}-${s}`;
       const gender = Math.random() > 0.5 ? 'women' : 'men';
       const studentName = getRandomName(studentCounter);
       const emailName = studentName.toLowerCase().replace(' ', '.');
       
       // Add User
       users.push({
         id: userId,
         name: studentName,
         email: `${emailName}@eduno.com`,
         role: UserRole.STUDENT,
         department: dept as Department,
         avatarUrl: `https://randomuser.me/api/portraits/${gender}/${s}.jpg`
       });

       // Generate Records for last 60 days
       for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const isToday = i === 0;

        let status: 'PRESENT' | 'LATE' | 'ABSENT' = 'PRESENT';
        let checkIn = '';
        let checkOut = '';

        // --- Logic for Today (Live Simulation) ---
        if (isToday) {
            // CRITICAL FOR DEMO: 
            // 1. First student of each dept (e.g. student1.cs) has NO record today.
            //    This allows the presenter to "Check In" manually.
            if (s === 1) continue;

            // 2. For others, random chance they haven't arrived yet (50%)
            if (Math.random() > 0.5) continue;

            // 3. If they are here, they are mostly PRESENT, maybe LATE
            status = Math.random() > 0.9 ? 'LATE' : 'PRESENT';
            
            // 4. IMPORTANT: Do NOT set checkOut for today. They are currently in class.
        } else {
            // --- Logic for Past Days ---
            const rand = Math.random();
            if (rand > 0.92) status = 'ABSENT';
            else if (rand > 0.80) status = 'LATE';
        }

        // Time Generation
        if (status !== 'ABSENT') {
          const baseHour = 8; // 8 AM start
          const hourOffset = status === 'LATE' ? 1 + Math.random() : Math.random() * 0.5;
          const checkInDate = new Date(date);
          checkInDate.setHours(baseHour + hourOffset, Math.floor(Math.random() * 60));
          checkIn = checkInDate.toISOString();

          // Checkout only for PAST days
          if (!isToday) {
              const checkOutDate = new Date(checkInDate);
              checkOutDate.setHours(checkInDate.getHours() + 8 + (Math.random() * 2 - 1));
              checkOut = checkOutDate.toISOString();
          }
        }

        // Get the student name from the users array
        const studentUser = users.find(u => u.id === userId);
        const studentName = studentUser ? studentUser.name : `Student ${dept} ${s}`;

        records.push({
          id: crypto.randomUUID(),
          userId: userId,
          userName: studentName,
          department: dept as Department,
          checkInTime: checkIn,
          checkOutTime: checkOut || undefined,
          location: { lat: 37.7749 + (Math.random() * 0.01), lng: -122.4194 + (Math.random() * 0.01) },
          date: dateStr,
          status: status
        });
      }
    }
  });

  return { users, records };
};

const generated = generateMockData();

export const INITIAL_USERS: User[] = generated.users;
export const INITIAL_RECORDS: AttendanceRecord[] = generated.records;

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'l1',
    action: 'SYSTEM_INIT',
    performedBy: 'System',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: 'System initialized successfully.'
  }
];