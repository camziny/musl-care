import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "./schema";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// For debug purposes
console.log("Using database:", process.env.POSTGRES_URL ? "POSTGRES_URL exists" : "POSTGRES_URL not found");

async function main() {
  try {
    console.log("Starting migration process...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main(); 