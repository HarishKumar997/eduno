export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN', // Dept Admin
  HOD = 'HOD',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum Department {
  CS = 'Computer Science',
  EE = 'Electrical Engineering',
  ME = 'Mechanical Engineering',
  BA = 'Business Administration',
  ALL = 'All Departments'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  department: Department;
  checkInTime: string; // ISO String
  checkOutTime?: string; // ISO String
  location: {
    lat: number;
    lng: number;
  };
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string; // User Name
  timestamp: string;
  details: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  attendanceRecords: AttendanceRecord[];
  auditLogs: AuditLog[];
}