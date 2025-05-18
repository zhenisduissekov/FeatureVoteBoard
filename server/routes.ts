import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeatureSchema, insertVoteSchema } from "@shared/schema";
import session from "express-session";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create memory store for sessions
  const MemoryStoreSession = MemoryStore(session);
  
  // Setup express session middleware
  app.use(
    session({
      secret: "feature-vote-session-secret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 86400000 }, // 1 day
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Get all features
  app.get("/api/features", async (req: Request, res: Response) => {
    try {
      const features = await storage.getAllFeatures();
      return res.json(features);
    } catch (error) {
      console.error("Error fetching features:", error);
      return res.status(500).json({ message: "Failed to fetch features" });
    }
  });

  // Get a single feature by ID
  app.get("/api/features/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      
      const feature = await storage.getFeatureById(id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      return res.json(feature);
    } catch (error) {
      console.error("Error fetching feature:", error);
      return res.status(500).json({ message: "Failed to fetch feature" });
    }
  });

  // Create a new feature
  app.post("/api/features", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFeatureSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const newFeature = await storage.createFeature(validatedData.data);
      return res.status(201).json(newFeature);
    } catch (error) {
      console.error("Error creating feature:", error);
      return res.status(500).json({ message: "Failed to create feature" });
    }
  });

  // Vote for a feature
  app.post("/api/features/:id/vote", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      
      // Ensure we have a session ID
      if (!req.session.id) {
        return res.status(500).json({ message: "Session not initialized" });
      }
      
      // Check if feature exists
      const feature = await storage.getFeatureById(id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      // Check if user has already voted
      const hasVoted = await storage.hasVoted(id, req.session.id);
      if (hasVoted) {
        return res.status(400).json({ message: "Already voted for this feature" });
      }
      
      // Add the vote
      const vote = await storage.addVote({
        featureId: id,
        sessionId: req.session.id
      });
      
      // Return the updated feature
      const updatedFeature = await storage.getFeatureById(id);
      return res.json(updatedFeature);
    } catch (error) {
      console.error("Error voting for feature:", error);
      return res.status(500).json({ message: "Failed to vote for feature" });
    }
  });

  // Check if user has voted for a feature
  app.get("/api/features/:id/voted", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      
      // If no session, they haven't voted
      if (!req.session.id) {
        return res.json({ voted: false });
      }
      
      const hasVoted = await storage.hasVoted(id, req.session.id);
      return res.json({ voted: hasVoted });
    } catch (error) {
      console.error("Error checking vote status:", error);
      return res.status(500).json({ message: "Failed to check vote status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
