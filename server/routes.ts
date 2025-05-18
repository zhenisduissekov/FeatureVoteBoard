import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import apiRoutes from "./routes/api";
import path from "path";

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

  // Use API routes
  app.use("/api", apiRoutes);

  // Route for admin panel
  app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });

  const httpServer = createServer(app);
  return httpServer;
}
