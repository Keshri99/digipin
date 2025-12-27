# Complete Deployment Steps

All commands needed to deploy DigiPin with Node.js backend to GoDaddy domain.

---

## **STEP 0: Prerequisites** ✅

Make sure you have:
- ✅ GitHub account (free signup at github.com)
- ✅ GoDaddy account with domain
- ✅ Git installed on Windows (`git --version` in PowerShell)
- ✅ All DigiPin files in `d:\digipin\` folder

---

## **STEP 1: Set Up GitHub Repository**

### **1.1 Create GitHub Repository**

1. Go to https://github.com/new
2. Repository name: `digipin`
3. Description: "DigiPin Interactive Visualization with Node.js Backend"
4. Choose "Public" (so Railway can access it)
5. Click **"Create repository"**
6. Copy the URL: `https://github.com/YOUR_USERNAME/digipin.git`

### **1.2 Push Code to GitHub**

Open PowerShell and run these commands:

```powershell
# Navigate to project
cd d:\digipin

# Initialize git
git init

# Configure git (one-time)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial DigiPin project - Interactive visualization with Node.js backend"

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/digipin.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Expected output:**
```
Counting objects: XX, done.
Writing objects: 100%
remote: Create a pull request for 'main' on GitHub by visiting:
To https://github.com/YOUR_USERNAME/digipin.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Your code is now on GitHub!

---

## **STEP 2: Deploy Backend to Railway**

### **2.1 Create Railway Account**

1. Go to https://railway.app
2. Click **"Login"** → **"GitHub"**
3. Authorize Railway to access your GitHub
4. Accept terms and click **"Create Account"**

### **2.2 Create New Project**

1. Click **"New Project"** (+ icon, top right)
2. Select **"Deploy from GitHub repo"**
3. Find and select **`digipin`** repository
4. Click **"Deploy"**
5. **Wait 2-3 minutes** for deployment

### **2.3 Get Your Railway Backend URL**

1. After deployment, click on your **digipin** service
2. Go to **Settings** tab
3. Find **"Domains"** section
4. You'll see: `digipin-production.up.railway.app`
5. **Copy this URL** - you'll need it for GoDaddy DNS

**Test it:**
```
https://digipin-production.up.railway.app/health
```

Should return JSON with "ok" status ✅

---

## **STEP 3: Deploy Frontend to Netlify**

### **3.1 Create Netlify Account**

1. Go to https://netlify.com
2. Click **"Sign up"** → **"GitHub"**
3. Authorize Netlify
4. Select GitHub account

### **3.2 Import Repository**

1. Click **"Add new site"** → **"Import an existing project"**
2. Select **GitHub** as source
3. Find and select **`digipin`** repository
4. Click **"Deploy"**
5. **Wait 1-2 minutes** for build

### **3.3 Get Your Netlify Frontend URL**

1. After deployment, you'll see the site overview
2. Look for the blue URL: `https://digipin-XXXXX.netlify.app`
3. **Copy this URL** - you'll need it for GoDaddy DNS

**Test it:**
```
https://digipin-XXXXX.netlify.app
```

Should show your DigiPin map ✅

---

## **STEP 4: Configure GoDaddy DNS**

### **4.1 Log In to GoDaddy**

1. Go to https://godaddy.com
2. Click **"Sign in"** (top right)
3. Enter your credentials
4. Click **"My Products"**

### **4.2 Manage DNS**

1. Find your domain (e.g., `yourdomain.com`)
2. Click **"Manage"**
3. Go to **"DNS"** tab (or look for "Manage DNS")
4. You'll see existing DNS records

### **4.3 Update Records - Frontend (Netlify)**

**Update Root Domain (@):**

Find the **A record** with Name `@`:
1. Click **Edit**
2. Change Value to: `yourdomain.netlify.app`
3. Change Type to: **CNAME**
4. Click **Save**

**Update WWW:**

Find or create a **CNAME record** with Name `www`:
1. If exists, click **Edit**
2. Set Value to: `yourdomain.netlify.app`
3. Click **Save**

### **4.4 Add Records - Backend (Railway)**

**Add API Subdomain:**

1. Click **"Add DNS Record"**
2. Set fields:
   - **Type:** CNAME
   - **Name:** api
   - **Value:** digipin-production.up.railway.app
   - **TTL:** 600 (or 3600)
3. Click **"Add"** or **"Save"**

---

## **STEP 5: Verify Everything Works**

### **Wait 15-30 minutes** for DNS to propagate, then test:

```powershell
# Test frontend
# Open browser and visit:
# https://yourdomain.com
# https://www.yourdomain.com

# Test backend health
# https://api.yourdomain.com/health

# Test API endpoint
# https://api.yourdomain.com/api/digipin?lat=28.622&lon=77.213

# If all show correct results ✅, you're done!
```

---

## **STEP 6: Future Updates**

Whenever you make changes:

```powershell
# Navigate to project
cd d:\digipin

# See what changed
git status

# Add all changes
git add .

# Commit with description
git commit -m "Fixed bug in decoder" # (or whatever you changed)

# Push to GitHub
git push

# ✅ Railway auto-deploys within 2-3 minutes!
# ✅ Netlify auto-deploys within 1-2 minutes!
```

---

## **TROUBLESHOOTING**

### **"DNS Not Working"**

```powershell
# Check DNS propagation worldwide:
# https://www.whatsmydns.net/

# Clear browser cache:
# Ctrl + Shift + Delete

# Try incognito mode:
# Ctrl + Shift + N
```

### **"Railway Deployment Failed"**

```
Check logs in Railway dashboard → Logs tab
Look for error messages
Fix the issue in your code
git push again
```

### **"Netlify Build Failed"**

```
Check logs in Netlify dashboard → Deploys tab
Usually a missing file issue
Fix and git push
```

### **"API Returning 404"**

```
Make sure you're using: https://api.yourdomain.com/api/...
Not: https://yourdomain.com/api/...
Check Railway service is running
Verify DNS points to railway.app
```

---

## **COMMANDS REFERENCE**

### **Git Commands** (for future updates)

```powershell
# Check status
git status

# View changes
git diff

# Add specific file
git add filename.js

# Add all files
git add .

# Commit
git commit -m "Your message here"

# Push to GitHub (triggers auto-deploy)
git push

# Check commit history
git log --oneline
```

### **Deployment Check**

```powershell
# Test backend connection
curl https://api.yourdomain.com/health

# Test specific endpoint
curl "https://api.yourdomain.com/api/digipin?lat=28.622&lon=77.213"

# On Windows, you might need to use Invoke-WebRequest:
Invoke-WebRequest -Uri "https://api.yourdomain.com/health"
```

---

## **FINAL CHECKLIST**

- ✅ Code pushed to GitHub
- ✅ Railway backend deployed
- ✅ Netlify frontend deployed
- ✅ GoDaddy DNS records updated (www, api, @ )
- ✅ DNS propagated (checked on whatsmydns.net)
- ✅ Frontend loads at https://yourdomain.com
- ✅ Backend responds at https://api.yourdomain.com/health
- ✅ API works at https://api.yourdomain.com/api/digipin
- ✅ Share your domain with the world! 🎉

---

## **SUPPORT**

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- GoDaddy Help: https://support.godaddy.com
- Git Docs: https://git-scm.com/doc

---

**You're all set! 🚀**
