import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const dbUser = encodeURIComponent(env("DB_USER"));
const dbPassword = encodeURIComponent(env("DB_PASSWORD"));
const dbHost = env("DB_HOST");
const dbPort = env("DB_PORT");
const dbName = env("DB_NAME");

const databaseUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts"
  },
  datasource: { url: databaseUrl },
});
