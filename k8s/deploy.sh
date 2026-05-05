#!/bin/bash
# Run this script to deploy everything to Kubernetes
# Usage: bash k8s/deploy.sh

echo "🚀 Deploying Customer Support Ticketing System to Kubernetes..."

echo "📦 Applying secrets..."
kubectl apply -f k8s/secret.yml

echo "🗄️  Deploying MongoDB..."
kubectl apply -f k8s/mongodb/service.yml
kubectl apply -f k8s/mongodb/statefulset.yml

echo "🐇 Deploying RabbitMQ..."
kubectl apply -f k8s/rabbitmq/service.yml
kubectl apply -f k8s/rabbitmq/statefulset.yml

echo "⏳ Waiting for MongoDB and RabbitMQ to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=60s
kubectl wait --for=condition=ready pod -l app=rabbitmq --timeout=60s

echo "⚙️  Deploying application services..."
kubectl apply -f k8s/user-service/
kubectl apply -f k8s/ticket-service/
kubectl apply -f k8s/support-service/
kubectl apply -f k8s/notification-service/
kubectl apply -f k8s/reporting-service/

echo "🌐 Deploying frontend..."
kubectl apply -f k8s/frontend/

echo "📈 Applying HPA..."
kubectl apply -f k8s/hpa.yml

echo ""
echo "✅ Done! Checking pod status..."
kubectl get pods

echo ""
echo "🌍 Frontend available at: http://$(minikube ip):30080"