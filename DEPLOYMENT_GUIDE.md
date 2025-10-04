# 🚀 Blood Donation Tracker - Deployment Guide

## Overview
This guide will help you deploy your Blood Donation Tracker application using Vercel (Frontend) + Railway (Backend) + MongoDB Atlas (Database).

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (free)

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Create a database user with username/password
5. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
6. Get your connection string (it will look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker
   ```

## Step 2: Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend` folder as the root directory
6. Add these environment variables in Railway dashboard:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5001
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSyBBofmf0-ky05ZnqoxFrmTL-EzZ1_8CZDg
   GEMINI_MODEL=gemini-pro
   ```
7. Deploy and note your backend URL (e.g., `https://your-app.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project" → "Import Git Repository"
4. Select your repository
5. Set the root directory to `frontend`
6. Add environment variable:
   ```
   REACT_APP_API_BASE_URL=https://your-app.railway.app/api
   ```
7. Deploy

## Step 4: Update Backend CORS

After getting your Vercel URL, update the FRONTEND_URL in Railway:
```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the login functionality
3. Test the chatbot
4. Check that all features work

## Alternative: Single Platform Deployment

### Option A: Heroku (Paid)
- Deploy both frontend and backend to Heroku
- Use Heroku Postgres or MongoDB Atlas
- More expensive but simpler

### Option B: Netlify + Render
- Frontend: Netlify
- Backend: Render
- Both free tiers available

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure FRONTEND_URL is set correctly in backend
2. **Database connection**: Check MongoDB Atlas connection string
3. **Environment variables**: Ensure all required variables are set
4. **Build errors**: Check that all dependencies are in package.json

### Support:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

## Cost Breakdown (Free Tier)
- Vercel: Free (unlimited personal projects)
- Railway: Free (500 hours/month)
- MongoDB Atlas: Free (512MB storage)

Total monthly cost: $0 🎉
