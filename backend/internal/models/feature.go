package models

import (
	"encoding/json"
	"time"
)

// Feature represents a feature request in the system
type Feature struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Votes       int       `json:"votes"`
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"created_at,string"`
}

// MarshalJSON implements the json.Marshaler interface for Feature
type FeatureJSON struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Votes       int    `json:"votes"`
	Category    string `json:"category"`
	CreatedAt   string `json:"created_at"`
}

// MarshalJSON implements the json.Marshaler interface for Feature
func (f *Feature) MarshalJSON() ([]byte, error) {
	// Format the time in UTC to ensure consistent timezone handling
	createdAtUTC := f.CreatedAt.UTC()
	return json.Marshal(&FeatureJSON{
		ID:          f.ID,
		Title:       f.Title,
		Description: f.Description,
		Votes:       f.Votes,
		Category:     f.Category,
		CreatedAt:   createdAtUTC.Format("2006-01-02T15:04:05.999Z"),
	})
}

// UnmarshalJSON implements the json.Unmarshaler interface for Feature
func (f *Feature) UnmarshalJSON(data []byte) error {
	var fjson FeatureJSON
	if err := json.Unmarshal(data, &fjson); err != nil {
		return err
	}

	// Try parsing with the expected format first
	createdAt, err := time.Parse("2006-01-02T15:04:05.999Z", fjson.CreatedAt)
	if err != nil {
		// Fall back to RFC3339 format if the first parse fails
		createdAt, err = time.Parse(time.RFC3339, fjson.CreatedAt)
		if err != nil {
			return err
		}
	}

	// Set the fields from the parsed JSON
	f.ID = fjson.ID
	f.Title = fjson.Title
	f.Description = fjson.Description
	f.Votes = fjson.Votes
	f.Category = fjson.Category
	f.CreatedAt = createdAt

	return nil
}

// Validate checks if the feature has all required fields and they meet requirements
func (f *Feature) Validate() error {
	if f.Title == "" {
		return &ValidationError{Field: "title", Msg: "title is required"}
	}
	if len(f.Title) > 100 {
		return &ValidationError{Field: "title", Msg: "title must be less than 100 characters"}
	}
	if f.Description == "" {
		return &ValidationError{Field: "description", Msg: "description is required"}
	}
	if len(f.Description) > 1000 {
		return &ValidationError{Field: "description", Msg: "description must be less than 1000 characters"}
	}
	return nil
}

// ValidationError represents a validation error
type ValidationError struct {
	Field string `json:"field"`
	Msg   string `json:"message"`
}

func (e *ValidationError) Error() string {
	return e.Msg
}
