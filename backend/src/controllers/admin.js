const { db } = require('../db/db');
const { users, subscriptions, payments, flowappProjects } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Middleware to verify admin access
async function verifyAdmin(req, res, next) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;

    try {
        const results = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (results.length === 0 || results[0].role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admin role required' });
        }
        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(500).json({ error: 'Internal server error verifying admin status' });
    }
}

// 1. List Users
async function listUsers(req, res) {
    try {
        const results = await db.select().from(users);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

// 2. List Subscriptions
async function listSubscriptions(req, res) {
    try {
        const results = await db.select().from(subscriptions);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
}

// 3. List Payments
async function listPayments(req, res) {
    try {
        const results = await db.select().from(payments);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
}

// 4. List All FlowApp Projects
async function listAllProjects(req, res) {
    try {
        const results = await db.select().from(flowappProjects);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}

// 5. Manually Activate / Alter subscription status
async function toggleSubscription(req, res) {
    const { id } = req.params;
    const { status, planId, billingCycle } = req.body;

    try {
        const currentSub = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
        if (currentSub.length === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const now = new Date();
        const endsAt = new Date();
        endsAt.setMonth(now.getMonth() + 1); // 1 month from now

        await db.update(subscriptions)
            .set({
                status: status || 'active',
                planId: planId || currentSub[0].planId,
                billingCycle: billingCycle || currentSub[0].billingCycle,
                endsAt: status === 'active' ? endsAt : currentSub[0].endsAt,
                updatedAt: now
            })
            .where(eq(subscriptions.id, id));

        res.json({ success: true, message: 'Subscription status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to toggle subscription' });
    }
}

module.exports = {
    verifyAdmin,
    listUsers,
    listSubscriptions,
    listPayments,
    listAllProjects,
    toggleSubscription
};
