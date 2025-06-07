package handlers

import (
	"errors"

	"fmt"
	"os"

	"backend/internal/models"
	"github.com/gofiber/fiber/v2"
)

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error   string            `json:"error"`
	Details map[string]string `json:"details,omitempty"`
}

// ErrorHandler is a centralized error handler for the application
func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	msg := "Internal Server Error"
	var details map[string]string

	var vErr *models.ValidationError
	switch {
	case errors.As(err, &vErr):
		code = fiber.StatusBadRequest
		msg = "Validation failed"
		details = map[string]string{
			vErr.Field: vErr.Msg,
		}
	case errors.Is(err, os.ErrNotExist):
		code = fiber.StatusNotFound
		msg = "Resource not found"
	case errors.Is(err, os.ErrPermission):
		code = fiber.StatusForbidden
		msg = "Permission denied"
	}

	if code >= 500 {
		fmt.Fprintf(os.Stderr, "[ERROR] %s: %v\n", c.Path(), err)
	}

	return c.Status(code).JSON(ErrorResponse{
		Error:   msg,
		Details: details,
	})
}
