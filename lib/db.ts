// lib/db.ts

import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";

const dbPath = process.env.DB_PATH || "./data/library.db";

const globalForDb = global as unknown as { db: DatabaseType };

export const db = globalForDb.db || new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

db.pragma("foreign_keys = ON");
