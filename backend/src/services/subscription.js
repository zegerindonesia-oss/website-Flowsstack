const { db } = require('../db/db');
const { subscriptions, plans, flowappProjects, payments } = require('../db/schema');
const { eq, and, desc, count } = require('drizzle-orm');

// 1. Get Plan Limits
function getPlanLimits(planId) {
    // Lite limits
    if (planId === 'flowapp-lite') {
        return {
            projectLimit: 20,
            canExport: false,
            canRemoveBranding: false,
            canUseCustomDomain: false
        };
    }
    // Pro limits
    if (planId === 'flowapp-pro') {
        return {
            projectLimit: 100,
            canExport: true,
            canRemoveBranding: true,
            canUseCustomDomain: false
        };
    }
    // Cloud limits
    if (planId === 'flowapp-cloud') {
        return {
            projectLimit: -1, // Unlimited
            canExport: true,
            canRemoveBranding: true,
            canUseCustomDomain: true
        };
    }
    // Default fallback limits (Inactive/Free)
    return {
        projectLimit: 0,
        canExport: false,
        canRemoveBranding: false,
        canUseCustomDomain: false
    };
}

// 2. Get active user subscription details
async function getUserSubscription(userId, productSlug = 'flowapp') {
    if (!db) return null;
    try {
        const results = await db.select()
            .from(subscriptions)
            .where(
                and(
                    eq(subscriptions.userId, userId),
                    eq(subscriptions.productSlug, productSlug)
                )
            )
            .orderBy(desc(subscriptions.createdAt))
            .limit(1);

        if (results.length === 0) return null;
        
        // Expire subscription locally if current time is past endsAt
        const sub = results[0];
        const now = new Date();
        if (sub.endsAt && now > new Date(sub.endsAt) && sub.status === 'active') {
            await db.update(subscriptions)
                .set({ status: 'expired', updatedAt: new Date() })
                .where(eq(subscriptions.id, sub.id));
            sub.status = 'expired';
        }

        return sub;
    } catch (err) {
        console.error('Error fetching user subscription:', err.message);
        return null;
    }
}

// 3. Helper to verify if user has active subscription
async function hasActiveSubscription(userId, productSlug = 'flowapp') {
    const sub = await getUserSubscription(userId, productSlug);
    return sub && sub.status === 'active';
}

// 4. Enforce project limits based on subscription
async function canCreateProject(userId) {
    if (!db) return false;
    try {
        const sub = await getUserSubscription(userId, 'flowapp');
        if (!sub || sub.status !== 'active') return false;

        const limits = getPlanLimits(sub.planId);
        if (limits.projectLimit === -1) return true; // Unlimited

        // Count projects created by this user
        const projectsCount = await db.select({ value: count() })
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.userId, userId),
                    eq(flowappProjects.status, 'published') // or active
                )
            );
            
        const countVal = projectsCount[0] ? projectsCount[0].value : 0;
        return countVal < limits.projectLimit;
    } catch (err) {
        console.error('Error verifying project limits:', err.message);
        return false;
    }
}

// 5. Activate subscription upon successful Mayar payment webhook trigger
async function activateSubscriptionFromPayment(payment) {
    if (!db) return null;
    try {
        const now = new Date();
        let daysToAdd = 30; // Default monthly
        
        if (payment.billingCycle === '3_months') daysToAdd = 90;
        else if (payment.billingCycle === '6_months') daysToAdd = 180;
        else if (payment.billingCycle === '12_months') daysToAdd = 365;

        const endsAt = new Date();
        endsAt.setDate(now.getDate() + daysToAdd);

        // Generate UUID
        const subId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Check if there is an existing subscription
        const existing = await db.select()
            .from(subscriptions)
            .where(
                and(
                    eq(subscriptions.userId, payment.userId),
                    eq(subscriptions.productSlug, payment.productSlug)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            // Update subscription
            const currentSub = existing[0];
            let newEndsAt = endsAt;
            // If already active, extend
            if (currentSub.status === 'active' && currentSub.endsAt && new Date(currentSub.endsAt) > now) {
                newEndsAt = new Date(currentSub.endsAt);
                newEndsAt.setDate(newEndsAt.getDate() + daysToAdd);
            }

            await db.update(subscriptions)
                .set({
                    planId: payment.planId,
                    status: 'active',
                    billingCycle: payment.billingCycle,
                    startsAt: now,
                    endsAt: newEndsAt,
                    mayarPaymentId: payment.providerPaymentId,
                    updatedAt: now
                })
                .where(eq(subscriptions.id, currentSub.id));
            
            return currentSub.id;
        } else {
            // Insert new subscription
            await db.insert(subscriptions).values({
                id: subId,
                userId: payment.userId,
                productSlug: payment.productSlug,
                planId: payment.planId,
                status: 'active',
                billingCycle: payment.billingCycle,
                startsAt: now,
                endsAt: endsAt,
                mayarPaymentId: payment.providerPaymentId,
                createdAt: now,
                updatedAt: now
            });
            return subId;
        }
    } catch (err) {
        console.error('Error activating subscription from payment:', err.message);
        return null;
    }
}

// 6. Expire subscription helper
async function expireSubscriptionIfNeeded(userId) {
    await getUserSubscription(userId, 'flowapp');
}

module.exports = {
    getPlanLimits,
    getUserSubscription,
    hasActiveSubscription,
    canCreateProject,
    activateSubscriptionFromPayment,
    expireSubscriptionIfNeeded
};
