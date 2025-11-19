# 🚂 Railway Backend Deployment - Quick Fix

## The Error You're Seeing

```
sh: 1: react-scripts: Permission denied
```

This happens because Railway is trying to build the frontend instead of the backend.

---

## ✅ Solution 1: Use Railway Dashboard Settings (Easiest)

### Step 1: Delete Current Deployment
1. Go to your Railway project
2. Click on the service
3. Go to **Settings** → **Danger Zone**
4. Click **"Remove Service from Project"**

### Step 2: Create New Service with Correct Settings

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. **IMPORTANT:** Click **"Add variables"** before deploying

### Step 3: Configure Service

In the service settings:

1. **Go to Settings → Service**
2. **Root Directory:** `backend` ← **SET THIS!**
3. **Build Command:** Leave empty or use `npm install`
4. **Start Command:** `npm start`

### Step 4: Add Environment Variables

Click **"Variables"** tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker
JWT_SECRET=your-super-secret-key-here
PORT=5001
FRONTEND_URL=https://your-frontend-url.netlify.app
NODE_ENV=production
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes
3. You'll get a URL like: `https://your-app.up.railway.app`

---

## ✅ Solution 2: Use Configuration Files (Alternative)

I've created `nixpacks.toml` and `railway.json` files for you.

### Commit and Push:

```bash
git add .
git commit -m "Add Railway configuration files"
git push origin main
```

Then in Railway:
1. Go to **Settings** → **Deploy**
2. Click **"Redeploy"**

---

## 🔧 Railway Settings Checklist

- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install` (or empty)
- [ ] Start Command: `npm start`
- [ ] All environment variables added
- [ ] MongoDB Atlas connection string correct
- [ ] Port set to 5001

---

## 🐛 Common Railway Issues

### Issue: "Permission denied"
**Fix:** Set Root Directory to `backend`

### Issue: "Module not found"
**Fix:** Make sure `npm install` runs in backend folder

### Issue: "Port already in use"
**Fix:** Railway assigns PORT automatically, but you can set it to 5001

### Issue: "MongoDB connection failed"
**Fix:** Check connection string and IP whitelist (0.0.0.0/0)

---

## 📝 Environment Variables for Railway

```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-change-this
PORT=${{PORT}}  # Railway provides this automatically
NODE_ENV=production

# After frontend deploys
FRONTEND_URL=https://your-frontend.netlify.app

# Optional (for AI features)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
```

---

## 🎯 Quick Steps Summary

1. **Delete** current Railway service
2. **Create new** service
3. **Set Root Directory** to `backend` ← MOST IMPORTANT
4. **Add environment variables**
5. **Deploy**

---

## 💡 Alternative: Use Render Instead

If Railway continues to give issues, **Render is easier** for Node.js backends:

1. Go to [Render.com](https://render.com)
2. Create Web Service
3. Set Root Directory to `backend`
4. Build: `npm install`
5. Start: `npm start`

Render has better documentation and clearer settings for monorepo projects.

---

## ✅ Test Your Backend

Once deployed, test:

```
https://your-backend.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Blood Donation Tracker API is running"
}
```

---

## 📞 Next Steps

1. Fix Railway deployment (set Root Directory to `backend`)
2. Get backend URL
3. Update frontend `REACT_APP_API_BASE_URL` with backend URL
4. Update backend `FRONTEND_URL` with frontend URL
5. Test full application

Good luck! 🚀
