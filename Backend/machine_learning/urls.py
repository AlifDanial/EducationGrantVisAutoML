from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
from . import views
from .proxy_view import proxy_to_dash, start_dashboard_session, stop_dashboard_session
import os

urlpatterns = [
    path("", views.index),
    path("home/", views.index),
    path("api/", views.ModelViewSet.as_view({"get": "list", "post": "create"})),
    path("api/flask/", views.FlaskModelViewSet.as_view({"post": "create"})),
    path("api/table/", views.FlaskModelViewSet.as_view({"get": "list"})),
    path("api/<pk>/", views.ModelViewSet.as_view({"delete": "destroy"})),
    path("api/description/<pk>/",
         views.ModelDescriptionViewSet.as_view({"patch": "update"})),
    path("api/dashboard/<pk>/", views.ModelViewSet.as_view({"post":"open"})),
    path("test-media/", TemplateView.as_view(template_name='machine_learning/test_media.html')),
    
    # Dashboard session management
    path("api/dashboard/session/start/<model_id>/", start_dashboard_session, name="start_dashboard_session"),
    path("api/dashboard/session/stop/", stop_dashboard_session, name="stop_dashboard_session"),
    path("api/dashboard/session/stop/<session_id>/", stop_dashboard_session, name="stop_dashboard_session_with_id"),
    
    # Proxy to Dash app with session ID
    path("viz/<session_id>/", proxy_to_dash, name="proxy_to_dash_with_session"),
    path("viz/<session_id>/<path:path>", proxy_to_dash, name="proxy_to_dash_with_session_and_path"),
    
    # Legacy proxy routes (will use session from request)
    path("viz/", proxy_to_dash, name="proxy_to_dash"),
    path("viz/<path:path>", proxy_to_dash, name="proxy_to_dash_with_path"),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)