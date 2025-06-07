.PHONY: backend frontend dev build clean install test

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	@cd backend && go mod tidy
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install

# Install development tools
dev-tools:
	@echo "Installing development tools..."
	go install github.com/joho/godotenv/cmd/godotenv@latest

# Backend commands
backend:
	@echo "Starting backend server..."
	@cd backend && go run ./cmd/backend/main.go

# Frontend commands
frontend:
	@echo "Starting frontend development server..."
	@cd frontend && npm start

# Development (run both)
dev: install
	@echo "Starting development environment..."
	@echo "Backend: http://localhost:8088"
	@echo "Frontend: http://localhost:9099"
	@echo "-------------------------------"
	@make -j 2 backend frontend

# Build for production
build:
	@echo "Building frontend..."
	@cd frontend && npm install && npm run build
	@echo "Build complete! Run 'make prod' to start the production server."

# Run in production mode
prod: build
	@echo "Starting production server..."
	@echo "Backend: http://localhost:8088"
	@echo "Frontend: http://localhost:9099"
	@cd backend && go run main.go

# Run tests
test:
	@echo "Running backend tests..."
	@cd backend && go test -v ./...
	@echo "\nRunning frontend tests..."
	@cd frontend && CI=true npm test -- --watchAll=false

# Clean up
clean:
	@echo "Cleaning up..."
	@rm -rf frontend/node_modules frontend/build
	@echo "Done!"