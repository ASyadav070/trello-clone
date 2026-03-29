const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
                    .filter(fn => fn.endsWith('.sql'))
                    .sort(); // Ensure 001, 002 order
    
    for (const file of files) {
      console.log(`Executing migration: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await db.query(sql);
    }
    
    console.log('✔ All migrations executed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

runMigrations();
