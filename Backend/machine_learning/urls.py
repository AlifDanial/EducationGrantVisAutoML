from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from . import views
from django.views.static import serve
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.views.generic import TemplateView
from django.views.static import serve
import os

urlpatterns = [
    path("", views.index),
    path("home/", views.index),  # {{ edit_1 }} Added path for /home
    path("api/", views.ModelViewSet.as_view({"get": "list", "post": "create"})),
    path("api/flask/", views.FlaskModelViewSet.as_view({"post": "create"})),
    path("api/table/", views.FlaskModelViewSet.as_view({"get": "list"})),
    path("api/<pk>/", views.ModelViewSet.as_view({"delete": "destroy"})),
    path("api/description/<pk>/",
         views.ModelDescriptionViewSet.as_view({"patch": "update"})),
    path('', TemplateView.as_view(template_name='index.html')),
    path("api/dashboard/<pk>/", views.ModelViewSet.as_view({"post":"open"}))
    
]

urlpatterns += [
    path('img/<path:path>', serve, {'document_root': os.path.join(settings.BASE_DIR, 'machine_learning/static/img')}),
]

# Serve static files from the default STATIC_URL
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve media files if you have any
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)