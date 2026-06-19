# Deployment Guide

This project is easiest to deploy as two separate services:

- Frontend: Vercel
- Backend: Render or Railway
- Source control: GitHub

## What GitHub is for

GitHub is not the hosting platform by itself in this setup. Use it to store your code, then connect GitHub to Vercel and your backend host.

## What Vercel is for

Vercel should host the React frontend from the `frontend` folder. It is the public website your users will visit.

## What the backend host is for

Use Render or Railway for the Express API in the `backend` folder. Vercel is best for the frontend here, not the Express server.

## Recommended deployment flow

1. Push this repository to GitHub.
2. Deploy the backend first on Render or Railway.
3. Copy the live backend API URL.
4. Set `VITE_API_URL` in the frontend project on Vercel.
5. Deploy the frontend from the `frontend` folder.

## Environment variables

### Backend

Use these variables on Render or Railway:

- `MONGODB_URI` - your MongoDB connection string
- `PORT` - the port your host gives you, or `7000` locally
- `CLIENT_ORIGIN` - the frontend domain, such as your Vercel URL

Example:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/finance-tracker
PORT=7000
CLIENT_ORIGIN=https://your-frontend.vercel.app
```

### Frontend

Use this variable on Vercel:

- `VITE_API_URL` - the live backend URL ending in `/api/transactions`

Example:

```env
VITE_API_URL=https://your-backend.onrender.com/api/transactions
```

## Vercel settings

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Backend settings for Render or Railway

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

## Important note

Do not leave the frontend pointing at `localhost` after deployment. If the frontend still uses `localhost`, it will only work on your own computer.

## Why this setup is best for a first deployment

- GitHub keeps the code safe and easy to update.
- Vercel gives you a simple frontend deployment flow.
- Render or Railway handles the API and MongoDB access more naturally than Vercel for this Express app.
- Separating frontend and backend makes debugging easier.
