import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AttendanceRecord, AuditLog, User } from '../types';
import { INITIAL_USERS, INITIAL_LOGS, INITIAL_RECORDS } from './mockData';

/**
 * --- CROSS-PLATFORM SCHEMA CONTRACT ---
 * 
 * This schema is designed to be consumed by:
 * 1. React Web App (this project)
 * 2. Flutter Mobile App (via supabase_flutter)
 * 3. iOS Native App (via Supabase-swift)
 * 
 * TABLE: users
 * - id: uuid (Primary Key)
 * - name: text
 * - email: text
 * - role: text (Enum: SUPER_ADMIN, ADMIN, HOD, TEACHER, STUDENT)
 * - department: text
 * - avatar_url: text
 * 
 * TABLE: attendance_records
 * - id: uuid (Primary Key)
 * - user_id: uuid (Foreign Key -> users.id)
 * - user_name: text (Denormalized for performance)
 * - department: text
 * - check_in_time: timestamptz (ISO 8601)
 * - check_out_time: timestamptz (Nullable)
 * - location: jsonb (Structure: { "lat": double, "lng": double })
 * - date: date (YYYY-MM-DD)
 * - status: text (Enum: PRESENT, ABSENT, LATE)
 * 
 * TABLE: audit_logs
 * - id: uuid (Primary Key)
 * - action: text
 * - performed_by: text
 * - timestamp: timestamptz
 * - details: text
 */

// Interface defining our Data Layer
export interface DataService {
  type: 'SUPABASE' | 'MOCK';
  getUsers: () => Promise<User[]>;
  getAttendance: () => Promise<AttendanceRecord[]>;
  markAttendance: (record: AttendanceRecord) => Promise<void>;
  updateAttendance: (record: AttendanceRecord) => Promise<void>;
  getLogs: () => Promise<AuditLog[]>;
  logAction: (log: AuditLog) => Promise<void>;
  subscribeToAttendance: (callback: (payload: any) => void) => () => void;
}

// --- 1. Supabase Implementation (Production / Native Compatible) ---
class SupabaseService implements DataService {
  type = 'SUPABASE' as const;
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  // Helper: Map camelCase TypeScript types to snake_case Supabase columns
  private mapUserToDb(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar_url: user.avatarUrl || null,
    };
  }

  private mapUserFromDb(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      avatarUrl: data.avatar_url,
    };
  }

  private mapRecordToDb(record: AttendanceRecord) {
    return {
      id: record.id,
      user_id: record.userId,
      user_name: record.userName,
      department: record.department,
      check_in_time: record.checkInTime,
      check_out_time: record.checkOutTime || null,
      location: record.location,
      date: record.date,
      status: record.status,
    };
  }

  private mapRecordFromDb(data: any): AttendanceRecord {
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      department: data.department,
      checkInTime: data.check_in_time,
      checkOutTime: data.check_out_time,
      location: data.location,
      date: data.date,
      status: data.status,
    };
  }

  private mapLogToDb(log: AuditLog) {
    return {
      id: log.id,
      action: log.action,
      performed_by: log.performedBy,
      timestamp: log.timestamp,
      details: log.details,
    };
  }

  private mapLogFromDb(data: any): AuditLog {
    return {
      id: data.id,
      action: data.action,
      performedBy: data.performed_by,
      timestamp: data.timestamp,
      details: data.details,
    };
  }

  async getUsers() {
    const { data, error } = await this.client.from('users').select('*');
    if (error) throw error;
    return (data || []).map(d => this.mapUserFromDb(d));
  }

  async getAttendance() {
    const { data, error } = await this.client.from('attendance_records').select('*').order('check_in_time', { ascending: false });
    if (error) throw error;
    return (data || []).map(d => this.mapRecordFromDb(d));
  }

  async markAttendance(record: AttendanceRecord) {
    // Ideally, let the DB generate the UUID, but for offline-first support in mobile apps, 
    // client-side UUID generation is standard practice.
    const dbRecord = this.mapRecordToDb(record);
    const { error } = await this.client.from('attendance_records').insert(dbRecord);
    if (error) throw error;
  }

  async updateAttendance(record: AttendanceRecord) {
    const { error } = await this.client
      .from('attendance_records')
      .update({ 
        check_out_time: record.checkOutTime || null, 
        status: record.status 
      })
      .eq('id', record.id);
    if (error) throw error;
  }

  async getLogs() {
    const { data, error } = await this.client.from('audit_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return (data || []).map(d => this.mapLogFromDb(d));
  }

  async logAction(log: AuditLog) {
    const dbLog = this.mapLogToDb(log);
    const { error } = await this.client.from('audit_logs').insert(dbLog);
    if (error) console.error('Failed to log action', error);
  }

  subscribeToAttendance(callback: (payload: any) => void) {
    // Realtime subscriptions work identically in Flutter/Swift SDKs
    const channel = this.client
      .channel('attendance-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, (payload) => {
        // Map snake_case from Supabase to camelCase for the app
        if (payload.new) {
          callback(this.mapRecordFromDb(payload.new));
        }
      })
      .subscribe();

    return () => {
      this.client.removeChannel(channel);
    };
  }
}

// --- 2. Mock Implementation (Fallback) ---
// Uses BroadcastChannel to simulate realtime sync across tabs
class MockService implements DataService {
  type = 'MOCK' as const;
  private users = [...INITIAL_USERS];
  private records = [...INITIAL_RECORDS];
  private logs = [...INITIAL_LOGS];
  private channel = new BroadcastChannel('attendflow_mock_channel');

  async getUsers() {
    return new Promise<User[]>(resolve => setTimeout(() => resolve([...this.users]), 500));
  }

  async getAttendance() {
    // SORTING FIX: Simulate DB 'ORDER BY check_in_time DESC'
    // This ensures the dashboard sees mixed records from all students chronologically,
    // rather than grouped by student ID, making the "Live Radar" look realistic.
    return new Promise<AttendanceRecord[]>(resolve => {
        setTimeout(() => {
            const sorted = [...this.records].sort((a, b) => 
                new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
            );
            resolve(sorted);
        }, 600);
    });
  }

  async markAttendance(record: AttendanceRecord) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.records.unshift(record);
        this.channel.postMessage({ type: 'ATTENDANCE_UPDATE', record });
        resolve();
      }, 800);
    });
  }

  async updateAttendance(record: AttendanceRecord) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const index = this.records.findIndex(r => r.id === record.id);
        if (index !== -1) {
            this.records[index] = record;
            this.channel.postMessage({ type: 'ATTENDANCE_UPDATE', record });
        }
        resolve();
      }, 800);
    });
  }

  async getLogs() {
    return new Promise<AuditLog[]>(resolve => setTimeout(() => resolve([...this.logs]), 500));
  }

  async logAction(log: AuditLog) {
    return new Promise<void>(resolve => {
      this.logs.unshift(log);
      resolve();
    });
  }

  subscribeToAttendance(callback: (payload: any) => void) {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ATTENDANCE_UPDATE') {
        callback(event.data.record);
      }
    };
    this.channel.addEventListener('message', handler);
    return () => this.channel.removeEventListener('message', handler);
  }
}

// --- Factory ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const db: DataService = (supabaseUrl && supabaseKey)
  ? new SupabaseService(supabaseUrl, supabaseKey)
  : new MockService();