require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');

// Drizzle Database Imports
const { db } = require('./src/db/db');
const { users, flowappProjects } = require('./src/db/schema');
const { seedDatabase } = require('./src/db/seed');
const { eq } = require('drizzle-orm');

// Controller Imports
const billingCtrl = require('./src/controllers/billing');
const flowappCtrl = require('./src/controllers/flowapp');
const adminCtrl = require('./src/controllers/admin');

// Firebase Admin SDK Initialization
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin SDK initialized using environment variables.');
  } else {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized using serviceAccountKey.json.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not initialized. Please add serviceAccountKey.json or set FIREBASE_* env variables.', error.message);
}

// Automatically seed database on server boot
if (db) {
    seedDatabase().then(() => {
        console.log('Database seeded.');
    }).catch(err => {
        console.error('Seeding error:', err.message);
    });
}

const app = express();
app.use(cors());
app.use(express.json());

const WAHA_API_URL = process.env.WAHA_API_URL || 'http://localhost:3000';
const WAHA_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(process.env.WAHA_API_KEY && { 'X-Api-Key': process.env.WAHA_API_KEY })
};

// HELPER: Verify Auth Header (Firebase ID Token)
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // For local testing without serviceAccount, we bypass verification
  if (!admin.apps.length) {
    const mockUid = req.headers['x-mock-uid'] || 'test-user-uid';
    const mockEmail = req.headers['x-mock-email'] || 'test-user@example.com';
    req.user = { uid: mockUid, email: mockEmail, name: 'Test User' };
    
    // Sync mock user to DB
    if (db) {
        try {
            await db.insert(users).values({
                id: mockUid,
                firebaseUid: mockUid,
                name: 'Test User',
                email: mockEmail,
                role: mockEmail.includes('admin') ? 'admin' : 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoUpdate({
                target: users.id,
                set: { updatedAt: new Date() }
            });
        } catch (e) {
            console.error('Mock User sync failed:', e.message);
        }
    }
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Sync/Upsert verified user to MySQL
    if (db) {
        try {
            await db.insert(users).values({
                id: decodedToken.uid,
                firebaseUid: decodedToken.uid,
                name: decodedToken.name || 'User',
                email: decodedToken.email,
                photoUrl: decodedToken.picture || null,
                role: (decodedToken.email === 'zeger.indonesia@gmail.com' || decodedToken.email === 'weebeeone@gmail.com') ? 'admin' : 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoUpdate({
                target: users.id,
                set: {
                    name: decodedToken.name || 'User',
                    photoUrl: decodedToken.picture || null,
                    updatedAt: new Date()
                }
            });
        } catch (dbErr) {
            console.error('Failed to sync user to MySQL:', dbErr.message);
        }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

// ==========================================
// 🔔 BILLING & PAYMENT ROUTES
// ==========================================
app.post('/api/billing/create-checkout', verifyAuth, billingCtrl.createCheckout);
app.post('/api/webhooks/mayar', billingCtrl.handleMayarWebhook);
app.get('/api/billing/subscription', verifyAuth, billingCtrl.getSubscription);
app.post('/api/billing/cancel-request', verifyAuth, billingCtrl.cancelSubscription);

// ==========================================
// 🛠️ FLOWAPP PROJECT MANAGEMENT ROUTES
// ==========================================
app.get('/api/flowapp/projects', verifyAuth, flowappCtrl.listProjects);
app.post('/api/flowapp/projects', verifyAuth, flowappCtrl.createProject);
app.get('/api/flowapp/projects/:id', verifyAuth, flowappCtrl.getProject);
app.patch('/api/flowapp/projects/:id', verifyAuth, flowappCtrl.updateProject);
app.delete('/api/flowapp/projects/:id', verifyAuth, flowappCtrl.deleteProject);

// AI & Publish Actions
app.post('/api/flowapp/projects/:id/generate', verifyAuth, flowappCtrl.generateProject);
app.post('/api/flowapp/projects/:id/publish', verifyAuth, flowappCtrl.publishProject);
app.post('/api/flowapp/projects/:id/export', verifyAuth, flowappCtrl.exportProject);
app.get('/api/flowapp/templates', verifyAuth, flowappCtrl.loadTemplates);

// ==========================================
// 🌍 PUBLIC ROUTE: PUBLISHED APP RENDERING
// ==========================================
app.get('/p/:slug', async (req, res) => {
    if (!db) return res.status(500).send('Database connection unavailable.');
    const { slug } = req.params;

    try {
        const results = await db.select()
            .from(flowappProjects)
            .where(eq(flowappProjects.slug, slug))
            .limit(1);

        if (results.length === 0 || results[0].deletedAt || !results[0].isPublished) {
            return res.status(404).send('<h1>404: App Not Found</h1><p>The requested application does not exist or has not been published yet.</p>');
        }

        const project = results[0];
        // Send the compiled HTML code directly to the browser
        res.setHeader('Content-Type', 'text/html');
        res.send(project.publishedHtml || project.frontendCode || '<h1>App template has no frontend code.</h1>');
    } catch (error) {
        console.error('Error fetching published app:', error);
        res.status(500).send('An error occurred loading the application.');
    }
});

// ==========================================
// 👑 ADMIN MANAGEMENT ROUTES
// ==========================================
app.get('/api/admin/users', verifyAuth, adminCtrl.verifyAdmin, adminCtrl.listUsers);
app.get('/api/admin/subscriptions', verifyAuth, adminCtrl.verifyAdmin, adminCtrl.listSubscriptions);
app.get('/api/admin/payments', verifyAuth, adminCtrl.verifyAdmin, adminCtrl.listPayments);
app.get('/api/admin/projects', verifyAuth, adminCtrl.verifyAdmin, adminCtrl.listAllProjects);
app.post('/api/admin/subscriptions/:id/toggle', verifyAuth, adminCtrl.verifyAdmin, adminCtrl.toggleSubscription);

// ==========================================
// 💬 WAHA WHATSAPP INTEGRATION (EXISTING)
// ==========================================
app.post('/api/waha/start', verifyAuth, async (req, res) => {
  try {
    const sessionName = req.user.uid;
    if (WAHA_API_URL === 'mock') {
        console.log(`[MOCK] Starting WAHA session for ${sessionName}`);
        return res.json({ 
            status: 'AWAITING_QR', 
            qr: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' 
        });
    }
    await axios.post(`${WAHA_API_URL}/api/sessions/start`, {
      name: sessionName,
      config: {
        webhooks: [
          {
            url: process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/test",
            events: ["message", "session.status"]
          }
        ]
      }
    }, { headers: WAHA_HEADERS }).catch(e => {
      if (e.response && e.response.status !== 409) {
         console.error('Error starting session:', e.message);
      }
    });

    const statusRes = await axios.get(`${WAHA_API_URL}/api/sessions/${sessionName}/status`, { headers: WAHA_HEADERS });
    const status = statusRes.data.status;
    if (status === 'WORKING') {
      return res.json({ status: 'CONNECTED', message: 'WhatsApp is already connected.' });
    }

    const authRes = await axios.get(`${WAHA_API_URL}/api/${sessionName}/auth/qr`, { headers: WAHA_HEADERS });
    if (authRes.data && authRes.data.data) {
      return res.json({ status: 'AWAITING_QR', qr: authRes.data.data });
    } else {
      return res.json({ status: 'STARTING', message: 'Generating QR code, please wait...' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to communicate with WAHA Server' });
  }
});

app.get('/api/waha/status', verifyAuth, async (req, res) => {
  try {
    const sessionName = req.user.uid;
    if (WAHA_API_URL === 'mock') {
        return res.json({ status: 'CONNECTED', detail: { status: 'WORKING' } });
    }
    const statusRes = await axios.get(`${WAHA_API_URL}/api/sessions/${sessionName}/status`, { headers: WAHA_HEADERS });
    const wahaStatus = statusRes.data.status;
    let uiStatus = 'DISCONNECTED';
    if (wahaStatus === 'WORKING') uiStatus = 'CONNECTED';
    if (wahaStatus === 'STARTING') uiStatus = 'AWAITING_QR';
    res.json({ status: uiStatus, detail: statusRes.data });
  } catch (error) {
    res.json({ status: 'DISCONNECTED' });
  }
});

app.post('/api/waha/stop', verifyAuth, async (req, res) => {
  try {
    const sessionName = req.user.uid;
    await axios.post(`${WAHA_API_URL}/api/sessions/${sessionName}/logout`, {}, { headers: WAHA_HEADERS });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout session' });
  }
});

const PORT = process.env.PORT || 3000;
// In serverless environments, we don't start the server using listen
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 FlowStack Backend Proxy listening on port ${PORT}`);
  });
}

module.exports = app;
