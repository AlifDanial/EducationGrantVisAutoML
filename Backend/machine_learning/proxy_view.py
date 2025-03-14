import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urljoin
import logging
from .dashboard_manager import dashboard_manager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('proxy_view')

@csrf_exempt
def proxy_to_dash(request, session_id=None, path=''):
    """
    Proxy view that forwards requests to the appropriate Dash app instance
    based on the session ID.
    """
    # Get the dashboard info from the session ID
    if not session_id:
        # If no session ID is provided, check if it's in the session
        session_id = request.session.get('dashboard_session_id')
        if not session_id:
            return JsonResponse({'error': 'No dashboard session specified'}, status=400)
    
    # Get dashboard info
    dashboard_info = dashboard_manager.get_dashboard(session_id)
    if not dashboard_info:
        return JsonResponse({'error': 'Dashboard session not found or expired'}, status=404)
    
    # Get the port for this dashboard
    port = dashboard_info['port']
    
    # Target URL (Dash app on the specific port)
    target_url = f'http://localhost:{port}/{path}'
    
    # Get the request method
    method = request.method.lower()
    
    # Get request headers
    headers = {key: value for key, value in request.headers.items()
               if key.lower() not in ['host', 'content-length']}
    
    # Get request body for POST, PUT, etc.
    data = request.body if method in ['post', 'put', 'patch'] else None
    
    # Get query parameters
    params = request.GET.dict()
    
    # Make the request to the target URL
    try:
        if method == 'get':
            response = requests.get(target_url, headers=headers, params=params, stream=True)
        elif method == 'post':
            response = requests.post(target_url, headers=headers, params=params, data=data, stream=True)
        elif method == 'put':
            response = requests.put(target_url, headers=headers, params=params, data=data, stream=True)
        elif method == 'delete':
            response = requests.delete(target_url, headers=headers, params=params, stream=True)
        else:
            return HttpResponse(f"Unsupported method: {method}", status=405)
        
        # Create response
        django_response = HttpResponse(
            content=response.content,
            status=response.status_code,
        )
        
        # Add response headers
        for key, value in response.headers.items():
            if key.lower() not in ['content-encoding', 'transfer-encoding', 'content-length']:
                django_response[key] = value
                
        return django_response
    except requests.RequestException as e:
        logger.error(f"Error proxying to Dash app: {str(e)}")
        return HttpResponse(f"Error proxying to Dash app: {str(e)}", status=500)

@csrf_exempt
def start_dashboard_session(request, model_id):
    """
    Start a new dashboard session for the given model.
    Returns a session ID that can be used to access the dashboard.
    """
    # Get user ID from session or create a new one
    user_id = request.session.get('user_id')
    if not user_id:
        user_id = request.session['user_id'] = f"user_{request.session.session_key}"
    
    # Check if there's already a dashboard for this user and model
    session_id, info = dashboard_manager.get_dashboard_by_user_model(user_id, model_id)
    
    if session_id:
        # Dashboard already exists, return the session ID
        request.session['dashboard_session_id'] = session_id
        return JsonResponse({
            'session_id': session_id,
            'port': info['port'],
            'status': 'existing'
        })
    
    # Start a new dashboard
    session_id, port = dashboard_manager.start_dashboard(model_id, user_id)
    
    if not session_id:
        return JsonResponse({'error': 'Failed to start dashboard'}, status=500)
    
    # Store the session ID in the user's session
    request.session['dashboard_session_id'] = session_id
    
    return JsonResponse({
        'session_id': session_id,
        'port': port,
        'status': 'new'
    })

@csrf_exempt
def stop_dashboard_session(request, session_id=None):
    """
    Stop a dashboard session.
    """
    if not session_id:
        session_id = request.session.get('dashboard_session_id')
        if not session_id:
            return JsonResponse({'error': 'No dashboard session specified'}, status=400)
    
    success = dashboard_manager.stop_dashboard(session_id)
    
    if success:
        # Remove the session ID from the user's session
        if request.session.get('dashboard_session_id') == session_id:
            del request.session['dashboard_session_id']
        
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'error': 'Failed to stop dashboard or session not found'}, status=404) 