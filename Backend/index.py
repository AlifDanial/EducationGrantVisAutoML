from http.server import BaseHTTPRequestHandler
import json
from vercel import handle_request

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Create a request object similar to what Vercel expects
        request = {
            'path': self.path,
            'method': 'GET',
            'headers': dict(self.headers)
        }
        
        # Use our handler function
        response = handle_request(request)
        
        # Send the response
        self.send_response(response.get('statusCode', 200))
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(response.get('body', '{}').encode())

# For local development and testing
if __name__ == '__main__':
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8000), handler)
    print('Starting server at http://localhost:8000')
    server.serve_forever() 