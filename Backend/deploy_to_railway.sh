#!/bin/bash

# Deploy to Railway script
echo "Preparing to deploy to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "Logging in to Railway..."
railway login

# Initialize Railway project if not already initialized
if [ ! -f .railway/config.json ]; then
    echo "Initializing Railway project..."
    railway init
fi

# Create a .env file for Railway
echo "Creating .env file for Railway..."
cat > .env << EOL
DEBUG=False
SECRET_KEY=$(openssl rand -hex 32)
FRONTEND_URL=https://your-frontend-url.com
EOL

# Upload the .env file to Railway
echo "Uploading .env file to Railway..."
railway variables set --from-file .env

# Deploy the application
echo "Deploying to Railway..."
railway up

# Get the deployed URL
echo "Getting deployed URL..."
RAILWAY_URL=$(railway domain)

echo "Deployment complete!"
echo "Your application is deployed at: $RAILWAY_URL"
echo ""
echo "IMPORTANT: Update your frontend configuration with the following URLs:"
echo "REACT_APP_API_BASE_URL=$RAILWAY_URL"
echo "REACT_APP_BACKEND_BASE_URL=$RAILWAY_URL/api/"
echo ""
echo "Don't forget to update your CORS settings in Railway with your frontend URL."
echo "railway variables set FRONTEND_URL=https://your-frontend-url.com" 