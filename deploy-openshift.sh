#!/bin/bash

# OpenShift Deployment Script for Employee Task Tracker
# Make sure you're logged in to OpenShift: oc login

set -e

PROJECT_NAME="tasktracker"
REGISTRY="your-registry.com"  # Replace with your container registry

echo "🚀 Deploying Employee Task Tracker to OpenShift..."

# Create project if it doesn't exist
echo "📁 Creating/switching to project: $PROJECT_NAME"
oc new-project $PROJECT_NAME 2>/dev/null || oc project $PROJECT_NAME

# Build and push backend image
echo "🔨 Building backend image..."
cd backend
docker build -f Dockerfile.prod -t $REGISTRY/tasktracker-backend:latest .
docker push $REGISTRY/tasktracker-backend:latest
cd ..

# Build and push frontend image  
echo "🔨 Building frontend image..."
cd frontend
docker build -f Dockerfile.prod -t $REGISTRY/tasktracker-frontend:latest .
docker push $REGISTRY/tasktracker-frontend:latest
cd ..

# Update image references in YAML files
echo "📝 Updating image references..."
sed -i "s|your-registry|$REGISTRY|g" openshift/*.yaml

# Deploy database
echo "🗄️ Deploying database..."
oc apply -f openshift/database.yaml

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
oc wait --for=condition=available --timeout=300s deployment/tasktracker-db

# Deploy backend
echo "🔧 Deploying backend API..."
oc apply -f openshift/backend.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
oc wait --for=condition=available --timeout=300s deployment/tasktracker-backend

# Deploy frontend
echo "🎨 Deploying frontend..."
oc apply -f openshift/frontend.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
oc wait --for=condition=available --timeout=300s deployment/tasktracker-frontend

# Get application URLs
echo "🌐 Getting application URLs..."
BACKEND_URL=$(oc get route tasktracker-backend-route -o jsonpath='{.spec.host}')
FRONTEND_URL=$(oc get route tasktracker-frontend-route -o jsonpath='{.spec.host}')

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Application URLs:"
echo "   Frontend: https://$FRONTEND_URL"
echo "   Backend API: https://$BACKEND_URL"
echo "   Swagger: https://$BACKEND_URL/swagger"
echo ""
echo "📊 Check deployment status:"
echo "   oc get pods"
echo "   oc get routes"
echo "   oc logs -f deployment/tasktracker-backend"