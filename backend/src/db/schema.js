const { pgTable, varchar, text, integer, timestamp, jsonb, boolean } = require('drizzle-orm/pg-core');

// 1. Users Table
const users = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    firebaseUid: varchar('firebase_uid', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique().notNull(),
    photoUrl: text('photo_url'),
    role: varchar('role', { length: 50 }).default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Products Table
const products = pgTable('products', {
    id: varchar('id', { length: 255 }).primaryKey(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Plans Table
const plans = pgTable('plans', {
    id: varchar('id', { length: 255 }).primaryKey(),
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    priceMonthly: integer('price_monthly').notNull(),
    features: jsonb('features').notNull(),
    projectLimit: integer('project_limit').notNull(),
    canExport: boolean('can_export').default(false).notNull(),
    canRemoveBranding: boolean('can_remove_branding').default(false).notNull(),
    canUseCustomDomain: boolean('can_use_custom_domain').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Subscriptions Table
const subscriptions = pgTable('subscriptions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    planId: varchar('plan_id', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).default('inactive').notNull(),
    billingCycle: varchar('billing_cycle', { length: 50 }).notNull(),
    startsAt: timestamp('starts_at'),
    endsAt: timestamp('ends_at'),
    mayarCustomerId: varchar('mayar_customer_id', { length: 255 }),
    mayarPaymentId: varchar('mayar_payment_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Payments Table
const payments = pgTable('payments', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    productSlug: varchar('product_slug', { length: 255 }).notNull(),
    planId: varchar('plan_id', { length: 255 }).notNull(),
    amount: integer('amount').notNull(),
    billingCycle: varchar('billing_cycle', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    provider: varchar('provider', { length: 100 }).default('mayar').notNull(),
    providerPaymentId: varchar('provider_payment_id', { length: 255 }),
    checkoutUrl: text('checkout_url'),
    paidAt: timestamp('paid_at'),
    rawPayload: jsonb('raw_payload'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. FlowApp Projects Table
const flowappProjects = pgTable('flowapp_projects', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    theme: varchar('theme', { length: 100 }),
    status: varchar('status', { length: 50 }).default('draft').notNull(),
    planType: varchar('plan_type', { length: 50 }).default('lite').notNull(),
    gasUrl: text('gas_url'),
    backendCode: text('backend_code'),
    frontendCode: text('frontend_code'),
    readme: text('readme'),
    generatedPrompt: text('generated_prompt'),
    publishedHtml: text('published_html'),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
});

// 7. FlowApp Generations Table
const flowappGenerations = pgTable('flowapp_generations', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    projectId: varchar('project_id', { length: 255 }),
    prompt: text('prompt').notNull(),
    model: varchar('model', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. FlowApp Templates Table
const flowappTemplates = pgTable('flowapp_templates', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    description: text('description'),
    previewImage: text('preview_image'),
    promptTemplate: text('prompt_template').notNull(),
    isPremium: boolean('is_premium').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
