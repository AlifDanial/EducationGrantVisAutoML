import os
import uuid
import threading
import time
import socket
import logging
from contextlib import closing
import subprocess
import signal
import atexit

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('dashboard_manager')

class DashboardManager:
    """
    Manages multiple ExplainerDashboard instances for different users.
    Each dashboard runs on a unique port.
    """
    def __init__(self):
        self.dashboards = {}  # Maps session_id to dashboard info
        self.port_range = (8051, 8099)  # Range of ports to use for dashboards
        self.lock = threading.Lock()
        # Register cleanup on exit
        atexit.register(self.cleanup_all_dashboards)
    
    def find_free_port(self):
        """Find a free port in the specified range."""
        with self.lock:
            for port in range(self.port_range[0], self.port_range[1] + 1):
                with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
                    if sock.connect_ex(('localhost', port)) != 0:
                        return port
            raise RuntimeError("No free ports available in the specified range")
    
    def start_dashboard(self, model_id, user_id=None):
        """
        Start a new dashboard for the given model and user.
        Returns a session ID and port that can be used to access the dashboard.
        """
        if user_id is None:
            user_id = str(uuid.uuid4())
        
        session_id = f"{user_id}_{model_id}_{uuid.uuid4().hex[:8]}"
        
        # Find a free port
        port = self.find_free_port()
        
        # Start the dashboard process
        cmd = f'explainerdashboard run {model_id}.yaml --port {port} --no-browser'
        
        try:
            process = subprocess.Popen(
                cmd, 
                shell=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait a bit to ensure the dashboard starts
            time.sleep(2)
            
            # Check if process is still running
            if process.poll() is not None:
                stdout, stderr = process.communicate()
                logger.error(f"Dashboard process failed to start: {stderr}")
                return None, None
            
            # Store dashboard info
            with self.lock:
                self.dashboards[session_id] = {
                    'model_id': model_id,
                    'user_id': user_id,
                    'port': port,
                    'process': process,
                    'created_at': time.time()
                }
            
            logger.info(f"Started dashboard for model {model_id} on port {port} with session {session_id}")
            return session_id, port
            
        except Exception as e:
            logger.error(f"Error starting dashboard: {str(e)}")
            return None, None
    
    def get_dashboard(self, session_id):
        """Get dashboard info for a session."""
        with self.lock:
            return self.dashboards.get(session_id)
    
    def get_dashboard_by_user_model(self, user_id, model_id):
        """Find a dashboard for a specific user and model."""
        with self.lock:
            for session_id, info in self.dashboards.items():
                if info['user_id'] == user_id and info['model_id'] == model_id:
                    return session_id, info
        return None, None
    
    def stop_dashboard(self, session_id):
        """Stop a dashboard session."""
        with self.lock:
            if session_id in self.dashboards:
                info = self.dashboards[session_id]
                process = info['process']
                
                try:
                    # Try to terminate gracefully first
                    process.terminate()
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # If it doesn't terminate in time, kill it
                    process.kill()
                
                del self.dashboards[session_id]
                logger.info(f"Stopped dashboard session {session_id}")
                return True
        return False
    
    def cleanup_old_dashboards(self, max_age_seconds=3600):
        """Clean up dashboards that haven't been used for a while."""
        current_time = time.time()
        sessions_to_stop = []
        
        with self.lock:
            for session_id, info in self.dashboards.items():
                if current_time - info['created_at'] > max_age_seconds:
                    sessions_to_stop.append(session_id)
        
        for session_id in sessions_to_stop:
            self.stop_dashboard(session_id)
    
    def cleanup_all_dashboards(self):
        """Stop all running dashboards."""
        sessions_to_stop = []
        
        with self.lock:
            sessions_to_stop = list(self.dashboards.keys())
        
        for session_id in sessions_to_stop:
            self.stop_dashboard(session_id)

# Create a global instance of the dashboard manager
dashboard_manager = DashboardManager()

# Start a background thread to periodically clean up old dashboards
def cleanup_thread():
    while True:
        time.sleep(600)  # Check every 10 minutes
        dashboard_manager.cleanup_old_dashboards()

cleanup_thread = threading.Thread(target=cleanup_thread, daemon=True)
cleanup_thread.start() 