#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# Wait for PostgreSQL to be ready
sleep 5

echo "Running database migrations..."
# Run database migrations
npm run db:push

echo "Database initialization completed!"