const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('./schema');

// The DATABASE_URL must be formatted as: mysql://user:password@host:port/database
const connectionString = process.env.DATABASE_URL;

let db;

if (connectionString) {
    try {
        const poolConnection = mysql.createPool(connectionString);
        db = drizzle(poolConnection, { schema });
        console.log('✅ Drizzle Database initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Drizzle DB:', err.message);
    }
} else {
    console.warn('⚠️ DATABASE_URL environment variable is missing. Database operations will fail.');
}

module.exports = { db };
