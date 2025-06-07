package main

import (
	"backend/internal/config"
	"backend/internal/handlers"
	"backend/internal/router"
	"backend/internal/store"
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"time"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize the feature store
	featureStore := store.NewFeatureStore(cfg.DatabaseFile)

	// Create Fiber app with custom error handler
	app := fiber.New(fiber.Config{
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
		ErrorHandler: handlers.ErrorHandler,
	})

	// Setup middleware
	router.SetupMiddleware(app)

	// Setup routes
	router.SetupRoutes(app, featureStore)

	// Start server in a goroutine
	go func() {
		addr := ":" + cfg.BackendPort
		log.Printf("Server starting on %s...\n", addr)
		if err := app.Listen(addr); err != nil {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server shutdown error: %v\n", err)
	}
	log.Println("Server gracefully stopped")
}

type Feature struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Votes       int       `json:"votes"`
	CreatedAt   time.Time `json:"created_at"`
}

type FeatureStore struct {
	sync.RWMutex
	filePath string
}

func NewFeatureStore(path string) *FeatureStore {
	return &FeatureStore{
		filePath: path,
	}
}

func (fs *FeatureStore) GetFeatures() ([]Feature, error) {
	fs.RLock()
	defer fs.RUnlock()

	// Create data directory if it doesn't exist
	if err := os.MkdirAll(filepath.Dir(fs.filePath), 0755); err != nil {
		return nil, err
	}

	file, err := os.Open(fs.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return []Feature{}, nil
		}
		return nil, err
	}
	defer file.Close()

	var features []Feature
	if err := json.NewDecoder(file).Decode(&features); err != nil {
		// If file is empty, return empty slice
		if err.Error() == "EOF" {
			return []Feature{}, nil
		}
		return nil, err
	}

	return features, nil
}

func (fs *FeatureStore) AddFeature(feature Feature) error {
	fs.Lock()
	defer fs.Unlock()

	features, err := fs.GetFeatures()
	if err != nil {
		return err
	}

	feature.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	feature.CreatedAt = time.Now()
	features = append(features, feature)

	file, err := os.Create(fs.filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(features)
}

func (fs *FeatureStore) VoteFeature(id string) error {
	fs.Lock()
	defer fs.Unlock()

	features, err := fs.GetFeatures()
	if err != nil {
		return err
	}

	found := false
	for i := range features {
		if features[i].ID == id {
			features[i].Votes++
			found = true
			break
		}
	}

	if !found {
		return nil
	}

	file, err := os.Create(fs.filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(features)
}

type Config struct {
	BackendPort  string
	DatabaseFile string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

func LoadConfig() (*Config, error) {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using default values")
	}

	// Set default values
	config := &Config{
		BackendPort:  getEnv("BACKEND_PORT", "8088"),
		DatabaseFile: getEnv("DATABASE_FILE", "./data/features.json"),
	}

	// Parse timeouts
	timeout, err := time.ParseDuration(getEnv("READ_TIMEOUT", "15s"))
	if err != nil {
		return nil, fmt.Errorf("invalid READ_TIMEOUT: %v", err)
	}
	config.ReadTimeout = timeout

	timeout, err = time.ParseDuration(getEnv("WRITE_TIMEOUT", "15s"))
	if err != nil {
		return nil, fmt.Errorf("invalid WRITE_TIMEOUT: %v", err)
	}
	config.WriteTimeout = timeout

	timeout, err = time.ParseDuration(getEnv("IDLE_TIMEOUT", "60s"))
	if err != nil {
		return nil, fmt.Errorf("invalid IDLE_TIMEOUT: %v", err)
	}
	config.IdleTimeout = timeout

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
