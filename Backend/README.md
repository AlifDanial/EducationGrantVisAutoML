# VisAutoML

A web application for automated machine learning with visualization and educational components.

## Project Structure

- **Backend/**: Django backend with ExplainerDashboard integration
- **Frontend/**: React frontend application

## Automatic Deployment to Railway

This project is configured for automatic deployment to Railway. When you push to your Railway project, it will automatically build and deploy the application.

### Prerequisites

1. [Railway account](https://railway.app/)
2. [Railway CLI](https://docs.railway.app/develop/cli)
3. [Node.js](https://nodejs.org/) (for Railway CLI)
4. [Git](https://git-scm.com/)

### Setup for Automatic Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link Your Project**:
   ```bash
   railway link
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set DEBUG=False
   railway variables set SECRET_KEY=your-secure-secret-key
   railway variables set FRONTEND_URL=https://your-frontend-url.com
   ```

5. **Push to Railway**:
   ```bash
   git push railway main
   ```

The application will automatically build and deploy. The `railway.json` file at the root of the project configures the build and deployment process.

### Manual Deployment

You can also deploy manually using the provided scripts:

**Windows**:
```bash
deploy_to_railway.bat
```

**Linux/Mac**:
```bash
chmod +x deploy_to_railway.sh
./deploy_to_railway.sh
```

## Frontend Configuration

After deploying the backend, you need to configure the frontend to use the deployed backend URL:

1. **Set Environment Variables** in your frontend deployment:
   ```
   REACT_APP_API_BASE_URL=https://your-railway-url.com
   REACT_APP_BACKEND_BASE_URL=https://your-railway-url.com/api/
   ```

2. **Update CORS Settings** in the backend:
   ```bash
   railway variables set FRONTEND_URL=https://your-frontend-url.com
   ```

## Architecture

The application uses a multi-session architecture for ExplainerDashboard:

1. Each user gets a unique dashboard session with its own port
2. The `DashboardManager` class manages these sessions
3. The proxy view forwards requests to the appropriate dashboard
4. WebSockets are handled through the proxy mechanism

## Troubleshooting

See [DEPLOYMENT.md](Backend/DEPLOYMENT.md) for detailed troubleshooting information.
