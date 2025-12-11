<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Eduno CRM - Student Attendance Management System

A modern, AI-powered attendance management system with real-time tracking, geofencing, and intelligent insights.

## Features

- 🎯 Real-time attendance tracking with geofencing
- 🤖 AI-powered insights using Google Gemini
- 📊 Comprehensive dashboard with analytics
- 🔐 Role-based access control (Super Admin, Admin, HOD, Teacher, Student)
- 📱 Responsive design for web and mobile
- 🚀 Ready for Vercel deployment

## Prerequisites

- Node.js 18+ and npm
- Gemini API key (for AI Insights feature) - [Get it here](https://aistudio.google.com/app/apikey)
- (Optional) Supabase account for production database

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or copy from `env.sample`):

```env
# Required for AI Insights feature
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Leave empty to use local mock data for testing
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

**Getting your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in terminal).

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. Environment variables prefixed with `VITE_` are automatically embedded at build time.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel Dashboard:
   - Go to your project settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your API key
   - (Optional) Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` if using Supabase

5. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub

2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)

3. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `VITE_GEMINI_API_KEY` = `your_gemini_api_key`
     - `VITE_SUPABASE_URL` = `your_supabase_url` (optional)
     - `VITE_SUPABASE_KEY` = `your_supabase_key` (optional)

4. Deploy! Vercel will automatically build and deploy your app.

### Important Notes for Vercel Deployment

- ✅ Environment variables prefixed with `VITE_` are embedded at **build time**
- ✅ Make sure to add all required env vars in Vercel Dashboard before deploying
- ✅ The `vercel.json` file is already configured for optimal deployment
- ✅ After adding/changing env vars, trigger a new deployment

## Project Structure

```
eduno/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── AttendanceScanner.tsx
│   ├── GeminiInsights.tsx
│   └── Layout.tsx
├── services/           # Business logic
│   ├── db.ts           # Database service (Supabase/Mock)
│   ├── geminiService.ts # AI insights service
│   └── mockData.ts     # Mock data for local testing
├── App.tsx             # Main application component
├── index.tsx           # Entry point
├── vite.config.ts      # Vite configuration
├── vercel.json         # Vercel deployment config
└── .env                # Environment variables (not committed)
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Yes (for AI features) | Google Gemini API key for AI insights |
| `VITE_SUPABASE_URL` | No | Supabase project URL (uses mock data if not set) |
| `VITE_SUPABASE_KEY` | No | Supabase anon/service role key (uses mock data if not set) |

## Troubleshooting

### No data showing in the app?

**If using Supabase:**
- Supabase starts with empty tables - you need to seed the database
- See `SUPABASE_SETUP.md` for detailed instructions
- Run `npm run seed:supabase` to populate with mock data
- Make sure tables and RLS policies are set up correctly

**If using Mock Data:**
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are **empty** in `.env`
- Mock data is in-memory and resets on page refresh
- This is normal behavior for local development

### AI Insights not working?
- Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file
- Verify the API key is valid and has proper permissions
- Check browser console for error messages

### Build fails?
- Make sure all dependencies are installed: `npm install`
- Check that Node.js version is 18 or higher
- Verify environment variables are correctly formatted in `.env`

### Vercel deployment issues?
- Ensure all `VITE_*` environment variables are set in Vercel Dashboard
- Check build logs in Vercel Dashboard for specific errors
- Verify `vercel.json` is present in the project root

### Supabase column errors?
- The app automatically maps between camelCase (TypeScript) and snake_case (Supabase)
- Make sure your Supabase tables use snake_case column names as documented in `services/db.ts`

## License

This project is part of the Eduno CRM system.
