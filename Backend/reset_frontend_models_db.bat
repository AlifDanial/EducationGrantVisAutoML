@echo off
echo ===================================================
echo  Reset All Models in VisAutoML (Database Method)
echo ===================================================
echo.
echo This script will delete all models directly from the database.
echo WARNING: This action cannot be undone!
echo.
set /p confirm=Are you sure you want to proceed? (Y/N): 

if /i "%confirm%" neq "Y" (
    echo Operation cancelled.
    goto :end
)

echo.
echo Deleting all models from the database...
echo.

:: Create a temporary Python script
echo import sqlite3 > temp_db_reset.py
echo import os >> temp_db_reset.py
echo. >> temp_db_reset.py
echo # Path to the database file >> temp_db_reset.py
echo db_path = 'db.sqlite3' >> temp_db_reset.py
echo. >> temp_db_reset.py
echo if not os.path.exists(db_path): >> temp_db_reset.py
echo     print(f'Database file not found: {db_path}') >> temp_db_reset.py
echo     exit(1) >> temp_db_reset.py
echo. >> temp_db_reset.py
echo try: >> temp_db_reset.py
echo     # Connect to the database >> temp_db_reset.py
echo     print('Connecting to the database...') >> temp_db_reset.py
echo     conn = sqlite3.connect(db_path) >> temp_db_reset.py
echo     cursor = conn.cursor() >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     # Get count of models before deletion >> temp_db_reset.py
echo     cursor.execute('SELECT COUNT(*) FROM machine_learning_model') >> temp_db_reset.py
echo     model_count = cursor.fetchone()[0] >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     if model_count == 0: >> temp_db_reset.py
echo         print('No models found in the database.') >> temp_db_reset.py
echo         conn.close() >> temp_db_reset.py
echo         exit(0) >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     print(f'Found {model_count} models to delete.') >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     # Delete all model descriptions first (due to foreign key constraints) >> temp_db_reset.py
echo     print('Deleting model descriptions...') >> temp_db_reset.py
echo     cursor.execute('DELETE FROM machine_learning_modeldescription') >> temp_db_reset.py
echo     desc_count = cursor.rowcount >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     # Delete all models >> temp_db_reset.py
echo     print('Deleting models...') >> temp_db_reset.py
echo     cursor.execute('DELETE FROM machine_learning_model') >> temp_db_reset.py
echo     deleted_count = cursor.rowcount >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     # Commit the changes >> temp_db_reset.py
echo     conn.commit() >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     print(f'Successfully deleted {deleted_count} models and {desc_count} model descriptions.') >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     # Close the connection >> temp_db_reset.py
echo     conn.close() >> temp_db_reset.py
echo. >> temp_db_reset.py
echo     print('Database reset completed successfully!') >> temp_db_reset.py
echo. >> temp_db_reset.py
echo except Exception as e: >> temp_db_reset.py
echo     print(f'An error occurred: {str(e)}') >> temp_db_reset.py
echo     try: >> temp_db_reset.py
echo         conn.close() >> temp_db_reset.py
echo     except: >> temp_db_reset.py
echo         pass >> temp_db_reset.py

:: Run the Python script
python temp_db_reset.py

:: Clean up
del temp_db_reset.py

echo.
echo Operation completed.
echo.
pause

:end 