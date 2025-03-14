@echo off
echo Setting up Railway for automatic deployment...

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Login to Railway
echo Logging in to Railway...
railway login

REM Create a new Railway project
echo Creating a new Railway project...
railway init

REM Link the current directory to the Railway project
echo Linking the current directory to the Railway project...
railway link

REM Set up environment variables
echo Setting up environment variables...
railway variables set DEBUG=False
railway variables set SECRET_KEY=%RANDOM%%RANDOM%%RANDOM%%RANDOM%
set /p FRONTEND_URL="Enter your frontend URL (e.g., https://your-frontend-app.com): "
railway variables set FRONTEND_URL=%FRONTEND_URL%

REM Set up the Railway project for automatic deployment
echo Setting up the Railway project for automatic deployment...
echo Make sure you have the following files in your project root:
echo - railway.json
echo - Procfile
echo - requirements.txt
echo - .gitignore

echo.
echo Setup complete! You can now push your code to Railway using:
echo git push railway main
echo.
echo After deployment, update your frontend configuration with the Railway URL.

pause 