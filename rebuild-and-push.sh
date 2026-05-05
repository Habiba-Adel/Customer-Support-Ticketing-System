#!/bin/bash
set -e  # stop on error

# List of services (order doesn't matter)
SERVICES=("user-service" "ticket-service" "support-service" "notification-service" "reporting-service")

# Docker Hub username
DOCKER_USER="habibaabdelgowad"

echo "🚀 Starting rebuild and push of all backend services..."

for SERVICE in "${SERVICES[@]}"; do
    echo "📦 Building $SERVICE..."
    docker build -t "$DOCKER_USER/$SERVICE:latest" "./$SERVICE"
    
    echo "⬆️ Pushing $SERVICE..."
    docker push "$DOCKER_USER/$SERVICE:latest"
    
    echo "✅ $SERVICE done."
    echo ""
done

echo "🎉 All images built and pushed successfully!"