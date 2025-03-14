# Model Reset Scripts

This directory contains scripts to reset all models in the VisAutoML application. These scripts provide different methods to delete all models from the system.

## Available Scripts

- `reset_frontend_models.bat` - Deletes all models using the API endpoints
- `reset_frontend_models_db.bat` - Deletes all models directly from the database

## How to Use

### API Method (Recommended)

1. Make sure the Django backend server is running
2. Double-click on `reset_frontend_models.bat` or run it from the command prompt
3. Confirm the operation when prompted
4. Wait for the script to complete

This method uses the application's API endpoints to delete models, which ensures that all related data is properly cleaned up.

### Database Method (Alternative)

1. Make sure the Django backend server is NOT running (to avoid database lock issues)
2. Double-click on `reset_frontend_models_db.bat` or run it from the command prompt
3. Confirm the operation when prompted
4. Wait for the script to complete

This method directly modifies the SQLite database to remove all models. Use this method if the API method doesn't work for some reason.

## What the Scripts Do

### API Method (`reset_frontend_models.bat`)

1. Creates a temporary Python script
2. Fetches all models from the backend API
3. Iterates through each model and sends a DELETE request to the API
4. Provides feedback on the deletion process
5. Cleans up the temporary script when done

### Database Method (`reset_frontend_models_db.bat`)

1. Creates a temporary Python script
2. Connects directly to the SQLite database
3. Deletes all records from the `machine_learning_modeldescription` table
4. Deletes all records from the `machine_learning_model` table
5. Commits the changes to the database
6. Cleans up the temporary script when done

## Requirements

Both scripts require Python with the following packages:
- For API method: `requests`
- For Database method: Python's built-in `sqlite3` module

## Safety Features

- Both scripts ask for confirmation before proceeding
- Detailed output of what's happening during the process
- Error handling to prevent crashes

## Warning

**These operations cannot be undone!** Make sure you have backups of any important data before running these scripts. 