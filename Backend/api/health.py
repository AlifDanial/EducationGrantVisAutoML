from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_data = {
            "status": "ok",
            "message": "VisAutoML health check passed",
            "environment": "vercel"
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 