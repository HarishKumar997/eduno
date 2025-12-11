# Vercel Deployment Guide

This guide will help you deploy the Eduno CRM application to Vercel.

## Quick Start

### Method 1: GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Configure Environment Variables**
   - In the project settings, go to **Environment Variables**
   - Add the following variables:
     ```
     VITE_GEMINI_API_KEY = your_gemini_api_key_here
     VITE_SUPABASE_URL = your_supabase_url (optional)
     VITE_SUPABASE_KEY = your_supabase_key (optional)
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI

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
   cd eduno
   vercel
   ```
   - Follow the prompts to link your project
   - For first deployment, choose default settings

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_KEY
   ```
   Or add them via the Vercel Dashboard

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Configuration Details

### Build Settings (Auto-detected by Vercel)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

**Required:**
- `VITE_GEMINI_API_KEY` - Google Gemini API key for AI insights

**Optional:**
- `VITE_SUPABASE_URL` - Supabase project URL (if using Supabase backend)
- `VITE_SUPABASE_KEY` - Supabase anon/service role key (if using Supabase backend)

**Note:** If Supabase variables are not set, the app will use mock data.

### Routing Configuration

The `vercel.json` file is configured to:
- Handle SPA routing (all routes redirect to `index.html`)
- Cache static assets for optimal performance
- Set security headers

### Custom Domain

1. Go to your project settings in Vercel Dashboard
2. Navigate to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Post-Deployment Checklist

- [ ] Environment variables are set in Vercel Dashboard
- [ ] Build completed successfully (check build logs)
- [ ] Application is accessible at the deployment URL
- [ ] AI Insights feature works (verify Gemini API key)
- [ ] If using Supabase, verify database connection
- [ ] Test all major features (attendance tracking, dashboard, etc.)

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required `VITE_*` variables in Vercel Dashboard
- Redeploy after adding variables

**Error: Module not found**
- Solution: Ensure `package.json` has all dependencies
- Run `npm install` locally to verify

**Error: Build timeout**
- Solution: Check build logs for specific errors
- Ensure Node.js version is compatible (18+)

### Runtime Errors

**AI Insights not working**
- Check that `VITE_GEMINI_API_KEY` is set correctly
- Verify the API key is valid and has proper permissions
- Check browser console for errors

**No data showing**
- If using Supabase: Ensure database is seeded and tables exist
- If using mock data: Ensure Supabase env vars are empty
- Check browser console for API errors

**404 errors on routes**
- Verify `vercel.json` has the correct rewrite rules
- Ensure SPA routing is configured

### Performance Issues

**Slow initial load**
- Check build output size
- Verify assets are being cached (check Network tab)
- Consider enabling Vercel Edge Functions if needed

## Updating Your Deployment

### Automatic Updates (GitHub Integration)

- Push to `main` branch → Auto-deploys to production
- Push to other branches → Creates preview deployments
- Create Pull Request → Creates preview deployment

### Manual Updates (CLI)

```bash
vercel --prod
```

## Monitoring

- **Analytics**: Enable in Vercel Dashboard → Analytics
- **Logs**: View real-time logs in Vercel Dashboard → Deployments
- **Performance**: Check Web Vitals in Vercel Dashboard

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use Vercel Environment Variables** - Never hardcode secrets
3. **Rotate API keys regularly** - Update in Vercel Dashboard
4. **Enable Vercel Security Headers** - Already configured in `vercel.json`

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

For application-specific issues:
- Check the main `README.md`
- Review `SUPABASE_SETUP.md` if using Supabase

