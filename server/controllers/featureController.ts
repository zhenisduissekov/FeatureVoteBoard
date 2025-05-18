import { Request, Response } from "express";
import { storage } from "../storage";
import { fromZodError } from "zod-validation-error";
import { insertFeatureSchema } from "@shared/schema";

// Get all features
export const getAllFeatures = async (req: Request, res: Response) => {
  try {
    const features = await storage.getAllFeatures();
    return res.json(features);
  } catch (error) {
    console.error("Error fetching features:", error);
    return res.status(500).json({ message: "Failed to fetch features" });
  }
};

// Get a feature by ID
export const getFeatureById = async (req: Request, res: Response) => {
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
};

// Create a new feature
export const createFeature = async (req: Request, res: Response) => {
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
};

// Update a feature status
export const updateFeatureStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid feature ID" });
    }

    const { status } = req.body;
    
    // Validate status
    if (!status || !["pending", "in-progress", "approved", "done", "canceled"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: pending, in-progress, approved, done, canceled" 
      });
    }
    
    const updatedFeature = await storage.updateFeatureStatus(id, status);
    if (!updatedFeature) {
      return res.status(404).json({ message: "Feature not found" });
    }
    
    return res.json(updatedFeature);
  } catch (error) {
    console.error("Error updating feature status:", error);
    return res.status(500).json({ message: "Failed to update feature status" });
  }
};

// Vote for a feature
export const voteForFeature = async (req: Request, res: Response) => {
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
};

// Check if user has voted for a feature
export const checkVoteStatus = async (req: Request, res: Response) => {
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
};