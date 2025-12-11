# Supabase Setup Guide

## Understanding the Data Flow

The application uses **mock data by default** when Supabase credentials are not configured. Here's how it works:

### Two Modes of Operation

1. **Mock Mode** (Default)
   - When `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are **empty** in `.env`
   - Uses in-memory mock data from `services/mockData.ts`
   - Perfect for local development and testing
   - Data resets on page refresh

2. **Supabase Mode** (Production)
   - When `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are **set** in `.env`
   - Connects to your Supabase database
   - Data persists across sessions
   - **Requires database to be seeded with initial data**

## Why Your Supabase Database is Empty

If you've configured Supabase credentials but see no data, it's because:
- Supabase starts with empty tables
- The mock data only exists in the `MockService` (in-memory)
- You need to **seed** your Supabase database with the mock data

## Solution: Seed Your Supabase Database

### Step 1: Create Supabase Tables

First, create the tables in your Supabase project. Go to SQL Editor and run:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar_url TEXT
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  department TEXT NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  location JSONB NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  details TEXT NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON attendance_records(check_in_time);
```

### Step 2: Configure Row Level Security (RLS)

For the app to work, you need to configure RLS policies. In Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your security needs)
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read on attendance_records" ON attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public read on audit_logs" ON audit_logs FOR SELECT USING (true);

-- Allow public insert/update (adjust based on your security needs)
CREATE POLICY "Allow public insert on attendance_records" ON attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_records" ON attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);
```

### Step 3: Seed the Database

Run the seed script to populate your database with mock data:

```bash
npm run seed:supabase
```

This will:
- Insert all users from mock data
- Insert all attendance records (last 60 days)
- Insert initial audit logs

### Step 4: Verify

1. Check your Supabase dashboard → Table Editor
2. You should see data in `users`, `attendance_records`, and `audit_logs` tables
3. Refresh your app - it should now show data from Supabase!

## Column Name Mapping

**Important**: The application code uses **camelCase** (TypeScript convention), but Supabase uses **snake_case** (SQL convention).

The mapping is:
- TypeScript → Supabase
- `userId` → `user_id`
- `userName` → `user_name`
- `checkInTime` → `check_in_time`
- `checkOutTime` → `check_out_time`
- `avatarUrl` → `avatar_url`
- `performedBy` → `performed_by`

The seed script handles this mapping automatically.

## Troubleshooting

### "No data in Supabase"
- ✅ Make sure tables are created (Step 1)
- ✅ Make sure RLS policies allow access (Step 2)
- ✅ Run the seed script (Step 3)
- ✅ Check Supabase dashboard to verify data exists

### "RLS Policy Error"
- Check that RLS policies are set up correctly
- For development, you can temporarily disable RLS:
  ```sql
  ALTER TABLE users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
  ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
  ```
  ⚠️ **Never disable RLS in production!**

### "Column doesn't exist" errors
- Verify table structure matches the schema in `services/db.ts`
- Check that column names use snake_case in Supabase

### Want to use Mock Data instead?
Simply **remove or empty** the Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```
The app will automatically switch to mock data mode.

## Next Steps

After seeding:
1. Your app will use Supabase for data storage
2. All new attendance records will be saved to Supabase
3. Data persists across sessions and devices
4. You can view/manage data in Supabase Dashboard

