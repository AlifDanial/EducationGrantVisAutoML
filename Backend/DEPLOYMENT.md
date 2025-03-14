# Deployment Guide for VisAutoML on Railway

This guide provides step-by-step instructions for deploying the VisAutoML application on Railway.

## Prerequisites

1. [Railway account](https://railway.app/)
2. [Railway CLI](https://docs.railway.app/develop/cli)
3. [Node.js](https://nodejs.org/) (for Railway CLI)
4. [Git](https://git-scm.com/)

## Deployment Steps

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Railway Project

Navigate to your project directory and initialize a Railway project:

```bash
cd Backend
railway init
```

### 4. Configure Environment Variables

Create a `.env` file with the following variables:

```
DEBUG=False
SECRET_KEY=your-secret-key
FRONTEND_URL=https://your-frontend-url.com
```

Upload these variables to Railway:

```bash
railway variables set --from-file .env
```

### 5. Deploy the Application

Deploy your application to Railway:

```bash
railway up
```

### 6. Configure Frontend

Update your frontend configuration with the Railway URL:

```javascript
// Frontend/src/config/config.js
export const API_BASE_URL = "https://your-railway-url.com";
export const BACKEND_BASE_URL = "https://your-railway-url.com/api/";
```

Or set environment variables in your frontend deployment:

```
REACT_APP_API_BASE_URL=https://your-railway-url.com
REACT_APP_BACKEND_BASE_URL=https://your-railway-url.com/api/
```

### 7. Update CORS Settings

Make sure to update the CORS settings in Railway with your frontend URL:

```bash
railway variables set FRONTEND_URL=https://your-frontend-url.com
```

## Automated Deployment

You can use the provided deployment script:

### For Windows:

```bash
Backend\deploy_to_railway.bat
```

### For Linux/Mac:

```bash
chmod +x Backend/deploy_to_railway.sh
./Backend/deploy_to_railway.sh
```

## Troubleshooting

### Dashboard Sessions Not Working

If dashboard sessions are not working, check the following:

1. Ensure the `explainerdashboard` package is installed correctly
2. Check that the model files (`.yaml` and `.joblib`) are properly uploaded to Railway
3. Verify that the ports are correctly configured in the dashboard manager

### Database Issues

If you encounter database issues:

1. Railway automatically provides a PostgreSQL database
2. Check the `DATABASE_URL` environment variable is set correctly
3. Run migrations if needed:

```bash
railway run python manage.py migrate
```

### Static Files Not Loading

If static files are not loading:

1. Make sure you've run `collectstatic`:

```bash
railway run python manage.py collectstatic --noinput
```

2. Verify that WhiteNoise is correctly configured in settings.py

## Architecture Overview

The application uses a multi-session architecture for ExplainerDashboard:

1. Each user gets a unique dashboard session with its own port
2. The `DashboardManager` class manages these sessions
3. The proxy view forwards requests to the appropriate dashboard
4. WebSockets are handled through the proxy mechanism

## Security Considerations

1. Set a strong `SECRET_KEY` in your environment variables
2. Configure `ALLOWED_HOSTS` properly
3. Set `DEBUG=False` in production
4. Configure CORS settings to allow only your frontend domain
5. Use HTTPS for all communications

## Monitoring and Maintenance

1. Railway provides logs for your application
2. Use the Railway dashboard to monitor your application's health
3. Set up alerts for application failures
4. Regularly update dependencies to address security vulnerabilities 