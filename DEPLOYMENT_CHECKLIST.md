# ✅ Deployment Checklist

Use this checklist to track your progress through the deployment process.

---

## 🎯 PRE-DEPLOYMENT (Before You Start)

- [ ] You have a GoDaddy domain (already purchased)
- [ ] You have internet access and a web browser
- [ ] You have Git installed (`git --version` works in PowerShell)
- [ ] You have all DigiPin files in `d:\digipin\`
- [ ] You've read `COMPLETE_DEPLOYMENT_STEPS.md`

---

## 👤 ACCOUNT CREATION (Do These First)

### GitHub
- [ ] Create GitHub account at https://github.com/signup
- [ ] Verify email
- [ ] Create new repository named `digipin`
- [ ] Copy repository URL: `https://github.com/YOUR_USERNAME/digipin.git`
- [ ] Keep this URL for later steps

### Railway
- [ ] Create Railway account at https://railway.app
- [ ] Sign up with GitHub
- [ ] Authorize Railway to access GitHub
- [ ] Complete account setup

### Netlify
- [ ] Create Netlify account at https://netlify.com
- [ ] Sign up with GitHub
- [ ] Authorize Netlify to access GitHub
- [ ] Complete account setup

---

## 💻 PUSH CODE TO GITHUB

In PowerShell, run these commands:

- [ ] `cd d:\digipin`
- [ ] `git init`
- [ ] `git config user.name "Your Name"`
- [ ] `git config user.email "your.email@example.com"`
- [ ] `git add .`
- [ ] `git commit -m "Initial DigiPin project"`
- [ ] `git remote add origin https://github.com/YOUR_USERNAME/digipin.git`
- [ ] `git branch -M main`
- [ ] `git push -u origin main`
- [ ] Check: Code appears on GitHub website ✅

---

## 🚀 DEPLOY BACKEND (Railway)

- [ ] Open https://railway.app and sign in
- [ ] Click **"New Project"**
- [ ] Select **"Deploy from GitHub repo"**
- [ ] Select `digipin` repository
- [ ] Click **"Deploy"**
- [ ] Wait 2-3 minutes for deployment
- [ ] Click on the `digipin` service
- [ ] Go to **"Settings"** tab
- [ ] Find **"Domains"** section
- [ ] Copy the auto-generated URL: `digipin-production.up.railway.app`
- [ ] Save this URL (you'll need it for DNS)
- [ ] Test: Visit `https://digipin-production.up.railway.app/health`
- [ ] Check: Page shows JSON with `"status": "ok"` ✅

---

## 🎨 DEPLOY FRONTEND (Netlify)

- [ ] Open https://netlify.com and sign in
- [ ] Click **"Add new site"** → **"Import an existing project"**
- [ ] Select **"GitHub"**
- [ ] Select `digipin` repository
- [ ] Keep default build settings (no build command needed)
- [ ] Click **"Deploy"**
- [ ] Wait 1-2 minutes for deployment
- [ ] Copy the auto-generated URL: `digipin-XXXXX.netlify.app`
- [ ] Save this URL (you'll need it for DNS)
- [ ] Test: Visit `https://digipin-XXXXX.netlify.app`
- [ ] Check: Page shows interactive map ✅

---

## 🔗 UPDATE GODADDY DNS

### Access DNS Settings
- [ ] Go to https://godaddy.com
- [ ] Click **"Sign in"**
- [ ] Enter credentials
- [ ] Click **"My Products"**
- [ ] Find your domain
- [ ] Click **"Manage"**
- [ ] Click **"DNS"** tab

### Update Root Domain (@)
- [ ] Find the **A record** with Name `@`
- [ ] Click **Edit**
- [ ] Change **Type** to: **CNAME**
- [ ] Change **Value** to: `yourdomain.netlify.app` (use your Netlify URL)
- [ ] Click **Save**
- [ ] Record saved: @ → CNAME ✅

### Update WWW Subdomain
- [ ] Find or create **CNAME record** with Name `www`
- [ ] Click **Edit** (or **Add** if doesn't exist)
- [ ] Set **Type** to: **CNAME**
- [ ] Set **Value** to: `yourdomain.netlify.app`
- [ ] Click **Save**
- [ ] Record saved: www → CNAME ✅

### Add API Subdomain
- [ ] Click **"Add DNS Record"**
- [ ] Set **Type** to: **CNAME**
- [ ] Set **Name** to: `api`
- [ ] Set **Value** to: `digipin-production.up.railway.app`
- [ ] Set **TTL** to: 600 (or 3600)
- [ ] Click **Save**
- [ ] Record saved: api → CNAME ✅

### Verify DNS Records
- [ ] Refresh GoDaddy page
- [ ] Confirm 3 records are listed:
  - [ ] `@` → CNAME → netlify URL
  - [ ] `www` → CNAME → netlify URL
  - [ ] `api` → CNAME → railway URL
- [ ] All DNS records updated ✅

---

## ⏳ WAIT FOR DNS PROPAGATION

DNS changes take time to spread worldwide:

- [ ] Make a note of current time
- [ ] Wait **15-30 minutes**
- [ ] (Or check propagation at https://www.whatsmydns.net/)
- [ ] DNS should be propagated ✅

---

## 🧪 TESTING & VERIFICATION

### Test Frontend (after DNS propagated)
- [ ] Open browser
- [ ] Visit: `https://yourdomain.com`
- [ ] Page shows: Interactive map ✅
- [ ] Try: `https://www.yourdomain.com`
- [ ] Both URLs work ✅

### Test Backend Health Check
- [ ] Visit: `https://api.yourdomain.com/health`
- [ ] Page shows: JSON with status ✅
- [ ] Check: `"status": "ok"` appears ✅

### Test API Endpoint
- [ ] Visit: `https://api.yourdomain.com/api/digipin?lat=28.622&lon=77.213`
- [ ] Page shows: JSON response ✅
- [ ] Check: DigiPin code appears ✅

### Test Map Functionality
- [ ] Click on a grid cell
- [ ] Map zooms in ✅
- [ ] Grid updates ✅
- [ ] Try encoder/decoder in Tools tab ✅

### Test Search Bar
- [ ] Search coordinates: `28.622,77.213`
- [ ] Map shows pin and bounds ✅
- [ ] Search DigiPin: `39`
- [ ] Map navigates correctly ✅

---

## 🎉 EVERYTHING WORKING?

If all tests pass:

- [ ] Frontend accessible at: `https://yourdomain.com` ✅
- [ ] Backend accessible at: `https://api.yourdomain.com` ✅
- [ ] All API endpoints working ✅
- [ ] Map fully functional ✅
- [ ] Search working ✅
- [ ] HTTPS enabled on both ✅

**Congratulations! 🎊 Your DigiPin service is live!**

---

## 📢 SHARE YOUR DOMAIN

Now you can:
- [ ] Share: `https://yourdomain.com` with users
- [ ] Share: Documentation or tutorial
- [ ] Post on social media
- [ ] Add to portfolio
- [ ] Integrate with other services

---

## 🔧 FUTURE MAINTENANCE

### Keep Updated
- [ ] Make changes to code locally
- [ ] Test changes: `npm start`
- [ ] Commit: `git commit -m "description"`
- [ ] Push: `git push`
- [ ] Wait 2-3 minutes for Railway to redeploy ✅
- [ ] Wait 1-2 minutes for Netlify to redeploy ✅

### Monitor
- [ ] Check Railway logs weekly for errors
- [ ] Check Netlify deploy status
- [ ] Monitor GoDaddy domain expiration

### Backup
- [ ] Periodically download your code
- [ ] Or rely on GitHub as backup

---

## 📝 TROUBLESHOOTING QUICK FIX

### If DNS Isn't Working
- [ ] Wait 30 more minutes
- [ ] Check: https://www.whatsmydns.net/
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Try incognito mode: Ctrl+Shift+N

### If Frontend Shows Blank
- [ ] Check Netlify deploy status
- [ ] Check browser console: F12
- [ ] Clear cache and refresh: Ctrl+F5

### If API Returns Error
- [ ] Check Railway logs for errors
- [ ] Verify URL includes `/api/` part
- [ ] Try: `https://api.yourdomain.com/health`

### If Nothing Works
- [ ] Re-read `COMPLETE_DEPLOYMENT_STEPS.md`
- [ ] Check all DNS records are correct
- [ ] Verify both Railway and Netlify show "deployed"
- [ ] Contact platform support

---

## ✨ FINAL STATUS

- [ ] All setup complete
- [ ] Service is live
- [ ] Users can access
- [ ] Auto-updates working
- [ ] Ready for production

**You're done! 🚀**

---

## 📋 QUICK LINKS

| Component | Link |
|-----------|------|
| Railway | https://railway.app/dashboard |
| Netlify | https://app.netlify.com |
| GoDaddy | https://godaddy.com/account |
| GitHub | https://github.com/YOUR_USERNAME/digipin |
| Your Site | https://yourdomain.com |
| Your API | https://api.yourdomain.com |

---

**Keep this checklist handy for reference!**
