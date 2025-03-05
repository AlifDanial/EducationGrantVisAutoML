import uuid
from django.utils.deprecation import MiddlewareMixin
from .models import UserSession


class UserSessionMiddleware(MiddlewareMixin):
    """
    Middleware to ensure each user has a unique session ID for data isolation.
    This creates or retrieves a UserSession object for each request.
    """
    
    def process_request(self, request):
        # Get the session ID from the cookie, or create a new one
        session_id = request.session.get('user_session_id')
        
        if not session_id:
            # Create a new session
            user_session = UserSession.objects.create()
            session_id = str(user_session.id)
            request.session['user_session_id'] = session_id
        else:
            # Try to get the existing session
            try:
                user_session = UserSession.objects.get(id=uuid.UUID(session_id))
                # Update the last_accessed timestamp
                user_session.save()
            except UserSession.DoesNotExist:
                # Session was deleted or expired, create a new one
                user_session = UserSession.objects.create()
                session_id = str(user_session.id)
                request.session['user_session_id'] = session_id
        
        # Attach the session to the request for use in views
        request.user_session = user_session 