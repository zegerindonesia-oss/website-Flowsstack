const { db } = require('../db/db');
const { payments, subscriptions, plans } = require('../db/schema');
const { activateSubscriptionFromPayment, getUserSubscription } = require('../services/subscription');
const { eq, and } = require('drizzle-orm');

// 1. Create Checkout Endpoint
async function createCheckout(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    
    const { planId, billingCycle } = req.body;
    const userId = req.user.uid;
    const email = req.user.email;

    if (!planId || !billingCycle) {
        return res.status(400).json({ error: 'Missing planId or billingCycle' });
    }

    try {
        // Get plan details
        const planResults = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
        if (planResults.length === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        const plan = planResults[0];

        // Apply discount logic
        let discount = 0;
        let months = 1;
        if (billingCycle === '3_months') {
            discount = 0.05;
            months = 3;
        } else if (billingCycle === '6_months') {
            discount = 0.10;
            months = 6;
        } else if (billingCycle === '12_months') {
            discount = 0.20;
            months = 12;
        }

        const basePrice = plan.priceMonthly * months;
        const finalPrice = Math.round(basePrice * (1 - discount));

        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Mock Checkout URL where user completes payment (Simulator page on frontend)
        const checkoutUrl = `/billing.html?paymentId=${paymentId}&amount=${finalPrice}&planName=${encodeURIComponent(plan.name)}&cycle=${billingCycle}`;

        // Create Payment record
        await db.insert(payments).values({
            id: paymentId,
            userId,
            productSlug: plan.productSlug,
            planId,
            amount: finalPrice,
            billingCycle,
            status: 'pending',
            provider: 'mayar',
            checkoutUrl,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.json({ paymentId, checkoutUrl });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}

// 2. Mayar Webhook Endpoint
async function handleMayarWebhook(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });

    const payload = req.body;
    console.log('📥 Mayar Webhook received:', JSON.stringify(payload, null, 2));

    try {
        // Typically, webhook secret is checked in process.env.MAYAR_WEBHOOK_SECRET
        // For MVP, we verify payload details. We expect payload.event === 'payment.success' or simulator trigger
        const isSuccess = payload.event === 'payment.success' || payload.status === 'paid';
        const paymentId = payload.paymentId || (payload.data && payload.data.metadata && payload.data.metadata.paymentId);
        const providerPaymentId = payload.providerPaymentId || (payload.data && payload.data.payment_id);

        if (!paymentId) {
            return res.status(400).json({ error: 'Missing paymentId in webhook payload' });
        }

        // Fetch payment
        const paymentResults = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
        if (paymentResults.length === 0) {
            return res.status(404).json({ error: 'Payment record not found' });
        }
        const payment = paymentResults[0];

        if (isSuccess && payment.status !== 'paid') {
            // Update payment to paid
            await db.update(payments)
                .set({
                    status: 'paid',
                    providerPaymentId: providerPaymentId || 'mock_mayar_tx',
                    paidAt: new Date(),
                    rawPayload: payload,
                    updatedAt: new Date()
                })
                .where(eq(payments.id, paymentId));

            // Activate Subscription
            const subId = await activateSubscriptionFromPayment({
                ...payment,
                providerPaymentId: providerPaymentId || 'mock_mayar_tx'
            });

            console.log(`✅ Subscription ${subId} activated successfully for user ${payment.userId}`);
            return res.json({ success: true, message: 'Payment verified, subscription active', subscriptionId: subId });
        }

        res.json({ success: true, message: 'Webhook processed with status: ' + payment.status });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}

// 3. Get Subscription Endpoint
async function getSubscription(req, res) {
    const userId = req.user.uid;
    try {
        const sub = await getUserSubscription(userId, 'flowapp');
        if (!sub) {
            return res.json({ active: false, planId: null, message: 'No subscription found' });
        }
        res.json({
            active: sub.status === 'active',
            id: sub.id,
            planId: sub.planId,
            status: sub.status,
            billingCycle: sub.billingCycle,
            startsAt: sub.startsAt,
            endsAt: sub.endsAt
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Failed to retrieve subscription' });
    }
}

// 4. Cancel Subscription Request
async function cancelSubscription(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    
    const userId = req.user.uid;
    try {
        const sub = await getUserSubscription(userId, 'flowapp');
        if (!sub || sub.status !== 'active') {
            return res.status(404).json({ error: 'No active subscription to cancel' });
        }

        // In a real system, we request Mayar to cancel the subscription.
        // For MVP, we set subscription to cancel/expired at end of current cycle
        await db.update(subscriptions)
            .set({
                status: 'expired', // or marked-for-expiration
                updatedAt: new Date()
            })
            .where(eq(subscriptions.id, sub.id));

        res.json({ success: true, message: 'Subscription successfully canceled.' });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
}

module.exports = {
    createCheckout,
    handleMayarWebhook,
    getSubscription,
    cancelSubscription
};
