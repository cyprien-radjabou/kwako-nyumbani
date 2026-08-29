import { accessSync, chmodSync, constants, mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const configuredPath = process.env.DATABASE_PATH?.trim();

if (configuredPath && !isAbsolute(configuredPath)) {
  throw new Error("DATABASE_PATH must be an absolute path");
}

const databasePath = configuredPath ?? resolve(projectRoot, "data/database.sqlite");
const databaseDirectory = dirname(databasePath);

mkdirSync(databaseDirectory, { recursive: true, mode: 0o750 });
accessSync(databaseDirectory, constants.R_OK | constants.W_OK);

const sqlite = new Database(databasePath);

try {
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  migrate(drizzle(sqlite), { migrationsFolder: resolve(projectRoot, "drizzle") });

  if (process.platform !== "win32") {
    chmodSync(databaseDirectory, 0o750);
    chmodSync(databasePath, 0o640);
  }

  console.log(`SQLite migrations applied: ${databasePath}`);
} finally {
  sqlite.close();
}
