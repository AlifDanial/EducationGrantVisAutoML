import os
import sys
import subprocess

# Install minimal requirements for production
try:
    subprocess.check_call(["pip", "install", "-r", "requirements-prod.txt"])
except Exception as e:
    print(f"Error installing requirements: {e}")

# Add the current directory to the path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

# Set environment variable to indicate we're running on Vercel
os.environ['VERCEL'] = '1'

# Set up the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VisAutoML.settings')

# Import the Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# This is used by Vercel
app = application 