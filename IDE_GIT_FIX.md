# Fix IDE Showing Wrong Git Repository

## Problem
Your IDE (Cursor/VS Code) is showing a different repository (branch "recruit4b") instead of the eduno repository.

## Solution

### Option 1: Reload IDE Window (Easiest)

1. **Close and reopen the IDE** in the `eduno` folder
2. Or use the command palette:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: "Reload Window"
   - Select "Developer: Reload Window"

### Option 2: Open Folder Correctly

1. **File → Open Folder** (or `Ctrl+K Ctrl+O`)
2. Navigate to: `C:\Users\Harish kumar. D\Downloads\projects\eduno`
3. Click "Select Folder"
4. The IDE should now detect the correct repository

### Option 3: Check IDE Settings

If using VS Code/Cursor:

1. Open Settings (`Ctrl+,`)
2. Search for: `git.autoRepositoryDetection`
3. Set it to: `true` or `openEditors`
4. Reload the window

### Option 4: Verify Git Repository

Run these commands in the terminal to verify:

```bash
cd "C:\Users\Harish kumar. D\Downloads\projects\eduno"
git branch
git remote -v
```

You should see:
- Branch: `main`
- Remote: `https://github.com/HarishKumar997/eduno.git`

### Option 5: Force IDE to Use Correct Repository

1. Close the IDE
2. Delete any workspace settings that might be pointing to the wrong repo:
   - Look for `.vscode` or `.cursor` folders in parent directories
3. Reopen the IDE in the `eduno` folder

## Why This Happens

IDEs sometimes detect git repositories in parent directories. The "recruit4b" branch is likely from a repository in:
- A parent folder (`projects` or `Downloads`)
- A different workspace you had open
- Cached git information

## Verify It's Fixed

After reloading, check:
1. Bottom status bar should show: `main` branch
2. Source Control panel should show the eduno repository
3. Git log should show your commits: "Initial commit: Eduno CRM..."

## Still Not Working?

If the IDE still shows the wrong repository:

1. **Check for parent .git folder**:
   ```bash
   cd "C:\Users\Harish kumar. D\Downloads\projects"
   # If .git exists here, that's the problem
   ```

2. **Exclude parent directory from git detection**:
   - Add to VS Code settings:
     ```json
     "git.autoRepositoryDetection": false,
     "git.scanRepositories": [
       "C:\\Users\\Harish kumar. D\\Downloads\\projects\\eduno"
     ]
     ```

3. **Use workspace settings**:
   - Create `.vscode/settings.json` in eduno folder:
     ```json
     {
       "git.autoRepositoryDetection": "openEditors"
     }
     ```

