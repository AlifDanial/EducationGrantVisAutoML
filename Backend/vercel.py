import os
import json
from urllib.parse import urlparse, parse_qs

def handle_request(request):
    """
    Simple function to handle requests in Vercel environment
    """
    path = request.get('path', '/')
    
    # Basic routing
    if path == '/':
        return {
            'statusCode': 200,
            'body': json.dumps({
                'status': 'ok',
                'message': 'VisAutoML API is running on Vercel'
            })
        }
    elif path == '/health':
        return {
            'statusCode': 200,
            'body': json.dumps({
                'status': 'ok',
                'message': 'Health check passed',
                'environment': 'vercel'
            })
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({
                'status': 'error',
                'message': f'Path {path} not found'
            })
        } 