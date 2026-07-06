# FlowApp Integration Guide - FlowStack

This document outlines the setup, architecture, and integration steps for FlowApp inside the FlowStack platform.

---

## 🏗️ System Architecture

FlowApp is built as a database-backed SaaS product inside FlowStack. It bridges client-side Firebase Authentication with a MySQL database via an Express backend, using Drizzle ORM.

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│  FlowStack Web  │ ────> │  Express API    │ ────> │  MySQL Database  │
│  (Vite App)     │       │  (Drizzle ORM)  │       │  (User & Subs)   │
└─────────────────┘       └─────────────────┘       └──────────────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│  Firebase Auth  │       │   Gemini Pro    │
│  (Identity ID)  │       │   (AI Gen)      │
└─────────────────┘       └─────────────────┘
```

---

## 💾 Database Schema

Drizzle ORM is used to manage MySQL tables.

Key tables configured in `backend/src/db/schema.js`:
- `users`: Identity synchronization.
- `products`: Ecosystem product details catalog.
- `plans`: Project boundaries and feature permissions (Lite, Pro, Cloud).
- `subscriptions`: Active subscriptions and billing periods.
- `payments`: Detailed invoice transactions logged by providers.
- `flowapp_projects`: Generated Apps Script code files, prompts, and settings.
- `flowapp_generations`: Model token usages and generation errors logging.
- `flowapp_templates`: Prompt blueprints to quickstart applications.

### Migrate Database
To generate and run migrations, add `DATABASE_URL` in `backend/.env` and execute:
```bash
cd backend
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 💳 Mayar Payment Gateway Integration

FlowApp handles checkouts and automated access provisioning via Mayar webhook triggers.

### Webhook Event Flow
1. User clicks **Langganan** on the landing page, selecting a Plan and cycle.
2. The frontend triggers `POST /api/billing/create-checkout`, inserting a pending record to `payments` table and returning a payment checkout page.
3. Once paid, Mayar fires a POST Webhook to: `https://yourdomain.com/api/webhooks/mayar`
4. The backend verifies the webhook signature and changes the invoice status in the database to `paid`.
5. The billing engine triggers `activateSubscriptionFromPayment`, creating/renewing the user's FlowApp subscription for the corresponding billing duration (Monthly, 3, 6, or 12 months).

### Mayar Dashboard Setup
1. Go to your **Mayar Dashboard > Developers > Webhooks**.
2. Add a new endpoint pointing to: `https://yourdomain.com/api/webhooks/mayar`
3. Select the event: `payment.success` or `transaction.paid`.
4. Copy the webhook secret key and set it in your `.env` as `MAYAR_WEBHOOK_SECRET`.
5. Ensure checkout requests pass the `paymentId` inside the custom payload/metadata object so that it can be correctly matched upon callback.

---

## 🔥 Firebase Setup

FlowApp relies on Firebase Authentication for user tokens.

### Frontend Auth Sync
Upon login, the client grabs the token:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
localStorage.setItem('fs_token', token);
```
All API calls are authenticated by appending:
`Authorization: Bearer <token>` in headers.

### Backend Admin SDK
To allow the backend server to verify Firebase ID tokens, you must download a service account JSON file.
1. Go to **Firebase Console > Project Settings > Service Accounts**.
2. Click **Generate New Private Key**.
3. Save the downloaded file as `serviceAccountKey.json` inside the `backend/` folder.

---

## 🤖 Google Apps Script Web App Deployment

FlowApp generates functional micro-apps designed to run on Google Sheets and Google Apps Script.

### Deployment Guide for Users:
1. Create a new Google Spreadsheet at [sheets.google.com](https://sheets.google.com).
2. Go to **Extensions > Apps Script**.
3. Delete any default code, paste the generated `Code.gs` script.
4. Add an HTML file named `Index.html` and paste the generated `index.html` frontend code.
5. Click **Deploy > New Deployment**.
6. Select **Web App** as the deployment type:
   - Execute as: **Me (your-email@gmail.com)**.
   - Who has access: **Anyone**.
7. Click **Deploy**, authorize permissions, and copy the **Web App URL**.
8. Paste the Web App URL in the FlowApp editor settings tab and click **Publish**.

---

## 🚀 Vercel / Cloud Deployment

When deploying the frontend static site and Express backend to Vercel:

### 1. Vercel Configuration (`vercel.json`)
Add rewriting/routing configuration to proxy backend requests to the node server:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-server.com/api/:path*"
    },
    {
      "source": "/p/:slug",
      "destination": "https://your-backend-server.com/p/:slug"
    }
  ]
}
```

### 2. Environment Variables
Add these environment variables to Vercel/VPS server:
- `DATABASE_URL`: Connection string to MySQL database.
- `GEMINI_API_KEY`: API key for Gemini Pro.
- `MAYAR_API_KEY`: Secret key from Mayar gateway.
- `MAYAR_WEBHOOK_SECRET`: Webhook secret key for payload verification.
- `NEXT_PUBLIC_APP_URL`: Frontend domain url.
