#!/bin/bash

# OpenShift Deployment Script for Employee Task Tracker
echo "🚀 Deploying Employee Task Tracker to OpenShift..."

# Check if logged in to OpenShift
if ! oc whoami &> /dev/null; then
    echo "❌ Please login to OpenShift first:"
    echo "   oc login --token=YOUR_TOKEN --server=YOUR_SERVER"
    exit 1
fi

# Get current project/namespace
NAMESPACE=$(oc project -q)
echo "📍 Current namespace: $NAMESPACE"

# Update YAML files with actual namespace
echo "🔧 Updating YAML files with namespace: $NAMESPACE"
sed -i.bak "s/YOUR_NAMESPACE/$NAMESPACE/g" openshift/frontend.yaml
sed -i.bak "s/YOUR_NAMESPACE/$NAMESPACE/g" openshift/backend.yaml

# Tag and push images to OpenShift internal registry
echo "🏗️  Tagging and pushing images to OpenShift internal registry..."

# Get internal registry URL
REGISTRY=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}' 2>/dev/null || echo "image-registry.openshift-image-registry.svc:5000")

# Tag images for internal registry
docker tag tasktracker-backend:latest $REGISTRY/$NAMESPACE/tasktracker-backend:latest
docker tag tasktracker-frontend:latest $REGISTRY/$NAMESPACE/tasktracker-frontend:latest

# Login to internal registry
echo "🔑 Logging into OpenShift internal registry..."
TOKEN=$(oc whoami -t)
docker login -u $(oc whoami) -p $TOKEN $REGISTRY

# Push images
echo "📤 Pushing backend image..."
docker push $REGISTRY/$NAMESPACE/tasktracker-backend:latest

echo "📤 Pushing frontend image..."
docker push $REGISTRY/$NAMESPACE/tasktracker-frontend:latest

# Deploy to OpenShift
echo "🚀 Deploying to OpenShift..."
oc apply -f openshift/database.yaml
echo "⏳ Waiting for database to be ready..."
sleep 10

oc apply -f openshift/backend.yaml
echo "⏳ Waiting for backend to be ready..."
sleep 15

oc apply -f openshift/frontend.yaml

# Get routes
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application at:"
oc get routes

echo ""
echo "📊 Check pod status:"
oc get pods

echo ""
echo "🔍 To view logs:"
echo "   oc logs -f deployment/tasktracker-backend"
echo "   oc logs -f deployment/tasktracker-frontend"