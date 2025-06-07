package router

import (
	"os"

	"backend/internal/handlers"
	"backend/internal/store"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(app *fiber.App, store *store.FeatureStore) {
	// Create handlers
	featureHandlers := handlers.NewFeatureHandlers(store)

	// API v1 group
	api := app.Group("/api")

	// Features routes
	features := api.Group("/features")
	features.Get("", featureHandlers.GetFeatures)
	features.Post("", featureHandlers.AddFeature)
	features.Post("/:id/vote", featureHandlers.VoteFeature)
}

// SetupMiddleware configures the application middleware
func SetupMiddleware(app *fiber.App) {
	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:9099", // Adjust this to your frontend URL
		AllowMethods:     "GET,POST,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	// Logger configuration
	app.Use(logger.New(logger.Config{
		Format: "${time} ${method} ${path} ${status} - ${latency} ${ip}\n",
		Output: os.Stdout,
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "feature-vote-board",
		})
	})
}
