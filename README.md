# 📧 Email Job Scheduler

A full-stack email scheduling application that allows users to authenticate with Google, compose emails, apply rate limits (hourly caps & delays), and send emails asynchronously using a queue-based architecture.

This project was built to learn real-world deployment, background processing, and cloud environment handling.

## 🚀 Features

- ✅ Google OAuth Authentication
- ✅ Email scheduling with delay & hourly limits
- ✅ Bulk email upload support
- ✅ Queue-based processing (BullMQ)
- ✅ Prisma ORM with MySQL
- ✅ Redis for background jobs
- ✅ Full frontend + backend deployment
- ✅ Production-ready environment variables handling

## 🧱 Tech Stack

### Frontend
- React
- TypeScript
- Axios
- Deployed on Vercel

### Backend
- Node.js (Express)
- TypeScript
- Prisma ORM
- BullMQ
- Redis
- MySQL
- Deployed on Render

## 🗂️ Project Structure

```
Email-JobScheduler/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── workers/
│   │   └── server.ts
│   ├── prisma/
│   ├── config/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔐 Environment Variables

### Backend (Render)
```env
DATABASE_URL=mysql://<user>:<password>@<host>:3306/email_scheduler
REDIS_URL=redis://<user>:<password>@<host>:6379

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=your_jwt_secret

ETHEREAL_USER=your_ethereal_email
ETHEREAL_PASS=your_ethereal_password

PORT=3001
WORKER_CONCURRENCY=5
FRONTEND_URL=https://email-job-scheduler-navy.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://email-jobscheduler.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🛠️ Local Development

### 1️⃣ Clone Repository
```bash
git clone https://github.com/ilangot2004/Email-JobScheduler
cd Email-JobScheduler
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run build
npm start
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌍 Deployment Setup

### Backend (Render)
- **Service Type:** Web Service
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

⚠️ _Background worker is optional for free tier. In free mode, jobs run inside the main service._

### Frontend (Vercel)
- Import GitHub repository
- Set environment variables
- Auto-deploy on push

### ⚠️ Known Limitations (Free Tier)
- Render free services may sleep
- Delayed emails may pause during sleep
- Background Worker requires paid plan
- _This is expected behavior on free infrastructure._

## 📚 What I Learned
- Handling environment variables across platforms
- Prisma generation during CI/CD
- Debugging CORS & OAuth issues
- Deploying monorepos
- Redis + queue-based background jobs
- Real-world cloud debugging (Railway, Render, Vercel)

## 🧠 Future Improvements
- Dedicated Background Worker service
- Persistent job retries
- Admin dashboard
- Email templates
- Webhooks & analytics

## 🧑💻 Author
**Ilango**
Built with persistence, debugging, and a lot of learning.
