#!/usr/bin/env bash
# exit on error
set -o errexit

# Print Python location for debugging
echo "Finding Python..."
which python3 || echo "python3 not found"
which python || echo "python not found"

# Build the project
echo "Building the project..."
/opt/vercel/python3/bin/python3 -m pip install -r requirements.txt

echo "Make Migration..."
/opt/vercel/python3/bin/python3 manage.py makemigrations --noinput
/opt/vercel/python3/bin/python3 manage.py migrate --noinput

echo "Collect Static..."
/opt/vercel/python3/bin/python3 manage.py collectstatic --noinput --clear

# Install python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate 