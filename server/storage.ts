import { 
  Feature, 
  InsertFeature, 
  FeatureStatus,
  Vote, 
  InsertVote,
  features,
  votes 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Feature methods
  getAllFeatures(): Promise<Feature[]>;
  getFeatureById(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeatureVotes(id: number, votes: number): Promise<Feature | undefined>;
  updateFeatureStatus(id: number, status: FeatureStatus): Promise<Feature | undefined>;
  
  // Vote methods
  hasVoted(featureId: number, sessionId: string): Promise<boolean>;
  addVote(vote: InsertVote): Promise<Vote>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features);
  }

  async getFeatureById(id: number): Promise<Feature | undefined> {
    const result = await db.select().from(features).where(eq(features.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const result = await db.insert(features).values({
      title: insertFeature.title,
      description: insertFeature.description || "",
      status: "pending",
      votes: 0,
    }).returning();
    
    return result[0];
  }

  async updateFeatureVotes(id: number, voteCount: number): Promise<Feature | undefined> {
    const result = await db.update(features)
      .set({ votes: voteCount })
      .where(eq(features.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  async updateFeatureStatus(id: number, status: FeatureStatus): Promise<Feature | undefined> {
    const result = await db.update(features)
      .set({ status })
      .where(eq(features.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  async hasVoted(featureId: number, sessionId: string): Promise<boolean> {
    const result = await db.select()
      .from(votes)
      .where(and(
        eq(votes.featureId, featureId),
        eq(votes.sessionId, sessionId)
      ));
    
    return result.length > 0;
  }

  async addVote(vote: InsertVote): Promise<Vote> {
    // Add the vote
    const [newVote] = await db.insert(votes)
      .values(vote)
      .returning();
    
    // Get the feature
    const feature = await this.getFeatureById(vote.featureId);
    
    if (feature) {
      // Update the vote count
      await this.updateFeatureVotes(feature.id, feature.votes + 1);
    }
    
    return newVote;
  }
}

// In-memory storage implementation for local development and testing
export class MemStorage implements IStorage {
  private features: Map<number, Feature>;
  private votes: Map<number, Vote[]>;
  private currentFeatureId: number;
  private currentVoteId: number;

  constructor() {
    this.features = new Map();
    this.votes = new Map();
    this.currentFeatureId = 1;
    this.currentVoteId = 1;
    
    // Add some initial features for demo purposes
    this.initializeFeatures();
  }

  // Initialize with some sample features
  private initializeFeatures() {
    const initialFeatures: InsertFeature[] = [
      {
        title: "Add ability to filter by tags",
        description: "This will allow enhanced tag-based sorting. Which is very useful to us.",
      },
      {
        title: "Request to add voice command",
        description: "I am using the app with only hands free work, I would love to have voice-command experience.",
      },
      {
        title: "Real-time cloud synchronization",
        description: "I love the offline mode, but it would be nice to sync data across devices.",
      },
      {
        title: "Integrate Timer like Pomodoro",
        description: "This will allow us to focus more on the task at hand.",
      },
      {
        title: "Ability to attach photos and documents",
        description: "I would like to be able to add images and PDFs to show what they are about. It would be nice to be able to add a photo.",
      },
      {
        title: "Collaboration mode with teams",
        description: "Would be great to have a way to collaborate with team members on features.",
      }
    ];
    
    // Define some different statuses for demo
    const statuses: FeatureStatus[] = ["pending", "in-progress", "approved", "done", "canceled", "in-progress"];
    
    // Define some vote counts for demo
    const voteCounts = [76, 41, 67, 30, 12, 24];
    
    // Create the features with different timestamps
    const now = new Date();
    
    initialFeatures.forEach((feature, index) => {
      const daysAgo = index === 0 ? 2 : 
                      index === 1 ? 5 : 
                      index === 2 ? 7 : 
                      index === 3 ? 21 : 
                      index === 4 ? 30 : 14;
                      
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      const newFeature: Feature = {
        id: this.currentFeatureId++,
        title: feature.title,
        description: feature.description || "",
        status: statuses[index],
        votes: voteCounts[index],
        createdAt
      };
      
      this.features.set(newFeature.id, newFeature);
    });
  }

  async getAllFeatures(): Promise<Feature[]> {
    return Array.from(this.features.values());
  }

  async getFeatureById(id: number): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = this.currentFeatureId++;
    const feature: Feature = {
      id,
      title: insertFeature.title,
      description: insertFeature.description || "",
      status: "pending",
      votes: 0,
      createdAt: new Date()
    };
    
    this.features.set(id, feature);
    return feature;
  }

  async updateFeatureVotes(id: number, votes: number): Promise<Feature | undefined> {
    const feature = this.features.get(id);
    if (!feature) return undefined;
    
    const updatedFeature = { ...feature, votes };
    this.features.set(id, updatedFeature);
    return updatedFeature;
  }

  async updateFeatureStatus(id: number, status: FeatureStatus): Promise<Feature | undefined> {
    const feature = this.features.get(id);
    if (!feature) return undefined;
    
    const updatedFeature = { ...feature, status };
    this.features.set(id, updatedFeature);
    return updatedFeature;
  }

  async hasVoted(featureId: number, sessionId: string): Promise<boolean> {
    const featureVotes = this.votes.get(featureId) || [];
    return featureVotes.some(vote => vote.sessionId === sessionId);
  }

  async addVote(vote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const newVote: Vote = {
      id,
      featureId: vote.featureId,
      sessionId: vote.sessionId,
      createdAt: new Date()
    };
    
    // Add vote to the votes map
    const featureVotes = this.votes.get(newVote.featureId) || [];
    featureVotes.push(newVote);
    this.votes.set(newVote.featureId, featureVotes);
    
    // Update the feature's vote count
    const feature = this.features.get(newVote.featureId);
    if (feature) {
      feature.votes += 1;
      this.features.set(feature.id, feature);
    }
    
    return newVote;
  }
}

// Choose which storage implementation to use
// Set to DatabaseStorage to use the database
export const storage = new DatabaseStorage();
