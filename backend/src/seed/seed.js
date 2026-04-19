require("dotenv").config();

const connectDatabase = require("../config/db");
const { seedDatabase } = require("./runSeed");

async function run() {
  await connectDatabase();
  const result = await seedDatabase();
  console.log(`Seed completed for ${result.email}`);
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
