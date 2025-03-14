@echo off
echo Preparing to deploy to Railway...

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Login to Railway (if not already logged in)
echo Logging in to Railway...
railway login

REM Initialize Railway project if not already initialized
if not exist .railway\config.json (
    echo Initializing Railway project...
    railway init
)

REM Create a .env file for Railway
echo Creating .env file for Railway...
echo DEBUG=False > .env
echo SECRET_KEY=%RANDOM%%RANDOM%%RANDOM%%RANDOM% >> .env
echo FRONTEND_URL=https://your-frontend-url.com >> .env

REM Upload the .env file to Railway
echo Uploading .env file to Railway...
railway variables set --from-file .env

REM Deploy the application
echo Deploying to Railway...
railway up

REM Get the deployed URL
echo Getting deployed URL...
for /f "tokens=*" %%a in ('railway domain') do set RAILWAY_URL=%%a

echo Deployment complete!
echo Your application is deployed at: %RAILWAY_URL%
echo.
echo IMPORTANT: Update your frontend configuration with the following URLs:
echo REACT_APP_API_BASE_URL=%RAILWAY_URL%
echo REACT_APP_BACKEND_BASE_URL=%RAILWAY_URL%/api/
echo.
echo Don't forget to update your CORS settings in Railway with your frontend URL.
echo railway variables set FRONTEND_URL=https://your-frontend-url.com

pause 