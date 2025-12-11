# Push Code to GitHub - Instructions

## Current Status
✅ All code is committed locally (4 commits ready to push)
✅ Remote repository configured: `https://github.com/HarishKumar997/eduno.git`
❌ Push failed due to authentication

## Commits Ready to Push
1. `4bb055d` - Update .gitignore to include IDE settings for git detection
2. `8d182a0` - Add IDE git configuration to fix repository detection
3. `827ceeb` - Update .gitignore and add Git setup guide
4. `f9be81e` - Initial commit: Eduno CRM - Student Attendance Management System with AI Insights

## Step 1: Create Repository on GitHub (If Not Exists)

1. Go to: https://github.com/new
2. Repository name: `eduno`
3. Owner: `HarishKumar997`
4. Visibility: Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Authenticate and Push

### Option A: Using Personal Access Token (Recommended)

1. **Generate Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "Eduno Project"
   - Expiration: Choose your preference (90 days recommended)
   - Select scopes: ✅ `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push using token**:
   ```bash
   git push -u origin main
   ```
   - When prompted for **Username**: Enter `HarishKumar997`
   - When prompted for **Password**: **Paste your Personal Access Token** (NOT your GitHub password)

### Option B: Using SSH Key

1. **Check if SSH key exists**:
   ```bash
   ls ~/.ssh/id_rsa.pub
   # or
   ls ~/.ssh/id_ed25519.pub
   ```

2. **If no SSH key, generate one**:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Optionally set a passphrase
   ```

3. **Copy your public key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the entire output
   ```

4. **Add SSH key to GitHub**:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "Eduno Project"
   - Key: Paste your public key
   - Click "Add SSH key"

5. **Test SSH connection**:
   ```bash
   ssh -T git@github.com
   ```

6. **Update remote to use SSH**:
   ```bash
   git remote set-url origin git@github.com:HarishKumar997/eduno.git
   ```

7. **Push**:
   ```bash
   git push -u origin main
   ```

### Option C: Using GitHub CLI (Easiest)

If you have GitHub CLI installed:

```bash
gh auth login
gh repo create HarishKumar997/eduno --public --source=. --remote=origin --push
```

## Step 3: Verify Push

After successful push:
1. Visit: https://github.com/HarishKumar997/eduno
2. You should see all your files and commits
3. Check that all 4 commits are visible

## Troubleshooting

### "Repository not found"
- Make sure the repository exists on GitHub
- Verify the repository name is exactly: `eduno`
- Check you're logged into the correct GitHub account

### "Permission denied" (SSH)
- Verify your SSH key is added to GitHub
- Test connection: `ssh -T git@github.com`
- Make sure the key has `repo` permissions

### "Authentication failed" (HTTPS)
- Use Personal Access Token, NOT your GitHub password
- Make sure token has `repo` scope
- Token might have expired - generate a new one

### "Remote repository already exists"
- The repository might already exist on GitHub
- Try: `git push -u origin main --force` (⚠️ Only if you're sure!)

## Quick Command Reference

```bash
# Check status
git status

# View commits
git log --oneline

# Check remote
git remote -v

# Push (after authentication)
git push -u origin main

# For future updates
git add .
git commit -m "Your message"
git push
```

## What's Being Pushed

✅ All source code (App.tsx, components, services)
✅ Configuration files (package.json, vite.config.ts, etc.)
✅ Documentation (README.md, DEPLOYMENT.md, SUPABASE_SETUP.md)
✅ Scripts (seed-supabase.ts)
✅ Sample environment file (env.sample)
✅ Git configuration (.gitignore, .vscode/settings.json)

❌ NOT pushed (protected by .gitignore):
- `.env` file (contains API keys)
- `node_modules/`
- `dist/` folder
- `.zip` files

