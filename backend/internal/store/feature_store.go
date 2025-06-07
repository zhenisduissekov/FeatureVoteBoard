package store

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"

	"backend/internal/models"
)

// FeatureStore handles storage and retrieval of features
type FeatureStore struct {
	sync.RWMutex
	filePath string
}

// NewFeatureStore creates a new FeatureStore with the given file path
func NewFeatureStore(filePath string) *FeatureStore {
	// Create directory if it doesn't exist
	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		panic(err)
	}
	return &FeatureStore{
		filePath: filePath,
	}
}

// loadFeatures loads features from the JSON file
func (s *FeatureStore) loadFeatures() ([]*models.Feature, error) {
	s.RLock()
	defer s.RUnlock()

	// Check if file exists
	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		return []*models.Feature{}, nil
	}

	// Read file
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return nil, err
	}

	// Unmarshal JSON
	var features []*models.Feature
	if err := json.Unmarshal(data, &features); err != nil {
		return nil, err
	}

	return features, nil
}

// saveFeatures saves features to the JSON file
func (s *FeatureStore) saveFeatures(features []*models.Feature) error {
	s.Lock()
	defer s.Unlock()

	// Marshal to JSON
	data, err := json.MarshalIndent(features, "", "  ")
	if err != nil {
		return err
	}

	// Write to file
	tmpFile := s.filePath + ".tmp"
	if err := os.WriteFile(tmpFile, data, 0644); err != nil {
		return err
	}

	// Rename the temporary file to the actual file
	return os.Rename(tmpFile, s.filePath)
}

// GetFeatures returns all features
func (s *FeatureStore) GetFeatures() ([]*models.Feature, error) {
	return s.loadFeatures()
}

// AddFeature adds a new feature
func (s *FeatureStore) AddFeature(feature *models.Feature) error {
	// Validate feature
	if err := feature.Validate(); err != nil {
		return err
	}

	// Load existing features
	features, err := s.loadFeatures()
	if err != nil {
		return err
	}

	// Add new feature
	features = append(features, feature)

	// Save back to file
	return s.saveFeatures(features)
}

// VoteFeature increments the vote count for a feature
func (s *FeatureStore) VoteFeature(id string) error {
	// Load existing features
	features, err := s.loadFeatures()
	if err != nil {
		return err
	}

	// Find and update the feature
	found := false
	for _, f := range features {
		if f.ID == id {
			f.Votes++
			found = true
			break
		}
	}

	if !found {
		return errors.New("feature not found")
	}

	// Save back to file
	return s.saveFeatures(features)
}
