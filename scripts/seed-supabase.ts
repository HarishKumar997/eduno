/**
 * Seed Supabase Database with Mock Data
 * 
 * This script populates your Supabase database with the same mock data
 * that's used in the MockService for local development.
 * 
 * Usage:
 *   1. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set in .env
 *   2. Run: npm run seed:supabase
 * 
 * Note: This script maps camelCase TypeScript types to snake_case Supabase columns
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { INITIAL_USERS, INITIAL_LOGS, INITIAL_RECORDS } from '../services/mockData';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value && !key.startsWith('#')) {
        process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });
} catch (error) {
  console.warn('⚠️  Could not read .env file, using process.env');
}

// Also try dotenv as fallback
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_KEY must be set in .env file');
  console.error('   Current values:');
  console.error(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}`);
  console.error(`   VITE_SUPABASE_KEY: ${supabaseKey ? '✓ Set' : '✗ Missing'}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Seed Users
    console.log('📝 Seeding users...');
    const usersToInsert = INITIAL_USERS.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar_url: user.avatarUrl || null,
    }));

    const { error: usersError } = await supabase
      .from('users')
      .upsert(usersToInsert, { onConflict: 'id' });

    if (usersError) {
      console.error('❌ Error seeding users:', usersError);
      throw usersError;
    }
    console.log(`✅ Inserted ${usersToInsert.length} users\n`);

    // 2. Seed Attendance Records
    console.log('📊 Seeding attendance records...');
    const recordsToInsert = INITIAL_RECORDS.map(record => ({
      id: record.id,
      user_id: record.userId,
      user_name: record.userName,
      department: record.department,
      check_in_time: record.checkInTime,
      check_out_time: record.checkOutTime || null,
      location: record.location,
      date: record.date,
      status: record.status,
    }));

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < recordsToInsert.length; i += batchSize) {
      const batch = recordsToInsert.slice(i, i + batchSize);
      const { error: recordsError } = await supabase
        .from('attendance_records')
        .upsert(batch, { onConflict: 'id' });

      if (recordsError) {
        console.error('❌ Error seeding attendance records:', recordsError);
        throw recordsError;
      }
      inserted += batch.length;
      console.log(`   Processed ${inserted}/${recordsToInsert.length} records...`);
    }
    console.log(`✅ Inserted ${recordsToInsert.length} attendance records\n`);

    // 3. Seed Audit Logs
    console.log('📋 Seeding audit logs...');
    const logsToInsert = INITIAL_LOGS.map(log => ({
      id: log.id,
      action: log.action,
      performed_by: log.performedBy,
      timestamp: log.timestamp,
      details: log.details,
    }));

    const { error: logsError } = await supabase
      .from('audit_logs')
      .upsert(logsToInsert, { onConflict: 'id' });

    if (logsError) {
      console.error('❌ Error seeding audit logs:', logsError);
      throw logsError;
    }
    console.log(`✅ Inserted ${logsToInsert.length} audit logs\n`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${usersToInsert.length}`);
    console.log(`   - Attendance Records: ${recordsToInsert.length}`);
    console.log(`   - Audit Logs: ${logsToInsert.length}`);
    console.log('\n✨ You can now use Supabase with your mock data!');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();

