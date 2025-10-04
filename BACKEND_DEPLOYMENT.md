# 🚀 Backend Deployment Guide - Blood Donation Tracker

## The Problem
You're getting a build error because the platform is trying to build the frontend when deploying the backend.

## ✅ Solution: Deploy Backend on Render

### Step 1: Go to Render Dashboard

1. Visit [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect Repository

1. Connect your GitHub account
2. Select your `blood-donation-tracker` repository
3. Click **"Connect"**

### Step 3: Configure Backend Service

**CRITICAL SETTINGS:**

- **Name:** `blood-donation-backend` (or any name you prefer)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend` ← **IMPORTANT!**
- **Runtime:** `Node`
- **Build Command:** `npm install` ← **NOT npm run build**
- **Start Command:** `npm start` or `node server.js`
- **Instance Type:** Free

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-change-this
PORT=5001
FRONTEND_URL=https://your-frontend-url.netlify.app
NODE_ENV=production
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Replace `JWT_SECRET` with a random secure string
- Replace `FRONTEND_URL` with your actual frontend URL (add this after frontend is deployed)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://blood-donation-backend.onrender.com`

### Step 6: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Blood Donation Tracker API is running",
  "timestamp": "2025-10-04T..."
}
```

---

## 🗄️ MongoDB Atlas Setup (If Not Done)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Free tier)

### Step 2: Create Database User

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `bloodtracker`
5. Password: Generate a strong password (SAVE IT!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://bloodtracker:<password>@cluster0.xxxxx.mongodb.net/blood-donation-tracker?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Use this in Render's `MONGODB_URI` environment variable

---

## 🔧 Alternative: Deploy Backend on Railway

### Step 1: Go to Railway

1. Visit [Railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Select your repository

### Step 3: Configure

1. **Root Directory:** `backend`
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`

### Step 4: Add Environment Variables

Same as Render (see above)

---

## 🐛 Troubleshooting

### Error: "npm run build failed"
**Solution:** Make sure **Root Directory** is set to `backend`, not the project root

### Error: "Permission denied"
**Solution:** Use `npm install` as build command, NOT `npm run build`

### Error: "MongoDB connection failed"
**Solution:** 
- Check MongoDB connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user credentials

### Error: "Port already in use"
**Solution:** Don't set PORT in .env, let Render assign it automatically

---

## ✅ Backend Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Render/Railway account created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health endpoint tested

---

## 📝 Environment Variables Summary

```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker
JWT_SECRET=your-secret-key-here
PORT=5001
NODE_ENV=production

# After frontend is deployed
FRONTEND_URL=https://your-frontend.netlify.app

# Optional (for AI chatbot)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro
```

---

## 🎉 Success!

Once deployed:
1. Backend URL: `https://your-backend.onrender.com`
2. Health check: `https://your-backend.onrender.com/api/health`
3. Use this URL in frontend's `REACT_APP_API_BASE_URL`

---

## 📞 Next Steps

1. ✅ Deploy backend (you're here!)
2. Update frontend environment variable with backend URL
3. Redeploy frontend
4. Update backend `FRONTEND_URL` with frontend URL
5. Test the full application

Good luck! 🚀
