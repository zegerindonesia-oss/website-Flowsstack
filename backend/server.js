require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');

// Note: To use Firebase Admin, you must download a serviceAccountKey.json from Firebase Console -> Project Settings -> Service Accounts
// and place it in the backend folder.
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized.');
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not initialized. Please add serviceAccountKey.json if you want DB sync.');
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
  
  // For local testing without serviceAccount, we bypass this block if admin is not ready
  if (!admin.apps.length) {
    // Mock user for testing
    req.user = { uid: req.headers['x-mock-uid'] || 'test-user-uid' };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

// 1. START SESSION & GET QR
app.post('/api/waha/start', verifyAuth, async (req, res) => {
  try {
    const sessionName = req.user.uid;
    
    // MOCK MODE FOR LOCAL TESTING
    if (WAHA_API_URL === 'mock') {
        console.log(`[MOCK] Starting WAHA session for ${sessionName}`);
        return res.json({ 
            status: 'AWAITING_QR', 
            qr: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' 
        });
    }

    // Attempt to start a new session in WAHA
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
      // If it fails, maybe it already exists. We ignore error and proceed to get Auth/QR.
      if (e.response && e.response.status !== 409) {
         console.error('Error starting session:', e.message);
      }
    });

    // Check status
    const statusRes = await axios.get(`${WAHA_API_URL}/api/sessions/${sessionName}/status`, { headers: WAHA_HEADERS });
    const status = statusRes.data.status;

    if (status === 'WORKING') {
      return res.json({ status: 'CONNECTED', message: 'WhatsApp is already connected.' });
    }

    // Get QR Code
    const authRes = await axios.get(`${WAHA_API_URL}/api/${sessionName}/auth/qr`, { headers: WAHA_HEADERS });
    if (authRes.data && authRes.data.data) {
      // WAHA returns base64 string usually in data or image
      return res.json({ status: 'AWAITING_QR', qr: authRes.data.data });
    } else {
      return res.json({ status: 'STARTING', message: 'Generating QR code, please wait...' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to communicate with WAHA Server' });
  }
});

// 2. CHECK SESSION STATUS
app.get('/api/waha/status', verifyAuth, async (req, res) => {
  try {
    const sessionName = req.user.uid;

    if (WAHA_API_URL === 'mock') {
        // Simulate scanning after 1 status check
        console.log(`[MOCK] Status check for ${sessionName} -> returning CONNECTED`);
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

// 3. LOGOUT SESSION
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
app.listen(PORT, () => {
  console.log(`HaloFlow Backend Proxy listening on port ${PORT}`);
});
