package config

import (
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	BackendPort  string
	DatabaseFile string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	// Set default values
	cfg := &Config{
		BackendPort:  getEnv("BACKEND_PORT", "8088"),
		DatabaseFile: getEnv("DATABASE_FILE", "./data/features.json"),
	}

	// Parse timeouts
	readTimeout, err := strconv.Atoi(getEnv("READ_TIMEOUT", "10"))
	if err != nil {
		return nil, err
	}
	cfg.ReadTimeout = time.Duration(readTimeout) * time.Second

	writeTimeout, err := strconv.Atoi(getEnv("WRITE_TIMEOUT", "10"))
	if err != nil {
		return nil, err
	}
	cfg.WriteTimeout = time.Duration(writeTimeout) * time.Second

	idleTimeout, err := strconv.Atoi(getEnv("IDLE_TIMEOUT", "120"))
	if err != nil {
		return nil, err
	}
	cfg.IdleTimeout = time.Duration(idleTimeout) * time.Second

	return cfg, nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
