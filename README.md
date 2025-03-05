# EduGrantVisAutoML

A web application for automated machine learning visualization and analysis.

## Project Structure

- **Backend**: Django REST API with machine learning capabilities
- **Frontend**: React-based user interface

## Deployment to Heroku

### Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. [Git](https://git-scm.com/) installed
3. Heroku account

### Backend Deployment

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Login to Heroku:
   ```
   heroku login
   ```

3. Create a new Heroku app:
   ```
   heroku create your-backend-app-name
   ```

4. Add PostgreSQL addon:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. Configure environment variables:
   ```
   heroku config:set SECRET_KEY=your_secret_key
   heroku config:set DEBUG=False
   heroku config:set FRONTEND_URL=https://your-frontend-app-name.herokuapp.com
   ```

6. Deploy the backend:
   ```
   git subtree push --prefix Backend heroku main
   ```

7. Run migrations:
   ```
   heroku run python manage.py migrate
   ```

8. Create a scheduled task for session cleanup:
   ```
   heroku addons:create scheduler:standard
   heroku addons:open scheduler
   ```
   Add the following command to run daily:
   ```
   python manage.py cleanup_sessions
   ```

### Frontend Deployment

1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Create a new Heroku app:
   ```
   heroku create your-frontend-app-name
   ```

3. Configure environment variables:
   ```
   heroku config:set REACT_APP_API_URL=https://your-backend-app-name.herokuapp.com
   ```

4. Deploy the frontend:
   ```
   git subtree push --prefix Frontend heroku main
   ```

## User Isolation Strategy

The application implements a session-based user isolation strategy:

1. Each user gets a unique session ID stored in a cookie
2. All user data is associated with their session
3. Sessions expire after 24 hours of inactivity
4. A scheduled task cleans up expired sessions and their associated data

## Local Development

### Backend

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend

1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## License

[MIT](LICENSE) 
