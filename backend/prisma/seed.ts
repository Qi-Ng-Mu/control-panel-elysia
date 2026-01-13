import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
