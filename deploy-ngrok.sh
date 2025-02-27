#!/bin/bash

# Kill any existing ngrok processes
pkill ngrok

# Start services in the background
cd Backend
python manage.py runserver 8000 &
DJANGO_PID=$!

cd dash
python app.py &
DASH_PID=$!

cd ../../Frontend
npm start &
REACT_PID=$!

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Start ngrok tunnels
ngrok start --config ngrok.yml &
NGROK_PID=$!

# Wait for ngrok to start
echo "Waiting for ngrok to start..."
sleep 5

# Get ngrok URLs
echo "Fetching ngrok URLs..."
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="frontend") | .public_url')
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="backend") | .public_url')
DASH_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="dash") | .public_url')

# Update frontend environment
echo "REACT_APP_API_URL=${BACKEND_URL}" > Frontend/.env
echo "REACT_APP_DASH_URL=${DASH_URL}" >> Frontend/.env

# Display URLs
echo "============================================"
echo "Frontend URL: ${FRONTEND_URL}"
echo "Backend URL: ${BACKEND_URL}"
echo "Dash URL: ${DASH_URL}"
echo "============================================"

# Function to cleanup processes
cleanup() {
    echo "Cleaning up processes..."
    kill $DJANGO_PID
    kill $DASH_PID
    kill $REACT_PID
    kill $NGROK_PID
    exit 0
}

# Set up cleanup on script termination
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Services are running. Press Ctrl+C to stop."
while true; do sleep 1; done 