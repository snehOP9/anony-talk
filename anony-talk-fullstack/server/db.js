const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'anony-talk.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    anonymous_id TEXT UNIQUE NOT NULL,
    encryption_key_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    avatar TEXT,
    nickname TEXT,
    mood TEXT,
    song TEXT,
    funfact TEXT,
    ghost INTEGER DEFAULT 0,
    theme TEXT DEFAULT 'default',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    title TEXT,
    content TEXT NOT NULL,
    category TEXT,
    emoji TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mood_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    mood TEXT NOT NULL,
    date TEXT NOT NULL,
    UNIQUE(user_id, date)
  );

  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    challenge_id TEXT NOT NULL,
    page TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    UNIQUE(user_id, challenge_id, page)
  );
`);

module.exports = db;
