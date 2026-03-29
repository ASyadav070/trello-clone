require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify database connection
    const client = await db.getClient();
    console.log('✅ Connected to PostgreSQL');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed', err.stack);
    process.exit(1);
  }
};

startServer();
