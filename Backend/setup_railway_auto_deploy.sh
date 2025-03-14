#!/bin/bash

echo "Setting up Railway for automatic deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "Logging in to Railway..."
railway login

# Create a new Railway project
echo "Creating a new Railway project..."
railway init

# Link the current directory to the Railway project
echo "Linking the current directory to the Railway project..."
railway link

# Set up environment variables
echo "Setting up environment variables..."
railway variables set DEBUG=False
railway variables set SECRET_KEY=$(openssl rand -hex 32)
read -p "Enter your frontend URL (e.g., https://your-frontend-app.com): " FRONTEND_URL
railway variables set FRONTEND_URL=$FRONTEND_URL

# Set up the Railway project for automatic deployment
echo "Setting up the Railway project for automatic deployment..."
echo "Make sure you have the following files in your project root:"
echo "- railway.json"
echo "- Procfile"
echo "- requirements.txt"
echo "- .gitignore"

echo ""
echo "Setup complete! You can now push your code to Railway using:"
echo "git push railway main"
echo ""
echo "After deployment, update your frontend configuration with the Railway URL." 