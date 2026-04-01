import { pgTable, serial, text, varchar, vector } from "drizzle-orm/pg-core";

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  // This 'vector' column is what we enabled earlier in Neon!
  // '384' is a common size for lightweight AI models.
  embedding: vector("embedding", { dimensions: 384 }), 
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  grade: varchar("grade", { length: 50 }),
});