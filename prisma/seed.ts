import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed file start");
  // Prisma queries
  console.log("Seed file end");
}

main()
  .then(async () => {
    console.log("DB seeded successfully, seed: prisma/seed.ts");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
