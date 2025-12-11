# Vercel Deployment Checklist

## Pre-Deployment Steps

### 1. Get Your Gemini API Key
- [ ] Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Sign in with your Google account
- [ ] Click "Create API Key"
- [ ] Copy the generated API key

### 2. Update Local .env File
- [ ] Open `.env` file in the project root
- [ ] Replace `your_gemini_api_key_here` with your actual Gemini API key
- [ ] (Optional) Add Supabase credentials if using production database

### 3. Test Locally
- [ ] Run `npm run build` to verify build succeeds
- [ ] Run `npm run dev` to test the application
- [ ] Verify AI Insights feature works (requires valid API key)

## Vercel Deployment

### Method 1: Vercel CLI (Recommended for first-time setup)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - Choose your preferred settings

4. **Add Environment Variables**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Environment Variables
   - Add the following:
     ```
     VITE_GEMINI_API_KEY = your_actual_gemini_api_key
     VITE_SUPABASE_URL = your_supabase_url (optional)
     VITE_SUPABASE_KEY = your_supabase_key (optional)
     ```
   - Make sure to select "Production", "Preview", and "Development" environments

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Method 2: GitHub Integration (Recommended for CI/CD)

1. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin your-github-repo-url
     git push -u origin main
     ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
   - In project settings, add:
     - `VITE_GEMINI_API_KEY`
     - `VITE_SUPABASE_URL` (optional)
     - `VITE_SUPABASE_KEY` (optional)
   - Select all environments (Production, Preview, Development)

4. **Deploy**
   - Vercel will automatically deploy
   - Every push to main branch triggers a production deployment
   - Pull requests get preview deployments

## Post-Deployment Verification

- [ ] Visit your deployed URL
- [ ] Test login functionality
- [ ] Verify AI Insights feature works
- [ ] Check browser console for any errors
- [ ] Test attendance scanning (if applicable)

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Check that variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding/changing environment variables

### AI Insights Not Working After Deployment
- Verify `VITE_GEMINI_API_KEY` is set in Vercel Dashboard
- Check that the API key is valid and not expired
- Review browser console for API errors
- Ensure CORS is properly configured (should be automatic with Vite)

## Important Notes

⚠️ **Security**: Never commit `.env` file to Git. It's already in `.gitignore`.

✅ **Build Time**: Environment variables are embedded at build time, not runtime. You must redeploy after changing env vars.

✅ **VITE_ Prefix**: Only variables prefixed with `VITE_` are exposed to the client. This is by design for security.

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Review Vite environment variables: https://vitejs.dev/guide/env-and-mode.html

