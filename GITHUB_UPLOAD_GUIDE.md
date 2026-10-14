# 🚀 GitHub Upload Guide - MAMA Project

## Quick Start (If Git is Already Installed)

```bash
# 1. Navigate to your project folder
cd /path/to/mama

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit: MAMA project"

# 5. Create a new repository on GitHub (see below)

# 6. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/mama.git

# 7. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📋 Step-by-Step Instructions

### Step 1: Install Git (If Not Installed)

**Check if Git is installed:**
```bash
git --version
```

**If not installed:**
- **Windows:** Download from https://git-scm.com/download/win
- **Mac:** `brew install git` or download from https://git-scm.com/download/mac
- **Linux:** `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

---

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `mama`
   - **Description:** `Multi-Account Mail Agent - Manage up to 30 email accounts with AI agents`
   - **Public** or **Private** (your choice)
   - ❌ **DO NOT** check "Add a README file" (we already have one)
   - ❌ **DO NOT** check "Add .gitignore" (we already have one)
   - ❌ **DO NOT** check "Choose a license" (add later if needed)
3. Click **Create repository**

---

### Step 3: Authentication Setup

**GitHub no longer accepts passwords!** You need a Personal Access Token (PAT).

#### Create a Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - **Note:** `MAMA project`
   - **Expiration:** 90 days (or your choice)
   - **Select scopes:** ✅ `repo` (full control of private repositories)
4. Click **Generate token**
5. **⚠️ COPY THE TOKEN NOW** - You won't see it again!
6. Save it somewhere secure (password manager, etc.)

**When Git asks for password, paste your token instead!**

---

### Step 4: Configure Git (First Time Only)

```bash
# Set your name and email (use your GitHub email)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

---

### Step 5: Upload to GitHub

```bash
# Navigate to your project
cd /path/to/mama

# Initialize git repository
git init

# Add .gitignore (already created)
# Add all files
git add .

# Commit
git commit -m "Initial commit: MAMA project"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/mama.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted:**
- **Username:** Your GitHub username
- **Password:** Paste your Personal Access Token (NOT your GitHub password)

---

## 🔧 Common Errors & Solutions

### ❌ Error: "fatal: not a git repository"

**Solution:**
```bash
git init
```

---

### ❌ Error: "error: src refspec main does not match any"

**Solution:**
```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

---

### ❌ Error: "Permission denied (publickey)"

**Solution:** You're using SSH but haven't set up SSH keys. Switch to HTTPS:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/mama.git
```

---

### ❌ Error: "Support for password authentication was removed"

**Solution:** Use a Personal Access Token (see Step 3 above)

---

### ❌ Error: "Updates were rejected because the remote contains work"

**Solution:**
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

### ❌ Error: "fatal: remote origin already exists"

**Solution:**
```bash
# Remove old remote and add new one
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/mama.git
```

---

### ❌ Error: "Everything up-to-date" but nothing on GitHub

**Solution:**
```bash
# Check if you have commits
git log

# If no commits, create one
git add .
git commit -m "Initial commit"

# Push again
git push -u origin main
```

---

### ❌ Error: "node_modules" is too large

**Solution:** The `.gitignore` file should prevent this. If already committed:
```bash
# Remove node_modules from git tracking
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

---

### ❌ Error: "fatal: unable to access"

**Solution:** Check your internet connection and proxy settings:
```bash
# Clear git cache
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 🔐 Alternative: SSH Setup (More Secure)

### Generate SSH Key:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter for default location
# Enter a passphrase (optional but recommended)

# Start SSH agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# Copy the public key
# Mac:
pbcopy < ~/.ssh/id_ed25519.pub

# Windows:
clip < ~/.ssh/id_ed25519.pub

# Linux:
xclip -sel clip < ~/.ssh/id_ed25519.pub
```

### Add SSH Key to GitHub:

1. Go to https://github.com/settings/keys
2. Click **New SSH key**
3. **Title:** `MAMA Project`
4. **Key:** Paste the copied key
5. Click **Add SSH key**

### Use SSH for Git:

```bash
# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/mama.git

# Push
git push -u origin main
```

---

## 📊 Verify Upload

After pushing, check:

1. Go to https://github.com/YOUR_USERNAME/mama
2. Refresh the page
3. You should see all your project files
4. Check the README is displayed correctly

---

## 🔄 Making Changes Later

```bash
# Make your changes to the code

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push
```

---

## 🌐 Deploy to GitHub Pages (Optional)

### Install gh-pages:

```bash
npm install --save-dev gh-pages
```

### Add to package.json:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/mama",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Update vite.config.ts:

```typescript
export default defineConfig({
  base: '/mama/',
  // ... rest of config
})
```

### Deploy:

```bash
npm run deploy
```

Your site will be live at: `https://YOUR_USERNAME.github.io/mama/`

---

## 📞 Need More Help?

- **GitHub Docs:** https://docs.github.com/en/get-started
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Common Issues:** https://docs.github.com/en/authentication/troubleshooting-ssh

---

## ✅ Checklist

Before uploading, make sure:

- [ ] Git is installed (`git --version`)
- [ ] GitHub account created
- [ ] Repository created on GitHub (named `mama`)
- [ ] Personal Access Token generated
- [ ] Git config set (`user.name` and `user.email`)
- [ ] `.gitignore` file exists (prevents uploading node_modules)
- [ ] All files committed locally
- [ ] Remote URL set correctly

---

**Good luck! 🚀**
