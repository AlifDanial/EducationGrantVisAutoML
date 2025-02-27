from functools import wraps
from flask import request, g
from werkzeug.local import LocalProxy
from werkzeug.wrappers import Request, Response
import json

def get_current_instance():
    """Get the current instance ID from Flask's g object."""
    if not hasattr(g, 'instance_id'):
        g.instance_id = request.args.get('instance_id') or request.headers.get('X-Instance-ID')
    return g.instance_id

current_instance = LocalProxy(get_current_instance)

def require_instance_id(f):
    """Decorator to ensure instance ID is present."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        instance_id = get_current_instance()
        if not instance_id:
            return json.dumps({'error': 'Instance ID is required'}), 400, {'Content-Type': 'application/json'}
        return f(*args, **kwargs)
    return decorated_function

class InstanceIsolationMiddleware:
    """Middleware to handle instance isolation in Flask app."""
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        request = Request(environ)
        instance_id = request.args.get('instance_id') or request.headers.get('X-Instance-ID')
        
        if not instance_id:
            response = Response(
                json.dumps({'error': 'Instance ID is required'}),
                status=400,
                content_type='application/json'
            )
            return response(environ, start_response)
        
        # Store instance ID in environment for access in the app
        environ['instance.id'] = instance_id
        
        # Add CORS headers for iframe communication
        def custom_start_response(status, headers, exc_info=None):
            cors_headers = [
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, X-Instance-ID'),
                ('Access-Control-Allow-Credentials', 'true'),
            ]
            headers.extend(cors_headers)
            return start_response(status, headers, exc_info)
        
        return self.app(environ, custom_start_response) 