#!/bin/sh

# Wait for the PostgreSQL server to be available
echo "Waiting for PostgreSQL to start"
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Start your application
echo "Starting the application"
npm run start

# Run migrations
echo "Running migrations"
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
