const { mysqlTable, varchar, text, int, timestamp, json, boolean } = require('drizzle-orm/mysql-core');

// 1. Users Table
const users = mysqlTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(), // We use uuid or firebase uid as primary key
    firebaseUid: varchar('firebase_uid', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique().notNull(),
    photoUrl: text('photo_url'),
    role: varchar('role', { length: 50 }).default('user'), // 'user' | 'admin'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 2. Products Table
const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'flowapp'
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 3. Plans Table
const plans = mysqlTable('plans', {
    id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'flowapp-lite'
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(), // 'Lite', 'Pro', 'Cloud'
    priceMonthly: int('price_monthly').notNull(), // standard price in Rp
    features: json('features').notNull(), // array of strings
    projectLimit: int('project_limit').notNull(), // limit number of projects (-1 for unlimited)
    canExport: boolean('can_export').default(false).notNull(),
    canRemoveBranding: boolean('can_remove_branding').default(false).notNull(),
    canUseCustomDomain: boolean('can_use_custom_domain').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 4. Subscriptions Table
const subscriptions = mysqlTable('subscriptions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    planId: varchar('plan_id', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).default('inactive').notNull(), // 'active', 'inactive', 'expired'
    billingCycle: varchar('billing_cycle', { length: 50 }).notNull(), // 'monthly', '3_months', '6_months', '12_months'
    startsAt: timestamp('starts_at'),
    endsAt: timestamp('ends_at'),
    mayarCustomerId: varchar('mayar_customer_id', { length: 255 }),
    mayarPaymentId: varchar('mayar_payment_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 5. Payments Table
const payments = mysqlTable('payments', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    planId: varchar('plan_id', { length: 255 }).notNull(),
    amount: int('amount').notNull(),
    billingCycle: varchar('billing_cycle', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'paid', 'failed'
    provider: varchar('provider', { length: 100 }).default('mayar').notNull(),
    providerPaymentId: varchar('provider_payment_id', { length: 255 }),
    checkoutUrl: text('checkout_url'),
    paidAt: timestamp('paid_at'),
    rawPayload: json('raw_payload'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 6. FlowApp Projects Table
const flowappProjects = mysqlTable('flowapp_projects', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    theme: varchar('theme', { length: 100 }),
    status: varchar('status', { length: 50 }).default('draft').notNull(), // 'draft', 'published'
    planType: varchar('plan_type', { length: 50 }).default('lite').notNull(), // 'lite', 'pro', 'cloud'
    gasUrl: text('gas_url'), // Google Apps Script URL
    backendCode: text('backend_code'), // Code.gs
    frontendCode: text('frontend_code'), // index.html
    readme: text('readme'), // README.md
    generatedPrompt: text('generated_prompt'),
    publishedHtml: text('published_html'),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
});

// 7. FlowApp Generations Table
const flowappGenerations = mysqlTable('flowapp_generations', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    projectId: varchar('project_id', { length: 255 }),
    prompt: text('prompt').notNull(),
    model: varchar('model', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'success', 'failed'
    inputTokens: int('input_tokens'),
    outputTokens: int('output_tokens'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. FlowApp Templates Table
const flowappTemplates = mysqlTable('flowapp_templates', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    description: text('description'),
    previewImage: text('preview_image'),
    promptTemplate: text('prompt_template').notNull(),
    isPremium: boolean('is_premium').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

module.exports = {
    users,
    products,
    plans,
    subscriptions,
    payments,
    flowappProjects,
    flowappGenerations,
    flowappTemplates
};
