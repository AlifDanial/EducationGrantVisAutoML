#!/bin/bash

# Exit on error
set -e

# Build Docker images
echo "Building Docker images..."
docker build -t visautoml-backend:latest ./Backend
docker build -t visautoml-frontend:latest ./Frontend
docker build -t visautoml-dash:latest ./Backend/dash

# Tag images for your registry
echo "Tagging images..."
docker tag visautoml-backend:latest your-registry.com/visautoml-backend:latest
docker tag visautoml-frontend:latest your-registry.com/visautoml-frontend:latest
docker tag visautoml-dash:latest your-registry.com/visautoml-dash:latest

# Push images to registry
echo "Pushing images to registry..."
docker push your-registry.com/visautoml-backend:latest
docker push your-registry.com/visautoml-frontend:latest
docker push your-registry.com/visautoml-dash:latest

# Create namespace if it doesn't exist
kubectl create namespace visautoml --dry-run=client -o yaml | kubectl apply -f -

# Create database credentials secret
kubectl create secret generic db-credentials \
  --from-literal=db-name=visautoml \
  --from-literal=username=postgres \
  --from-literal=password=your-secure-password \
  -n visautoml \
  --dry-run=client -o yaml | kubectl apply -f -

# Create resource quota for instances
kubectl apply -f - <<EOF
apiVersion: v1
kind: ResourceQuota
metadata:
  name: instance-quota
  namespace: visautoml
spec:
  hard:
    requests.storage: 10Gi
    persistentvolumeclaims: "100"
EOF

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/instance-cleanup-cronjob.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/visautoml-backend -n visautoml
kubectl rollout status deployment/visautoml-frontend -n visautoml

# Set up monitoring (if Prometheus is installed)
if kubectl get namespace monitoring &> /dev/null; then
    echo "Setting up monitoring..."
    kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: visautoml
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: visautoml
  endpoints:
  - port: http
EOF
fi

echo "Deployment completed successfully!"

# Print access information
echo "Access URLs:"
echo "Frontend: https://visautoml.com"
echo "API: https://api.visautoml.com"
echo "Dash: https://dash.visautoml.com" 