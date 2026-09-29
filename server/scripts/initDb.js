const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const initSqlJs = require('sql.js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  console.log('--- Initializing AgriConnect Database ---');

  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

  if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
    console.error('Schema or seed file missing!');
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  // 1. Try MySQL initialization if available
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASSWORD = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME || 'agriconnect';
  const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;

  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      multipleStatements: true,
      connectTimeout: 2000,
    });
    console.log(`Connected to MySQL server on ${DB_HOST}:${DB_PORT}`);

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await conn.query(`USE \`${DB_NAME}\`;`);
    console.log(`Executing schema.sql on MySQL...`);
    await conn.query(schemaSql);
    console.log(`Executing seed.sql on MySQL...`);
    await conn.query(seedSql);
    await conn.end();
    console.log('✓ MySQL Database successfully initialized with tables and demo seed data!');
  } catch (err) {
    console.warn(`[Note] MySQL connection check: ${err.message}`);
  }

  // 2. Prepare embedded SQLite fallback DB for instant zero-config testing
  console.log('Preparing zero-configuration embedded database...');
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  const cleanSchema = cleanMysqlForSqlite(schemaSql);
  const cleanSeed = cleanMysqlForSqlite(seedSql);

  try {
    db.run(cleanSchema);
    db.run(cleanSeed);

    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbFilePath = path.join(dataDir, 'agriconnect.sqlite');
    const buffer = Buffer.from(db.export());
    fs.writeFileSync(dbFilePath, buffer);
    console.log(`✓ Embedded fallback database prepared at ${dbFilePath}`);
  } catch (sqliteErr) {
    console.error('Error preparing embedded DB:', sqliteErr.message);
  }

  console.log('\n=============================================');
  console.log('  AGRICONNECT DATABASE SETUP COMPLETE');
  console.log('=============================================');
  console.log('Demo Credentials:');
  console.log(' - Admin:  admin@agriconnect.com  / Admin@123');
  console.log(' - Farmer: ravi@agriconnect.com   / Farmer@123');
  console.log(' - Buyer:  abc@supermarket.com    / Buyer@123');
  console.log('=============================================\n');
}

function cleanMysqlForSqlite(sql) {
  return sql
    .replace(/CREATE DATABASE[^\n;]+;/gi, '')
    .replace(/USE [^\n;]+;/gi, '')
    .replace(/SET FOREIGN_KEY_CHECKS[^\n;]+;/gi, '')
    .replace(/TRUNCATE TABLE `?(\w+)`?;/gi, 'DELETE FROM `$1`;')
    .replace(/ENGINE=InnoDB[^;]*;/gi, ';')
    .replace(/DEFAULT CHARSET=[^;]*;/gi, ';')
    .replace(/COLLATE=[^;]*;/gi, ';')
    .replace(/INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/AUTO_INCREMENT/gi, '')
    .replace(/ENUM\([^)]+\)/gi, 'TEXT')
    .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
    .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
    .replace(/INDEX idx_\w+\s*\([^)]+\),?/gi, '')
    .replace(/UNIQUE KEY uq_\w+\s*\([^)]+\),?/gi, '')
    .replace(/,\s*\)/g, ')');
}

main().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
