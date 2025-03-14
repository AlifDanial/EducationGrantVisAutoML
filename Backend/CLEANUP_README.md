# Project Cleanup Scripts

This directory contains scripts to clean up the project by:
1. Removing all YAML files (*.yaml)
2. Removing all joblib files (*.joblib)
3. Resetting the Django database

## Available Scripts

- `clean_project.py` - Python script that performs the cleanup
- `clean_project.bat` - Windows batch file to run the Python script
- `clean_project.sh` - Shell script for Unix/Linux/Mac users

## How to Use

### Windows Users

1. Double-click on `clean_project.bat` or run it from the command prompt
2. Confirm the operation when prompted
3. Wait for the script to complete

### Unix/Linux/Mac Users

1. Make the shell script executable:
   ```
   chmod +x clean_project.sh
   ```
2. Run the script:
   ```
   ./clean_project.sh
   ```
3. Confirm the operation when prompted
4. Wait for the script to complete

### Manual Execution (Any Platform)

You can also run the Python script directly:

```
python clean_project.py
```

## What the Script Does

1. **YAML Files**: Finds and removes all files with the `.yaml` extension in the project directory and all subdirectories.

2. **Joblib Files**: Finds and removes all files with the `.joblib` extension in the project directory and all subdirectories.

3. **Database Reset**:
   - Removes the `db.sqlite3` file
   - Removes all migration files (except `__init__.py`)
   - Runs `python manage.py makemigrations` to create new migrations
   - Runs `python manage.py migrate` to apply the migrations

## Safety Features

- The script will ask for confirmation before proceeding
- Detailed output of what files are being removed
- Error handling to prevent crashes

## Warning

**This operation cannot be undone!** Make sure you have backups of any important data before running these scripts. 