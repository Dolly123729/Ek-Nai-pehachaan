import { db } from './index';
import { students, lessons } from './schema';

async function testConnection() {
  try {
    console.log("Checking database connection...");

    // 1. Insert a test student
    const newStudent = await db.insert(students).values({
      name: "Test Student - Dolly",
      grade: "10th",
    }).returning();

    console.log("Successfully added student:", newStudent[0].name);

    // 2. Insert a test lesson
    await db.insert(lessons).values({
      title: "Introduction to AI",
      content: "AI is a digital equalizer for education.",
    });

    console.log("Successfully added test lesson!");
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();