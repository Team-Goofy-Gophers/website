import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed file start");
  await prisma.disaster.createMany({
    data: [
      {
        name: "Minor Earthquake",
        intensity: 2,
      },
      {
        name: "Earthquake",
        intensity: 5,
      },

      {
        name: "Flood",
        intensity: 5,
      },
      {
        name: "Wildfires",
        intensity: 5,
      },
      {
        name: "Land Slide",
        intensity: 4,
      },
      {
        name: "Volcanic Eruption",
        intensity: 6,
      },
      {
        name: "Avanlanche",
        intensity: 5,
      },
      {
        name: "Shore Wipe",
        intensity: 2,
      },
      {
        name: "Sink Hole",
        intensity: 1,
      },
      {
        name: "Others",
        intensity: 0,
      },
      {
        name: "Tsunami",
        intensity: 10,
      },
      {
        name: "Major Earthquake",
        intensity: 10,
      },
      {
        name: "Hurricanes",
        intensity: 7,
      },
      {
        name: "Major Flood",
        intensity: 9,
      },
      {
        name: "Major Land Slide",
        intensity: 9,
      },
      {
        name: "Major Volcanic Eruption",
        intensity: 10,
      },
      {
        name: "Major Avanlanche",
        intensity: 10,
      },
    ],
  });
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
