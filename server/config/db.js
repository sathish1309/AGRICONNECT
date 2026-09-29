const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'agriconnect';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;

let pool = null;
let sqlJsDb = null;
let isFallbackMode = false;
const DB_FILE_PATH = path.join(__dirname, '..', 'data', 'agriconnect.sqlite');

/**
 * Initializes MySQL pool or falls back to embedded SQL engine
 */
async function initializeDatabase() {
  try {
    // Attempt connecting to MySQL
    const tempPool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });

    const conn = await tempPool.getConnection();
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    conn.release();

    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      connectTimeout: 3000,
    });

    const testConn = await pool.getConnection();
    testConn.release();

    isFallbackMode = false;
    console.log(`[Database] Connected to MySQL successfully on ${DB_HOST}:${DB_PORT} (DB: ${DB_NAME})`);
    return;
  } catch (err) {
    console.warn(`[Database] MySQL connection failed (${err.code || err.message}).`);
    console.info(`[Database] Activating high-resilience embedded local SQL engine for seamless demonstration.`);
    isFallbackMode = true;
    await initEmbeddedDb();
  }
}

/**
 * Embedded SQL engine initialization for zero-configuration testing
 */
async function initEmbeddedDb() {
  const SQL = await initSqlJs();
  const dataDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(DB_FILE_PATH)) {
    const fileBuffer = fs.readFileSync(DB_FILE_PATH);
    sqlJsDb = new SQL.Database(fileBuffer);
  } else {
    sqlJsDb = new SQL.Database();
    // Execute initialization script
    await setupEmbeddedSchemaAndSeed();
    persistEmbeddedDb();
  }
  console.log(`[Database] Embedded database ready at: ${DB_FILE_PATH}`);
}

function persistEmbeddedDb() {
  if (sqlJsDb) {
    const data = sqlJsDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  }
}

/**
 * Parses MySQL schema & seed into SQLite syntax for embedded engine
 */
async function setupEmbeddedSchemaAndSeed() {
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

  if (fs.existsSync(schemaPath)) {
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    schemaSql = cleanMysqlForSqlite(schemaSql);
    sqlJsDb.run(schemaSql);
  }

  if (fs.existsSync(seedPath)) {
    let seedSql = fs.readFileSync(seedPath, 'utf8');
    seedSql = cleanMysqlForSqlite(seedSql);
    sqlJsDb.run(seedSql);
  }
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

/**
 * Universal query runner matching mysql2 [rows, fields] promise format
 */
async function query(sql, params = []) {
  if (!pool && !sqlJsDb) {
    await initializeDatabase();
  }

  if (!isFallbackMode && pool) {
    try {
      const [rows, fields] = await pool.query(sql, params);
      return [rows, fields];
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[Database] MySQL connection dropped. Falling back to embedded SQL engine.');
        isFallbackMode = true;
        await initEmbeddedDb();
        return query(sql, params);
      }
      throw err;
    }
  }

  // SQLite execution
  return executeSqlite(sql, params);
}

function executeSqlite(sql, params = []) {
  try {
    let normalizedSql = sql.replace(/NOW\(\)/gi, "datetime('now', 'localtime')");
    
    // SQLite uses 1 or 0 for booleans
    const normalizedParams = params.map(p => {
      if (typeof p === 'boolean') return p ? 1 : 0;
      if (p === undefined) return null;
      return p;
    });

    const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(normalizedSql);

    if (isSelect) {
      const stmt = sqlJsDb.prepare(normalizedSql);
      stmt.bind(normalizedParams);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return [rows, []];
    } else {
      sqlJsDb.run(normalizedSql, normalizedParams);
      
      // Get last insert rowid and affected rows before export resets registers
      const lastIdResult = sqlJsDb.exec("SELECT last_insert_rowid() as id, changes() as affected;");
      let insertId = 0;
      let affectedRows = 0;
      if (lastIdResult && lastIdResult[0] && lastIdResult[0].values) {
        insertId = lastIdResult[0].values[0][0];
        affectedRows = lastIdResult[0].values[0][1];
      }

      persistEmbeddedDb();

      return [{ insertId, affectedRows }, []];
    }
  } catch (err) {
    console.error('[Database Engine Error]:', err.message, 'SQL:', sql);
    throw err;
  }
}

// Automatically start connection initialization
initializeDatabase().catch(err => {
  console.error('[Database Init Error]:', err);
});

module.exports = {
  query,
  isFallbackMode: () => isFallbackMode,
  reconnect: initializeDatabase,
};
