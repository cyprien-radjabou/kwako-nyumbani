import { defineConfig } from "drizzle-kit";
import { isAbsolute, resolve } from "node:path";

const configuredPath = process.env.DATABASE_PATH?.trim();

if (configuredPath && !isAbsolute(configuredPath)) {
  throw new Error("DATABASE_PATH must be an absolute path");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: configuredPath ?? resolve("data/database.sqlite"),
  },
});
