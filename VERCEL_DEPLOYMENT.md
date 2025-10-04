# 🚀 Vercel Deployment Guide - Blood Donation Tracker

## Fix for Permission Denied Error

The error you're seeing is due to Vercel's build configuration. Here's the solution:

## ✅ Correct Vercel Deployment Steps

### Step 1: Configure Vercel Project Settings

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Delete the existing deployment if it failed
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository

### Step 2: Configure Build Settings

**IMPORTANT:** Use these exact settings:

- **Framework Preset:** `Create React App`
- **Root Directory:** `frontend` (click "Edit" and type `frontend`)
- **Build Command:** Leave as default or use: `npm run build`
- **Output Directory:** `build` (not `frontend/build`)
- **Install Command:** `npm install --legacy-peer-deps`

### Step 3: Add Environment Variables

Click "Environment Variables" and add:
```
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## 🔧 Alternative: Manual Configuration

If the above doesn't work, try this:

### Update Vercel Settings After Creation

1. Go to your project in Vercel
2. Click **Settings** → **General**
3. Scroll to **Build & Development Settings**
4. Update:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install --legacy-peer-deps && npm run build`
   - **Output Directory:** `build`
   - **Install Command:** Leave empty

5. Go to **Deployments** tab
6. Click the three dots on the latest deployment → **Redeploy**

---

## 📝 Commit Current Changes

First, commit the updated `vercel.json`:

```bash
git add vercel.json
git commit -m "Simplify Vercel configuration"
git push origin main
```

---

## ⚠️ Common Issues

### Issue 1: Permission Denied
**Solution:** Make sure Root Directory is set to `frontend` in Vercel settings

### Issue 2: Build Command Fails
**Solution:** Use the Install Command field for `npm install --legacy-peer-deps`

### Issue 3: 404 on Routes
**Solution:** The `vercel.json` rewrites should handle this automatically

---

## 🎯 Recommended: Use Netlify Instead

**Netlify is easier for React apps.** Your Netlify deployment should be working now with all the fixes we made.

### Why Netlify is Better for This Project:
- ✅ Better React Router support
- ✅ Simpler configuration
- ✅ More generous free tier
- ✅ Automatic redirects handling

### Netlify Status:
Your Netlify deployment should be working with:
- ✅ Fixed routing (`_redirects` file)
- ✅ Fixed dependencies (removed `react-google-login`)
- ✅ Fixed ESLint errors
- ✅ Proper environment variable support

---

## 🚀 Quick Decision Guide

**Choose Vercel if:**
- You specifically need Vercel features
- You're deploying backend on Vercel too

**Choose Netlify if:**
- You want simpler deployment (recommended)
- You're using Render for backend
- You want better free tier limits

---

## 📞 Next Steps

1. **Try Netlify first** - It should be working now
2. **If you must use Vercel:**
   - Delete current deployment
   - Create new one with `frontend` as root directory
   - Set Framework to "Create React App"
   - Add environment variable

Good luck! 🎉
