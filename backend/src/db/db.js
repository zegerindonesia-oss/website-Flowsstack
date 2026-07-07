const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('./schema');

const connectionString = process.env.DATABASE_URL;

let db;

if (connectionString) {
    try {
        const pool = new Pool({
            connectionString: connectionString,
            ssl: connectionString.includes('sslmode=') || connectionString.includes('supabase') || connectionString.includes('sumobase') ? { rejectUnauthorized: false } : false
        });
        db = drizzle(pool, { schema });
        console.log('✅ Drizzle Database (PostgreSQL) initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Drizzle DB (PostgreSQL):', err.message);
    }
} else {
    console.warn('⚠️ DATABASE_URL environment variable is missing. Database operations will fail.');
}

module.exports = { db };
