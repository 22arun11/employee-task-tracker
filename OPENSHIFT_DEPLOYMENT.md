# 🚀 OpenShift Deployment Guide

## Prerequisites ✅
- [x] Docker images built (`tasktracker-backend:latest`, `tasktracker-frontend:latest`)
- [x] OpenShift CLI installed (`oc`)
- [ ] Red Hat Developer Sandbox account
- [ ] Logged into OpenShift

## Step 1: Get OpenShift Access
1. Go to: https://developers.redhat.com/developer-sandbox
2. Click "Get started for free"
3. Create Red Hat account and verify email
4. Access your sandbox cluster

## Step 2: Login to OpenShift
1. In the OpenShift web console, click your username (top right)
2. Click "Copy login command"
3. Click "Display Token"
4. Copy the `oc login` command and run it in terminal

```bash
oc login --token=sha256~XXXX --server=https://api.sandbox-m2.ll9k.p1.openshiftapps.com:6443
```

## Step 3: Create Project (Namespace)
```bash
oc new-project employee-task-tracker
```

## Step 4: Deploy Application
```bash
# Run our automated deployment script
./deploy-to-openshift.sh
```

## Step 5: Access Your Application
After deployment, get the URLs:
```bash
oc get routes
```

Your application will be available at:
- **Frontend**: `https://tasktracker-frontend-route-YOUR_PROJECT.apps.sandbox-m2.ll9k.p1.openshiftapps.com`
- **Backend API**: `https://tasktracker-backend-route-YOUR_PROJECT.apps.sandbox-m2.ll9k.p1.openshiftapps.com/api`

## Troubleshooting 🔧

### Check Pod Status
```bash
oc get pods
oc describe pod POD_NAME
```

### View Logs
```bash
oc logs -f deployment/tasktracker-backend
oc logs -f deployment/tasktracker-frontend
oc logs -f deployment/tasktracker-db
```

### Check Routes
```bash
oc get routes
oc describe route tasktracker-frontend-route
```

### Scale Pods
```bash
oc scale deployment tasktracker-backend --replicas=3
```

## Manual Steps (if script fails)

### 1. Push Images to Internal Registry
```bash
# Get namespace
NAMESPACE=$(oc project -q)

# Tag images
docker tag tasktracker-backend:latest image-registry.openshift-image-registry.svc:5000/$NAMESPACE/tasktracker-backend:latest
docker tag tasktracker-frontend:latest image-registry.openshift-image-registry.svc:5000/$NAMESPACE/tasktracker-frontend:latest

# Login to registry
TOKEN=$(oc whoami -t)
docker login -u $(oc whoami) -p $TOKEN image-registry.openshift-image-registry.svc:5000

# Push images
docker push image-registry.openshift-image-registry.svc:5000/$NAMESPACE/tasktracker-backend:latest
docker push image-registry.openshift-image-registry.svc:5000/$NAMESPACE/tasktracker-frontend:latest
```

### 2. Deploy Components
```bash
# Deploy database first
oc apply -f openshift/database.yaml

# Wait for database to be ready
oc wait --for=condition=available --timeout=300s deployment/tasktracker-db

# Deploy backend
oc apply -f openshift/backend.yaml

# Wait for backend to be ready
oc wait --for=condition=available --timeout=300s deployment/tasktracker-backend

# Deploy frontend
oc apply -f openshift/frontend.yaml
```

## What You Get 🎉
- ✅ **Production-ready** Employee Task Tracker
- ✅ **Scalable** microservices architecture
- ✅ **Persistent** SQL Server database
- ✅ **HTTPS** enabled routes
- ✅ **Health checks** and auto-restart
- ✅ **Load balancing** across replicas

## Resource Limits (Developer Sandbox)
- **CPU**: 2 vCPU total
- **Memory**: 8GB total
- **Storage**: 40GB total
- **Duration**: 30 days free

Your app should use:
- **Database**: ~2GB memory, 0.5 CPU
- **Backend**: ~512MB memory, 0.5 CPU (2 replicas)
- **Frontend**: ~256MB memory, 0.2 CPU (2 replicas)
- **Total**: ~3.5GB memory, 1.9 CPU ✅ Fits in limits!