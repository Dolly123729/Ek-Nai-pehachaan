import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// This manually force-loads the file
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // This tells Drizzle: "Use this specific variable from my file"
    url: process.env.DATABASE_URL as string,
  },
});