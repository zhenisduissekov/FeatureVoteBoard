import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define feature status options
export const FeatureStatusEnum = z.enum([
  "pending", 
  "in-progress", 
  "approved", 
  "done", 
  "canceled"
]);

export type FeatureStatus = z.infer<typeof FeatureStatusEnum>;

// Define users table (for reference, not used actively in this app)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Define features table
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().$type<FeatureStatus>().default("pending"),
  votes: integer("votes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define votes tracking table (for preventing duplicate votes)
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  featureId: integer("feature_id").notNull(),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFeatureSchema = createInsertSchema(features)
  .pick({
    title: true,
    description: true,
  })
  .extend({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
  });

export const insertVoteSchema = createInsertSchema(votes).pick({
  featureId: true,
  sessionId: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Feature = typeof features.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
