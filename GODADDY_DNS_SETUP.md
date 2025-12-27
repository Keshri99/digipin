# GoDaddy DNS Configuration for DigiPin

## Your Setup

```
Domain: yourdomain.com (purchased on GoDaddy)
├── Frontend: Hosted on Netlify
│   └── URLs: yourdomain.com, www.yourdomain.com
│
└── Backend: Hosted on Railway
    └── URL: api.yourdomain.com
```

---

## Step-by-Step: Update GoDaddy DNS

### **Step 1: Access GoDaddy Dashboard**

1. Go to https://godaddy.com
2. Click **Sign in** (top right)
3. Enter your credentials
4. Click **"My Products"**
5. Find your domain (e.g., `yourdomain.com`)
6. Click **"Manage"**

### **Step 2: Go to DNS Settings**

1. Scroll down to find **"DNS Management"** or **"Name Servers"**
2. Click **"Manage DNS"** or **"DNS"** tab
3. You'll see a list of current DNS records

---

## Current DNS Records (Default)

GoDaddy usually has something like this:

```
Name          Type    Value                    TTL
@             A       1.2.3.4 (GoDaddy IP)     1 hour
www           CNAME   yourdomain.com           1 hour
_acme-challenge  TXT  (SSL verification)       1 hour
```

---

## New Records to Add/Update

### **FOR NETLIFY FRONTEND**

#### Update/Add: Root Domain (@)

```
Type:    A (or ANAME)
Name:    @ (represents yourdomain.com)
Value:   75.2.60.5 (or check Netlify for specific IP)
TTL:     600 seconds (or 1 hour)
```

**Note:** For Netlify, you can also use:
```
Type:    CNAME
Name:    @
Value:   yourdomain.netlify.app
```

#### Update/Add: WWW Subdomain

```
Type:    CNAME
Name:    www
Value:   yourdomain.netlify.app
TTL:     600 seconds
```

### **FOR RAILWAY BACKEND API**

#### Add: API Subdomain

```
Type:    CNAME
Name:    api
Value:   digipin-production.up.railway.app
TTL:     600 seconds
```

---

## Complete DNS Table After Setup

```
Name              Type    Value                              TTL
-----             ----    -----                              ---
@                 A       75.2.60.5                          1h
www               CNAME   yourdomain.netlify.app             10m
api               CNAME   digipin-production.up.railway.app  10m
_acme-challenge   TXT     (keep existing)                    1h
```

---

## Visual Guide: Adding Records in GoDaddy

```
┌─────────────────────────────────────────┐
│  GoDaddy DNS Management                 │
├─────────────────────────────────────────┤
│                                         │
│  [Add] DNS Record                       │
│                                         │
│  Type:  ├─ A ✅                         │
│  Name:  ├─ @ ✅                         │
│  Value: ├─ yourdomain.netlify.app ✅   │
│  TTL:   ├─ 600 seconds ✅              │
│                                         │
│  [Save]                                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## How to Add Records in GoDaddy

### **Method 1: Using GoDaddy Dashboard UI**

1. Click **"Add"** button
2. Fill in the form:
   - **Type:** Select from dropdown (A, CNAME, TXT, etc.)
   - **Name:** Enter subdomain (@ for root, www, api, etc.)
   - **Value:** Enter the target value
   - **TTL:** Leave at default (600 or 3600)
3. Click **"Save"**

### **Method 2: Click Edit on Existing Records**

1. Find the record you want to update (e.g., www)
2. Click the **edit icon** (pencil)
3. Change the **Value** field
4. Click **Save**

---

## Testing Your DNS Configuration

### **After updating DNS, test with:**

#### **For Frontend**
```
https://yourdomain.com
https://www.yourdomain.com
```

Should show your DigiPin map ✅

#### **For Backend**
```
https://api.yourdomain.com/health
```

Should return:
```json
{
  "status": "ok",
  "service": "DigiPin API",
  "environment": "production",
  "timestamp": "2025-12-26T10:30:00.000Z"
}
```

#### **For API Endpoint**
```
https://api.yourdomain.com/api/digipin?lat=28.622&lon=77.213
```

Should return DigiPin code ✅

---

## DNS Propagation Checker

If updates aren't working immediately:

1. Go to https://www.whatsmydns.net/
2. Enter your domain: `yourdomain.com`
3. Select record type: `A` (for root)
4. It shows DNS status worldwide
5. Wait until all entries show your new values

**Typical wait time:** 15 minutes - 24 hours (usually faster)

---

## Common Issues & Solutions

### **Issue: "DNS_PROBE_FINISHED_NXDOMAIN" Error**

**Cause:** DNS records haven't propagated yet
**Solution:** Wait 15-30 minutes, clear browser cache, try incognito mode

### **Issue: API Returns 404 Error**

**Cause:** Railway hasn't deployed yet
**Solution:** Check Railway dashboard → Logs for deployment status

### **Issue: "ERR_NAME_NOT_RESOLVED"**

**Cause:** DNS not pointing to correct server
**Solution:** Verify DNS records in GoDaddy match the values above

### **Issue: SSL Certificate Error**

**Cause:** HTTPS not enabled
**Solution:** Both Netlify and Railway auto-enable HTTPS (free with Let's Encrypt)

---

## Expected Timeline

| Time | Event |
|------|-------|
| T+0 min | You update DNS records in GoDaddy |
| T+5 min | Some ISPs pick up new records |
| T+15 min | Most regions resolve correctly |
| T+30 min | 99% propagation complete |
| T+24 hrs | 100% global propagation |

---

## Support Resources

- **GoDaddy DNS Help:** https://support.godaddy.com/article/680
- **Netlify DNS Setup:** https://docs.netlify.com/domains-https/custom-domains/
- **Railway Custom Domain:** https://docs.railway.app/deploy/docs/custom-domains

---

## Quick Reference: Your URLs After Setup

| Service | URL | Type |
|---------|-----|------|
| **Frontend** | https://yourdomain.com | Browser |
| **Frontend (www)** | https://www.yourdomain.com | Browser |
| **Backend API** | https://api.yourdomain.com | REST API |
| **Health Check** | https://api.yourdomain.com/health | API |
| **DigiPin Encoder** | https://api.yourdomain.com/api/digipin | API |
| **DigiPin Decoder** | https://api.yourdomain.com/api/coordinates | API |

---

**✅ After DNS is fully propagated, everything will work seamlessly!**
