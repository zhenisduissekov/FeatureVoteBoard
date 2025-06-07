package handlers

import (
	"backend/internal/models"
	"backend/internal/store"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FeatureHandlers struct {
	store *store.FeatureStore
}

func NewFeatureHandlers(store *store.FeatureStore) *FeatureHandlers {
	return &FeatureHandlers{
		store: store,
	}
}

// AddFeatureRequest represents the expected request body for adding a feature
type AddFeatureRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// GetFeatures returns all features, optionally filtered by category
func (h *FeatureHandlers) GetFeatures(c *fiber.Ctx) error {
	// Get category filter from query parameter
	category := c.Query("category")

	// Get all features
	features, err := h.store.GetFeatures()
	if err != nil {
		return err
	}

	// Handle empty features slice
	if features == nil {
		features = []*models.Feature{}
	}

	// Filter by category if specified
	if category != "" {
		filtered := make([]*models.Feature, 0)
		for _, f := range features {
			if f.Category == category {
				filtered = append(filtered, f)
			}
		}
		features = filtered
	}

	return c.JSON(features)
}

// AddFeature handles creating a new feature
func (h *FeatureHandlers) AddFeature(c *fiber.Ctx) error {
	var reqBody AddFeatureRequest
	if err := c.BodyParser(&reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Create new feature
	category := reqBody.Category
	if category == "" {
		category = "Uncategorized"
	}

	feature := &models.Feature{
		ID:          uuid.New().String(),
		Title:       reqBody.Title,
		Description: reqBody.Description,
		Category:    category,
		Votes:       0,
		CreatedAt:   time.Now().UTC(),
	}

	// Add the feature
	if err := h.store.AddFeature(feature); err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(feature)
}

// VoteFeature handles voting for a feature
func (h *FeatureHandlers) VoteFeature(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Feature ID is required")
	}

	if err := h.store.VoteFeature(id); err != nil {
		return err
	}

	return c.Status(fiber.StatusNoContent).Send(nil)
}
