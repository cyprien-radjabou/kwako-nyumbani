import { accessSync, chmodSync, constants, mkdirSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

function databasePath() {
  const configured = process.env.DATABASE_PATH?.trim();

  if (process.env.NODE_ENV === "production" && !configured) {
    throw new Error("DATABASE_PATH must be set to an absolute path in production");
  }

  if (configured) {
    if (!isAbsolute(configured)) {
      throw new Error("DATABASE_PATH must be an absolute path");
    }
    return configured;
  }

  return fileURLToPath(new URL("../data/database.sqlite", import.meta.url));
}

const sqlitePath = databasePath();
const sqliteDirectory = dirname(sqlitePath);

mkdirSync(sqliteDirectory, { recursive: true, mode: 0o750 });
accessSync(sqliteDirectory, constants.R_OK | constants.W_OK);

const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("busy_timeout = 5000");

if (process.platform !== "win32") {
  chmodSync(sqliteDirectory, 0o750);
  chmodSync(sqlitePath, 0o640);
}

const db = drizzle(sqlite, { schema });

export function getDb() {
  return db;
}

export { sqlitePath };
