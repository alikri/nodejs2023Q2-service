#!/bin/sh

# Wait for the PostgreSQL server to be available
echo "Waiting for PostgreSQL to start"
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Check if migrations have been run already
if [ ! -f /tmp/migrations.lock ]; then
  echo "Running migrations"
  npm run migration:run
  touch /tmp/migrations.lock  
fi

# Start your application in development mode
echo "Starting the application in development mode"
npm run start:dev
