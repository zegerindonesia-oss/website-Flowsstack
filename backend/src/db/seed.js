const { db } = require('./db');
const { products, plans, flowappTemplates } = require('./schema');

async function seedDatabase() {
    if (!db) {
        console.warn('⚠️ Database connection is not available. Skipping seeding.');
        return;
    }

    try {
        console.log('🌱 Seeding database...');

        // 1. Seed FlowApp Product
        await db.insert(products).values({
            id: 'flowapp',
            slug: 'flowapp',
            name: 'FlowApp',
            description: 'Generate Google Apps Script + Sheets + HTML apps with AI.',
            status: 'active'
        }).onDuplicateKeyUpdate({
            set: { name: 'FlowApp', description: 'Generate Google Apps Script + Sheets + HTML apps with AI.' }
        });

        // 2. Seed Plans
        const plansToSeed = [
            {
                id: 'flowapp-lite',
                productSlug: 'flowapp',
                name: 'FlowApp Lite',
                priceMonthly: 199000,
                features: ['AI app generator', 'Code.gs generator', 'index.html generator', 'Google Apps Script backend', 'Google Sheets database', 'Basic CRUD', 'Basic auth template', '20 projects limit', 'Publish to FlowStack URL', 'FlowStack branding'],
                projectLimit: 20,
                canExport: false,
                canRemoveBranding: false,
                canUseCustomDomain: false
            },
            {
                id: 'flowapp-pro',
                productSlug: 'flowapp',
                name: 'FlowApp Pro',
                priceMonthly: 399000,
                features: ['Everything in Lite', 'Advanced CRUD operations', 'Auth, session & role access', 'Audit logs database', 'Admin dashboard view', 'Premium UI templates', 'Export source code ZIP', '100 projects limit', 'Remove FlowStack branding', 'Priority AI generation'],
                projectLimit: 100,
                canExport: true,
                canRemoveBranding: true,
                canUseCustomDomain: false
            },
            {
                id: 'flowapp-cloud',
                productSlug: 'flowapp',
                name: 'FlowApp Cloud',
                priceMonthly: 599000,
                features: ['Everything in Pro', 'Unlimited projects limit', 'Hosted app workspace', 'Custom domain requests', 'Team workspace sharing', 'Template marketplace access', 'Advanced AI refinement console', 'Deployment assistant', 'White-label options'],
                projectLimit: -1,
                canExport: true,
                canRemoveBranding: true,
                canUseCustomDomain: true
            }
        ];

        for (const plan of plansToSeed) {
            await db.insert(plans).values(plan).onDuplicateKeyUpdate({
                set: {
                    name: plan.name,
                    priceMonthly: plan.priceMonthly,
                    features: plan.features,
                    projectLimit: plan.projectLimit,
                    canExport: plan.canExport,
                    canRemoveBranding: plan.canRemoveBranding,
                    canUseCustomDomain: plan.canUseCustomDomain
                }
            });
        }

        // 3. Seed initial templates
        const templatesToSeed = [
            {
                id: 'temp_crm',
                name: 'Customer CRM & Lead Tracker',
                category: 'Business',
                description: 'Manage sales pipelines, log customer communication, and export charts to Google Sheets.',
                previewImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop',
                promptTemplate: 'Build a beautiful, dark-themed CRM dashboard for tracking business leads. Include columns for Name, Email, Phone, Status (New, Contacted, In Progress, Closed Won, Closed Lost), Deal Value, and Notes. Implement full CRUD capabilities connected to a spreadsheet sheet named "CRM Leads". Add a dashboard component with total pipeline value and status counters.',
                isPremium: false
            },
            {
                id: 'temp_hr',
                name: 'HR Employee Directory & Check-in',
                category: 'HR',
                description: 'Track team profiles, manage department roles, and log real-time check-in and check-out logs.',
                previewImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop',
                promptTemplate: 'Build an HR Employee Management portal. Features should include employee directory list, department filter, and employee addition form (Name, Employee ID, Department, Position, Status). Implement an attendance check-in/check-out timestamp logger database inside a sheet named "Attendance Logs".',
                isPremium: true
            },
            {
                id: 'temp_inventory',
                name: 'Stock Inventory Manager',
                category: 'Utility',
                description: 'Record stock items, alert for low-quantity levels, and audit supply adjustments.',
                previewImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop',
                promptTemplate: 'Build an inventory manager with items catalog (Item Name, SKU, Stock Level, Price, Minimum Threshold). Add a color indicator (red warning) when stock falls below minimum threshold. Implement functions to add stock adjustments with auditor initials logging to Google Sheets.',
                isPremium: false
            }
        ];

        for (const template of templatesToSeed) {
            await db.insert(flowappTemplates).values(template).onDuplicateKeyUpdate({
                set: {
                    name: template.name,
                    category: template.category,
                    description: template.description,
                    previewImage: template.previewImage,
                    promptTemplate: template.promptTemplate,
                    isPremium: template.isPremium
                }
            });
        }

        console.log('✅ Seeding completed successfully.');
    } catch (err) {
        console.error('❌ Seeding database failed:', err.message);
    }
}

module.exports = { seedDatabase };
