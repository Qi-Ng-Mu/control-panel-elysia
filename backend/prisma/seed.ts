import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "control_panel",
  connectionLimit: 5
});

const prisma = new PrismaClient({adapter});

async function main(): Promise<void> {
  await prisma.systemConfig.upsert({
    where: { key: "seed_check" },
    update: {
      value: { ok: true },
      description: "Seed check",
      isPublic: false
    },
    create: {
      key: "seed_check",
      value: { ok: true },
      description: "Seed check",
      isPublic: false
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
