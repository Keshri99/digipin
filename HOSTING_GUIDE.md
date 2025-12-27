# 🚀 DigiPin Hosting Guide - GoDaddy + Railway

Complete guide to deploy your DigiPin visualization with Node.js backend on GoDaddy domain.

## **QUICK SUMMARY**

| Component | Platform | Cost |
|-----------|----------|------|
| **Frontend (HTML)** | Netlify | Free |
| **Backend (Node.js)** | Railway | $5-10/month |
| **Domain** | GoDaddy | Already owned |
| **DNS Manager** | GoDaddy | Included |
| **Total** | ~$5-10/month | ✅ |

---

## **PART 1: PREPARE YOUR CODE FOR DEPLOYMENT**

### **1.1 Update GoDaddy Domain Settings**

Go to [godaddy.com](https://godaddy.com) and sign in:
1. Click **"My Products"**
2. Find your domain → Click **"Manage"**
3. Go to **DNS** tab
4. You'll see default records - keep these, we'll add new ones

### **1.2 Verify You Have Required Files**

Your project should have:
```
digipin/
├── digipin-advanced.html        ✅ (Frontend)
├── digipin-visualization.html   ✅ (Alternative Frontend)
├── digipin-server.js            ✅ (Backend)
├── digipin-utils.js             ✅ (Utilities)
├── package.json                 ✅ (Dependencies)
└── README.md                    ✅ (Documentation)
```

---

## **PART 2: DEPLOY BACKEND TO RAILWAY**

### **2.1 Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with **GitHub account** (easiest method)
3. Link your GitHub account
4. Click **"Create New Project"**

### **2.2 Push Code to GitHub (One-time Setup)**

If you haven't done this yet:

```powershell
# Navigate to your project
cd d:\digipin

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial DigiPin project"

# Create new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/digipin.git
git branch -M main
git push -u origin main
```

### **2.3 Deploy on Railway**

1. In Railway dashboard, click **"Create New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your **digipin** repository
4. Railway auto-detects it's a Node.js project ✅
5. Click **"Deploy"** → Wait 2-3 minutes

### **2.4 Get Your Railway Backend URL**

1. Go to your Railway project
2. Click on the **digipin** service
3. Go to **Settings** tab
4. Find **Domain** section
5. Copy the auto-generated URL (e.g., `digipin-production.up.railway.app`)

---

## **PART 3: DEPLOY FRONTEND TO NETLIFY**

### **3.1 Create Netlify Account**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**

### **3.2 Connect GitHub Repository**

1. Select **GitHub** as source
2. Find your **digipin** repository
3. Build settings (keep defaults):
   - Build command: (leave empty)
   - Publish directory: `.` (root)
4. Click **"Deploy"**

### **3.3 Get Your Netlify Frontend URL**

1. After deployment, you'll see a URL like: `https://digipin-12345.netlify.app`
2. This is your frontend URL

---

## **PART 4: CONNECT TO YOUR GODADDY DOMAIN**

### **4.1 Configure GoDaddy DNS Records**

Go to [GoDaddy DNS Manager](https://dcc.godaddy.com/manage):

#### **For Frontend (www subdomain):**
1. Click **"Add"** DNS Record
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `digipin-12345.netlify.app` (your Netlify URL)
   - **TTL:** 600 (default)
2. Click **Save**

#### **For Backend API (api subdomain):**
1. Click **"Add"** DNS Record
   - **Type:** CNAME
   - **Name:** `api`
   - **Value:** `digipin-production.up.railway.app` (your Railway URL)
   - **TTL:** 600 (default)
2. Click **Save**

#### **For Root Domain (@):**
1. Find existing **A record** for `@` 
2. Update to point to Netlify:
   - **Type:** A (or ANAME)
   - **Name:** `@`
   - **Value:** Ask Netlify support (they'll provide)
   - OR use: CNAME to your netlify domain

**Example after setup:**
```
@ (root)     → CNAME → digipin-12345.netlify.app
www          → CNAME → digipin-12345.netlify.app
api          → CNAME → digipin-production.up.railway.app
```

### **4.2 Update Netlify Domain Settings**

In Netlify dashboard:
1. Go to **Site Settings** → **Domain Management**
2. Click **Add custom domain**
3. Enter: `yourdomain.com`
4. Follow the DNS setup instructions

### **4.3 Wait for DNS Propagation**

DNS changes take 15 minutes to 24 hours. Check status:
```
https://www.whatsmydns.net/
```

---

## **PART 5: UPDATE YOUR FRONTEND CODE**

### **5.1 Update API Calls in HTML**

In `digipin-advanced.html`, update the API base URL if needed.

Currently, the frontend might make calls to `api.yourdomain.com/api/...`

Make sure your backend server accepts CORS requests:

In `digipin-server.js`, add CORS headers:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

---

## **PART 6: VERIFY DEPLOYMENT**

### **6.1 Test Frontend**

Visit:
```
https://yourdomain.com
https://www.yourdomain.com
https://digipin-12345.netlify.app
```

Should show the interactive map ✅

### **6.2 Test Backend API**

Visit:
```
https://api.yourdomain.com/api/digipin?lat=28.622&lon=77.213
```

Should return JSON response with DigiPin code ✅

### **6.3 Check Backend Console Logs**

In Railway:
1. Go to your project
2. Click **"Logs"** tab
3. Check for errors

---

## **TROUBLESHOOTING**

### **"Domain Not Found" Error**

- Wait 15-30 minutes for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Check DNS records in GoDaddy dashboard

### **Backend Returns 404**

- Make sure Railway has deployed successfully
- Check Railway logs for errors
- Verify API endpoint URLs are correct

### **CORS Errors**

- Backend needs CORS headers (see Part 5.1)
- Frontend needs to use `api.yourdomain.com` not `localhost`

### **Frontend Can't Connect to Backend**

Update this in your HTML file if needed:
```javascript
// OLD (won't work from deployed site):
const API_URL = 'http://localhost:3000/api';

// NEW (use your domain):
const API_URL = 'https://api.yourdomain.com/api';
```

---

## **MONITORING & MAINTENANCE**

### **Monitor Backend Uptime**

Railway → Project → Settings → Monitoring

### **View Logs**

Railway → Logs tab (check for errors)

### **Auto-Redeploy on GitHub Push**

1. Railway auto-redeploys when you push to GitHub ✅
2. No manual deployment needed
3. Just `git push` and wait 2-3 minutes

### **Custom Domain SSL/HTTPS**

- Netlify: ✅ Auto-enables HTTPS with Let's Encrypt
- Railway: ✅ Auto-enables HTTPS with Let's Encrypt
- Both free! No additional setup needed

---

## **COST BREAKDOWN**

| Item | Cost | Notes |
|------|------|-------|
| GoDaddy Domain | Already owned | Renewal: ~$12/year |
| Railway Backend | $5-10/month | Generous free tier ($5 credit/month) |
| Netlify Frontend | Free | Unlimited free tier |
| **Total** | **~$5-10/month** | (or free if using Railway free tier) |

---

## **NEXT STEPS**

1. ✅ Create Railway account → Deploy backend
2. ✅ Create Netlify account → Deploy frontend
3. ✅ Update GoDaddy DNS records
4. ✅ Test all URLs
5. ✅ Share your domain! 🎉

---

## **SUPPORT & RESOURCES**

- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **GoDaddy Support:** https://support.godaddy.com
- **Express.js:** https://expressjs.com/docs

---

**Questions?** Check the error message in:
- Railway → Logs
- Netlify → Deploy logs
- Browser console (F12)
