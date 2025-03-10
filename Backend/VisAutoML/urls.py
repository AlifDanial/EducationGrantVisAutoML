from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import JsonResponse
import os

# Check if we're running on Vercel
IS_VERCEL = os.environ.get('VERCEL')

# Define URL patterns
urlpatterns = [
    # Serve media files directly
    re_path(r'^static/media/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'build', 'static', 'media')
    }),
    # Serve static files directly
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'build', 'static')
    }),
    path('admin/', admin.site.urls),
]

# Add a simple health check endpoint for Vercel
def health_check(request):
    return JsonResponse({"status": "ok", "environment": "vercel" if IS_VERCEL else "development"})

urlpatterns.append(path('health/', health_check))

# Only include machine_learning app if not on Vercel
if not IS_VERCEL:
    urlpatterns.append(path("", include("machine_learning.urls")))
else:
    # Add a placeholder for the root URL when on Vercel
    def vercel_placeholder(request):
        return JsonResponse({
            "status": "ok", 
            "message": "VisAutoML API is running on Vercel. Machine learning features are disabled in this environment."
        })
    urlpatterns.append(path("", vercel_placeholder))

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
