@echo off
echo ===================================================
echo  Reset All Models in VisAutoML
echo ===================================================
echo.
echo This script will delete all models from the system.
echo WARNING: This action cannot be undone!
echo.
set /p confirm=Are you sure you want to proceed? (Y/N): 

if /i "%confirm%" neq "Y" (
    echo Operation cancelled.
    goto :end
)

echo.
echo Deleting all models...
echo.

:: Create a temporary Python script
echo import requests > temp_reset_script.py
echo import json >> temp_reset_script.py
echo import time >> temp_reset_script.py
echo. >> temp_reset_script.py
echo # Backend URL >> temp_reset_script.py
echo backend_url = 'http://localhost:8000/api/' >> temp_reset_script.py
echo. >> temp_reset_script.py
echo try: >> temp_reset_script.py
echo     # Get all models >> temp_reset_script.py
echo     print('Fetching models...') >> temp_reset_script.py
echo     response = requests.get(backend_url + 'table/') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     if response.status_code != 200: >> temp_reset_script.py
echo         print(f'Error fetching models: {response.status_code}') >> temp_reset_script.py
echo         exit(1) >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     models = response.json() >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     if not models: >> temp_reset_script.py
echo         print('No models found to delete.') >> temp_reset_script.py
echo         exit(0) >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     print(f'Found {len(models)} models to delete.') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     # Delete each model >> temp_reset_script.py
echo     for model in models: >> temp_reset_script.py
echo         model_id = model['id'] >> temp_reset_script.py
echo         model_name = model['model_name'] >> temp_reset_script.py
echo         print(f'Deleting model: {model_name} (ID: {model_id})...') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo         delete_response = requests.delete(backend_url + str(model_id) + '/') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo         if delete_response.status_code != 200: >> temp_reset_script.py
echo             print(f'Error deleting model {model_id}: {delete_response.status_code}') >> temp_reset_script.py
echo         else: >> temp_reset_script.py
echo             print(f'Successfully deleted model: {model_name}') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo         # Small delay to avoid overwhelming the server >> temp_reset_script.py
echo         time.sleep(0.5) >> temp_reset_script.py
echo. >> temp_reset_script.py
echo     print('All models have been deleted successfully!') >> temp_reset_script.py
echo. >> temp_reset_script.py
echo except Exception as e: >> temp_reset_script.py
echo     print(f'An error occurred: {str(e)}') >> temp_reset_script.py

:: Run the Python script
python temp_reset_script.py

:: Clean up
del temp_reset_script.py

echo.
echo Operation completed.
echo.
pause

:end 