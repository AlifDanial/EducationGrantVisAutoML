#!/bin/bash

# Deployment script for EduGrantVisAutoML to Heroku

# Exit on error
set -e

# Configuration - Replace these with your app names
BACKEND_APP_NAME="visautoml-backend"
FRONTEND_APP_NAME="visautoml-frontend"

echo "=== Starting deployment to Heroku ==="

# Login to Heroku
echo "=== Logging in to Heroku ==="
heroku login

# Backend deployment
echo "=== Deploying Backend ==="
cd Backend

# Create Heroku app if it doesn't exist
if ! heroku apps:info $BACKEND_APP_NAME &> /dev/null; then
    echo "Creating Heroku app for backend: $BACKEND_APP_NAME"
    heroku create $BACKEND_APP_NAME
else
    echo "Using existing Heroku app for backend: $BACKEND_APP_NAME"
fi

# Add PostgreSQL addon
if ! heroku addons:info postgresql --app $BACKEND_APP_NAME &> /dev/null; then
    echo "Adding PostgreSQL addon"
    heroku addons:create heroku-postgresql:essential-0 --app $BACKEND_APP_NAME
else
    echo "PostgreSQL addon already exists"
fi

# Configure environment variables
echo "Setting environment variables for backend"
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))") --app $BACKEND_APP_NAME
heroku config:set DEBUG=False --app $BACKEND_APP_NAME
heroku config:set FRONTEND_URL=https://$FRONTEND_APP_NAME.herokuapp.com --app $BACKEND_APP_NAME

# Deploy backend
echo "Pushing backend code to Heroku"
git subtree push --prefix Backend heroku main

# Run migrations
echo "Running migrations"
heroku run python manage.py migrate --app $BACKEND_APP_NAME

# Add scheduler for session cleanup
if ! heroku addons:info scheduler --app $BACKEND_APP_NAME &> /dev/null; then
    echo "Adding scheduler addon"
    heroku addons:create scheduler:standard --app $BACKEND_APP_NAME
    echo "Please manually configure the scheduler to run 'python manage.py cleanup_sessions' daily"
    heroku addons:open scheduler --app $BACKEND_APP_NAME
else
    echo "Scheduler addon already exists"
fi

# Frontend deployment
echo "=== Deploying Frontend ==="
cd ../Frontend

# Create Heroku app if it doesn't exist
if ! heroku apps:info $FRONTEND_APP_NAME &> /dev/null; then
    echo "Creating Heroku app for frontend: $FRONTEND_APP_NAME"
    heroku create $FRONTEND_APP_NAME
else
    echo "Using existing Heroku app for frontend: $FRONTEND_APP_NAME"
fi

# Configure environment variables
echo "Setting environment variables for frontend"
heroku config:set REACT_APP_API_URL=https://$BACKEND_APP_NAME.herokuapp.com --app $FRONTEND_APP_NAME

# Deploy frontend
echo "Pushing frontend code to Heroku"
git subtree push --prefix Frontend heroku main

echo "=== Deployment completed successfully ==="
echo "Backend URL: https://$BACKEND_APP_NAME.herokuapp.com"
echo "Frontend URL: https://$FRONTEND_APP_NAME.herokuapp.com" 