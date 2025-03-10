"""
WSGI config for VisAutoML project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Check if running on Heroku
if 'DYNO' in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VisAutoML.settings_heroku')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VisAutoML.settings')

application = get_wsgi_application()
