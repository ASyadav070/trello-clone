const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const runSeeder = async () => {
  const seedsDir = path.join(__dirname, 'seeds');
  
  try {
    const files = fs.readdirSync(seedsDir)
                    .filter(fn => fn.endsWith('.sql'))
                    .sort();
    
    for (const file of files) {
      console.log(`Executing seed: ${file}...`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
      await db.query(sql);
    }
    
    console.log('✔ All seeds executed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

runSeeder();
