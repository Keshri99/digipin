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

**⚠️ IMPORTANT: Use A Record (Not CNAME) for Root Domain**

**Update Root Domain (@):**

Find the **A record** with Name `@`:
1. Click **Edit**
2. Find the current **IP address** from your Netlify domain settings
3. Keep it as **Type: A** (do NOT change to CNAME)
4. Keep the Value as the **IP address** provided by Netlify
5. Click **Save**

*Note: GoDaddy does not allow CNAME records on root domain (@). Use the A record that points to Netlify's IP address.*

**Update WWW:**

Find or create a **CNAME record** with Name `www`:
1. If exists, click **Edit**
2. Set Value to your **Netlify subdomain** (e.g., `digipin-XXXXX.netlify.app`)
3. Set Type to: **CNAME**
4. Click **Save**

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

## **STEP 5: Enable SSL Certificate**

### **Auto-Provision HTTPS**

1. Go to https://app.netlify.com
2. Select your **digipin** project
3. Click **Domain settings**
4. Scroll to **"HTTPS"** section
5. Click **"Verify DNS configuration"** if available
6. **Wait 5-15 minutes** — Netlify auto-provisions a free SSL certificate
7. Refresh your site — the lock icon 🔒 should appear

*Note: DNS might take 15-30 minutes to fully propagate globally. You can check propagation at https://www.whatsmydns.net/*

---

## **STEP 6: Verify Everything Works**

### **Wait 15-30 minutes** for DNS to propagate, then test:

```powershell
# Test frontend (should show lock icon 🔒)
# Open browser and visit:
# https://address2digipin.in
# https://www.address2digipin.in

# Test backend health
# https://api.address2digipin.in/health

# Test API endpoint
# https://api.address2digipin.in/api/digipin?lat=28.622&lon=77.213

# If all show correct results with HTTPS lock ✅, you're done!
```

---

## **STEP 7: Future Updates**

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

### **"Not Secure" Warning on HTTPS**

```
If you see "Not secure" warning:
1. Go to Netlify → Domain settings
2. Scroll to "HTTPS" section
3. Click "Verify DNS configuration"
4. Wait 5-15 minutes for SSL certificate to provision
5. Refresh page — lock icon should appear ✅
```

### **"API Returning 404"**

```
Make sure you're using: https://api.address2digipin.in/api/...
Not: https://address2digipin.in/api/...
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
- ✅ GoDaddy DNS records updated (www, api, @ with A record)
- ✅ DNS propagated and verified
- ✅ Frontend loads at https://address2digipin.in
- ✅ HTTPS enabled with SSL certificate (lock icon 🔒)
- ✅ Backend responds at https://api.address2digipin.in/health
- ✅ API works at https://api.address2digipin.in/api/digipin
- ✅ **🚀 LIVE DEPLOYMENT COMPLETE!**

**Your DigiPin interactive visualization is now live!**

Visit: https://address2digipin.in

---

## **SUPPORT**

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- GoDaddy Help: https://support.godaddy.com
- Git Docs: https://git-scm.com/doc

---

**You're all set! 🚀**
